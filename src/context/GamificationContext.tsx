import React, { createContext } from 'react';
import { UserProgress, Achievement } from '../utils/gamification';

interface GamificationContextType {
  userProgress: UserProgress;
  updateProgress: (action: {
    type: 'question_answered' | 'correct_answer' | 'study_time' | 'topic_mastered' | 'trail_completed';
    value?: number;
  }) => void;
  getRecentAchievements: () => Achievement[];
  getLevelProgress: () => { current: number; total: number; percentage: number };
}

export const GamificationContext = createContext<GamificationContextType | undefined>(undefined);