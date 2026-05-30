import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { m, Variants } from 'framer-motion'
import '../styles/contribute.css'
import Footer from '@/components/layout/Footer'
import ScrollToTopButton from '@/components/ui/ScrollToTopButton'
import LandingHeader from '@/components/layout/LandingHeader'

const ContributePage: React.FC = () => {
  const navigate = useNavigate()
  const { t } = useTranslation(['support', 'translation'])

  const contributeCards = t('contribute_page.cards', { returnObjects: true }) as any[]

  // Framer Motion animation bounds (smooth, discrete easing)
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        ease: 'easeOut'
      }
    }
  }

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.35, ease: 'easeOut' }
    }
  }

  return (
    <m.div 
      className="landing-page contribute-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <LandingHeader />

      <main className="contribute-content">
        <div className="contribute-header">
          <h1>{t('contribute_page.title')}</h1>
          <p>{t('contribute_page.subtitle')}</p>
        </div>

        <m.div 
          className="contribute-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {contributeCards.map((card, idx) => (
            <m.div 
              key={idx}
              className="contribute-card"
              variants={cardVariants}
            >
              <div className={`icon-box ${card.icon}`}>
                <span className="material-symbols-outlined">{card.icon}</span>
              </div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              
              <a 
                href={
                  idx === 0 ? "https://github.com/LeonZZlambda/PsyMindAI" :
                  idx === 2 ? "https://github.com/LeonZZlambda/PsyMindAI/blob/main/ARCHITECTURE.md" : "#"
                }
                target={idx !== 1 ? "_blank" : undefined}
                rel={idx !== 1 ? "noopener noreferrer" : undefined}
                className="text-link"
                onClick={(e) => {
                  if (idx === 1) {
                    e.preventDefault()
                    navigate('/style-guide')
                  } else if (idx === 3) {
                    e.preventDefault()
                    window.open('https://github.com/LeonZZlambda/PsyMindAI/tree/main/src/i18n', '_blank')
                  }
                }}
              >
                {card.link_text} 
                <span className="material-symbols-outlined icon-rtl-flip">arrow_forward</span>
              </a>
            </m.div>
          ))}
        </m.div>

        <div className="steps-section">
          <h2>{t('contribute_page.steps.title')}</h2>
          <div className="steps-list">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-text">
                <h4>Fork & Clone</h4>
                <p>Fork the repository on GitHub and clone it locally to set up your environment.</p>
                <code>git clone https://github.com/...</code>
              </div>
            </div>
            
            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-text">
                <h4>Create Feature Branch</h4>
                <p>Create a dedicated branch for your modifications.</p>
                <code>git checkout -b feature/my-feature</code>
              </div>
            </div>

            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-text">
                <h4>Commit Progress</h4>
                <p>Verify code via linter and test suite, then commit changes.</p>
                <code>git commit -m "feat: add feature"</code>
              </div>
            </div>

            <div className="step-item">
              <div className="step-number">4</div>
              <div className="step-text">
                <h4>Open Pull Request</h4>
                <p>Push to your fork and submit a PR to merge into the main branch.</p>
                <code>git push origin feature/my-feature</code>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <ScrollToTopButton />
    </m.div>
  )
}

export default ContributePage
