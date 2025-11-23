import React, { useState } from 'react';
import '../styles/help.css';

const CognitiveAnalysisModal = ({ isOpen, onClose }) => {
  const [thought, setThought] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!thought.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const { sendMessageToGemini } = await import('../services/gemini');
      
      const prompt = `Analise o seguinte pensamento de um estudante sob a perspectiva da Terapia Cognitivo-Comportamental (TCC):

"${thought}"

Forneça uma análise estruturada em JSON com:
{
  "distorcao": "Nome da distorção cognitiva identificada",
  "desafio": "Explicação de como esse pensamento é problemático",
  "perspectiva": "Perspectiva alternativa mais realista",
  "novoPensamento": "Sugestão de pensamento mais equilibrado"
}`;
      
      const result = await sendMessageToGemini(prompt, []);
      
      if (result.success) {
        try {
          const jsonMatch = result.text.match(/\{[\s\S]*\}/);
          const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
          
          if (parsed) {
            setAnalysis(parsed);
          } else {
            setAnalysis({
              distorcao: 'Análise Geral',
              desafio: result.text,
              perspectiva: 'Tente ver a situação de forma mais equilibrada.',
              novoPensamento: 'Posso lidar com isso de forma mais construtiva.'
            });
          }
        } catch {
          setAnalysis({
            distorcao: 'Análise Geral',
            desafio: result.text,
            perspectiva: 'Tente ver a situação de forma mais equilibrada.',
            novoPensamento: 'Posso lidar com isso de forma mais construtiva.'
          });
        }
      } else {
        setAnalysis({
          distorcao: 'Erro',
          desafio: result.userMessage || 'Não foi possível analisar no momento.',
          perspectiva: '',
          novoPensamento: ''
        });
      }
    } catch (error) {
      setAnalysis({
        distorcao: 'Erro',
        desafio: 'Erro ao conectar com IA. Tente novamente.',
        perspectiva: '',
        novoPensamento: ''
      });
    }
    setIsAnalyzing(false);
  };

  const handleClose = () => {
    setThought('');
    setAnalysis(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Análise Cognitiva</h2>
          <button className="close-btn" onClick={handleClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="help-body">
          <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            Descreva um pensamento negativo ou preocupação que você está tendo:
          </p>
          
          <textarea
            value={thought}
            onChange={(e) => setThought(e.target.value)}
            placeholder="Ex: Eu sempre falho nas provas, nunca vou conseguir passar no vestibular..."
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '1rem',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              background: 'var(--card-background)',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              resize: 'vertical',
              marginBottom: '1rem'
            }}
          />
          
          <button
            onClick={handleAnalyze}
            disabled={!thought.trim() || isAnalyzing}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'linear-gradient(135deg, #7b1fa2, #9c27b0)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: 500,
              cursor: thought.trim() && !isAnalyzing ? 'pointer' : 'not-allowed',
              opacity: thought.trim() && !isAnalyzing ? 1 : 0.6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <span className="material-symbols-outlined">
              {isAnalyzing ? 'hourglass_empty' : 'psychology'}
            </span>
            {isAnalyzing ? 'Analisando...' : 'Analisar Pensamento'}
          </button>

          {analysis && (
            <div style={{ marginTop: '2rem' }}>
              <div style={{
                background: 'rgba(156, 39, 176, 0.1)',
                border: '1px solid rgba(156, 39, 176, 0.3)',
                borderRadius: '12px',
                padding: '1.5rem',
                marginBottom: '1rem'
              }}>
                <h3 style={{ color: '#9c27b0', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                  Possível Distorção
                </h3>
                <p style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                  {analysis.distorcao}
                </p>
              </div>

              <div style={{
                background: 'var(--card-background)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '1.5rem',
                marginBottom: '1rem'
              }}>
                <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1rem' }}>
                  O Desafio
                </h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {analysis.desafio}
                </p>
              </div>

              {analysis.perspectiva && (
                <div style={{
                  background: 'var(--card-background)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  marginBottom: '1rem'
                }}>
                  <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1rem' }}>
                    Perspectiva Alternativa
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {analysis.perspectiva}
                  </p>
                </div>
              )}

              {analysis.novoPensamento && (
                <div style={{
                  background: 'rgba(0, 150, 136, 0.1)',
                  border: '1px solid rgba(0, 150, 136, 0.3)',
                  borderRadius: '12px',
                  padding: '1.5rem'
                }}>
                  <h3 style={{ color: '#009688', marginBottom: '0.5rem', fontSize: '1rem' }}>
                    Novo Pensamento Sugerido
                  </h3>
                  <p style={{ color: 'var(--text-primary)', lineHeight: 1.6, fontStyle: 'italic' }}>
                    "{analysis.novoPensamento}"
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CognitiveAnalysisModal;
