import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import logger from '../utils/logger';

/**
 * Available soundscape types
 */
export type SoundType =
  | 'rain'
  | 'forest'
  | 'ocean'
  | 'fire'
  | 'thunder'
  | 'coffee'
  | 'cave'
  | 'white'
  | 'brown'
  | 'focus'
  | 'binaural';

/**
 * Sound context value interface
 */
export interface SoundContextValue {
  isPlaying: boolean;
  currentSound: SoundType;
  volume: number;
  toggleSound: () => void;
  changeSound: (newSound: SoundType) => void;
  setVolume: (volume: number) => void;
}

const SoundContext = createContext<SoundContextValue | undefined>(undefined);

export const useSound = (): SoundContextValue => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};

const FADE_OUT_DURATION = 1.5; // seconds

export const SoundProvider = ({ children }: { children: ReactNode }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState<SoundType>('rain');
  const [volume, setVolume] = useState(0.5);

  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Ref mirrors currentSound so playSound() never reads a stale closure value
  const currentSoundRef = useRef<SoundType>('rain');

  /**
   * Initialize Web Audio API context
   */
  const initAudio = async (): Promise<void> => {
    if (!audioContextRef.current) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContextClass();
        gainNodeRef.current = audioContextRef.current.createGain();
        gainNodeRef.current.connect(audioContextRef.current.destination);
      } catch (e) {
        logger.error('Failed to init audio context:', e);
      }
    }

    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
  };

  /**
   * Generate noise or tone buffer for soundscape
   */
  const generateNoiseBuffer = (type: SoundType, ctx: AudioContext): AudioBuffer => {
    logger.debug(`[SoundContext] Generating buffer for: ${type}`);
    const sampleRate = ctx.sampleRate;
    const bufferSize = sampleRate * 4; // 4 second buffer for smoother loops

    if (type === 'binaural') {
      const buffer = ctx.createBuffer(2, bufferSize, sampleRate);
      const left = buffer.getChannelData(0);
      const right = buffer.getChannelData(1);
      const baseFreq = 200;
      const beatFreq = 10; // Alpha wave
      for (let i = 0; i < bufferSize; i++) {
        const t = i / sampleRate;
        left[i] = Math.sin(2 * Math.PI * baseFreq * t) * 0.4;
        right[i] = Math.sin(2 * Math.PI * (baseFreq + beatFreq) * t) * 0.4;
      }
      return buffer;
    }

    const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    if (type === 'white') {
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    } else if (type === 'rain') {
      // Pink noise + higher frequency emphasis (raindrops)
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.3;
        b6 = white * 0.115926;
      }
    } else if (type === 'forest') {
      // Pink noise (similar to rain but lower freq)
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.25;
        b6 = white * 0.115926;
      }
    } else if (type === 'ocean') {
      // Slow, undulating pink noise with wave-like amplitude modulation
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      const waveFreq = 0.15; // Hz – slow wave
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        b6 = white * 0.115926;
        // Amplitude modulation simulates wave swell
        const wave = 0.5 + 0.5 * Math.sin(2 * Math.PI * waveFreq * i / sampleRate);
        data[i] = pink * 0.3 * wave;
      }
    } else if (type === 'fire') {
      // Brown noise with subtle crackle
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.03 * white) / 1.03;
        lastOut = data[i];
        // Occasional crackle
        if (Math.random() < 0.0003) {
          data[i] += (Math.random() * 2 - 1) * 0.3;
        }
        data[i] *= 4.0;
      }
    } else if (type === 'thunder') {
      // Deep rumble (low-freq brown noise) with rare thunder cracks
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.015 * white) / 1.015;
        lastOut = data[i];
        // Rain layer on top
        if (Math.random() < 0.4) {
          data[i] += white * 0.015;
        }
        data[i] *= 6.0;
      }
    } else if (type === 'coffee') {
      // Moderate pink noise (ambient chatter simulation)
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99 * b0 + white * 0.1;
        b1 = 0.97 * b1 + white * 0.15;
        b2 = 0.92 * b2 + white * 0.2;
        data[i] = (b0 + b1 + b2) * 0.12;
      }
    } else if (type === 'cave') {
      // Very low brown noise — cavernous and minimal
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.01 * white) / 1.01;
        lastOut = data[i];
        data[i] *= 3.5;
      }
    } else {
      // focus / brown
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 5.0;
      }
    }

    return buffer;
  };

  /**
   * Get the filter config per sound type
   */
  const getFilterConfig = (type: SoundType): { filterType: BiquadFilterType; frequency: number } => {
    switch (type) {
      case 'rain':      return { filterType: 'lowpass',  frequency: 1200 };
      case 'forest':    return { filterType: 'lowpass',  frequency: 800  };
      case 'ocean':     return { filterType: 'lowpass',  frequency: 600  };
      case 'fire':      return { filterType: 'lowpass',  frequency: 500  };
      case 'thunder':   return { filterType: 'lowpass',  frequency: 400  };
      case 'coffee':    return { filterType: 'bandpass', frequency: 1200 };
      case 'cave':      return { filterType: 'lowpass',  frequency: 300  };
      case 'white':     return { filterType: 'lowpass',  frequency: 15000 };
      case 'binaural':  return { filterType: 'lowpass',  frequency: 2000 };
      default:          return { filterType: 'lowpass',  frequency: 850  };
    }
  };

  /**
   * Immediately stop the current source node (no fade)
   */
  const stopSourceNode = (): void => {
    if (fadeTimerRef.current) {
      clearTimeout(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
    if (sourceNodeRef.current) {
      try { sourceNodeRef.current.stop(); } catch (_) {}
      sourceNodeRef.current = null;
    }
  };

  /**
   * Start playing current soundscape
   */
  const playSound = async (): Promise<void> => {
    try {
      logger.debug(`[SoundContext] playSound() for: ${currentSound}`);
      await initAudio();
      stopSourceNode();

      const ctx = audioContextRef.current;
      const gainNode = gainNodeRef.current;

      if (!ctx || !gainNode) throw new Error('Audio context or gain node not initialized');

      // Restore gain to the user-set volume (in case we were fading out)
      gainNode.gain.cancelScheduledValues(ctx.currentTime);
      gainNode.gain.setValueAtTime(volume, ctx.currentTime);

      const buffer = generateNoiseBuffer(currentSoundRef.current, ctx);
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const { filterType, frequency } = getFilterConfig(currentSoundRef.current);
      const filter = ctx.createBiquadFilter();
      filter.type = filterType;
      filter.frequency.value = frequency;

      noise.connect(filter);
      filter.connect(gainNode);
      noise.start();
      sourceNodeRef.current = noise;
      setIsPlaying(true);
    } catch (error) {
      logger.error('Failed to play sound:', error);
      setIsPlaying(false);
    }
  };

  /**
   * Stop with gradual fade-out for a comfortable experience
   */
  const stopSoundWithFade = (): void => {
    const ctx = audioContextRef.current;
    const gainNode = gainNodeRef.current;

    if (!ctx || !gainNode || !sourceNodeRef.current) {
      setIsPlaying(false);
      return;
    }

    // Update UI state immediately so controls reflect the pause
    setIsPlaying(false);

    // Fade out the gain over FADE_OUT_DURATION seconds
    gainNode.gain.cancelScheduledValues(ctx.currentTime);
    gainNode.gain.setValueAtTime(gainNode.gain.value, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + FADE_OUT_DURATION);

    // Stop the source node after the fade completes
    fadeTimerRef.current = setTimeout(() => {
      stopSourceNode();
      // Restore gain so next play starts at the correct volume
      if (gainNodeRef.current && audioContextRef.current) {
        gainNodeRef.current.gain.setValueAtTime(volume, audioContextRef.current.currentTime);
      }
    }, FADE_OUT_DURATION * 1000 + 100);
  };

  /**
   * Toggle sound on/off
   */
  const toggleSound = (): void => {
    if (isPlaying) {
      stopSoundWithFade();
    } else {
      playSound();
    }
  };

  /**
   * Change to a different soundscape
   */
  const changeSoundType = (newSound: SoundType): void => {
    currentSoundRef.current = newSound; // update ref immediately (sync)
    setCurrentSound(newSound);           // update state for UI re-render
  };

  // When sound changes WHILE already playing, restart with new sound
  useEffect(() => {
    if (isPlaying) {
      playSound();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSound]);

  // Effect to handle volume change
  useEffect(() => {
    if (gainNodeRef.current && isPlaying) {
      gainNodeRef.current.gain.cancelScheduledValues(0);
      gainNodeRef.current.gain.setValueAtTime(volume, 0);
    }
  }, [volume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSourceNode();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const value: SoundContextValue = {
    isPlaying,
    currentSound,
    volume,
    toggleSound,
    changeSound: changeSoundType,
    setVolume,
  };

  return (
    <SoundContext.Provider value={value}>
      {children}
    </SoundContext.Provider>
  );
};
