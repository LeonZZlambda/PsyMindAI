import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

const KindnessModal = ({ isOpen, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [act, setAct] = useState('');
  const [category, setCategory] = useState('random');
  const [isLoading, setIsLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const categories = [
    { id: 'random', label: 'Aleatório', icon: 'shuffle' },
    { id: 'stranger', label: 'Estranhos', icon: 'public' },
    { id: 'family', label: 'Família/Amigos', icon: 'group' },
    { id: 'self', label: 'Para Você', icon: 'favorite' },
    { id: 'work', label: 'Trabalho/Escola', icon: 'work' }
  ];

  const actsDatabase = {
    stranger: [
      "Elogie sinceramente a roupa ou acessório de alguém que você não conhece.",
      "Segure a porta para alguém entrar ou sair.",
      "Deixe um bilhete positivo em um livro da biblioteca ou lugar público.",
      "Sorria e cumprimente o motorista do ônibus ou caixa do mercado.",
      "Pague o café da pessoa atrás de você na fila (se puder)."
    ],
    family: [
      "Ligue para um parente apenas para dizer que o ama.",
      "Faça uma tarefa doméstica que não é sua responsabilidade.",
      "Escreva uma carta de agradecimento para alguém que te ajudou no passado.",
      "Cozinhe a refeição favorita de alguém da sua casa.",
      "Ouça ativamente alguém sem interromper ou olhar o celular."
    ],
    self: [
      "Liste 3 coisas que você gosta em si mesmo.",
      "Tire 15 minutos para fazer algo que você ama sem culpa.",
      "Perdoe-se por um erro cometido recentemente.",
      "Faça uma caminhada consciente observando a natureza.",
      "Escreva em um diário como você está se sentindo hoje."
    ],
    work: [
      "Ofereça ajuda a um colega que parece sobrecarregado.",
      "Elogie o trabalho de alguém publicamente ou para o chefe.",
      "Traga um lanche ou doce para compartilhar com a equipe.",
      "Deixe um post-it de encorajamento na mesa de alguém.",
      "Agradeça a alguém por algo específico que ela fez."
    ]
  };

  const generateAct = async (selectedCategory = category) => {
    setIsLoading(true);
    setCompleted(false);
    
    try {
      const { sendMessageToGemini } = await import('../services/gemini');
      
      const categoryPrompts = {
        random: 'Sugira um ato de bondade simples e prático que qualquer pessoa pode fazer hoje (1 frase).',
        stranger: 'Sugira um ato de bondade simples para fazer a um estranho (1 frase).',
        family: 'Sugira um ato de bondade simples para fazer a família ou amigos (1 frase).',
        self: 'Sugira um ato de autocuidado ou autocompaixão simples (1 frase).',
        work: 'Sugira um ato de bondade simples para fazer no trabalho ou escola (1 frase).'
      };
      
      const prompt = categoryPrompts[selectedCategory] || categoryPrompts.random;
      const result = await sendMessageToGemini(prompt, []);
      
      if (result.success) {
        setAct(result.text.trim());
      } else {
        let pool = [];
        if (selectedCategory === 'random') {
          Object.values(actsDatabase).forEach(arr => pool.push(...arr));
        } else {
          pool = actsDatabase[selectedCategory];
        }
        const randomAct = pool[Math.floor(Math.random() * pool.length)];
        setAct(randomAct);
      }
    } catch (error) {
      let pool = [];
      if (selectedCategory === 'random') {
        Object.values(actsDatabase).forEach(arr => pool.push(...arr));
      } else {
        pool = actsDatabase[selectedCategory];
      }
      const randomAct = pool[Math.floor(Math.random() * pool.length)];
      setAct(randomAct);
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen && !act) {
      generateAct();
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const handleComplete = () => {
    setCompleted(true);
    toast.success("Parabéns! O mundo ficou um pouco melhor.");
    
    // Confetti effect could be added here
  };

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
      <div className="modal-content kindness-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Atos de Bondade</h2>
          <button className="close-btn" onClick={handleClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="modal-body kindness-body">
          <div className="kindness-categories">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`category-btn ${category === cat.id ? 'active' : ''}`}
                onClick={() => {
                  setCategory(cat.id);
                  generateAct(cat.id);
                }}
                title={cat.label}
              >
                <span className="material-symbols-outlined">{cat.icon}</span>
                <span className="category-label">{cat.label}</span>
              </button>
            ))}
          </div>

          <div className="act-display-container">
            {isLoading ? (
              <div className="act-loading">
                <span className="material-symbols-outlined spin-animation">psychology</span>
                <p>A IA está encontrando o ato perfeito...</p>
              </div>
            ) : (
              <div className={`act-card ${completed ? 'completed' : ''}`}>
                <span className="material-symbols-outlined act-icon">volunteer_activism</span>
                <p className="act-text">{act}</p>
                {completed && (
                  <div className="completion-badge">
                    <span className="material-symbols-outlined">check_circle</span>
                    Concluído
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="kindness-controls">
            <button 
              className="action-btn secondary"
              onClick={() => generateAct()}
              disabled={isLoading}
            >
              <span className="material-symbols-outlined">refresh</span>
              Gerar Outro
            </button>
            
            <button 
              className={`action-btn primary ${completed ? 'disabled' : ''}`}
              onClick={handleComplete}
              disabled={completed || isLoading}
            >
              <span className="material-symbols-outlined">favorite</span>
              {completed ? 'Feito!' : 'Vou fazer isso!'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KindnessModal;
