import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initSecurityPolicies } from './security'

// Initialize Trusted Types as soon as possible to mitigate DOM-based XSS
initSecurityPolicies();

import './i18n/config'
import './index.css'
import './styles/variables.css'
import './styles/components.css'
import './styles/standardization.css'
import './styles/material-icons.css'
import App from './App'
import { ThemeProvider } from './context/ThemeContext'
import { ChatProvider } from './context/ChatContext'
import { PomodoroProvider } from './context/PomodoroContext'
import { SoundProvider } from './context/SoundContext'
import { MoodProvider } from './context/MoodContext'
import { EmotionalJournalProvider } from './context/EmotionalJournalContext'
import { ModalProvider } from './context/ModalContext'
import { DirectionProvider } from './context/DirectionContext'
import { SnackbarProvider } from './context/SnackbarContext'
import { BrowserRouter } from 'react-router-dom'
import { protectMaterialIcons } from './utils/protectMaterialIcons'
import GlobalRipple from './components/GlobalRipple'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element not found')

// Protect Material Icons from translation
protectMaterialIcons();

createRoot(rootElement).render(
  <StrictMode>
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
                        <GlobalRipple />
                        <App />
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
  </StrictMode>,
)

export {}
