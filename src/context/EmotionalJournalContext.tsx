import React, { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';

/**
 * Journal entry responses from emotional questionnaire
 */
export type JournalResponses = Record<string, string | number | boolean>;

/**
 * Emotional journal entry
 */
export interface JournalEntry {
  id: string;
  date: string;
  responses: JournalResponses;
}

/**
 * Emotional journal context value interface
 */
export interface EmotionalJournalContextValue {
  entries: JournalEntry[];
  addEntry: (responses: JournalResponses) => void;
  deleteEntry: (id: string) => void;
}

const EmotionalJournalContext = createContext<EmotionalJournalContextValue | undefined>(undefined);

export const useEmotionalJournal = (): EmotionalJournalContextValue => {
  const context = useContext(EmotionalJournalContext);
  if (!context) {
    throw new Error('useEmotionalJournal must be used within EmotionalJournalProvider');
  }
  return context;
};

export const EmotionalJournalProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('emotionalJournalEntries');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('emotionalJournalEntries', JSON.stringify(entries));
  }, [entries]);

  const addEntry = (responses: JournalResponses): void => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      responses
    };
    setEntries((prev) => [newEntry, ...prev]);
  };

  const deleteEntry = (id: string): void => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const value: EmotionalJournalContextValue = {
    entries,
    addEntry,
    deleteEntry
  };

  return (
    <EmotionalJournalContext.Provider value={value}>
      {children}
    </EmotionalJournalContext.Provider>
  );
};
