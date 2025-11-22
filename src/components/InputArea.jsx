import React, { useState, useEffect, useRef } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../context/ChatContext';
import PomodoroModal from './PomodoroModal';
import KindnessModal from './KindnessModal';
import ExamsModal from './ExamsModal';

const InputArea = ({ inputRef, onOpenHelp, onOpenSupport }) => {
  const navigate = useNavigate();
  const { input, setInput, sendMessage, isTyping } = useChat();
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [showPomodoro, setShowPomodoro] = useState(false);
  const [showKindness, setShowKindness] = useState(false);
  const [showExamsModal, setShowExamsModal] = useState(false);
  const [pomodoroStatus, setPomodoroStatus] = useState({ isActive: false, mode: 'focus' });
  const fileInputRef = useRef(null);
  const toolsMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(event.target)) {
        setShowToolsMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const tools = [
    { id: 'pomodoro', icon: 'timer', label: 'Pomodoro' },
    { id: 'emocional', icon: 'sentiment_satisfied', label: 'Emocional' },
    { id: 'reflexoes', icon: 'self_improvement', label: 'Reflexões' },
    { id: 'vestibulares', icon: 'school', label: 'Vestibulares' },
    { id: 'kindness', icon: 'volunteer_activism', label: 'Atos de Bondade' },
    { id: 'helpline', icon: 'support_agent', label: 'Linha de Apoio' },
    { id: 'learning', icon: 'menu_book', label: 'Aprendizado Guiado' }
  ];

  const handleToolClick = (tool) => {
    if (tool.id === 'pomodoro') {
      setShowPomodoro(true);
      setShowToolsMenu(false);
      return;
    }
    if (tool.id === 'kindness') {
      setShowKindness(true);
      setShowToolsMenu(false);
      return;
    }
    if (tool.id === 'vestibulares') {
      setShowExamsModal(true);
      setShowToolsMenu(false);
      return;
    }
    if (tool.id === 'helpline') {
      if (onOpenSupport) onOpenSupport();
      setShowToolsMenu(false);
      return;
    }
    toast.info(`Ferramenta ${tool.label} em breve!`);
    setShowToolsMenu(false);
  };

  const formatTime = (seconds) => {
    if (seconds === undefined) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'pt-BR';

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? prev + ' ' + transcript : transcript));
        setIsListening(false);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [setInput]);

  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files && files.length > 0) {
      setSelectedFiles(prev => [...prev, ...files]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendClick = () => {
    if (!input.trim() && selectedFiles.length === 0) return;
    sendMessage(input, selectedFiles);
    setSelectedFiles([]);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
      const metaKey = isMac ? e.metaKey : e.ctrlKey;

      // Microphone: Cmd + Shift + .
      if (metaKey && e.shiftKey && e.key === '.') {
        e.preventDefault();
        toggleListening();
      }

      // Upload: Cmd + Shift + U
      if (metaKey && e.shiftKey && e.key.toLowerCase() === 'u') {
        e.preventDefault();
        handleFileClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [recognition, isListening]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendClick();
    }
  };

  const formatFileName = (name) => {
    if (name.length <= 12) return name;
    const lastDotIndex = name.lastIndexOf('.');
    if (lastDotIndex !== -1 && lastDotIndex < name.length - 1) {
      const ext = name.slice(lastDotIndex);
      const nameWithoutExt = name.slice(0, lastDotIndex);
      // Keep extension, truncate middle
      const charsToShow = 10 - ext.length;
      if (charsToShow > 0) {
        return `${nameWithoutExt.slice(0, charsToShow)}..${ext}`;
      }
    }
    return `${name.slice(0, 10)}..`;
  };

  return (
    <footer className="input-area">
      <div className="input-wrapper">
        <div className={`input-container ${selectedFiles.length > 0 ? 'has-files' : ''}`}>
          {selectedFiles.length > 0 && (
            <div className="file-preview-list">
              {selectedFiles.map((file, index) => (
                <div key={index} className="file-preview-item" title={file.name}>
                  <div className="preview-content">
                    {file.type.startsWith('image/') ? (
                      <img src={URL.createObjectURL(file)} alt={file.name} />
                    ) : (
                      <div className="file-icon-wrapper">
                        <span className="material-symbols-outlined file-icon">description</span>
                        <span className="file-type">{file.name.split('.').pop().slice(0, 4).toUpperCase()}</span>
                      </div>
                    )}
                    <button 
                      className="remove-file-btn" 
                      onClick={() => removeFile(index)}
                      aria-label={`Remover arquivo ${file.name}`}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>close</span>
                    </button>
                  </div>
                  <span className="file-name">{formatFileName(file.name)}</span>
                </div>
              ))}
            </div>
          )}
          
          <div className="input-controls">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
              multiple
              aria-hidden="true"
            />
            <button 
              className="input-action-btn" 
              onClick={handleFileClick}
              title="Adicionar arquivos (Cmd + Shift + U)"
              aria-label="Adicionar arquivos"
            >
              <span className="material-symbols-outlined">add_circle</span>
            </button>
            <div className="tools-menu-container" ref={toolsMenuRef}>
              <button 
                className={`input-action-btn ${showToolsMenu ? 'active' : ''}`}
                onClick={() => setShowToolsMenu(!showToolsMenu)}
                title="Ferramentas"
                aria-label="Ferramentas"
              >
                <span className="material-symbols-outlined">handyman</span>
              </button>
              <AnimatePresence>
                {showToolsMenu && (
                  <motion.div 
                    className="tools-menu"
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    {tools.map(tool => {
                      const isPomodoroActive = tool.id === 'pomodoro' && pomodoroStatus.isActive;
                      const activeColor = isPomodoroActive 
                        ? (pomodoroStatus.mode === 'focus' ? '#1a73e8' : pomodoroStatus.mode === 'short' ? '#188038' : '#e37400')
                        : null;

                      return (
                        <button 
                          key={tool.id} 
                          className={`tool-item ${isPomodoroActive ? 'pomodoro-active' : ''}`}
                          onClick={() => handleToolClick(tool)}
                          style={isPomodoroActive ? { color: activeColor } : {}}
                        >
                          <span 
                            className={`material-symbols-outlined ${isPomodoroActive ? 'spin-animation' : ''}`}
                            style={isPomodoroActive ? { color: activeColor } : {}}
                          >
                            {tool.icon}
                          </span>
                          <span>
                            {tool.label}
                            {isPomodoroActive && (
                              <span style={{ marginLeft: '4px', fontSize: '0.9em', opacity: 0.9 }}>
                                {formatTime(pomodoroStatus.timeLeft)}
                              </span>
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <TextareaAutosize
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite uma mensagem..."
              className="message-input"
              minRows={1}
              maxRows={5}
              aria-label="Digite sua mensagem"
            />
            <button 
              className={`input-action-btn ${isListening ? 'listening' : ''}`} 
              onClick={toggleListening}
              title={isListening ? "Parar de ouvir" : "Usar microfone (Cmd + Shift + .)"}
              disabled={!recognition}
              aria-label={isListening ? "Parar microfone" : "Ativar microfone"}
            >
              <span className="material-symbols-outlined">
                {isListening ? 'mic_off' : 'mic'}
              </span>
            </button>
            {(input.trim() || selectedFiles.length > 0) && (
              <button 
                onClick={handleSendClick} 
                className="send-button" 
                title="Enviar mensagem"
                aria-label="Enviar mensagem"
              >
                <span className="material-symbols-outlined">send</span>
              </button>
            )}
          </div>
        </div>
      </div>
      <p className="disclaimer" role="note">
        <span className="material-symbols-outlined" style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '4px' }} aria-hidden="true">warning</span>
        O PsyMind.AI oferece apoio educativo. Para questões sérias, procure ajuda profissional.
      </p>
      <p className="license-notice" role="contentinfo">
        <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer" aria-label="Licença Creative Commons BY-SA 4.0">
          Licenciado sob CC BY-SA 4.0
        </a>
      </p>
      <AnimatePresence>
        {showPomodoro && (
          <PomodoroModal 
            isOpen={showPomodoro} 
            onClose={() => setShowPomodoro(false)}
            onStatusChange={setPomodoroStatus}
          />
        )}
        {showKindness && (
          <KindnessModal 
            isOpen={showKindness} 
            onClose={() => setShowKindness(false)}
          />
        )}
        {showExamsModal && (
          <ExamsModal 
            isOpen={showExamsModal} 
            onClose={() => setShowExamsModal(false)}
          />
        )}
      </AnimatePresence>
    </footer>
  );
};

export default InputArea;
