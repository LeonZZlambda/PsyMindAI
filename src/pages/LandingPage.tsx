import React, { useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation, Trans } from 'react-i18next'
import { useTheme } from '../context/ThemeContext'
import '../styles/landing.css'
import Footer from '../components/Footer'
import ScrollToTopButton from '../components/ScrollToTopButton'
import LandingHeader from '../components/LandingHeader'

const MotionLink = motion.create(Link)

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
          initial={{ y: 30 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
        >
          <h1 className="hero-title">
            <span className="gradient-text">{t('landing.hero.title_main')}</span><br />
            {t('landing.hero.title_sub')}
          </h1>
          <p className="hero-subtitle">
            {t('landing.hero.subtitle')}
          </p>
          
          <div className="hero-actions">
            <MotionLink 
              to="/chat"
              className="cta-btn"
              style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="material-symbols-outlined" aria-hidden="true">rocket_launch</span>
              {t('landing.hero.start_journey')}
            </MotionLink>
            <motion.a 
              href="#faq"
              className="secondary-btn"
              style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('landing.hero.learn_more')}
            </motion.a>
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
                <span className="material-symbols-outlined icon" aria-hidden="true">psychology</span>
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
                <span className="material-symbols-outlined icon" aria-hidden="true">psychology</span>
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
          <span className="material-symbols-outlined feature-icon" aria-hidden="true">school</span>
          <h2>{t('landing.features.study_focus.title')}</h2>
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
          <span className="material-symbols-outlined feature-icon" aria-hidden="true">self_improvement</span>
          <h2>{t('landing.features.anxiety_control.title')}</h2>
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
          <span className="material-symbols-outlined feature-icon" aria-hidden="true">schedule</span>
          <h2>{t('landing.features.always_available.title')}</h2>
          <p>{t('landing.features.always_available.description')}</p>
        </motion.div>
      </section>

      <section id="faq" className="faq-section" style={{ padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem', color: 'var(--text-color)' }}>Dúvidas Frequentes</h2>
        
        <details style={{ marginBottom: '1rem', padding: '1.2rem', background: 'var(--card-background)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <summary style={{ fontWeight: '600', cursor: 'pointer', fontSize: '1.1rem', color: 'var(--text-color)' }}>O PsyMind.AI substitui um psicólogo?</summary>
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>Não. O PsyMind.AI é uma ferramenta educativa de apoio emocional e organização de estudos. Ele não oferece diagnósticos clínicos nem substitui o acompanhamento de profissionais de saúde mental.</p>
        </details>
        
        <details style={{ marginBottom: '1rem', padding: '1.2rem', background: 'var(--card-background)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <summary style={{ fontWeight: '600', cursor: 'pointer', fontSize: '1.1rem', color: 'var(--text-color)' }}>Como a IA ajuda na minha rotina de estudos?</summary>
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>Nossa IA utiliza técnicas canônicas como Active Recall e Spaced Repetition para otimizar seu aprendizado, além de ajudar a identificar sinais de burnout e sugerir pausas estratégicas.</p>
        </details>
        
        <details style={{ marginBottom: '1rem', padding: '1.2rem', background: 'var(--card-background)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <summary style={{ fontWeight: '600', cursor: 'pointer', fontSize: '1.1rem', color: 'var(--text-color)' }}>Meus dados e conversas são privados?</summary>
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>Sim. Priorizamos a privacidade. Você pode utilizar o chat de forma anônima e possui controle total sobre o histórico de conversas e dados de telemetria.</p>
        </details>
      </section>

      <Footer />
      </motion.div>

      <ScrollToTopButton />
    </>
  )
}

export default LandingPage
