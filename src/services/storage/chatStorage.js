import { defaultStorage } from '../adapters/storageAdapter';

const STORAGE_KEY = 'chatHistory';

export async function loadChats(storage = defaultStorage) {
  if (typeof window === 'undefined') return [];
  return (await storage.get(STORAGE_KEY)) || [];
}

export async function saveChats(chats, storage = defaultStorage) {
  if (typeof window === 'undefined') return;
  await storage.set(STORAGE_KEY, chats);
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
