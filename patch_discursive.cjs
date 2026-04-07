const fs = require('fs');

let content = fs.readFileSync('src/components/GuidedLearningModal.jsx', 'utf-8');

const regexOpenEnded = /const renderOpenEnded = \(openEndedItem, isTrail = false\) => \{[\s\S]*?className="flashcard-container"[\s\S]*?style=\{{height: 'auto', minHeight: '300px'}\}>(?:\s|.)*?return \(\s*<div className="flashcard-container"(?:.|\s)*?<\/div>\s*\);\s*\};/

// I will manually replace the exact string instead of regex to avoid errors

content = content.replace(
  '<div className="flashcard-container" style={{height: \'auto\', minHeight: \'300px\'}}>',
  '<div className="flashcard-container discursive-container">'
);

content = content.replace(
  '<h4 style={{marginBottom: \'15px\'}}>{openEndedItem.question}</h4>',
  '<h4 className="discursive-question">{openEndedItem.question}</h4>'
);

content = content.replace(
  '{openEndedItem.hint && <p style={{fontSize: \'0.85rem\', color: \'var(--text-light)\', marginBottom: \'15px\'}}>{openEndedItem.hint}</p>}',
  '{openEndedItem.hint && <p className="discursive-hint">{openEndedItem.hint}</p>}'
);

content = content.replace(
  '<div style={{ backgroundColor: \'var(--accent-light, rgba(34, 197, 94, 0.15))\', padding: \'15px\', borderRadius: \'12px\', marginBottom: \'15px\', fontSize: \'0.95rem\' }}>',
  '<div className="discursive-feedback-box">'
);

content = content.replace(
  '<span className="material-symbols-outlined watermark" style={{top: \'10px\', right: \'10px\'}}>edit_note</span>',
  '<span className="material-symbols-outlined watermark discursive-watermark">edit_note</span>'
);

fs.writeFileSync('src/components/GuidedLearningModal.jsx', content);

