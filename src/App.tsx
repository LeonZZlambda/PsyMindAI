import { useState, useEffect, useRef, useCallback, Suspense, lazy } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Toaster } from 'sonner'
import { ErrorBoundary } from 'react-error-boundary'
import { MotionConfig, LazyMotion, domAnimation } from 'framer-motion'
import './styles/variables.css'
import './styles/base.css'
import './styles/animations.css'
import './styles/layout.css'
import './styles/components.css'
import { SkeletonLandingPage, SkeletonChatPage } from './components/SkeletonScreen'
import ErrorFallback from './components/ErrorFallback'
import TelemetryConsent from './components/TelemetryConsent'
import ModalRenderer from './components/ModalRenderer'
import ScrollToTop from './components/ScrollToTop'
import useKeyboardShortcuts from './components/KeyboardShortcuts'
import { useTheme } from './context/ThemeContext'
import { useChat } from './context/ChatContext'
import { useModal } from './context/ModalContext'
import { Telemetry } from './services/analytics/telemetry'
import logger from './utils/logger'

const ChatPage = lazy(() => import('./pages/ChatPage'))
const LandingPage = lazy(() => import('./pages/LandingPage'))
const RoadmapPage = lazy(() => import('./pages/RoadmapPage'))
const ContributePage = lazy(() => import('./pages/ContributePage'))
const StyleGuidePage = lazy(() => import('./pages/StyleGuidePage'))
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'))
const TermsOfUsePage = lazy(() => import('./pages/TermsOfUsePage'))
const TransparencyPage = lazy(() => import('./pages/TransparencyPage'))
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'))
// Shell components — lazy loaded because they're only used in the app routes (not landing)
const Header = lazy(() => import('./components/Header'))
const Sidebar = lazy(() => import('./components/Sidebar'))

function App() {
  const {
    isDarkMode,
    fontSize,
    reducedMotion,
    highContrast,
    dyslexicFont,
    colorBlindMode,
    keyboardNavigation,
    toggleTheme,
  } = useTheme()
  const { clearHistory, setInput, isLoading, startAnonymousChat } = useChat()
  const { openModals, toggleModal } = useModal()
  const { i18n, t } = useTranslation()
  const location = useLocation()
  const publicRoutes = [
    '/',
    '/roadmap',
    '/contribute',
    '/style-guide',
    '/privacy',
    '/terms',
    '/analytics',
    '/transparency',
  ]
  const isPublicPage = publicRoutes.includes(location.pathname)

  const [isSidebarOpen, setIsSidebarOpen] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth > 768 : true,
  )
  const [isNewChatAnimating, setIsNewChatAnimating] = useState(false)
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false,
  )
  const [helpInitialTab, setHelpInitialTab] = useState<string>('faq')

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)

  // Track mobile state
  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth <= 768
      setIsMobile(newIsMobile)

      // Auto-close sidebar when switching to mobile
      if (newIsMobile && isSidebarOpen) {
        setIsSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isSidebarOpen])

  // Initial tracking & SEO
  useEffect(() => {
    const lang = i18n.language || 'pt-BR'
    document.documentElement.lang = lang

    // Dynamic SEO
    document.title = t('seo.title')
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', t('seo.description'))
    }

    // Dynamic Open Graph
    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) ogTitle.setAttribute('content', t('seo.og_title'))

    const ogDesc = document.querySelector('meta[property="og:description"]')
    if (ogDesc) ogDesc.setAttribute('content', t('seo.og_description'))
  }, [i18n.language, t])

  useEffect(() => {
    try {
      if (Telemetry && typeof Telemetry.isOptedIn === 'function' && Telemetry.isOptedIn()) {
        Telemetry.init()
      }
    } catch (e) {
      logger.warn('Telemetry init check failed', e)
    }

    return () => {
      try {
        if (Telemetry && typeof Telemetry.cleanup === 'function') {
          Telemetry.cleanup()
        }
      } catch (e) {
        // ignore
      }
    }
  }, [])

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
    onToggleSidebar: () => setIsSidebarOpen((prev) => !prev),
    onToggleTheme: toggleTheme,
    onOpenSettings: () => toggleModal('settings'),
    onOpenHelp: (tab?: string) => {
      setHelpInitialTab(tab || 'faq')
      toggleModal('help')
    },
    inputRef,
  })

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
      <LazyMotion features={domAnimation}>
        <MotionConfig
          reducedMotion={import.meta.env.DEV ? 'never' : reducedMotion ? 'always' : 'user'}
        >
          <div
            className={`app ${isDarkMode ? 'dark' : ''} ${fontSize === 'large' ? 'font-large' : ''} ${reducedMotion ? 'reduced-motion' : ''} ${highContrast ? 'high-contrast' : ''} ${dyslexicFont ? 'dyslexic-font' : ''} color-blind-${colorBlindMode} ${keyboardNavigation ? 'keyboard-nav' : ''}`}
          >
            <Toaster
              position="bottom-center"
              toastOptions={{
                style: {
                  background: isDarkMode ? '#202124' : '#e8eaed',
                  color: isDarkMode ? '#e8eaed' : '#202124',
                  border: 'none',
                  borderRadius: '4px',
                  fontFamily: "'Outfit', 'Inter', Roboto, sans-serif",
                  fontSize: '14px',
                  padding: '14px 24px',
                  gap: '12px',
                  boxShadow:
                    '0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12)',
                },
              }}
            />
            <ScrollToTop />

            {!isPublicPage && (
              <>
                <Sidebar
                  isOpen={isSidebarOpen}
                  toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                  onNewChat={handleNewChat}
                  onAnonymousChat={handleAnonymousChat}
                  onChatSelect={handleChatSelect}
                  isNewChatAnimating={isNewChatAnimating}
                  onOpenSettings={() => toggleModal('settings')}
                  onOpenHelp={(tab?: string) => {
                    setHelpInitialTab(tab || 'faq')
                    toggleModal('help')
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

            <div
              className={isPublicPage ? 'landing-wrapper' : 'main-content'}
              {...(Object.values(openModals).some(Boolean) ||
              (!isPublicPage && isSidebarOpen && isMobile)
                ? { inert: true }
                : {})}
            >
              {!isPublicPage && (
                <>
                  <Header
                    isSidebarOpen={isSidebarOpen}
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    isLoading={isLoading}
                    onOpenStudyStats={() => toggleModal('studyStats')}
                  />
                </>
              )}

              <Suspense fallback={isPublicPage ? <SkeletonLandingPage /> : <SkeletonChatPage />}>
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
                          setHelpInitialTab('faq')
                          toggleModal('help')
                        }}
                        onOpenSupport={() => toggleModal('support')}
                        onOpenReflections={() => toggleModal('reflections')}
                        onOpenMoodTracker={() => toggleModal('moodTracker')}
                        onOpenEmotionalJournal={() => toggleModal('emotionalJournal')}
                        onOpenGuidedLearning={() => toggleModal('guidedLearning')}
                      />
                    }
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </div>

            <ModalRenderer
              openModals={openModals}
              toggleModal={toggleModal}
              helpInitialTab={helpInitialTab}
            />
            <TelemetryConsent />
          </div>
        </MotionConfig>
      </LazyMotion>
    </ErrorBoundary>
  )
}

export default App
