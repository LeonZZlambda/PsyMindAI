import React from 'react'
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
        className={`modal-content modal-${size} ${className} ${isClosing ? 'closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {title && (
          <div className="modal-header">
            <h2 id="modal-title">{title}</h2>
            {closeButton && (
              <button
                className="modal-close-btn"
                onClick={handleClose}
                aria-label="Close modal"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            )}
          </div>
        )}

        <div className="modal-body">
          {typeof children === 'function' ? children({ handleClose }) : children}
        </div>
      </div>
    </div>
  )
}

export default BaseModal
