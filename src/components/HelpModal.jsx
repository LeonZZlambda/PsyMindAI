import React, { useEffect, useRef, useState } from 'react';

const HelpModal = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      modalRef.current?.focus();
    }
    
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
      <div 
        className={`modal-content ${isClosing ? 'closing' : ''}`}
        onClick={e => e.stopPropagation()} 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="help-title"
        ref={modalRef}
        tabIndex="-1"
      >
        <div className="modal-header">
          <h2 id="help-title">Ajuda & FAQ</h2>
          <button className="close-btn" onClick={handleClose} aria-label="Fechar ajuda">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="help-body">
          <div className="help-section">
            <h3>Sobre o PsyMindAI</h3>
            <p className="help-text">
              O PsyMindAI é um assistente virtual focado em saúde mental e bem-estar. 
              Nosso objetivo é fornecer um espaço seguro para conversas, dicas de estudo e suporte emocional.
            </p>
          </div>

          <div className="help-section">
            <h3>Como usar</h3>
            <div className="help-item">
              <span className="material-symbols-outlined help-icon">chat</span>
              <div className="help-info">
                <span className="help-label">Inicie uma conversa</span>
                <span className="help-desc">Digite sua mensagem na caixa de texto abaixo e pressione Enter ou clique no botão de enviar.</span>
              </div>
            </div>
            <div className="help-item">
              <span className="material-symbols-outlined help-icon">add</span>
              <div className="help-info">
                <span className="help-label">Novo Chat</span>
                <span className="help-desc">Use o botão "Novo chat" na barra lateral para começar um novo tópico.</span>
              </div>
            </div>
            <div className="help-item">
              <span className="material-symbols-outlined help-icon">settings</span>
              <div className="help-info">
                <span className="help-label">Personalize</span>
                <span className="help-desc">Acesse as configurações para ajustar o tema, tamanho da fonte e opções de acessibilidade.</span>
              </div>
            </div>
          </div>

          <div className="help-section">
            <h3>Perguntas Frequentes</h3>
            <details className="faq-item">
              <summary>
                <span>O PsyMindAI substitui um psicólogo?</span>
                <span className="material-symbols-outlined expand-icon">expand_more</span>
              </summary>
              <p>Não. O PsyMindAI é uma ferramenta de apoio e não substitui o acompanhamento profissional. Se você estiver em crise, procure ajuda profissional imediatamente.</p>
            </details>
            <details className="faq-item">
              <summary>
                <span>Minhas conversas são privadas?</span>
                <span className="material-symbols-outlined expand-icon">expand_more</span>
              </summary>
              <p>Sim, suas conversas são processadas localmente e priorizamos sua privacidade.</p>
            </details>
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="primary-btn" onClick={handleClose}>Entendi</button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
