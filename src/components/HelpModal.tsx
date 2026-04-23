import React, { useEffect, useRef, useState } from 'react';
import '../styles/help.css';
import { toast } from 'sonner';
import { useTranslation, Trans } from 'react-i18next';
import BaseModal from './BaseModal';

const HelpModal = ({ isOpen, onClose, initialTab = 'faq' }) => {
  const { t } = useTranslation();
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error(t('help.feedback.error_size'));
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
      toast.success(t('help.feedback.success'), {
        description: t('help.feedback.success_desc')
      });
      setFeedbackText('');
      setFeedbackImage(null);
      setIsSubmitting(false);
      
      // Attempt to trigger animation close
      const closeBtn = document.querySelector('.help-modal-close-trigger');
      if (closeBtn) closeBtn.click();
      else onClose();
    }, 1500);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('help.title')}
      icon="help"
    >
      <div className="modal-tabs-container">
        <div className="modal-tabs">
          <button 
            className={`tab-btn ${activeTab === 'faq' ? 'active' : ''}`}
            onClick={() => setActiveTab('faq')}
          >
            {t('help.tabs.faq')}
          </button>
          {showShortcuts && (
            <button 
              className={`tab-btn ${activeTab === 'shortcuts' ? 'active' : ''}`}
              onClick={() => setActiveTab('shortcuts')}
            >
              {t('help.tabs.shortcuts')}
            </button>
          )}
          <button 
            className={`tab-btn ${activeTab === 'feedback' ? 'active' : ''}`}
            onClick={() => setActiveTab('feedback')}
          >
            {t('help.tabs.feedback')}
          </button>
        </div>
      </div>
      
      <div className="help-body">
          {activeTab === 'faq' && (
            <>
              <div className="help-section">
                <h3 className="modal-section-title">{t('help.about.title')}</h3>
                <p className="help-text">
                  {t('help.about.text')}
                </p>
              </div>

              <div className="help-section">
                <h3 className="modal-section-title">{t('help.how_to.title')}</h3>
                <div className="help-item">
                  <span className="material-symbols-outlined help-icon">chat</span>
                  <div className="help-info">
                    <span className="help-label">{t('help.how_to.items.chat.label')}</span>
                    <span className="help-desc">{t('help.how_to.items.chat.desc')}</span>
                  </div>
                </div>
                <div className="help-item">
                  <span className="material-symbols-outlined help-icon">add</span>
                  <div className="help-info">
                    <span className="help-label">{t('help.how_to.items.new.label')}</span>
                    <span className="help-desc">{t('help.how_to.items.new.desc')}</span>
                  </div>
                </div>
                <div className="help-item">
                  <span className="material-symbols-outlined help-icon">settings</span>
                  <div className="help-info">
                    <span className="help-label">{t('help.how_to.items.settings.label')}</span>
                    <span className="help-desc">{t('help.how_to.items.settings.desc')}</span>
                  </div>
                </div>
                <div className="help-item">
                  <span className="material-symbols-outlined help-icon">support_agent</span>
                  <div className="help-info">
                    <span className="help-label">{t('help.how_to.items.support.label')}</span>
                    <span className="help-desc">{t('help.how_to.items.support.desc')}</span>
                  </div>
                </div>
              </div>

              <div className="help-section">
                <h3 className="modal-section-title">{t('help.faq.title')}</h3>
                <details className="faq-item">
                  <summary>
                    <span>{t('help.faq.items.q1.question')}</span>
                    <span className="material-symbols-outlined expand-icon">expand_more</span>
                  </summary>
                  <p>{t('help.faq.items.q1.answer')}</p>
                </details>
                <details className="faq-item">
                  <summary>
                    <span>{t('help.faq.items.q2.question')}</span>
                    <span className="material-symbols-outlined expand-icon">expand_more</span>
                  </summary>
                  <p>{t('help.faq.items.q2.answer')}</p>
                </details>
                <details className="faq-item">
                  <summary>
                    <span>{t('help.faq.items.q3.question')}</span>
                    <span className="material-symbols-outlined expand-icon">expand_more</span>
                  </summary>
                  <p>{t('help.faq.items.q3.answer')}</p>
                </details>
                <details className="faq-item">
                  <summary>
                    <span>{t('help.faq.items.q4.question')}</span>
                    <span className="material-symbols-outlined expand-icon">expand_more</span>
                  </summary>
                  <p>{t('help.faq.items.q4.answer')}</p>
                </details>
              </div>
            </>
          )}

          {activeTab === 'shortcuts' && showShortcuts && (
            <div className="shortcuts-section">
              <div className="feedback-header">
                <span className="material-symbols-outlined feedback-icon">keyboard</span>
                <h3 className="modal-section-title">{t('help.shortcuts.title')}</h3>
                <p>{t('help.shortcuts.desc')}</p>
              </div>
              
              <div className="shortcuts-grid">
                <div className="shortcut-item">
                  <span className="shortcut-desc">{t('help.shortcuts.items.new_chat')}</span>
                  <div className="shortcut-keys">
                    <kbd>{cmdKey}</kbd>
                    <kbd>{shiftKey}</kbd>
                    <kbd>O</kbd>
                  </div>
                </div>
                <div className="shortcut-item">
                  <span className="shortcut-desc">{t('help.shortcuts.items.settings')}</span>
                  <div className="shortcut-keys">
                    <kbd>{cmdKey}</kbd>
                    <kbd>,</kbd>
                  </div>
                </div>
                <div className="shortcut-item">
                  <span className="shortcut-desc">{t('help.shortcuts.items.help')}</span>
                  <div className="shortcut-keys">
                    <kbd>{cmdKey}</kbd>
                    <kbd>/</kbd>
                  </div>
                </div>
                <div className="shortcut-item">
                  <span className="shortcut-desc">{t('help.shortcuts.items.view_shortcuts')}</span>
                  <div className="shortcut-keys">
                    <kbd>{cmdKey}</kbd>
                    <kbd>{shiftKey}</kbd>
                    <kbd>/</kbd>
                  </div>
                </div>
                <div className="shortcut-item">
                  <span className="shortcut-desc">{t('help.shortcuts.items.focus_chat')}</span>
                  <div className="shortcut-keys">
                    <kbd>/</kbd>
                  </div>
                </div>
                <div className="shortcut-item">
                  <span className="shortcut-desc">{t('help.shortcuts.items.send')}</span>
                  <div className="shortcut-keys">
                    <kbd>Enter</kbd>
                  </div>
                </div>
                <div className="shortcut-item">
                  <span className="shortcut-desc">{t('help.shortcuts.items.new_line')}</span>
                  <div className="shortcut-keys">
                    <kbd>{shiftKey}</kbd>
                    <kbd>Enter</kbd>
                  </div>
                </div>
                <div className="shortcut-item">
                  <span className="shortcut-desc">{t('help.shortcuts.items.mic')}</span>
                  <div className="shortcut-keys">
                    <kbd>{cmdKey}</kbd>
                    <kbd>{shiftKey}</kbd>
                    <kbd>.</kbd>
                  </div>
                </div>
                <div className="shortcut-item">
                  <span className="shortcut-desc">{t('help.shortcuts.items.attach')}</span>
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
                <h3>{t('help.feedback.title')}</h3>
                <p>{t('help.feedback.desc')}</p>
              </div>

              <form onSubmit={handleSubmitFeedback} className="feedback-form">
                <div className="form-group">
                  <label>{t('help.feedback.type_label')}</label>
                  <div className="feedback-types">
                    <button
                      type="button"
                      className={`type-btn ${feedbackType === 'sugestao' ? 'active' : ''}`}
                      onClick={() => setFeedbackType('sugestao')}
                    >
                      <span className="material-symbols-outlined">lightbulb</span>
                      {t('help.feedback.types.suggestion')}
                    </button>
                    <button
                      type="button"
                      className={`type-btn ${feedbackType === 'problema' ? 'active' : ''}`}
                      onClick={() => setFeedbackType('problema')}
                    >
                      <span className="material-symbols-outlined">bug_report</span>
                      {t('help.feedback.types.problem')}
                    </button>
                    <button
                      type="button"
                      className={`type-btn ${feedbackType === 'elogio' ? 'active' : ''}`}
                      onClick={() => setFeedbackType('elogio')}
                    >
                      <span className="material-symbols-outlined">favorite</span>
                      {t('help.feedback.types.praise')}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="feedback-text">{t('help.feedback.message_label')}</label>
                  <textarea
                    id="feedback-text"
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder={t('help.feedback.message_placeholder')}
                    rows={5}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>{t('help.feedback.image_label')}</label>
                  {!feedbackImage ? (
                    <div 
                      className="image-upload-area"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <span className="material-symbols-outlined upload-icon">add_photo_alternate</span>
                      <span>{t('help.feedback.image_hint')}</span>
                      <span className="upload-hint">{t('help.feedback.image_subhint')}</span>
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
                        title={t('help.feedback.remove_image')}
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
                      {t('help.feedback.sending')}
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">send</span>
                      {t('help.feedback.send')}
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
        
        {activeTab === 'faq' && (
          <div className="modal-footer">
            <button className="primary-btn" onClick={onClose}>{t('help.got_it')}</button>
          </div>
        )}
    </BaseModal>
  );
};

export default HelpModal;
