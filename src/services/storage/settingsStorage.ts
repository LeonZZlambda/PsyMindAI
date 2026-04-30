import { defaultStorage } from '../adapters/storageAdapter';
import type { StorageAdapter } from '@/types/storage';

export function loadSetting<T>(key: string, defaultValue: T, _storage: StorageAdapter = defaultStorage): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return defaultValue;
    try { 
      return JSON.parse(raw) as T; 
    } catch { 
      return raw as unknown as T; 
    }
  } catch {
    return defaultValue;
  }
}

export function saveSetting<T>(key: string, value: T, _storage: StorageAdapter = defaultStorage): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadBooleanSetting(key: string, defaultValue = false, _storage: StorageAdapter = defaultStorage): boolean {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return defaultValue;
    try { 
      const parsed = JSON.parse(raw);
      return typeof parsed === 'boolean' ? parsed : raw === 'true';
    } catch { 
      return raw === 'true'; 
    }
  } catch {
    return defaultValue;
  }
}
