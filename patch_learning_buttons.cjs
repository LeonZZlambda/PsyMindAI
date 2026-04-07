const fs = require('fs');

let content = fs.readFileSync('src/components/GuidedLearningModal.jsx', 'utf-8');

content = content.replace(
  '<button className="primary-btn cta" style={{flex: 1, display: \'flex\', justifyContent: \'center\', gap: \'8px\'}} \n                         onClick={() => handleEvaluateDiscursive(openEndedItem.question, discursiveResp)} disabled={isEvaluating || !discursiveResp.trim()}>\n                         <span className="material-symbols-outlined">rate_review</span>\n                         {isEvaluating ? \'Avaliando...\' : \'Avaliar Resposta com IA\'}\n                      </button>\n               <button className="secondary-btn" onClick={isTrail ? nextTrailStep : null} style={{ height: \'auto\', padding: \'10px 15px\' }}>\n                  Pular\n               </button>',
  '<button className="primary-btn cta evaluate-btn"\n                         onClick={() => handleEvaluateDiscursive(openEndedItem.question, discursiveResp)} disabled={isEvaluating || !discursiveResp.trim()}>\n                         <span className="material-symbols-outlined">rate_review</span>\n                         {isEvaluating ? \'Avaliando...\' : \'Avaliar Resposta com IA\'}\n                      </button>\n               <button className="secondary-btn skip-btn" onClick={isTrail ? nextTrailStep : null}>\n                  Pular\n               </button>'
);

fs.writeFileSync('src/components/GuidedLearningModal.jsx', content);

