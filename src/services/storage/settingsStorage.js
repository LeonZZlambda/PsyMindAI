import { defaultStorage } from '../adapters/storageAdapter';

export function loadSetting(key, defaultValue, storage = defaultStorage) {
  if (typeof window === 'undefined') return defaultValue;
  const value = storage.storage.getItem(key);
  return value || defaultValue;
}

export function saveSetting(key, value, storage = defaultStorage) {
  if (typeof window === 'undefined') return;
  storage.storage.setItem(key, value);
}

export function loadBooleanSetting(key, defaultValue = false, storage = defaultStorage) {
  if (typeof window === 'undefined') return defaultValue;
  const value = storage.storage.getItem(key);
  return value === 'true';
}
