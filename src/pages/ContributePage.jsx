import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import Footer from '../components/Footer';
import ScrollToTopButton from '../components/ScrollToTopButton';
import LandingHeader from '../components/LandingHeader';

const ContributePage = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <motion.div 
      className="landing-page contribute-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <LandingHeader />

      <main className="contribute-content">
        <div className="contribute-header">
          <h1>Como Contribuir</h1>
          <p>O PsyMind.AI é um projeto open-source e adoraríamos ter sua ajuda para torná-lo ainda melhor.</p>
        </div>

        <div className="contribute-grid">
          <motion.div 
            className="contribute-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="icon-box code">
              <span className="material-symbols-outlined">code</span>
            </div>
            <h3>Desenvolvimento</h3>
            <p>Encontrou um bug ou quer adicionar uma nova funcionalidade? Confira nossas issues no GitHub ou abra um Pull Request.</p>
            <a href="https://github.com/LeonZZlambda/PsyMindAI" target="_blank" rel="noopener noreferrer" className="text-link">
              Ir para o GitHub <span className="material-symbols-outlined">arrow_forward</span>
            </a>
          </motion.div>

          <motion.div 
            className="contribute-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="icon-box design">
              <span className="material-symbols-outlined">palette</span>
            </div>
            <h3>Design & UX</h3>
            <p>Ajude-nos a melhorar a experiência do usuário. Sugestões de design e melhorias de interface são sempre bem-vindas.</p>
            <a href="#" className="text-link">
              Ver Guia de Estilo <span className="material-symbols-outlined">arrow_forward</span>
            </a>
          </motion.div>

          <motion.div 
            className="contribute-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="icon-box docs">
              <span className="material-symbols-outlined">menu_book</span>
            </div>
            <h3>Documentação</h3>
            <p>Uma boa documentação é essencial. Ajude-nos a melhorar nossos guias, README e tutoriais para novos usuários.</p>
            <a href="#" className="text-link">
              Contribuir na Wiki <span className="material-symbols-outlined">arrow_forward</span>
            </a>
          </motion.div>
        </div>

        <div className="steps-section">
          <h2>Passo a Passo para Contribuir</h2>
          <div className="steps-list">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-text">
                <h4>Faça um Fork</h4>
                <p>Crie uma cópia do repositório na sua conta do GitHub.</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-text">
                <h4>Crie uma Branch</h4>
                <p>Use <code>git checkout -b feature/minha-feature</code> para trabalhar.</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-text">
                <h4>Commit & Push</h4>
                <p>Faça seus commits e envie para o seu fork.</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">4</div>
              <div className="step-text">
                <h4>Abra um Pull Request</h4>
                <p>Descreva suas mudanças e aguarde a revisão da equipe.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <ScrollToTopButton />
    </motion.div>
  );
};

export default ContributePage;
