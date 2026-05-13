import React, { useState, useEffect, ReactNode } from 'react';
import { EmotionalJournalContext, JournalEntry, JournalResponses, EmotionalJournalContextValue } from './EmotionalJournalContext';

export const EmotionalJournalProvider = ({ children }: { children: ReactNode }) => {
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