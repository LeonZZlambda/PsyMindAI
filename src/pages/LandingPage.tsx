import React, { useRef, lazy, Suspense } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { m } from 'framer-motion'
import { useTranslation, Trans } from 'react-i18next'
import { useTheme } from '../hooks/context/useTheme'
import '../styles/landing.css'
import LandingHeader from '../components/LandingHeader'
import TelemetryService from '../services/TelemetryService'

// Lazy load non-critical components
const Footer = lazy(() => import('../components/Footer'))
const ScrollToTopButton = lazy(() => import('../components/ScrollToTopButton'))
const PsyBot = lazy(() => import('../components/PsyBot'))
const LandingSections = lazy(() => import('../components/LandingSections'))

const MotionLink = m.create(Link)

const LandingPage: React.FC = () => {
  const { isDarkMode } = useTheme()
  const landingPageRef = useRef<HTMLDivElement | null>(null)
  const { t } = useTranslation(['landing', 'translation'])

  return (
    <>
      <m.div
        ref={landingPageRef}
        className="landing-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <LandingHeader />

        <main className="landing-hero">
          <m.div
            className="hero-content"
            initial={{ y: 30 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
          >
            <h1 className="hero-title">
              <span className="gradient-text">{t('landing.hero.title_main')}</span>
              <br />
              {t('landing.hero.title_sub')}
            </h1>
            <p className="hero-subtitle">{t('landing.hero.subtitle')}</p>

            <div className="hero-actions">
              <MotionLink
                to="/chat"
                className="cta-btn"
                style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  rocket_launch
                </span>
                {t('landing.hero.start_journey')}
              </MotionLink>
              <m.a
                href="https://github.com/LeonZZlambda/PsyMindAI"
                target="_blank"
                rel="noopener noreferrer"
                className="secondary-btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  gap: '0.5rem',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  TelemetryService.trackEvent('landing_cta_click', { target: 'github_hero' })
                }
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  code
                </span>
                {t('landing.hero.view_github')}
              </m.a>
            </div>
          </m.div>

          <m.div
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
                <m.div
                  className="chat-bubble ai"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 }}
                >
                  <span className="material-symbols-outlined icon" aria-hidden="true">
                    psychology
                  </span>
                  <div className="text">
                    <div className="line w-75"></div>
                    <div className="line w-50"></div>
                  </div>
                </m.div>
                <m.div
                  className="chat-bubble user"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.5 }}
                >
                  <div className="text">
                    <div className="line w-60"></div>
                  </div>
                </m.div>
              </div>
            </div>
          </m.div>
        </main>

        {/* Lazy load non-critical sections */}
        <Suspense fallback={<div className="loading-sections" />}>
          <LandingSections />
        </Suspense>

        <section className="final-cta">
          <m.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 100 }}
          >
            <h2>{t('landing.final_cta.title')}</h2>
            <Suspense fallback={<div className="psybot-placeholder" />}>
              <PsyBot isHappy={true} />
            </Suspense>
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
              <m.a
                href="https://github.com/LeonZZlambda/PsyMindAI"
                target="_blank"
                rel="noopener noreferrer"
                className="secondary-btn"
                style={{ textDecoration: 'none' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  TelemetryService.trackEvent('landing_cta_click', { target: 'github_final' })
                }
              >
                {t('landing.final_cta.button_docs')}
              </m.a>
            </div>
          </m.div>
        </section>

        <Suspense fallback={<div className="footer-placeholder" />}>
          <Footer />
        </Suspense>
      </m.div>

      <Suspense fallback={null}>
        <ScrollToTopButton />
      </Suspense>
    </>
  )
}

export default LandingPage
