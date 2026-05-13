import React, { useEffect, useRef, useState } from 'react';
import '../styles/settings.css';
import { toast } from 'sonner';
import { useTheme } from '../hooks/context/useTheme';
import { ColorBlindMode } from '../context/ThemeContext';
import { useChat } from '../hooks/context/useChat';
import { defaultConfig } from '../services/config/apiConfig';
import { setApiKey as updateApiKey } from '../services/chat/chatService';
import { Telemetry } from '../services/analytics/telemetry';

import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import BaseModal from './BaseModal';
import CustomSelect from './CustomSelect';
import TextField from './TextField';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenImportContext: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onOpenImportContext }) => {
  const { t, i18n } = useTranslation();
  const [isLanguageLoading, setIsLanguageLoading] = useState(false);
  const { 
    isDarkMode, toggleTheme, themeMode, setThemeMode, 
    fontSize, setFontSize, reducedMotion, setReducedMotion, 
    highContrast, setHighContrast, colorBlindMode, setColorBlindMode,
    dyslexicFont, setDyslexicFont, keyboardNavigation, setKeyboardNavigation,
    darkRoom, setDarkRoom
  } = useTheme();
  const { clearHistory, chats } = useChat();
  const [confirmingClear, setConfirmingClear] = useState(false);

  // Handle language loading state
  useEffect(() => {
    const handleLanguageChanging = () => setIsLanguageLoading(true);
    const handleLanguageChanged = () => setIsLanguageLoading(false);

    i18n.on('languageChanging', handleLanguageChanging);
    i18n.on('languageChanged', handleLanguageChanged);

    return () => {
      i18n.off('languageChanging', handleLanguageChanging);
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);
  
  const [apiKey, setApiKey] = useState(defaultConfig.getApiKey() || '');
  const [telemetryOptIn, setTelemetryOptIn] = useState(Telemetry.isOptedIn());

  const cb = (k: string) => String(t(`settings.accessibility.colorblind.${k}`));

  const supportedLanguages = ((i18n.options?.supportedLngs as unknown as string[] | undefined) || ['pt', 'en'])
    .filter((lng): lng is string => typeof lng === 'string' && lng !== 'cimode');

  const currentLanguage = i18n.resolvedLanguage || i18n.language || 'pt';
  const selectedLanguage =
    (supportedLanguages.includes(currentLanguage) && currentLanguage) ||
    (supportedLanguages.includes(currentLanguage.split('-')[0]) && currentLanguage.split('-')[0]) ||
    (supportedLanguages.find((lng) => currentLanguage.startsWith(lng)) ?? 'pt');

  const getLanguageLabel = (lng: string): string => {
    try {
      // Prefer to display the language name in its own locale (autonym).
      // e.g. 'en' -> 'English', 'es' -> 'Español', 'fr' -> 'Français'
      const primaryLocale = lng || i18n.resolvedLanguage || 'en'
      const base = primaryLocale.split('-')[0]
      const displayNames = new Intl.DisplayNames([primaryLocale, base, 'en'], { type: 'language' })
      const resolved = displayNames.of(lng) || displayNames.of(base)
      if (resolved) return resolved
    } catch {
      // fall through to static fallback
    }

    const fallback: Record<string, string> = {
      pt: 'Português',
      'pt-BR': 'Português (Brasil)',
      en: 'English',
      es: 'Español',
      fr: 'Français',
      de: 'Deutsch',
      it: 'Italiano',
      ja: '日本語',
      ko: '한국어',
      zh: '中文',
      'zh-TW': '中文（繁體）',
      ru: 'Русский',
      ar: 'العربية',
      hi: 'हिन्दी',
      la: 'Latina',
    }
    return fallback[lng] || fallback[lng.split('-')[0]] || lng
  };

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
    setConfirmingClear(true);
  };

  const handleConfirmClear = () => {
    clearHistory();
    setConfirmingClear(false);
    toast.success(t('settings.history.success_toast'));
  };

  const handleCancelClear = () => {
    setConfirmingClear(false);
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
            <h3 className="modal-section-title">{t('settings.appearance.title')}</h3>

            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">{t('settings.appearance.language.label')}</span>
                <span className="setting-desc">{t('settings.appearance.language.desc')}</span>
              </div>
              <CustomSelect 
                value={selectedLanguage}
                options={supportedLanguages.map((lng) => ({ value: lng, label: getLanguageLabel(lng) }))}
                onChange={(val) => i18n.changeLanguage(val)}
                loading={isLanguageLoading}
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
                <span className="setting-label">{t('settings.theme.dark_room.label')}</span>
                <span className="setting-desc">{t('settings.theme.dark_room.desc')}</span>
              </div>
              <button 
                className={`toggle-switch ${darkRoom ? 'active' : ''}`}
                onClick={() => setDarkRoom(!darkRoom)}
                role="switch"
                aria-checked={darkRoom}
                aria-label={t('settings.theme.dark_room.aria')}
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
            <h3 className="modal-section-title">{t('settings.accessibility.title')}</h3>
            
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
                onChange={(val) => setColorBlindMode(val as ColorBlindMode)}
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
            <h3 className="modal-section-title">{t('settings.integration.title')}</h3>
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
            <h3 className="modal-section-title">{t('settings.privacy.title')}</h3>
            
            <div className="setting-item vertical-item">
              <div className="setting-info">
                <span className="setting-label">{t('settings.api_key.label')}</span>
                <span className="setting-desc">{t('settings.api_key.desc')}</span>
              </div>
              <div className="api-key-container">
                <div className="api-key-input-group">
                  <TextField 
                    id="api-key-input"
                    type="password"
                    label={t('settings.api_key.placeholder')}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    variant="filled"
                    className="api-key-input"
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
                <span className="setting-desc">
                  {t('settings.history.desc')}
                  {chats.length > 0 && (
                    <strong style={{ color: 'var(--error-color, #b3261e)', marginLeft: '0.35rem' }}>
                      ({chats.length} {chats.length === 1 ? 'chat' : 'chats'})
                    </strong>
                  )}
                </span>
              </div>

              <AnimatePresence mode="wait">
                {!confirmingClear ? (
                  <motion.button
                    key="clear-btn"
                    className="danger-btn"
                    onClick={handleClearHistory}
                    type="button"
                    disabled={chats.length === 0}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                  >
                    <span className="material-symbols-outlined">delete_forever</span>
                    {t('settings.history.clear')}
                  </motion.button>
                ) : (
                  <motion.div
                    key="confirm-row"
                    className="clear-confirm-row"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
                  >
                    <button
                      className="settings-cancel-btn"
                      onClick={handleCancelClear}
                      type="button"
                    >
                      {t('common.cancel', { defaultValue: 'Cancelar' })}
                    </button>
                    <button
                      className="danger-btn"
                      onClick={handleConfirmClear}
                      type="button"
                    >
                      <span className="material-symbols-outlined">delete_forever</span>
                      {t('settings.history.confirm_btn', { defaultValue: 'Confirmar' })}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
    </BaseModal>
  );
};

export default SettingsModal;
