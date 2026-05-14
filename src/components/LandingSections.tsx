import React, { useState } from 'react'
import { m } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import TelemetryService from '../services/TelemetryService'
import DemoShowcase from './DemoShowcase'
import UserJourney from './UserJourney'

const LandingSections: React.FC = () => {
  const { t } = useTranslation(['landing', 'translation'])
  const [selectedTechnicalId, setSelectedTechnicalId] = useState('client_side')

  const techStack = [
    { name: 'TypeScript', icon: 'code', label: 'Strict Mode' },
    { name: 'React 18', icon: 'deployed_code', label: 'Context API' },
    { name: 'Vite', icon: 'bolt', label: 'Lightning Fast' },
    { name: 'Framer Motion', icon: 'animation', label: 'Smooth UX' },
    { name: 'Gemini AI', icon: 'psychology', label: 'LLM Support' },
    { name: 'i18next', icon: 'language', label: 'Localization' },
  ]

  const moduleCards = [
    {
      id: 'support',
      icon: 'support_agent',
      title: t('landing.modules.tools.support.title'),
      description: t('landing.modules.tools.support.description'),
      bullets: t('landing.modules.tools.support.bullets', { returnObjects: true }) as string[],
      accent: 'support',
    },
    {
      id: 'guided_learning',
      icon: 'school',
      title: t('landing.modules.tools.guided_learning.title'),
      description: t('landing.modules.tools.guided_learning.description'),
      bullets: t('landing.modules.tools.guided_learning.bullets', { returnObjects: true }) as string[],
      accent: 'guided',
    },
    {
      id: 'exams',
      icon: 'assignment',
      title: t('landing.modules.tools.exams.title'),
      description: t('landing.modules.tools.exams.description'),
      bullets: t('landing.modules.tools.exams.bullets', { returnObjects: true }) as string[],
      accent: 'exams',
    },
    {
      id: 'reflections',
      icon: 'auto_awesome',
      title: t('landing.modules.tools.reflections.title'),
      description: t('landing.modules.tools.reflections.description'),
      bullets: t('landing.modules.tools.reflections.bullets', { returnObjects: true }) as string[],
      accent: 'reflections',
    },
    {
      id: 'mood_tracker',
      icon: 'monitor_heart',
      title: t('landing.modules.tools.mood_tracker.title'),
      description: t('landing.modules.tools.mood_tracker.description'),
      bullets: t('landing.modules.tools.mood_tracker.bullets', { returnObjects: true }) as string[],
      accent: 'mood',
    },
    {
      id: 'emotional_journal',
      icon: 'menu_book',
      title: t('landing.modules.tools.emotional_journal.title'),
      description: t('landing.modules.tools.emotional_journal.description'),
      bullets: t('landing.modules.tools.emotional_journal.bullets', { returnObjects: true }) as string[],
      accent: 'journal',
    },
  ]

  const technicalItems = [
    {
      id: 'client_side',
      icon: 'shield',
      title: t('landing.technical.items.client_side.decision'),
      advantage: t('landing.technical.items.client_side.advantage'),
      disadvantage: t('landing.technical.items.client_side.disadvantage'),
      mitigation: t('landing.technical.items.client_side.mitigation'),
    },
    {
      id: 'gemini_api',
      icon: 'api',
      title: t('landing.technical.items.gemini_api.decision'),
      advantage: t('landing.technical.items.gemini_api.advantage'),
      disadvantage: t('landing.technical.items.gemini_api.disadvantage'),
      mitigation: t('landing.technical.items.gemini_api.mitigation'),
    },
    {
      id: 'ts_strict',
      icon: 'verified',
      title: t('landing.technical.items.ts_strict.decision'),
      advantage: t('landing.technical.items.ts_strict.advantage'),
      disadvantage: t('landing.technical.items.ts_strict.disadvantage'),
      mitigation: t('landing.technical.items.ts_strict.mitigation'),
    },
    {
      id: 'context_api',
      icon: 'account_tree',
      title: t('landing.technical.items.context_api.decision'),
      advantage: t('landing.technical.items.context_api.advantage'),
      disadvantage: t('landing.technical.items.context_api.disadvantage'),
      mitigation: t('landing.technical.items.context_api.mitigation'),
    },
  ]

  const activeTechnicalItem =
    technicalItems.find((item) => item.id === selectedTechnicalId) ?? technicalItems[0]

  return (
    <>
      <section id="about" className="about-section">
        <m.div
          className="section-header"
          onViewportEnter={() => TelemetryService.trackEvent('section_view', { section: 'about' })}
        >
          <h2>{t('landing.about.title')}</h2>
          <p>{t('landing.about.subtitle')}</p>
        </m.div>
        <div className="about-grid">
          <m.div
            className="about-text"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <p className="about-prose">{t('landing.about.p1')}</p>
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
        <div className="modules-grid">
          {moduleCards.map((item) => (
            <m.article
              key={item.id}
              className={`module-card module-card--${item.accent}`}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35 }}
            >
              <div className="module-card__header">
                <span className="material-symbols-outlined module-card__icon" aria-hidden="true">
                  {item.icon}
                </span>
                <div>
                  <p className="module-card__eyebrow">{t('landing.modules.card_eyebrow')}</p>
                  <h3>{item.title}</h3>
                </div>
              </div>
              <p className="module-card__description">{item.description}</p>
              <ul className="module-card__bullets">
                {item.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </m.article>
          ))}
        </div>

        <m.div
          className="section-header"
          onViewportEnter={() =>
            TelemetryService.trackEvent('section_view', { section: 'modules' })
          }
        >
          <h2>{t('landing.modules.title')}</h2>
          <p>{t('landing.modules.subtitle')}</p>
        </m.div>
      </section>

      <section id="accessibility" className="accessibility-section">
        <m.div
          className="section-header"
          onViewportEnter={() =>
            TelemetryService.trackEvent('section_view', { section: 'accessibility' })
          }
        >
          <h2>{t('landing.accessibility.title')}</h2>
          <p>{t('landing.accessibility.subtitle')}</p>
        </m.div>
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

      {/* Demo Showcase Section */}
      <DemoShowcase />

      {/* User Journey Section */}
      <UserJourney />

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
        <div className="technical-layout">
          <div className="technical-pill-row" aria-label={t('landing.technical.title')}>
            {technicalItems.map((item) => {
              const isActive = item.id === selectedTechnicalId

              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={isActive}
                  aria-controls="technical-tradeoffs-panel"
                  className={`tech-pill ${isActive ? 'is-active' : ''}`}
                  onClick={() => {
                    setSelectedTechnicalId(item.id)
                    TelemetryService.trackEvent('technical_decision_click', { item: item.id })
                  }}
                >
                  <span className="material-symbols-outlined" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span>{item.title}</span>
                </button>
              )
            })}
          </div>
          <div className="technical-accordion-shell">
            <m.div
              key={activeTechnicalItem.id}
              className="technical-shell"
              id="technical-tradeoffs-panel"
              role="region"
              aria-live="polite"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="technical-shell__header">
                <div className="technical-shell__icon">
                  <span className="material-symbols-outlined" aria-hidden="true">
                    {activeTechnicalItem.icon}
                  </span>
                </div>
                <div>
                  <p className="technical-shell__eyebrow">{t('landing.technical.table.decision')}</p>
                  <h3>{activeTechnicalItem.title}</h3>
                  <p>{t('landing.technical.summary.description')}</p>
                </div>
              </div>

              <div className="technical-tradeoffs-grid">
                <div className="tradeoff-card advantage">
                  <span className="tradeoff-label">✓ {t('landing.technical.table.advantage')}</span>
                  <p>{activeTechnicalItem.advantage}</p>
                </div>
                <div className="tradeoff-card disadvantage">
                  <span className="tradeoff-label">⚠ {t('landing.technical.table.disadvantage')}</span>
                  <p>{activeTechnicalItem.disadvantage}</p>
                </div>
                <div className="tradeoff-card mitigation">
                  <span className="tradeoff-label">🔧 {t('landing.technical.table.mitigation')}</span>
                  <p>{activeTechnicalItem.mitigation}</p>
                </div>
              </div>
            </m.div>
          </div>
        </div>
      </section>

      <section id="tech-stack" className="tech-stack-section">
        <m.div
          className="section-header"
          onViewportEnter={() =>
            TelemetryService.trackEvent('section_view', { section: 'tech_stack' })
          }
        >
          <h2>{t('landing.tech_stack.title')}</h2>
          <p>{t('landing.tech_stack.subtitle')}</p>
        </m.div>
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
