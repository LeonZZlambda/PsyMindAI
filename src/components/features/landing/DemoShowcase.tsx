import React, { useRef, useEffect } from 'react'
import { m } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import TelemetryService from '@/services/TelemetryService'

type MockupId =
  | 'guided_learning'
  | 'exams'
  | 'reflections'
  | 'mood_tracker'
  | 'pomodoro'
  | 'soundscapes'
  | 'study_stats'

const DemoShowcase: React.FC = () => {
  const { t } = useTranslation(['landing', 'learning', 'reflections', 'translation'])

  const guidedLearningFeatures = t('landing.demo.guided_learning.features', {
    returnObjects: true,
  }) as string[]
  const examsFeatures = t('landing.demo.exams.features', { returnObjects: true }) as string[]
  const reflectionsFeatures = t('landing.demo.reflections.features', {
    returnObjects: true,
  }) as string[]
  const moodTrackerFeatures = t('landing.demo.mood_tracker.features', {
    returnObjects: true,
  }) as string[]
  const pomodoroFeatures = t('landing.demo.pomodoro.features', { returnObjects: true }) as string[]
  const soundscapesFeatures = t('landing.demo.soundscapes.features', {
    returnObjects: true,
  }) as string[]
  const studyStatsFeatures = t('landing.demo.study_stats.features', {
    returnObjects: true,
  }) as string[]

  const mockups: Array<{
    id: MockupId
    title: string
    description: string
    icon: string
    features: string[]
  }> = [
    {
      id: 'guided_learning',
      title: t('guided_learning.title', { ns: 'learning' }),
      description: t('landing.demo.guided_learning.description'),
      icon: 'school',
      features: guidedLearningFeatures,
    },
    {
      id: 'exams',
      title: t('learning:exams.title'),
      description: t('landing.demo.exams.description'),
      icon: 'workspace_premium',
      features: examsFeatures,
    },
    {
      id: 'reflections',
      title: t('reflections.title', { ns: 'reflections' }),
      description: t('landing.demo.reflections.description'),
      icon: 'auto_awesome',
      features: reflectionsFeatures,
    },
    {
      id: 'mood_tracker',
      title: t('landing.demo.mood_tracker.preview.title'),
      description: t('landing.demo.mood_tracker.description'),
      icon: 'mood',
      features: moodTrackerFeatures,
    },
    {
      id: 'pomodoro',
      title: t('landing.demo.pomodoro.preview.title'),
      description: t('landing.demo.pomodoro.description'),
      icon: 'timer',
      features: pomodoroFeatures,
    },
    {
      id: 'soundscapes',
      title: t('landing.demo.soundscapes.preview.title'),
      description: t('landing.demo.soundscapes.description'),
      icon: 'headphones',
      features: soundscapesFeatures,
    },
    {
      id: 'study_stats',
      title: t('landing.demo.study_stats.preview.title'),
      description: t('landing.demo.study_stats.description'),
      icon: 'insights',
      features: studyStatsFeatures,
    },
  ]

  const carouselRef = useRef<HTMLDivElement>(null)
  const setOneRef = useRef<HTMLDivElement>(null)
  const isHovered = useRef(false)
  const exactScrollLeft = useRef(0)

  useEffect(() => {
    let animationId: number
    let manualScrollTimeout: ReturnType<typeof setTimeout>
    let isManualScrolling = false
    let lastTime = performance.now()

    // Detect manual scrolling so we don't fight it
    const handleScroll = () => {
      if (carouselRef.current) {
        // Keep our exact tracker in sync with manual scrolling!
        exactScrollLeft.current = carouselRef.current.scrollLeft
      }
      isManualScrolling = true
      clearTimeout(manualScrollTimeout)
      manualScrollTimeout = setTimeout(() => {
        isManualScrolling = false
        lastTime = performance.now() // reset delta calculation
      }, 500) // Resume auto-scroll after 500ms of no scrolling
    }

    const container = carouselRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true })
    }

    const playScroll = (time: number) => {
      const delta = time - lastTime
      lastTime = time

      if (!isHovered.current && !isManualScrolling && container && setOneRef.current) {
        // Scroll exactly the width of one set + the gap
        // Using a closure variable or memoization would be slightly better, but avoiding layout thrashing in RAF:
        const cachedWidth = (setOneRef.current as any).cachedWidth || setOneRef.current.offsetWidth
        ;(setOneRef.current as any).cachedWidth = cachedWidth
        const setWidth = cachedWidth
        const gap = 32 // 2rem
        const resetPoint = setWidth + gap

        // Smooth floating point increment: 30 pixels per second -> ~0.5px per 16ms frame (at 60 FPS)
        // Using delta makes it equally fast regardless of the monitor's refresh rate!
        exactScrollLeft.current += (30 * delta) / 1000

        if (exactScrollLeft.current >= resetPoint) {
          exactScrollLeft.current -= resetPoint
        }

        container.scrollLeft = exactScrollLeft.current
      }

      animationId = requestAnimationFrame(playScroll)
    }

    animationId = requestAnimationFrame(playScroll)

    return () => {
      cancelAnimationFrame(animationId)
      if (container) container.removeEventListener('scroll', handleScroll)
      clearTimeout(manualScrollTimeout)
    }
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 400 // card width + gap
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  const renderPreview = (mockupId: MockupId) => {
    if (mockupId === 'guided_learning') {
      return (
        <div className="tool-preview guided-preview">
          <div className="preview-hero">
            <div>
              <p className="preview-eyebrow">
                {t('guided_learning.tabs.trails', { ns: 'learning' })}
              </p>
              <strong>{t('landing.demo.guided_learning.preview.title')}</strong>
            </div>
            <div className="preview-pill">
              <span className="material-symbols-outlined" aria-hidden="true">
                auto_stories
              </span>
              <span>{t('landing.demo.guided_learning.preview.badge')}</span>
            </div>
          </div>
          <div className="guided-preview__trail">
            <div className="guided-preview__trail-icon">
              <span className="material-symbols-outlined" aria-hidden="true">
                psychology
              </span>
            </div>
            <div className="guided-preview__trail-copy">
              <strong>{t('landing.demo.guided_learning.preview.trail_title')}</strong>
              <span>{t('landing.demo.guided_learning.preview.trail_description')}</span>
            </div>
          </div>
          <div className="guided-preview__steps">
            <div className="guided-step">
              <span className="material-symbols-outlined" aria-hidden="true">
                quiz
              </span>
              <span>{t('guided_learning.tabs.flashcards', { ns: 'learning' })}</span>
            </div>
            <div className="guided-step active">
              <span className="material-symbols-outlined" aria-hidden="true">
                check_circle
              </span>
              <span>{t('landing.demo.guided_learning.preview.step_active')}</span>
            </div>
            <div className="guided-step">
              <span className="material-symbols-outlined" aria-hidden="true">
                rocket_launch
              </span>
              <span>{t('guided_learning.tabs.quizzes', { ns: 'learning' })}</span>
            </div>
          </div>
          <div className="guided-preview__footer">
            <span className="material-symbols-outlined" aria-hidden="true">
              ios_share
            </span>
            <span>{t('landing.demo.guided_learning.preview.footer')}</span>
          </div>
        </div>
      )
    }

    if (mockupId === 'exams') {
      return (
        <div className="tool-preview exams-preview">
          <div className="preview-hero">
            <div>
              <p className="preview-eyebrow">{t('learning:exams.categories_title.national')}</p>
              <strong>{t('landing.demo.exams.preview.title')}</strong>
            </div>
            <div className="preview-pill preview-pill--soft">
              <span className="material-symbols-outlined" aria-hidden="true">
                workspace_premium
              </span>
              <span>{t('landing.demo.exams.preview.badge')}</span>
            </div>
          </div>
          <div className="exams-preview__chips">
            <span className="mockup-tag">{t('learning:exams.categories_title.national')}</span>
            <span className="mockup-tag">{t('learning:exams.categories_title.regional')}</span>
            <span className="mockup-tag">{t('learning:exams.categories_title.olympiads')}</span>
          </div>
          <div className="exams-preview__panel">
            <div className="exams-preview__panel-top">
              <div>
                <strong>{t('landing.demo.exams.preview.exam_name')}</strong>
                <span>{t('landing.demo.exams.preview.exam_subtitle')}</span>
              </div>
              <span className="exams-preview__score">{t('landing.demo.exams.preview.score')}</span>
            </div>
            <div className="exams-preview__actions">
              <span className="exams-action active">
                {t('landing.demo.exams.preview.action_plan')}
              </span>
              <span className="exams-action">{t('landing.demo.exams.preview.action_quiz')}</span>
              <span className="exams-action">{t('landing.demo.exams.preview.action_judge')}</span>
            </div>
          </div>
          <div className="guided-preview__footer">
            <span className="material-symbols-outlined" aria-hidden="true">
              route
            </span>
            <span>{t('landing.demo.exams.preview.footer')}</span>
          </div>
        </div>
      )
    }

    if (mockupId === 'reflections') {
      return (
        <div className="tool-preview reflections-preview">
          <div className="preview-hero">
            <div>
              <p className="preview-eyebrow">
                {t('reflections.tabs.daily', { ns: 'reflections' })}
              </p>
              <strong>{t('landing.demo.reflections.preview.title')}</strong>
            </div>
            <div className="preview-pill">
              <span className="material-symbols-outlined" aria-hidden="true">
                self_improvement
              </span>
              <span>{t('landing.demo.reflections.preview.badge')}</span>
            </div>
          </div>
          <div className="reflections-preview__quote">
            <span className="material-symbols-outlined" aria-hidden="true">
              format_quote
            </span>
            <p>{t('landing.demo.reflections.preview.quote')}</p>
            <strong>{t('landing.demo.reflections.preview.author')}</strong>
          </div>
          <div className="mockup-tag-row">
            <span className="mockup-tag">{t('reflections.tabs.daily', { ns: 'reflections' })}</span>
            <span className="mockup-tag">
              {t('reflections.tabs.explore', { ns: 'reflections' })}
            </span>
            <span className="mockup-tag">
              {t('reflections.tabs.breathing', { ns: 'reflections' })}
            </span>
          </div>
          <div className="reflections-preview__actions">
            <div className="preview-action">
              <span className="material-symbols-outlined" aria-hidden="true">
                format_quote
              </span>
              <span>{t('landing.demo.reflections.preview.action_reflect')}</span>
            </div>
            <div className="preview-action">
              <span className="material-symbols-outlined" aria-hidden="true">
                air
              </span>
              <span>{t('landing.demo.reflections.preview.action_breathe')}</span>
            </div>
            <div className="preview-action">
              <span className="material-symbols-outlined" aria-hidden="true">
                explore
              </span>
              <span>{t('landing.demo.reflections.preview.action_explore')}</span>
            </div>
          </div>
          <div className="guided-preview__footer">
            <span className="material-symbols-outlined" aria-hidden="true">
              auto_awesome
            </span>
            <span>{t('landing.demo.reflections.preview.footer')}</span>
          </div>
        </div>
      )
    }

    if (mockupId === 'mood_tracker') {
      return (
        <div className="tool-preview mood-preview">
          <div className="preview-hero">
            <div>
              <p className="preview-eyebrow">{t('landing.demo.mood_tracker.preview.badge')}</p>
              <strong>{t('landing.demo.mood_tracker.preview.title')}</strong>
            </div>
            <div className="preview-pill">
              <span className="material-symbols-outlined" aria-hidden="true">
                mood
              </span>
              <span>{t('landing.demo.mood_tracker.preview.badge')}</span>
            </div>
          </div>
          <div className="mood-preview__question">
            <strong>{t('landing.demo.mood_tracker.preview.question')}</strong>
          </div>
          <div className="mood-preview__options">
            <div className="mood-option active">
              <span className="material-symbols-outlined">sentiment_very_satisfied</span>
              <span>{t('landing.demo.mood_tracker.preview.mood_great')}</span>
            </div>
            <div className="mood-option">
              <span className="material-symbols-outlined">sentiment_satisfied</span>
              <span>{t('landing.demo.mood_tracker.preview.mood_good')}</span>
            </div>
            <div className="mood-option">
              <span className="material-symbols-outlined">sentiment_neutral</span>
              <span>{t('landing.demo.mood_tracker.preview.mood_okay')}</span>
            </div>
          </div>
          <div className="guided-preview__footer">
            <span className="material-symbols-outlined" aria-hidden="true">
              analytics
            </span>
            <span>{t('landing.demo.mood_tracker.preview.footer')}</span>
          </div>
        </div>
      )
    }

    if (mockupId === 'pomodoro') {
      return (
        <div className="tool-preview pomodoro-preview">
          <div className="preview-hero">
            <div>
              <p className="preview-eyebrow">{t('landing.demo.pomodoro.preview.badge')}</p>
              <strong>{t('landing.demo.pomodoro.preview.title')}</strong>
            </div>
            <div className="preview-pill preview-pill--soft">
              <span className="material-symbols-outlined" aria-hidden="true">
                timer
              </span>
              <span>{t('landing.demo.pomodoro.preview.badge')}</span>
            </div>
          </div>
          <div className="pomodoro-preview__circle">
            <div className="pomodoro-preview__time">{t('landing.demo.pomodoro.preview.time')}</div>
            <div className="pomodoro-preview__type">
              {t('landing.demo.pomodoro.preview.session_type')}
            </div>
          </div>
          <div className="pomodoro-preview__action">
            <span className="material-symbols-outlined">play_arrow</span>
            <span>{t('landing.demo.pomodoro.preview.action_start')}</span>
          </div>
          <div className="guided-preview__footer">
            <span className="material-symbols-outlined" aria-hidden="true">
              schedule
            </span>
            <span>{t('landing.demo.pomodoro.preview.footer')}</span>
          </div>
        </div>
      )
    }

    if (mockupId === 'soundscapes') {
      return (
        <div className="tool-preview soundscapes-preview">
          <div className="preview-hero">
            <div>
              <p className="preview-eyebrow">{t('landing.demo.soundscapes.preview.badge')}</p>
              <strong>{t('landing.demo.soundscapes.preview.title')}</strong>
            </div>
            <div className="preview-pill">
              <span className="material-symbols-outlined" aria-hidden="true">
                headphones
              </span>
              <span>{t('landing.demo.soundscapes.preview.badge')}</span>
            </div>
          </div>
          <div className="soundscapes-preview__playing">
            <div className="soundscapes-preview__icon">
              <span className="material-symbols-outlined">music_note</span>
            </div>
            <div className="soundscapes-preview__info">
              <strong>{t('landing.demo.soundscapes.preview.now_playing')}</strong>
              <span>{t('landing.demo.soundscapes.preview.volume')}</span>
            </div>
          </div>
          <div className="soundscapes-preview__bars">
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
          <div className="guided-preview__footer">
            <span className="material-symbols-outlined" aria-hidden="true">
              graphic_eq
            </span>
            <span>{t('landing.demo.soundscapes.preview.footer')}</span>
          </div>
        </div>
      )
    }

    return (
      <div className="tool-preview stats-preview">
        <div className="preview-hero">
          <div>
            <p className="preview-eyebrow">{t('landing.demo.study_stats.preview.badge')}</p>
            <strong>{t('landing.demo.study_stats.preview.title')}</strong>
          </div>
          <div className="preview-pill preview-pill--soft">
            <span className="material-symbols-outlined" aria-hidden="true">
              insights
            </span>
            <span>{t('landing.demo.study_stats.preview.badge')}</span>
          </div>
        </div>
        <div className="stats-preview__row">
          <div className="stats-card">
            <span className="material-symbols-outlined">local_fire_department</span>
            <strong>{t('landing.demo.study_stats.preview.stat_streak')}</strong>
          </div>
          <div className="stats-card">
            <span className="material-symbols-outlined">schedule</span>
            <strong>{t('landing.demo.study_stats.preview.stat_hours')}</strong>
          </div>
        </div>
        <div className="stats-preview__chart">
          <p>{t('landing.demo.study_stats.preview.chart_label')}</p>
          <div className="chart-bars">
            <div className="c-bar h-40"></div>
            <div className="c-bar h-70"></div>
            <div className="c-bar h-100"></div>
            <div className="c-bar h-30"></div>
            <div className="c-bar h-80"></div>
          </div>
        </div>
        <div className="guided-preview__footer">
          <span className="material-symbols-outlined" aria-hidden="true">
            trending_up
          </span>
          <span>{t('landing.demo.study_stats.preview.footer')}</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <section id="demo" className="demo-section">
        <m.div
          className="section-header"
          onViewportEnter={() =>
            TelemetryService.trackEvent('section_view', { section: 'demo_showcase' })
          }
        >
          <h2>{t('landing.demo.title')}</h2>
          <p>{t('landing.demo.subtitle')}</p>
        </m.div>

        <div className="mockups-carousel-wrapper">
          <button
            className="carousel-control prev"
            onClick={() => scroll('left')}
            aria-label="Previous"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <div
            className="mockups-carousel-container"
            ref={carouselRef}
            onMouseEnter={() => (isHovered.current = true)}
            onMouseLeave={() => (isHovered.current = false)}
            onTouchStart={() => (isHovered.current = true)}
            onTouchEnd={() => (isHovered.current = false)}
          >
            <div className="mockups-grid mockups-track">
              {/* First Set */}
              <div className="mockups-set" ref={setOneRef}>
                {mockups.map((mockup, index) => (
                  <div key={`${mockup.id}-1`} className="mockup-card">
                    <div className="mockup-header">
                      <div className="mockup-icon-wrapper">
                        <span className="material-symbols-outlined">{mockup.icon}</span>
                      </div>
                      <h3>{mockup.title}</h3>
                    </div>

                    <div className="mockup-preview">
                      <div className="preview-window">
                        <div className="window-header">
                          <div className="window-dots">
                            <div className="dot red"></div>
                            <div className="dot yellow"></div>
                            <div className="dot green"></div>
                          </div>
                          <div className="window-title">{mockup.title}</div>
                        </div>
                        <div className="window-content">{renderPreview(mockup.id)}</div>
                      </div>
                    </div>

                    <p className="mockup-description">{mockup.description}</p>

                    <ul className="mockup-features">
                      {Array.isArray(mockup.features)
                        ? mockup.features.map((feature, featureIndex) => (
                            <li key={featureIndex}>
                              <span className="material-symbols-outlined check-icon">
                                check_circle
                              </span>
                              {feature}
                            </li>
                          ))
                        : null}
                    </ul>
                  </div>
                ))}
              </div>
              {/* Second Set */}
              <div className="mockups-set">
                {mockups.map((mockup, index) => (
                  <div key={`${mockup.id}-2`} className="mockup-card">
                    <div className="mockup-header">
                      <div className="mockup-icon-wrapper">
                        <span className="material-symbols-outlined">{mockup.icon}</span>
                      </div>
                      <h3>{mockup.title}</h3>
                    </div>

                    <div className="mockup-preview">
                      <div className="preview-window">
                        <div className="window-header">
                          <div className="window-dots">
                            <div className="dot red"></div>
                            <div className="dot yellow"></div>
                            <div className="dot green"></div>
                          </div>
                          <div className="window-title">{mockup.title}</div>
                        </div>
                        <div className="window-content">{renderPreview(mockup.id)}</div>
                      </div>
                    </div>

                    <p className="mockup-description">{mockup.description}</p>

                    <ul className="mockup-features">
                      {Array.isArray(mockup.features)
                        ? mockup.features.map((feature, featureIndex) => (
                            <li key={featureIndex}>
                              <span className="material-symbols-outlined check-icon">
                                check_circle
                              </span>
                              {feature}
                            </li>
                          ))
                        : null}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button
            className="carousel-control next"
            onClick={() => scroll('right')}
            aria-label="Next"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </section>
    </>
  )
}

export default DemoShowcase
