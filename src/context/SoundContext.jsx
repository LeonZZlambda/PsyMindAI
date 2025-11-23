import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const SoundContext = createContext();

export const useSound = () => useContext(SoundContext);

export const SoundProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState('rain'); // rain, forest, white, brown
  const [volume, setVolume] = useState(0.5);
  
  const audioContextRef = useRef(null);
  const gainNodeRef = useRef(null);
  const sourceNodeRef = useRef(null);

  // Initialize Audio Context
  const initAudio = () => {
    if (!audioContextRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContext();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
    }
  };

  const createNoiseBuffer = (type) => {
    if (!audioContextRef.current) return null;
    
    const bufferSize = audioContextRef.current.sampleRate * 2; // 2 seconds buffer
    const buffer = audioContextRef.current.createBuffer(1, bufferSize, audioContextRef.current.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      if (type === 'white') {
        data[i] = Math.random() * 2 - 1;
      } else if (type === 'pink') { // Approximation for Rain
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5; 
      } else if (type === 'brown') { // Deep Focus
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5; 
      }
    }
    return buffer;
  };

  // Simple noise generators
  let lastOut = 0;

  const playSound = () => {
    initAudio();
    stopSound(); // Stop any current sound

    const ctx = audioContextRef.current;
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate Noise
    if (currentSound === 'white') {
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    } else if (currentSound === 'pink' || currentSound === 'rain') {
      let b0, b1, b2, b3, b4, b5, b6;
      b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
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
    } else if (currentSound === 'brown' || currentSound === 'focus') {
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5; 
      }
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    
    // Filter for smoother sound
    const filter = ctx.createBiquadFilter();
    if (currentSound === 'rain') {
      filter.type = 'lowpass';
      filter.frequency.value = 800;
    } else if (currentSound === 'focus') {
      filter.type = 'lowpass';
      filter.frequency.value = 400;
    } else {
      filter.type = 'lowpass';
      filter.frequency.value = 10000; // Open for white noise
    }

    noise.connect(filter);
    filter.connect(gainNodeRef.current);
    
    noise.start();
    sourceNodeRef.current = noise;
    setIsPlaying(true);
    
    // Apply volume
    gainNodeRef.current.gain.value = volume;
  };

  const stopSound = () => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current = null;
    }
    setIsPlaying(false);
  };

  const toggleSound = () => {
    if (isPlaying) {
      stopSound();
    } else {
      playSound();
    }
  };

  const changeSound = (newSound) => {
    setCurrentSound(newSound);
    if (isPlaying) {
      // Small timeout to allow state update before restart
      setTimeout(() => {
        stopSound();
        // We need to call playSound but with the new state, 
        // however inside playSound it uses currentSound state which might not be updated yet in closure.
        // So we pass it or rely on effect. 
        // Better approach: just set state, and use effect to restart if playing.
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

  return (
    <SoundContext.Provider value={{ 
      isPlaying, 
      currentSound, 
      volume, 
      toggleSound, 
      changeSound, 
      setVolume 
    }}>
      {children}
    </SoundContext.Provider>
  );
};
