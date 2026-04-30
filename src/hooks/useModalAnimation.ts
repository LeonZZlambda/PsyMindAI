import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Custom hook para gerenciar animação de fechamento de modal
 * Reutiliza lógica de close com delay de 300ms
 * 
 * @param {Function} onClose - Callback chamado após animação
 * @returns {[boolean, Function]} - [isClosing, handleClose]
 */
export const useModalAnimation = (onClose: () => void): [boolean, () => void] => {
  const [isClosing, setIsClosing] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsClosing(false);
      onClose?.();
    }, 300); // Tempo de animação CSS
  }, [onClose]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return [isClosing, handleClose];
};
