const fs = require('fs');

let content = fs.readFileSync('src/components/GuidedLearningModal.jsx', 'utf-8');

// Replace the renderOpenEnded contents
content = content.replace(
  '<div className="flashcard-front" style={{display: \'flex\', flexDirection: \'column\'}}>',
  '<div className="flashcard-front trail-flashcard-front">'
);
content = content.replace(
  '<textarea\n                     className="ai-input"\n                     rows="5"\n                     placeholder="Escreva sua reflexão ou resposta aqui..."\n                     value={discursiveResp}\n                     onChange={(e) => setDiscursiveResp(e.target.value)}\n                     disabled={isEvaluating}\n                     style={{width: \'100%\', marginBottom: \'15px\', resize: \'none\'}}\n                   />',
  '<textarea\n                     className="ai-textarea"\n                     rows="5"\n                     placeholder="Escreva sua reflexão ou resposta aqui..."\n                     value={discursiveResp}\n                     onChange={(e) => setDiscursiveResp(e.target.value)}\n                     disabled={isEvaluating}\n                   />'
);

content = content.replace(
  '<div style={{display: \'flex\', gap: \'10px\', width: \'100%\'}}>',
  '<div className="action-buttons-row">'
);

// Replace the Trails Active Header
content = content.replace(
  '<div className="trails-header" style={{ marginBottom: \'20px\', borderBottom: \'1px solid var(--border-color)\', paddingBottom: \'10px\' }}>\n                      <div>\n                     <button className="icon-btn" onClick={closeTrail} style={{ background: \'transparent\', margin: \'0 0 10px 0\', padding: 0, justifyContent: \'flex-start\', width: \'auto\'}}>\n                        <span className="material-symbols-outlined" style={{marginRight: \'8px\'}}>arrow_back</span> Voltar para Trilhas\n                     </button>\n                     <h3>\n                        {selectedTrail.icon && <span className="material-symbols-outlined" style={{ verticalAlign: \'middle\', marginRight: \'8px\', color: \'var(--primary-color)\'}}>{selectedTrail.icon}</span>} \n                        {selectedTrail.title}\n                     </h3>\n                     <p style={{ margin: \'8px 0 0 0\', color: \'var(--text-light)\', fontSize: \'0.9rem\'}}>{selectedTrail.description}</p>\n                  </div>\n                  <div style={{ textAlign: \'right\', display: \'flex\', flexDirection: \'column\', alignItems: \'flex-end\', justifyContent: \'center\' }}>',
  '<div className="trail-active-header">\n                      <div className="trail-active-header-left">\n                     <button className="trail-active-back-btn" onClick={closeTrail}>\n                        <span className="material-symbols-outlined" style={{marginRight: \'8px\'}}>arrow_back</span> Voltar para Trilhas\n                     </button>\n                     <h3 className="trail-active-title">\n                        {selectedTrail.icon && <span className="material-symbols-outlined" style={{ color: \'var(--primary-color)\'}}>{selectedTrail.icon}</span>} \n                        {selectedTrail.title}\n                     </h3>\n                     <p className="trail-active-desc">{selectedTrail.description}</p>\n                  </div>\n                  <div className="trail-active-header-right">'
);

// We also need to fix `<div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>`
content = content.replace(
  '<div style={{ flex: 1, display: \'flex\', justifyContent: \'center\', alignItems: \'flex-start\' }}>',
  '<div className="trail-content-area">'
);

fs.writeFileSync('src/components/GuidedLearningModal.jsx', content);
console.log("Replaced guided learning HTML structures");

