import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Load from localStorage or default to 'system'
  const [themeMode, setThemeMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('themeMode') || 'system';
    }
    return 'system';
  });

  const [systemIsDark, setSystemIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Accessibility settings
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('fontSize') || 'normal');
  const [reducedMotion, setReducedMotion] = useState(() => localStorage.getItem('reducedMotion') === 'true');
  const [highContrast, setHighContrast] = useState(() => localStorage.getItem('highContrast') === 'true');
  const [colorBlindMode, setColorBlindMode] = useState(() => localStorage.getItem('colorBlindMode') || 'none');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => setSystemIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Persistence effects
  useEffect(() => localStorage.setItem('themeMode', themeMode), [themeMode]);
  useEffect(() => localStorage.setItem('fontSize', fontSize), [fontSize]);
  useEffect(() => localStorage.setItem('reducedMotion', reducedMotion), [reducedMotion]);
  useEffect(() => localStorage.setItem('highContrast', highContrast), [highContrast]);
  useEffect(() => localStorage.setItem('colorBlindMode', colorBlindMode), [colorBlindMode]);

  const isDarkMode = themeMode === 'system' ? systemIsDark : themeMode === 'dark';

  const toggleTheme = async (e) => {
    const isAppearanceTransition = document.startViewTransition && 
                                   !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
                                   !reducedMotion;

    if (!isAppearanceTransition) {
      setThemeMode(prev => {
        const currentIsDark = prev === 'system' ? systemIsDark : prev === 'dark';
        return currentIsDark ? 'light' : 'dark';
      });
      return;
    }

    const x = e?.clientX ?? window.innerWidth / 2;
    const y = e?.clientY ?? window.innerHeight / 2;

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      setThemeMode(prev => {
        const currentIsDark = prev === 'system' ? systemIsDark : prev === 'dark';
        return currentIsDark ? 'light' : 'dark';
      });
    });

    await transition.ready;

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 500,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
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
