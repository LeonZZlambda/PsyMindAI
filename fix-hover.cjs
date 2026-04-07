const fs = require('fs');
let css = fs.readFileSync('src/styles/exams.css', 'utf8');

css += `
.exam-header-main .exam-header-favorite-btn:hover {
  transform: scale(1.05);
}
`;

fs.writeFileSync('src/styles/exams.css', css);
