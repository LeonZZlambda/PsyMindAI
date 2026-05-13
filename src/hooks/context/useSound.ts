import { useContext } from 'react';
import { SoundContext } from '../../context/SoundContext';

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};
