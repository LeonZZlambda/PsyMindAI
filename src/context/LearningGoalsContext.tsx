import React, { createContext } from 'react';
import { LearningGoal, GoalTemplate } from '../utils/learningGoals';

interface LearningGoalsContextType {
  goals: LearningGoal[];
  activeGoals: LearningGoal[];
  completedGoals: LearningGoal[];
  templates: GoalTemplate[];
  createGoal: (template: GoalTemplate, customDeadline?: Date) => void;
  createCustomGoal: (title: string, description: string, target: LearningGoal['target'], deadline?: Date) => void;
  updateGoalProgress: (goalId: string, action: {
    type: 'question_answered' | 'correct_answer' | 'study_time' | 'topic_mastered' | 'trail_completed' | 'streak_updated';
    value?: number;
  }) => void;
  deleteGoal: (goalId: string) => void;
  getGoalProgress: (goalId: string) => number;
}

export const LearningGoalsContext = createContext<LearningGoalsContextType | undefined>(undefined);