import { useContext } from 'react';
import { LearningGoalsContext } from '../../context/LearningGoalsContext';

export function useLearningGoals() {
  const context = useContext(LearningGoalsContext);
  if (context === undefined) {
    throw new Error('useLearningGoals must be used within a LearningGoalsProvider');
  }
  return context;
}
