import React, { useEffect, useState } from 'react';
import '../styles/pomodoro.css';
import { useTranslation } from 'react-i18next';
import { usePomodoro } from '../context/PomodoroContext';
import { generatePomodoroTip } from '../services/tools/pomodoroService';
import BaseModal from './BaseModal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const PomodoroModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const {
    timeLeft,
    isActive,
    mode,
    modes,
    toggleTimer,
    resetTimer,
    changeMode
  } = usePomodoro();

  const { t } = useTranslation();

  const [aiTip, setAiTip] = useState('');
  const [isLoadingTip, setIsLoadingTip] = useState(false);

  useEffect(() => {
    setAiTip('');
  }, [mode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const fetchAiTip = async () => {
    setIsLoadingTip(true);
    setAiTip('');

    try {
      const tip = await generatePomodoroTip(mode);
      setAiTip(tip as string);
    } catch (error) {
      setAiTip(t('pomodoro.error'));
    }
    setIsLoadingTip(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Tab') {
        e.preventDefault();
        const modeKeys = ['focus', 'short', 'long'];
        const currentIndex = modeKeys.indexOf(mode as string);
        const nextIndex = (currentIndex + 1) % modeKeys.length;
        changeMode(modeKeys[nextIndex] as any);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        toggleTimer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, mode, isActive, toggleTimer, changeMode]);

  if (!isOpen) return null;

  const progress = ((modes[mode].time - timeLeft) / modes[mode].time) * 100;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('pomodoro.title')}
      icon="timer"
      maxWidth="400px"
    >
      <div className="pomodoro-body">
        <div className="pomodoro-modes">
          {(Object.keys(modes) as Array<keyof typeof modes>).map((m) => (
            <button
              key={m as string}
              className={`mode-btn ${mode === m ? 'active' : ''}`}
              onClick={() => changeMode(m as any)}
              style={{
                '--mode-color': modes[m].color
              } as React.CSSProperties}
            >
              <span className="material-symbols-outlined">
                {modes[m].icon}
              </span>
              <span>{modes[m].label}</span>
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
            aria-label={isActive ? 'Pause' : 'Start'}
          >
            <span className="material-symbols-outlined">
              {isActive ? 'pause' : 'play_arrow'}
            </span>
          </button>
          <button
            className="control-btn reset-control"
            onClick={resetTimer}
            title={t('pomodoro.restart')}
            aria-label={t('pomodoro.restart')}
          >
            <span className="material-symbols-outlined">refresh</span>
          </button>
        </div>

        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{
              width: `${progress}%`,
              backgroundColor: isActive ? modes[mode].color : 'var(--border-color)'
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
            {isLoadingTip ? t('pomodoro.generating') : (mode === 'focus' ? t('pomodoro.focus_tip') : t('pomodoro.break_tip'))}
          </button>

          {aiTip && (
            <div className="ai-tip-content" style={{ borderColor: `${modes[mode].color}40` }}>
              <span className="material-symbols-outlined tip-icon" style={{ color: modes[mode].color }}>lightbulb</span>
              <p>{aiTip}</p>
            </div>
          )}
        </div>
      </div>
    </BaseModal>
  );
};

export default PomodoroModal;
