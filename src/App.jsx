import { useState, useEffect, useRef, useCallback } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import MessageList from './components/MessageList'
import InputArea from './components/InputArea'
import SettingsModal from './components/SettingsModal'
import HelpModal from './components/HelpModal'

function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  
  // Theme state management
  const [themeMode, setThemeMode] = useState('system')
  const [systemIsDark, setSystemIsDark] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )
  
  const isDarkMode = themeMode === 'system' ? systemIsDark : themeMode === 'dark'
  const inputRef = useRef(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => setSystemIsDark(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  const toggleTheme = () => {
    setThemeMode(prev => {
      const currentIsDark = prev === 'system' ? systemIsDark : prev === 'dark'
      return currentIsDark ? 'light' : 'dark'
    })
  }

  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [fontSize, setFontSize] = useState('normal')
  const [reducedMotion, setReducedMotion] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [colorBlindMode, setColorBlindMode] = useState('none')

  const handleSend = async (files = []) => {
    if (!input.trim() && files.length === 0) return
    
    const userMessage = { type: 'user', content: input, files: files }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)
    
    // Simular resposta da IA
    setTimeout(() => {
      const aiResponse = {
        type: 'ai',
        content: 'Olá! Sou o PsyMind.AI e estou aqui para te ajudar a compreender suas emoções e comportamentos. Como posso te apoiar hoje?'
      }
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleNewChat = useCallback(() => {
    setMessages([])
    setInput('')
    inputRef.current?.focus()
  }, [])

  const handleLoadChat = (chat) => {
    setMessages([
      { type: 'user', content: chat.title },
      { type: 'ai', content: `Entendo que você queira falar sobre **${chat.title}**. ${chat.preview} Como posso ajudar mais especificamente?` }
    ])
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false)
    }
  }

  const handleClearHistory = () => {
    setMessages([])
    setIsSettingsOpen(false)
  }

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
        onLoadChat={handleLoadChat}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      <div className="main-content">
        <Header 
          isSidebarOpen={isSidebarOpen} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
        />

        <MessageList 
          messages={messages} 
          isTyping={isTyping} 
          onSuggestionClick={setInput}
        />

        <InputArea 
          input={input} 
          setInput={setInput} 
          onSend={handleSend} 
          isTyping={isTyping}
          inputRef={inputRef}
        />
      </div>

            <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        themeMode={themeMode}
        setThemeMode={setThemeMode}
        fontSize={fontSize}
        setFontSize={setFontSize}
        reducedMotion={reducedMotion}
        setReducedMotion={setReducedMotion}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        colorBlindMode={colorBlindMode}
        setColorBlindMode={setColorBlindMode}
        onClearHistory={() => setMessages([])}
      />

      <HelpModal 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)} 
      />
    </div>
  )
}

export default App
