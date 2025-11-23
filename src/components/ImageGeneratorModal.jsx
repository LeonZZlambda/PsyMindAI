import React, { useState } from 'react';
import '../styles/help.css';

const ImageGeneratorModal = ({ isOpen, onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setGeneratedImage(null);
    
    try {
      const { generateImage } = await import('../services/gemini');
      const result = await generateImage(prompt);
      
      if (result.success) {
        setGeneratedImage(result.imageUrl);
      } else {
        alert(result.userMessage || 'Erro ao gerar imagem');
      }
    } catch (error) {
      alert('❌ Erro ao conectar com IA. Tente novamente.');
    }
    
    setIsGenerating(false);
  };

  const handleClose = () => {
    setPrompt('');
    setGeneratedImage(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🎨 Gerador de Imagens</h2>
          <button className="close-btn" onClick={handleClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="help-body">
          <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            Descreva a imagem que você quer criar:
          </p>
          
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ex: Um estudante feliz estudando em uma biblioteca iluminada, estilo cartoon"
            style={{
              width: '100%',
              minHeight: '80px',
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
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'linear-gradient(135deg, #4285f4, #7c4dff)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: 500,
              cursor: prompt.trim() && !isGenerating ? 'pointer' : 'not-allowed',
              opacity: prompt.trim() && !isGenerating ? 1 : 0.6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <span className="material-symbols-outlined">
              {isGenerating ? 'hourglass_empty' : 'image'}
            </span>
            {isGenerating ? 'Gerando imagem...' : 'Gerar Imagem'}
          </button>

          {generatedImage && (
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <img 
                src={generatedImage} 
                alt="Imagem gerada"
                style={{
                  maxWidth: '100%',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              />
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = generatedImage;
                  link.download = 'psymind-image.png';
                  link.click();
                }}
                style={{
                  marginTop: '1rem',
                  padding: '0.5rem 1rem',
                  background: 'var(--primary-color)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  margin: '1rem auto 0'
                }}
              >
                <span className="material-symbols-outlined">download</span>
                Baixar Imagem
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageGeneratorModal;
