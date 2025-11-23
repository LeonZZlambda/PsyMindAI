import React, { useEffect, useRef, useState } from 'react';
import { useChat } from '../context/ChatContext';
import { useTheme } from '../context/ThemeContext';
import '../styles/help.css';

const SupportModal = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);
  const { setInput } = useChat();
  const { isDarkMode, reducedMotion } = useTheme();
  const [isClosing, setIsClosing] = useState(false);
  const [activeTab, setActiveTab] = useState('immediate'); // 'immediate' or 'investigate'
  
  // Immediate Support State
  const [feelingInput, setFeelingInput] = useState('');
  const [aiResponse, setAiResponse] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Investigation State
  const [investigationStep, setInvestigationStep] = useState(0);
  const [investigationData, setInvestigationData] = useState({
    emotion: '',
    context: '',
    duration: ''
  });
  const [investigationResult, setInvestigationResult] = useState(null);

  // Avatar State
  const [eyePos, setEyePos] = useState({ x: 0, y: 0 });
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isSmiling, setIsSmiling] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      setEyePos({ x: 0, y: 0 });
      return;
    }

    const handleMouseMove = (e) => {
      if (isInputFocused) return;
      
      const { innerWidth, innerHeight } = window;
      // Calculate eye movement (limited range)
      const x = (e.clientX / innerWidth - 0.5) * 6;
      const y = (e.clientY / innerHeight - 0.5) * 6;
      setEyePos({ x, y });
    };

    if (isOpen) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isOpen, isInputFocused, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;

    if (isInputFocused) {
      setEyePos({ x: 0, y: 6 }); // Look down at input
    }
  }, [isInputFocused, reducedMotion]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
      // Reset states on close
      setTimeout(() => {
        setActiveTab('immediate');
        setFeelingInput('');
        setAiResponse(null);
        setInvestigationStep(0);
        setInvestigationData({ emotion: '', context: '', duration: '' });
        setInvestigationResult(null);
      }, 100);
    }, 300);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'Tab') {
        e.preventDefault();
        setActiveTab(prev => prev === 'immediate' ? 'investigate' : 'immediate');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Immediate Support Logic
  const handleAnalyzeFeeling = () => {
    if (!feelingInput.trim()) return;
    
    setIsAnalyzing(true);
    if (!reducedMotion) {
      setIsSmiling(true);
    }

    // Simulate AI analysis
    setTimeout(() => {
      const input = feelingInput.toLowerCase();
      let response = {
        type: 'general',
        message: 'Entendo que você esteja passando por isso. Aqui estão alguns recursos que podem ajudar:',
        resources: [
          { icon: 'self_improvement', title: 'Respiração Guiada', desc: 'Técnica 4-7-8 para acalmar' },
          { icon: 'spa', title: 'Mindfulness', desc: 'Exercício rápido de atenção plena' }
        ]
      };

      if (input.includes('ansios') || input.includes('medo') || input.includes('pânico')) {
        response = {
          type: 'anxiety',
          message: 'Parece que você está sentindo ansiedade. Vamos tentar acalmar isso juntos.',
          resources: [
            { icon: 'air', title: 'Respiração Quadrada', desc: 'Inspire 4s, Segure 4s, Expire 4s, Segure 4s' },
            { icon: 'landscape', title: 'Técnica 5-4-3-2-1', desc: 'Identifique coisas ao seu redor para se aterrar' }
          ]
        };
      } else if (input.includes('triste') || input.includes('depre') || input.includes('sozinho')) {
        response = {
          type: 'sadness',
          message: 'Sinto muito que você esteja se sentindo assim. Você não está sozinho.',
          resources: [
            { icon: 'favorite', title: 'Autocompaixão', desc: 'Seja gentil consigo mesmo neste momento' },
            { icon: 'connect_without_contact', title: 'Conexão', desc: 'Considere conversar com alguém de confiança' }
          ]
        };
      } else if (input.includes('morrer') || input.includes('suic') || input.includes('acabar')) {
        response = {
          type: 'crisis',
          message: 'Você é importante e há ajuda disponível. Por favor, entre em contato com profissionais agora.',
          resources: [
            { icon: 'phone_in_talk', title: 'CVV - 188', desc: 'Apoio Emocional 24h (Ligação Gratuita)', action: 'tel:188', urgent: true },
            { icon: 'local_hospital', title: 'Emergência - 192', desc: 'SAMU', action: 'tel:192', urgent: true }
          ]
        };
      }

      setAiResponse(response);
      setIsAnalyzing(false);
      setIsSmiling(false);
    }, 1500);
  };

  // Investigation Logic
  const handleInvestigationSelect = (field, value) => {
    setInvestigationData(prev => ({ ...prev, [field]: value }));
    if (field === 'duration') {
      analyzeInvestigation({ ...investigationData, [field]: value });
    } else {
      setInvestigationStep(prev => prev + 1);
    }
  };

  const analyzeInvestigation = (data) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      let result = {
        title: 'Análise Inicial',
        description: 'Com base no que você compartilhou, parece que você está enfrentando um momento desafiador.',
        advice: 'Recomendamos focar em pequenas pausas e autocuidado.'
      };

      if (data.emotion === 'ansiedade') {
        if (data.context === 'estudos') {
          result = {
            title: 'Ansiedade Acadêmica',
            description: 'É comum sentir pressão com os estudos. A ansiedade pode vir do medo de não dar conta.',
            advice: 'Tente dividir o conteúdo em partes menores (Pomodoro) e lembre-se que seu valor não é sua nota.'
          };
        } else if (data.context === 'futuro') {
          result = {
            title: 'Ansiedade Antecipatória',
            description: 'Preocupar-se com o futuro é natural, mas pode paralisar.',
            advice: 'Foque no que você pode controlar hoje. O futuro é construído um dia de cada vez.'
          };
        }
      } else if (data.emotion === 'tristeza') {
        result = {
          title: 'Acolhimento da Tristeza',
          description: 'A tristeza é uma emoção válida e sinaliza que algo precisa de atenção.',
          advice: 'Permita-se sentir sem julgamento. Escrever sobre seus sentimentos pode ajudar a processá-los.'
        };
      } else if (data.emotion === 'cansaco') {
        result = {
          title: 'Esgotamento Mental',
          description: 'Você pode estar próximo de um burnout se não descansar.',
          advice: 'O descanso é produtivo. Desconecte-se das telas e faça algo que não exija esforço mental.'
        };
      }

      setInvestigationResult(result);
      setIsAnalyzing(false);
      setInvestigationStep(3); // Result step
    }, 1500);
  };

  const resetInvestigation = () => {
    setInvestigationStep(0);
    setInvestigationData({ emotion: '', context: '', duration: '' });
    setInvestigationResult(null);
  };

  const handleTalkAboutIt = () => {
    const emotionMap = {
      'ansiedade': 'ansiedade',
      'tristeza': 'tristeza',
      'cansaco': 'cansaço',
      'confusao': 'confusão',
      'raiva': 'raiva'
    };
    
    const contextMap = {
      'estudos': 'questões de estudos',
      'relacionamentos': 'meus relacionamentos',
      'futuro': 'o futuro',
      'saude': 'minha saúde',
      'naosei': 'algo que não sei identificar bem'
    };

    const durationMap = {
      'hoje': 'hoje',
      'semana': 'nos últimos dias',
      'mes': 'há algum tempo',
      'sempre': 'há bastante tempo'
    };

    const emotion = emotionMap[investigationData.emotion] || investigationData.emotion;
    const context = contextMap[investigationData.context] || investigationData.context;
    const duration = durationMap[investigationData.duration] || investigationData.duration;

    const message = `Oi, PsyMind. Estou passando por um momento delicado e gostaria de desabafar. Tenho sentido ${emotion} em relação a ${context}. Isso tem me afetado ${duration}. Você poderia me ouvir e me ajudar a entender melhor o que estou sentindo?`;
    
    setInput(message);
    handleClose();
  };

  const handleTalkAboutFeeling = () => {
    const message = `Oi, PsyMind. Estou passando por um momento delicado e gostaria de desabafar. ${feelingInput}. Você poderia me ouvir e me ajudar a entender melhor o que estou sentindo?`;
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
        aria-labelledby="support-title"
        ref={modalRef}
        tabIndex="-1"
      >
        <div className="modal-header">
          <div className="modal-tabs">
            <button 
              className={`tab-btn ${activeTab === 'immediate' ? 'active' : ''}`}
              onClick={() => setActiveTab('immediate')}
            >
              Apoio Imediato
            </button>
            <button 
              className={`tab-btn ${activeTab === 'investigate' ? 'active' : ''}`}
              onClick={() => setActiveTab('investigate')}
            >
              Investigar Causas
            </button>
          </div>
          <button className="close-btn" onClick={handleClose} aria-label="Fechar">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="help-body">
          {activeTab === 'immediate' ? (
            <div className="support-section">
              <div className="support-hero">
                <div className="ai-avatar-container">
                  <svg className="ai-avatar" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                    {/* Google Style Body - Minimalist & Friendly */}
                    <rect 
                      x="25" 
                      y="25" 
                      width="70" 
                      height="70" 
                      rx="24" 
                      fill="none" 
                      stroke="#4285F4" 
                      strokeWidth="6" 
                    />
                    
                    {/* Robot Detail: Antenna */}
                    <line x1="60" y1="25" x2="60" y2="12" stroke="#4285F4" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="60" cy="12" r="4" fill="#4285F4" />

                    {/* Eyes Group */}
                    <g className="avatar-eyes">
                      {/* Left Eye - Always White Background */}
                      <circle cx="45" cy="50" r="8" fill="white" stroke="#4285F4" strokeWidth="2" />
                      <circle cx="45" cy="50" r="3.5" fill="#4285F4" style={{ transform: `translate(${eyePos.x}px, ${eyePos.y}px)` }} />
                      
                      {/* Right Eye - Always White Background */}
                      <circle cx="75" cy="50" r="8" fill="white" stroke="#4285F4" strokeWidth="2" />
                      <circle cx="75" cy="50" r="3.5" fill="#4285F4" style={{ transform: `translate(${eyePos.x}px, ${eyePos.y}px)` }} />
                      
                      {/* Eyebrows - Expressive */}
                      <path d="M 38 38 Q 45 34 52 38" fill="none" stroke="#4285F4" strokeWidth="3" strokeLinecap="round" style={{ transform: `translate(0, ${eyePos.y * 0.5}px)` }} />
                      <path d="M 68 38 Q 75 34 82 38" fill="none" stroke="#4285F4" strokeWidth="3" strokeLinecap="round" style={{ transform: `translate(0, ${eyePos.y * 0.5}px)` }} />
                      
                      {/* Mouth - Small & Simple or Smiling */}
                      <path 
                        d={isSmiling ? "M 45 70 L 75 70 Q 60 90 45 70 Z" : "M 53 72 Q 60 76 67 72"} 
                        fill={isSmiling ? "white" : "none"}
                        stroke="#4285F4" 
                        strokeWidth="3" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        style={{ transition: 'all 0.3s ease' }}
                      />
                    </g>
                  </svg>
                </div>
                <h3>Como você está se sentindo hoje?</h3>
                <p>Nossa IA pode sugerir exercícios e recursos baseados no seu estado emocional.</p>
              </div>

              <div className="feeling-input-container">
                <textarea
                  className="feeling-input"
                  placeholder="Ex: Estou me sentindo muito ansioso com uma prova amanhã..."
                  value={feelingInput}
                  onChange={(e) => setFeelingInput(e.target.value)}
                  rows={3}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                />
                <button 
                  className="analyze-btn"
                  onClick={handleAnalyzeFeeling}
                  disabled={isAnalyzing || !feelingInput.trim()}
                >
                  {isAnalyzing ? (
                    <>
                      <span className="material-symbols-outlined spin">sync</span>
                      Analisando...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">auto_awesome</span>
                      Receber Apoio
                    </>
                  )}
                </button>
              </div>

              {aiResponse && (
                <div className={`ai-response-card ${aiResponse.type}`}>
                  <div className="response-header">
                    <span className="material-symbols-outlined">psychology</span>
                    <p>{aiResponse.message}</p>
                  </div>
                  <div className="resources-grid">
                    {aiResponse.resources.map((resource, index) => (
                      <div key={index} className={`resource-card ${resource.urgent ? 'urgent' : ''}`}>
                        <span className="material-symbols-outlined">{resource.icon}</span>
                        <div className="resource-info">
                          <h4>{resource.title}</h4>
                          <p>{resource.desc}</p>
                        </div>
                        {resource.action && (
                          <a href={resource.action} className="resource-action-btn">
                            Ligar
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="result-actions" style={{ marginTop: '1.5rem' }}>
                    <button className="primary-btn highlight-action" onClick={handleTalkAboutFeeling}>
                      <span className="material-symbols-outlined">chat</span>
                      Quero conversar mais sobre isso
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="investigation-section">
              {investigationStep === 0 && (
                <div className="step-container">
                  <h3>O que você está sentindo principalmente?</h3>
                  <div className="options-grid">
                    {[
                      { id: 'ansiedade', label: 'Ansiedade / Nervosismo', icon: 'sentiment_worried' },
                      { id: 'tristeza', label: 'Tristeza / Desânimo', icon: 'sentiment_dissatisfied' },
                      { id: 'cansaco', label: 'Cansaço / Esgotamento', icon: 'battery_alert' },
                      { id: 'confusao', label: 'Confusão / Indecisão', icon: 'psychology_alt' },
                      { id: 'raiva', label: 'Raiva / Frustração', icon: 'sentiment_extremely_dissatisfied' }
                    ].map(opt => (
                      <button key={opt.id} className="option-card" onClick={() => handleInvestigationSelect('emotion', opt.id)}>
                        <span className="material-symbols-outlined">{opt.icon}</span>
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {investigationStep === 1 && (
                <div className="step-container">
                  <h3>Qual área da vida isso mais afeta agora?</h3>
                  <div className="options-grid">
                    {[
                      { id: 'estudos', label: 'Estudos / Vestibular', icon: 'school' },
                      { id: 'relacionamentos', label: 'Relacionamentos', icon: 'group' },
                      { id: 'futuro', label: 'Futuro / Carreira', icon: 'timeline' },
                      { id: 'saude', label: 'Saúde / Corpo', icon: 'health_and_safety' },
                      { id: 'naosei', label: 'Não sei identificar', icon: 'question_mark' }
                    ].map(opt => (
                      <button key={opt.id} className="option-card" onClick={() => handleInvestigationSelect('context', opt.id)}>
                        <span className="material-symbols-outlined">{opt.icon}</span>
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                  <button className="back-btn-text" onClick={() => setInvestigationStep(0)}>Voltar</button>
                </div>
              )}

              {investigationStep === 2 && (
                <div className="step-container">
                  <h3>Há quanto tempo você se sente assim?</h3>
                  <div className="options-grid">
                    {[
                      { id: 'hoje', label: 'Começou hoje', icon: 'today' },
                      { id: 'semana', label: 'Alguns dias / Uma semana', icon: 'date_range' },
                      { id: 'mes', label: 'Um mês ou mais', icon: 'calendar_month' },
                      { id: 'sempre', label: 'Parece que é sempre assim', icon: 'update' }
                    ].map(opt => (
                      <button key={opt.id} className="option-card" onClick={() => handleInvestigationSelect('duration', opt.id)}>
                        <span className="material-symbols-outlined">{opt.icon}</span>
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                  <button className="back-btn-text" onClick={() => setInvestigationStep(1)}>Voltar</button>
                </div>
              )}

              {investigationStep === 3 && isAnalyzing && (
                <div className="loading-state">
                  <span className="material-symbols-outlined spin">sync</span>
                  <p>Analisando suas respostas...</p>
                </div>
              )}

              {investigationStep === 3 && !isAnalyzing && investigationResult && (
                <div className="result-container">
                  <div className="result-header">
                    <span className="material-symbols-outlined">lightbulb</span>
                    <h3>{investigationResult.title}</h3>
                  </div>
                  <p className="result-desc">{investigationResult.description}</p>
                  <div className="advice-box">
                    <h4>Sugestão do PsyMind:</h4>
                    <p>{investigationResult.advice}</p>
                  </div>
                  <div className="result-actions">
                    <button className="primary-btn highlight-action" onClick={handleTalkAboutIt}>
                      <span className="material-symbols-outlined">chat</span>
                      Quero conversar mais sobre isso
                    </button>
                    <button className="secondary-btn" onClick={resetInvestigation}>Nova Investigação</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportModal;
