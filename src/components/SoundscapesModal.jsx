import React from 'react';
import { useSound } from '../context/SoundContext';

const sounds = [
  { id: 'rain',  label: 'Chuva Suave',   icon: 'water_drop' },
  { id: 'focus', label: 'Foco Profundo', icon: 'self_improvement' },
  { id: 'white', label: 'Ruído Branco',  icon: 'graphic_eq' },
];

const SoundscapesModal = ({ isOpen, onClose }) => {
  const { isPlaying, currentSound, volume, toggleSound, changeSound, setVolume } = useSound();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="soundscapes-title"
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

        <div className="settings-body">
          {/* Play / Pause */}
          <div className="settings-section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="setting-info">
              <span className="setting-label">{isPlaying ? 'Reproduzindo' : 'Pausado'}</span>
              <span className="setting-desc">{isPlaying ? sounds.find(s => s.id === currentSound)?.label : 'Pressione para iniciar'}</span>
            </div>
            <button
              onClick={toggleSound}
              style={{
                width: 52, height: 52, borderRadius: '50%', border: 'none',
                background: 'var(--primary-color)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', flexShrink: 0,
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}
              aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 28 }}>
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
            </button>
          </div>

          {/* Sound selector */}
          <div className="settings-section">
            <h3>Ambiente</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {sounds.map(sound => (
                <button
                  key={sound.id}
                  onClick={() => changeSound(sound.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.75rem 1rem', borderRadius: 16, border: 'none',
                    background: currentSound === sound.id ? 'var(--secondary-color)' : 'transparent',
                    color: currentSound === sound.id ? 'var(--primary-color)' : 'var(--text-color)',
                    fontFamily: 'inherit', fontSize: '0.9375rem', fontWeight: currentSound === sound.id ? 500 : 400,
                    cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s',
                    outline: currentSound === sound.id ? '2px solid var(--primary-color)' : 'none',
                    outlineOffset: -2,
                  }}
                  aria-pressed={currentSound === sound.id}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 22 }}>{sound.icon}</span>
                  {sound.label}
                  {currentSound === sound.id && (
                    <span className="material-symbols-outlined" style={{ marginLeft: 'auto', fontSize: 18 }}>check</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Volume */}
          <div className="settings-section" style={{ marginBottom: 0 }}>
            <h3>Volume</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--text-light)', fontSize: 20 }}>volume_down</span>
              <input
                type="range"
                min="0" max="1" step="0.01"
                value={volume}
                onChange={e => setVolume(parseFloat(e.target.value))}
                style={{ flex: 1, accentColor: 'var(--primary-color)', height: 4 }}
                aria-label="Volume"
              />
              <span className="material-symbols-outlined" style={{ color: 'var(--text-light)', fontSize: 20 }}>volume_up</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoundscapesModal;
