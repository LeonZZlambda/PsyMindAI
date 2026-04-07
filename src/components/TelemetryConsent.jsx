import React, { useState, useEffect } from 'react';
import { Telemetry } from '../services/analytics/telemetry';
import { useNavigate } from 'react-router-dom';

const TelemetryConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user has already made a choice
    const hasChosen = localStorage.getItem('psymind_telemetry_optin') !== null;
    
    if (!hasChosen) {
      // Delay showing the toast slightly so it's not too aggressive on load
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    Telemetry.setOptIn(true);
    setIsVisible(false);
  };

  const handleDecline = () => {
    Telemetry.setOptIn(false);
    setIsVisible(false);
  };

  const handleMoreInfo = (e) => {
    e.preventDefault();
    navigate('/analytics');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="telemetry-consent-toast">
      <div className="telemetry-consent-content">
        <div className="telemetry-consent-header">
          <span className="material-symbols-outlined icon">monitoring</span>
          <h4>Melhore o PsyMind.AI</h4>
        </div>
        <p>
          📊 Dados anônimos de uso ajudam a melhorar o PsyMind.AI.<br/><br/>
          🔒 Nenhuma conversa ou informação pessoal é coletada.<br/>
          Tudo permanece no seu dispositivo.<br/><br/>
          Você pode desativar isso a qualquer momento.
        </p>
        <p className="disclaimer">
          <strong>Aviso:</strong> A IA oferece apoio educativo e emocional básico, mas não substitui o acompanhamento de um psicólogo ou profissional de saúde mental.
        </p>
        <div className="telemetry-consent-actions">
          <button className="btn-accept" onClick={handleAccept}>Aceitar</button>
          <button className="btn-decline" onClick={handleDecline}>Recusar</button>
          <a href="#" className="btn-more-info" onClick={handleMoreInfo}>Saiba mais</a>
        </div>
      </div>
    </div>
  );
};

export default TelemetryConsent;
