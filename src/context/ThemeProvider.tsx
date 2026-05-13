import React, { useState, useEffect, ReactNode } from 'react';
import { ThemeContext, ThemeContextValue, ThemeMode, FontSize, ColorBlindMode } from './ThemeContext';

// Helper functions for settings management
const loadSetting = (key: string, defaultValue: string): string => {
  if (typeof window === 'undefined') return defaultValue;
  return localStorage.getItem(`psymind_${key}`) || defaultValue;
};

const loadBooleanSetting = (key: string): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(`psymind_${key}`) === 'true';
};

const saveSetting = (key: string, value: string | boolean): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`psymind_${key}`, String(value));
};

// Theme transition animation
const animateThemeTransition = async (
  e: React.MouseEvent<HTMLElement> | undefined,
  callback: () => void,
  reducedMotion: boolean
): Promise<void> => {
  if (reducedMotion) {
    callback();
    return;
  }

  const target = e?.currentTarget;
  if (target) {
    target.style.transform = 'scale(0.95)';
    target.style.transition = 'transform 0.1s ease-out';
    setTimeout(() => {
      target.style.transform = '';
    }, 100);
  }

  // Add transition class to body for smooth theme changes
  document.body.classList.add('theme-transitioning');
  callback();

  // Remove transition class after animation completes
  setTimeout(() => {
    document.body.classList.remove('theme-transitioning');
  }, 300);
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
  const [darkRoom, setDarkRoom] = useState<boolean>(() =>
    loadBooleanSetting('darkRoom')
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

  useEffect(() => {
    saveSetting('darkRoom', darkRoom);
    if (darkRoom) {
      document.documentElement.classList.add('dark-room-mode');
      // Lazy load dark room CSS only when active
      import('../styles/dark-room.css').catch(err => console.error('Failed to load dark-room styles', err));
    } else {
      document.documentElement.classList.remove('dark-room-mode');
    }
  }, [darkRoom]);

  // Lazy load accessibility CSS only when specialized features are active
  useEffect(() => {
    if (highContrast || dyslexicFont || colorBlindMode !== 'none' || fontSize !== 'normal') {
      import('../styles/accessibility.css').catch(err => console.error('Failed to load accessibility styles', err));
    }
  }, [highContrast, dyslexicFont, colorBlindMode, fontSize]);

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
    setKeyboardNavigation,
    darkRoom,
    setDarkRoom
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};