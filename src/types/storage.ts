/**
 * Message role in a conversation
 */
export type MessageRole = 'user' | 'ai';

/**
 * File attachment in a chat message
 */
export interface FileAttachment {
  name: string;
  size: number;
  type: string;
  data?: string;
}

/**
 * Single message in a chat
 */
export interface ChatMessage {
  type: MessageRole;
  content: string;
  files?: FileAttachment[];
  isStreaming?: boolean;
}

/**
 * Chat session
 */
export interface Chat {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string; // ISO 8601 date
  updatedAt: string; // ISO 8601 date
  isAnonymous?: boolean;
}

/**
 * Chat creation input
 */
export interface CreateChatInput {
  id: string;
  title: string;
  messages: ChatMessage[];
}

/**
 * Chat update input
 */
export interface UpdateChatInput {
  title?: string;
  messages?: ChatMessage[];
}

/**
 * Storage adapter interface
 */
export interface StorageAdapter {
  get(key: string): Promise<unknown>;
  set(key: string, value: unknown): Promise<boolean>;
}
