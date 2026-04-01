import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const UserProfileModal = ({ isOpen, onClose }) => {
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
    onClose();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <div className="modal-header">
          <h2>Personalização</h2>
          <button className="close-btn" onClick={onClose} aria-label="Fechar">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="settings-body">
          <div className="settings-section">
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">Estilo padrão</span>
                <span className="setting-desc">Defina o tom e o estilo que o Chat usa ao responder. Isso não afeta as funcionalidades do Chat.</span>
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
            <h3>Características</h3>
            <p className="setting-desc">Escolha personalizações adicionais junto com o estilo e tom básicos.</p>
            
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
                <span className="setting-desc">O Chat pode usar seu conhecimento geral para dar respostas rápidas.</span>
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
            <h3>Instruções personalizadas</h3>
            <p className="setting-desc">Outras preferências de tom, estilo e comportamento.</p>
            <textarea
              name="customInstructions"
              value={profileSettings.customInstructions}
              onChange={handleChange}
              placeholder="Ex: Responda como se fosse meu irmão mais velho; Sempre sugira uma tarefa prática no final..."
              className="material-textarea"
              rows={4}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="primary-btn" onClick={onClose} style={{ flex: 1, height: 'auto', padding: '0.9rem 1.5rem', fontWeight: 600, fontSize: '0.95rem' }}>Cancelar</button>
          <button className="primary-btn cta" onClick={handleSave} style={{ flex: 1 }}>Salvar Preferências</button>
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfileModal;
