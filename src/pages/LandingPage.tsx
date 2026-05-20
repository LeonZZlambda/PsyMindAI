import React, { useRef, lazy, Suspense } from 'react'
import { m } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import '../styles/landing.css'
import '../styles/landing-enhanced.css'
import LandingHeader from '@/components/layout/LandingHeader'
import CTAButton from '@/components/ui/CTAButton'
import TelemetryService from '../services/TelemetryService'

// Lazy load non-critical components
const Footer = lazy(() => import('../components/layout/Footer'))
const ScrollToTopButton = lazy(() => import('../components/ui/ScrollToTopButton'))
const PsyBot = lazy(() => import('../components/chat/PsyBot'))
const LandingSections = lazy(() => import('../components/features/landing/LandingSections'))

const LandingPage: React.FC = () => {
  const landingPageRef = useRef<HTMLDivElement | null>(null)
  const { t } = useTranslation(['landing', 'translation'])

  return (
    <>
      <m.div
        ref={landingPageRef}
        className="landing-page"
        initial={false}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <LandingHeader />

        <main className="landing-hero">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="gradient-text">{t('landing.hero.title_main')}</span>
              <br />
              {t('landing.hero.title_sub')}
            </h1>
            <p className="hero-subtitle">{t('landing.hero.subtitle')}</p>

            <div className="hero-actions">
              <CTAButton
                href="/chat"
                label={t('landing.hero.start_journey')}
                icon="rocket_launch"
                variant="primary"
                type="internal"
                onClick={() =>
                  TelemetryService.trackEvent('landing_cta_click', { target: 'start_journey' })
                }
                ariaLabel={t('landing.hero.start_journey')}
              />
              <CTAButton
                href="https://github.com/LeonZZlambda/PsyMindAI"
                label={t('landing.hero.view_github')}
                icon="code"
                variant="secondary"
                type="external"
                onClick={() =>
                  TelemetryService.trackEvent('landing_cta_click', { target: 'github_hero' })
                }
                ariaLabel={t('landing.hero.view_github')}
              />
            </div>

          </div>

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
              <CTAButton
                href="/chat"
                label={t('landing.final_cta.button_chat')}
                variant="primary"
                type="internal"
                onClick={() =>
                  TelemetryService.trackEvent('landing_cta_click', { target: 'start_journey_final' })
                }
                ariaLabel={t('landing.final_cta.button_chat')}
              />
              <CTAButton
                href="https://github.com/LeonZZlambda/PsyMindAI"
                label={t('landing.final_cta.button_docs')}
                variant="secondary"
                type="external"
                onClick={() =>
                  TelemetryService.trackEvent('landing_cta_click', { target: 'github_final' })
                }
                ariaLabel={t('landing.final_cta.button_docs')}
              />
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
