import React from 'react'
import { m } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import TelemetryService from '../services/TelemetryService'

const LandingSections: React.FC = () => {
  const { t } = useTranslation(['landing', 'translation'])

  const techStack = [
    { name: 'TypeScript', icon: 'code', label: 'Strict Mode' },
    { name: 'React 18', icon: 'deployed_code', label: 'Context API' },
    { name: 'Vite', icon: 'bolt', label: 'Lightning Fast' },
    { name: 'Framer Motion', icon: 'animation', label: 'Smooth UX' },
    { name: 'Gemini AI', icon: 'psychology', label: 'LLM Support' },
    { name: 'i18next', icon: 'language', label: 'Localization' },
  ]

  return (
    <>
      <section id="about" className="about-section">
        <div className="about-grid">
          <m.div
            className="about-text"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
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
          </m.div>
          <m.div
            className="about-visual"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '12rem', color: 'var(--primary-color)', opacity: 0.8 }}
            >
              diversity_3
            </span>
          </m.div>
        </div>
      </section>

      <section id="modules" className="features-section">
        <m.div
          className="section-header"
          onViewportEnter={() =>
            TelemetryService.trackEvent('section_view', { section: 'modules' })
          }
        >
          <h2>{t('landing.modules.title')}</h2>
          <p>{t('landing.modules.subtitle')}</p>
        </m.div>
        <div className="features-grid">
          <m.div
            className="feature-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{
              scale: 1.05,
              transition: { type: 'spring', stiffness: 300, damping: 15 },
            }}
          >
            <span className="material-symbols-outlined feature-icon" aria-hidden="true">
              psychology_alt
            </span>
            <h3>{t('landing.modules.psybot.title')}</h3>
            <p>{t('landing.modules.psybot.desc')}</p>
          </m.div>
          <m.div
            className="feature-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{
              scale: 1.05,
              transition: { type: 'spring', stiffness: 300, damping: 15 },
            }}
          >
            <span className="material-symbols-outlined feature-icon" aria-hidden="true">
              assignment_ind
            </span>
            <h3>{t('landing.modules.vocational.title')}</h3>
            <p>{t('landing.modules.vocational.desc')}</p>
          </m.div>
          <m.div
            className="feature-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{
              scale: 1.05,
              transition: { type: 'spring', stiffness: 300, damping: 15 },
            }}
          >
            <span className="material-symbols-outlined feature-icon" aria-hidden="true">
              auto_graph
            </span>
            <h3>{t('landing.modules.insights.title')}</h3>
            <p>{t('landing.modules.insights.desc')}</p>
          </m.div>
        </div>
      </section>

      <section id="accessibility" className="accessibility-section">
        <div className="section-header">
          <h2>{t('landing.accessibility.title')}</h2>
          <p>{t('landing.accessibility.subtitle')}</p>
        </div>
        <div className="accessibility-grid">
          <m.div
            className="a11y-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="a11y-icon-wrapper">
              <span className="material-symbols-outlined">contrast</span>
            </div>
            <h3>{t('landing.accessibility.contrast.title')}</h3>
            <p>{t('landing.accessibility.contrast.desc')}</p>
          </m.div>
          <m.div
            className="a11y-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="a11y-icon-wrapper">
              <span className="material-symbols-outlined">keyboard</span>
            </div>
            <h3>{t('landing.accessibility.keyboard.title')}</h3>
            <p>{t('landing.accessibility.keyboard.desc')}</p>
          </m.div>
          <m.div
            className="a11y-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="a11y-icon-wrapper">
              <span className="material-symbols-outlined">record_voice_over</span>
            </div>
            <h3>{t('landing.accessibility.screen_reader.title')}</h3>
            <p>{t('landing.accessibility.screen_reader.desc')}</p>
          </m.div>
        </div>
      </section>

      <section id="technical" className="technical-section">
        <m.div
          className="section-header"
          onViewportEnter={() =>
            TelemetryService.trackEvent('section_view', { section: 'technical_decisions' })
          }
        >
          <h2>{t('landing.technical.title')}</h2>
          <p>{t('landing.technical.subtitle')}</p>
        </m.div>
        <div className="technical-grid">
          {['client_side', 'gemini_api', 'ts_strict', 'context_api'].map((item, idx) => (
            <m.div
              key={item}
              className="tradeoff-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="tradeoff-header">
                <span className="material-symbols-outlined">
                  {item === 'client_side'
                    ? 'shield'
                    : item === 'gemini_api'
                      ? 'api'
                      : item === 'ts_strict'
                        ? 'verified'
                        : 'account_tree'}
                </span>
                <h3>{t(`landing.technical.items.${item}.decision`)}</h3>
              </div>
              <div className="tradeoff-content">
                <div className="tradeoff-item advantage">
                  <span className="tradeoff-label">{t('landing.technical.table.advantage')}</span>
                  {t(`landing.technical.items.${item}.advantage`)}
                </div>
                <div className="tradeoff-item disadvantage">
                  <span className="tradeoff-label">
                    {t('landing.technical.table.disadvantage')}
                  </span>
                  {t(`landing.technical.items.${item}.disadvantage`)}
                </div>
                <div className="tradeoff-item mitigation">
                  <span className="tradeoff-label">{t('landing.technical.table.mitigation')}</span>
                  {t(`landing.technical.items.${item}.mitigation`)}
                </div>
              </div>
            </m.div>
          ))}
        </div>
      </section>

      <section id="tech-stack" className="tech-stack-section">
        <div className="section-header">
          <h2>{t('landing.tech_stack.title')}</h2>
          <p>{t('landing.tech_stack.subtitle')}</p>
        </div>
        <m.div
          className="tech-badges"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {techStack.map((tech) => (
            <m.div
              key={tech.name}
              className="tech-badge"
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <span className="material-symbols-outlined">{tech.icon}</span>
              <span>
                <strong>{tech.name}</strong> • {tech.label}
              </span>
            </m.div>
          ))}
        </m.div>
      </section>
    </>
  )
}

export default LandingSections
