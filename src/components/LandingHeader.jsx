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
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          onClick={() => navigate('/')}
        >
          <div className="logo-icon">
            <span className="material-symbols-outlined">psychology</span>
          </div>
          <span>PsyMind.AI</span>
        </motion.div>

        <motion.div
          className="landing-nav-links"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <button className="nav-link" onClick={() => navigate('/roadmap')}>Roadmap</button>
          <button className="nav-link" onClick={() => navigate('/contribute')}>Contribuir</button>

          <button
            className="header-btn"
            onClick={toggleTheme}
            title={isDarkMode ? 'Modo claro' : 'Modo escuro'}
            style={{ marginLeft: '0.25rem' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          <motion.button
            className="cta-btn"
            onClick={() => navigate('/chat')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{ marginLeft: '0.25rem' }}
          >
            Começar
          </motion.button>
        </motion.div>
      </div>
    </nav>
  );
};

export default LandingHeader;
