import React, { createContext, useContext, useState, useEffect } from 'react';

const EmotionalJournalContext = createContext();

export const useEmotionalJournal = () => {
  const context = useContext(EmotionalJournalContext);
  if (!context) {
    throw new Error('useEmotionalJournal must be used within EmotionalJournalProvider');
  }
  return context;
};

export const EmotionalJournalProvider = ({ children }) => {
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem('emotionalJournalEntries');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('emotionalJournalEntries', JSON.stringify(entries));
  }, [entries]);

  const addEntry = (responses) => {
    const newEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      responses
    };
    setEntries(prev => [newEntry, ...prev]);
  };

  const deleteEntry = (id) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  return (
    <EmotionalJournalContext.Provider value={{ entries, addEntry, deleteEntry }}>
      {children}
    </EmotionalJournalContext.Provider>
  );
};
