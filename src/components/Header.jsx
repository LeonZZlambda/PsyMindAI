import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import SoundscapesModal from './SoundscapesModal';
import AccountModal from './AccountModal';

const Header = ({ isSidebarOpen, toggleSidebar, isLoading, onOpenStudyStats }) => {
  const { isDarkMode, toggleTheme, fontSize, reducedMotion, highContrast, colorBlindMode } = useTheme();
  const [isSoundModalOpen, setIsSoundModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const cmdKey = isMac ? '⌘' : 'Ctrl';
  const shiftKey = isMac ? '⇧' : 'Shift';

  return (
    <header className="header">
      <div className="header-left">
        {!isSidebarOpen && (
          <button 
            className="header-btn menu-toggle" 
            onClick={toggleSidebar} 
            title={`Abrir menu (${cmdKey} + B)`}
            aria-label="Abrir menu lateral"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        )}
        <div className="logo">
          <div className="logo-icon" aria-hidden="true">
            <span className="material-symbols-outlined">psychology</span>
          </div>
          <h1>PsyMind.AI</h1>
        </div>
      </div>
      <div className="header-actions">
        <button 
          className="header-btn" 
          onClick={() => setIsSoundModalOpen(true)} 
          title="Sons Ambientais"
          aria-label="Abrir sons ambientais"
        >
          <span className="material-symbols-outlined">headphones</span>
        </button>
        <button 
          className="header-btn" 
          onClick={toggleTheme} 
          title={isDarkMode ? `Modo claro (${cmdKey} + ${shiftKey} + L)` : `Modo escuro (${cmdKey} + ${shiftKey} + L)`}
          aria-label={isDarkMode ? "Ativar modo claro" : "Ativar modo escuro"}
        >
          <span className="material-symbols-outlined">
            {isDarkMode ? 'light_mode' : 'dark_mode'}
          </span>
        </button>
        <button className="user-profile" onClick={() => setIsAccountModalOpen(true)} title="Conta do Google" aria-label="Perfil do usuário">
          <span className="material-symbols-outlined">account_circle</span>
        </button>
      </div>
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            className="header-loader-bar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>
      
      {isSoundModalOpen && createPortal(
        <div className={`app ${isDarkMode ? 'dark' : ''} ${fontSize === 'large' ? 'font-large' : ''} ${reducedMotion ? 'reduced-motion' : ''} ${highContrast ? 'high-contrast' : ''} color-blind-${colorBlindMode}`} style={{ display: 'contents' }}>
          <SoundscapesModal
            isOpen={isSoundModalOpen}
            onClose={() => setIsSoundModalOpen(false)}
          />
        </div>,
        document.body
      )}

      {createPortal(
        <AnimatePresence>
          {isAccountModalOpen && (
            <div className={`app ${isDarkMode ? 'dark' : ''} ${fontSize === 'large' ? 'font-large' : ''} ${reducedMotion ? 'reduced-motion' : ''} ${highContrast ? 'high-contrast' : ''} color-blind-${colorBlindMode}`} style={{ display: 'contents' }}>
              <AccountModal
                isOpen={isAccountModalOpen}
                onClose={() => setIsAccountModalOpen(false)}
                onOpenStudyStats={onOpenStudyStats}
              />
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </header>
  );
};

export default Header;
