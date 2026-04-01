import React, { useEffect, useRef, useState } from 'react';
import { useChat } from '../context/ChatContext';
import { generateReflection, generateReflectionAnalysis } from '../services/tools/reflectionService';
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

const breathingTechniques = [
  { id: '478', name: '4-7-8', description: 'Relaxamento profundo', inhale: 4, hold: 7, exhale: 8 },
  { id: 'box', name: 'Box Breathing', description: 'Equilíbrio e foco', inhale: 4, hold: 4, exhale: 4, holdAfter: 4 },
  { id: 'calm', name: 'Respiração Calma', description: 'Redução de ansiedade', inhale: 4, exhale: 6 },
  { id: 'energy', name: 'Respiração Energizante', description: 'Aumenta energia', inhale: 3, exhale: 3 }
];

const ReflectionsModal = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);
  const { setInput } = useChat();
  const [isClosing, setIsClosing] = useState(false);
  const [activeTab, setActiveTab] = useState('daily'); // 'daily', 'explore', or 'breathing'
  const [currentReflection, setCurrentReflection] = useState(null);
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState('inhale');
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const breathingTimerRef = useRef(null);
  const [aiReflection, setAiReflection] = useState('');
  const [isLoadingReflection, setIsLoadingReflection] = useState(false);

  useEffect(() => {
    if (isOpen && !currentReflection) {
      getRandomReflection();
    }
  }, [isOpen]);
  
  useEffect(() => {
    if (activeTab === 'daily' && !currentReflection) {
      getRandomReflection();
    }
  }, [activeTab]);

  const getRandomReflection = async (category = null) => {
    setAiReflection('');
    setIsLoadingReflection(true);
    
    try {
      const reflection = await generateReflection(category);
      
      if (reflection) {
        setCurrentReflection({ id: Date.now(), ...reflection });
      } else {
        const random = reflectionsData[Math.floor(Math.random() * reflectionsData.length)];
        setCurrentReflection(random);
      }
    } catch (error) {
      const random = reflectionsData[Math.floor(Math.random() * reflectionsData.length)];
      setCurrentReflection(random);
    }
    
    setIsLoadingReflection(false);
  };

  const getAiReflection = async () => {
    if (!currentReflection) return;
    
    setIsLoadingReflection(true);
    try {
      const analysis = await generateReflectionAnalysis(currentReflection);
      setAiReflection(analysis);
    } catch (error) {
      setAiReflection('❌ Erro ao conectar com IA. Tente novamente.');
    }
    setIsLoadingReflection(false);
  };

  const handleClose = () => {
    if (breathingTimerRef.current) clearTimeout(breathingTimerRef.current);
    setBreathingActive(false);
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const startBreathing = (technique) => {
    setSelectedTechnique(technique);
    setBreathingActive(true);
    setBreathingPhase('inhale');
    runBreathingCycle(technique, 'inhale');
  };

  const stopBreathing = () => {
    if (breathingTimerRef.current) clearTimeout(breathingTimerRef.current);
    setBreathingActive(false);
    setSelectedTechnique(null);
  };

  const runBreathingCycle = (technique, phase) => {
    const phases = ['inhale', technique.hold ? 'hold' : null, 'exhale', technique.holdAfter ? 'holdAfter' : null].filter(Boolean);
    const currentIndex = phases.indexOf(phase);
    const nextPhase = phases[(currentIndex + 1) % phases.length];
    const duration = technique[phase] * 1000;

    breathingTimerRef.current = setTimeout(() => {
      setBreathingPhase(nextPhase);
      runBreathingCycle(technique, nextPhase);
    }, duration);
  };

  useEffect(() => {
    return () => {
      if (breathingTimerRef.current) clearTimeout(breathingTimerRef.current);
    };
  }, []);

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
        <div className="modal-header with-tabs">
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
            <button 
              className={`tab-btn ${activeTab === 'breathing' ? 'active' : ''}`}
              onClick={() => { setActiveTab('breathing'); stopBreathing(); }}
            >
              Respiração Guiada
            </button>
          </div>
          <button className="close-btn" onClick={handleClose} aria-label="Fechar">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="help-body">
          {activeTab === 'daily' && (
            <div className="reflection-container">
              {isLoadingReflection && !currentReflection ? (
                <div className="reflection-card" style={{ textAlign: 'center', padding: '3rem' }}>
                  <span className="material-symbols-outlined reflection-icon" style={{ animation: 'spin 2s linear infinite' }}>autorenew</span>
                  <p style={{ color: 'var(--text-secondary)' }}>Gerando frase inspiradora...</p>
                </div>
              ) : currentReflection && (
                <>
                  <div className="reflection-card">
                    <span className="material-symbols-outlined reflection-icon">format_quote</span>
                    <p className="reflection-text">{currentReflection.text}</p>
                    <span className="reflection-author">— {currentReflection.author}</span>
                  </div>
              
                  <div className="reflection-actions">
                    <button className="reflection-btn btn-new" onClick={() => getRandomReflection()} disabled={isLoadingReflection}>
                      <span className="material-symbols-outlined">refresh</span>
                      Nova Frase IA
                    </button>
                    <button className="reflection-btn btn-ai" onClick={getAiReflection} disabled={isLoadingReflection}>
                      <span className="material-symbols-outlined">{isLoadingReflection ? 'hourglass_empty' : 'psychology'}</span>
                      {isLoadingReflection ? 'Refletindo...' : 'Reflexão IA'}
                    </button>
                    <button className="reflection-btn btn-chat" onClick={handleDiscussReflection}>
                      <span className="material-symbols-outlined">chat</span>
                      Refletir no Chat
                    </button>
                  </div>
              
                  {aiReflection && (
                    <div className="ai-reflection-box">
                      <p>{aiReflection}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === 'explore' && (
            <div className="explore-container">
              <h3>Escolha um tema para refletir</h3>
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

          {activeTab === 'breathing' && (
            <div className="breathing-container">
              {!breathingActive ? (
                <>
                  <h3>Escolha uma técnica de respiração</h3>
                  <div className="breathing-techniques">
                    {breathingTechniques.map(tech => (
                      <div key={tech.id} className="technique-card">
                        <h4>{tech.name}</h4>
                        <p>{tech.description}</p>
                        <button className="start-breathing-btn" onClick={() => startBreathing(tech)}>
                          <span className="material-symbols-outlined">air</span>
                          Iniciar
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="breathing-active">
                  <div className={`breathing-circle ${breathingPhase}`}>
                    <div className="breathing-face">
                      {breathingPhase === 'inhale' && '😌'}
                      {breathingPhase === 'hold' && '😊'}
                      {breathingPhase === 'exhale' && '😮'}
                      {breathingPhase === 'holdAfter' && '🙂'}
                    </div>
                  </div>
                  <div className="breathing-instruction">
                    {breathingPhase === 'inhale' && 'Inspire'}
                    {breathingPhase === 'hold' && 'Segure'}
                    {breathingPhase === 'exhale' && 'Expire'}
                    {breathingPhase === 'holdAfter' && 'Segure'}
                  </div>
                  <button className="stop-breathing-btn" onClick={stopBreathing}>
                    Parar
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReflectionsModal;
