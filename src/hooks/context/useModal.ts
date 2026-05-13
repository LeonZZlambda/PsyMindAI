import { useContext } from 'react';
import { ModalContext } from '../../context/ModalContext';

/**
 * Hook to use ModalContext
 * 
 * const { openModals, toggleModal, openModal, closeModal } = useModal();
 */
export const useModal = () => {
  const context = useContext(ModalContext);
  
  if (!context) {
    throw new Error(
      'useModal must be called within a <ModalProvider>. ' +
      'Make sure <ModalProvider> is wrapping your <App /> in main.jsx'
    );
  }
  
  return context;
};
