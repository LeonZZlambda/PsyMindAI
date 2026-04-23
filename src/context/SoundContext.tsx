import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';

/**
 * Available soundscape types
 */
export type SoundType = 'rain' | 'forest' | 'white' | 'brown' | 'focus';

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

export const SoundProvider = ({ children }: { children: ReactNode }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState<SoundType>('rain');
  const [volume, setVolume] = useState(0.5);

  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  /**
   * Initialize Web Audio API context
   */
  const initAudio = async (): Promise<void> => {
    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
    }
    
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
  };

  /**
   * Generate noise buffer for soundscape
   */
  const generateNoiseBuffer = (type: SoundType, ctx: AudioContext): AudioBuffer => {
    console.log(`[SoundContext] Generating noise buffer for: ${type}`);
    const bufferSize = ctx.sampleRate * 2; // 2 seconds buffer
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    if (type === 'white') {
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    } else if (type === 'rain' || type === 'forest') {
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
        data[i] *= 0.35;
        b6 = white * 0.115926;
      }
    } else {
      // focus or brown
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
   * Start playing current soundscape
   */
  const playSound = async (): Promise<void> => {
    console.log(`[SoundContext] playSound() called for: ${currentSound}`);
    await initAudio();
    stopSound(); 

    const ctx = audioContextRef.current;
    const gainNode = gainNodeRef.current;

    if (!ctx || !gainNode) {
      console.error('[SoundContext] Failed to initialize AudioContext or GainNode');
      return;
    }

    const buffer = generateNoiseBuffer(currentSound, ctx);
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    if (currentSound === 'rain') {
      filter.type = 'lowpass';
      filter.frequency.value = 1000;
    } else if (currentSound === 'white') {
      filter.type = 'lowpass';
      filter.frequency.value = 15000;
    } else {
      filter.type = 'lowpass';
      filter.frequency.value = 850; // Further increased for audibility
    }

    console.log(`[SoundContext] Audio source starting with filter at ${filter.frequency.value}Hz`);
    noise.connect(filter);
    filter.connect(gainNode);

    noise.start();
    sourceNodeRef.current = noise;
    setIsPlaying(true);
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
