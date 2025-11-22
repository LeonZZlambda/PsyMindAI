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

  const fetchAiTip = () => {
    setIsLoadingTip(true);
    setAiTip('');
    
    // Simulate AI delay
    setTimeout(() => {
      const focusTips = [
        "Divida sua tarefa principal em 3 passos menores antes de começar.",
        "Afaste o celular e feche abas desnecessárias do navegador.",
        "A técnica 5-4-3-2-1 pode ajudar se sentir ansiedade antes de começar.",
        "Lembre-se: O feito é melhor que o perfeito. Apenas comece.",
        "Tente trabalhar em blocos de foco intenso, sem interrupções."
      ];
      
      const breakTips = [
        "Respire fundo 10 vezes. Sinta o ar entrando e saindo.",
        "Olhe para um ponto distante (20 metros) por 20 segundos para descansar os olhos.",
        "Levante-se e alongue os braços e as costas.",
        "Beba um copo d'água. A hidratação ajuda na concentração.",
        "Faça uma breve caminhada pela casa para ativar a circulação."
      ];

      const tips = mode === 'focus' ? focusTips : breakTips;
      const randomTip = tips[Math.floor(Math.random() * tips.length)];
      
      setAiTip(randomTip);
      setIsLoadingTip(false);
    }, 1500);
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
