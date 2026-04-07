import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { playNotificationSound, showNotification, requestNotificationPermission } from '../utils/notifications';

const PomodoroContext = createContext();

export const usePomodoro = () => useContext(PomodoroContext);

export const PomodoroProvider = ({ children }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus', 'short', 'long'
  const timerRef = useRef(null);

  const modes = {
    focus: { label: 'Foco', time: 25 * 60, color: '#ef4444', icon: 'local_fire_department' }, // Red (Tomato/Focus/Vitality)
    short: { label: 'Pausa Curta', time: 5 * 60, color: '#10b981', icon: 'spa' }, // Green (Relief/Nature/Short Healing)
    long: { label: 'Pausa Longa', time: 15 * 60, color: '#3b82f6', icon: 'bedtime' } // Blue (Deep Rest/Cool down)
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
      
      requestNotificationPermission().then(hasPermission => {
        if (hasPermission) {
          showNotification("PsyMind Pomodoro", "O tempo acabou!");
        }
      });
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
