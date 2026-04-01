export class StorageAdapter {
  constructor(storage = localStorage) {
    this.storage = storage;
  }

  async get(key) {
    try {
      const value = this.storage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  }

  async set(key, value) {
    try {
      this.storage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
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
