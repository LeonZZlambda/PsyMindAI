import React, { useEffect, useRef, useState } from 'react';
import { useChat } from '../context/ChatContext';
import { useTheme } from '../context/ThemeContext';
import '../styles/help.css';

const SupportModal = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);
  const { setInput } = useChat();
  const { isDarkMode, reducedMotion } = useTheme();
  const [isClosing, setIsClosing] = useState(false);
    const [activeTab, setActiveTab] = useState('immediate'); // 'immediate', 'investigate', 'reframing'
  
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

  // Reframing State
  const [reframingStep, setReframingStep] = useState(0);
  const [reframingData, setReframingData] = useState({
    situation: '',
    thought: '',
    intensity: 5
  });
  const [reframingResult, setReframingResult] = useState(null);

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
        setReframingStep(0);
        setReframingData({ thought: '', distortion: '', challenge: '', alternative: '' });
        setReframingResult(null);
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

  // Reframing Logic
  const handleReframingSelect = (field, value) => {
    setReframingData(prev => ({ ...prev, [field]: value }));
    if (field === 'alternative') {
      analyzeReframing({ ...reframingData, [field]: value });
    } else {
      setReframingStep(prev => prev + 1);
    }
  };

  const analyzeReframing = (data) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      let result = {
        title: 'Reformulação Cognitiva',
        description: 'Vamos trabalhar juntos para reformular seus pensamentos.',
        advice: 'Tente olhar para a situação de uma nova perspectiva.'
      };

      if (data.distortion === 'catastrofizacao') {
        result = {
          title: 'Catastrofização Detectada',
          description: 'Parece que você está imaginando o pior cenário possível.',
          advice: 'Vamos tentar ver o lado positivo ou pelo menos o mais realista da situação.'
        };
      } else if (data.distortion === 'generalizacao') {
        result = {
          title: 'Generalização Excessiva',
          description: 'Você está tirando conclusões gerais a partir de um único evento.',
          advice: 'Lembre-se de que um revés não define todo o seu valor ou futuro.'
        };
      } else if (data.distortion === 'pensamento_dicotomico') {
        result = {
          title: 'Pensamento Dicotômico',
          description: 'Você está vendo as coisas em preto e branco, sem meio-termo.',
          advice: 'Tente encontrar uma terceira opção ou um meio-termo na situação.'
        };
      }

      setReframingResult(result);
      setIsAnalyzing(false);
      setReframingStep(3); // Result step
    }, 1500);
  };

  const resetReframing = () => {
    setReframingStep(0);
    setReframingData({ thought: '', distortion: '', challenge: '', alternative: '' });
    setReframingResult(null);
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

  const handleReframingSubmit = async (e) => {
    e.preventDefault();
    if (!reframingData.situation || !reframingData.thought) return;

    setIsAnalyzing(true);
    
    // Simulação de processamento de IA para Reestruturação Cognitiva
    setTimeout(() => {
      const situation = reframingData.situation.toLowerCase();
      const thought = reframingData.thought.toLowerCase();
      
      let result = {
        distortion: "Generalização Excessiva ou Catastrofização",
        challenge: "Você está tomando um evento isolado como um padrão universal ou prevendo o pior cenário possível sem evidências concretas.",
        alternative: "Tente ver a situação como um evento único e não como uma definição de quem você é. Pergunte-se: 'Qual é a evidência real de que isso sempre acontecerá?'",
        reframe: `Em vez de pensar '${reframingData.thought}', tente pensar: 'Embora essa situação tenha sido difícil, ela não define todo o meu futuro ou capacidade.'`
      };

      if (thought.includes("nunca") || thought.includes("sempre")) {
        result.distortion = "Pensamento Tudo ou Nada";
        result.challenge = "A vida raramente é preta ou branca. O uso de 'sempre' ou 'nunca' geralmente indica uma distorção da realidade.";
        result.alternative = "Procure exceções. Houve momentos em que isso não aconteceu? Tente usar palavras como 'às vezes' ou 'frequentemente'.";
      } else if (thought.includes("deveria") || thought.includes("tenho que")) {
        result.distortion = "Declarações de 'Deveria'";
        result.challenge = "O uso de 'deveria' cria culpa e frustração. Você está impondo regras rígidas a si mesmo ou aos outros.";
        result.alternative = "Substitua 'eu deveria' por 'eu gostaria' ou 'seria preferível'. Isso reduz a pressão e aumenta a aceitação.";
      }

      setReframingResult(result);
      setReframingStep(2);
      setIsAnalyzing(false);
    }, 2000);
  };

  const renderReframingTab = () => {
    if (reframingStep === 0) {
      return (
        <div className="step-container">
          <h3>Reestruturação Cognitiva</h3>
          <p>Vamos trabalhar juntos para identificar e reestruturar pensamentos negativos.</p>
          <button className="action-btn primary" onClick={() => setReframingStep(1)}>
            <span className="material-symbols-outlined">arrow_forward</span>
            Começar
          </button>
        </div>
      );
    }

    if (reframingStep === 1) {
      return (
        <div className="reframing-step">
          <div className="step-header">
            <div className="header-row">
              <button className="back-btn-icon" onClick={() => setReframingStep(0)}>
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <h3>Desafie seus Pensamentos</h3>
            </div>
            <p>Identifique um pensamento negativo e vamos trabalhar juntos para encontrar uma perspectiva mais equilibrada.</p>
          </div>
          
          <form onSubmit={handleReframingSubmit} className="reframing-form">
            <div className="form-group">
              <label>Qual é a situação gatilho?</label>
              <input 
                type="text" 
                placeholder="Ex: Recebi uma crítica no trabalho..."
                value={reframingData.situation}
                onChange={(e) => setReframingData({...reframingData, situation: e.target.value})}
                className="material-input"
              />
            </div>
            
            <div className="form-group">
              <label>O que você pensou automaticamente?</label>
              <textarea 
                placeholder="Ex: Eu sou incompetente e vou ser demitido..."
                value={reframingData.thought}
                onChange={(e) => setReframingData({...reframingData, thought: e.target.value})}
                className="material-textarea"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Como isso faz você se sentir? (0-10)</label>
              <div className="intensity-slider-container">
                <input 
                  type="range" 
                  min="0" 
                  max="10" 
                  value={reframingData.intensity}
                  onChange={(e) => setReframingData({...reframingData, intensity: e.target.value})}
                  className="intensity-slider"
                />
                <span className="intensity-value">{reframingData.intensity}</span>
              </div>
            </div>

            <button type="submit" className="action-btn primary" disabled={!reframingData.situation || !reframingData.thought || isAnalyzing}>
              {isAnalyzing ? (
                <span className="loading-dots">Analisando<span>.</span><span>.</span><span>.</span></span>
              ) : (
                <>
                  <span className="material-symbols-outlined">psychology</span>
                  Analisar Pensamento
                </>
              )}
            </button>
          </form>
        </div>
      );
    }

    return (
      <div className="reframing-result fade-in">
        <div className="result-card">
          <div className="result-header">
            <span className="material-symbols-outlined result-icon">lightbulb</span>
            <h3>Análise Cognitiva</h3>
          </div>
          
          <div className="analysis-section">
            <h4>Possível Distorção</h4>
            <p className="highlight-text">{reframingResult.distortion}</p>
          </div>

          <div className="analysis-section">
            <h4>O Desafio</h4>
            <p>{reframingResult.challenge}</p>
          </div>

          <div className="analysis-section">
            <h4>Perspectiva Alternativa</h4>
            <p>{reframingResult.alternative}</p>
          </div>

          <div className="reframe-box">
            <h4>Novo Pensamento Sugerido</h4>
            <p>"{reframingResult.reframe}"</p>
          </div>

          <button 
            className="action-btn secondary"
            onClick={() => {
              setReframingStep(1);
              setReframingData({ situation: '', thought: '', intensity: 5 });
              setReframingResult(null);
            }}
          >
            Analisar Outro Pensamento
          </button>
        </div>
      </div>
    );
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
            <button 
              className={`tab-btn ${activeTab === 'reframing' ? 'active' : ''}`}
              onClick={() => setActiveTab('reframing')}
            >
              Reestruturação
            </button>
          </div>
          <button className="close-btn" onClick={handleClose} aria-label="Fechar">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="help-body">
          {activeTab === 'immediate' && (
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
          )}
          {activeTab === 'investigate' && (
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
          {activeTab === 'reframing' && (
            <div className="reframing-section">
              {renderReframingTab()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportModal;
