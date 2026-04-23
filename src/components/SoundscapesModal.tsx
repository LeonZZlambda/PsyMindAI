import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSound } from '../context/SoundContext';
import BaseModal from './BaseModal';
import '../styles/soundscapes.css';

const SoundscapesModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { isPlaying, currentSound, volume, toggleSound, changeSound, setVolume } = useSound();

  const sounds = [
    { id: 'rain',  label: t('soundscapes.sounds.rain'),   icon: 'water_drop' },
    { id: 'focus', label: t('soundscapes.sounds.focus'), icon: 'self_improvement' },
    { id: 'white', label: t('soundscapes.sounds.white'),  icon: 'graphic_eq' },
    { id: 'binaural', label: t('soundscapes.sounds.binaural'), icon: 'waves' },
  ];

  const currentSoundData = sounds.find(s => s.id === currentSound);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('soundscapes.title')}
      icon="headphones"
    >
      <div className="soundscapes-body">
        
        {/* Main Visual Banner */}
        <div className="soundscapes-hero">
          <div className="hero-info">
            <span className="hero-status">
              {isPlaying ? t('soundscapes.status.playing') : t('soundscapes.status.paused')}
            </span>
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
              <button 
                key={sound.id}
                className={`sound-card ${currentSound === sound.id ? 'active' : ''}`}
                onClick={() => {
                  changeSound(sound.id);
                  if (!isPlaying) toggleSound();
                }}
                aria-pressed={currentSound === sound.id}
              >
                <span className="material-symbols-outlined">{sound.icon}</span>
                <span className="label">{sound.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="volume-control">
          <span className="material-symbols-outlined">
            {volume === 0 ? 'volume_off' : volume < 0.5 ? 'volume_down' : 'volume_up'}
          </span>
          <input
            type="range"
            className="volume-slider"
            min="0" max="1" step="0.01"
            value={volume}
            onChange={e => setVolume(parseFloat(e.target.value))}
            aria-label={t('soundscapes.volume')}
            style={{ 
              background: `linear-gradient(to right, var(--primary-color) ${volume * 100}%, var(--border-color) ${volume * 100}%)` 
            } as React.CSSProperties}
          />
          <span className="material-symbols-outlined">volume_up</span>
        </div>

      </div>
    </BaseModal>
  );
};

export default SoundscapesModal;