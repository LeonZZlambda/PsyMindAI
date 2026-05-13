import { useContext } from 'react';
import { GamificationContext } from '../../context/GamificationContext';

export function useGamification() {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
}
