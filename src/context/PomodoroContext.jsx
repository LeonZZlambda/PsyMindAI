import React, { createContext, useState, useEffect, useContext, useRef } from 'react';

const PomodoroContext = createContext();

export const usePomodoro = () => useContext(PomodoroContext);

export const PomodoroProvider = ({ children }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus', 'short', 'long'
  const timerRef = useRef(null);

  const modes = {
    focus: { label: 'Foco', time: 25 * 60, color: '#1a73e8' },
    short: { label: 'Pausa Curta', time: 5 * 60, color: '#188038' },
    long: { label: 'Pausa Longa', time: 15 * 60, color: '#e37400' }
  };

  const playNotificationSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.5); // Drop to A4
      
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.error("Audio play failed", e);
    }
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      clearInterval(timerRef.current);
      
      playNotificationSound();

      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification("PsyMind Pomodoro", { body: "O tempo acabou!" });
      } else if ('Notification' in window && Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification("PsyMind Pomodoro", { body: "O tempo acabou!" });
          }
        });
      }
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(modes[mode].time);
  };

  const changeMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(modes[newMode].time);
  };

  return (
    <PomodoroContext.Provider value={{
      timeLeft,
      isActive,
      mode,
      modes,
      toggleTimer,
      resetTimer,
      changeMode
    }}>
      {children}
    </PomodoroContext.Provider>
  );
};
