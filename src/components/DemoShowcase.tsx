import React from 'react'
import { m } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import TelemetryService from '../services/TelemetryService'

type MockupId = 'guided_learning' | 'exams' | 'reflections'

const DemoShowcase: React.FC = () => {
  const { t } = useTranslation(['landing', 'learning', 'reflections', 'translation'])

  const guidedLearningFeatures = t('landing.demo.guided_learning.features', { returnObjects: true }) as string[]
  const examsFeatures = t('landing.demo.exams.features', { returnObjects: true }) as string[]
  const reflectionsFeatures = t('landing.demo.reflections.features', { returnObjects: true }) as string[]

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
      features: guidedLearningFeatures
    },
    {
      id: 'exams',
      title: t('learning:exams.title'),
      description: t('landing.demo.exams.description'),
      icon: 'workspace_premium',
      features: examsFeatures
    },
    {
      id: 'reflections',
      title: t('reflections.title', { ns: 'reflections' }),
      description: t('landing.demo.reflections.description'),
      icon: 'auto_awesome',
      features: reflectionsFeatures
    }
  ]

  const renderPreview = (mockupId: MockupId) => {
    if (mockupId === 'guided_learning') {
      return (
        <div className="tool-preview guided-preview">
          <div className="preview-hero">
            <div>
              <p className="preview-eyebrow">{t('guided_learning.tabs.trails', { ns: 'learning' })}</p>
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
              <span className="exams-action active">{t('landing.demo.exams.preview.action_plan')}</span>
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

    return (
        <div className="tool-preview reflections-preview">
        <div className="preview-hero">
          <div>
            <p className="preview-eyebrow">{t('reflections.tabs.daily', { ns: 'reflections' })}</p>
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
          <span className="mockup-tag">{t('reflections.tabs.explore', { ns: 'reflections' })}</span>
          <span className="mockup-tag">{t('reflections.tabs.breathing', { ns: 'reflections' })}</span>
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

        <div className="mockups-grid">
          {mockups.map((mockup, index) => (
            <m.div
              key={mockup.id}
              className="mockup-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.02, transition: { type: 'spring', stiffness: 300, damping: 15 } }}
            >
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
                {mockup.features.map((feature, featureIndex) => (
                  <li key={featureIndex}>
                    <span className="material-symbols-outlined check-icon">check_circle</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </m.div>
          ))}
        </div>
      </section>
    </>
  )
}

export default DemoShowcase
