import { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
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
export type ColorBlindMode = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';

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
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => 
    (loadSetting('themeMode', 'system') as ThemeMode)
  );
  const [fontSize, setFontSize] = useState<FontSize>(() => 
    (loadSetting('fontSize', 'normal') as FontSize)
  );
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => 
    loadBooleanSetting('reducedMotion')
  );
  const [highContrast, setHighContrast] = useState<boolean>(() => 
    loadBooleanSetting('highContrast')
  );
  const [dyslexicFont, setDyslexicFont] = useState<boolean>(() => 
    loadBooleanSetting('dyslexicFont')
  );
  const [colorBlindMode, setColorBlindMode] = useState<ColorBlindMode>(() => 
    (loadSetting('colorBlindMode', 'none') as ColorBlindMode)
  );
  const [keyboardNavigation, setKeyboardNavigation] = useState<boolean>(() => 
    loadBooleanSetting('keyboardNavigation')
  );

  const [systemIsDark, setSystemIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent): void => setSystemIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    saveSetting('themeMode', themeMode);
  }, [themeMode]);

  useEffect(() => {
    saveSetting('fontSize', fontSize);
  }, [fontSize]);

  useEffect(() => {
    saveSetting('reducedMotion', reducedMotion);
  }, [reducedMotion]);

  useEffect(() => {
    saveSetting('highContrast', highContrast);
  }, [highContrast]);

  useEffect(() => {
    saveSetting('dyslexicFont', dyslexicFont);
  }, [dyslexicFont]);

  useEffect(() => {
    saveSetting('colorBlindMode', colorBlindMode);
  }, [colorBlindMode]);

  useEffect(() => {
    saveSetting('keyboardNavigation', keyboardNavigation);
  }, [keyboardNavigation]);

  const isDarkMode = themeMode === 'system' ? systemIsDark : themeMode === 'dark';
  const toggleTheme = async (e?: React.MouseEvent<HTMLElement>): Promise<void> => {
    await animateThemeTransition(
      e,
      () => {
        setThemeMode((prev) => {
          const currentIsDark = prev === 'system' ? systemIsDark : prev === 'dark';
          return currentIsDark ? 'light' : 'dark';
        });
      },
      reducedMotion
    );
  };

  const value: ThemeContextValue = {
    themeMode,
    setThemeMode,
    isDarkMode,
    toggleTheme,
    fontSize,
    setFontSize,
    reducedMotion,
    setReducedMotion,
    highContrast,
    setHighContrast,
    dyslexicFont,
    setDyslexicFont,
    colorBlindMode,
    setColorBlindMode,
    keyboardNavigation,
    setKeyboardNavigation
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
