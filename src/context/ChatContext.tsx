import React, { createContext } from 'react';
import type { Chat, ChatMessage } from '@/types/storage';

/**
 * Chat context value interface
 */
export interface ChatContextValue {
  messages: ChatMessage[];
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  isTyping: boolean;
  isLoading: boolean;
  sendMessage: (text: string, files?: (File | Blob)[]) => Promise<void>;
  clearHistory: () => void;
  loadChat: (chatId: string) => void;
  chats: Chat[];
  currentChatId: string | null;
  deleteChat: (chatId: string) => void;
  isStreaming: boolean;
  stopStreaming: () => void;
  isAnonymous: boolean;
  startAnonymousChat: () => void;
  visibleCounts: Record<string, number>;
  loadMoreMessages: (chatId: string) => void;
}

export const ChatContext = createContext<ChatContextValue | undefined>(undefined);
