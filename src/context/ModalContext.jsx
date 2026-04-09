import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * ModalContext - Centraliza todo o estado de modais da aplicação
 * 
 * Substitui a necessidade de ter 10+ useState descentralizados em App.jsx
 * Exemplo:
 *   const { openModals, toggleModal, openModal, closeModal } = useModal();
 *   <SettingsModal isOpen={openModals.settings} onClose={() => closeModal('settings')} />
 */

const ModalContext = createContext({
  openModals: {},
  toggleModal: () => {},
  openModal: () => {},
  closeModal: () => {},
});

/**
 * ModalProvider - Wrap sua app com isso em main.jsx
 * 
 * <ModalProvider>
 *   <App />
 * </ModalProvider>
 */
export const ModalProvider = ({ children }) => {
  // Estado centralizado de todos os modais
  const [openModals, setOpenModals] = useState({
    settings: false,
    help: false,
    support: false,
    account: false,
    moodTracker: false,
    emotionalJournal: false,
    pomodoro: false,
    kindness: false,
    exams: false,
    guidedLearning: false,
    reflections: false,
    judge: false,
    quiz: false,
    soundscapes: false,
    studyStats: false,
    importContext: false,
  });

  /**
   * Alterna um modal (open/close)
   */
  const toggleModal = useCallback((modalName) => {
    setOpenModals((prev) => ({
      ...prev,
      [modalName]: !prev[modalName],
    }));
  }, []);

  /**
   * Abre um modal específico
   */
  const openModal = useCallback((modalName) => {
    setOpenModals((prev) => ({
      ...prev,
      [modalName]: true,
    }));
  }, []);

  /**
   * Fecha um modal específico
   */
  const closeModal = useCallback((modalName) => {
    setOpenModals((prev) => ({
      ...prev,
      [modalName]: false,
    }));
  }, []);

  /**
   * Fecha todos os modais (útil para logout, etc)
   */
  const closeAllModals = useCallback(() => {
    setOpenModals((prev) => {
      const allClosed = {};
      Object.keys(prev).forEach((key) => {
        allClosed[key] = false;
      });
      return allClosed;
    });
  }, []);

  const value = {
    openModals,
    toggleModal,
    openModal,
    closeModal,
    closeAllModals,
  };

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};

/**
 * Hook para usar ModalContext
 * 
 * const { openModals, toggleModal, openModal, closeModal } = useModal();
 */
export const useModal = () => {
  const context = useContext(ModalContext);
  
  if (!context) {
    throw new Error(
      'useModal deve ser chamado dentro de um <ModalProvider>. ' +
      'Certifique-se de que <ModalProvider> está envolvendo seu <App /> em main.jsx'
    );
  }
  
  return context;
};
