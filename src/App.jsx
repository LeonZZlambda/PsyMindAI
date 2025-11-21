import { useState, useEffect, useRef, useCallback, Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import ChatPage from './pages/ChatPage'
import { useTheme } from './context/ThemeContext'
import { useChat } from './context/ChatContext'

// Lazy load modals to improve initial load performance
const SettingsModal = lazy(() => import('./components/SettingsModal'))
const HelpModal = lazy(() => import('./components/HelpModal'))

function App() {
  const { isDarkMode, fontSize, reducedMotion, highContrast, colorBlindMode } = useTheme()
  const { clearHistory, setInput } = useChat()
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  
  const inputRef = useRef(null)

  const handleNewChat = useCallback(() => {
    clearHistory()
    setInput('')
    inputRef.current?.focus()
  }, [clearHistory, setInput])

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
    <div className={`app ${isDarkMode ? 'dark' : ''} ${fontSize === 'large' ? 'font-large' : ''} ${reducedMotion ? 'reduced-motion' : ''} ${highContrast ? 'high-contrast' : ''} color-blind-${colorBlindMode}`}>
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        onNewChat={handleNewChat}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      <div className="main-content">
        <Header 
          isSidebarOpen={isSidebarOpen} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <Routes>
          <Route path="/" element={<ChatPage inputRef={inputRef} />} />
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
  )
}

export default App
