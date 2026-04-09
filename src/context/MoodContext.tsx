import React, { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';

/**
 * Mood object structure
 */
export interface Mood {
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

const MoodContext = createContext<MoodContextValue | undefined>(undefined);

export const useMood = (): MoodContextValue => {
  const context = useContext(MoodContext);
  if (!context) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
};

export const MoodProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>(() => {
    const saved = localStorage.getItem('psymind_mood_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('psymind_mood_history', JSON.stringify(moodHistory));
  }, [moodHistory]);

  const addMoodEntry = (mood: Mood, note: string): void => {
    const newEntry: MoodEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      mood,
      note
    };
    setMoodHistory((prev) => [newEntry, ...prev]);
  };

  const deleteMoodEntry = (id: number): void => {
    setMoodHistory((prev) => prev.filter((entry) => entry.id !== id));
  };

  const getMoodStats = (): MoodStats | null => {
    if (moodHistory.length === 0) return null;

    const total = moodHistory.length;
    const moodCounts = moodHistory.reduce((acc, entry) => {
      const label = entry.mood.label;
      acc[label] = (acc[label] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { total, moodCounts };
  };

  const value: MoodContextValue = {
    moodHistory,
    addMoodEntry,
    deleteMoodEntry,
    getMoodStats
  };

  return (
    <MoodContext.Provider value={value}>
      {children}
    </MoodContext.Provider>
  );
};
