import { useContext } from 'react';
import { MoodContext } from '../../context/MoodContext';

export const useMood = () => {
  const context = useContext(MoodContext);
  if (!context) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
};
