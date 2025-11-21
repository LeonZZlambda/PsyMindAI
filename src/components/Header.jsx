import React from 'react';

const Header = ({ isSidebarOpen, toggleSidebar, isDarkMode, toggleTheme }) => {
  return (
    <header className="header">
      <div className="header-left">
        {!isSidebarOpen && (
          <button className="header-btn menu-toggle" onClick={toggleSidebar} title="Abrir menu">
            <span className="material-symbols-outlined">menu</span>
          </button>
        )}
        <div className="logo">
          <div className="logo-icon">
            <span className="material-symbols-outlined">psychology</span>
          </div>
          <h1>PsyMind.AI</h1>
        </div>
      </div>
      <div className="header-actions">
        <button className="header-btn" onClick={toggleTheme} title={isDarkMode ? "Modo claro" : "Modo escuro"}>
          <span className="material-symbols-outlined">
            {isDarkMode ? 'light_mode' : 'dark_mode'}
          </span>
        </button>
        <div className="user-profile" title="Conta do Google">
          <span className="material-symbols-outlined">account_circle</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
