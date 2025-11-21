import React, { useState, useEffect, useRef } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

const InputArea = ({ input, setInput, onSend, isTyping, inputRef }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

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
    onSend(selectedFiles);
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
    </footer>
  );
};

export default InputArea;
