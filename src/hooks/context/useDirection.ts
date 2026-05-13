import { useContext } from 'react';
import { DirectionContext } from '../../context/types/DirectionContext';

export const useDirection = () => {
  const context = useContext(DirectionContext);
  if (context === undefined) {
    throw new Error('useDirection must be used within a DirectionProvider');
  }
  return context;
};
