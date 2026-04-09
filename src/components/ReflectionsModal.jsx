import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useChat } from '../context/ChatContext';
import BaseModal from './BaseModal';
import { generateReflection, generateReflectionAnalysis } from '../services/tools/reflectionService';
import '../styles/help.css';
import '../styles/reflections.css';

const categories = [
  { id: 'resilience', icon: 'psychology', color: '#B8860B' },
  { id: 'self_knowledge', icon: 'self_improvement', color: '#8B5CF6' },
  { id: 'purpose', icon: 'lightbulb', color: '#F59E0B' },
  { id: 'anxiety', icon: 'spa', color: '#3B82F6' },
  { id: 'gratitude', icon: 'volunteer_activism', color: '#EC4899' },
  { id: 'self_esteem', icon: 'favorite', color: '#EF4444' }
];

const breathingTechniques = [
  { id: '478', inhale: 4, hold: 7, exhale: 8, icon: 'bedtime', color: '#6366f1' },
  { id: 'box', inhale: 4, hold: 4, exhale: 4, holdAfter: 4, icon: 'crop_square', color: '#3b82f6' },
  { id: 'calm', inhale: 4, exhale: 6, icon: 'spa', color: '#10b981' },
  { id: 'energy', inhale: 3, exhale: 3, icon: 'bolt', color: '#f59e0b' }
];

const ReflectionsModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { setInput } = useChat();
  const [activeTab, setActiveTab] = useState('daily'); // 'daily', 'explore', or 'breathing'
  const [currentReflection, setCurrentReflection] = useState(null);
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState('inhale');
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const breathingTimerRef = useRef(null);
  const [aiReflection, setAiReflection] = useState('');
  const [isLoadingReflection, setIsLoadingReflection] = useState(false);

  const getReflectionsData = () => {
    return t('reflections.default_quotes', { returnObjects: true });
  };

  useEffect(() => {
    if (isOpen && activeTab === 'daily' && !currentReflection && !isLoadingReflection) {
      getRandomReflection();
    }
  }, [isOpen, activeTab]);

  const getRandomReflection = async (category = null) => {
    setAiReflection('');
    setIsLoadingReflection(true);
    
    try {
      const reflection = await generateReflection(category);
      
      if (reflection) {
        setCurrentReflection({ id: Date.now(), ...reflection });
      } else {
        const data = getReflectionsData();
        const random = data[Math.floor(Math.random() * data.length)];
        setCurrentReflection(random);
      }
    } catch (error) {
      const data = getReflectionsData();
      const random = data[Math.floor(Math.random() * data.length)];
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
      setAiReflection(t('reflections.daily_tab.error'));
    }
    setIsLoadingReflection(false);
  };

  const handleClose = () => {
    if (breathingTimerRef.current) clearTimeout(breathingTimerRef.current);
    setBreathingActive(false);
    onClose();
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
    const message = t('reflections.chat_prompt', { author: currentReflection.author, text: currentReflection.text });
    setInput(message);
    handleClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
    >
      <div className="reflections-modal-content">
        <div className="modal-header with-tabs">
          <div className="modal-tabs">
            <button 
              className={`tab-btn ${activeTab === 'daily' ? 'active' : ''}`}
              onClick={() => setActiveTab('daily')}
            >
              {t('reflections.tabs.daily')}
            </button>
            <button 
              className={`tab-btn ${activeTab === 'explore' ? 'active' : ''}`}
              onClick={() => setActiveTab('explore')}
            >
              {t('reflections.tabs.explore')}
            </button>
            <button 
              className={`tab-btn ${activeTab === 'breathing' ? 'active' : ''}`}
              onClick={() => { setActiveTab('breathing'); stopBreathing(); }}
            >
              {t('reflections.tabs.breathing')}
            </button>
          </div>
          <button className="modal-close-btn" onClick={handleClose} aria-label="Close modal">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="help-body">
          {activeTab === 'daily' && (
            <div className="reflection-container">
              {isLoadingReflection && !currentReflection ? (
                <div className="reflection-card" style={{ textAlign: 'center', padding: '3rem' }}>
                  <span className="material-symbols-outlined reflection-icon" style={{ animation: 'spin 2s linear infinite' }}>autorenew</span>
                  <p style={{ color: 'var(--text-light)' }}>{t('reflections.daily_tab.generating')}</p>
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
                      {t('reflections.daily_tab.new_button')}
                    </button>
                    <button className="reflection-btn btn-ai" onClick={getAiReflection} disabled={isLoadingReflection}>
                      <span className="material-symbols-outlined">{isLoadingReflection ? 'hourglass_empty' : 'psychology'}</span>
                      {isLoadingReflection ? t('reflections.daily_tab.ai_reflecting') : t('reflections.daily_tab.ai_button')}
                    </button>
                    <button className="reflection-btn btn-chat" onClick={handleDiscussReflection}>
                      <span className="material-symbols-outlined">chat</span>
                      {t('reflections.daily_tab.chat_button')}
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
              <h3>{t('reflections.explore_tab.title')}</h3>
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
                    <span className="material-symbols-outlined category-icon" style={{ color: cat.color }}>{cat.icon}</span>
                    <span className="category-name">{t(`reflections.explore_tab.categories.${cat.id}`)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'breathing' && (
            <div className="breathing-container">
              {!breathingActive ? (
                <>
                  <h3>{t('reflections.breathing_tab.title')}</h3>
                  <div className="breathing-techniques">
                    {breathingTechniques.map(tech => (
                      <div key={tech.id} className="technique-card">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '2rem', color: tech.color }}>{tech.icon}</span>
                          <h4 style={{ color: tech.color }}>{t(`reflections.breathing_tab.techniques.${tech.id}.name`)}</h4>
                        </div>
                        <p>{t(`reflections.breathing_tab.techniques.${tech.id}.desc`)}</p>
                        <button 
                          className="start-breathing-btn" 
                          onClick={() => startBreathing(tech)}
                          style={{ backgroundColor: tech.color, color: '#fff' }}
                        >
                          <span className="material-symbols-outlined">air</span>
                          {t('reflections.breathing_tab.start')}
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
                    {breathingPhase === 'inhale' && t('reflections.breathing_tab.phases.inhale')}
                    {breathingPhase === 'hold' && t('reflections.breathing_tab.phases.hold')}
                    {breathingPhase === 'exhale' && t('reflections.breathing_tab.phases.exhale')}
                    {breathingPhase === 'holdAfter' && t('reflections.breathing_tab.phases.holdAfter')}
                  </div>
                  <button className="stop-breathing-btn" onClick={stopBreathing}>
                    {t('reflections.breathing_tab.stop')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </BaseModal>
  );
};

export default ReflectionsModal;
