import React, { useRef, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useTranslation, Trans } from 'react-i18next';
import { useChat } from '../context/ChatContext';

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(t('chat.messages.copied'));
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      className="action-btn" 
      onClick={handleCopy}
      title={copied ? t('chat.messages.copied_short') : t('chat.messages.copy_text')}
      aria-label={t('chat.messages.copy_text')}
    >
      <span className="material-symbols-outlined">
        {copied ? 'check' : 'content_copy'}
      </span>
    </button>
  );
};

const CodeCopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(t('chat.messages.code_copied'));
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      className="code-copy-btn"
      onClick={handleCopy}
      title={copied ? t('chat.messages.copied_short') : t('chat.messages.copy_code')}
    >
      <span className="material-symbols-outlined">
        {copied ? 'check' : 'content_copy'}
      </span>
    </button>
  );
};

const ImageViewer = ({ src, alt, onClose }) => {
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();

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
        toast.success(t('chat.messages.image_copied'));
        setTimeout(() => setCopied(false), 2000);
      } catch (writeErr) {
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
        toast.success(t('chat.messages.image_copied'));
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error(t('chat.messages.copy_image_error'));
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
          <button className="viewer-btn" onClick={handleCopy} title={copied ? t('chat.messages.copied_short') : t('chat.messages.copy_image')}>
            <span className="material-symbols-outlined">
              {copied ? 'check' : 'content_copy'}
            </span>
          </button>
          <button className="viewer-btn" onClick={onClose} title={t('chat.messages.close')}>
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
  const { messages, isTyping, setInput, isAnonymous } = useChat();
  const { t, i18n } = useTranslation();
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [dailyQuote, setDailyQuote] = useState('');
  const [isLoadingQuote, setIsLoadingQuote] = useState(true);
  const [speakingId, setSpeakingId] = useState(null);

  useEffect(() => {
    const generateDailyQuote = () => {
      const quotes = [
        "O sucesso é a soma de pequenos esforços repetidos dia após dia. — Robert Collier",
        "A persistência é o caminho do êxito. — Charles Chaplin",
        "Estudar não é uma obrigação, é uma porta para o mundo. — Corinna",
        "Nossa maior fraqueza está em desistir. — Thomas Edison",
        "O conhecimento é o único tesouro que não pode ser roubado. — Autor Desconhecido",
        "Acredite que você pode e você já estará no meio do caminho. — Theodore Roosevelt",
        "Sempre parece impossível até que seja feito. — Nelson Mandela",
        "Não existe elevador para o sucesso, você precisa usar as escadas. — Autor Desconhecido",
        "O futuro pertence àqueles que acreditam na beleza de seus sonhos. — Eleanor Roosevelt",
        "Educação é a arma mais poderosa que você pode usar para mudar o mundo. — Nelson Mandela"
      ];
      
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setDailyQuote(quotes[randomIndex]);
      setIsLoadingQuote(false);
    };
    
    generateDailyQuote();
  }, []);

  const userScrolledUpRef = useRef(false);
  const isAutoScrollingRef = useRef(false);

  const scrollToBottom = () => {
    isAutoScrollingRef.current = true;
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => { isAutoScrollingRef.current = false; }, 400);
  };

  const scrollToTop = () => {
    chatContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadingPhrases = t('chat.messages.loading_phrases', { returnObjects: true });
  const [loadingPhrase, setLoadingPhrase] = useState(loadingPhrases[0]);

  useEffect(() => {
    let interval;
    if (isTyping) {
      setLoadingPhrase(loadingPhrases[Math.floor(Math.random() * loadingPhrases.length)]);
      
      interval = setInterval(() => {
        setLoadingPhrase(loadingPhrases[Math.floor(Math.random() * loadingPhrases.length)]);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isTyping, loadingPhrases]);

  useEffect(() => {
    if (!userScrolledUpRef.current) scrollToBottom();
  }, [messages, isTyping]);

  const handleScroll = () => {
    const el = chatContainerRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const atBottom = scrollHeight - scrollTop - clientHeight < 60;
    if (!isAutoScrollingRef.current) {
      userScrolledUpRef.current = !atBottom;
    }
    setShowScrollTop(scrollTop > 300);
  };

  const speakMessage = (text, id) => {
    if ('speechSynthesis' in window) {
      if (speakingId === id) {
        window.speechSynthesis.cancel();
        setSpeakingId(null);
        return;
      }
      window.speechSynthesis.cancel();
      setSpeakingId(id);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = i18n.language === 'en' ? 'en-US' : 'pt-BR';
      utterance.onend = () => {
        setSpeakingId(prev => prev === id ? null : prev);
      };
      utterance.onerror = () => {
        setSpeakingId(prev => prev === id ? null : prev);
      };
      window.speechSynthesis.speak(utterance);
    } else {
      toast.error(t('chat.messages.speech_error'));
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
            <span>{t('chat.messages.welcome_title')}</span>
          </h2>
          {!isAnonymous && (
            <>
              <div className="daily-quote-wrapper">
                {isLoadingQuote ? (
                  <div className="daily-quote-container" style={{ opacity: 0.6 }}>
                    <span className="material-symbols-outlined quote-icon" style={{ animation: 'spin 2s linear infinite' }}>autorenew</span>
                    <p className="daily-quote" style={{ color: 'var(--text-light)' }}>{t('chat.messages.generating_quote')}</p>
                  </div>
                ) : (
                  <>
                    <div className="daily-quote-container">
                      <span className="material-symbols-outlined quote-icon quote-start">format_quote</span>
                      <p className="daily-quote">{dailyQuote}</p>
                      <span className="material-symbols-outlined quote-icon quote-end">format_quote</span>
                    </div>
                    <p className="quote-date">
                      {new Date().toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).replace(/^\w/, c => c.toUpperCase())}
                    </p>
                  </>
                )}
              </div>
              <p className="welcome-subtitle">{t('chat.messages.welcome_subtitle')}</p>
            </>
          )}
          
          {isAnonymous ? (
            <div 
              className="anonymous-disclaimer" 
              style={{
                backgroundColor: 'var(--bg-color-secondary, rgba(255,255,255,0.05))',
                border: '1px solid var(--border-color, rgba(200,200,200,0.1))',
                borderRadius: '12px',
                padding: '24px',
                marginTop: '16px',
                textAlign: 'center',
                color: 'var(--text-color-secondary, #aaa)',
                maxWidth: '700px',
                margin: '16px auto 0 auto'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '2rem', color: 'var(--primary-color, #e0a3ff)' }}>visibility_off</span>
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '12px', color: 'var(--text-color, #fff)' }}>{t('chat.messages.anonymous_private_mode_title')}</h3>
              <p style={{ fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '12px' }}>
                <strong>{t('chat.messages.anonymous_desc_1')}</strong>
              </p>
              <p style={{ fontSize: '0.85rem', lineHeight: '1.5', opacity: 0.8 }}>
                {t('chat.messages.anonymous_desc_2')}
              </p>
            </div>
          ) : (
            <div className="suggestions" role="group" aria-label={t('chat.messages.suggestions_aria')}>
              <button 
                className="suggestion" 
                onClick={() => setInput(t('chat.messages.suggestions.anxiety_prompt'))}
              >
                <strong><span className="material-symbols-outlined" aria-hidden="true">psychology_alt</span> {t('chat.messages.suggestions.anxiety_title')}</strong><br />
                <span>{t('chat.messages.suggestions.anxiety_desc')}</span>
              </button>
              <button 
                className="suggestion" 
                onClick={() => setInput(t('chat.messages.suggestions.focus_prompt'))}
              >
                <strong><span className="material-symbols-outlined" aria-hidden="true">center_focus_strong</span> {t('chat.messages.suggestions.focus_title')}</strong><br />
                <span>{t('chat.messages.suggestions.focus_desc')}</span>
              </button>
              <button 
                className="suggestion" 
                onClick={() => setInput(t('chat.messages.suggestions.esteem_prompt'))}
              >
                <strong><span className="material-symbols-outlined" aria-hidden="true">auto_awesome</span> {t('chat.messages.suggestions.esteem_title')}</strong><br />
                <span>{t('chat.messages.suggestions.esteem_desc')}</span>
              </button>
              <button 
                className="suggestion" 
                onClick={() => setInput(t('chat.messages.suggestions.techniques_prompt'))}
              >
                <strong><span className="material-symbols-outlined" aria-hidden="true">school</span> {t('chat.messages.suggestions.techniques_title')}</strong><br />
                <span>{t('chat.messages.suggestions.techniques_desc')}</span>
              </button>
              <button 
                className="suggestion" 
                onClick={() => setInput(t('chat.messages.suggestions.schedule_prompt'))}
              >
                <strong><span className="material-symbols-outlined" aria-hidden="true">calendar_month</span> {t('chat.messages.suggestions.schedule_title')}</strong><br />
                <span>{t('chat.messages.suggestions.schedule_desc')}</span>
              </button>
              <button 
                className="suggestion" 
                onClick={() => setInput(t('chat.messages.suggestions.burnout_prompt'))}
              >
                <strong><span className="material-symbols-outlined" aria-hidden="true">spa</span> {t('chat.messages.suggestions.burnout_title')}</strong><br />
                <span>{t('chat.messages.suggestions.burnout_desc')}</span>
              </button>
            </div>
          )}
        </motion.div>
      ) : (
        <div className="messages">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div 
                key={index} 
                  className={`message ${message.type} ${message.isStreaming ? 'streaming' : ''} ${isAnonymous ? 'anonymous' : ''}`}
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
                                <span>{file.name || t('chat.input.file')}</span>
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
                      className={`action-btn ${speakingId === index ? 'active' : ''}`}
                      onClick={() => speakMessage(message.content, index)}
                      title={speakingId === index ? t('chat.messages.speech_stop') : t('chat.messages.speech_play')}
                      aria-label={speakingId === index ? t('chat.messages.speech_stop') : t('chat.messages.speech_play')}
                    >
                      <span className="material-symbols-outlined">
                        {speakingId === index ? 'stop_circle' : 'volume_up'}
                      </span>
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
                  <span className="gemini-loader-text">{loadingPhrase}</span>
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
            title={t('chat.messages.scroll_top')}
          >
            <span className="material-symbols-outlined">arrow_upward</span>
          </motion.button>
        )}
      </AnimatePresence>
    </main>
  );
};

export default MessageList;
