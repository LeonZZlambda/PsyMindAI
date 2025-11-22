import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const Header = ({ isSidebarOpen, toggleSidebar, isLoading }) => {
  const { isDarkMode, toggleTheme } = useTheme();
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
          onClick={toggleTheme} 
          title={isDarkMode ? `Modo claro (${cmdKey} + ${shiftKey} + L)` : `Modo escuro (${cmdKey} + ${shiftKey} + L)`}
          aria-label={isDarkMode ? "Ativar modo claro" : "Ativar modo escuro"}
        >
          <span className="material-symbols-outlined">
            {isDarkMode ? 'light_mode' : 'dark_mode'}
          </span>
        </button>
        <button className="user-profile" title="Conta do Google" aria-label="Perfil do usuário">
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
    </header>
  );
};

export default Header;
