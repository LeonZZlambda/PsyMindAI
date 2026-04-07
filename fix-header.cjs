const fs = require('fs');
let css = fs.readFileSync('src/styles/exams.css', 'utf8');

// replace .exam-header-main
css = css.replace(/\.exam-header-main \{\n  position: relative;\n  text-align: center;\n  padding: 24px 16px;\n  background: var\(--secondary-color\);\n  border-radius: 12px;\n  margin-bottom: 24px;\n\}/g, 
`.exam-header-main {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 48px; /* Extra padding on sides to prevent text overlap with button */
  background: var(--secondary-color);
  border-radius: 12px;
  margin-bottom: 24px;
  text-align: center;
}`);

// fix the favorite btn absolute positioning to prevent transform jump
css = css.replace(/\.exam-header-main \.exam-header-favorite-btn \{\n  position: absolute;\n  top: 50%;\n  right: 16px;\n  transform: translateY\(-50%\);\n  color: var\(--text-light\); \/\* Default icon color \*\/\n\}/g,
`.exam-header-main .exam-header-favorite-btn {
  position: absolute;
  top: calc(50% - 22px); /* 44px height / 2 */
  right: 16px;
  transform: none; /* avoid transform class override jumping */
  color: var(--text-light);
  margin: 0;
}`);

// To ensure hover works correctly without jumping
// The previous class has `.exam-header-favorite-btn:hover { transform: scale(1.05); }`
// The text inside `.exam-header-text` is now centered.
fs.writeFileSync('src/styles/exams.css', css);
