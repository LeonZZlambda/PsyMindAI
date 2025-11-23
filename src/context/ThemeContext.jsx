import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadSetting, saveSetting, loadBooleanSetting } from '../services/storage/settingsStorage';
import { animateThemeTransition } from '../utils/themeTransition';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState(() => loadSetting('themeMode', 'system'));

  const [systemIsDark, setSystemIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [fontSize, setFontSize] = useState(() => loadSetting('fontSize', 'normal'));
  const [reducedMotion, setReducedMotion] = useState(() => loadBooleanSetting('reducedMotion'));
  const [highContrast, setHighContrast] = useState(() => loadBooleanSetting('highContrast'));
  const [colorBlindMode, setColorBlindMode] = useState(() => loadSetting('colorBlindMode', 'none'));

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => setSystemIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => saveSetting('themeMode', themeMode), [themeMode]);
  useEffect(() => saveSetting('fontSize', fontSize), [fontSize]);
  useEffect(() => saveSetting('reducedMotion', reducedMotion), [reducedMotion]);
  useEffect(() => saveSetting('highContrast', highContrast), [highContrast]);
  useEffect(() => saveSetting('colorBlindMode', colorBlindMode), [colorBlindMode]);

  const isDarkMode = themeMode === 'system' ? systemIsDark : themeMode === 'dark';

  const toggleTheme = async (e) => {
    await animateThemeTransition(
      e,
      () => {
        setThemeMode(prev => {
          const currentIsDark = prev === 'system' ? systemIsDark : prev === 'dark';
          return currentIsDark ? 'light' : 'dark';
        });
      },
      reducedMotion
    );
  };

  const value = {
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
    colorBlindMode,
    setColorBlindMode
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
