import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  Dispatch,
  SetStateAction,
  useRef,
  MutableRefObject
} from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from './ThemeContext';
import {
  sendMessage as sendMessageToGemini,
  isConfigured as isGeminiConfigured,
  generateTitle as generateChatTitle,
  type SendMessageResponse
} from '../services/chat/chatService';
import { loadChats, saveChats, createChat, updateChat } from '../services/storage/chatStorage';
import { createUserMessage, createAIMessage } from '../services/chat/messageFormatter';
import { TextStreamer } from '../utils/textStreaming';
import type { Chat, ChatMessage } from '@/types/storage';

/**
 * Chat context value interface
 */
export interface ChatContextValue {
  messages: ChatMessage[];
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
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
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export const useChat = (): ChatContextValue => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation();
  const { reducedMotion } = useTheme();
  const [chats, setChats] = useState<Chat[]>([]);
  const [chatsLoaded, setChatsLoaded] = useState(false);

  useEffect(() => {
    loadChats()
      .then((loaded) => {
        setChats(Array.isArray(loaded) ? loaded : []);
        setChatsLoaded(true);
      })
      .catch(() => {
        setChats([]);
        setChatsLoaded(true);
      });
  }, []);

  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const streamTimeoutRef = useRef<TextStreamer | null>(null);
  const delayedStartTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (chatsLoaded) {
      // Don't save anonymous chats to storage
      saveChats(chats.filter((c) => !c.isAnonymous));
    }
  }, [chats, chatsLoaded]);

  useEffect(() => {
    if (currentChatId) {
      const chat = chats.find((c) => c.id === currentChatId);
      if (chat) {
        setMessages(chat.messages);
      }
    }
  }, [currentChatId, chats]);

  const sendMessage = useCallback(
    async (text: string, files: (File | Blob)[] = []): Promise<void> => {
      if (!text.trim() && files.length === 0) return;

        // Normalize File/Blob inputs into FileAttachment shape expected by storage
        const fileAttachments = Array.isArray(files)
          ? files.map((f) => ({ name: (f as File).name || 'file', size: (f as File).size || 0, type: (f as File).type || 'application/octet-stream' }))
          : [];

        const userMessage = createUserMessage(text, fileAttachments);

      let chatId = currentChatId;
      if (!chatId) {
        // Use crypto.randomUUID when available in the browser, fallback to timestamp
        chatId = (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function')
          ? crypto.randomUUID()
          : Date.now().toString();
        const tempTitle = isAnonymous ? 'Modo Anônimo' : text.slice(0, 40) + (text.length > 40 ? '...' : '');
        const newChat = createChat(chatId as string, tempTitle, [userMessage]);
        if (isAnonymous) newChat.isAnonymous = true;

        setChats((prev) => [newChat, ...prev]);
        setCurrentChatId(chatId);

        if (!isAnonymous) {
          generateChatTitle(text).then((title) => {
            setChats((prev) =>
              prev.map((chat) => (chat.id === chatId ? updateChat(chat, { title }) : chat))
            );
          });
        }
      } else {
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === chatId
              ? updateChat(chat, { messages: [...chat.messages, userMessage] })
              : chat
          )
        );
      }

      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      setIsTyping(true);

      // Try Gemini API first, fallback to demo
      let fullResponse: string;

      if (isGeminiConfigured()) {
        const result = (await sendMessageToGemini(text, messages)) as SendMessageResponse;
        if (result.success) {
          fullResponse = result.text;
        } else {
          // For backend errors like RATE_LIMIT, UNKNOWN, etc., send a friendly message
          const backendErrors = [
            'RATE_LIMIT',
            'UNKNOWN',
            'SERVER_ERROR',
            'UNAVAILABLE',
            'NETWORK',
            'EMPTY_RESPONSE'
          ];
          if (backendErrors.includes(result.error as string)) {
            fullResponse = result.userMessage;
          } else {
            fullResponse = `${result.userMessage}\n\n${t('chat.errors.limited_continue')}`;
          }
        }
      } else {
        fullResponse = t('chat.errors.demo_mode');
      }

      setTimeout(() => {
        setIsTyping(false);

        const aiMessage = createAIMessage(fullResponse, false);

        if (reducedMotion) {
          setMessages((prev) => [...prev, aiMessage]);
          if (chatId) {
            setChats((prev) =>
              prev.map((chat) =>
                chat.id === chatId
                  ? updateChat(chat, { messages: [...chat.messages, aiMessage] })
                  : chat
              )
            );
          }
          return;
        }

        setMessages((prev) => [...prev, createAIMessage('', true)]);
        setIsStreaming(true);

        const streamer = new TextStreamer(
          fullResponse,
          (chunk: string) => {
            setMessages((prev) => {
              const newMessages = [...prev];
              const lastIndex = newMessages.length - 1;
              if (lastIndex >= 0 && newMessages[lastIndex].type === 'ai') {
                newMessages[lastIndex] = {
                  ...newMessages[lastIndex],
                  content: (newMessages[lastIndex].content || '') + chunk
                };
              }
              return newMessages;
            });
          },
          () => {
            setMessages((prev) => {
              const newMessages = [...prev];
              const lastIndex = newMessages.length - 1;
              if (lastIndex >= 0) {
                newMessages[lastIndex] = { ...newMessages[lastIndex], isStreaming: false };
              }
              return newMessages;
            });

            if (chatId) {
              setChats((prev) =>
                prev.map((chat) =>
                  chat.id === chatId
                    ? updateChat(chat, { messages: [...chat.messages, createAIMessage(fullResponse, false)] })
                    : chat
                )
              );
            }
            setIsStreaming(false);
            streamTimeoutRef.current = null;
          },
          reducedMotion
        );

        // Schedule start of streaming and keep the timeout id so we can cancel it
        delayedStartTimeoutRef.current = window.setTimeout(() => {
          delayedStartTimeoutRef.current = null;
          streamTimeoutRef.current = streamer;
          streamer.start();
        }, 800);
      }, 800);
    },
    [messages, reducedMotion, currentChatId, chats, isAnonymous, t]
  );

  const stopStreaming = useCallback((): void => {
    if (delayedStartTimeoutRef.current) {
      clearTimeout(delayedStartTimeoutRef.current);
      delayedStartTimeoutRef.current = null;
    }

    if (streamTimeoutRef.current) {
      try {
        streamTimeoutRef.current.stop();
      } catch (e) {
        // ignore
      }
      streamTimeoutRef.current = null;
    }
    setIsStreaming(false);
    setIsTyping(false);

    setMessages((prev) => {
      const newMessages = [...prev];
      const lastIndex = newMessages.length - 1;
      if (lastIndex >= 0 && newMessages[lastIndex].type === 'ai') {
        newMessages[lastIndex] = { ...newMessages[lastIndex], isStreaming: false };
      }
      return newMessages;
    });
  }, []);

  const startAnonymousChat = useCallback((): void => {
    setMessages([]);
    setCurrentChatId(null);
    setIsAnonymous(true);
    setInput('');
  }, []);

  const clearHistory = useCallback((): void => {
    setIsAnonymous(false);
    setMessages([]);
    setCurrentChatId(null);
  }, []);

  const loadChat = useCallback(
    (chatId: string): void => {
      setCurrentChatId(chatId);
      setIsAnonymous(false);
      const chat = chats.find((c) => c.id === chatId);
      if (chat) {
        setMessages(chat.messages);
      }
    },
    [chats]
  );

  const deleteChat = useCallback(
    (chatId: string): void => {
      setChats((prev) => prev.filter((c) => c.id !== chatId));
      if (currentChatId === chatId) {
        setMessages([]);
        setCurrentChatId(null);
      }
    },
    [currentChatId]
  );

  const value: ChatContextValue = {
    messages,
    input,
    setInput,
    isTyping,
    isLoading,
    sendMessage,
    clearHistory,
    loadChat,
    chats: chats.filter((c) => !c.isAnonymous), // never show anonymous chats in history
    currentChatId,
    deleteChat,
    isStreaming,
    stopStreaming,
    isAnonymous,
    startAnonymousChat
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
