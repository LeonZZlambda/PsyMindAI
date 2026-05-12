import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GamificationSystem, UserProgress, Achievement } from '../utils/gamification';

interface GamificationContextType {
  userProgress: UserProgress;
  updateProgress: (action: {
    type: 'question_answered' | 'correct_answer' | 'study_time' | 'topic_mastered' | 'trail_completed';
    value?: number;
  }) => void;
  getRecentAchievements: () => Achievement[];
  getLevelProgress: () => { current: number; total: number; percentage: number };
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

const STORAGE_KEY = 'psymind_gamification_progress';

const defaultProgress: UserProgress = {
  level: 1,
  xp: 0,
  xpToNext: 100,
  achievements: [],
  unlockedAchievements: [],
  stats: {
    totalQuestionsAnswered: 0,
    totalCorrectAnswers: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalStudyTime: 0,
    topicsMastered: 0,
    trailsCompleted: 0,
  },
  lastActivity: new Date(),
};

export function GamificationProvider({ children }: { children: ReactNode }) {
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Convert date strings back to Date objects
        if (parsed.lastActivity) {
          parsed.lastActivity = new Date(parsed.lastActivity);
        }
        if (parsed.achievements) {
          parsed.achievements = parsed.achievements.map((a: any) => ({
            ...a,
            unlockedAt: a.unlockedAt ? new Date(a.unlockedAt) : undefined
          }));
        }
        return { ...defaultProgress, ...parsed };
      }
    } catch (error) {
      console.error('Error loading gamification progress:', error);
    }
    return defaultProgress;
  });

  // Save to localStorage whenever progress changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userProgress));
    } catch (error) {
      console.error('Error saving gamification progress:', error);
    }
  }, [userProgress]);

  const updateProgress = (action: {
    type: 'question_answered' | 'correct_answer' | 'study_time' | 'topic_mastered' | 'trail_completed';
    value?: number;
  }) => {
    setUserProgress(prev => GamificationSystem.updateProgress(prev, action));
  };

  const getRecentAchievements = (): Achievement[] => {
    return userProgress.achievements
      .filter(a => a.unlockedAt)
      .sort((a, b) => (b.unlockedAt?.getTime() || 0) - (a.unlockedAt?.getTime() || 0))
      .slice(0, 5);
  };

  const getLevelProgress = () => {
    const currentLevelXP = (userProgress.level - 1) * GamificationSystem['XP_PER_LEVEL'];
    const progressInLevel = userProgress.xp - currentLevelXP;
    const totalForLevel = GamificationSystem['XP_PER_LEVEL'];
    const percentage = (progressInLevel / totalForLevel) * 100;

    return {
      current: progressInLevel,
      total: totalForLevel,
      percentage: Math.min(100, Math.max(0, percentage))
    };
  };

  return (
    <GamificationContext.Provider value={{
      userProgress,
      updateProgress,
      getRecentAchievements,
      getLevelProgress,
    }}>
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
}