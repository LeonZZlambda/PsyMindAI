import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import '../styles/roadmap.css';
import Footer from '../components/Footer';
import ScrollToTopButton from '../components/ScrollToTopButton';
import LandingHeader from '../components/LandingHeader';

const RoadmapPage = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const roadmapItems = t('roadmap_page.phases', { returnObjects: true });

  return (
    <motion.div 
      className="landing-page roadmap-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <LandingHeader />

      <main className="roadmap-content">
        <div className="roadmap-header">
          <h1>{t('roadmap_page.title')}</h1>
          <p>{t('roadmap_page.subtitle')}</p>
        </div>

        <div className="roadmap-timeline">
          {roadmapItems.map((phase, index) => (
            <motion.div 
              key={index}
              className={`roadmap-card ${phase.status}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="card-status-indicator">
                <span className="material-symbols-outlined">
                  {phase.status === 'completed' ? 'check_circle' : 
                   phase.status === 'in_progress' ? 'pending' : 'schedule'}
                </span>
                <span>{phase.status === 'completed' ? t('roadmap_page.statuses.completed') : 
                       phase.status === 'in_progress' ? t('roadmap_page.statuses.in_progress') : t('roadmap_page.statuses.planned')}</span>
              </div>
              <div className="card-header">
                <span className="quarter-badge">{phase.quarter}</span>
                <h2>{phase.title}</h2>
              </div>
              <ul className="feature-list">
                {phase.items.map((item, i) => (
                  <li key={i}>
                    <span className="material-symbols-outlined">arrow_right</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </main>

      <Footer />
      <ScrollToTopButton />
    </motion.div>
  );
};

export default RoadmapPage;
