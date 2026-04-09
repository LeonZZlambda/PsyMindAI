import { useMemo } from 'react';

/**
 * Custom hook para detectar plataforma (Mac vs Windows/Linux)
 * Usado para mostrar atalhos de teclado corretos (⌘ vs Ctrl)
 * 
 * @returns {{isMac: boolean, cmdKey: string, shiftKey: string, ctrlKey: string}}
 */
export const usePlatform = () => {
  return useMemo(() => {
    const platform = typeof navigator !== 'undefined' ? navigator.platform : '';
    const isMac = /Mac|iPhone|iPad|iPod/.test(platform);

    return {
      isMac,
      cmdKey: isMac ? '⌘' : 'Ctrl',
      shiftKey: isMac ? '⇧' : 'Shift',
      ctrlKey: isMac ? '⌘' : 'Ctrl',
    };
  }, []);
};
