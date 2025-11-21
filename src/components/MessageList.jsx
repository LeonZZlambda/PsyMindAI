import React, { useRef, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useChat } from '../context/ChatContext';

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Texto copiado para a área de transferência');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      className="action-btn" 
      onClick={handleCopy}
      title={copied ? "Copiado!" : "Copiar texto"}
      aria-label="Copiar texto"
    >
      <span className="material-symbols-outlined">
        {copied ? 'check' : 'content_copy'}
      </span>
    </button>
  );
};

const MessageList = () => {
  const { messages, isTyping, setInput } = useChat();
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => {
    chatContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop } = chatContainerRef.current;
      setShowScrollTop(scrollTop > 300);
    }
  };

  const speakMessage = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any current speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      window.speechSynthesis.speak(utterance);
    } else {
      toast.error('Seu navegador não suporta síntese de voz');
    }
  };

  return (
    <main 
      className="chat-container" 
      ref={chatContainerRef} 
      onScroll={handleScroll}
    > 
      {messages.length === 0 ? (
        <motion.div 
          className="welcome"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="welcome-icon">
            <span className="material-symbols-outlined">psychology</span>
          </div>
          <h2>
            <span>Olá, sou o PsyMind.AI</span>
          </h2>
          <p>Como posso ajudar você hoje?</p>
          <div className="suggestions" role="group" aria-label="Sugestões de perguntas">
            <button 
              className="suggestion" 
              onClick={() => setInput('Estou me sentindo ansioso com as provas')}
              aria-label="Sugestão: Estou me sentindo ansioso com as provas"
            >
              <strong><span className="material-symbols-outlined" aria-hidden="true">psychology_alt</span> Ansiedade com provas</strong><br />
              <span>Como lidar com a ansiedade antes dos exames</span>
            </button>
            <button 
              className="suggestion" 
              onClick={() => setInput('Tenho dificuldade para me concentrar')}
              aria-label="Sugestão: Tenho dificuldade para me concentrar"
            >
              <strong><span className="material-symbols-outlined" aria-hidden="true">center_focus_strong</span> Falta de concentração</strong><br />
              <span>Estratégias para melhorar o foco nos estudos</span>
            </button>
            <button 
              className="suggestion" 
              onClick={() => setInput('Como posso melhorar minha autoestima?')}
              aria-label="Sugestão: Como posso melhorar minha autoestima?"
            >
              <strong><span className="material-symbols-outlined" aria-hidden="true">auto_awesome</span> Autoestima</strong><br />
              <span>Dicas para fortalecer a confiança em si mesmo</span>
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="messages">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div 
                key={index} 
                className={`message ${message.type}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="message-avatar">
                  <span className="material-symbols-outlined">
                    {message.type === 'user' ? 'person' : 'psychology'}
                  </span>
                </div>
                <div className="message-content-wrapper">
                  <div className="message-content">
                    {message.files && message.files.length > 0 && (
                      <div className="message-files">
                        {message.files.map((file, i) => (
                          <div key={i} className="message-file-item">
                            {file.type && file.type.startsWith('image/') && (file instanceof Blob || file instanceof File) ? (
                              <img src={URL.createObjectURL(file)} alt={file.name} className="message-file-image" />
                            ) : (
                              <div className="message-file-generic">
                                <span className="material-symbols-outlined">description</span>
                                <span>{file.name || 'Arquivo'}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                  <div className="message-actions">
                    <button 
                      className="action-btn" 
                      onClick={() => speakMessage(message.content)}
                      title="Ouvir mensagem"
                      aria-label="Ouvir mensagem"
                    >
                      <span className="material-symbols-outlined">volume_up</span>
                    </button>
                    <CopyButton text={message.content} />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
            <motion.div 
              className="message ai"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="message-avatar">
                <span className="material-symbols-outlined">psychology</span>
              </div>
              <div className="message-content typing">
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
      
      {showScrollTop && (
        <button 
          className={`scroll-top-btn ${showScrollTop ? 'visible' : ''}`}
          onClick={scrollToTop}
          aria-label="Voltar ao topo"
        >
          <span className="material-symbols-outlined">arrow_upward</span>
        </button>
      )}
    </main>
  );
};

export default MessageList;
