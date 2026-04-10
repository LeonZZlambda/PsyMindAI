import React, { createContext, useState, useEffect, useContext, useRef, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { playNotificationSound, showNotification, requestNotificationPermission } from '../utils/notifications';

/**
 * Pomodoro mode: focus session or break
 */
export type PomodoroMode = 'focus' | 'short' | 'long';

/**
 * Pomodoro mode configuration
 */
export interface PomodoroModeConfig {
  label: string;
  time: number;
  color: string;
  icon: string;
}

/**
 * Pomodoro context value interface
 */
export interface PomodoroContextValue {
  timeLeft: number;
  isActive: boolean;
  mode: PomodoroMode;
  modes: Record<PomodoroMode, PomodoroModeConfig>;
  toggleTimer: () => void;
  resetTimer: () => void;
  changeMode: (newMode: PomodoroMode) => void;
}

const PomodoroContext = createContext<PomodoroContextValue | undefined>(undefined);

export const usePomodoro = (): PomodoroContextValue => {
  const context = useContext(PomodoroContext);
  if (!context) {
    throw new Error('usePomodoro must be used within a PomodoroProvider');
  }
  return context;
};

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
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      if (timerRef.current) clearInterval(timerRef.current);

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

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, t]);

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
