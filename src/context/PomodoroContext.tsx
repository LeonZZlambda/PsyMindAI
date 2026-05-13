import React, { createContext } from 'react';

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

export const PomodoroContext = createContext<PomodoroContextValue | undefined>(undefined);
