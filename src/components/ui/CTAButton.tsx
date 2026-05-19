import React from 'react'
import { Link } from 'react-router-dom'
import { m } from 'framer-motion'

export type CTAVariant = 'primary' | 'secondary'
export type CTAType = 'internal' | 'external'

interface CTAButtonProps {
  href: string
  label: string
  icon?: string
  variant?: CTAVariant
  type?: CTAType
  onClick?: () => void
  target?: string
  rel?: string
  className?: string
  ariaLabel?: string
}

const MotionLink = m.create(Link)
const MotionA = m.a

const springConfig = {
  hover: { type: 'spring' as const, stiffness: 400, damping: 10 },
  tap: { type: 'spring' as const, stiffness: 600, damping: 15 },
}

const CTAButton: React.FC<CTAButtonProps> = ({
  href,
  label,
  icon,
  variant = 'primary',
  type = 'internal',
  onClick,
  target,
  rel,
  className = '',
  ariaLabel,
}) => {
  const baseClassName = `cta-btn ${variant === 'secondary' ? 'secondary-btn' : ''} ${className}`

  const commonMotionProps = {
    whileHover: {
      scale: 1.03,
      transition: springConfig.hover,
    },
    whileTap: {
      scale: 0.97,
      transition: springConfig.tap,
    },
  }

  if (type === 'external') {
    return (
      <MotionA
        href={href}
        className={baseClassName}
        target={target || '_blank'}
        rel={rel || 'noopener noreferrer'}
        onClick={onClick}
        aria-label={ariaLabel}
        {...commonMotionProps}
      >
        {icon && (
          <span className="material-symbols-outlined" aria-hidden="true">
            {icon}
          </span>
        )}
        {label}
      </MotionA>
    )
  }

  return (
    <MotionLink
      to={href}
      className={baseClassName}
      onClick={onClick}
      aria-label={ariaLabel}
      {...commonMotionProps}
    >
      {icon && (
        <span className="material-symbols-outlined" aria-hidden="true">
          {icon}
        </span>
      )}
      {label}
    </MotionLink>
  )
}

export default CTAButton
