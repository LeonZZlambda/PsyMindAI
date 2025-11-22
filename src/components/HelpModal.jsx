import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

const HelpModal = ({ isOpen, onClose, initialTab = 'faq' }) => {
  const modalRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab); // 'faq', 'shortcuts' or 'feedback'
  const [feedbackType, setFeedbackType] = useState('sugestao');
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackImage, setFeedbackImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(true);
  const fileInputRef = useRef(null);
  
  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const cmdKey = isMac ? '⌘' : 'Ctrl';
  const shiftKey = isMac ? '⇧' : 'Shift';

  useEffect(() => {
    // Check if device has touch capability or is mobile
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isMobileWidth = window.matchMedia('(max-width: 768px)').matches;
    
    if (isTouch || isMobileWidth) {
      setShowShortcuts(false);
    }
  }, []);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
      setTimeout(() => {
        setActiveTab(initialTab);
        setFeedbackText('');
        setFeedbackImage(null);
        setFeedbackType('sugestao');
      }, 100);
    }, 300);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('A imagem deve ter no máximo 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFeedbackImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFeedbackImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      toast.success('Feedback enviado com sucesso!', {
        description: 'Obrigado por nos ajudar a melhorar o PsyMindAI.'
      });
      setFeedbackText('');
      setFeedbackImage(null);
      setIsSubmitting(false);
      handleClose();
    }, 1500);
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
          <div className="modal-tabs">
            <button 
              className={`tab-btn ${activeTab === 'faq' ? 'active' : ''}`}
              onClick={() => setActiveTab('faq')}
            >
              Ajuda & FAQ
            </button>
            {showShortcuts && (
              <button 
                className={`tab-btn ${activeTab === 'shortcuts' ? 'active' : ''}`}
                onClick={() => setActiveTab('shortcuts')}
              >
                Atalhos
              </button>
            )}
            <button 
              className={`tab-btn ${activeTab === 'feedback' ? 'active' : ''}`}
              onClick={() => setActiveTab('feedback')}
            >
              Enviar Feedback
            </button>
          </div>
          <button className="close-btn" onClick={handleClose} aria-label="Fechar ajuda">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="help-body">
          {activeTab === 'faq' && (
            <>
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
                <div className="help-item">
                  <span className="material-symbols-outlined help-icon">support_agent</span>
                  <div className="help-info">
                    <span className="help-label">Linha de Apoio</span>
                    <span className="help-desc">Acesse a Linha de Apoio no menu de ferramentas para suporte emocional imediato ou investigação de causas.</span>
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
                  <p>Sim, suas conversas são processadas localmente e priorizamos sua privacidade. Nenhuma informação pessoal é compartilhada com terceiros.</p>
                </details>
                <details className="faq-item">
                  <summary>
                    <span>Como funciona o Pomodoro?</span>
                    <span className="material-symbols-outlined expand-icon">expand_more</span>
                  </summary>
                  <p>A técnica Pomodoro ajuda no foco. O padrão é 25 minutos de foco e 5 de pausa. Você pode ativar o timer no menu de ferramentas.</p>
                </details>
                <details className="faq-item">
                  <summary>
                    <span>Posso usar offline?</span>
                    <span className="material-symbols-outlined expand-icon">expand_more</span>
                  </summary>
                  <p>Atualmente o PsyMindAI requer conexão com a internet para processar as respostas da inteligência artificial.</p>
                </details>
              </div>
            </>
          )}

          {activeTab === 'shortcuts' && showShortcuts && (
            <div className="shortcuts-section">
              <div className="feedback-header">
                <span className="material-symbols-outlined feedback-icon">keyboard</span>
                <h3>Atalhos de Teclado</h3>
                <p>Agilize sua navegação com estes atalhos rápidos.</p>
              </div>
              
              <div className="shortcuts-grid">
                <div className="shortcut-item">
                  <span className="shortcut-desc">Novo Chat</span>
                  <div className="shortcut-keys">
                    <kbd>{cmdKey}</kbd>
                    <kbd>{shiftKey}</kbd>
                    <kbd>O</kbd>
                  </div>
                </div>
                <div className="shortcut-item">
                  <span className="shortcut-desc">Configurações</span>
                  <div className="shortcut-keys">
                    <kbd>{cmdKey}</kbd>
                    <kbd>,</kbd>
                  </div>
                </div>
                <div className="shortcut-item">
                  <span className="shortcut-desc">Ajuda</span>
                  <div className="shortcut-keys">
                    <kbd>{cmdKey}</kbd>
                    <kbd>/</kbd>
                  </div>
                </div>
                <div className="shortcut-item">
                  <span className="shortcut-desc">Ver Atalhos</span>
                  <div className="shortcut-keys">
                    <kbd>{cmdKey}</kbd>
                    <kbd>{shiftKey}</kbd>
                    <kbd>/</kbd>
                  </div>
                </div>
                <div className="shortcut-item">
                  <span className="shortcut-desc">Focar no Chat</span>
                  <div className="shortcut-keys">
                    <kbd>/</kbd>
                  </div>
                </div>
                <div className="shortcut-item">
                  <span className="shortcut-desc">Enviar Mensagem</span>
                  <div className="shortcut-keys">
                    <kbd>Enter</kbd>
                  </div>
                </div>
                <div className="shortcut-item">
                  <span className="shortcut-desc">Quebra de Linha</span>
                  <div className="shortcut-keys">
                    <kbd>{shiftKey}</kbd>
                    <kbd>Enter</kbd>
                  </div>
                </div>
                <div className="shortcut-item">
                  <span className="shortcut-desc">Alternar Microfone</span>
                  <div className="shortcut-keys">
                    <kbd>{cmdKey}</kbd>
                    <kbd>{shiftKey}</kbd>
                    <kbd>.</kbd>
                  </div>
                </div>
                <div className="shortcut-item">
                  <span className="shortcut-desc">Anexar Arquivo</span>
                  <div className="shortcut-keys">
                    <kbd>{cmdKey}</kbd>
                    <kbd>{shiftKey}</kbd>
                    <kbd>U</kbd>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="feedback-section">
              <div className="feedback-header">
                <span className="material-symbols-outlined feedback-icon">rate_review</span>
                <h3>Sua opinião é importante</h3>
                <p>Ajude-nos a melhorar o PsyMindAI enviando suas sugestões, elogios ou reportando problemas.</p>
              </div>

              <form onSubmit={handleSubmitFeedback} className="feedback-form">
                <div className="form-group">
                  <label>Tipo de Feedback</label>
                  <div className="feedback-types">
                    <button
                      type="button"
                      className={`type-btn ${feedbackType === 'sugestao' ? 'active' : ''}`}
                      onClick={() => setFeedbackType('sugestao')}
                    >
                      <span className="material-symbols-outlined">lightbulb</span>
                      Sugestão
                    </button>
                    <button
                      type="button"
                      className={`type-btn ${feedbackType === 'problema' ? 'active' : ''}`}
                      onClick={() => setFeedbackType('problema')}
                    >
                      <span className="material-symbols-outlined">bug_report</span>
                      Problema
                    </button>
                    <button
                      type="button"
                      className={`type-btn ${feedbackType === 'elogio' ? 'active' : ''}`}
                      onClick={() => setFeedbackType('elogio')}
                    >
                      <span className="material-symbols-outlined">favorite</span>
                      Elogio
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="feedback-text">Mensagem</label>
                  <textarea
                    id="feedback-text"
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Descreva seu feedback em detalhes..."
                    rows={5}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Anexar Imagem (Opcional)</label>
                  {!feedbackImage ? (
                    <div 
                      className="image-upload-area"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <span className="material-symbols-outlined upload-icon">add_photo_alternate</span>
                      <span>Clique para adicionar uma imagem</span>
                      <span className="upload-hint">JPG, PNG até 5MB</span>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        style={{ display: 'none' }}
                      />
                    </div>
                  ) : (
                    <div className="image-preview-container">
                      <img src={feedbackImage} alt="Preview" className="image-preview" />
                      <button 
                        type="button" 
                        className="remove-image-btn"
                        onClick={removeImage}
                        title="Remover imagem"
                      >
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    </div>
                  )}
                </div>

                <button 
                  type="submit" 
                  className="submit-feedback-btn"
                  disabled={isSubmitting || !feedbackText.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined spin">sync</span>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">send</span>
                      Enviar Feedback
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
        
        {activeTab === 'faq' && (
          <div className="modal-footer">
            <button className="primary-btn" onClick={handleClose}>Entendi</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpModal;
