import React, { useEffect, useRef } from 'react'
import { useModalAnimation, useEscapeKey } from '../hooks'

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode | ((args: { handleClose: () => void }) => React.ReactNode);
  size?: 'small' | 'medium' | 'large';
  closeButton?: boolean;
  className?: string;
}

export const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  closeButton = true,
  className = '',
}) => {
  const [isClosing, handleClose] = useModalAnimation(onClose)

  // ESC key closes modal
  useEscapeKey(handleClose, isOpen)

  if (!isOpen && !isClosing) return null

  // Focus management
  const contentRef = useRef<HTMLDivElement | null>(null)
  const closeBtnRef = useRef<HTMLButtonElement | null>(null)
  const prevActiveRef = useRef<HTMLElement | null>(null)

  // unique ids to avoid collisions when multiple modals present
  const titleIdRef = useRef(`modal-title-${Math.random().toString(36).slice(2, 9)}`)
  const bodyIdRef = useRef(`modal-body-${Math.random().toString(36).slice(2, 9)}`)

  useEffect(() => {
    if (isOpen) {
      prevActiveRef.current = document.activeElement as HTMLElement

      // focus close button if present, otherwise focus content container
      setTimeout(() => {
        if (closeBtnRef.current) {
          closeBtnRef.current.focus()
        } else if (contentRef.current) {
          contentRef.current.setAttribute('tabindex', '-1')
          contentRef.current.focus()
        }
      }, 50)

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return
        const nodes = contentRef.current?.querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])')
        if (!nodes || nodes.length === 0) return
        const focusable = Array.prototype.slice.call(nodes).filter((n: HTMLElement) => n.offsetParent !== null)
        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }

      document.addEventListener('keydown', handleKeyDown)
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
        try { prevActiveRef.current?.focus?.() } catch (err) {}
      }
    }
  }, [isOpen])

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  return (
    <div
      className={`modal-overlay ${isClosing ? 'closing' : ''}`}
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        ref={contentRef}
        className={`modal-content modal-${size} ${className} ${isClosing ? 'closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleIdRef.current : undefined}
        aria-describedby={bodyIdRef.current}
      >
        {title && (
          <div className="modal-header">
            <h2 id={titleIdRef.current}>{title}</h2>
            {closeButton && (
              <button
                ref={closeBtnRef}
                className="modal-close-btn"
                onClick={handleClose}
                aria-label={`Close ${title}`}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            )}
          </div>
        )}

        <div id={bodyIdRef.current} className="modal-body">
          {typeof children === 'function' ? children({ handleClose }) : children}
        </div>
      </div>
    </div>
  )
}

export default BaseModal
