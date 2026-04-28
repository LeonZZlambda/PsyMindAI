import React, { useEffect, useState, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import BaseModal from './BaseModal';
import PsyBot from './PsyBot';
import '../styles/help.css';

const SupportModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { setInput } = useChat();
  const { isDarkMode, reducedMotion } = useTheme();
  const [activeTab, setActiveTab] = useState('immediate');
  const { t } = useTranslation(); // 'immediate', 'investigate', 'reframing'
  
  // Immediate Support State
  const [feelingInput, setFeelingInput] = useState('');
  const [aiResponse, setAiResponse] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Investigation State
  const [investigationStep, setInvestigationStep] = useState(0);
  const [investigationData, setInvestigationData] = useState({
    emotion: '',
    context: '',
    duration: ''
  });
  const [investigationResult, setInvestigationResult] = useState<any>(null);

  // Reframing State
  const [reframingStep, setReframingStep] = useState(0);
  const [reframingData, setReframingData] = useState({
    situation: '',
    thought: '',
    intensity: 5
  });
  const [reframingResult, setReframingResult] = useState<any>(null);

  const [isHappy, setIsHappy] = useState(false);
  const [isSmiling, setIsSmiling] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [eyePos, setEyePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (reducedMotion) {
      setEyePos({ x: 0, y: 0 });
      return;
    }

    const handleMouseMove = (e: any) => {
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

  // Handler for text input caret tracking
  const handleCaretTracking = (e: any) => {
    if (reducedMotion) return;
    const target = e.target;
    const cursor = target.selectionStart || 0;
    const textBefore = target.value.substring(0, cursor);
    const lines = textBefore.split('\n');
    const currentPhysicalLineIndex = lines.length - 1;
    const currentPhysicalLineChars = lines[currentPhysicalLineIndex].length;
    
    // Estimate visual wrap limit based on screen size
    const CHARS_PER_LINE = window.innerWidth < 768 ? 40 : 63;
    
    const visualLineIndex = currentPhysicalLineIndex + Math.floor(currentPhysicalLineChars / CHARS_PER_LINE);
    const cursorInVisualLine = currentPhysicalLineChars % CHARS_PER_LINE;
    
    // X maps from left (-4) to right (+4) within the current visual line
    const x = -4 + (cursorInVisualLine / CHARS_PER_LINE) * 8;
    // Y goes down up to 3 based on visual line
    const y = 2 + Math.min(visualLineIndex, 3);
    
    setEyePos({ x, y });
  };

  // Auto blinking is now handled by the PsyBot component internally

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: any) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        setActiveTab(prev => prev === 'immediate' ? 'investigate' : 'immediate');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Immediate Support Logic
  const handleAnalyzeFeeling = async () => {
    if (!feelingInput.trim()) return;
    
    setIsAnalyzing(true);
    if (!reducedMotion) {
      setIsSmiling(true);
    }

    try {
      const { sendMessage: sendMessageToGemini } = await import('../services/chat/chatService');
      const prompt = t('support.immediate.prompt', { feeling: feelingInput });
      
      const result = await sendMessageToGemini(prompt, []);
      
      if (result.success) {
        const lines = result.text.split('\n').filter(l => l.trim());
        const resources: any[] = [];
        
        lines.forEach(line => {
          if (line.includes('TÉCNICA')) {
            const match = line.match(/TÉCNICA \d+: (.+?) - (.+)/);
            if (match) {
              resources.push({
                icon: 'self_improvement',
                title: match[1].trim(),
                desc: match[2].trim()
              });
            }
          }
        });
        
        setAiResponse({
          type: 'general',
          message: t('support.immediate.fallbacks.general.msg'),
          resources: resources.length > 0 ? resources : [
            { icon: 'self_improvement', title: t('support.immediate.fallbacks.general.res1.title'), desc: t('support.immediate.fallbacks.general.res1.desc') },
            { icon: 'spa', title: t('support.immediate.fallbacks.general.res2.title'), desc: t('support.immediate.fallbacks.general.res2.desc') }
          ]
        });
        setIsAnalyzing(false);
        setIsSmiling(false);
        return;
      }
    } catch (error) {
      console.error('AI analysis error:', error);
    }

    setTimeout(() => {
      const input = feelingInput.toLowerCase();
      let response: any = {
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
          message: t('support.immediate.fallbacks.anxiety.msg'),
          resources: [
            { icon: 'air', title: t('support.immediate.fallbacks.anxiety.res1.title'), desc: t('support.immediate.fallbacks.anxiety.res1.desc') },
            { icon: 'landscape', title: t('support.immediate.fallbacks.anxiety.res2.title'), desc: t('support.immediate.fallbacks.anxiety.res2.desc') }
          ]
        };
      } else if (input.includes('triste') || input.includes('depre') || input.includes('sozinho')) {
        response = {
          type: 'sadness',
          message: t('support.immediate.fallbacks.sadness.msg'),
          resources: [
            { icon: 'favorite', title: t('support.immediate.fallbacks.sadness.res1.title'), desc: t('support.immediate.fallbacks.sadness.res1.desc') },
            { icon: 'connect_without_contact', title: t('support.immediate.fallbacks.sadness.res2.title'), desc: t('support.immediate.fallbacks.sadness.res2.desc') }
          ]
        };
      } else if (input.includes('morrer') || input.includes('suic') || input.includes('acabar')) {
        response = {
          type: 'crisis',
          message: t('support.immediate.fallbacks.crisis.msg'),
          resources: [
            { icon: 'phone_in_talk', title: t('support.immediate.fallbacks.crisis.res1.title'), desc: t('support.immediate.fallbacks.crisis.res1.desc'), action: 'tel:188', urgent: true },
            { icon: 'local_hospital', title: t('support.immediate.fallbacks.crisis.res2.title'), desc: t('support.immediate.fallbacks.crisis.res2.desc'), action: 'tel:192', urgent: true }
          ]
        };
      }

      setAiResponse(response);
      setIsAnalyzing(false);
      setIsSmiling(false);
      setIsHappy(true);
      setTimeout(() => setIsHappy(false), 2500);
    }, 1500);
  };

  // Investigation Logic
  const handleInvestigationSelect = (field: string, value: any) => {
    const updatedData = { ...investigationData, [field]: value };
    setInvestigationData(updatedData);
    if (field === 'duration') {
      analyzeInvestigation(updatedData);
    } else {
      setInvestigationStep((prev: number) => prev + 1);
    }
  };

  const analyzeInvestigation = async (data: any) => {
    setIsAnalyzing(true);
    
    try {
      const { sendMessage: sendMessageToGemini } = await import('../services/chat/chatService');
      const prompt = t('support.investigate.prompt', { emotion: data.emotion, context: data.context, duration: data.duration });
      
      const result = await sendMessageToGemini(prompt, []);
      
      if (result.success) {
        const lines = result.text.split('\n');
        const title = lines.find(l => l.includes('TÍTULO'))?.split(':')[1]?.trim() || 'Análise Inicial';
        const description = lines.find(l => l.includes('DESCRIÇÃO'))?.split(':')[1]?.trim() || 'Com base no que você compartilhou.';
        const advice = lines.find(l => l.includes('CONSELHO'))?.split(':')[1]?.trim() || 'Recomendamos focar em pequenas pausas.';
        
        setInvestigationResult({ title, description, advice });
        setIsAnalyzing(false);
        setIsHappy(true);
        setTimeout(() => setIsHappy(false), 2500);
        setInvestigationStep(3);
        return;
      }
    } catch (error) {
      console.error('Investigation error:', error);
    }
    
    setTimeout(() => {
      let result = {
        title: t('support.investigate.fallbacks.general.title'),
        description: t('support.investigate.fallbacks.general.desc'),
        advice: t('support.investigate.fallbacks.general.advice')
      };

      if (data.emotion === 'ansiedade') {
        if (data.context === 'estudos') {
          result = {
            title: t('support.investigate.fallbacks.anxiety_studies.title'),
            description: t('support.investigate.fallbacks.anxiety_studies.desc'),
            advice: t('support.investigate.fallbacks.anxiety_studies.advice')
          };
        } else if (data.context === 'futuro') {
          result = {
            title: t('support.investigate.fallbacks.anxiety_future.title'),
            description: t('support.investigate.fallbacks.anxiety_future.desc'),
            advice: t('support.investigate.fallbacks.anxiety_future.advice')
          };
        }
      } else if (data.emotion === 'tristeza') {
        result = {
          title: t('support.investigate.fallbacks.sadness.title'),
          description: t('support.investigate.fallbacks.sadness.desc'),
          advice: t('support.investigate.fallbacks.sadness.advice')
        };
      } else if (data.emotion === 'cansaco') {
        result = {
          title: t('support.investigate.fallbacks.tiredness.title'),
          description: t('support.investigate.fallbacks.tiredness.desc'),
          advice: t('support.investigate.fallbacks.tiredness.advice')
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
  const handleReframingSelect = (field: string, value: any) => {
    setReframingData(prev => ({ ...prev, [field]: value }));
    if (field === 'alternative') {
      analyzeReframing({ ...reframingData, [field]: value });
    } else {
      setReframingStep(prev => prev + 1);
    }
  };

  const analyzeReframing = (data: any) => {
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
    setReframingData({ situation: '', thought: '', intensity: 5 });
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

    const emotion = emotionMap[investigationData.emotion as keyof typeof emotionMap] || investigationData.emotion;
    const context = contextMap[investigationData.context as keyof typeof contextMap] || investigationData.context;
    const duration = durationMap[investigationData.duration as keyof typeof durationMap] || investigationData.duration;

    const message = t('support.investigate.chat_prompt', { emotion, context, duration });
    
    setInput(message);
    const closeBtn = document.querySelector('.support-modal-close-trigger') as HTMLElement;
    if (closeBtn) closeBtn.click();
    else onClose();
  };

  const handleTalkAboutFeeling = () => {
    const message = t('support.chat_feeling_prompt', { feeling: feelingInput });
    setInput(message);
    const closeBtn = document.querySelector('.support-modal-close-trigger') as HTMLElement;
    if (closeBtn) closeBtn.click();
    else onClose();
  };

  const handleReframingSubmit = async (e: any) => {
    e.preventDefault();
    if (!reframingData.situation || !reframingData.thought) return;

    setIsAnalyzing(true);
    
    try {
      const { sendMessage: sendMessageToGemini } = await import('../services/chat/chatService');
      const prompt = t('support.reframing.prompt', { situation: reframingData.situation, thought: reframingData.thought });
      
      const result = await sendMessageToGemini(prompt, []);
      
      if (result.success) {
        const lines = result.text.split('\n');
        const distortion = lines.find(l => l.includes('DISTORÇÃO'))?.split(':')[1]?.trim() || 'Distorção Cognitiva';
        const challenge = lines.find(l => l.includes('DESAFIO'))?.split(':')[1]?.trim() || 'Você está interpretando a situação de forma negativa.';
        const alternative = lines.find(l => l.includes('ALTERNATIVA'))?.split(':')[1]?.trim() || 'Tente ver a situação de outra perspectiva.';
        const reframe = lines.find(l => l.includes('REFORMULAÇÃO'))?.split(':')[1]?.trim() || `Embora ${reframingData.situation}, isso não define quem eu sou.`;
        
        setReframingResult({ distortion, challenge, alternative, reframe });
        setReframingStep(2);
        setIsAnalyzing(false);
        return;
      }
    } catch (error) {
      console.error('Reframing error:', error);
    }
    
    setTimeout(() => {
      const situation = reframingData.situation.toLowerCase();
      const thought = reframingData.thought.toLowerCase();
      
      let result = {
        distortion: t('support.reframing.fallbacks.general.distortion'),
        challenge: t('support.reframing.fallbacks.general.challenge'),
        alternative: t('support.reframing.fallbacks.general.alternative'),
        reframe: t('support.reframing.fallbacks.general.reframe', { thought: reframingData.thought })
      };

      if (thought.includes("nunca") || thought.includes("sempre")) {
        result.distortion = t('support.reframing.fallbacks.all_or_nothing.distortion');
        result.challenge = t('support.reframing.fallbacks.all_or_nothing.challenge');
        result.alternative = "Procure exceções. Houve momentos em que isso não aconteceu? Tente usar palavras como 'às vezes' ou 'frequentemente'.";
      } else if (thought.includes("deveria") || thought.includes("tenho que")) {
        result.distortion = t('support.reframing.fallbacks.should_statements.distortion');
        result.challenge = t('support.reframing.fallbacks.should_statements.challenge');
        result.alternative = t('support.reframing.fallbacks.should_statements.alternative');
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
          <h3>{t("support.reframing.step0.title")}</h3>
          <p>{t("support.reframing.step0.desc")}</p>
          <button className="action-btn primary" onClick={() => setReframingStep(1)}>
            <span className="material-symbols-outlined">arrow_forward</span>
            {t("support.reframing.step0.start")}
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
              <h3>{t("support.reframing.step1.title")}</h3>
            </div>
            <p>{t("support.reframing.step1.desc")}</p>
          </div>
          
          <form onSubmit={handleReframingSubmit} className="reframing-form">
            <div className="form-group">
              <label>{t("support.reframing.step1.q_situation")}</label>
              <input 
                type="text" 
                placeholder={t("support.reframing.step1.q_situ_placeholder")}
                value={reframingData.situation}
                onChange={(e) => setReframingData({...reframingData, situation: e.target.value})}
                className="material-input"
              />
            </div>
            
            <div className="form-group">
              <label>{t("support.reframing.step1.q_thought")}</label>
              <textarea 
                placeholder={t("support.reframing.step1.q_thought_placeholder")}
                value={reframingData.thought}
                onChange={(e) => setReframingData({...reframingData, thought: e.target.value})}
                className="material-textarea"
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>{t("support.reframing.step1.q_intensity")}</label>
              <div className="intensity-slider-container">
                <input 
                  type="range" 
                  min="0" 
                  max="10" 
                  value={reframingData.intensity}
                  onChange={(e) => setReframingData({...reframingData, intensity: Number(e.target.value)})}
                  className="intensity-slider"
                  style={{
                    '--slider-thumb-color': `hsl(${reframingData.intensity * 12}, 84%, 55%)`
                  } as any}
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
                  {t("support.reframing.step1.analyze")}
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
            <h3>{t("support.reframing.result.title")}</h3>
          </div>
          
          <div className="analysis-section">
            <h4>{t("support.reframing.result.distortion")}</h4>
            <p className="highlight-text">{reframingResult?.distortion}</p>
          </div>

          <div className="analysis-section">
            <h4>{t("support.reframing.result.challenge")}</h4>
            <p>{reframingResult?.challenge}</p>
          </div>

          <div className="analysis-section">
            <h4>{t("support.reframing.result.alternative")}</h4>
            <p>{reframingResult?.alternative}</p>
          </div>

          <div className="reframe-box">
            <h4>{t("support.reframing.result.reframe")}</h4>
            <p>"{reframingResult?.reframe}"</p>
          </div>

          <button 
            className="action-btn secondary"
            onClick={() => {
              setReframingStep(1);
              setReframingData({ situation: '', thought: '', intensity: 5 });
              setReframingResult(null);
            }}
          >{t("support.reframing.result.restart")}</button>
        </div>
      </div>
    );
  };


  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={t("support.title", "Apoio Emocional")}
      icon="support_agent"
    >
      <div className="modal-tabs-container">
        <div className="modal-tabs">
          <button 
            className={`tab-btn ${activeTab === 'immediate' ? 'active' : ''}`}
            onClick={() => setActiveTab('immediate')}
          >{t("support.tabs.immediate")} </button>
          <button 
            className={`tab-btn ${activeTab === 'investigate' ? 'active' : ''}`}
            onClick={() => setActiveTab('investigate')}
          >{t("support.tabs.investigate")}</button>
          <button 
            className={`tab-btn ${activeTab === 'reframing' ? 'active' : ''}`}
            onClick={() => setActiveTab('reframing')}
          >{t("support.tabs.reframing")}</button>
        </div>
      </div>
      
      <div className="help-body">
        {activeTab === 'immediate' && (
          <div className="support-section">
            <div className="support-hero">
              <div className="ai-avatar-container" style={{ padding: '10px', cursor: 'pointer' }}>
                <PsyBot 
                  isAnalyzing={isAnalyzing}
                  isInputFocused={isInputFocused}
                  isHappy={isHappy}
                  isSmiling={isSmiling}
                  eyePos={eyePos}
                  reducedMotion={reducedMotion}
                  isOpen={isOpen}
                />
              </div>
              <h3>{t("support.immediate.title")}</h3>
              <p>{t("support.immediate.desc")}</p>
            </div>

            <div className="feeling-input-container">
              <textarea
                className="feeling-input"
                placeholder={t("support.immediate.placeholder")}
                value={feelingInput}
                onChange={(e) => {
                  setFeelingInput(e.target.value);
                  handleCaretTracking(e);
                }}
                onKeyUp={handleCaretTracking}
                onClick={handleCaretTracking}
                rows={3}
                onFocus={(e) => {
                  setIsInputFocused(true);
                  handleCaretTracking(e);
                }}
                onBlur={() => {
                  setIsInputFocused(false);
                  if (!reducedMotion) setEyePos({ x: 0, y: 0 });
                }}
              />
              <button 
                className="action-btn primary"
                onClick={handleAnalyzeFeeling}
                disabled={isAnalyzing || !feelingInput.trim()}
              >
                {isAnalyzing ? (
                  <>
                    <span className="material-symbols-outlined spin">sync</span>
                    {t("support.immediate.analyzing")}
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">auto_awesome</span>
                    {t("support.immediate.receive")}
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
                  {aiResponse.resources.map((resource: any, index: number) => (
                    <div key={index} className={`resource-card ${resource.urgent ? 'urgent' : ''}`}>
                      <span className="material-symbols-outlined">{resource.icon}</span>
                      <div className="resource-info">
                        <h4>{resource.title}</h4>
                        <p>{resource.desc}</p>
                      </div>
                      {resource.action && (
                        <a href={resource.action} className="resource-action-btn">{t("support.immediate.call")}</a>
                      )}
                    </div>
                  ))}
                </div>
                <div className="result-actions" style={{ marginTop: '1.5rem' }}>
                  <button className="primary-btn cta" onClick={handleTalkAboutFeeling}>
                    <span className="material-symbols-outlined">chat</span>
                    {t("support.immediate.chat")}
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
                <h3>{t("support.investigate.step0.title")}</h3>
                <div className="options-grid">
                  {[
                    { id: 'ansiedade', label: t('support.investigate.step0.ansiedade'), icon: 'sentiment_worried', color: '#eab308' },
                    { id: 'tristeza', label: t('support.investigate.step0.tristeza'), icon: 'sentiment_dissatisfied', color: '#3b82f6' },
                    { id: 'cansaco', label: t('support.investigate.step0.cansaco'), icon: 'battery_alert', color: '#94a3b8' },
                    { id: 'confusao', label: t('support.investigate.step0.confusao'), icon: 'psychology_alt', color: '#a855f7' },
                    { id: 'raiva', label: t('support.investigate.step0.raiva'), icon: 'sentiment_extremely_dissatisfied', color: '#ef4444' }
                  ].map(opt => (
                    <button 
                      key={opt.id} 
                      className="option-card" 
                      onClick={() => handleInvestigationSelect('emotion', opt.id)}
                    >
                      <span className="material-symbols-outlined" style={{ color: opt.color }}>{opt.icon}</span>
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {investigationStep === 1 && (
              <div className="step-container">
                <h3>{t("support.investigate.step1.title")}</h3>
                <div className="options-grid">
                  {[
                    { id: 'estudos', label: t('support.investigate.step1.estudos'), icon: 'school', color: '#3b82f6' },
                    { id: 'relacionamentos', label: t('support.investigate.step1.relacionamentos'), icon: 'group', color: '#ec4899' },
                    { id: 'futuro', label: t('support.investigate.step1.futuro'), icon: 'timeline', color: '#8b5cf6' },
                    { id: 'saude', label: t('support.investigate.step1.saude'), icon: 'health_and_safety', color: '#10b981' },
                    { id: 'naosei', label: t('support.investigate.step1.naosei'), icon: 'question_mark', color: '#64748b' }
                  ].map(opt => (
                    <button key={opt.id} className="option-card" onClick={() => handleInvestigationSelect('context', opt.id)}>
                      <span className="material-symbols-outlined" style={{ color: opt.color }}>{opt.icon}</span>
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
                <button className="back-btn-text" onClick={() => setInvestigationStep(0)}>{t("support.investigate.back")}</button>
              </div>
            )}

            {investigationStep === 2 && (
              <div className="step-container">
                <h3>{t("support.investigate.step2.title")}</h3>
                <div className="options-grid">
                  {[
                    { id: 'hoje', label: t('support.investigate.step2.hoje'), icon: 'today', color: '#22c55e' },
                    { id: 'semana', label: t('support.investigate.step2.semana'), icon: 'date_range', color: '#eab308' },
                    { id: 'mes', label: t('support.investigate.step2.mes'), icon: 'calendar_month', color: '#f97316' },
                    { id: 'sempre', label: t('support.investigate.step2.sempre'), icon: 'update', color: '#ef4444' }
                  ].map(opt => (
                    <button key={opt.id} className="option-card" onClick={() => handleInvestigationSelect('duration', opt.id)}>
                      <span className="material-symbols-outlined" style={{ color: opt.color }}>{opt.icon}</span>
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
                <button className="back-btn-text" onClick={() => setInvestigationStep(1)}>{t("support.investigate.back")}</button>
              </div>
            )}

            {investigationStep === 3 && isAnalyzing && (
              <div className="loading-state">
                <span className="material-symbols-outlined spin">sync</span>
                <p>{t("support.investigate.analyzing")}</p>
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
                  <h4>{t("support.investigate.suggestion")}</h4>
                  <p>{investigationResult.advice}</p>
                </div>
                <div className="result-actions">
                  <button className="primary-btn cta" onClick={handleTalkAboutIt}>
                    <span className="material-symbols-outlined">chat</span>
                    {t("support.immediate.chat")}
                  </button>
                  <button className="secondary-btn" onClick={resetInvestigation}>{t("support.investigate.restart")}</button>
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
    </BaseModal>
  );
};

export default SupportModal;
