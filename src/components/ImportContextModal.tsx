import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const ImportContextModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const modalRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);
  const [importContext, setImportContext] = useState(() => localStorage.getItem('psymind_imported_context') || '');

  const importPrompt = t('import_context.prompt');

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(importPrompt);
    toast.success(t('import_context.toast_prompt_copied'));
  };

  const handleSaveContext = () => {
    localStorage.setItem('psymind_imported_context', importContext);
    toast.success(t('import_context.toast_saved'));
    handleClose();
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      modalRef.current?.focus();
    }
    
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
      <div 
        className={`modal-content ${isClosing ? 'closing' : ''}`}
        onClick={e => e.stopPropagation()} 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="import-context-title"
        ref={modalRef}
        tabIndex="-1"
      >
        <div className="modal-header">
          <h2 id="import-context-title">
            <span className="material-symbols-outlined" style={{ verticalAlign: 'middle', marginRight: '8px' }}>cloud_download</span>
            {t('import_context.title')}
          </h2>
          <button type="button" className="close-btn" onClick={handleClose} aria-label={t('import_context.close_aria')}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="modal-body" style={{ padding: '1.5rem' }}>
          <p style={{ margin: '-1.5rem -1.5rem 1.5rem -1.5rem', padding: '1rem 1.5rem', background: 'var(--card-hover)', borderBottom: '1px solid var(--border-color)', fontSize: '0.95rem', color: 'var(--text-color)' }}>
            {t('import_context.intro')}
          </p>

          <div className="setting-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem', padding: '0 0 1.5rem 0', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
            <div className="setting-info" style={{ width: '100%' }}>
              <span className="setting-label">{t('import_context.step1_label')}</span>
              <span className="setting-desc">{t('import_context.step1_desc')}</span>
            </div>
            <div style={{ background: 'var(--background-color)', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-light)', border: '1px solid var(--border-color)', width: '100%', maxHeight: '120px', overflowY: 'auto' }}>
              <pre style={{ whiteSpace: 'pre-wrap', margin: 0, fontFamily: 'inherit' }}>{importPrompt}</pre>
            </div>
            <button type="button" className="secondary-btn" onClick={handleCopyPrompt}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>content_copy</span>
              {t('import_context.copy_prompt')}
            </button>
          </div>

          <div className="setting-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem', padding: 0 }}>
            <div className="setting-info" style={{ width: '100%' }}>
              <span className="setting-label">{t('import_context.step2_label')}</span>
              <span className="setting-desc">{t('import_context.step2_desc')}</span>
            </div>
            <textarea 
              className="input-field"
              placeholder={t('import_context.placeholder')}
              value={importContext}
              onChange={(e) => setImportContext(e.target.value)}
              style={{ width: '100%', minHeight: '160px', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--background-color)', color: 'var(--text-color)', resize: 'vertical' }}
            />
            <button type="button" className="primary-btn filled w-full" onClick={handleSaveContext}>
              {t('import_context.save')}
            </button>
          </div>

          <div style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-light)', opacity: 0.8 }}>
            <em>*{t('import_context.footer_note')}</em>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportContextModal;
