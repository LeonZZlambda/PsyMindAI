import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import Footer from '../components/Footer';
import ScrollToTopButton from '../components/ScrollToTopButton';
import LandingHeader from '../components/LandingHeader';

const ContributePage = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const contributeCards = t('contribute_page.cards', { returnObjects: true });

  return (
    <motion.div 
      className="landing-page contribute-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <LandingHeader />

      <main className="contribute-content">
        <div className="contribute-header">
          <h1>{t('contribute_page.title')}</h1>
          <p>{t('contribute_page.subtitle')}</p>
        </div>

        <div className="contribute-grid">
          {contributeCards.map((card, idx) => (
            <motion.div 
              key={idx}
              className="contribute-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (idx + 1) * 0.1 }}
            >
              <div className={`icon-box ${card.icon}`}>
                <span className="material-symbols-outlined">{card.icon}</span>
              </div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <a 
                href={idx === 0 ? "https://github.com/LeonZZlambda/PsyMindAI" : "#"}
                target={idx === 0 ? "_blank" : undefined}
                rel={idx === 0 ? "noopener noreferrer" : undefined}
                className="text-link"
                onClick={(e) => {
                  if (idx === 1) {
                    e.preventDefault();
                    navigate('/style-guide');
                  } else if (idx === 3) {
                    e.preventDefault();
                    window.open('https://github.com/LeonZZlambda/PsyMindAI/tree/main/src/i18n', '_blank');
                  }
                }}
              >
                {card.link_text} <span className="material-symbols-outlined">arrow_forward</span>
              </a>
            </motion.div>
          ))}
        </div>

        <div className="steps-section">
          <h2>{t('contribute_page.steps.title')}</h2>
          <div className="steps-list">
            {t('contribute_page.steps.items', { returnObjects: true }).map((step, idx) => (
              <div key={idx} className="step-item">
                <div className="step-number">{step.number}</div>
                <div className="step-text">
                  <h4>{step.title}</h4>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <ScrollToTopButton />
    </motion.div>
  );
};

export default ContributePage;
