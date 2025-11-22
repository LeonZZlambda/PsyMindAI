import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import Footer from '../components/Footer';
import ScrollToTopButton from '../components/ScrollToTopButton';
import LandingHeader from '../components/LandingHeader';

const RoadmapPage = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  const roadmapItems = [
    {
      quarter: 'Q4 2025',
      status: 'completed',
      title: 'Lançamento Beta',
      items: [
        'Interface de Chat Intuitiva',
        'Integração com IA Generativa',
        'Modo Escuro/Claro',
        'Suporte a Comandos de Voz'
      ]
    },
    {
      quarter: 'Q1 2026',
      status: 'in-progress',
      title: 'Expansão de Recursos',
      items: [
        'Histórico de Conversas Persistente',
        'Análise de Sentimento em Tempo Real',
        'Módulo de Pomodoro Integrado',
        'Sistema de Contas de Usuário'
      ]
    },
    {
      quarter: 'Q2 2026',
      status: 'planned',
      title: 'Comunidade e Conteúdo',
      items: [
        'Fórum de Estudantes',
        'Curadoria de Conteúdos Educativos',
        'Integração com Google Calendar',
        'App Mobile (iOS/Android)'
      ]
    },
    {
      quarter: 'Q3 2026',
      status: 'planned',
      title: 'Personalização Avançada',
      items: [
        'Tutores de IA Personalizáveis',
        'Dashboard de Estatísticas de Estudo',
        'Gamificação e Conquistas',
        'API Pública para Desenvolvedores'
      ]
    }
  ];

  return (
    <motion.div 
      className="landing-page roadmap-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <LandingHeader />

      <main className="roadmap-content">
        <div className="roadmap-header">
          <h1>Roadmap do Produto</h1>
          <p>Acompanhe nossa jornada e veja o que estamos construindo para o futuro da educação emocional.</p>
        </div>

        <div className="roadmap-timeline">
          {roadmapItems.map((phase, index) => (
            <motion.div 
              key={index}
              className={`roadmap-card ${phase.status}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="card-status-indicator">
                <span className="material-symbols-outlined">
                  {phase.status === 'completed' ? 'check_circle' : 
                   phase.status === 'in-progress' ? 'pending' : 'schedule'}
                </span>
                <span>{phase.status === 'completed' ? 'Concluído' : 
                       phase.status === 'in-progress' ? 'Em Desenvolvimento' : 'Planejado'}</span>
              </div>
              <div className="card-header">
                <span className="quarter-badge">{phase.quarter}</span>
                <h2>{phase.title}</h2>
              </div>
              <ul className="feature-list">
                {phase.items.map((item, i) => (
                  <li key={i}>
                    <span className="material-symbols-outlined">arrow_right</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </main>

      <Footer />
      <ScrollToTopButton />
    </motion.div>
  );
};

export default RoadmapPage;
