import React, { useState, useEffect, useRef } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useChat } from '../context/ChatContext';
import { usePomodoro } from '../context/PomodoroContext';
import { useModal } from '../context/ModalContext';
import { Telemetry } from '../services/analytics/telemetry';
import logger from '../utils/logger';
import type { FileAttachment } from '@/types/storage';

const ImagePreview: React.FC<{ file: File }> = ({ file }) => {
  const [url, setUrl] = useState<string>('');
  useEffect(() => {
    let objectUrl: string | undefined;
    try {
      objectUrl = URL.createObjectURL(file);
      setUrl(objectUrl);
    } catch(err) {
      logger.error(err);
    }
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [file]);
  if (!url) return null;
  const safeName = typeof file.name === 'string' ? file.name : 'image';
  return <img src={url} alt={safeName} />;
};

interface InputAreaProps {
  inputRef?: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>
  onOpenHelp?: () => void
  onOpenSupport?: () => void
  onOpenReflections?: () => void
  onOpenMoodTracker?: () => void
  onOpenEmotionalJournal?: () => void
  onOpenGuidedLearning?: () => void
}

const InputArea: React.FC<InputAreaProps> = ({ inputRef, onOpenHelp, onOpenSupport, onOpenReflections, onOpenMoodTracker, onOpenEmotionalJournal, onOpenGuidedLearning }) => {
  const { input, setInput, sendMessage, isTyping, isStreaming, stopStreaming } = useChat();
  const { isActive: pomodoroIsActive, mode: pomodoroMode, timeLeft: pomodoroTimeLeft } = usePomodoro();
  const { t } = useTranslation();
  const { toggleModal } = useModal();
  
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const toolsMenuRef = useRef<HTMLDivElement | null>(null);

  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const cmdKey = isMac ? '⌘' : 'Ctrl';
  const shiftKey = isMac ? '⇧' : 'Shift';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(event.target as Node)) {
        setShowToolsMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const tools = [
    { id: 'pomodoro', icon: 'timer', label: t('chat.input.tools.pomodoro') },
    { id: 'mood', icon: 'mood', label: t('chat.input.tools.mood') },
    { id: 'journal', icon: 'auto_stories', label: t('chat.input.tools.journal') },
    { id: 'reflexoes', icon: 'self_improvement', label: t('chat.input.tools.reflexoes') },
    { id: 'vestibulares', icon: 'school', label: t('chat.input.tools.vestibulares') },
    { id: 'kindness', icon: 'volunteer_activism', label: t('chat.input.tools.kindness') },
    { id: 'helpline', icon: 'support_agent', label: t('chat.input.tools.helpline') },
    { id: 'learning', icon: 'menu_book', label: t('chat.input.tools.learning') }
  ];

  const handleToolClick = (tool: { id: string; label: string; [key: string]: unknown }) => {
    Telemetry.trackFeature(tool.id || tool.label, 'opened');
    if (tool.id === 'pomodoro') {
      toggleModal('pomodoro');
      setShowToolsMenu(false);
      return;
    }
    if (tool.id === 'kindness') {
      toggleModal('kindness');
      setShowToolsMenu(false);
      return;
    }
    if (tool.id === 'vestibulares') {
      toggleModal('exams');
      setShowToolsMenu(false);
      return;
    }
    if (tool.id === 'helpline') {
      if (onOpenSupport) onOpenSupport();
      setShowToolsMenu(false);
      return;
    }
    if (tool.id === 'reflexoes') {
      if (onOpenReflections) onOpenReflections();
      setShowToolsMenu(false);
      return;
    }
    if (tool.id === 'mood') {
      if (onOpenMoodTracker) onOpenMoodTracker();
      setShowToolsMenu(false);
      return;
    }
    if (tool.id === 'journal') {
      if (onOpenEmotionalJournal) onOpenEmotionalJournal();
      setShowToolsMenu(false);
      return;
    }
    if (tool.id === 'learning') {
      if (onOpenGuidedLearning) onOpenGuidedLearning();
      setShowToolsMenu(false);
      return;
    }
    toast.info(t('chat.input.tool_soon', { tool: tool.label }));
    setShowToolsMenu(false);
  };

  const formatTime = (seconds?: number) => {
    if (seconds === undefined) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognitionConstructor();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'pt-BR';

      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev: string) => (prev ? prev + ' ' + transcript : transcript));
        setIsListening(false);
      };

      recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
        logger.error('Speech recognition error', event.error);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files && files.length > 0) {
      setSelectedFiles(prev => [...prev, ...files]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendClick = () => {
    if (!input.trim() && selectedFiles.length === 0) return;
    sendMessage(input, selectedFiles);
    setSelectedFiles([]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMacLocal = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
      const metaKey = isMacLocal ? e.metaKey : e.ctrlKey;

      if (metaKey && e.shiftKey && e.key === '.') {
        e.preventDefault();
        toggleListening();
      }

      if (metaKey && e.shiftKey && String(e.key).toLowerCase() === 'u') {
        e.preventDefault();
        handleFileClick();
      }

      if (metaKey && String(e.key).toLowerCase() === 'k') {
        e.preventDefault();
        setShowToolsMenu(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [recognition, isListening]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendClick();
    }
  };

  const formatFileName = (name: string) => {
    if (name.length <= 12) return name;
    const lastDotIndex = name.lastIndexOf('.');
    if (lastDotIndex !== -1 && lastDotIndex < name.length - 1) {
      const ext = name.slice(lastDotIndex);
      const nameWithoutExt = name.slice(0, lastDotIndex);
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
                      {file.type && file.type.startsWith('image/') ? (
                        <ImagePreview file={file} />
                    ) : (
                      <div className="file-icon-wrapper">
                        <span className="material-symbols-outlined file-icon">description</span>
                        <span className="file-type">{(file.name || '').split('.').pop()?.slice(0, 4).toUpperCase()}</span>
                      </div>
                    )}
                    <button 
                      className="remove-file-btn" 
                      onClick={() => removeFile(index)}
                      aria-label={`${t('chat.input.remove_file')} ${file.name}`}
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
              title={`${t('chat.input.attach_file')} (${cmdKey} + ${shiftKey} + U)`}
              aria-label={t('chat.input.attach_file')}
            >
              <span className="material-symbols-outlined">attach_file</span>
            </button>
            <div className="tools-menu-container" ref={toolsMenuRef}>
              <button 
                className={`input-action-btn ${showToolsMenu ? 'active' : ''}`}
                onClick={() => setShowToolsMenu(!showToolsMenu)}
                title={`${t('chat.input.tools_menu')} (${cmdKey} + K)`}
                aria-label={t('chat.input.tools_menu_aria')}
              >
                <span className="material-symbols-outlined">add_circle</span>
              </button>
              <AnimatePresence>
                {showToolsMenu && (
                  <motion.div 
                    className="tools-menu"
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                  >
                    {tools.map(tool => {
                      const isPomodoroActive = tool.id === 'pomodoro' && pomodoroIsActive;
                      const activeColor = isPomodoroActive 
                        ? (pomodoroMode === 'focus' ? '#1a73e8' : pomodoroMode === 'short' ? '#188038' : '#e37400')
                        : null;

                      return (
                        <button 
                          key={tool.id} 
                          className={`tool-item ${isPomodoroActive ? 'pomodoro-active' : ''}`}
                          onClick={() => handleToolClick(tool)}
                          style={isPomodoroActive ? { color: activeColor as string } : {}}
                        >
                          <span 
                            className={`material-symbols-outlined ${isPomodoroActive ? 'spin-animation' : ''}`}
                            style={isPomodoroActive ? { color: activeColor as string } : {}}
                          >
                            {tool.icon}
                          </span>
                          <span>
                            {tool.label}
                            {isPomodoroActive && (
                              <span style={{ marginLeft: '4px', fontSize: '0.9em', opacity: 0.9 }}>
                                {formatTime(pomodoroTimeLeft)}
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
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('chat.input.placeholder')}
              className="message-input"
              minRows={1}
              maxRows={5}
              aria-label={t('chat.input.placeholder')}
            />
            <button 
              className={`input-action-btn ${isListening ? 'listening' : ''}`} 
              onClick={toggleListening}
              title={isListening ? t('chat.input.stop_listening') : `${t('chat.input.use_mic')} (${cmdKey} + ${shiftKey} + .)`}
              disabled={!recognition}
              aria-label={isListening ? t('chat.input.stop_mic') : t('chat.input.start_mic')}
            >
              <span className="material-symbols-outlined">
                {isListening ? 'mic_off' : 'mic'}
              </span>
            </button>
            {isStreaming ? (
              <button 
                onClick={stopStreaming} 
                className="send-button" 
                title={t('chat.input.stop_streaming')}
                aria-label={t('chat.input.stop_streaming')}
              >
                <span className="material-symbols-outlined">stop_circle</span>
              </button>
            ) : (input.trim() || selectedFiles.length > 0) && (
              <button 
                onClick={handleSendClick} 
                className="send-button" 
                title={`${t('chat.input.send_message')} (Enter)`}
                aria-label={t('chat.input.send_message')}
              >
                <span className="material-symbols-outlined">send</span>
              </button>
            )}
          </div>
        </div>
      </div>
      <p className="disclaimer" role="note">
        <span className="material-symbols-outlined" style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '4px' }} aria-hidden="true">warning</span>
        {t('chat.input.disclaimer')}
      </p>
      <p className="license-notice" role="contentinfo">
        <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer" aria-label="Licença Creative Commons BY-SA 4.0">
          Licenciado sob CC BY-SA 4.0
        </a>
      </p>
      <AnimatePresence>
      </AnimatePresence>
    </footer>
  );
};

export default InputArea;
