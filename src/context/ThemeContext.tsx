import { createContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import { loadSetting, saveSetting, loadBooleanSetting } from '../services/storage/settingsStorage';
import { animateThemeTransition } from '../utils/themeTransition';

/**
 * Theme mode options
 */
export type ThemeMode = 'system' | 'light' | 'dark';

/**
 * Font size options
 */
export type FontSize = 'small' | 'normal' | 'large';

/**
 * Color blindness simulation modes
 */
export type ColorBlindMode = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';

/**
 * Theme context value interface
 */
export interface ThemeContextValue {
  // Theme mode
  themeMode: ThemeMode;
  setThemeMode: Dispatch<SetStateAction<ThemeMode>>;
  isDarkMode: boolean;
  toggleTheme: (e?: React.MouseEvent<HTMLElement>) => Promise<void>;

  // Accessibility: Font
  fontSize: FontSize;
  setFontSize: Dispatch<SetStateAction<FontSize>>;

  // Accessibility: Motion
  reducedMotion: boolean;
  setReducedMotion: Dispatch<SetStateAction<boolean>>;

  // Accessibility: Contrast
  highContrast: boolean;
  setHighContrast: Dispatch<SetStateAction<boolean>>;

  // Accessibility: Dyslexia support
  dyslexicFont: boolean;
  setDyslexicFont: Dispatch<SetStateAction<boolean>>;

  // Accessibility: Color blindness
  colorBlindMode: ColorBlindMode;
  setColorBlindMode: Dispatch<SetStateAction<ColorBlindMode>>;

  // Accessibility: Keyboard navigation focus indicators
  keyboardNavigation: boolean;
  setKeyboardNavigation: Dispatch<SetStateAction<boolean>>;

  // Accessibility: Dark Room (Zero Blue Light)
  darkRoom: boolean;
  setDarkRoom: Dispatch<SetStateAction<boolean>>;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
