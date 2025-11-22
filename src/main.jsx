import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext'
import { ChatProvider } from './context/ChatContext'
import { PomodoroProvider } from './context/PomodoroContext'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ChatProvider>
          <PomodoroProvider>
            <App />
          </PomodoroProvider>
        </ChatProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
