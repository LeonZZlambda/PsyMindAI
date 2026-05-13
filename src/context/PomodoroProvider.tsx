import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { playNotificationSound, showNotification, requestNotificationPermission } from '../utils/notifications';
import { PomodoroContext, PomodoroMode, PomodoroModeConfig, PomodoroContextValue } from './PomodoroContext';

export const PomodoroProvider = ({ children }: { children: ReactNode }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<PomodoroMode>('focus');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { t } = useTranslation();

  const modes: Record<PomodoroMode, PomodoroModeConfig> = {
    focus: { label: t('pomodoro.focus', 'Foco'), time: 25 * 60, color: '#ef4444', icon: 'local_fire_department' },
    short: { label: t('pomodoro.short_break', 'Pausa Curta'), time: 5 * 60, color: '#10b981', icon: 'spa' },
    long: { label: t('pomodoro.long_break', 'Pausa Longa'), time: 15 * 60, color: '#3b82f6', icon: 'bedtime' }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (interval) clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  useEffect(() => {
    if (timeLeft === 0 && isActive) {
      setIsActive(false);

      playNotificationSound();

      requestNotificationPermission().then((hasPermission) => {
        if (hasPermission) {
          showNotification(
            t('pomodoro.notification_title', 'PsyMind Pomodoro'),
            t('pomodoro.time_up', 'O tempo acabou!')
          );
        }
      });
    }
  }, [timeLeft, isActive, t]);

  const toggleTimer = (): void => {
    setIsActive(!isActive);
  };

  const resetTimer = (): void => {
    setIsActive(false);
    setTimeLeft(modes[mode].time);
  };

  const changeMode = (newMode: PomodoroMode): void => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(modes[newMode].time);
  };

  const value: PomodoroContextValue = {
    timeLeft,
    isActive,
    mode,
    modes,
    toggleTimer,
    resetTimer,
    changeMode
  };

  return (
    <PomodoroContext.Provider value={value}>
      {children}
    </PomodoroContext.Provider>
  );
};