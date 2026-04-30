import React, { useState, useEffect, useRef } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Telemetry } from '../services/analytics/telemetry';
import { useNavigate } from 'react-router-dom';

const TelemetryConsent: React.FC = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user has already made a choice
    const hasChosen = typeof window !== 'undefined' && localStorage.getItem('psymind_telemetry_optin') !== null;

    if (!hasChosen) {
      // Delay showing the toast slightly so it's not too aggressive on load
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, []);

  const closeToast = (callback: () => void) => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      callback();
    }, 300);
  };

  const handleAccept = () => {
    closeToast(() => Telemetry.setOptIn(true));
  };

  const handleDecline = () => {
    closeToast(() => Telemetry.setOptIn(false));
  };

  const handleMoreInfo = (e: React.MouseEvent) => {
    e.preventDefault();
    closeToast(() => navigate('/analytics'));
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const acceptRef = useRef<HTMLButtonElement>(null);
  const prevActiveRef = useRef<Element | null>(null);

  useEffect(() => {
    if (isVisible) {
      // store previously focused element to restore later
      prevActiveRef.current = document.activeElement;
      // focus accept button for a11y
      setTimeout(() => acceptRef.current?.focus(), 50);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          handleDecline();
        }

        if (e.key === 'Tab') {
          // trap focus inside the toast
          const nodes = containerRef.current ? containerRef.current.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])') : [];
          if (!nodes || nodes.length === 0) return;
          const focusable = Array.prototype.slice.call(nodes).filter((n) => !(n as any).disabled && n.getAttribute('aria-hidden') !== 'true') as HTMLElement[];
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey) {
            if (document.activeElement === first) {
              e.preventDefault();
              last.focus();
            }
          } else {
            if (document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        // restore focus
        try { (prevActiveRef.current as HTMLElement)?.focus?.(); } catch (e) {}
      };
    }
    return undefined;
  }, [isVisible]);

  if (!isVisible && !isClosing) return null;

  return (
    <div className={`telemetry-consent-toast ${isClosing ? 'closing' : ''}`} role="dialog" aria-modal="true" aria-labelledby="telemetry-title" aria-describedby="telemetry-desc" ref={containerRef}>
      <div className="telemetry-consent-content">
        <div className="telemetry-consent-header">
          <span className="material-symbols-outlined icon" aria-hidden>monitoring</span>
          <h4 id="telemetry-title">{t('telemetry.title')}</h4>
        </div>
        <p id="telemetry-desc">
          <Trans i18nKey="telemetry.description">
            📊 Dados anônimos de uso ajudam a melhorar o PsyMind.AI.<br/><br/>
            🔒 Nenhuma conversa ou informação pessoal é coletada.<br/>
            Tudo permanece no seu dispositivo.<br/><br/>
            Você pode desativar isso a qualquer momento.
          </Trans>
        </p>
        <p id="telemetry-warning" className="disclaimer">
          <Trans i18nKey="telemetry.warning">
            <strong>Aviso:</strong> A IA oferece apoio educativo e emocional básico, mas não substitui o acompanhamento de um psicólogo ou profissional de saúde mental.
          </Trans>
        </p>
        <div className="telemetry-consent-actions">
          <button ref={acceptRef} className="btn-accept" onClick={handleAccept}>{t('telemetry.accept')}</button>
          <button className="btn-decline" onClick={handleDecline}>{t('telemetry.decline')}</button>
          <a href="#" className="btn-more-info" onClick={handleMoreInfo}>{t('telemetry.more_info')}</a>
        </div>
      </div>
    </div>
  );
};

export default TelemetryConsent;
