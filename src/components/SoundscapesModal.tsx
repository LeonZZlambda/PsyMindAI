import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSound } from '../context/SoundContext';
import { useModalAnimation } from '../hooks';
import '../styles/soundscapes.css';

const SoundscapesModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { isPlaying, currentSound, volume, toggleSound, changeSound, setVolume } = useSound();
  const [isClosing, handleClose] = useModalAnimation(onClose);
  const modalRef = useRef(null);

  const sounds = [
    { id: 'rain',  label: t('soundscapes.sounds.rain'),   icon: 'water_drop' },
    { id: 'focus', label: t('soundscapes.sounds.focus'), icon: 'self_improvement' },
    { id: 'white', label: t('soundscapes.sounds.white'),  icon: 'graphic_eq' },
  ];

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Optional chaining to prevent undefined error if ref is not attached yet
      if (modalRef.current) {
        modalRef.current.focus();
      }
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, handleClose]);

  if (!isOpen && !isClosing) return null;
  
  const currentSoundData = sounds.find(s => s.id === currentSound);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div className={`modal-overlay ${isClosing ? 'closing' : ''}`} onClick={handleOverlayClick}>
      <div
        className={`modal-content ${isClosing ? 'closing' : ''}`}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="soundscapes-title"
        ref={modalRef}
        tabIndex="-1"
      >
        <div className="modal-header">
          <div className="modal-header-title">
            <span className="material-symbols-outlined">headphones</span>
            <h2 id="soundscapes-title">{t('soundscapes.title')}</h2>
          </div>
          <button className="close-btn" onClick={handleClose} aria-label={t('soundscapes.close')}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="soundscapes-body">
          
          {/* Main Visual Banner */}
          <div className="soundscapes-hero">
            <div className="hero-info">
              <span className="hero-status">{isPlaying ? t('soundscapes.status.playing') : t('soundscapes.status.paused')}</span>
              <span className="hero-track">
                {currentSoundData ? currentSoundData.label : t('soundscapes.no_sound')}
              </span>
            </div>
            
            <button 
              className="play-toggle-btn"
              onClick={toggleSound}
              aria-label={isPlaying ? t('soundscapes.actions.pause') : t('soundscapes.actions.play')}
            >
              <span className="material-symbols-outlined">
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
            </button>
            
            <div className="equalizer-bg">
              {[...Array(8)].map((_, i) => (
                <div key={i} className={`bar ${isPlaying ? 'animate' : ''}`}></div>
              ))}
            </div>
          </div>

          <div className="sounds-section">
            <h3>{t('soundscapes.choose_env')}</h3>
            <div className="sound-grid">
              {sounds.map(sound => (
                <div 
                  key={sound.id}
                  className={`sound-card ${currentSound === sound.id ? 'active' : ''}`}
                  onClick={() => {
                    changeSound(sound.id);
                    if (!isPlaying) toggleSound();
                  }}
                  role="button"
                  tabIndex="0"
                  aria-pressed={currentSound === sound.id}
                >
                  <span className="material-symbols-outlined">{sound.icon}</span>
                  <span className="label">{sound.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="volume-control">
            <span className="material-symbols-outlined">volume_down</span>
            <input
              type="range"
              className="volume-slider"
              min="0" max="1" step="0.01"
              value={volume}
              onChange={e => setVolume(parseFloat(e.target.value))}
              aria-label={t('soundscapes.volume')}
              style={{ background: `linear-gradient(to right, var(--primary-color) ${volume * 100}%, var(--border-color) ${volume * 100}%)` }}
            />
            <span className="material-symbols-outlined">volume_up</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SoundscapesModal;