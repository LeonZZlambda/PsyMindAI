import React, { createContext, useContext, useState, useEffect } from 'react';

const MoodContext = createContext();

export const useMood = () => useContext(MoodContext);

export const MoodProvider = ({ children }) => {
  const [moodHistory, setMoodHistory] = useState(() => {
    const saved = localStorage.getItem('psymind_mood_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('psymind_mood_history', JSON.stringify(moodHistory));
  }, [moodHistory]);

  const addMoodEntry = (mood, note) => {
    const newEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      mood, // { label, icon, color, value }
      note
    };
    setMoodHistory(prev => [newEntry, ...prev]);
  };

  const deleteMoodEntry = (id) => {
    setMoodHistory(prev => prev.filter(entry => entry.id !== id));
  };

  const getMoodStats = () => {
    if (moodHistory.length === 0) return null;
    
    // Simple stats logic can be expanded later
    const total = moodHistory.length;
    const moodCounts = moodHistory.reduce((acc, entry) => {
      const label = entry.mood.label;
      acc[label] = (acc[label] || 0) + 1;
      return acc;
    }, {});

    return { total, moodCounts };
  };

  return (
    <MoodContext.Provider value={{ 
      moodHistory, 
      addMoodEntry, 
      deleteMoodEntry,
      getMoodStats
    }}>
      {children}
    </MoodContext.Provider>
  );
};
