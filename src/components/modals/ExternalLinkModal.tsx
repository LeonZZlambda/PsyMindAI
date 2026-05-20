import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseModal from './BaseModal';
import type { ExternalLinkState } from '../../hooks/useExternalLinkInterceptor';

interface ExternalLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
  linkData: ExternalLinkState | null;
}

const ExternalLinkModal: React.FC<ExternalLinkModalProps> = ({ 
  isOpen, 
  onClose, 
  onProceed, 
  linkData 
}) => {
  const { t } = useTranslation();

  if (!linkData) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('externalLink.title', { defaultValue: 'You are leaving PsyMind.AI' })}
      className="external-link-modal"
    >
      <div className="external-link-content">
        <div className="domain-preview">
          <span className="material-symbols-outlined domain-icon" aria-hidden="true">
            language
          </span>
          <div className="domain-details">
            <span className="destination-label">
              {t('externalLink.destination', { defaultValue: 'Destination:' })}
            </span>
            <strong className="domain-name">{linkData.hostname}</strong>
          </div>
        </div>

        <p className="external-link-warning">
          {t('externalLink.warning', { 
            defaultValue: 'External websites have independent privacy policies and terms of service. Are you sure you want to proceed?' 
          })}
        </p>

        <div className="full-url-preview" title={linkData.url}>
          {linkData.url.length > 60 ? `${linkData.url.substring(0, 57)}...` : linkData.url}
        </div>
      </div>

      <div className="modal-actions">
        <button 
          className="secondary-btn" 
          onClick={onClose}
          autoFocus
        >
          {t('common.cancel', { defaultValue: 'Cancel' })}
        </button>
        <button 
          className="primary-btn external-proceed-btn" 
          onClick={onProceed}
        >
          {t('common.continue', { defaultValue: 'Continue' })}
          <span className="material-symbols-outlined icon-small">open_in_new</span>
        </button>
      </div>
    </BaseModal>
  );
};

export default ExternalLinkModal;
