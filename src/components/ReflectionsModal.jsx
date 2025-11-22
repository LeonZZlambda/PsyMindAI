import React, { useEffect, useRef, useState } from 'react';
import { useChat } from '../context/ChatContext';
import '../styles/help.css';
import '../styles/reflections.css';

const reflectionsData = [
  { id: 1, text: "A única maneira de fazer um excelente trabalho é amar o que você faz.", author: "Steve Jobs", category: "propósito" },
  { id: 2, text: "Não é o que nos acontece, mas nossa reação ao que nos acontece que nos fere.", author: "Epiteto", category: "resiliência" },
  { id: 3, text: "A felicidade não é algo pronto. Ela vem de suas próprias ações.", author: "Dalai Lama", category: "felicidade" },
  { id: 4, text: "Conhece-te a ti mesmo e conhecerás o universo e os deuses.", author: "Sócrates", category: "autoconhecimento" },
  { id: 5, text: "O sucesso é ir de fracasso em fracasso sem perder o entusiasmo.", author: "Winston Churchill", category: "resiliência" },
  { id: 6, text: "Seja a mudança que você quer ver no mundo.", author: "Mahatma Gandhi", category: "propósito" },
  { id: 7, text: "A ansiedade é a vertigem da liberdade.", author: "Søren Kierkegaard", category: "ansiedade" },
  { id: 8, text: "O que você pensa, você se torna. O que você sente, você atrai. O que você imagina, você cria.", author: "Buda", category: "autoconhecimento" },
  { id: 9, text: "Não deixe que o ruído da opinião alheia cale a sua própria voz interior.", author: "Steve Jobs", category: "autoestima" },
  { id: 10, text: "A gratidão transforma o que temos em suficiente.", author: "Melody Beattie", category: "gratidão" }
];

const categories = [
  { id: 'resiliência', label: 'Resiliência', icon: 'psychology' },
  { id: 'autoconhecimento', label: 'Autoconhecimento', icon: 'self_improvement' },
  { id: 'propósito', label: 'Propósito', icon: 'lightbulb' },
  { id: 'ansiedade', label: 'Ansiedade', icon: 'spa' },
  { id: 'gratidão', label: 'Gratidão', icon: 'volunteer_activism' },
  { id: 'autoestima', label: 'Autoestima', icon: 'favorite' }
];

const ReflectionsModal = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);
  const { setInput } = useChat();
  const [isClosing, setIsClosing] = useState(false);
  const [activeTab, setActiveTab] = useState('daily'); // 'daily' or 'explore'
  const [currentReflection, setCurrentReflection] = useState(null);

  useEffect(() => {
    if (isOpen && !currentReflection) {
      getRandomReflection();
    }
  }, [isOpen]);

  const getRandomReflection = (category = null) => {
    let filtered = reflectionsData;
    if (category) {
      filtered = reflectionsData.filter(r => r.category === category);
    }
    const random = filtered[Math.floor(Math.random() * filtered.length)];
    setCurrentReflection(random);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const handleDiscussReflection = () => {
    if (!currentReflection) return;
    const message = `Oi, PsyMind. Li essa frase de ${currentReflection.author}: "${currentReflection.text}". Gostaria de refletir sobre o que ela significa para o meu momento atual.`;
    setInput(message);
    handleClose();
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
        aria-labelledby="reflections-title"
        ref={modalRef}
        tabIndex="-1"
      >
        <div className="modal-header">
          <div className="modal-tabs">
            <button 
              className={`tab-btn ${activeTab === 'daily' ? 'active' : ''}`}
              onClick={() => setActiveTab('daily')}
            >
              Reflexão do Dia
            </button>
            <button 
              className={`tab-btn ${activeTab === 'explore' ? 'active' : ''}`}
              onClick={() => setActiveTab('explore')}
            >
              Explorar Temas
            </button>
          </div>
          <button className="close-btn" onClick={handleClose} aria-label="Fechar">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="help-body">
          {activeTab === 'daily' && currentReflection && (
            <div className="reflection-container">
              <div className="reflection-card">
                <span className="material-symbols-outlined reflection-icon">format_quote</span>
                <p className="reflection-text">"{currentReflection.text}"</p>
                <span className="reflection-author">— {currentReflection.author}</span>
              </div>
              
              <div className="reflection-actions">
                <button className="reflection-btn btn-new" onClick={() => getRandomReflection()}>
                  <span className="material-symbols-outlined">refresh</span>
                  Nova Frase
                </button>
                <button className="reflection-btn btn-chat" onClick={handleDiscussReflection}>
                  <span className="material-symbols-outlined">chat</span>
                  Refletir no Chat
                </button>
              </div>
            </div>
          )}

          {activeTab === 'explore' && (
            <div className="explore-container">
              <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                Escolha um tema para refletir
              </h3>
              <div className="categories-grid">
                {categories.map(cat => (
                  <button 
                    key={cat.id} 
                    className="category-card"
                    onClick={() => {
                      getRandomReflection(cat.id);
                      setActiveTab('daily');
                    }}
                  >
                    <span className="material-symbols-outlined category-icon">{cat.icon}</span>
                    <span className="category-name">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReflectionsModal;
