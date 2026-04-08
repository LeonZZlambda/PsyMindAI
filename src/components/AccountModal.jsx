import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const AccountModal = ({ isOpen, onClose, onOpenStudyStats, initialView = 'account' }) => {
  const { t } = useTranslation();
  const [activeView, setActiveView] = useState(initialView);
  const [profileSettings, setProfileSettings] = useState({
    responseMode: 'default',
    basicStyle: 'default',
    welcoming: 'default',
    enthusiastic: 'default',
    formatting: 'default',
    emojis: 'default',
    instantResponses: false,
    customInstructions: ''
  });

  // Reset view when closing
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setActiveView(initialView), 300);
    } else {
      const saved = localStorage.getItem('psymind_user_profile');
      if (saved) {
        try {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setProfileSettings(JSON.parse(saved));
        } catch (e) {
          console.error('Error parsing profile settings', e);
        }
      }
    }
  }, [isOpen, initialView]);

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
              style={{ width: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ padding: '12px', display: 'flex', justifyContent: 'flex-end', flexShrink: 0 }}>
                <button className="close-btn" onClick={onClose} aria-label={t('account.close')}>
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
                  {t('account.greeting', { name: 'Usuário' })}
                </h2>
                
                <button className="account-manage-btn">
                  {t('account.manage')}
                </button>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', padding: '8px' }}>
                <button 
                  onClick={() => setActiveView('personalization')}
                  className="account-menu-item"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>tune</span>
                  {t('account.menu.personalize')}
                </button>

                <button 
                  onClick={() => {
                    onClose();
                    onOpenStudyStats && onOpenStudyStats();
                  }}
                  className="account-menu-item"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>bar_chart</span>
                  {t('account.menu.stats')}
                </button>

                <button className="account-menu-item">
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add_circle</span>
                  {t('account.menu.add_account')}
                </button>

                <button className="account-menu-item">
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>logout</span>
                  {t('account.menu.logout')}
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
                <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>{t('account.links.privacy')}</a>
                <span>•</span>
                <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>{t('account.links.terms')}</a>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="personalization"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, width: '100%' }}
            >
              <div className="modal-header" style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <button className="header-btn" onClick={() => setActiveView('account')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-color)', display: 'flex', alignItems: 'center', padding: '0', height: 'auto' }}>
                    <span className="material-symbols-outlined">arrow_back</span>
                  </button>
                  <h2 style={{ margin: 0, fontSize: '1.2rem' }}>{t('account.personalization.title')}</h2>
                </div>
              </div>
              
              <div className="settings-body" style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
                <div className="settings-section">
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{t('account.personalization.profile.title')}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-color)', opacity: 0.8, marginBottom: '16px' }}>
                    {t('account.personalization.profile.desc')}
                  </p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
                    {['default', 'reflective', 'action', 'learning', 'support'].map(modeId => {
                      const icons = { default: 'smart_toy', reflective: 'psychology', action: 'bolt', learning: 'school', support: 'volunteer_activism' };
                      return (
                      <button
                        key={modeId}
                        type="button"
                        onClick={() => handleChange({ target: { name: 'responseMode', type: 'text', value: modeId }})}
                        style={{
                          padding: '12px',
                          borderRadius: '12px',
                          border: profileSettings.responseMode === modeId || (!profileSettings.responseMode && modeId === 'default') ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                          background: profileSettings.responseMode === modeId || (!profileSettings.responseMode && modeId === 'default') ? 'var(--primary-color-alpha)' : 'transparent',
                          color: 'var(--text-color)',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          gap: '8px',
                          textAlign: 'left',
                          transition: 'all 0.2s',
                          width: '100%'
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ color: profileSettings.responseMode === modeId || (!profileSettings.responseMode && modeId === 'default') ? 'var(--primary-color)' : 'inherit' }}>
                          {icons[modeId]}
                        </span>
                        <div>
                          <strong style={{ display: 'block', fontSize: '0.95rem' }}>{t(`account.personalization.profile.modes.${modeId}.title`)}</strong>
                          <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>{t(`account.personalization.profile.modes.${modeId}.desc`)}</span>
                        </div>
                      </button>
                    )})}
                  </div>
                </div>

                <div className="settings-section" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '12px' }}>{t('account.personalization.fine_tuning.title')}</h3>
                  <div className="setting-item">
                    <div className="setting-info">
                      <span className="setting-label">{t('account.personalization.fine_tuning.style.label')}</span>
                      <span className="setting-desc">{t('account.personalization.fine_tuning.style.desc')}</span>
                    </div>
                    <select name="basicStyle" value={profileSettings.basicStyle} onChange={handleChange} className="select-input">
                      <option value="default">{t('account.personalization.fine_tuning.style.options.default')}</option>
                      <option value="concise">{t('account.personalization.fine_tuning.style.options.concise')}</option>
                      <option value="detailed">{t('account.personalization.fine_tuning.style.options.detailed')}</option>
                      <option value="casual">{t('account.personalization.fine_tuning.style.options.casual')}</option>
                      <option value="formal">{t('account.personalization.fine_tuning.style.options.formal')}</option>
                    </select>
                  </div>
                </div>

                <div className="settings-section">
                  <h3 style={{ fontSize: '1rem', marginBottom: '12px' }}>{t('account.personalization.traits.title')}</h3>
                  
                  <div className="setting-item">
                    <div className="setting-info">
                      <span className="setting-label">{t('account.personalization.traits.welcoming')}</span>
                    </div>
                    <select name="welcoming" value={profileSettings.welcoming} onChange={handleChange} className="select-input">
                      <option value="less">{t('account.personalization.traits.levels.less')}</option>
                      <option value="default">{t('account.personalization.traits.levels.default')}</option>
                      <option value="more">{t('account.personalization.traits.levels.more')}</option>
                    </select>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <span className="setting-label">{t('account.personalization.traits.enthusiastic')}</span>
                    </div>
                    <select name="enthusiastic" value={profileSettings.enthusiastic} onChange={handleChange} className="select-input">
                      <option value="less">{t('account.personalization.traits.levels.less')}</option>
                      <option value="default">{t('account.personalization.traits.levels.default')}</option>
                      <option value="more">{t('account.personalization.traits.levels.more')}</option>
                    </select>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <span className="setting-label">{t('account.personalization.traits.formatting')}</span>
                    </div>
                    <select name="formatting" value={profileSettings.formatting} onChange={handleChange} className="select-input">
                      <option value="less">{t('account.personalization.traits.levels.less')}</option>
                      <option value="default">{t('account.personalization.traits.levels.default')}</option>
                      <option value="more">{t('account.personalization.traits.levels.more')}</option>
                    </select>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <span className="setting-label">{t('account.personalization.traits.emojis')}</span>
                    </div>
                    <select name="emojis" value={profileSettings.emojis} onChange={handleChange} className="select-input">
                      <option value="less">{t('account.personalization.traits.levels.less')}</option>
                      <option value="default">{t('account.personalization.traits.levels.default')}</option>
                      <option value="more">{t('account.personalization.traits.levels.more')}</option>
                    </select>
                  </div>
                </div>

                <div className="settings-section">
                  <div className="setting-item">
                    <div className="setting-info">
                      <span className="setting-label">{t('account.personalization.instant')}</span>
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
                  <h3 style={{ fontSize: '1rem', marginBottom: '12px' }}>{t('account.personalization.custom_instructions.title')}</h3>
                  <textarea
                    name="customInstructions"
                    value={profileSettings.customInstructions}
                    onChange={handleChange}
                    placeholder={t('account.personalization.custom_instructions.placeholder')}
                    className="material-textarea"
                    rows={4}
                  />
                </div>
              </div>

              <div className="modal-footer" style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '16px', flexShrink: 0 }}>
                <button className="primary-btn" onClick={() => setActiveView('account')} style={{ flex: 1, padding: '0.7rem 1.5rem', fontWeight: 600, fontSize: '0.95rem' }}>{t('account.personalization.actions.cancel')}</button>
                <button className="primary-btn cta" onClick={handleSave} style={{ flex: 1, padding: '0.7rem 1.5rem' }}>{t('account.personalization.actions.save')}</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default AccountModal;