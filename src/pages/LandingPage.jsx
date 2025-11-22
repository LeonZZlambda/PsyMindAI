import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const landingPageRef = useRef(null);

  useEffect(() => {
    const getScrollContainer = () => {
      return landingPageRef.current?.closest('.landing-wrapper') || document.querySelector('.landing-wrapper');
    };

    const scrollContainer = getScrollContainer();
    
    const handleScroll = () => {
      if (scrollContainer && scrollContainer.scrollTop > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      // Check initial scroll position
      handleScroll();
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const scrollToTop = () => {
    const scrollContainer = landingPageRef.current?.closest('.landing-wrapper') || document.querySelector('.landing-wrapper');
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.div 
        ref={landingPageRef}
        className="landing-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <nav className="landing-nav">
        <div className="landing-nav-content">
          <motion.div 
            className="landing-logo"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="logo-icon">
              <span className="material-symbols-outlined">psychology</span>
            </div>
            <span>PsyMind.AI</span>
          </motion.div>
          
          <div className="landing-nav-links">
            <motion.button 
              className="header-btn" 
              onClick={toggleTheme}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              title={isDarkMode ? "Modo claro" : "Modo escuro"}
              aria-label={isDarkMode ? "Ativar modo claro" : "Ativar modo escuro"}
            >
              <span className="material-symbols-outlined">
                {isDarkMode ? 'light_mode' : 'dark_mode'}
              </span>
            </motion.button>
            
            <motion.button 
              className="user-profile" 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              title="Conta do Google" 
              aria-label="Perfil do usuário"
            >
              <span className="material-symbols-outlined">account_circle</span>
            </motion.button>

            <motion.button 
              className="cta-btn" 
              onClick={() => navigate('/chat')}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              Começar
            </motion.button>
          </div>
        </div>
      </nav>

      <main className="landing-hero">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <h1 className="hero-title">
            <span className="gradient-text">Inteligência emocional</span><br />
            ao seu alcance
          </h1>
          <p className="hero-subtitle">
            O PsyMind.AI é seu assistente pessoal para autoconhecimento e bem-estar mental. 
            Converse, reflita e evolua com apoio de inteligência artificial avançada.
          </p>
          
          <div className="hero-actions">
            <motion.button 
              className="cta-btn"
              onClick={() => navigate('/chat')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="material-symbols-outlined">chat_bubble</span>
              Iniciar conversa
            </motion.button>
            <motion.button 
              className="secondary-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Saiba mais
            </motion.button>
          </div>
        </motion.div>

        <motion.div 
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="visual-card">
            <div className="card-header">
              <div className="dot red"></div>
              <div className="dot yellow"></div>
              <div className="dot green"></div>
            </div>
            <div className="card-content">
              <motion.div 
                className="chat-bubble ai"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 }}
              >
                <span className="material-symbols-outlined icon">psychology</span>
                <div className="text">
                  <div className="line w-75"></div>
                  <div className="line w-50"></div>
                </div>
              </motion.div>
              <motion.div 
                className="chat-bubble user"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5 }}
              >
                <div className="text">
                  <div className="line w-60"></div>
                </div>
              </motion.div>
              <motion.div 
                className="chat-bubble ai"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.0 }}
              >
                <span className="material-symbols-outlined icon">psychology</span>
                <div className="text">
                  <div className="line w-80"></div>
                  <div className="line w-40"></div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </main>

      <section className="features-section">
        <motion.div 
          className="feature-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -5 }}
        >
          <span className="material-symbols-outlined feature-icon">lock</span>
          <h3>Privacidade Total</h3>
          <p>Suas conversas são privadas e seguras. Você tem total controle sobre seus dados.</p>
        </motion.div>
        <motion.div 
          className="feature-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          whileHover={{ y: -5 }}
        >
          <span className="material-symbols-outlined feature-icon">auto_awesome</span>
          <h3>IA Avançada</h3>
          <p>Utilizamos modelos de linguagem de última geração para oferecer respostas empáticas.</p>
        </motion.div>
        <motion.div 
          className="feature-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          whileHover={{ y: -5 }}
        >
          <span className="material-symbols-outlined feature-icon">history</span>
          <h3>Disponível 24/7</h3>
          <p>Apoio emocional a qualquer hora do dia ou da noite, sempre que você precisar.</p>
        </motion.div>
      </section>

      <section className="info-section educational-focus">
        <motion.div 
          className="info-content"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        >
          <span className="material-symbols-outlined info-icon">school</span>
          <h2>Foco Educacional</h2>
          <p>
            O PsyMind.AI não é apenas um chat, é um companheiro de jornada para estudantes do <strong>Ensino Fundamental e Médio</strong>.
          </p>
          <div className="info-cards-container">
            <motion.div 
              className="info-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -5 }}
            >
              <span className="material-symbols-outlined card-icon">sentiment_satisfied</span>
              <h3>Apoio Emocional</h3>
              <p>Suporte para lidar com ansiedade de provas, pressão escolar e organização de rotina.</p>
            </motion.div>
            <motion.div 
              className="info-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -5 }}
            >
              <span className="material-symbols-outlined card-icon">rocket_launch</span>
              <h3>Preparação para o Futuro</h3>
              <p>Dicas e orientações focadas em Vestibulares e ENEM, ajudando a manter o foco e a motivação.</p>
            </motion.div>
            <motion.div 
              className="info-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -5 }}
            >
              <span className="material-symbols-outlined card-icon">self_improvement</span>
              <h3>Desenvolvimento Pessoal</h3>
              <p>Ferramentas para autoconhecimento que auxiliam na escolha de carreira e no amadurecimento.</p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section className="info-section license-info">
        <motion.div 
          className="info-content"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        >
          <span className="material-symbols-outlined info-icon">code</span>
          <h2>Transparência e Código Aberto</h2>
          <p>
            O PsyMind.AI é um projeto <strong>Open Source</strong> (Código Aberto), o que significa que sua tecnologia é acessível e auditável por todos.
          </p>
          <div className="info-cards-container">
            <motion.div 
              className="info-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -5 }}
            >
              <span className="material-symbols-outlined card-icon">visibility</span>
              <h3>Transparência</h3>
              <p>Você sabe exatamente como seus dados são tratados, garantindo maior segurança e confiança.</p>
            </motion.div>
            <motion.div 
              className="info-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -5 }}
            >
              <span className="material-symbols-outlined card-icon">group</span>
              <h3>Comunidade</h3>
              <p>Desenvolvedores, educadores e estudantes podem colaborar para evoluir a plataforma continuamente.</p>
            </motion.div>
            <motion.div 
              className="info-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -5 }}
            >
              <span className="material-symbols-outlined card-icon">menu_book</span>
              <h3>Educação</h3>
              <p>O código-fonte serve como material de estudo gratuito para quem deseja aprender programação e IA.</p>
            </motion.div>
          </div>
          <p className="license-description">
            Distribuído sob a licença <strong>Creative Commons BY-SA 4.0</strong>, permitindo o compartilhamento e adaptação com os devidos créditos.
          </p>
          <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer" className="license-link">
            Ler licença completa <span className="material-symbols-outlined">open_in_new</span>
          </a>
        </motion.div>
      </section>

      <footer className="landing-footer">
        <p className="disclaimer">
          <span className="material-symbols-outlined" style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '4px' }}>warning</span>
          O PsyMind.AI oferece apoio educativo. Para questões sérias, procure ajuda profissional.
        </p>
        <p className="license-notice">
          <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">
            Licenciado sob CC BY-SA 4.0
          </a>
        </p>
        <p className="copyright">© 2025 PsyMind.AI</p>
      </footer>
      </motion.div>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            className="scroll-top-btn"
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.9 }}
            title="Voltar ao topo"
          >
            <span className="material-symbols-outlined">arrow_upward</span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default LandingPage;
