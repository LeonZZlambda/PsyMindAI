const fs = require('fs');
let content = fs.readFileSync('src/components/GuidedLearningModal.jsx', 'utf-8');

content = content.replace(
  '<div className="flashcard-container discursive-container">\n         <div className="flashcard">\n            <div className="flashcard-front trail-flashcard-front">',
  '<div className="discursive-wrapper">\n         <div className="discursive-card">'
);
content = content.replace(
  '               )}\n            </div>\n         </div>\n      </div>\n    );\n  };',
  '               )}\n         </div>\n      </div>\n    );\n  };'
);

fs.writeFileSync('src/components/GuidedLearningModal.jsx', content);
