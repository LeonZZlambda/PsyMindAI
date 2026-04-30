import logger from '../../utils/logger';

export interface IStorageAdapter {
  get(key: string): Promise<unknown>;
  set(key: string, value: unknown): Promise<boolean>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
}

export class StorageAdapter implements IStorageAdapter {
  private storage: Storage | null;

  constructor(storage: Storage | null = typeof window !== 'undefined' ? localStorage : null) {
    this.storage = storage;
  }

  async get(key: string): Promise<unknown> {
    if (!this.storage) return null;
    try {
      const value = this.storage.getItem(key);
      if (value === null) return null;
      try {
        return JSON.parse(value);
      } catch {
        return value; 
      }
    } catch (e) {
      logger.error('Storage get error for key ' + key + ':', e);
      return null;
    }
  }

  async set(key: string, value: unknown): Promise<boolean> {
    if (!this.storage) return false;
    try {
      this.storage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      logger.error('Storage set error for key ' + key + ':', e);
      return false;
    }
  }

  async remove(key: string): Promise<void> {
    if (!this.storage) return;
    this.storage.removeItem(key);
  }

  async clear(): Promise<void> {
    if (!this.storage) return;
    this.storage.clear();
  }
}

export const defaultStorage = new StorageAdapter();
