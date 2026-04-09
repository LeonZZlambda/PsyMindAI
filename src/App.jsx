import { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'
import { ErrorBoundary } from 'react-error-boundary'
import { motion, MotionConfig } from 'framer-motion'
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
import './styles/emotional-journal.css'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import ErrorFallback from './components/ErrorFallback'
import TelemetryConsent from './components/TelemetryConsent'
import AppRoutes from './components/AppRoutes'
import ModalRenderer from './components/ModalRenderer'
import useKeyboardShortcuts from './components/KeyboardShortcuts'
import ChatPage from './pages/ChatPage'
import LandingPage from './pages/LandingPage'
import RoadmapPage from './pages/RoadmapPage'
import ContributePage from './pages/ContributePage'
import StyleGuidePage from './pages/StyleGuidePage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsOfUsePage from './pages/TermsOfUsePage'
import TransparencyPage from './pages/TransparencyPage'
import AnalyticsPage from './pages/AnalyticsPage'
import { useTheme } from './context/ThemeContext'
import { useChat } from './context/ChatContext'
import { useModal } from './context/ModalContext'
import { Telemetry } from './services/analytics/telemetry'


function App() {
  const { isDarkMode, fontSize, reducedMotion, highContrast, dyslexicFont, colorBlindMode, toggleTheme } = useTheme()
  const { clearHistory, setInput, isLoading, startAnonymousChat } = useChat()
  const { openModals, toggleModal } = useModal()
  const location = useLocation()
  const publicRoutes = ['/', '/roadmap', '/contribute', '/style-guide', '/privacy', '/terms', '/analytics', '/transparency']
  const isPublicPage = publicRoutes.includes(location.pathname)
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => typeof window !== 'undefined' ? window.innerWidth > 768 : true)
  const [isNewChatAnimating, setIsNewChatAnimating] = useState(false)
  const [helpInitialTab, setHelpInitialTab] = useState('faq')
  
  const inputRef = useRef(null)

  // Initial tracking
  useEffect(() => {
    Telemetry.init();
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

  const handleAnonymousChat = useCallback(() => {
    startAnonymousChat()
    setInput('')
    inputRef.current?.focus()
    setIsNewChatAnimating(true)
    setTimeout(() => setIsNewChatAnimating(false), 2000)
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false)
    }
  }, [startAnonymousChat, setInput])

  const handleChatSelect = useCallback(() => {
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false)
    }
  }, [])

  // Setup keyboard shortcuts
  useKeyboardShortcuts({
    onNewChat: handleNewChat,
    onToggleSidebar: () => setIsSidebarOpen(prev => !prev),
    onToggleTheme: toggleTheme,
    onOpenSettings: () => toggleModal('settingsModal'),
    onOpenHelp: (tab) => {
      setHelpInitialTab(tab || 'faq');
      toggleModal('helpModal');
    },
    inputRef
  })

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
      <MotionConfig reducedMotion={reducedMotion ? "always" : "user"}>
        <div className={`app ${isDarkMode ? 'dark' : ''} ${fontSize === 'large' ? 'font-large' : ''} ${reducedMotion ? 'reduced-motion' : ''} ${highContrast ? 'high-contrast' : ''} ${dyslexicFont ? 'dyslexic-font' : ''} color-blind-${colorBlindMode}`}>
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
              onAnonymousChat={handleAnonymousChat}
              onChatSelect={handleChatSelect}
              isNewChatAnimating={isNewChatAnimating}
              onOpenSettings={() => toggleModal('settingsModal')}
              onOpenImportContext={() => toggleModal('importContextModal')}
              onOpenHelp={(tab) => {
                setHelpInitialTab(tab || 'faq');
                toggleModal('helpModal');
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
                onOpenStudyStats={() => toggleModal('studyStatsModal')}
              />
            </>
          )}
          
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/transparency" element={<TransparencyPage />} />
            <Route path="/contribute" element={<ContributePage />} />
            <Route path="/style-guide" element={<StyleGuidePage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsOfUsePage />} />
            <Route 
              path="/chat" 
              element={
                <ChatPage 
                  inputRef={inputRef} 
                  onOpenHelp={() => {
                    setHelpInitialTab('faq');
                    toggleModal('helpModal');
                  }}
                  onOpenSupport={() => toggleModal('supportModal')}
                  onOpenReflections={() => toggleModal('reflectionsModal')}
                  onOpenMoodTracker={() => toggleModal('moodTrackerModal')}
                  onOpenEmotionalJournal={() => toggleModal('emotionalJournalModal')}
                  onOpenGuidedLearning={() => toggleModal('guidedLearningModal')}
                />
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        <Suspense fallback={null}>

        </Suspense>
        <ModalRenderer 
          openModals={openModals}
          toggleModal={toggleModal}
          helpInitialTab={helpInitialTab}
        />
        <TelemetryConsent />
        </div>
      </MotionConfig>
    </ErrorBoundary>
  )
}

export default App
