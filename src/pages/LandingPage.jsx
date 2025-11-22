import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import Footer from '../components/Footer';
import ScrollToTopButton from '../components/ScrollToTopButton';
import LandingHeader from '../components/LandingHeader';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const landingPageRef = useRef(null);

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
        <LandingHeader />

      <main className="landing-hero">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <h1 className="hero-title">
            <span className="gradient-text">Equilíbrio mental</span><br />
            para seus estudos
          </h1>
          <p className="hero-subtitle">
            O PsyMind.AI é seu companheiro para enfrentar o Ensino Médio e Vestibulares. 
            Organize sua rotina, controle a ansiedade e conquiste seus objetivos com apoio da IA.
          </p>
          
          <div className="hero-actions">
            <motion.button 
              className="cta-btn"
              onClick={() => navigate('/chat')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="material-symbols-outlined">rocket_launch</span>
              Começar Jornada
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
          <span className="material-symbols-outlined feature-icon">school</span>
          <h3>Foco nos Estudos</h3>
          <p>Dicas de organização e cronogramas personalizados para o ENEM e vestibulares.</p>
        </motion.div>
        <motion.div 
          className="feature-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          whileHover={{ y: -5 }}
        >
          <span className="material-symbols-outlined feature-icon">self_improvement</span>
          <h3>Controle da Ansiedade</h3>
          <p>Técnicas de respiração e mindfulness para manter a calma antes de provas e redações.</p>
        </motion.div>
        <motion.div 
          className="feature-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          whileHover={{ y: -5 }}
        >
          <span className="material-symbols-outlined feature-icon">schedule</span>
          <h3>Disponível 24/7</h3>
          <p>Tire dúvidas, desabafe ou peça dicas de estudo a qualquer hora do dia ou da noite.</p>
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
              <h3>Gestão de Estresse</h3>
              <p>Suporte para lidar com a pressão de provas, simulados e a escolha da profissão.</p>
            </motion.div>
            <motion.div 
              className="info-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -5 }}
            >
              <span className="material-symbols-outlined card-icon">rocket_launch</span>
              <h3>Mentoria para Vestibulares</h3>
              <p>Orientações estratégicas para o ENEM e principais vestibulares, mantendo o foco no resultado.</p>
            </motion.div>
            <motion.div 
              className="info-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -5 }}
            >
              <span className="material-symbols-outlined card-icon">psychology_alt</span>
              <h3>Autoconhecimento</h3>
              <p>Ferramentas que auxiliam na descoberta de vocações e no amadurecimento emocional.</p>
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

      <Footer />
      </motion.div>

      <ScrollToTopButton />
    </>
  );
};

export default LandingPage;
