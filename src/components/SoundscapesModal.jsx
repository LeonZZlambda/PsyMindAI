import React from 'react';
import { useSound } from '../context/SoundContext';
import '../styles/pomodoro.css'; // Reuse modal styles

const SoundscapesModal = ({ isOpen, onClose }) => {
  const { isPlaying, currentSound, volume, toggleSound, changeSound, setVolume } = useSound();

  if (!isOpen) return null;

  const sounds = [
    { id: 'rain', label: 'Chuva Suave', icon: 'water_drop' },
    { id: 'focus', label: 'Foco Profundo', icon: 'self_improvement' }, // Brown noise
    { id: 'white', label: 'Ruído Branco', icon: 'graphic_eq' },
  ];

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="pomodoro-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <span className="material-symbols-outlined">headphones</span>
            <h3>Sons Ambientais</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="pomodoro-body">
          <div className="sound-controls">
            <button 
              className={`timer-toggle-btn ${isPlaying ? 'active' : ''}`}
              onClick={toggleSound}
              style={{ width: '80px', height: '80px', borderRadius: '50%' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
            </button>
            <p style={{ marginTop: '1rem', color: 'var(--text-light)' }}>
              {isPlaying ? 'Reproduzindo...' : 'Pausado'}
            </p>
          </div>

          <div className="sound-list" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {sounds.map(sound => (
              <button
                key={sound.id}
                className={`mode-btn ${currentSound === sound.id ? 'active' : ''}`}
                onClick={() => changeSound(sound.id)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem', 
                  width: '100%', 
                  justifyContent: 'flex-start',
                  padding: '12px 16px',
                  background: currentSound === sound.id ? 'var(--secondary-color)' : 'transparent'
                }}
              >
                <span className="material-symbols-outlined">{sound.icon}</span>
                {sound.label}
              </button>
            ))}
          </div>

          <div className="volume-control" style={{ width: '100%', marginTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-light)' }}>
              <span className="material-symbols-outlined">volume_down</span>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={volume} 
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                style={{ flex: 1, accentColor: 'var(--primary-color)' }}
              />
              <span className="material-symbols-outlined">volume_up</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoundscapesModal;
