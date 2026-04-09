import { useEffect } from 'react';

/**
 * Custom hook para fechar modal pressionando ESC
 * 
 * @param {Function} callback - Função chamada quando ESC é pressionado
 * @param {boolean} isActive - Se o hook está ativo (default: true)
 */
export const useEscapeKey = (callback, isActive = true) => {
  useEffect(() => {
    if (!isActive || !callback) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        callback();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [callback, isActive]);
};
