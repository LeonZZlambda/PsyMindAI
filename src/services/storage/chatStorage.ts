import { defaultStorage } from '../adapters/storageAdapter';
import type { Chat, ChatMessage, CreateChatInput, UpdateChatInput, StorageAdapter } from '@/types/storage';

const STORAGE_KEY = 'chatHistory';

/**
 * Load all chats from storage
 * Returns empty array if running in non-browser environment
 */
export async function loadChats(storage: StorageAdapter = defaultStorage): Promise<Chat[]> {
  if (typeof window === 'undefined') return [];
  const chats = await storage.get(STORAGE_KEY);
  return Array.isArray(chats) ? chats : [];
}

/**
 * Save chats to storage
 * No-op if running in non-browser environment
 */
export async function saveChats(
  chats: Chat[],
  storage: StorageAdapter = defaultStorage
): Promise<void> {
  if (typeof window === 'undefined') return;
  await storage.set(STORAGE_KEY, chats);
}

/**
 * Create a new chat object
 */
export function createChat(
  id: string,
  title: string,
  messages: ChatMessage[]
): Chat {
  const now = new Date().toISOString();
  return {
    id,
    title,
    messages,
    createdAt: now,
    updatedAt: now
  };
}

/**
 * Update an existing chat object
 * Preserves original properties and updates only specified fields
 * Automatically updates the updatedAt timestamp
 */
export function updateChat(chat: Chat, updates: UpdateChatInput): Chat {
  return {
    ...chat,
    ...updates,
    updatedAt: new Date().toISOString()
  };
}
