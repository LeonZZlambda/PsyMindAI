import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useTheme } from '../context/ThemeContext';
import { useChat } from '../context/ChatContext';
import { defaultConfig } from '../services/config/apiConfig';
import { setApiKey as updateApiKey } from '../services/chat/chatService';
import { Telemetry } from '../services/analytics/telemetry';

import { useNavigate } from 'react-router-dom';

const SettingsModal = ({ isOpen, onClose, onOpenImportContext }) => {
  const { 
    isDarkMode, toggleTheme, themeMode, setThemeMode, 
    fontSize, setFontSize, reducedMotion, setReducedMotion, 
    highContrast, setHighContrast, colorBlindMode, setColorBlindMode 
  } = useTheme();
  const { clearHistory } = useChat();
  const navigate = useNavigate();
  
  const modalRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);
  const [apiKey, setApiKey] = useState(defaultConfig.getApiKey() || '');
  const [telemetryOptIn, setTelemetryOptIn] = useState(Telemetry.isOptedIn());

  const handleOptInChange = () => {
    const newVal = !telemetryOptIn;
    setTelemetryOptIn(newVal);
    Telemetry.setOptIn(newVal);
    toast.success(newVal ? 'Rastreamento anônimo habilitado!' : 'Rastreamento anônimo desativado.');
  };

  const handleSaveApiKey = () => {
    updateApiKey(apiKey);
    toast.success('Chave da API salva com sucesso!');
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const handleClearHistory = () => {
    if(window.confirm('Tem certeza que deseja apagar todo o histórico?')) {
      clearHistory();
      toast.success('Histórico apagado com sucesso');
    }
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
            <h3>Integração</h3>
            <div className="setting-item" style={{ marginTop: '10px' }}>
              <div className="setting-info">
                <span className="setting-label">Importar contexto</span>
                <span className="setting-desc">Transfira as informações de outras IAs para personalizar sua experiência.</span>
              </div>
              <button className="secondary-btn" onClick={() => {
                onClose();
                onOpenImportContext();
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', marginRight: '6px' }}>cloud_download</span>
                Importar
              </button>
            </div>
          </div>

          <div className="settings-section">
            <h3>Dados e Privacidade</h3>
            
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">Chave da API Gemini</span>
                <span className="setting-desc">Insira sua própria API Key para usar o sistema</span>
              </div>
              <div className="api-key-input-group" style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <input 
                  type="password"
                  className="input-field"
                  placeholder="AIzaSy..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)' }}
                />
                <button className="primary-btn" onClick={handleSaveApiKey} style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', background: 'var(--primary-color)', color: '#fff', cursor: 'pointer' }}>
                  Salvar
                </button>
              </div>
            </div>

            <div className="setting-item" style={{ marginTop: '20px' }}>
              <div className="setting-info">
                <span className="setting-label">Enviar dados anônimos (Analytics)</span>
                <span className="setting-desc" style={{ fontSize: '0.85rem' }}>Ajude a melhorar o app compartilhando uso básico. Nenhuma mensagem é lida.</span>
              </div>
              <button 
                className={`toggle-switch ${telemetryOptIn ? 'active' : ''}`}
                onClick={handleOptInChange}
                role="switch"
                aria-checked={telemetryOptIn}
                aria-label="Alternar envio de telemetria"
              >
                <span className="toggle-thumb"></span>
              </button>
            </div>

            <div className="setting-item" style={{ marginTop: '20px' }}>
              <div className="setting-info">
                <span className="setting-label">Limpar Histórico</span>
                <span className="setting-desc">Apagar todas as conversas salvas neste dispositivo</span>
              </div>
              <button className="danger-btn" onClick={handleClearHistory}>
                <span className="material-symbols-outlined">delete</span>
                Limpar tudo
              </button>
            </div>

            <div className="setting-item" style={{ marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
              <div className="setting-info" style={{ flex: 1 }}>
                <span className="setting-label">Engajamento & Análise</span>
                <span className="setting-desc" style={{ fontSize: '0.85rem' }}>Acesse a telemetria ou exporte logs de comportamento.</span>
              </div>
              <button 
                className="secondary-btn" 
                onClick={() => { onClose(); setTimeout(() => navigate('/analytics'), 300); }}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span className="material-symbols-outlined">analytics</span>
                Ver Dashboard
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
