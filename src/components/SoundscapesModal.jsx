import React, { useRef, useEffect } from 'react';
import { useSound } from '../context/SoundContext';
import '../styles/soundscapes.css';

const sounds = [
  { id: 'rain',  label: 'Chuva Suave',   icon: 'water_drop' },
  { id: 'focus', label: 'Foco Profundo', icon: 'self_improvement' },
  { id: 'white', label: 'Ruído Branco',  icon: 'graphic_eq' },
];

const SoundscapesModal = ({ isOpen, onClose }) => {
  const { isPlaying, currentSound, volume, toggleSound, changeSound, setVolume } = useSound();
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Optional chaining to prevent undefined error if ref is not attached yet
      if (modalRef.current) {
        modalRef.current.focus();
      }
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  
  const currentSoundData = sounds.find(s => s.id === currentSound);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="soundscapes-title"
        ref={modalRef}
        tabIndex="-1"
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--primary-color)' }}>headphones</span>
            <h2 id="soundscapes-title" style={{ margin: 0, fontSize: '1.25rem', fontWeight: 500 }}>Sons Ambientais</h2>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Fechar">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="soundscapes-body">
          
          {/* Main Visual Banner */}
          <div className="soundscapes-hero">
            <div className="hero-info">
              <span className="hero-status">{isPlaying ? 'Reproduzindo' : 'Pausado'}</span>
              <span className="hero-track">
                {currentSoundData ? currentSoundData.label : 'Nenhum som'}
              </span>
            </div>
            
            <button 
              className="play-toggle-btn"
              onClick={toggleSound}
              aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 28 }}>
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
            <h3>Escolha um Ambiente</h3>
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
              aria-label="Volume do ambiente"
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