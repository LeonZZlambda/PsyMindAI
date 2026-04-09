import { useState, useCallback } from 'react';

/**
 * Custom hook para gerenciar animação de fechamento de modal
 * Reutiliza lógica de close com delay de 300ms
 * 
 * @param {Function} onClose - Callback chamado após animação
 * @returns {[boolean, Function]} - [isClosing, handleClose]
 */
export const useModalAnimation = (onClose) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose?.();
    }, 300); // Tempo de animação CSS
  }, [onClose]);

  return [isClosing, handleClose];
};
