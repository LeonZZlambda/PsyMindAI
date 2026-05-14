import React, { useState } from 'react'
import { m } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import TelemetryService from '../services/TelemetryService'

const UserJourney: React.FC = () => {
  const { t } = useTranslation(['landing', 'translation'])
  const [activeStep, setActiveStep] = useState(0)

  const journeySteps = [
    {
      id: 'discovery',
      icon: 'search',
      title: t('landing.journey.discovery.title'),
      description: t('landing.journey.discovery.description'),
      scenario: t('landing.journey.discovery.scenario'),
      duration: t('landing.journey.discovery.duration')
    },
    {
      id: 'first_chat',
      icon: 'chat_bubble',
      title: t('landing.journey.first_chat.title'),
      description: t('landing.journey.first_chat.description'),
      scenario: t('landing.journey.first_chat.scenario'),
      duration: t('landing.journey.first_chat.duration')
    },
    {
      id: 'daily_routine',
      icon: 'schedule',
      title: t('landing.journey.daily_routine.title'),
      description: t('landing.journey.daily_routine.description'),
      scenario: t('landing.journey.daily_routine.scenario'),
      duration: t('landing.journey.daily_routine.duration')
    },
    {
      id: 'exam_prep',
      icon: 'school',
      title: t('landing.journey.exam_prep.title'),
      description: t('landing.journey.exam_prep.description'),
      scenario: t('landing.journey.exam_prep.scenario'),
      duration: t('landing.journey.exam_prep.duration')
    },
    {
      id: 'growth',
      icon: 'trending_up',
      title: t('landing.journey.growth.title'),
      description: t('landing.journey.growth.description'),
      scenario: t('landing.journey.growth.scenario'),
      duration: t('landing.journey.growth.duration')
    }
  ]

  const journeyBenefits = [
    {
      title: t('landing.journey.step_benefits.discovery.title'),
      items: [
        { icon: 'touch_app', label: t('landing.journey.step_benefits.discovery.items.1') },
        { icon: 'visibility', label: t('landing.journey.step_benefits.discovery.items.2') },
        { icon: 'route', label: t('landing.journey.step_benefits.discovery.items.3') }
      ]
    },
    {
      title: t('landing.journey.step_benefits.first_chat.title'),
      items: [
        { icon: 'psychology', label: t('landing.journey.step_benefits.first_chat.items.1') },
        { icon: 'air', label: t('landing.journey.step_benefits.first_chat.items.2') },
        { icon: 'shield', label: t('landing.journey.step_benefits.first_chat.items.3') }
      ]
    },
    {
      title: t('landing.journey.step_benefits.daily_routine.title'),
      items: [
        { icon: 'calendar_month', label: t('landing.journey.step_benefits.daily_routine.items.1') },
        { icon: 'timer', label: t('landing.journey.step_benefits.daily_routine.items.2') },
        { icon: 'check_circle', label: t('landing.journey.step_benefits.daily_routine.items.3') }
      ]
    },
    {
      title: t('landing.journey.step_benefits.exam_prep.title'),
      items: [
        { icon: 'menu_book', label: t('landing.journey.step_benefits.exam_prep.items.1') },
        { icon: 'schedule', label: t('landing.journey.step_benefits.exam_prep.items.2') },
        { icon: 'air', label: t('landing.journey.step_benefits.exam_prep.items.3') }
      ]
    },
    {
      title: t('landing.journey.step_benefits.growth.title'),
      items: [
        { icon: 'trending_up', label: t('landing.journey.step_benefits.growth.items.1') },
        { icon: 'edit_note', label: t('landing.journey.step_benefits.growth.items.2') },
        { icon: 'self_improvement', label: t('landing.journey.step_benefits.growth.items.3') }
      ]
    }
  ]

  const handleStepClick = (index: number) => {
    setActiveStep(index)
    TelemetryService.trackEvent('journey_step_click', { step: journeySteps[index].id })
  }

  return (
    <section id="journey" className="journey-section">
      <m.div
        className="section-header"
        onViewportEnter={() =>
          TelemetryService.trackEvent('section_view', { section: 'user_journey' })
        }
      >
        <h2>{t('landing.journey.title')}</h2>
        <p>{t('landing.journey.subtitle')}</p>
      </m.div>

      <div className="journey-container">
        {/* Journey Steps Navigation */}
        <div className="journey-steps">
          {journeySteps.map((step, index) => (
            <m.div
              key={step.id}
              className={`journey-step ${activeStep === index ? 'active' : ''}`}
              onClick={() => handleStepClick(index)}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="step-icon">
                <span className="material-symbols-outlined">{step.icon}</span>
              </div>
              <div className="step-content">
                <h4>{step.title}</h4>
                <p>{step.description}</p>
                <div className="step-duration">{step.duration}</div>
              </div>
              <div className="step-number">{index + 1}</div>
            </m.div>
          ))}
        </div>

        {/* Active Step Details */}
        <m.div
          className="journey-detail"
          key={activeStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="detail-header">
            <div className="detail-icon">
              <span className="material-symbols-outlined">{journeySteps[activeStep].icon}</span>
            </div>
            <div className="detail-meta">
              <h3>{journeySteps[activeStep].title}</h3>
              <div className="detail-duration">{journeySteps[activeStep].duration}</div>
            </div>
          </div>

          <div className="detail-scenario">
            <h4>{t('landing.journey.scenario_title')}</h4>
            <p>{journeySteps[activeStep].scenario}</p>
          </div>

          <div className="detail-benefits">
            <h4>{journeyBenefits[activeStep].title}</h4>
            <div className="journey-benefits-grid">
              {journeyBenefits[activeStep].items.map((benefit, benefitIndex) => (
                <div key={benefit.label} className={`journey-benefit-item tone-${benefitIndex + 1}`}>
                  <div className="journey-benefit-icon">
                    <span className="material-symbols-outlined">{benefit.icon}</span>
                  </div>
                  <span>{benefit.label}</span>
                </div>
              ))}
            </div>
          </div>
        </m.div>
      </div>

      {/* Call to Action */}
      <m.div
        className="journey-cta"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
      >
        <h3>{t('landing.journey.cta.title')}</h3>
        <p>{t('landing.journey.cta.description')}</p>
        <div className="journey-stats">
          <div className="stat">
            <div className="stat-number">85%</div>
            <div className="stat-label">{t('landing.journey.stats.satisfaction')}</div>
          </div>
          <div className="stat">
            <div className="stat-number">24/7</div>
            <div className="stat-label">{t('landing.journey.stats.availability')}</div>
          </div>
          <div className="stat">
            <div className="stat-number">100%</div>
            <div className="stat-label">{t('landing.journey.stats.privacy')}</div>
          </div>
        </div>
      </m.div>
    </section>
  )
}

export default UserJourney
