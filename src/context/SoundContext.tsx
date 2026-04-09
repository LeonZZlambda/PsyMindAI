import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';

/**
 * Available soundscape types
 */
export type SoundType = 'rain' | 'forest' | 'white' | 'brown';

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

export const SoundProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState<SoundType>('rain');
  const [volume, setVolume] = useState(0.5);

  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceNodeRef = useRef<BufferSource | null>(null);

  // Type for BufferSource (either AudioBufferSourceNode or ExtendedAudioBufferSourceNode)
  type BufferSource = AudioBufferSourceNode;

  /**
   * Initialize Web Audio API context
   */
  const initAudio = (): void => {
    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
    }
  };

  /**
   * Generate noise buffer for soundscape
   */
  const generateNoiseBuffer = (type: SoundType, ctx: AudioContext): AudioBuffer => {
    const bufferSize = ctx.sampleRate * 2; // 2 seconds buffer
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    if (type === 'white') {
      // White noise: completely random
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    } else if (type === 'rain' || type === 'forest') {
      // Pink noise approximation for rain/forest
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
        data[i] *= 0.11;
        b6 = white * 0.115926;
      }
    } else if (type === 'brown') {
      // Brown noise: smooth falling frequency
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5;
      }
    }

    return buffer;
  };

  /**
   * Start playing current soundscape
   */
  const playSound = (): void => {
    initAudio();
    stopSound(); // Clear any existing sound

    const ctx = audioContextRef.current;
    const gainNode = gainNodeRef.current;

    if (!ctx || !gainNode) return;

    const buffer = generateNoiseBuffer(currentSound, ctx);

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    // Apply frequency filter based on sound type
    const filter = ctx.createBiquadFilter();
    if (currentSound === 'rain') {
      filter.type = 'lowpass';
      filter.frequency.value = 800;
    } else if (currentSound === 'brown') {
      filter.type = 'lowpass';
      filter.frequency.value = 400;
    } else {
      filter.type = 'lowpass';
      filter.frequency.value = 10000; // Open for white noise
    }

    noise.connect(filter);
    filter.connect(gainNode);

    noise.start();
    sourceNodeRef.current = noise;
    setIsPlaying(true);

    // Apply volume
    gainNode.gain.value = volume;
  };

  /**
   * Stop currently playing sound
   */
  const stopSound = (): void => {
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop();
      } catch (e) {
        // Already stopped
      }
      sourceNodeRef.current = null;
    }
    setIsPlaying(false);
  };

  /**
   * Toggle sound on/off
   */
  const toggleSound = (): void => {
    if (isPlaying) {
      stopSound();
    } else {
      playSound();
    }
  };

  /**
   * Change to a different soundscape
   */
  const changeSoundType = (newSound: SoundType): void => {
    setCurrentSound(newSound);
    if (isPlaying) {
      // Restart with new sound type
      setTimeout(() => {
        stopSound();
      }, 0);
    }
  };

  // Effect to handle sound change while playing
  useEffect(() => {
    if (isPlaying) {
      playSound();
    }
  }, [currentSound]);

  // Effect to handle volume change
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
  }, [volume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSound();
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
    setVolume
  };

  return (
    <SoundContext.Provider value={value}>
      {children}
    </SoundContext.Provider>
  );
};
