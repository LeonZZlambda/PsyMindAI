const fs = require('fs');
let content = fs.readFileSync('src/components/GuidedLearningModal.jsx', 'utf-8');
content = content.replace(
  '<div className="learning-content" style={{ display: \'flex\', flexDirection: \'column\' }}>', 
  '<div className="learning-content">'
);
fs.writeFileSync('src/components/GuidedLearningModal.jsx', content);
