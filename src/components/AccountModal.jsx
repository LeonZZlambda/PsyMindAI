import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AccountModal = ({ isOpen, onClose, initialView = 'account' }) => {
  const [activeView, setActiveView] = useState(initialView);
  const [profileSettings, setProfileSettings] = useState({
    basicStyle: 'default',
    welcoming: 'default',
    enthusiastic: 'default',
    formatting: 'default',
    emojis: 'default',
    instantResponses: false,
    customInstructions: ''
  });

  useEffect(() => {
    if (isOpen) {
      setActiveView(initialView);
      const saved = localStorage.getItem('psymind_user_profile');
      if (saved) {
        try {
          setProfileSettings(JSON.parse(saved));
        } catch (e) {
          console.error('Error parsing profile settings', e);
        }
      }
    }
  }, [isOpen]);

  const handleSave = () => {
    localStorage.setItem('psymind_user_profile', JSON.stringify(profileSettings));
    setActiveView('account');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <motion.div 
      className="modal-overlay account-modal-overlay" 
      onClick={onClose} 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="modal-content account-modal-content"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        style={{
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <AnimatePresence mode="wait">
          {activeView === 'account' ? (
            <motion.div 
              key="account"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div style={{ padding: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="close-btn" onClick={onClose} aria-label="Fechar">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 24px 20px' }}>
                <p style={{ margin: '0 0 16px', fontSize: '0.9rem', color: 'var(--text-color)', opacity: 0.8 }}>
                  usuario@exemplo.com
                </p>
                
                <div 
                  className="user-avatar" 
                  style={{ 
                    width: '80px', 
                    height: '80px', 
                    borderRadius: '50%', 
                    background: 'var(--primary-color)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px'
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '40px' }}>account_circle</span>
                </div>
                
                <h2 style={{ margin: '0 0 16px', fontSize: '1.4rem', fontWeight: 400, color: 'var(--text-color)' }}>
                  Olá, Usuário!
                </h2>
                
                <button className="account-manage-btn">
                  Gerenciar sua Conta
                </button>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', padding: '8px' }}>
                <button 
                  onClick={() => setActiveView('personalization')}
                  className="account-menu-item"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>tune</span>
                  Personalizar Assistente
                </button>

                <button className="account-menu-item">
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add_circle</span>
                  Adicionar outra conta
                </button>

                <button className="account-menu-item">
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>logout</span>
                  Sair da conta
                </button>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '16px', 
                padding: '16px', 
                borderTop: '1px solid var(--border-color)',
                fontSize: '0.8rem',
                color: 'var(--text-color)',
                opacity: 0.7
              }}>
                <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Política de Privacidade</a>
                <span>•</span>
                <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Termos de Serviço</a>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="personalization"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}
            >
              <div className="modal-header" style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <button className="header-btn" onClick={() => setActiveView('account')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-color)', display: 'flex', alignItems: 'center', padding: '0', height: 'auto' }}>
                    <span className="material-symbols-outlined">arrow_back</span>
                  </button>
                  <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Personalização</h2>
                </div>
              </div>
              
              <div className="settings-body" style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
                <div className="settings-section">
                  <div className="setting-item">
                    <div className="setting-info">
                      <span className="setting-label">Estilo padrão</span>
                      <span className="setting-desc">Defina o tom do Assistente.</span>
                    </div>
                    <select name="basicStyle" value={profileSettings.basicStyle} onChange={handleChange} className="select-input">
                      <option value="default">Padrão</option>
                      <option value="concise">Mais conciso</option>
                      <option value="detailed">Mais detalhado</option>
                      <option value="casual">Mais casual</option>
                      <option value="formal">Mais formal</option>
                    </select>
                  </div>
                </div>

                <div className="settings-section">
                  <h3 style={{ fontSize: '1rem', marginBottom: '12px' }}>Características</h3>
                  
                  <div className="setting-item">
                    <div className="setting-info">
                      <span className="setting-label">Acolhedor</span>
                    </div>
                    <select name="welcoming" value={profileSettings.welcoming} onChange={handleChange} className="select-input">
                      <option value="less">Menos</option>
                      <option value="default">Padrão</option>
                      <option value="more">Mais</option>
                    </select>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <span className="setting-label">Entusiasmado</span>
                    </div>
                    <select name="enthusiastic" value={profileSettings.enthusiastic} onChange={handleChange} className="select-input">
                      <option value="less">Menos</option>
                      <option value="default">Padrão</option>
                      <option value="more">Mais</option>
                    </select>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <span className="setting-label">Listas e cabeçalhos</span>
                    </div>
                    <select name="formatting" value={profileSettings.formatting} onChange={handleChange} className="select-input">
                      <option value="less">Menos</option>
                      <option value="default">Padrão</option>
                      <option value="more">Mais</option>
                    </select>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <span className="setting-label">Emoji</span>
                    </div>
                    <select name="emojis" value={profileSettings.emojis} onChange={handleChange} className="select-input">
                      <option value="less">Menos</option>
                      <option value="default">Padrão</option>
                      <option value="more">Mais</option>
                    </select>
                  </div>
                </div>

                <div className="settings-section">
                  <div className="setting-item">
                    <div className="setting-info">
                      <span className="setting-label">Respostas instantâneas</span>
                    </div>
                    <button 
                      className={`toggle-switch ${profileSettings.instantResponses ? 'active' : ''}`}
                      onClick={() => handleChange({ target: { name: 'instantResponses', type: 'checkbox', checked: !profileSettings.instantResponses }})}
                      role="switch"
                      aria-checked={profileSettings.instantResponses}
                    >
                      <span className="toggle-thumb"></span>
                    </button>
                  </div>
                </div>

                <div className="settings-section">
                  <h3 style={{ fontSize: '1rem', marginBottom: '12px' }}>Instruções personalizadas</h3>
                  <textarea
                    name="customInstructions"
                    value={profileSettings.customInstructions}
                    onChange={handleChange}
                    placeholder="Ex: Responda como se fosse meu irmão..."
                    className="material-textarea"
                    rows={4}
                  />
                </div>
              </div>

              <div className="modal-footer" style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '16px' }}>
                <button className="primary-btn" onClick={() => setActiveView('account')} style={{ flex: 1, padding: '0.7rem 1.5rem', fontWeight: 600, fontSize: '0.95rem' }}>Cancelar</button>
                <button className="primary-btn cta" onClick={handleSave} style={{ flex: 1, padding: '0.7rem 1.5rem' }}>Salvar</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default AccountModal;