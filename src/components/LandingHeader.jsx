import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const LandingHeader = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

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
            title={isDarkMode ? "Modo claro" : "Modo escuro"}
            aria-label={isDarkMode ? "Ativar modo claro" : "Ativar modo escuro"}
          >
            <span className="material-symbols-outlined">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </motion.button>
          
          <motion.button 
            className="user-profile" 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            title="Conta do Google" 
            aria-label="Perfil do usuário"
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
            Começar
          </motion.button>
        </div>
      </div>
    </nav>
  );
};

export default LandingHeader;
