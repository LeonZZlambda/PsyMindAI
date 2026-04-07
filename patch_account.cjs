const fs = require('fs');

let content = fs.readFileSync('src/components/AccountModal.jsx', 'utf-8');

// Add responseMode to initial state
content = content.replace(
  "basicStyle: 'default',",
  "responseMode: 'default',\n    basicStyle: 'default',"
);

// Add the Response Mode UI section
const newModeUI = `                <div className="settings-section">
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Perfil de Resposta</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-color)', opacity: 0.8, marginBottom: '16px' }}>
                    Escolha um perfil de comportamento para o assistente.
                  </p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
                    {[
                      { id: 'default', title: 'Padrão', icon: 'smart_toy', desc: 'Equilibrado e adaptável' },
                      { id: 'reflective', title: 'Reflexivo', icon: 'psychology', desc: 'Foco em análise emocional' },
                      { id: 'action', title: 'Ação', icon: 'bolt', desc: 'Direto e focado em soluções' },
                      { id: 'learning', title: 'Didático', icon: 'school', desc: 'Explicações passo a passo' },
                      { id: 'support', title: 'Acolhimento', icon: 'volunteer_activism', desc: 'Validação e suporte emocional' }
                    ].map(mode => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => handleChange({ target: { name: 'responseMode', type: 'text', value: mode.id }})}
                        style={{
                          padding: '12px',
                          borderRadius: '12px',
                          border: profileSettings.responseMode === mode.id || (!profileSettings.responseMode && mode.id === 'default') ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                          background: profileSettings.responseMode === mode.id || (!profileSettings.responseMode && mode.id === 'default') ? 'var(--primary-color-alpha)' : 'transparent',
                          color: 'var(--text-color)',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          gap: '8px',
                          textAlign: 'left',
                          transition: 'all 0.2s',
                          width: '100%'
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ color: profileSettings.responseMode === mode.id || (!profileSettings.responseMode && mode.id === 'default') ? 'var(--primary-color)' : 'inherit' }}>
                          {mode.icon}
                        </span>
                        <div>
                          <strong style={{ display: 'block', fontSize: '0.95rem' }}>{mode.title}</strong>
                          <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>{mode.desc}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="settings-section" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '12px' }}>Ajustes Finos Opcionais</h3>
                  <div className="setting-item">
                    <div className="setting-info">
                      <span className="setting-label">Estilo padrão</span>`;

content = content.replace(
  '<div className="settings-section">\n                  <div className="setting-item">\n                    <div className="setting-info">\n                      <span className="setting-label">Estilo padrão</span>',
  newModeUI
);

// If the script fails to replace, we log
if (content.includes('Perfil de Resposta')) {
  fs.writeFileSync('src/components/AccountModal.jsx', content);
  console.log("Success patch React");
} else {
  console.log("Failed patch React");
}
