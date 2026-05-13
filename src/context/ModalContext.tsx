import React, { createContext } from 'react';

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
  | 'vocational'
  | 'guidedLearning'
  | 'reflections'
  | 'soundscapes'
  | 'studyStats'
  | 'importContext'
  | 'weeklySchedule';

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
export const ModalContext = createContext<ModalContextValue>({
  openModals: {} as ModalState,
  toggleModal: () => {},
  openModal: () => {},
  closeModal: () => {},
  closeAllModals: () => {},
});
