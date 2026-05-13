import React, { createContext } from 'react';

/**
 * Mood object structure
 */
export interface Mood {
  id: string;
  label: string;
  icon: string;
  color: string;
  value: number;
}

/**
 * Mood history entry
 */
export interface MoodEntry {
  id: number;
  date: string;
  mood: Mood;
  note: string;
}

/**
 * Mood statistics
 */
export interface MoodStats {
  total: number;
  moodCounts: Record<string, number>;
}

/**
 * Mood context value interface
 */
export interface MoodContextValue {
  moodHistory: MoodEntry[];
  addMoodEntry: (mood: Mood, note: string) => void;
  deleteMoodEntry: (id: number) => void;
  getMoodStats: () => MoodStats | null;
}

export const MoodContext = createContext<MoodContextValue | undefined>(undefined);
