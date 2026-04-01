import { defaultStorage } from '../adapters/storageAdapter';

export async function loadSetting(key, defaultValue, storage = defaultStorage) {
  if (typeof window === 'undefined') return defaultValue;
  const value = await storage.get(key);
  return value ?? defaultValue;
}

export async function saveSetting(key, value, storage = defaultStorage) {
  if (typeof window === 'undefined') return;
  await storage.set(key, value);
}

export async function loadBooleanSetting(key, defaultValue = false, storage = defaultStorage) {
  if (typeof window === 'undefined') return defaultValue;
  const value = await storage.get(key);
  if (value === null || value === undefined) return defaultValue;
  return value === true || value === 'true';
}
