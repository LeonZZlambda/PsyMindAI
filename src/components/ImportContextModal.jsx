import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

const ImportContextModal = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);
  const [importContext, setImportContext] = useState(() => localStorage.getItem('psymind_imported_context') || '');

  const importPrompt = `Você está me ajudando a importar o contexto de um assistente de IA para outro. Seu trabalho é analisar nossas conversas anteriores e resumir o que você sabe sobre mim.

Na resposta, evite usar pronomes na primeira pessoa (eu, meu, minha, me) e na segunda pessoa (você, seu, sua). Em vez disso, use "o usuário" ou outro termo neutro para se referir ao indivíduo com essas características.

Preserve as palavras do usuário ao pé da letra sempre que possível, especialmente para instruções e preferências.

Categorias (resposta nesta ordem):
1. Informações demográficas: como gosto que me chamem, profissão, formação acadêmica e local onde moro.
2. Interesses e preferências: coisas com que me envolvo de modo ativo e contínuo, não apenas um objeto que eu tenho ou uma compra que fiz uma vez.
3. Relacionamentos: relacionamentos confirmados e de longo prazo.
4. Eventos, projetos e planos: um registro de atividades recentes e significativas.
5. Instruções: regras que pedi explicitamente para você seguir, como "sempre faça X", "nunca faça Y" e correções no seu comportamento. Inclua apenas regras de dados de memória armazenados, não de conversas.

Formato:
Divida o conteúdo em seções rotuladas usando as categorias acima. Tente incluir citações de comandos meus que justifiquem cada resposta. Estruture cada item usando este formato:
O nome do usuário é <name>.
– Evidência: o usuário disse "me chame de <name>". Data: [YYYY-MM-DD].

Saída:
– Formate o resumo da resposta final como um bloco de texto.`;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(importPrompt);
    toast.success('Prompt copiado para a área de transferência');
  };

  const handleSaveContext = () => {
    localStorage.setItem('psymind_imported_context', importContext);
    toast.success('Contexto salvo com sucesso! O PsyMindAI agora conhece suas preferências.');
    handleClose();
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      modalRef.current?.focus();
    }
    
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
      <div 
        className={`modal-content ${isClosing ? 'closing' : ''}`}
        onClick={e => e.stopPropagation()} 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="import-context-title"
        ref={modalRef}
        tabIndex="-1"
      >
        <div className="modal-header">
          <h2 id="import-context-title">
            <span className="material-symbols-outlined" style={{ verticalAlign: 'middle', marginRight: '8px' }}>cloud_download</span>
            Importar Contexto
          </h2>
          <button className="close-btn" onClick={handleClose} aria-label="Fechar modal">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="modal-body" style={{ padding: '1.5rem' }}>
          <p style={{ margin: '-1.5rem -1.5rem 1.5rem -1.5rem', padding: '1rem 1.5rem', background: 'var(--card-hover)', borderBottom: '1px solid var(--border-color)', fontSize: '0.95rem', color: 'var(--text-color)' }}>
            Transfira as informações que outras inteligências artificiais conhecem sobre você para tornar suas próximas interações no PsyMind mais ricas e personalizadas.
          </p>

          <div className="setting-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem', padding: '0 0 1.5rem 0', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
            <div className="setting-info" style={{ width: '100%' }}>
              <span className="setting-label">1. Solicite o contexto</span>
              <span className="setting-desc">Copie o prompt abaixo e envie para o seu assistente de IA atual (ChatGPT, Claude, Gemini, etc.) para que ele gere um resumo sobre você.</span>
            </div>
            <div style={{ background: 'var(--background-color)', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-light)', border: '1px solid var(--border-color)', width: '100%', maxHeight: '120px', overflowY: 'auto' }}>
              <pre style={{ whiteSpace: 'pre-wrap', margin: 0, fontFamily: 'inherit' }}>{importPrompt}</pre>
            </div>
            <button className="secondary-btn" onClick={handleCopyPrompt} style={{ alignSelf: 'flex-start' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px', marginRight: '4px' }}>content_copy</span>
              Copiar prompt
            </button>
          </div>

          <div className="setting-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem', padding: 0 }}>
            <div className="setting-info" style={{ width: '100%' }}>
              <span className="setting-label">2. Cole a resposta aqui</span>
              <span className="setting-desc">Insira as informações geradas pela sua outra IA para que o PsyMind passe a conhecer suas preferências.</span>
            </div>
            <textarea 
              className="input-field"
              placeholder="Cole o perfil exportado aqui..."
              value={importContext}
              onChange={(e) => setImportContext(e.target.value)}
              style={{ width: '100%', minHeight: '160px', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--background-color)', color: 'var(--text-color)', resize: 'vertical' }}
            />
            <button className="primary-btn" onClick={handleSaveContext} style={{ alignSelf: 'flex-start', marginTop: '0.5rem', width: '100%', justifyContent: 'center' }}>
              Salvar Contexto
            </button>
          </div>

          <div style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-light)', opacity: 0.8 }}>
            <em>*O upload de conversas via ZIP pode ser incluído futuramente. As conversas que você adicionar ajudam o PsyMind a compreender melhor as suas preferências.</em>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportContextModal;