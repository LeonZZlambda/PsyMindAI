import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import '../styles/roadmap.css'
import Footer from '@/components/layout/Footer'
import ScrollToTopButton from '@/components/ui/ScrollToTopButton'
import LandingHeader from '@/components/layout/LandingHeader'

interface EngineeringMilestone {
  title: string
  items: string[]
}

const RoadmapPage: React.FC = () => {
  const { t } = useTranslation(['learning', 'translation'])
  const [expandedPhases, setExpandedPhases] = useState<Record<number, boolean>>({
    0: true, // Completed expanded by default
    1: true  // In Progress expanded by default
  })

  const roadmapItems = t('roadmap_page.phases', { returnObjects: true }) as any[]

  // Technical engineering milestones corresponding to each phase
  const techMilestones: Record<number, EngineeringMilestone> = {
    0: {
      title: 'Engineering Milestones',
      items: [
        'Established client-only prompt assembly pipelines',
        'Integrated localized context-injection flow',
        'Created dark/light HSL variable theme system',
        'Bypassed remote AI servers for zero data-leak security'
      ]
    },
    1: {
      title: 'Engineering Milestones',
      items: [
        'Migrated core state layers to modular React hooks',
        'Configured manual Vite chunk splitting for under-2s mobile loads',
        'Added automated Vitest CI suite validation (unit & integration testing)',
        'Implemented local consent-gated telemetry service'
      ]
    },
    2: {
      title: 'Engineering Milestones',
      items: [
        'Integrate end-to-end local encryption keys for history exports',
        'Leverage IndexedDB storage for large offline-first caching',
        'Implement CSS prefers-reduced-motion media query overrides',
        'Decouple router bounds for lazy-loaded modal hydration'
      ]
    },
    3: {
      title: 'Engineering Milestones',
      items: [
        'Construct structured JSON schema outputs for real-time model parsing',
        'Expose typed local-only API endpoints for browser extensions',
        'Build Web Worker-based SRS scheduler calculations',
        'Leverage WASM packages for client-side evaluation models'
      ]
    }
  }

  const togglePhase = (index: number) => {
    setExpandedPhases(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  return (
    <motion.div 
      className="landing-page roadmap-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <LandingHeader />

      <main className="roadmap-content">
        <div className="roadmap-header">
          <h1>{t('roadmap_page.title')}</h1>
          <p>{t('roadmap_page.subtitle')}</p>
        </div>

        <div className="roadmap-timeline-wrapper">
          <div className="timeline-axis" />

          <div className="roadmap-timeline">
            {roadmapItems.map((phase, index) => {
              const isExpanded = !!expandedPhases[index]
              const milestones = techMilestones[index]

              return (
                <motion.div 
                  key={index}
                  className={`roadmap-card-container ${phase.status} ${index % 2 === 0 ? 'left-align' : 'right-align'}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.35, ease: 'easeOut' }}
                >
                  {/* Timeline bullet indicator */}
                  <div className="timeline-node">
                    <span className="material-symbols-outlined">
                      {phase.status === 'completed' ? 'check_circle' : 
                       phase.status === 'in_progress' ? 'pending' : 'schedule'}
                    </span>
                  </div>

                  <div className="roadmap-card" onClick={() => togglePhase(index)}>
                    <div className="card-header-row">
                      <span className="quarter-badge">{phase.quarter}</span>
                      <div className={`status-badge ${phase.status}`}>
                        <span className="status-dot" />
                        <span>
                          {phase.status === 'completed' ? t('roadmap_page.statuses.completed') : 
                           phase.status === 'in_progress' ? t('roadmap_page.statuses.in_progress') : t('roadmap_page.statuses.planned')}
                        </span>
                      </div>
                    </div>

                    <div className="card-title-row">
                      <h2>{phase.title}</h2>
                      <span className={`material-symbols-outlined expand-chevron ${isExpanded ? 'rotated' : ''}`}>
                        keyboard_arrow_down
                      </span>
                    </div>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          className="card-expanded-content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                        >
                          <div className="features-grid">
                            <div className="features-column">
                              <h4>User-Facing Features</h4>
                              <ul className="feature-list">
                                {phase.items.map((item: string, i: number) => (
                                  <li key={i}>
                                    <span className="material-symbols-outlined list-check">check</span>
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {milestones && (
                              <div className="features-column technical">
                                <h4>{milestones.title}</h4>
                                <ul className="feature-list">
                                  {milestones.items.map((item: string, i: number) => (
                                    <li key={i}>
                                      <span className="material-symbols-outlined list-code">terminal</span>
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </main>

      <Footer />
      <ScrollToTopButton />
    </motion.div>
  )
}

export default RoadmapPage
