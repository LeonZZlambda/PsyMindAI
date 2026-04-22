export class StorageAdapter {
  constructor(storage = localStorage) {
    this.storage = storage;
  }

  async get(key) {
    try {
      const value = this.storage.getItem(key);
      if (value === null) return null;
      try {
        return JSON.parse(value);
      } catch {
        return value; // raw string fallback for legacy values
      }
    } catch (e) {
      console.error('Storage get error for key ' + key + ':', e);
      return null;
    }
  }

  async set(key, value) {
    try {
      this.storage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Storage set error for key ' + key + ':', e);
      return false;
    }
  }

  async remove(key) {
    this.storage.removeItem(key);
  }

  async clear() {
    this.storage.clear();
  }
}

export const defaultStorage = new StorageAdapter();
