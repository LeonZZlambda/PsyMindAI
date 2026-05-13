import { useContext } from 'react';
import { EmotionalJournalContext } from '../../context/EmotionalJournalContext';

export const useEmotionalJournal = () => {
  const context = useContext(EmotionalJournalContext);
  if (!context) {
    throw new Error('useEmotionalJournal must be used within EmotionalJournalProvider');
  }
  return context;
};
