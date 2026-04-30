import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

/**
 * List of all available modals in the application
 */
export type ModalName =
  | 'settings'
  | 'help'
  | 'support'
  | 'account'
  | 'moodTracker'
  | 'emotionalJournal'
  | 'pomodoro'
  | 'kindness'
  | 'exams'
  | 'guidedLearning'
  | 'reflections'
  | 'soundscapes'
  | 'studyStats'
  | 'importContext';

/**
 * Modal state: mapping of modal names to open/closed status
 */
export type ModalState = Record<ModalName, boolean>;

/**
 * Modal context value interface
 */
export interface ModalContextValue {
  openModals: ModalState;
  toggleModal: (modalName: ModalName) => void;
  openModal: (modalName: ModalName) => void;
  closeModal: (modalName: ModalName) => void;
  closeAllModals: () => void;
}

/**
 * ModalContext - Centralizes all modal state for the application
 * 
 * Replaces the need for 10+ useState calls scattered throughout App.jsx
 * Example:
 *   const { openModals, toggleModal, openModal, closeModal } = useModal();
 *   <SettingsModal isOpen={openModals.settings} onClose={() => closeModal('settings')} />
 */
const ModalContext = createContext<ModalContextValue>({
  openModals: {} as ModalState,
  toggleModal: () => {},
  openModal: () => {},
  closeModal: () => {},
  closeAllModals: () => {},
});

/**
 * ModalProvider - Wrap your app with this in main.jsx
 * 
 * <ModalProvider>
 *   <App />
 * </ModalProvider>
 */
export const ModalProvider = ({ children }: { children: ReactNode }) => {
  // Centralized state of all modals
  const [openModals, setOpenModals] = useState<ModalState>({
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
    soundscapes: false,
    studyStats: false,
    importContext: false,
  });

  /**
   * Toggle a modal (open/close)
   */
  const toggleModal = useCallback((modalName: ModalName): void => {
    setOpenModals((prev) => ({
      ...prev,
      [modalName]: !prev[modalName],
    }));
  }, []);

  /**
   * Open a specific modal
   */
  const openModal = useCallback((modalName: ModalName): void => {
    setOpenModals((prev) => ({
      ...prev,
      [modalName]: true,
    }));
  }, []);

  /**
   * Close a specific modal
   */
  const closeModal = useCallback((modalName: ModalName): void => {
    setOpenModals((prev) => ({
      ...prev,
      [modalName]: false,
    }));
  }, []);

  /**
   * Close all modals (useful for logout, etc)
   */
  const closeAllModals = useCallback((): void => {
    setOpenModals((prev) => {
      const allClosed: ModalState = {} as ModalState;
      Object.keys(prev).forEach((key) => {
        allClosed[key as ModalName] = false;
      });
      return allClosed;
    });
  }, []);

  const value: ModalContextValue = {
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
 * Hook to use ModalContext
 * 
 * const { openModals, toggleModal, openModal, closeModal } = useModal();
 */
export const useModal = (): ModalContextValue => {
  const context = useContext(ModalContext);
  
  if (!context) {
    throw new Error(
      'useModal must be called within a <ModalProvider>. ' +
      'Make sure <ModalProvider> is wrapping your <App /> in main.jsx'
    );
  }
  
  return context;
};
