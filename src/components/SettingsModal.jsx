import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useChat } from '../context/ChatContext';

const SettingsModal = ({ isOpen, onClose }) => {
  const { 
    isDarkMode, toggleTheme, themeMode, setThemeMode, 
    fontSize, setFontSize, reducedMotion, setReducedMotion, 
    highContrast, setHighContrast, colorBlindMode, setColorBlindMode 
  } = useTheme();
  const { clearHistory } = useChat();
  
  const modalRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Focus trap could be implemented here for better accessibility
      modalRef.current?.focus();
    }
    
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
      <div 
        className={`modal-content ${isClosing ? 'closing' : ''}`}
        onClick={e => e.stopPropagation()} 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="settings-title"
        ref={modalRef}
        tabIndex="-1"
      >
        <div className="modal-header">
          <h2 id="settings-title">Configurações</h2>
          <button className="close-btn" onClick={handleClose} aria-label="Fechar configurações">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="settings-body">
          <div className="settings-section">
            <h3>Aparência</h3>
            
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">Seguir tema do sistema</span>
                <span className="setting-desc">Ajustar automaticamente com base nas configurações do seu dispositivo</span>
              </div>
              <button 
                className={`toggle-switch ${themeMode === 'system' ? 'active' : ''}`}
                onClick={() => setThemeMode(themeMode === 'system' ? (isDarkMode ? 'dark' : 'light') : 'system')}
                role="switch"
                aria-checked={themeMode === 'system'}
                aria-label="Alternar tema do sistema"
              >
                <span className="toggle-thumb"></span>
              </button>
            </div>

            <div className={`setting-item ${themeMode === 'system' ? 'disabled' : ''}`}>
              <div className="setting-info">
                <span className="setting-label">Tema Escuro</span>
                <span className="setting-desc">Ajustar a aparência para ambientes com pouca luz</span>
              </div>
              <button 
                className={`toggle-switch ${isDarkMode ? 'active' : ''}`}
                onClick={themeMode === 'system' ? undefined : toggleTheme}
                disabled={themeMode === 'system'}
                role="switch"
                aria-checked={isDarkMode}
                aria-label="Alternar tema escuro"
              >
                <span className="toggle-thumb"></span>
              </button>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">Tamanho da Fonte</span>
                <span className="setting-desc">Aumentar o tamanho do texto para melhor leitura</span>
              </div>
              <div className="font-size-controls" role="group" aria-label="Escolha o tamanho da fonte">
                <button 
                  className={`font-btn ${fontSize === 'normal' ? 'active' : ''}`}
                  onClick={() => setFontSize('normal')}
                  aria-pressed={fontSize === 'normal'}
                >
                  Normal
                </button>
                <button 
                  className={`font-btn ${fontSize === 'large' ? 'active' : ''}`}
                  onClick={() => setFontSize('large')}
                  aria-pressed={fontSize === 'large'}
                >
                  Grande
                </button>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h3>Acessibilidade</h3>
            
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">Reduzir Movimento</span>
                <span className="setting-desc">Minimizar animações e transições na interface</span>
              </div>
              <button 
                className={`toggle-switch ${reducedMotion ? 'active' : ''}`}
                onClick={() => setReducedMotion(!reducedMotion)}
                role="switch"
                aria-checked={reducedMotion}
                aria-label="Alternar redução de movimento"
              >
                <span className="toggle-thumb"></span>
              </button>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">Alto Contraste</span>
                <span className="setting-desc">Aumentar o contraste das cores para melhor visibilidade</span>
              </div>
              <button 
                className={`toggle-switch ${highContrast ? 'active' : ''}`}
                onClick={() => setHighContrast(!highContrast)}
                role="switch"
                aria-checked={highContrast}
                aria-label="Alternar alto contraste"
              >
                <span className="toggle-thumb"></span>
              </button>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">Modo Daltonismo</span>
                <span className="setting-desc">Ajustar cores para diferentes tipos de visão</span>
              </div>
              <select 
                className="select-input"
                value={colorBlindMode}
                onChange={(e) => setColorBlindMode(e.target.value)}
                aria-label="Selecionar modo de daltonismo"
              >
                <option value="none">Nenhum</option>
                <option value="protanopia">Protanopia (Vermelho)</option>
                <option value="deuteranopia">Deuteranopia (Verde)</option>
                <option value="tritanopia">Tritanopia (Azul)</option>
                <option value="achromatopsia">Acromatopsia (Monocromático)</option>
              </select>
            </div>
          </div>

          <div className="settings-section">
            <h3>Dados e Privacidade</h3>
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">Limpar Histórico</span>
                <span className="setting-desc">Apagar todas as conversas salvas neste dispositivo</span>
              </div>
              <button className="danger-btn" onClick={() => {
                if(window.confirm('Tem certeza que deseja apagar todo o histórico?')) {
                  clearHistory();
                }
              }}>
                <span className="material-symbols-outlined">delete</span>
                Limpar tudo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
