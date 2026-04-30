import { useState, useEffect, useCallback } from 'react';
import logger from '../utils/logger';

/**
 * Storage keys centralizados para evitar duplication e erros
 */
export const STORAGE_KEYS = {
  CHATS: 'psymind_chats',
  ANONYMOUS_MODE: 'psymind_anonymous_mode',
  MOOD_HISTORY: 'psymind_mood_history',
  THEME: 'psymind_theme',
  THEME_PREFERENCE: 'psymind_theme_preference',
  FONT_SIZE: 'psymind_font_size',
  LANGUAGE: 'psymind_language',
  REDUCED_MOTION: 'psymind_reduced_motion',
  HIGH_CONTRAST: 'psymind_high_contrast',
  DYSLEXIC_FONT: 'psymind_dyslexic_font',
  COLORBLIND_MODE: 'psymind_colorblind_mode',
  POMODORO_STATS: 'psymind_pomodoro_stats',
  EMOTIONAL_JOURNAL: 'psymind_emotional_journal',
  TELEMETRY_OPTED_IN: 'psymind_telemetry_opted_in',
  API_KEY: 'psymind_api_key',
} as const;

/**
 * Custom hook para gerenciar localStorage com estado React
 * 
 * @param {string} key - Chave do storage (use STORAGE_KEYS)
 * @param {T} initialValue - Valor inicial se não existir no storage
 * @returns {[T, (value: T | ((prev: T) => T)) => void]} - [value, setValue]
 */
export const useStorageKey = <T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] => {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch (error) {
      logger.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setStorageValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      try {
        const valueToStore =
          newValue instanceof Function ? newValue(value) : newValue;
        setValue(valueToStore);
        if (typeof window !== 'undefined') {
          localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        logger.warn(`Error writing localStorage key "${key}":`, error);
      }
    },
    [key, value]
  );

  return [value, setStorageValue];
};
