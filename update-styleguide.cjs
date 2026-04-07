const fs = require('fs');

const file = 'src/pages/StyleGuidePage.jsx';
let content = fs.readFileSync(file, 'utf-8');

const newSections = `
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
                <pre><code>function code() {\n  return "Fira Code";\n}</code></pre>
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
`;

content = content.replace('<div className="sg-actions">', newSections + '\n        <div className="sg-actions">');

fs.writeFileSync(file, content);
console.log('StyleGuide updated with new text content!');
