import { defaultStorage } from '../adapters/storageAdapter';

const STORAGE_KEY = 'chatHistory';

export function loadChats(storage = defaultStorage) {
  if (typeof window === 'undefined') return [];
  return storage.get(STORAGE_KEY) || [];
}

export function saveChats(chats, storage = defaultStorage) {
  if (typeof window === 'undefined') return;
  storage.set(STORAGE_KEY, chats);
}

export function createChat(id, title, messages) {
  return {
    id,
    title,
    messages,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export function updateChat(chat, updates) {
  return {
    ...chat,
    ...updates,
    updatedAt: new Date().toISOString()
  };
}
