const fs = require('fs');
let css = fs.readFileSync('src/styles/exams.css', 'utf8');

// replace .exam-header-favorite-btn styles
css = css.replace(/\.exam-header-favorite-btn \{\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 8px;\n  border-radius: 8px;\n  background: var\(--background-color\);\n  border: 1px solid var\(--border-color\);\n  transition: all 0\.2s ease;\n\}/g, 
`.exam-header-favorite-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 50%;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}`);

css = css.replace(/\.exam-header-favorite-btn\.is-favorite \{\n  color: #f59e0b;\n  background: #fffbeb;\n  border-color: #fbd38d;\n\}/g, 
`.exam-header-favorite-btn.is-favorite {
  color: #f59e0b;
  background: transparent;
  border-color: transparent;
}`);

css = css.replace(/body\.dark \.exam-header-favorite-btn\.is-favorite \{\n  background: rgba\(245, 158, 11, 0\.1\);\n  border-color: rgba\(245, 158, 11, 0\.3\);\n\}/g, 
`body.dark .exam-header-favorite-btn.is-favorite {
  background: transparent;
  border-color: transparent;
  color: #f59e0b;
}`);

// To keep the subtle background hover highlight if wanted (or keep it purely icon based like checkbox)
// I'll make it purely icon based.

fs.writeFileSync('src/styles/exams.css', css);
