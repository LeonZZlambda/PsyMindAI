import React, { useState, useCallback, ReactNode } from 'react';
import { ModalContext, ModalName, ModalState, ModalContextValue } from './ModalContext';

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
    vocational: false,
    guidedLearning: false,
    reflections: false,
    soundscapes: false,
    studyStats: false,
    importContext: false,
    weeklySchedule: false,
    externalLink: false,
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