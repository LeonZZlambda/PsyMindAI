import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import AccountModal from './AccountModal';

const LandingHeader = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme, fontSize, reducedMotion, highContrast, colorBlindMode } = useTheme();
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  return (
    <nav className="landing-nav">
      <div className="landing-nav-content">
        <motion.div 
          className="landing-logo"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        >
          <div className="logo-icon">
            <span className="material-symbols-outlined">psychology</span>
          </div>
          <span>PsyMind.AI</span>
        </motion.div>
        
        <div className="landing-nav-links">
          <motion.button 
            className="header-btn" 
            onClick={toggleTheme}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            title={isDarkMode ? t('header.light_mode') : t('header.dark_mode')}
            aria-label={isDarkMode ? t('header.activate_light_mode') : t('header.activate_dark_mode')}
          >
            <span className="material-symbols-outlined">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </motion.button>
          
          <motion.button 
            className="user-profile" 
            onClick={() => setIsAccountModalOpen(true)}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            title={t('header.user_account')} 
            aria-label={t('header.user_profile')}
          >
            <span className="material-symbols-outlined">account_circle</span>
          </motion.button>

          <motion.button 
            className="cta-btn" 
            onClick={() => navigate('/chat')}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            {t('landing.nav.start')}
          </motion.button>
        </div>
      </div>
      
      {createPortal(
        <AnimatePresence>
          {isAccountModalOpen && (
            <div className={`app ${isDarkMode ? 'dark' : ''} ${fontSize === 'large' ? 'font-large' : ''} ${reducedMotion ? 'reduced-motion' : ''} ${highContrast ? 'high-contrast' : ''} color-blind-${colorBlindMode}`} style={{ display: 'contents' }}>
              <AccountModal
                isOpen={isAccountModalOpen}
                onClose={() => setIsAccountModalOpen(false)}
              />
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </nav>
  );
};

export default LandingHeader;
