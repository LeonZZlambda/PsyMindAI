import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import Footer from '../components/Footer';
import ScrollToTopButton from '../components/ScrollToTopButton';
import LandingHeader from '../components/LandingHeader';
import '../styles/styleguide.css';

const StyleGuidePage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  return (
    <motion.div 
      className="landing-page styleguide-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <LandingHeader />

      <main className="styleguide-content">
        <div className="styleguide-header">
          <h1>Guia de Estilo & Acessibilidade</h1>
          <p>Diretrizes oficias de Interface, UX e Comportamento para manter o PsyMind.AI consistente.</p>
        </div>

        <section className="sg-section">
          <h2><span className="material-symbols-outlined">palette</span> Paleta de Cores</h2>
          <p>O sistema foi concebido com uma paleta inspirada na fusão de serenidade (Psicologia) e foco (Estudo).</p>
          
          <div className="color-grid">
            <div className="color-card primary">
              <div className="color-swatch"></div>
              <div className="color-info">
                <strong>Primária (Foco)</strong>
                <code>var(--primary-color)</code>
              </div>
            </div>
            
            <div className="color-card background">
              <div className="color-swatch"></div>
              <div className="color-info">
                <strong>Fundo Principal</strong>
                <code>var(--background-color)</code>
              </div>
            </div>

            <div className="color-card secondary">
              <div className="color-swatch"></div>
              <div className="color-info">
                <strong>Secundária / Painéis</strong>
                <code>var(--secondary-color)</code>
              </div>
            </div>

            <div className="color-card text">
              <div className="color-swatch"></div>
              <div className="color-info">
                <strong>Texto (Alto Contraste)</strong>
                <code>var(--text-color)</code>
              </div>
            </div>
            
            <div className="color-card gradient">
              <div className="color-swatch"></div>
              <div className="color-info">
                <strong>Gradiente (CTA)</strong>
                <code>linear-gradient(135deg, ...)</code>
              </div>
            </div>
          </div>
        </section>

        <section className="sg-section">
          <h2><span className="material-symbols-outlined">dark_mode</span> Padrão do Dark Mode</h2>
          <p>A arquitetura de modo escuridão flui através da classe <code>.app.dark</code> e NUNCA pela tag interna <code>body.dark</code>. Ao introduzir novidades com CSS externo, declare dessa forma para prevalecer.</p>
          
          <pre className="sg-code">
{`/* Forma INCORRETA ❌ */
body.dark .meu-componente { background: #333; }

/* Forma CORRETA ✅ */
.app.dark .meu-componente { 
  background: #1e1e1e; 
  color: #f8f8f2; 
}`}
          </pre>
        </section>

        <section className="sg-section">
          <h2><span className="material-symbols-outlined">smart_button</span> Botões (Call to Action)</h2>
          <p>Ações e confirmações seguem a hierarquia de importância da página com as mesmas classes globais em qualquer janela.</p>
          
          <div className="buttons-showcase">
            <div className="btn-group">
                <span>Ação Complementar</span>
                <button className="primary-btn">Secundário</button>
            </div>
            <div className="btn-group">
                <span>Call to Action (Principal)</span>
                <button className="primary-btn cta">
                   <span className="material-symbols-outlined">play_arrow</span> Action
                </button>
            </div>
            <div className="btn-group">
                <span>Modificadores Específicos</span>
                <button className="topic-action-btn">
                   <span className="material-symbols-outlined">quiz</span>
                </button>
            </div>
          </div>
        </section>

        <section className="sg-section">
          <h2><span className="material-symbols-outlined">web_asset</span> Modais e Responsividade</h2>
          <p>Todo o sistema segue mobile-first e prioriza acessibilidade.</p>
          <ul className="sg-list">
            <li><strong>Modais:</strong> <code>.modal-overlay</code> como wrapper isolado global para sobrepor tudo e <code>.modal-content</code> como a janela branca ou dark macia redonda no centro.</li>
            <li><strong>Breakpoint:</strong> Utilize <code>@media (max-width: 768px)</code> como a quebra principal e flexão de colunas em <i>Vertical Stacking</i> nos celulares.</li>
            <li><strong>Heights Fluídas:</strong> Como os iOS ignoram abas horizontais clássicas inferiormente, priorize <code>100dvh</code> (ao invés de 100vh) em abas que precisam tocar o talo final do celular.</li>
          </ul>
        </section>

        
        <section className="sg-section">
          <h2><span className="material-symbols-outlined">text_fields</span> Tipografia</h2>
          <p>O PsyMind utiliza a Google Sans para garantir um padrão estético de clareza e alta resolução em títulos, com suporte para monoespaçamento em IDEs (Modo Juiz).</p>
          <div className="typo-showcase">
             <div className="typo-item">
                <h1>H1 - Título Primário</h1>
                <code>font-size: 2.5rem | weight: 700</code>
             </div>
             <div className="typo-item">
                <h2>H2 - Título de Seção</h2>
                <code>font-size: 1.8rem | weight: 600</code>
             </div>
             <div className="typo-item">
                <h3>H3 - Intertítulo</h3>
                <code>font-size: 1.4rem | weight: 500</code>
             </div>
             <div className="typo-item">
                <p>Parágrafo Base: Utilizado para leituras de longa duração, como as explicações completas de IA do Guia de Aprendizado ou mensagens do Chat, com espaçamento projetado (line-height: 1.6) para prevenir fadiga visual em alunos.</p>
                <code>font-size: 1rem (16px) | line-height: 1.6</code>
             </div>
             <div className="typo-item mono-preview">
                <pre><code>{`function code() {
  return "Fira Code";
}`}</code></pre>
                <code>font-family: 'Fira Code', 'Consolas', monospace</code>
             </div>
          </div>
        </section>

        <section className="sg-section">
          <h2><span className="material-symbols-outlined">layers</span> Inputs & Interfaces Táteis</h2>
          <p>Todos os campos de texto devem atingir no mínimo 44px de altura tátil em dispositivos móveis, para interações limpas.</p>
          <div className="inputs-showcase">
             <div className="input-group">
                <label>Input Textual Base</label>
                <input type="text" placeholder="Qual a sua principal meta de estudos?" className="sg-input" />
             </div>
             <div className="input-group">
                <label>Seletor de Opções (Dropdown)</label>
                <select className="sg-select">
                   <option>Olimpíada Brasileira de Informática (OBI)</option>
                   <option>Exame Nacional do Ensino Médio (ENEM)</option>
                </select>
             </div>
             <div className="input-group">
                <label>Área de Escrita (Textarea)</label>
                <textarea rows="3" placeholder="Sua reflexão diária..." className="sg-input"></textarea>
             </div>
          </div>
        </section>

        <section className="sg-section">
          <h2><span className="material-symbols-outlined">accessibility_new</span> Acessibilidade e Inclusão</h2>
          <p>Toda arquitetura da plataforma foi moldada garantindo adaptações nativas para Estudantes PDC. O sistema injetará atributos dinâmicos no elemento pai do Virtual DOM.</p>
          <ul className="sg-list">
            <li><strong>Reduced Motion (Ativo):</strong> Animações Framer Motion, keyframes (Ex: roleta circular e slide-ups de Modais) e View API Transitions não são renderizadas. Classes ativadoras: <code>.reduced-motion</code>.</li>
            <li><strong>High Contrast (Ativo):</strong> Substitui sombras macias do Google por delineamentos contínuos sólidos e eleva limiares de cinza (#5F6368) para preto (#000000). Classe ativadora: <code>.high-contrast</code>.</li>
            <li><strong>Colorblind (Daltonismo):</strong> Filtros matrizes SVG de correção de canais RGB de <code>protanopia</code>, <code>deuteranopia</code> ou <code>tritanopia</code> fixados em <code>.color-blind-*</code>.</li>
          </ul>
        </section>

        <section className="sg-section">
          <h2><span className="material-symbols-outlined">emoji_objects</span> Biblioteca de Ícones</h2>
          <p>O PsyMind utiliza pacotes minimalistas nativos através da <strong>Material Symbols Outlined</strong>, peso 400. Evitar FontAwesome ou Mix Icons.</p>
          <div className="icons-grid">
             <div className="sg-icon"><span className="material-symbols-outlined">psychology</span><span>psychology</span></div>
             <div className="sg-icon"><span className="material-symbols-outlined">school</span><span>school</span></div>
             <div className="sg-icon"><span className="material-symbols-outlined">menu_book</span><span>menu_book</span></div>
             <div className="sg-icon"><span className="material-symbols-outlined">code_blocks</span><span>code_blocks</span></div>
             <div className="sg-icon"><span className="material-symbols-outlined">monitoring</span><span>monitoring</span></div>
             <div className="sg-icon"><span className="material-symbols-outlined">favorite</span><span>favorite</span></div>
             <div className="sg-icon"><span className="material-symbols-outlined">quiz</span><span>quiz</span></div>
             <div className="sg-icon"><span className="material-symbols-outlined">check_circle</span><span>check_circle</span></div>
          </div>
        </section>

        <div className="sg-actions">
           <button className="primary-btn cta" onClick={() => navigate('/contribute')}>
              <span className="material-symbols-outlined">arrow_back</span>
              Voltar ao Projeto Open Source
           </button>
        </div>

      </main>

      <Footer />
      <ScrollToTopButton />
    </motion.div>
  );
};

export default StyleGuidePage;
