import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
            <p>{t('footer.brand_desc')}</p>
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
              <h4>{t('footer.nav_title')}</h4>
              <a href="#" onClick={(e) => handleNavigation(e, null)}>{t('footer.nav_home')}</a>
              <a href="#" onClick={(e) => handleNavigation(e, '.features-section')}>{t('footer.nav_features')}</a>
              <a href="#" onClick={(e) => handleNavigation(e, '.educational-focus')}>{t('footer.nav_education')}</a>
            </div>
            <div className="footer-column">
              <h4>{t('footer.legal_title')}</h4>
              <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">{t('footer.legal_license')}</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/privacy'); }}>{t('footer.legal_privacy')}</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/terms'); }}>{t('footer.legal_terms')}</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/transparency'); }}>{t('footer.legal_transparency')}</a>
            </div>
            <div className="footer-column">
              <h4>{t('footer.project_title')}</h4>
              <a href="https://github.com/LeonZZlambda/PsyMindAI" target="_blank" rel="noopener noreferrer">{t('footer.project_repo')}</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/contribute'); }}>{t('footer.project_contribute')}</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/roadmap'); }}>{t('footer.project_roadmap')}</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/analytics'); }}>{t('footer.project_dashboard')}</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-disclaimer">
            <p>{t('footer.disclaimer')}</p>
          </div>
          <div className="footer-legal-row">
            <div className="footer-logo-small">
              <span className="material-symbols-outlined">psychology</span>
              <span>PsyMind.AI</span>
              <span className="copyright-text">© {new Date().getFullYear()}</span>
            </div>
            <div className="footer-legal-links">
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/privacy'); }}>{t('footer.legal_privacy_short')}</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/terms'); }}>{t('footer.legal_terms_short')}</a>
              <a href="https://github.com/LeonZZlambda/PsyMindAI" target="_blank" rel="noopener noreferrer">{t('footer.about')}</a>
            </div>
          </div>
        </div>
      </footer>
  );
};

export default Footer;
