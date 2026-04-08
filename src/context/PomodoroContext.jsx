import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { playNotificationSound, showNotification, requestNotificationPermission } from '../utils/notifications';

const PomodoroContext = createContext();

export const usePomodoro = () => useContext(PomodoroContext);

export const PomodoroProvider = ({ children }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus', 'short', 'long'
  const timerRef = useRef(null);
  const { t } = useTranslation();

  const modes = {
    focus: { label: t('pomodoro.focus', 'Foco'), time: 25 * 60, color: '#ef4444', icon: 'local_fire_department' },
    short: { label: t('pomodoro.short_break', 'Pausa Curta'), time: 5 * 60, color: '#10b981', icon: 'spa' },
    long: { label: t('pomodoro.long_break', 'Pausa Longa'), time: 15 * 60, color: '#3b82f6', icon: 'bedtime' }
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
          showNotification(t('pomodoro.notification_title', "PsyMind Pomodoro"), t('pomodoro.time_up', "O tempo acabou!"));
        }
      });
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft, t]);

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
