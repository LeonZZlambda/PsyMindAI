import React, { useState, useRef, useEffect } from 'react'
import { m } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import TelemetryService from '@/services/TelemetryService'
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
      bullets:
        (t('landing.modules.tools.support.bullets', { returnObjects: true }) as string[]) ?? [],
      accent: 'support',
    },
    {
      id: 'guided_learning',
      icon: 'school',
      title: t('landing.modules.tools.guided_learning.title'),
      description: t('landing.modules.tools.guided_learning.description'),
      bullets:
        (t('landing.modules.tools.guided_learning.bullets', { returnObjects: true }) as string[]) ??
        [],
      accent: 'guided',
    },
    {
      id: 'exams',
      icon: 'assignment',
      title: t('landing.modules.tools.exams.title'),
      description: t('landing.modules.tools.exams.description'),
      bullets:
        (t('landing.modules.tools.exams.bullets', { returnObjects: true }) as string[]) ?? [],
      accent: 'exams',
    },
    {
      id: 'reflections',
      icon: 'auto_awesome',
      title: t('landing.modules.tools.reflections.title'),
      description: t('landing.modules.tools.reflections.description'),
      bullets:
        (t('landing.modules.tools.reflections.bullets', { returnObjects: true }) as string[]) ?? [],
      accent: 'reflections',
    },
    {
      id: 'mood_tracker',
      icon: 'monitor_heart',
      title: t('landing.modules.tools.mood_tracker.title'),
      description: t('landing.modules.tools.mood_tracker.description'),
      bullets:
        (t('landing.modules.tools.mood_tracker.bullets', { returnObjects: true }) as string[]) ??
        [],
      accent: 'mood',
    },
    {
      id: 'emotional_journal',
      icon: 'menu_book',
      title: t('landing.modules.tools.emotional_journal.title'),
      description: t('landing.modules.tools.emotional_journal.description'),
      bullets:
        (t('landing.modules.tools.emotional_journal.bullets', {
          returnObjects: true,
        }) as string[]) ?? [],
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

  const a11yItems = [
    {
      key: 'contrast',
      icon: 'contrast',
      title: t('landing.accessibility.contrast.title'),
      desc: t('landing.accessibility.contrast.desc'),
    },
    {
      key: 'keyboard',
      icon: 'keyboard',
      title: t('landing.accessibility.keyboard.title'),
      desc: t('landing.accessibility.keyboard.desc'),
    },
    {
      key: 'screen_reader',
      icon: 'record_voice_over',
      title: t('landing.accessibility.screen_reader.title'),
      desc: t('landing.accessibility.screen_reader.desc'),
    },
    {
      key: 'reduced_motion',
      icon: 'motion_photos_off',
      title: t('landing.accessibility.reduced_motion.title'),
      desc: t('landing.accessibility.reduced_motion.desc'),
    },
    {
      key: 'font_scaling',
      icon: 'text_fields',
      title: t('landing.accessibility.font_scaling.title'),
      desc: t('landing.accessibility.font_scaling.desc'),
    },
    {
      key: 'color_blind',
      icon: 'palette',
      title: t('landing.accessibility.color_blind.title'),
      desc: t('landing.accessibility.color_blind.desc'),
    },
  ]

  const carouselRef = useRef<HTMLDivElement>(null)
  const [activeDot, setActiveDot] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [visibleCount, setVisibleCount] = useState(3)
  // Passively-cached geometry — updated by ResizeObserver, never read during scroll
  const cachedCardWidth = useRef(0)
  const cachedContainerWidth = useRef(0)

  const updateVisibleCount = () => {
    const containerWidth = cachedContainerWidth.current
    const cardWidth = cachedCardWidth.current
    if (containerWidth > 0 && cardWidth > 0) {
      const count = Math.round(containerWidth / cardWidth)
      setVisibleCount(Math.max(1, Math.min(count, a11yItems.length)))
    }
  }

  const scroll = (direction: 'left' | 'right') => {
    const container = carouselRef.current
    if (!container) return

    if (direction === 'right' && !canScrollRight) {
      container.scrollTo({ left: 0, behavior: 'smooth' })
      return
    }

    // Use cached card width — no offsetWidth, no forced reflow
    const cardWidth = cachedCardWidth.current || 300
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }

  const handleScroll = () => {
    const container = carouselRef.current
    if (!container) return

    const scrollLeft = container.scrollLeft
    // scrollWidth and clientWidth are read once here during a scroll event —
    // this is acceptable because the browser already committed the layout before firing scroll.
    // We do NOT write to the DOM before reading, so there is no forced-reflow here.
    const maxScroll = container.scrollWidth - container.clientWidth

    setCanScrollLeft(scrollLeft > 5)
    setCanScrollRight(scrollLeft < maxScroll - 5)

    const cardWidth = cachedCardWidth.current
    if (cardWidth > 0) {
      const index = Math.round(scrollLeft / cardWidth)
      const maxIndex = Math.max(0, a11yItems.length - visibleCount)
      setActiveDot(Math.max(0, Math.min(index, maxIndex)))
    }
  }

  const scrollToCard = (index: number) => {
    const container = carouselRef.current
    if (!container) return
    const cardWidth = cachedCardWidth.current || 300
    container.scrollTo({ left: index * cardWidth, behavior: 'smooth' })
  }

  useEffect(() => {
    const container = carouselRef.current
    if (!container) return () => {}

    // ResizeObserver caches geometry passively — no forced reflow
    const ro = new ResizeObserver(() => {
      const firstCard = container.firstElementChild as HTMLElement | null
      if (firstCard) {
        // getBoundingClientRect inside ResizeObserver callback is safe:
        // the browser has already finished layout before calling back.
        const rect = firstCard.getBoundingClientRect()
        cachedCardWidth.current = rect.width + 24 // card + gap
      }
      cachedContainerWidth.current = container.getBoundingClientRect().width
      updateVisibleCount()
      handleScroll()
    })
    ro.observe(container)

    container.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      ro.disconnect()
      container.removeEventListener('scroll', handleScroll)
    }
  }, [visibleCount])

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
        <m.div
          className="section-header"
          onViewportEnter={() =>
            TelemetryService.trackEvent('section_view', { section: 'modules' })
          }
        >
          <h2>{t('landing.modules.title')}</h2>
          <p>{t('landing.modules.subtitle')}</p>
        </m.div>

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
                {Array.isArray(item.bullets)
                  ? item.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)
                  : null}
              </ul>
            </m.article>
          ))}
        </div>
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

        <div className="a11y-carousel-container">
          <button
            className={`carousel-btn prev-btn ${!canScrollLeft ? 'disabled' : ''}`}
            onClick={() => scroll('left')}
            aria-label={t('landing.accessibility.carousel.prev', {
              defaultValue: 'Previous slide',
            })}
            disabled={!canScrollLeft}
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>

          <div
            ref={carouselRef}
            className="accessibility-grid carousel-track"
            aria-label={t('landing.accessibility.title')}
          >
            {a11yItems.map((item, index) => (
              <m.div
                key={item.key}
                className="a11y-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="a11y-icon-wrapper">
                  <span className="material-symbols-outlined">{item.icon}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </m.div>
            ))}
          </div>

          <button
            className="carousel-btn next-btn"
            onClick={() => scroll('right')}
            aria-label={t('landing.accessibility.carousel.next', { defaultValue: 'Next slide' })}
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>

        <div className="carousel-dots" aria-label="Carousel pagination">
          {a11yItems.slice(0, Math.max(1, a11yItems.length - visibleCount + 1)).map((_, index) => (
            <button
              key={index}
              className={`dot-btn ${activeDot === index ? 'active' : ''}`}
              onClick={() => scrollToCard(index)}
              aria-label={t('landing.accessibility.carousel.go_to', {
                defaultValue: `Go to slide ${index + 1}`,
              })}
            />
          ))}
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
                  <p className="technical-shell__eyebrow">
                    {t('landing.technical.table.decision')}
                  </p>
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
                  <span className="tradeoff-label">
                    ⚠ {t('landing.technical.table.disadvantage')}
                  </span>
                  <p>{activeTechnicalItem.disadvantage}</p>
                </div>
                <div className="tradeoff-card mitigation">
                  <span className="tradeoff-label">
                    🔧 {t('landing.technical.table.mitigation')}
                  </span>
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
