import React from 'react';
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
  children,
  size = 'medium',
  closeButton = true,
  className = '',
}) => {
  const [isClosing, handleClose] = useModalAnimation(onClose);

  // ESC key fecha o modal
  useEscapeKey(handleClose, isOpen);

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
        className={`modal-content modal-${size} ${className} ${isClosing ? 'closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header com título e botão fechar */}
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

        {/* Conteúdo do modal */}
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default BaseModal;
