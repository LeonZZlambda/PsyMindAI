import React, { useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import TelemetryService from '../../services/TelemetryService'

interface AccordionItemProps {
  id: string
  icon: string
  title: string
  advantage: string
  disadvantage: string
  mitigation: string
  index: number
}

const TechnicalAccordionItem: React.FC<AccordionItemProps> = ({
  id,
  icon,
  title,
  advantage,
  disadvantage,
  mitigation,
  index,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
    TelemetryService.trackEvent('accordion_toggle', {
      item: id,
      expanded: !isExpanded,
    })
  }

  return (
    <m.div
      className="accordion-item"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      layout
    >
      <button
        className="accordion-trigger"
        onClick={handleToggle}
        aria-expanded={isExpanded}
        aria-controls={`accordion-panel-${id}`}
      >
        <div className="accordion-header">
          <span className="material-symbols-outlined accordion-icon">{icon}</span>
          <h3 className="accordion-title">{title}</h3>
          <span className="material-symbols-outlined chevron-icon">
            {isExpanded ? 'expand_less' : 'expand_more'}
          </span>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <m.div
            id={`accordion-panel-${id}`}
            className="accordion-content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              duration: 0.3,
              ease: 'easeInOut',
            }}
          >
            <div className="accordion-body">
              <div className="tradeoff-item advantage">
                <span className="tradeoff-label">✓ Vantagem</span>
                <p>{advantage}</p>
              </div>
              <div className="tradeoff-item disadvantage">
                <span className="tradeoff-label">⚠ Desvantagem</span>
                <p>{disadvantage}</p>
              </div>
              <div className="tradeoff-item mitigation">
                <span className="tradeoff-label">🔧 Mitigação</span>
                <p>{mitigation}</p>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </m.div>
  )
}

interface TechnicalAccordionProps {
  items: Array<{
    id: string
    icon: string
    title: string
    advantage: string
    disadvantage: string
    mitigation: string
  }>
}

const TechnicalAccordion: React.FC<TechnicalAccordionProps> = ({ items }) => {
  return (
    <div className="accordion-container">
      {items.map((item, idx) => (
        <TechnicalAccordionItem
          key={item.id}
          {...item}
          index={idx}
        />
      ))}
    </div>
  )
}

export default TechnicalAccordion
