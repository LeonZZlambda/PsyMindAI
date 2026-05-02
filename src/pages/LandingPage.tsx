import React, { useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation, Trans } from 'react-i18next'
import { useTheme } from '../context/ThemeContext'
import '../styles/landing.css'
import Footer from '../components/Footer'
import ScrollToTopButton from '../components/ScrollToTopButton'
import LandingHeader from '../components/LandingHeader'
import PsyBot from '../components/PsyBot'
import TelemetryService from '../services/TelemetryService'

const MotionLink = motion.create(Link)

const LandingPage: React.FC = () => {
  const { isDarkMode } = useTheme()
  const landingPageRef = useRef<HTMLDivElement | null>(null)
  const { t } = useTranslation()

  const techStack = [
    { name: 'TypeScript', icon: 'code', label: 'Strict Mode' },
    { name: 'React 18', icon: 'deployed_code', label: 'Context API' },
    { name: 'Vite', icon: 'bolt', label: 'Lightning Fast' },
    { name: 'Framer Motion', icon: 'animation', label: 'Smooth UX' },
    { name: 'Gemini AI', icon: 'psychology', label: 'LLM Support' },
    { name: 'i18next', icon: 'language', label: 'Localization' }
  ]

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
                href="https://github.com/LeonZZlambda/PsyMindAI"
                target="_blank"
                rel="noopener noreferrer"
                className="secondary-btn"
                style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none', gap: '0.5rem' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => TelemetryService.trackEvent('landing_cta_click', { target: 'github_hero' })}
              >
                <span className="material-symbols-outlined" aria-hidden="true">code</span>
                {t('landing.hero.view_github')}
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
              </div>
            </div>
          </motion.div>
        </main>

        <section id="about" className="about-section">
          <div className="about-grid">
            <motion.div 
              className="about-text"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2>{t('landing.about.title')}</h2>
              <p>{t('landing.about.p1')}</p>
              <div className="about-stats">
                <div className="stat-item">
                  <h3>{t('landing.about.mission.title')}</h3>
                  <p>{t('landing.about.mission.desc')}</p>
                </div>
                <div className="stat-item">
                  <h3>{t('landing.about.vision.title')}</h3>
                  <p>{t('landing.about.vision.desc')}</p>
                </div>
              </div>
            </motion.div>
            <motion.div 
              className="about-visual"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '12rem', color: 'var(--primary-color)', opacity: 0.8 }}>
                diversity_3
              </span>
            </motion.div>
          </div>
        </section>

        <section id="modules" className="features-section">
          <motion.div 
            className="section-header"
            onViewportEnter={() => TelemetryService.trackEvent('section_view', { section: 'modules' })}
          >
            <h2>{t('landing.modules.title')}</h2>
            <p>{t('landing.modules.subtitle')}</p>
          </motion.div>
          <div className="features-grid">
            <motion.div 
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ 
                scale: 1.05,
                transition: { type: 'spring', stiffness: 300, damping: 15 }
              }}
            >
              <span className="material-symbols-outlined feature-icon" aria-hidden="true">psychology_alt</span>
              <h3>{t('landing.modules.psybot.title')}</h3>
              <p>{t('landing.modules.psybot.desc')}</p>
            </motion.div>
            <motion.div 
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ 
                scale: 1.05,
                transition: { type: 'spring', stiffness: 300, damping: 15 }
              }}
            >
              <span className="material-symbols-outlined feature-icon" aria-hidden="true">assignment_ind</span>
              <h3>{t('landing.modules.vocational.title')}</h3>
              <p>{t('landing.modules.vocational.desc')}</p>
            </motion.div>
            <motion.div 
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ 
                scale: 1.05,
                transition: { type: 'spring', stiffness: 300, damping: 15 }
              }}
            >
              <span className="material-symbols-outlined feature-icon" aria-hidden="true">auto_graph</span>
              <h3>{t('landing.modules.insights.title')}</h3>
              <p>{t('landing.modules.insights.desc')}</p>
            </motion.div>
          </div>
        </section>

        <section id="accessibility" className="accessibility-section">
          <div className="section-header">
            <h2>{t('landing.accessibility.title')}</h2>
            <p>{t('landing.accessibility.subtitle')}</p>
          </div>
          <div className="accessibility-grid">
            <motion.div className="a11y-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="a11y-icon-wrapper"><span className="material-symbols-outlined">contrast</span></div>
              <h3>{t('landing.accessibility.contrast.title')}</h3>
              <p>{t('landing.accessibility.contrast.desc')}</p>
            </motion.div>
            <motion.div className="a11y-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <div className="a11y-icon-wrapper"><span className="material-symbols-outlined">keyboard</span></div>
              <h3>{t('landing.accessibility.keyboard.title')}</h3>
              <p>{t('landing.accessibility.keyboard.desc')}</p>
            </motion.div>
            <motion.div className="a11y-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <div className="a11y-icon-wrapper"><span className="material-symbols-outlined">record_voice_over</span></div>
              <h3>{t('landing.accessibility.screen_reader.title')}</h3>
              <p>{t('landing.accessibility.screen_reader.desc')}</p>
            </motion.div>
          </div>
        </section>

        <section id="technical" className="technical-section">
          <motion.div 
            className="section-header"
            onViewportEnter={() => TelemetryService.trackEvent('section_view', { section: 'technical_decisions' })}
          >
            <h2>{t('landing.technical.title')}</h2>
            <p>{t('landing.technical.subtitle')}</p>
          </motion.div>
          <div className="technical-grid">
            {['client_side', 'gemini_api', 'ts_strict', 'context_api'].map((item, idx) => (
              <motion.div 
                key={item}
                className="tradeoff-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="tradeoff-header">
                  <span className="material-symbols-outlined">
                    {item === 'client_side' ? 'shield' : item === 'gemini_api' ? 'api' : item === 'ts_strict' ? 'verified' : 'account_tree'}
                  </span>
                  <h3>{t(`landing.technical.items.${item}.decision`)}</h3>
                </div>
                <div className="tradeoff-content">
                  <div className="tradeoff-item advantage">
                    <span className="tradeoff-label">{t('landing.technical.table.advantage')}</span>
                    {t(`landing.technical.items.${item}.advantage`)}
                  </div>
                  <div className="tradeoff-item disadvantage">
                    <span className="tradeoff-label">{t('landing.technical.table.disadvantage')}</span>
                    {t(`landing.technical.items.${item}.disadvantage`)}
                  </div>
                  <div className="tradeoff-item mitigation">
                    <span className="tradeoff-label">{t('landing.technical.table.mitigation')}</span>
                    {t(`landing.technical.items.${item}.mitigation`)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="tech-stack" className="tech-stack-section">
          <div className="section-header">
            <h2>{t('landing.tech_stack.title')}</h2>
            <p>{t('landing.tech_stack.subtitle')}</p>
          </div>
          <motion.div 
            className="tech-badges"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {techStack.map((tech) => (
              <motion.div 
                key={tech.name}
                className="tech-badge"
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <span className="material-symbols-outlined">{tech.icon}</span>
                <span><strong>{tech.name}</strong> • {tech.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section className="final-cta">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 100 }}
          >
            <h2>{t('landing.final_cta.title')}</h2>
            <PsyBot isHappy={true} />
            <div className="hero-actions" style={{ justifyContent: 'center' }}>
              <MotionLink 
                to="/chat" 
                className="cta-btn" 
                style={{ textDecoration: 'none' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('landing.final_cta.button_chat')}
              </MotionLink>
              <motion.a 
                href="https://github.com/LeonZZlambda/PsyMindAI"
                target="_blank"
                rel="noopener noreferrer"
                className="secondary-btn"
                style={{ textDecoration: 'none' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => TelemetryService.trackEvent('landing_cta_click', { target: 'github_final' })}
              >
                {t('landing.final_cta.button_docs')}
              </motion.a>
            </div>
          </motion.div>
        </section>

        <Footer />
      </motion.div>

      <ScrollToTopButton />
    </>
  )
}

export default LandingPage
