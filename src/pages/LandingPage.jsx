import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';
import ScrollToTopButton from '../components/ScrollToTopButton';
import LandingHeader from '../components/LandingHeader';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut', delay },
});

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <motion.div
        className="landing-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        <LandingHeader />

        {/* ── HERO ── */}
        <main className="landing-hero">
          <motion.div className="hero-content" {...fadeUp(0.1)}>
            <div className="hero-badge">
              <span className="material-symbols-outlined">auto_awesome</span>
              Powered by Google Gemini
            </div>

            <h1 className="hero-title">
              Saúde mental que<br />
              <span className="gradient-text">cabe na sua rotina</span>
            </h1>

            <p className="hero-subtitle">
              O PsyMind.AI combina psicologia baseada em evidências com IA generativa
              para ajudar estudantes a entender suas emoções, reduzir a ansiedade e
              manter o foco nos estudos.
            </p>

            <div className="hero-actions">
              <motion.button
                className="cta-btn"
                onClick={() => navigate('/chat')}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <span className="material-symbols-outlined">arrow_forward</span>
                Começar agora
              </motion.button>
              <button className="secondary-btn" onClick={() => navigate('/roadmap')}>
                Ver roadmap
              </button>
            </div>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="visual-card">
              <div className="card-header">
                <div className="dot red" />
                <div className="dot yellow" />
                <div className="dot green" />
              </div>
              <div className="card-content">
                <motion.div className="chat-bubble ai" {...fadeUp(0.8)}>
                  <div className="icon">
                    <span className="material-symbols-outlined">psychology</span>
                  </div>
                  <div className="text">
                    <div className="line w-75" />
                    <div className="line w-50" />
                  </div>
                </motion.div>
                <motion.div className="chat-bubble user" {...fadeUp(1.2)}>
                  <div className="text">
                    <div className="line w-60" />
                  </div>
                </motion.div>
                <motion.div className="chat-bubble ai" {...fadeUp(1.6)}>
                  <div className="icon">
                    <span className="material-symbols-outlined">psychology</span>
                  </div>
                  <div className="text">
                    <div className="line w-80" />
                    <div className="line w-40" />
                    <div className="line w-60" />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </main>

        {/* ── FEATURES ── */}
        <section className="features-section">
          {[
            {
              icon: 'school',
              title: 'Foco nos estudos',
              desc: 'Cronogramas personalizados e técnicas de estudo para ENEM e vestibulares.',
            },
            {
              icon: 'self_improvement',
              title: 'Controle da ansiedade',
              desc: 'Respiração guiada, mindfulness e suporte emocional antes de provas.',
            },
            {
              icon: 'schedule',
              title: 'Disponível 24/7',
              desc: 'Converse a qualquer hora — sem julgamentos, sem espera.',
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              className="feature-card"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="feature-icon">
                <span className="material-symbols-outlined">{f.icon}</span>
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </section>

        {/* ── GEMINI ── */}
        <section className="info-section gemini-integration">
          <motion.div
            className="info-content"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="section-label">
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>auto_awesome</span>
              Tecnologia
            </div>
            <h2>Construído com o melhor da IA</h2>
            <p>
              Integração direta com o <strong>Google Gemini 1.5 Flash</strong>, com prompt engineering
              baseado em psicologia educacional e personalidade otimizada para suporte adolescente.
            </p>
            <div className="info-cards-container">
              {[
                { icon: 'psychology', title: 'Gemini API', desc: 'Conversas naturais e contextualizadas com o modelo mais avançado do Google.' },
                { icon: 'menu_book', title: 'NotebookLM', desc: 'Prompts desenvolvidos com base em estudos de psicologia educacional.' },
                { icon: 'diamond', title: 'Gemini Gems', desc: 'Personalidade e tom de voz calibrados para suporte emocional a adolescentes.' },
              ].map((c, i) => (
                <motion.div
                  key={i}
                  className="info-card"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="card-icon">
                    <span className="material-symbols-outlined">{c.icon}</span>
                  </div>
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── EDUCATIONAL ── */}
        <section className="info-section educational-focus">
          <motion.div
            className="info-content"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="section-label">
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>school</span>
              Educação
            </div>
            <h2>Feito para quem estuda de verdade</h2>
            <p>
              Mais do que um chat — um companheiro de jornada para estudantes do
              Ensino Médio e pré-vestibular.
            </p>
            <div className="info-cards-container">
              {[
                { icon: 'sentiment_satisfied', title: 'Gestão de estresse', desc: 'Suporte para lidar com a pressão de provas, simulados e escolha de carreira.' },
                { icon: 'rocket_launch', title: 'Mentoria para vestibulares', desc: 'Orientações estratégicas para o ENEM e principais vestibulares.' },
                { icon: 'psychology_alt', title: 'Autoconhecimento', desc: 'Ferramentas para descoberta de vocações e amadurecimento emocional.' },
              ].map((c, i) => (
                <motion.div
                  key={i}
                  className="info-card"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="card-icon">
                    <span className="material-symbols-outlined">{c.icon}</span>
                  </div>
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── OPEN SOURCE ── */}
        <section className="info-section license-info">
          <motion.div
            className="info-content"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="section-label">
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>code</span>
              Open Source
            </div>
            <h2>Transparente por princípio</h2>
            <p>
              Código aberto, auditável e disponível para a comunidade. Distribuído sob
              <strong> CC BY-SA 4.0</strong>.
            </p>
            <div className="info-cards-container">
              {[
                { icon: 'visibility', title: 'Transparência', desc: 'Você sabe exatamente como seus dados são tratados.' },
                { icon: 'group', title: 'Comunidade', desc: 'Devs, educadores e estudantes colaborando para evoluir a plataforma.' },
                { icon: 'menu_book', title: 'Aprendizado', desc: 'O código-fonte como material de estudo gratuito de IA e React.' },
              ].map((c, i) => (
                <motion.div
                  key={i}
                  className="info-card"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="card-icon">
                    <span className="material-symbols-outlined">{c.icon}</span>
                  </div>
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                </motion.div>
              ))}
            </div>
            <p className="license-description" style={{ marginTop: '2rem' }}>
              Distribuído sob a licença Creative Commons BY-SA 4.0.
            </p>
            <a
              href="https://creativecommons.org/licenses/by-sa/4.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="license-link"
            >
              Ler licença completa
              <span className="material-symbols-outlined">open_in_new</span>
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
