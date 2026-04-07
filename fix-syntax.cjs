const fs = require('fs');
let css = fs.readFileSync('src/styles/exams.css', 'utf8');

css = css.replace(/body\.dark \n\n\.topics-list/g, '.topics-list');

fs.writeFileSync('src/styles/exams.css', css);
