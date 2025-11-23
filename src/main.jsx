import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext'
import { ChatProvider } from './context/ChatContext'
import { PomodoroProvider } from './context/PomodoroContext'
import { SoundProvider } from './context/SoundContext'
import { MoodProvider } from './context/MoodContext'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ChatProvider>
          <PomodoroProvider>
            <SoundProvider>
              <MoodProvider>
                <App />
              </MoodProvider>
            </SoundProvider>
          </PomodoroProvider>
        </ChatProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
