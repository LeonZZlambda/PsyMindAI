import React, { createContext } from 'react';

/**
 * Available soundscape types
 */
export type SoundType =
  | 'rain'
  | 'forest'
  | 'ocean'
  | 'fire'
  | 'thunder'
  | 'coffee'
  | 'cave'
  | 'white'
  | 'brown'
  | 'focus'
  | 'binaural';

/**
 * Sound context value interface
 */
export interface SoundContextValue {
  isPlaying: boolean;
  currentSound: SoundType;
  volume: number;
  toggleSound: () => void;
  changeSound: (newSound: SoundType) => void;
  setVolume: (volume: number) => void;
}

export const SoundContext = createContext<SoundContextValue | undefined>(undefined);

export const FADE_OUT_DURATION = 1.5; // seconds