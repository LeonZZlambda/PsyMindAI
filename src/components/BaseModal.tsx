import React, { useEffect, useRef } from 'react';
import { useModalAnimation, useEscapeKey } from '../hooks';

/**
 * BaseModal Component - Wrapper universal para todos os modals
 * Gerencia animações, ESC key, overlay click
 * 
 * Props:
 * - isOpen {boolean} - Se o modal está aberto
 * - onClose {Function} - Callback ao fechar
 * - title {string} - Título do modal
 * - children {React.ReactNode} - Conteúdo do modal
 * - size {string} - Tamanho: 'small' | 'medium' (default) | 'large'
 * - closeButton {boolean} - Mostrar botão X de fechar (default: true)
 * - className {string} - Classe CSS adicional para modal-content
 */
export const BaseModal = ({
  isOpen,
  onClose,
  title,
  icon,
  children,
  size = 'medium',
  closeButton = true,
  className = '',
}) => {
  const [isClosing, handleClose] = useModalAnimation(onClose);

  // ESC key fecha o modal
  useEscapeKey(handleClose, isOpen);

  // Focus management (declare refs before early returns to keep hooks order stable)
  const contentRef = useRef(null)
  const closeBtnRef = useRef(null)
  const prevActiveRef = useRef(null)

  const titleIdRef = useRef(`modal-title-${Math.random().toString(36).slice(2, 9)}`)
  const bodyIdRef = useRef(`modal-body-${Math.random().toString(36).slice(2, 9)}`)
  useEffect(() => {
    if (isOpen) {
      prevActiveRef.current = document.activeElement

      setTimeout(() => {
        if (closeBtnRef.current) {
          closeBtnRef.current.focus()
        } else if (contentRef.current) {
          contentRef.current.setAttribute('tabindex', '-1')
          contentRef.current.focus()
        }
      }, 50)

      const handleKeyDown = (e) => {
        if (e.key !== 'Tab') return
        const nodes = contentRef.current?.querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])')
        if (!nodes || nodes.length === 0) return
        const focusable = Array.prototype.slice.call(nodes).filter((n) => n.offsetParent !== null)
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

  // Se não está aberto e não está fechando, não renderiza nada
  if (!isOpen && !isClosing) return null;

  const handleOverlayClick = (e) => {
    // Fecha apenas ao clicar no overlay, não no conteúdo
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

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
        {/* Header com título, ícone opcional e botão fechar */}
        <div className="modal-header">
          {title ? (
            <div className="modal-header-title">
              {icon && <span className="material-symbols-outlined">{icon}</span>}
              <h2 id={titleIdRef.current}>{title}</h2>
            </div>
          ) : <div />}
          
          {closeButton && (
            <button
              ref={closeBtnRef}
              className="close-btn"
              onClick={handleClose}
              aria-label="Fechar"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          )}
        </div>

        {/* Conteúdo do modal */}
        <div id={bodyIdRef.current} className="modal-body">
          {typeof children === 'function' ? children({ handleClose }) : children}
        </div>
      </div>
    </div>
  );
};

export default BaseModal;
