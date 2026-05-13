import { createContext } from 'react';

export interface DirectionContextType {
  isRTL: boolean;
  direction: 'rtl' | 'ltr';
}

export const DirectionContext = createContext<DirectionContextType | undefined>(undefined);
