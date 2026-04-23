import React, { useEffect, useRef, useState } from 'react';
import '../styles/settings.css';
import { toast } from 'sonner';
import { useTheme } from '../context/ThemeContext';
import { useChat } from '../context/ChatContext';
import { defaultConfig } from '../services/config/apiConfig';
import { setApiKey as updateApiKey } from '../services/chat/chatService';
import { Telemetry } from '../services/analytics/telemetry';

import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import BaseModal from './BaseModal';

const CustomSelect = ({ value, options, onChange, ariaLabel }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  return (
    <div className="custom-select-container" ref={selectRef}>
      <button 
        className={`custom-select-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{selectedOption ? selectedOption.label : ''}</span>
        <span className="material-symbols-outlined dropdown-icon">expand_more</span>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="custom-select-dropdown"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            role="listbox"
          >
            {options.map((option) => (
              <button
                key={option.value}
                className={`custom-select-option ${value === option.value ? 'selected' : ''}`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                role="option"
                aria-selected={value === option.value}
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SettingsModal = ({ isOpen, onClose, onOpenImportContext }) => {
  const { t, i18n } = useTranslation();
  const { 
    isDarkMode, toggleTheme, themeMode, setThemeMode, 
    fontSize, setFontSize, reducedMotion, setReducedMotion, 
    highContrast, setHighContrast, colorBlindMode, setColorBlindMode,
    dyslexicFont, setDyslexicFont, keyboardNavigation, setKeyboardNavigation
  } = useTheme();
  const { clearHistory } = useChat();
  
  const [apiKey, setApiKey] = useState(defaultConfig.getApiKey() || '');
  const [telemetryOptIn, setTelemetryOptIn] = useState(Telemetry.isOptedIn());

  const cb = (k) => t(`settings.accessibility.colorblind.${k}`);

  const handleOptInChange = () => {
    const newVal = !telemetryOptIn;
    setTelemetryOptIn(newVal);
    Telemetry.setOptIn(newVal);
    toast.success(newVal ? t('settings.toasts.telemetry_on') : t('settings.toasts.telemetry_off'));
  };

  const handleSaveApiKey = () => {
    updateApiKey(apiKey);
    toast.success(t('settings.toasts.api_saved'));
  };

  const handleClearHistory = () => {
    if (window.confirm(t('settings.history.confirm'))) {
      clearHistory();
      toast.success(t('settings.history.success_toast'));
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('settings.title')}
      icon="settings"
      closeAriaLabel={t('settings.close_aria')}
    >
        <div className="settings-body">
          <div className="settings-section">
            <h3>{t('settings.appearance.title')}</h3>

            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">{t('settings.appearance.language.label')}</span>
                <span className="setting-desc">{t('settings.appearance.language.desc')}</span>
              </div>
              <CustomSelect 
                value={(i18n.resolvedLanguage || i18n.language || 'pt').startsWith('en') ? 'en' : 'pt'}
                options={[
                  { value: 'pt', label: t('settings.appearance.language.pt') },
                  { value: 'en', label: t('settings.appearance.language.en') }
                ]}
                onChange={(val) => i18n.changeLanguage(val)}
                ariaLabel={t('settings.appearance.language.label')}
              />
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">{t('settings.theme.follow_system.label')}</span>
                <span className="setting-desc">{t('settings.theme.follow_system.desc')}</span>
              </div>
              <button 
                className={`toggle-switch ${themeMode === 'system' ? 'active' : ''}`}
                onClick={() => setThemeMode(themeMode === 'system' ? (isDarkMode ? 'dark' : 'light') : 'system')}
                role="switch"
                aria-checked={themeMode === 'system'}
                aria-label={t('settings.theme.follow_system.aria')}
              >
                <span className="toggle-thumb"></span>
              </button>
            </div>

            <div className={`setting-item ${themeMode === 'system' ? 'disabled' : ''}`}>
              <div className="setting-info">
                <span className="setting-label">{t('settings.theme.dark.label')}</span>
                <span className="setting-desc">{t('settings.theme.dark.desc')}</span>
              </div>
              <button 
                className={`toggle-switch ${isDarkMode ? 'active' : ''}`}
                onClick={themeMode === 'system' ? undefined : toggleTheme}
                disabled={themeMode === 'system'}
                role="switch"
                aria-checked={isDarkMode}
                aria-label={t('settings.theme.dark.aria')}
              >
                <span className="toggle-thumb"></span>
              </button>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">{t('settings.font.label')}</span>
                <span className="setting-desc">{t('settings.font.desc')}</span>
              </div>
              <div className="font-size-controls" role="group" aria-label={t('settings.font.aria_group')}>
                <button 
                  className={`font-btn ${fontSize === 'normal' ? 'active' : ''}`}
                  onClick={() => setFontSize('normal')}
                  aria-pressed={fontSize === 'normal'}
                >
                  {t('settings.font.normal')}
                </button>
                <button 
                  className={`font-btn ${fontSize === 'large' ? 'active' : ''}`}
                  onClick={() => setFontSize('large')}
                  aria-pressed={fontSize === 'large'}
                >
                  {t('settings.font.large')}
                </button>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h3>{t('settings.accessibility.title')}</h3>
            
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">{t('settings.accessibility.reduced_motion.label')}</span>
                <span className="setting-desc">{t('settings.accessibility.reduced_motion.desc')}</span>
              </div>
              <button 
                className={`toggle-switch ${reducedMotion ? 'active' : ''}`}
                onClick={() => setReducedMotion(!reducedMotion)}
                role="switch"
                aria-checked={reducedMotion}
                aria-label={t('settings.accessibility.reduced_motion.aria')}
              >
                <span className="toggle-thumb"></span>
              </button>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">{t('settings.accessibility.high_contrast.label')}</span>
                <span className="setting-desc">{t('settings.accessibility.high_contrast.desc')}</span>
              </div>
              <button 
                className={`toggle-switch ${highContrast ? 'active' : ''}`}
                onClick={() => setHighContrast(!highContrast)}
                role="switch"
                aria-checked={highContrast}
                aria-label={t('settings.accessibility.high_contrast.aria')}
              >
                <span className="toggle-thumb"></span>
              </button>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">{t('settings.accessibility.dyslexic_font.label')}</span>
                <span className="setting-desc">{t('settings.accessibility.dyslexic_font.desc')}</span>
              </div>
              <button 
                className={`toggle-switch ${dyslexicFont ? 'active' : ''}`}
                onClick={() => setDyslexicFont(!dyslexicFont)}
                role="switch"
                aria-checked={dyslexicFont}
                aria-label={t('settings.accessibility.dyslexic_font.aria')}
              >
                <span className="toggle-thumb"></span>
              </button>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">{t('settings.accessibility.colorblind.label')}</span>
                <span className="setting-desc">{t('settings.accessibility.colorblind.desc')}</span>
              </div>
              <CustomSelect 
                value={colorBlindMode}
                onChange={setColorBlindMode}
                ariaLabel={t('settings.accessibility.colorblind.aria_select')}
                options={[
                  { value: 'none', label: cb('none') },
                  { value: 'protanopia', label: cb('protanopia') },
                  { value: 'deuteranopia', label: cb('deuteranopia') },
                  { value: 'tritanopia', label: cb('tritanopia') },
                  { value: 'achromatopsia', label: cb('achromatopsia') }
                ]}
              />
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">{t('settings.accessibility.keyboard_nav.label')}</span>
                <span className="setting-desc">{t('settings.accessibility.keyboard_nav.desc')}</span>
              </div>
              <button 
                className={`toggle-switch ${keyboardNavigation ? 'active' : ''}`}
                onClick={() => setKeyboardNavigation(!keyboardNavigation)}
                role="switch"
                aria-checked={keyboardNavigation}
                aria-label={t('settings.accessibility.keyboard_nav.aria')}
              >
                <span className="toggle-thumb"></span>
              </button>
            </div>

          </div>

          <div className="settings-section">
            <h3>{t('settings.integration.title')}</h3>
            <div className="setting-item vertical-item">
              <div className="setting-info">
                <span className="setting-label">{t('settings.integration.import.label')}</span>
                <span className="setting-desc">{t('settings.integration.import.desc')}</span>
              </div>
              <button 
                className="secondary-btn w-full"
                onClick={() => {
                  onClose();
                  onOpenImportContext();
                }}
              >
                <span className="material-symbols-outlined">cloud_download</span>
                {t('settings.integration.import.button')}
              </button>
            </div>
          </div>

          <div className="settings-section">
            <h3>{t('settings.privacy.title')}</h3>
            
            <div className="setting-item vertical-item">
              <div className="setting-info">
                <span className="setting-label">{t('settings.api_key.label')}</span>
                <span className="setting-desc">{t('settings.api_key.desc')}</span>
              </div>
              <div className="api-key-container">
                <div className="api-key-input-group">
                  <input 
                    type="password"
                    className="input-field api-key-input"
                    placeholder={t('settings.api_key.placeholder')}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  <button className="primary-btn api-key-save-btn" onClick={handleSaveApiKey}>
                    {t('settings.api_key.save')}
                  </button>
                  {apiKey && (
                    <button 
                      onClick={() => {
                        setApiKey('');
                        updateApiKey('');
                        toast.success(t('settings.api_key.remove_toast'));
                      }} 
                      className="api-key-delete-btn"
                      title={t('settings.api_key.remove_title')}
                      type="button"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  )}
                </div>
                <div className="settings-tooltip-container">
                  <span className="material-symbols-outlined security-icon">lock</span>
                  <div className="tooltip-text">
                    {t('settings.api_key.tooltip')}
                  </div>
                </div>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">{t('settings.usage_analytics.label')}</span>
                <span className="setting-desc analytics-desc">{t('settings.usage_analytics.desc')}</span>
              </div>
              <button 
                className={`toggle-switch ${telemetryOptIn ? 'active' : ''}`}
                onClick={handleOptInChange}
                role="switch"
                aria-checked={telemetryOptIn}
                aria-label={t('settings.usage_analytics.aria')}
              >
                <span className="toggle-thumb"></span>
              </button>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">{t('settings.history.label')}</span>
                <span className="setting-desc">{t('settings.history.desc')}</span>
              </div>
              <button className="danger-btn" onClick={handleClearHistory} type="button">
                <span className="material-symbols-outlined">delete_forever</span>
                {t('settings.history.clear')}
              </button>
            </div>

          </div>
        </div>
    </BaseModal>
  );
};

export default SettingsModal;
