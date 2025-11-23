import React, { useState, useEffect } from 'react';
import { usePomodoro } from '../context/PomodoroContext';

const PomodoroModal = ({ isOpen, onClose }) => {
  const { 
    timeLeft, 
    isActive, 
    mode, 
    modes, 
    toggleTimer, 
    resetTimer, 
    changeMode 
  } = usePomodoro();

  const [isClosing, setIsClosing] = useState(false);
  const [aiTip, setAiTip] = useState('');
  const [isLoadingTip, setIsLoadingTip] = useState(false);

  useEffect(() => {
    setAiTip(''); // Clear tip when mode changes
  }, [mode]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const fetchAiTip = async () => {
    setIsLoadingTip(true);
    setAiTip('');
    
    try {
      const { sendMessageToGemini } = await import('../services/gemini');
      let prompt;
      
      if (mode === 'focus') {
        prompt = 'Dê uma dica rápida e prática (1 frase) para um estudante manter o foco durante uma sessão Pomodoro de estudo.';
      } else if (mode === 'short') {
        prompt = 'Dê uma sugestão rápida (1 frase) de atividade relaxante para um estudante fazer durante uma pausa curta de 5 minutos.';
      } else {
        prompt = 'Dê uma sugestão rápida (1 frase) de atividade relaxante para um estudante fazer durante uma pausa longa de 15 minutos.';
      }
      
      const result = await sendMessageToGemini(prompt, []);
      
      if (result.success) {
        setAiTip(result.text);
      } else {
        setAiTip(result.userMessage || '⚠️ Não foi possível gerar dica no momento.');
      }
    } catch (error) {
      setAiTip('❌ Erro ao conectar com IA. Tente novamente.');
    }
    setIsLoadingTip(false);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'Tab') {
        e.preventDefault();
        const modeKeys = ['focus', 'short', 'long'];
        const currentIndex = modeKeys.indexOf(mode);
        const nextIndex = (currentIndex + 1) % modeKeys.length;
        changeMode(modeKeys[nextIndex]);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        toggleTimer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, mode, isActive]);

  if (!isOpen) return null;

  const progress = ((modes[mode].time - timeLeft) / modes[mode].time) * 100;

  return (
    <div className={`modal-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
      <div className="modal-content pomodoro-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Pomodoro</h2>
          <button className="close-btn" onClick={handleClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="modal-body pomodoro-body">
          <div className="pomodoro-modes">
            {Object.keys(modes).map((m) => (
              <button
                key={m}
                className={`mode-btn ${mode === m ? 'active' : ''}`}
                onClick={() => changeMode(m)}
                style={{ 
                  backgroundColor: mode === m ? `${modes[m].color}15` : 'transparent',
                  color: mode === m ? modes[m].color : '#5f6368',
                }}
              >
                {modes[m].label}
              </button>
            ))}
          </div>

          <div className="timer-display" style={{ color: modes[mode].color }}>
            {formatTime(timeLeft)}
          </div>

          <div className="timer-controls">
            <button 
              className="control-btn main-control"
              onClick={toggleTimer}
              style={{ backgroundColor: modes[mode].color }}
            >
              <span className="material-symbols-outlined">
                {isActive ? 'pause' : 'play_arrow'}
              </span>
            </button>
            <button 
              className="control-btn reset-control"
              onClick={resetTimer}
              title="Reiniciar"
            >
              <span className="material-symbols-outlined">refresh</span>
            </button>
          </div>
          
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill" 
              style={{ 
                width: `${progress}%`,
                backgroundColor: modes[mode].color 
              }}
            />
          </div>

          <div className="ai-tip-section">
            <button 
              className="ai-tip-btn"
              onClick={fetchAiTip}
              disabled={isLoadingTip}
              style={{ 
                color: modes[mode].color, 
                borderColor: modes[mode].color,
                backgroundColor: `${modes[mode].color}08`
              }}
            >
              <span className="material-symbols-outlined">
                {isLoadingTip ? 'hourglass_empty' : 'psychology'}
              </span>
              {isLoadingTip ? 'Gerando...' : (mode === 'focus' ? 'Dica de Foco IA' : 'Sugestão de Pausa IA')}
            </button>
            
            {aiTip && (
              <div className="ai-tip-content">
                <span className="material-symbols-outlined tip-icon" style={{ color: modes[mode].color }}>lightbulb</span>
                <p>{aiTip}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PomodoroModal;
