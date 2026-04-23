import React, { useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import BaseModal from './BaseModal';

const ImportContextModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [importContext, setImportContext] = useState(() => localStorage.getItem('psymind_imported_context') || '');

  const importPrompt = t('import_context.prompt');

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(importPrompt);
    toast.success(t('import_context.toast_prompt_copied'));
  };

  const handleSaveContext = () => {
    localStorage.setItem('psymind_imported_context', importContext);
    toast.success(t('import_context.toast_saved'));
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('import_context.title')}
      icon="cloud_download"
    >
      <div className="import-context-container">
        <div className="modal-hero">
          <p className="import-intro-text">
            {t('import_context.intro')}
          </p>
        </div>

        <div className="import-step-section">
          <div className="setting-item vertical-item">
            <div className="setting-info">
              <span className="setting-label">{t('import_context.step1_label')}</span>
              <span className="setting-desc">{t('import_context.step1_desc')}</span>
            </div>
            <div className="prompt-preview-box">
              <pre>{importPrompt}</pre>
            </div>
            <button type="button" className="secondary-btn" onClick={handleCopyPrompt}>
              <span className="material-symbols-outlined">content_copy</span>
              {t('import_context.copy_prompt')}
            </button>
          </div>
        </div>

        <div className="import-step-section">
          <div className="setting-item vertical-item">
            <div className="setting-info">
              <span className="setting-label">{t('import_context.step2_label')}</span>
              <span className="setting-desc">{t('import_context.step2_desc')}</span>
            </div>
            <textarea 
              className="input-field import-textarea"
              placeholder={t('import_context.placeholder')}
              value={importContext}
              onChange={(e) => setImportContext(e.target.value)}
            />
            <button type="button" className="primary-btn filled w-full" onClick={handleSaveContext}>
              {t('import_context.save')}
            </button>
          </div>
        </div>

        <div className="import-footer-note">
          <em>*{t('import_context.footer_note')}</em>
        </div>
      </div>
    </BaseModal>
  );
};

export default ImportContextModal;
