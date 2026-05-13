import React, { useState, useEffect, useRef, ReactNode } from 'react';
import logger from '../utils/logger';
import { SoundContext, SoundType, SoundContextValue, FADE_OUT_DURATION } from './SoundContext';

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
        data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        b6 = white * 0.115926;
        // Occasional crackle
        if (Math.random() < 0.0003) {
          data[i] += (Math.random() * 2 - 1) * 0.3;
        }
        data[i] *= 4.0;
      }
    } else if (type === 'forest') {
      // Pink noise + occasional bird chirps (high freq bursts)
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99765 * b0 + white * 0.0990460;
        b1 = 0.96300 * b1 + white * 0.2965164;
        b2 = 0.57000 * b2 + white * 1.0526913;
        data[i] = b0 + b1 + b2 + white * 0.1848;
        // Occasional bird chirp
        if (Math.random() < 0.0001) {
          data[i] += Math.sin(i * 0.1) * 0.5;
        }
        data[i] *= 3.0;
      }
    } else if (type === 'ocean') {
      // Pink noise + low freq waves
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99604 * b0 + white * 0.115926;
        b1 = 0.93775 * b1 + white * 0.343077;
        b2 = 0.42100 * b2 + white * 0.939979;
        data[i] = b0 + b1 + b2 + white * 0.050056;
        // Wave-like modulation
        data[i] *= (1 + Math.sin(i * 0.0001) * 0.3);
        data[i] *= 2.5;
      }
    } else if (type === 'fire') {
      // Pink noise + crackling (high freq pops)
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99765 * b0 + white * 0.0990460;
        b1 = 0.96300 * b1 + white * 0.2965164;
        b2 = 0.57000 * b2 + white * 1.0526913;
        data[i] = b0 + b1 + b2 + white * 0.1848;
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
   * Get filter configuration for sound type
   */
  const getFilterConfig = (type: SoundType): { filterType: BiquadFilterType; frequency: number } => {
    switch (type) {
      case 'rain':
        return { filterType: 'highpass', frequency: 1000 };
      case 'forest':
        return { filterType: 'highpass', frequency: 500 };
      case 'ocean':
        return { filterType: 'lowpass', frequency: 800 };
      case 'fire':
        return { filterType: 'highpass', frequency: 200 };
      case 'thunder':
        return { filterType: 'lowpass', frequency: 200 };
      case 'coffee':
        return { filterType: 'highpass', frequency: 300 };
      case 'cave':
        return { filterType: 'lowpass', frequency: 300 };
      case 'white':
        return { filterType: 'allpass', frequency: 1000 };
      case 'brown':
        return { filterType: 'lowpass', frequency: 400 };
      case 'focus':
        return { filterType: 'highpass', frequency: 100 };
      case 'binaural':
        return { filterType: 'allpass', frequency: 1000 };
      default:
        return { filterType: 'allpass', frequency: 1000 };
    }
  };

  /**
   * Stop the current source node
   */
  const stopSourceNode = (): void => {
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop();
      } catch (e) {
        // Source might already be stopped
      }
      sourceNodeRef.current = null;
    }
    if (fadeTimerRef.current) {
      clearTimeout(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
  };

  /**
   * Play the current soundscape
   */
  const playSound = async (): Promise<void> => {
    try {
      await initAudio();
      const ctx = audioContextRef.current;
      const gainNode = gainNodeRef.current;

      if (!ctx || !gainNode) {
        logger.error('Audio context not initialized');
        return;
      }

      stopSourceNode();

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