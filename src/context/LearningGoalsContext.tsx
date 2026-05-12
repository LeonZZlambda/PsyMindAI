import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LearningGoalsSystem, LearningGoal, GoalTemplate } from '../utils/learningGoals';

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

const LearningGoalsContext = createContext<LearningGoalsContextType | undefined>(undefined);

export function LearningGoalsProvider({ children }: { children: ReactNode }) {
  const [goals, setGoals] = useState<LearningGoal[]>(() => LearningGoalsSystem.loadGoals());
  const templates = LearningGoalsSystem.getTemplates();

  // Save goals whenever they change
  useEffect(() => {
    LearningGoalsSystem.saveGoals(goals);
  }, [goals]);

  const activeGoals = goals.filter(goal => goal.isActive);
  const completedGoals = goals.filter(goal => goal.completedAt);

  const createGoal = (template: GoalTemplate, customDeadline?: Date) => {
    const newGoal = LearningGoalsSystem.createGoal(template, customDeadline);
    setGoals(prev => [...prev, newGoal]);
  };

  const createCustomGoal = (
    title: string,
    description: string,
    target: LearningGoal['target'],
    deadline?: Date
  ) => {
    const newGoal = LearningGoalsSystem.createCustomGoal(title, description, target, deadline);
    setGoals(prev => [...prev, newGoal]);
  };

  const updateGoalProgress = (goalId: string, action: {
    type: 'question_answered' | 'correct_answer' | 'study_time' | 'topic_mastered' | 'trail_completed' | 'streak_updated';
    value?: number;
  }) => {
    setGoals(prev => prev.map(goal => {
      if (goalId === 'all' && goal.isActive) {
        return LearningGoalsSystem.updateGoalProgress(goal, action);
      } else if (goal.id === goalId) {
        return LearningGoalsSystem.updateGoalProgress(goal, action);
      }
      return goal;
    }));
  };

  const deleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
  };

  const getGoalProgress = (goalId: string): number => {
    const goal = goals.find(g => g.id === goalId);
    return goal ? LearningGoalsSystem.getGoalProgressPercentage(goal) : 0;
  };

  return (
    <LearningGoalsContext.Provider value={{
      goals,
      activeGoals,
      completedGoals,
      templates,
      createGoal,
      createCustomGoal,
      updateGoalProgress,
      deleteGoal,
      getGoalProgress,
    }}>
      {children}
    </LearningGoalsContext.Provider>
  );
}

export function useLearningGoals() {
  const context = useContext(LearningGoalsContext);
  if (context === undefined) {
    throw new Error('useLearningGoals must be used within a LearningGoalsProvider');
  }
  return context;
}