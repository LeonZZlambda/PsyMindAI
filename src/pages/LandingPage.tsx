import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation, Trans } from 'react-i18next'
import { useTheme } from '../context/ThemeContext'
import '../styles/landing.css'
import Footer from '../components/Footer'
import ScrollToTopButton from '../components/ScrollToTopButton'
import LandingHeader from '../components/LandingHeader'

const LandingPage: React.FC = () => {
  const navigate = useNavigate()
  const { isDarkMode } = useTheme()
  const landingPageRef = useRef<HTMLDivElement | null>(null)
  const { t } = useTranslation()

  return (
    <>
      <motion.div 
        ref={landingPageRef}
        className="landing-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <LandingHeader />

      <main className="landing-hero">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        >
          <h1 className="hero-title">
            <span className="gradient-text">{t('landing.hero.title_main')}</span><br />
            {t('landing.hero.title_sub')}
          </h1>
          <p className="hero-subtitle">
            {t('landing.hero.subtitle')}
          </p>
          
          <div className="hero-actions">
            <motion.button 
              className="cta-btn"
              onClick={() => navigate('/chat')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="material-symbols-outlined">rocket_launch</span>
              {t('landing.hero.start_journey')}
            </motion.button>
            <motion.button 
              className="secondary-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('landing.hero.learn_more')}
            </motion.button>
          </div>
        </motion.div>

        <motion.div 
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="visual-card">
            <div className="card-header">
              <div className="dot red"></div>
              <div className="dot yellow"></div>
              <div className="dot green"></div>
            </div>
            <div className="card-content">
              <motion.div 
                className="chat-bubble ai"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 }}
              >
                <span className="material-symbols-outlined icon">psychology</span>
                <div className="text">
                  <div className="line w-75"></div>
                  <div className="line w-50"></div>
                </div>
              </motion.div>
              <motion.div 
                className="chat-bubble user"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5 }}
              >
                <div className="text">
                  <div className="line w-60"></div>
                </div>
              </motion.div>
              <motion.div 
                className="chat-bubble ai"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.0 }}
              >
                <span className="material-symbols-outlined icon">psychology</span>
                <div className="text">
                  <div className="line w-80"></div>
                  <div className="line w-40"></div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </main>

      <section className="features-section">
        <motion.div 
          className="feature-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -5 }}
        >
          <span className="material-symbols-outlined feature-icon">school</span>
          <h3>{t('landing.features.study_focus.title')}</h3>
          <p>{t('landing.features.study_focus.description')}</p>
        </motion.div>
        <motion.div 
          className="feature-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          whileHover={{ y: -5 }}
        >
          <span className="material-symbols-outlined feature-icon">self_improvement</span>
          <h3>{t('landing.features.anxiety_control.title')}</h3>
          <p>{t('landing.features.anxiety_control.description')}</p>
        </motion.div>
        <motion.div 
          className="feature-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          whileHover={{ y: -5 }}
        >
          <span className="material-symbols-outlined feature-icon">schedule</span>
          <h3>{t('landing.features.always_available.title')}</h3>
          <p>{t('landing.features.always_available.description')}</p>
        </motion.div>
      </section>

      <Footer />
      </motion.div>

      <ScrollToTopButton />
    </>
  )
}

export default LandingPage
