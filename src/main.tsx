import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import { initSecurityPolicies } from './security'
import { initObservability } from './services/observability/init'
import i18n from './i18n/config'
import './index.css'
import './styles/variables.css'
import './styles/components.css'
import './styles/standardization.css'
import './styles/material-icons.css'
import App from './App'
import { ThemeProvider } from './context/ThemeProvider'
import { ChatProvider } from './context/ChatProvider'
import { PomodoroProvider } from './context/PomodoroProvider'
import { SoundProvider } from './context/SoundProvider'
import { MoodProvider } from './context/MoodProvider'
import { EmotionalJournalProvider } from './context/EmotionalJournalProvider'
import { ModalProvider } from './context/ModalProvider'
import { DirectionProvider } from './context/DirectionContext'
import { LearningGoalsProvider } from './context/LearningGoalsProvider'
import { SnackbarProvider } from './context/SnackbarProvider'
import { GamificationProvider } from './context/GamificationProvider'
import { BrowserRouter } from 'react-router-dom'
import { protectMaterialIcons } from './utils/protectMaterialIcons'
import GlobalRipple from '@/components/layout/GlobalRipple'

// Initialize Trusted Types as soon as possible to mitigate DOM-based XSS
initSecurityPolicies()

// Defer observability to prevent LCP/TBT delays
if ('requestIdleCallback' in window) {
  window.requestIdleCallback(() => initObservability(), { timeout: 2000 })
} else {
  setTimeout(() => initObservability(), 1000)
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element not found')

// Protect Material Icons from translation
protectMaterialIcons()

createRoot(rootElement).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <Suspense fallback={null}>
        <BrowserRouter>
          <ModalProvider>
            <DirectionProvider>
              <ThemeProvider>
                <ChatProvider>
                  <PomodoroProvider>
                    <SoundProvider>
                      <MoodProvider>
                        <EmotionalJournalProvider>
                          <SnackbarProvider>
                            <GamificationProvider>
                              <LearningGoalsProvider>
                                <GlobalRipple />
                                <App />
                              </LearningGoalsProvider>
                            </GamificationProvider>
                          </SnackbarProvider>
                        </EmotionalJournalProvider>
                      </MoodProvider>
                    </SoundProvider>
                  </PomodoroProvider>
                </ChatProvider>
              </ThemeProvider>
            </DirectionProvider>
          </ModalProvider>
        </BrowserRouter>
      </Suspense>
    </I18nextProvider>
  </StrictMode>,
)

export {}
