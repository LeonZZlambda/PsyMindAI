import { useState } from 'react'
import './App.css'

function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return
    
    const userMessage = { type: 'user', content: input }
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

  return (
    <div className={`app ${isDarkMode ? 'dark' : ''}`}>
      <header className="header">
        <div className="logo">
          <div className="logo-icon">🧠</div>
          <h1>PsyMind.AI</h1>
        </div>
        <div className="header-actions">
          <button className="header-btn" onClick={() => setIsDarkMode(!isDarkMode)}>
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <main className="chat-container">
        {messages.length === 0 ? (
          <div className="welcome">
            <div className="welcome-icon">🧠</div>
            <h2>Olá, sou o PsyMind.AI</h2>
            <p>Estou aqui para te ajudar a compreender suas emoções e comportamentos de forma empática e científica.</p>
            <div className="suggestions">
              <button className="suggestion" onClick={() => setInput('Estou me sentindo ansioso com as provas')}>
                <strong>💭 Ansiedade com provas</strong><br />
                <span>Como lidar com a ansiedade antes dos exames</span>
              </button>
              <button className="suggestion" onClick={() => setInput('Tenho dificuldade para me concentrar')}>
                <strong>🎯 Falta de concentração</strong><br />
                <span>Estratégias para melhorar o foco nos estudos</span>
              </button>
              <button className="suggestion" onClick={() => setInput('Como posso melhorar minha autoestima?')}>
                <strong>✨ Autoestima</strong><br />
                <span>Dicas para fortalecer a confiança em si mesmo</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.type}`}>
                <div className="message-avatar">
                  {message.type === 'user' ? '👤' : '🧠'}
                </div>
                <div className="message-content">
                  {message.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="message ai">
                <div className="message-avatar">🧠</div>
                <div className="message-content typing">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="input-area">
        <div className="input-container">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder="Compartilhe seus sentimentos ou dúvidas..."
            className="message-input"
            rows={1}
          />
          <button onClick={handleSend} className="send-button" disabled={!input.trim()}>
            ➤
          </button>
        </div>
        <p className="disclaimer">
          ⚠️ O PsyMind.AI oferece apoio educativo. Para questões sérias, procure ajuda profissional.
        </p>
      </footer>
    </div>
  )
}

export default App
