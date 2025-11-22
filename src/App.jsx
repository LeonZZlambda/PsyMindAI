import { useState, useEffect, useRef, useCallback, Suspense, lazy } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'
import { ErrorBoundary } from 'react-error-boundary'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import './App.css'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import ChatPage from './pages/ChatPage'
import LandingPage from './pages/LandingPage'
import ErrorFallback from './components/ErrorFallback'
import { useTheme } from './context/ThemeContext'
import { useChat } from './context/ChatContext'

// Lazy load modals to improve initial load performance
const SettingsModal = lazy(() => import('./components/SettingsModal'))
const HelpModal = lazy(() => import('./components/HelpModal'))

function App() {
  const { isDarkMode, fontSize, reducedMotion, highContrast, colorBlindMode } = useTheme()
  const { clearHistory, setInput, isLoading } = useChat()
  const location = useLocation()
  const isLanding = location.pathname === '/'
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [isNewChatAnimating, setIsNewChatAnimating] = useState(false)
  
  const inputRef = useRef(null)

  // Handle initial sidebar state for mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Set initial state
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }

    // Optional: Listen for resize events if we want dynamic behavior
    // window.addEventListener('resize', handleResize);
    // return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNewChat = useCallback(() => {
    clearHistory()
    setInput('')
    inputRef.current?.focus()
    setIsNewChatAnimating(true)
    setTimeout(() => setIsNewChatAnimating(false), 200)
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false)
    }
  }, [clearHistory, setInput])

  const handleChatSelect = useCallback(() => {
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false)
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const metaKey = isMac ? e.metaKey : e.ctrlKey;

      // New Chat: Shift + Command + O
      if (metaKey && e.shiftKey && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        handleNewChat();
      }

      // Settings: Command + ,
      if (metaKey && e.key === ',') {
        e.preventDefault();
        setIsSettingsOpen(true);
      }

      // Help: Command + /
      if (metaKey && e.key === '/') {
        e.preventDefault();
        setIsHelpOpen(true);
      }

      // Focus Input: /
      if (e.key === '/' && !metaKey && !e.ctrlKey && !e.altKey && 
          document.activeElement.tagName !== 'INPUT' && 
          document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNewChat]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
      <MotionConfig reducedMotion={reducedMotion ? "always" : "user"}>
        <div className={`app ${isDarkMode ? 'dark' : ''} ${fontSize === 'large' ? 'font-large' : ''} ${reducedMotion ? 'reduced-motion' : ''} ${highContrast ? 'high-contrast' : ''} color-blind-${colorBlindMode}`}>
          <Toaster 
          position="bottom-center" 
          toastOptions={{
            style: {
              background: isDarkMode ? '#e8eaed' : '#202124',
              color: isDarkMode ? '#202124' : '#e8eaed',
              border: 'none',
              borderRadius: '4px',
              fontFamily: "'Google Sans', Roboto, sans-serif",
              fontSize: '14px',
              padding: '14px 24px',
              gap: '12px',
              boxShadow: '0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12)'
            },
          }}
        />
        
        {!isLanding && (
          <>
            <Sidebar 
              isOpen={isSidebarOpen} 
              toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
              onNewChat={handleNewChat}
              onChatSelect={handleChatSelect}
              isNewChatAnimating={isNewChatAnimating}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onOpenHelp={() => setIsHelpOpen(true)}
            />
            {isSidebarOpen && (
              <div 
                className="sidebar-overlay" 
                onClick={() => setIsSidebarOpen(false)}
                role="presentation"
                aria-hidden="true"
              />
            )}
          </>
        )}

        <div className={isLanding ? "landing-wrapper" : "main-content"}>
          {!isLanding && (
            <>
              <Header 
                isSidebarOpen={isSidebarOpen} 
                toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
              />
              <AnimatePresence>
                {isLoading && (
                  <motion.div 
                    className="header-loader-bar"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                )}
              </AnimatePresence>
            </>
          )}
          
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/chat" element={<ChatPage inputRef={inputRef} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        <Suspense fallback={null}>
          {isSettingsOpen && (
            <SettingsModal 
              isOpen={isSettingsOpen} 
              onClose={() => setIsSettingsOpen(false)}
            />
          )}

          {isHelpOpen && (
            <HelpModal 
              isOpen={isHelpOpen} 
              onClose={() => setIsHelpOpen(false)} 
            />
          )}
        </Suspense>
        </div>
      </MotionConfig>
    </ErrorBoundary>
  )
}

export default App
