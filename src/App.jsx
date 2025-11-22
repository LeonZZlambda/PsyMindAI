import { useState, useEffect, useRef, useCallback, Suspense, lazy } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'
import { ErrorBoundary } from 'react-error-boundary'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import './styles/variables.css'
import './styles/base.css'
import './styles/animations.css'
import './styles/layout.css'
import './styles/components.css'
import './styles/sidebar.css'
import './styles/header.css'
import './styles/chat.css'
import './styles/settings.css'
import './styles/pomodoro.css'
import './styles/kindness.css'
import './styles/help.css'
import './styles/roadmap.css'
import './styles/contribute.css'
import './styles/exams.css'
import './styles/landing.css'
import './styles/accessibility.css'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import ChatPage from './pages/ChatPage'
import LandingPage from './pages/LandingPage'
import RoadmapPage from './pages/RoadmapPage'
import ContributePage from './pages/ContributePage'
import ErrorFallback from './components/ErrorFallback'
import { useTheme } from './context/ThemeContext'
import { useChat } from './context/ChatContext'

// Lazy load modals to improve initial load performance
const SettingsModal = lazy(() => import('./components/SettingsModal'))
const HelpModal = lazy(() => import('./components/HelpModal'))
const SupportModal = lazy(() => import('./components/SupportModal'))
const ReflectionsModal = lazy(() => import('./components/ReflectionsModal'))

function App() {
  const { isDarkMode, fontSize, reducedMotion, highContrast, colorBlindMode, toggleTheme } = useTheme()
  const { clearHistory, setInput, isLoading } = useChat()
  const location = useLocation()
  const publicRoutes = ['/', '/roadmap', '/contribute']
  const isPublicPage = publicRoutes.includes(location.pathname)
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [isSupportOpen, setIsSupportOpen] = useState(false)
  const [isReflectionsOpen, setIsReflectionsOpen] = useState(false)
  const [isNewChatAnimating, setIsNewChatAnimating] = useState(false)
  const [helpInitialTab, setHelpInitialTab] = useState('faq')
  
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
    setTimeout(() => setIsNewChatAnimating(false), 2000)
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

      // Toggle Sidebar: Command + B
      if (metaKey && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsSidebarOpen(prev => !prev);
      }

      // Toggle Theme: Command + Shift + L
      if (metaKey && e.shiftKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        toggleTheme();
      }

      // Settings: Command + ,
      if (metaKey && e.key === ',') {
        e.preventDefault();
        setIsSettingsOpen(true);
      }

      // Help: Command + /
      if (metaKey && e.key === '/') {
        e.preventDefault();
        setHelpInitialTab('faq');
        setIsHelpOpen(true);
      }

      // Shortcuts: Command + Shift + / (or ?)
      if (metaKey && (e.key === '?' || (e.shiftKey && e.key === '/'))) {
        e.preventDefault();
        setHelpInitialTab('shortcuts');
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
        
        {!isPublicPage && (
          <>
            <Sidebar 
              isOpen={isSidebarOpen} 
              toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
              onNewChat={handleNewChat}
              onChatSelect={handleChatSelect}
              isNewChatAnimating={isNewChatAnimating}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onOpenHelp={(tab = 'faq') => {
                setHelpInitialTab(tab);
                setIsHelpOpen(true);
              }}
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

        <div className={isPublicPage ? "landing-wrapper" : "main-content"}>
          {!isPublicPage && (
            <>
              <Header 
                isSidebarOpen={isSidebarOpen} 
                toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                isLoading={isLoading}
              />
            </>
          )}
          
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/contribute" element={<ContributePage />} />
            <Route 
              path="/chat" 
              element={
                <ChatPage 
                  inputRef={inputRef} 
                  onOpenHelp={() => {
                    setHelpInitialTab('faq');
                    setIsHelpOpen(true);
                  }}
                  onOpenSupport={() => setIsSupportOpen(true)}
                  onOpenReflections={() => setIsReflectionsOpen(true)}
                />
              } 
            />
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
              initialTab={helpInitialTab}
            />
          )}

          {isSupportOpen && (
            <SupportModal 
              isOpen={isSupportOpen} 
              onClose={() => setIsSupportOpen(false)} 
            />
          )}

          {isReflectionsOpen && (
            <ReflectionsModal 
              isOpen={isReflectionsOpen} 
              onClose={() => setIsReflectionsOpen(false)} 
            />
          )}
        </Suspense>
        </div>
      </MotionConfig>
    </ErrorBoundary>
  )
}

export default App
