import React, { createContext } from 'react';

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

export const EmotionalJournalContext = createContext<EmotionalJournalContextValue | undefined>(undefined);
