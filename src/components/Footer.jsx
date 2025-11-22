import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (e, selector) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
      // Simple timeout to allow navigation to happen before scrolling
      // In a production app, we might use a context or query param to handle this better
      if (selector) {
        setTimeout(() => {
            const element = document.querySelector(selector);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 500);
      }
    } else {
      if (selector) {
        const element = document.querySelector(selector);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="material-symbols-outlined">psychology</span>
              <span>PsyMind.AI</span>
            </div>
            <p>Seu companheiro de estudos e bem-estar emocional, disponível 24/7 para ajudar você a evoluir.</p>
            <div className="social-links">
              <a href="https://github.com/LeonZZlambda/PsyMindAI" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <span className="material-symbols-outlined">code</span>
              </a>
              <a href="#" aria-label="Discord">
                <span className="material-symbols-outlined">forum</span>
              </a>
              <a href="#" aria-label="Twitter">
                <span className="material-symbols-outlined">alternate_email</span>
              </a>
            </div>
          </div>
          
          <div className="footer-links-container">
            <div className="footer-column">
              <h4>Navegação</h4>
              <a href="#" onClick={(e) => handleNavigation(e, null)}>Início</a>
              <a href="#" onClick={(e) => handleNavigation(e, '.features-section')}>Recursos</a>
              <a href="#" onClick={(e) => handleNavigation(e, '.educational-focus')}>Educação</a>
            </div>
            <div className="footer-column">
              <h4>Legal</h4>
              <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">Licença</a>
              <a href="#">Política de Privacidade</a>
              <a href="#">Termos de Uso</a>
            </div>
            <div className="footer-column">
              <h4>Projeto</h4>
              <a href="https://github.com/LeonZZlambda/PsyMindAI" target="_blank" rel="noopener noreferrer">Repositório</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/contribute'); }}>Como Contribuir</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/roadmap'); }}>Roadmap</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-disclaimer">
            <p>O PsyMind.AI oferece apoio educativo e emocional básico. Para questões de saúde mental sérias, procure sempre ajuda profissional especializada.</p>
          </div>
          <div className="footer-legal-row">
            <div className="footer-logo-small">
              <span className="material-symbols-outlined">psychology</span>
              <span>PsyMind.AI</span>
              <span className="copyright-text">© {new Date().getFullYear()}</span>
            </div>
            <div className="footer-legal-links">
              <a href="#">Privacidade</a>
              <a href="#">Termos</a>
              <a href="#">Sobre</a>
            </div>
          </div>
        </div>
      </footer>
  );
};

export default Footer;
