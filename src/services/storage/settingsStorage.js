import { defaultStorage } from '../adapters/storageAdapter';

export function loadSetting(key, defaultValue, storage = defaultStorage) {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return defaultValue;
    try { return JSON.parse(raw); } catch { return raw; }
  } catch {
    return defaultValue;
  }
}

export function saveSetting(key, value, storage = defaultStorage) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadBooleanSetting(key, defaultValue = false, storage = defaultStorage) {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return defaultValue;
    try { return JSON.parse(raw); } catch { return raw === 'true'; }
  } catch {
    return defaultValue;
  }
}
