import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initSecurityPolicies } from './security'

// Initialize Trusted Types as soon as possible to mitigate DOM-based XSS
initSecurityPolicies();

import './i18n/config'
import './index.css'
import './styles/material-icons.css'
import App from './App'
import { ThemeProvider } from './context/ThemeContext'
import { ChatProvider } from './context/ChatContext'
import { PomodoroProvider } from './context/PomodoroContext'
import { SoundProvider } from './context/SoundContext'
import { MoodProvider } from './context/MoodContext'
import { EmotionalJournalProvider } from './context/EmotionalJournalContext'
import { ModalProvider } from './context/ModalContext'
import { BrowserRouter } from 'react-router-dom'
import { protectMaterialIcons } from './utils/protectMaterialIcons'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element not found')

// Protect Material Icons from translation
protectMaterialIcons();

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <ModalProvider>
        <ThemeProvider>
          <ChatProvider>
            <PomodoroProvider>
              <SoundProvider>
                <MoodProvider>
                  <EmotionalJournalProvider>
                    <App />
                  </EmotionalJournalProvider>
                </MoodProvider>
              </SoundProvider>
            </PomodoroProvider>
          </ChatProvider>
        </ThemeProvider>
      </ModalProvider>
    </BrowserRouter>
  </StrictMode>,
)

export {}
