import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Header = ({ isSidebarOpen, toggleSidebar }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className="header">
      <div className="header-left">
        {!isSidebarOpen && (
          <button 
            className="header-btn menu-toggle" 
            onClick={toggleSidebar} 
            title="Abrir menu"
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
          title={isDarkMode ? "Modo claro" : "Modo escuro"}
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
    </header>
  );
};

export default Header;
