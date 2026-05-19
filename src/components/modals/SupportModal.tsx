import React, { useEffect, useState, useRef } from 'react';
import { useChat } from '../../hooks/context/useChat';
import { useTheme } from '../../hooks/context/useTheme';
import { useTranslation } from 'react-i18next';
import logger from '../../utils/logger';
import BaseModal from './BaseModal';
import PsyBot from '@/components/chat/PsyBot';
import '../../styles/help.css';

export interface SupportResource {
  icon: string;
  title: string;
  desc: string;
  action?: string;
  urgent?: boolean;
}

export interface AIResponse {
  type: string;
  message: string;
  resources: SupportResource[];
}

export interface InvestigationResult {
  title: string;
  description: string;
  advice: string;
}

export interface ReframingResult {
  distortion: string;
  challenge: string;
  alternative: string;
  reframe: string;
}

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const { setInput } = useChat();
  const { isDarkMode, reducedMotion } = useTheme();
  const [activeTab, setActiveTab] = useState('immediate');
  const { t } = useTranslation(['support', 'translation']); // 'immediate', 'investigate', 'reframing'
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);
  
  // Immediate Support State
  const [feelingInput, setFeelingInput] = useState('');
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isConfused, setIsConfused] = useState(false);

  // Investigation State
  const [investigationStep, setInvestigationStep] = useState(0);
  const [investigationData, setInvestigationData] = useState({
    emotion: '',
    context: '',
    duration: ''
  });
  const [investigationResult, setInvestigationResult] = useState<InvestigationResult | null>(null);

  // Reframing State
  const [reframingStep, setReframingStep] = useState(0);
  const [reframingData, setReframingData] = useState({
    situation: '',
    thought: '',
    intensity: 5,
    distortion: ''
  });
  const [reframingResult, setReframingResult] = useState<ReframingResult | null>(null);

  const [isHappy, setIsHappy] = useState(false);
  const [isSmiling, setIsSmiling] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [eyePos, setEyePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (reducedMotion) {
      setEyePos({ x: 0, y: 0 });
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
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
  const handleCaretTracking = (e: React.SyntheticEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (reducedMotion) return;
    const target = e.target as HTMLTextAreaElement | HTMLInputElement;
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

    const handleKeyDown = (e: KeyboardEvent) => {
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
      const { sendMessage: sendMessageToGemini } = await import('@/services/chat/chatService');
      const prompt = t('support.immediate.prompt', { feeling: feelingInput });
      
      const result = await sendMessageToGemini(prompt, []);
      
      if (result.success) {
        const lines = result.text.split('\n').filter((l: string) => l.trim());
        const resources: SupportResource[] = [];
        
        lines.forEach((line: string) => {
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
      logger.error('AI analysis error:', error);
    }

    // Fallback logic if AI fails or takes too long (but only if we didn't return yet)
    const timer1 = setTimeout(() => {
      // Check if we are still analyzing (if AI succeeded, isAnalyzing would be false)
      setIsAnalyzing(current => {
        if (!current) return false;
        
        const input = feelingInput.toLowerCase();
        let response: AIResponse = {
          type: 'general',
          message: t('support.immediate.fallbacks.general.msg'),
          resources: [
            { icon: 'self_improvement', title: t('support.immediate.fallbacks.general.res1.title'), desc: t('support.immediate.fallbacks.general.res1.desc') },
            { icon: 'spa', title: t('support.immediate.fallbacks.general.res2.title'), desc: t('support.immediate.fallbacks.general.res2.desc') }
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
        setIsSmiling(false);
        setIsHappy(true);
        const timer2 = setTimeout(() => setIsHappy(false), 2500);
        timersRef.current.push(timer2);
        return false;
      });
    }, 4000); // Give AI more time before fallback
    timersRef.current.push(timer1);
  };

  // Investigation Logic
  const handleInvestigationSelect = (field: string, value: string) => {
    const updatedData = { ...investigationData, [field]: value };
    setInvestigationData(updatedData);
    if (field === 'duration') {
      analyzeInvestigation(updatedData);
    } else {
      setInvestigationStep((prev: number) => prev + 1);
    }
  };

  const analyzeInvestigation = async (data: typeof investigationData) => {
    setIsAnalyzing(true);
    
    try {
      const { sendMessage: sendMessageToGemini } = await import('@/services/chat/chatService');
      const prompt = t('support.investigate.prompt', { emotion: data.emotion, context: data.context, duration: data.duration });
      
      const result = await sendMessageToGemini(prompt, []);
      
      if (result.success) {
        const lines = result.text.split('\n');
        const title = lines.find((l: string) => l.includes('TÍTULO'))?.split(':')[1]?.trim() || t('support.investigate.fallbacks.general.title');
        const description = lines.find((l: string) => l.includes('DESCRIÇÃO'))?.split(':')[1]?.trim() || t('support.investigate.fallbacks.general.desc');
        const advice = lines.find((l: string) => l.includes('CONSELHO'))?.split(':')[1]?.trim() || t('support.investigate.fallbacks.general.advice');
        
        setInvestigationResult({ title, description, advice });
        setIsAnalyzing(false);
        setIsHappy(true);
        setTimeout(() => setIsHappy(false), 2500);
        setInvestigationStep(3);
        return;
      }
    } catch (error) {
      logger.error('Investigation error:', error);
    }
    
    const timer3 = setTimeout(() => {
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
    timersRef.current.push(timer3);
  };

  const resetInvestigation = () => {
    setInvestigationStep(0);
    setInvestigationData({ emotion: '', context: '', duration: '' });
    setInvestigationResult(null);
  };

  // Reframing Logic
  const handleTalkAboutIt = () => {
    const emotion = investigationData.emotion ? String(t(`support.investigate.step0.${investigationData.emotion}`)) : '';
    const context = investigationData.context ? String(t(`support.investigate.step1.${investigationData.context}`)) : '';
    const duration = investigationData.duration ? String(t(`support.investigate.step2.${investigationData.duration}`)) : '';

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

  const handleReframingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reframingData.situation || !reframingData.thought) return;

    setIsAnalyzing(true);
    
    try {
      const { sendMessage: sendMessageToGemini } = await import('@/services/chat/chatService');
      const prompt = t('support.reframing.prompt', { situation: reframingData.situation, thought: reframingData.thought });
      
      const result = await sendMessageToGemini(prompt, []);
      
      if (result.success) {
        const lines = result.text.split('\n');
        const distortion = lines.find((l: string) => l.includes('DISTORÇÃO'))?.split(':')[1]?.trim() || t('support.reframing.ai_fallbacks.distortion');
        const challenge = lines.find((l: string) => l.includes('DESAFIO'))?.split(':')[1]?.trim() || t('support.reframing.ai_fallbacks.challenge');
        const alternative = lines.find((l: string) => l.includes('ALTERNATIVA'))?.split(':')[1]?.trim() || t('support.reframing.ai_fallbacks.alternative');
        const reframe = lines.find((l: string) => l.includes('REFORMULAÇÃO'))?.split(':')[1]?.trim() || t('support.reframing.ai_fallbacks.reframe', { situation: reframingData.situation });
        
        setReframingResult({ distortion, challenge, alternative, reframe });
        setReframingStep(2);
        setIsAnalyzing(false);
        return;
      }
    } catch (error) {
      logger.error('Reframing error:', error);
    }
    
    const timer5 = setTimeout(() => {
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
        result.alternative = t('support.reframing.fallbacks.all_or_nothing.alternative');
      } else if (thought.includes("deveria") || thought.includes("tenho que")) {
        result.distortion = t('support.reframing.fallbacks.should_statements.distortion');
        result.challenge = t('support.reframing.fallbacks.should_statements.challenge');
        result.alternative = t('support.reframing.fallbacks.should_statements.alternative');
      }

      setReframingResult(result);
      setReframingStep(2);
      setIsAnalyzing(false);
    }, 2000);
    timersRef.current.push(timer5);
  };

  const renderReframingTab = () => {
    if (reframingStep === 0) {
      return (
        <div className="step-container">
          <h3>{t("support.reframing.step0.title")}</h3>
          <p>{t("support.reframing.step0.desc")}</p>
          <button className="action-btn primary" onClick={() => setReframingStep(1)}>
            <span className="material-symbols-outlined icon-rtl-flip">arrow_forward</span>
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
                <span className="material-symbols-outlined icon-rtl-flip">arrow_back</span>
              </button>
              <h3>{t("support.reframing.step1.title")}</h3>
            </div>
            <p>{t("support.reframing.step1.desc")}</p>
          </div>
          
          <form onSubmit={handleReframingSubmit} className="reframing-form">
            <div className="form-group">
              <label htmlFor="reframing-situation">{t("support.reframing.step1.q_situation")}</label>
              <input 
                id="reframing-situation"
                type="text" 
                placeholder={t("support.reframing.step1.q_situ_placeholder")}
                value={reframingData.situation}
                onChange={(e) => setReframingData({...reframingData, situation: e.target.value})}
                className="material-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="reframing-thought">{t("support.reframing.step1.q_thought")}</label>
              <textarea 
                id="reframing-thought"
                placeholder={t("support.reframing.step1.q_thought_placeholder")}
                value={reframingData.thought}
                onChange={(e) => setReframingData({...reframingData, thought: e.target.value})}
                className="material-textarea"
                rows={3}
              />
            </div>

            <div className="form-group">
              <label htmlFor="reframing-intensity">{t("support.reframing.step1.q_intensity")}</label>
              <div className="intensity-slider-container">
                <input 
                  id="reframing-intensity"
                  type="range" 
                  min="0" 
                  max="10" 
                  value={reframingData.intensity}
                  onChange={(e) => setReframingData({...reframingData, intensity: Number(e.target.value)})}
                  className="intensity-slider"
                  style={{
                    '--slider-thumb-color': `hsl(${reframingData.intensity * 12}, 84%, 55%)`
                  } as React.CSSProperties}
                />
                <span className="intensity-value">{reframingData.intensity}</span>
              </div>
            </div>

            <button type="submit" className="action-btn primary" disabled={!reframingData.situation || !reframingData.thought || isAnalyzing}>
              {isAnalyzing ? (
                <span className="loading-dots">{t("support.reframing.step1.analyzing")}<span>.</span><span>.</span><span>.</span></span>
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
              setReframingData({ situation: '', thought: '', intensity: 5, distortion: '' });
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
      title={t("support.title")}
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
                  isConfused={isConfused}
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
              <div 
                className="action-btn-wrapper" 
                onClick={() => {
                  if (!feelingInput.trim() && !isAnalyzing) {
                    setIsConfused(true);
                    setTimeout(() => setIsConfused(false), 2000);
                  }
                }}
              >
                <button 
                  className="action-btn primary"
                  onClick={handleAnalyzeFeeling}
                  disabled={isAnalyzing || !feelingInput.trim()}
                  style={{ pointerEvents: !feelingInput.trim() && !isAnalyzing ? 'none' : 'auto' }}
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
            </div>

            {aiResponse && (
              <div className={`ai-response-card ${aiResponse.type}`}>
                <div className="response-header">
                  <span className="material-symbols-outlined">psychology</span>
                  <p>{aiResponse.message}</p>
                </div>
                <div className="resources-grid">
                  {aiResponse.resources.map((resource: SupportResource, index: number) => (
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

            {investigationStep === 2 && !isAnalyzing && (
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

            {isAnalyzing && (
              <div className="loading-state fade-in" style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                padding: '3rem 1rem',
                textAlign: 'center'
              }}>
                <div className="ai-loader-container" style={{ marginBottom: '1.5rem' }}>
                  <PsyBot 
                    isAnalyzing={true}
                    isInputFocused={false}
                    isHappy={false}
                    isSmiling={true}
                    eyePos={{ x: 0, y: 0 }}
                    reducedMotion={reducedMotion}
                    isOpen={true}
                  />
                </div>
                <div className="loading-dots-large">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
                <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                  {t("support.investigate.analyzing", "Analisando seu relato com carinho...")}
                </p>
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
