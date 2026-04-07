const fs = require('fs');
let content = fs.readFileSync('src/styles/styleguide.css', 'utf-8');

const cssAdditions = `
/* Typography Showcase */
.typo-showcase {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.typo-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-left: 2px solid var(--primary-color);
  padding-left: 16px;
}

.app.dark .typo-item {
  border-color: #80cbc4;
}

.typo-item h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0;
}

.typo-item h2 {
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.typo-item h3 {
  font-size: 1.4rem;
  font-weight: 500;
  color: var(--text-color);
  margin: 0;
}

.typo-item p {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-light);
  margin: 0;
}

.typo-item code {
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 12px;
  background: var(--secondary-color);
  padding: 4px 8px;
  border-radius: 4px;
  width: fit-content;
  color: var(--text-light);
}

.app.dark .typo-item code {
  background: #2d2d2d;
}

.mono-preview pre {
  margin: 0;
  background: #1e1e1e;
  padding: 12px;
  border-radius: 6px;
  color: #d4d4d4;
  font-family: 'Fira Code', 'Consolas', monospace;
}

/* Inputs Showcase */
.inputs-showcase {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group label {
  font-size: 14px;
  font-weight: 600;
  color: var(--primary-color);
}

.sg-input, .sg-select {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--background-color);
  color: var(--text-color);
  font-size: 15px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  font-family: inherit;
  outline: none;
}

.sg-input:focus, .sg-select:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(0, 121, 107, 0.1);
}

.app.dark .sg-input, .app.dark .sg-select {
  background: #2d2d2d;
  border-color: #444;
}

.app.dark .sg-input:focus, .app.dark .sg-select:focus {
  border-color: #80cbc4;
  box-shadow: 0 0 0 3px rgba(128, 203, 196, 0.2);
}

/* Icons Grid */
.icons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.sg-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: var(--secondary-color);
  padding: 24px 12px;
  border-radius: 12px;
  transition: transform 0.2s ease;
}

.app.dark .sg-icon {
  background: #2d2d2d;
}

.sg-icon:hover {
  transform: translateY(-4px);
  background: var(--primary-color);
  color: #fff;
}

.app.dark .sg-icon:hover {
  background: #00695C;
}

.sg-icon .material-symbols-outlined {
  font-size: 36px;
}

.sg-icon span:last-child {
  font-size: 13px;
  font-family: monospace;
}
`;

fs.writeFileSync('src/styles/styleguide.css', content + '\\n' + cssAdditions);
console.log('StyleGuide CSS updated with additions!');
