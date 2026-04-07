const fs = require('fs');
let css = fs.readFileSync('src/styles/exams.css', 'utf8');

// remove all definitions of .exam-header-main and its descendants up to .star-icon-header
css = css.replace(/\.exam-header-main.*?\{[^}]*\}/gs, '');
css = css.replace(/\.exam-detail-title.*?\{[^}]*\}/gs, '');
css = css.replace(/\.exam-detail-desc.*?\{[^}]*\}/gs, '');
css = css.replace(/\.exam-header-favorite-btn.*?\{[^}]*\}/gs, '');
css = css.replace(/\.star-icon-header.*?\{[^}]*\}/gs, '');
css = css.replace(/body\.dark \.exam-header-favorite-btn.*?\{[^}]*\}/gs, '');

fs.writeFileSync('src/styles/exams.css', css);
