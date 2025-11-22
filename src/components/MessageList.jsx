import React, { useRef, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
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

const CodeCopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Código copiado!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      className="code-copy-btn"
      onClick={handleCopy}
      title={copied ? "Copiado!" : "Copiar código"}
    >
      <span className="material-symbols-outlined">
        {copied ? 'check' : 'content_copy'}
      </span>
    </button>
  );
};

const ImageViewer = ({ src, alt, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      
      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob
          })
        ]);
        setCopied(true);
        toast.success('Imagem copiada!');
        setTimeout(() => setCopied(false), 2000);
      } catch (writeErr) {
        // Fallback: Convert to PNG using Canvas (better compatibility)
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = src;
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const pngBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': pngBlob
          })
        ]);
        setCopied(true);
        toast.success('Imagem copiada!');
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Erro ao copiar imagem');
    }
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <motion.div 
      className="image-viewer-overlay"
      initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
      animate={{ opacity: 1, backdropFilter: "blur(5px)" }}
      exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
      onClick={onClose}
    >
      <div className="viewer-header">
        <div className="viewer-actions">
          <button className="viewer-btn" onClick={handleCopy} title={copied ? "Copiado!" : "Copiar imagem"}>
            <span className="material-symbols-outlined">
              {copied ? 'check' : 'content_copy'}
            </span>
          </button>
          <button className="viewer-btn" onClick={onClose} title="Fechar">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>
      <motion.img 
        src={src} 
        alt={alt} 
        className="full-screen-image"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      />
    </motion.div>
  );
};

const MessageList = () => {
  const { messages, isTyping, setInput } = useChat();
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const quotes = [
    "O sucesso é a soma de pequenos esforços repetidos dia após dia. — Robert Collier",
    "Acredite em si mesmo e em tudo o que você é. — Christian D. Larson",
    "A educação é a arma mais poderosa que você pode usar para mudar o mundo. — Nelson Mandela",
    "Não espere por oportunidades extraordinárias. Agarre ocasiões comuns e faça-as grandes. — Orison Swett Marden",
    "O único lugar onde o sucesso vem antes do trabalho é no dicionário. — Vidal Sassoon",
    "A mente que se abre a uma nova ideia jamais voltará ao seu tamanho original. — Albert Einstein"
  ];
  
  const [dailyQuote, setDailyQuote] = useState('');

  useEffect(() => {
    setDailyQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

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
          <div className="daily-quote-wrapper">
            <div className="daily-quote-container">
              <span className="material-symbols-outlined quote-icon quote-start">format_quote</span>
              <p className="daily-quote">{dailyQuote}</p>
              <span className="material-symbols-outlined quote-icon quote-end">format_quote</span>
            </div>
            <p className="quote-date">
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).replace(/^\w/, c => c.toUpperCase())}
            </p>
          </div>
          <p className="welcome-subtitle">Como posso ajudar você hoje?</p>
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
            <button 
              className="suggestion" 
              onClick={() => setInput('Quais são as melhores técnicas de estudo?')}
              aria-label="Sugestão: Quais são as melhores técnicas de estudo?"
            >
              <strong><span className="material-symbols-outlined" aria-hidden="true">school</span> Técnicas de Estudo</strong><br />
              <span>Pomodoro, Flashcards e métodos eficazes</span>
            </button>
            <button 
              className="suggestion" 
              onClick={() => setInput('Me ajude a criar um cronograma de estudos')}
              aria-label="Sugestão: Me ajude a criar um cronograma de estudos"
            >
              <strong><span className="material-symbols-outlined" aria-hidden="true">calendar_month</span> Planejamento</strong><br />
              <span>Organize sua rotina e horários de estudo</span>
            </button>
            <button 
              className="suggestion" 
              onClick={() => setInput('Como evitar o burnout nos estudos?')}
              aria-label="Sugestão: Como evitar o burnout nos estudos?"
            >
              <strong><span className="material-symbols-outlined" aria-hidden="true">spa</span> Descanso Mental</strong><br />
              <span>Importância do lazer e prevenção ao burnout</span>
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="messages">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div 
                key={index} 
                className={`message ${message.type} ${message.isStreaming ? 'streaming' : ''}`}
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
                              <img 
                                src={URL.createObjectURL(file)} 
                                alt={file.name} 
                                className="message-file-image clickable" 
                                onClick={() => setSelectedImage({ src: URL.createObjectURL(file), alt: file.name })}
                              />
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
                    <ReactMarkdown
                      components={{
                        code({node, inline, className, children, ...props}) {
                          const match = /language-(\w+)/.exec(className || '')
                          return !inline && match ? (
                            <div className="code-block-wrapper">
                              <div className="code-block-header">
                                <span>{match[1]}</span>
                                <CodeCopyButton text={String(children).replace(/\n$/, '')} />
                              </div>
                              <SyntaxHighlighter
                                style={vscDarkPlus}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                              >
                                {String(children).replace(/\n$/, '')}
                              </SyntaxHighlighter>
                            </div>
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          )
                        }
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
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
                <div className="gemini-loader-container">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className="gemini-loader-text">PsyMind está pensando...</span>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
      
      <AnimatePresence>
        {selectedImage && (
          <ImageViewer 
            src={selectedImage.src} 
            alt={selectedImage.alt} 
            onClose={() => setSelectedImage(null)} 
          />
        )}
        {showScrollTop && (
          <motion.button 
            className="scroll-top-btn"
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.9 }}
            title="Voltar ao topo"
          >
            <span className="material-symbols-outlined">arrow_upward</span>
          </motion.button>
        )}
      </AnimatePresence>
    </main>
  );
};

export default MessageList;
