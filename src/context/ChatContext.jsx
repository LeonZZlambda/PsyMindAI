import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useTheme } from './ThemeContext';
import { sendMessage as sendMessageToGemini, isConfigured as isGeminiConfigured, generateTitle as generateChatTitle } from '../services/chat/chatService';
import { loadChats, saveChats, createChat, updateChat } from '../services/storage/chatStorage';
import { createUserMessage, createAIMessage } from '../services/chat/messageFormatter';
import { TextStreamer } from '../utils/textStreaming';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { reducedMotion } = useTheme();
  const [chats, setChats] = useState([]);
  const [chatsLoaded, setChatsLoaded] = useState(false);

  useEffect(() => {
    loadChats().then(loaded => {
      setChats(Array.isArray(loaded) ? loaded : []);
      setChatsLoaded(true);
    }).catch(() => {
      setChats([]);
      setChatsLoaded(true);
    });
  }, []);
  
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const streamTimeoutRef = React.useRef(null);

  useEffect(() => {
    if (chatsLoaded) {
      // Don't save anonymous chats to storage
      saveChats(chats.filter(c => !c.isAnonymous));
    }
  }, [chats, chatsLoaded]);

  useEffect(() => {
    if (currentChatId) {
      const chat = chats.find(c => c.id === currentChatId);
      if (chat) {
        setMessages(chat.messages);
      }
    }
  }, [currentChatId, chats]);



  const sendMessage = useCallback(async (text, files = []) => {
    if (!text.trim() && files.length === 0) return;

    const userMessage = createUserMessage(text, files);
    
    let chatId = currentChatId;
    if (!chatId) {
      chatId = Date.now().toString();
      const tempTitle = isAnonymous ? 'Modo Anônimo' : text.slice(0, 40) + (text.length > 40 ? '...' : '');
      const newChat = createChat(chatId, tempTitle, [userMessage]);
      if (isAnonymous) newChat.isAnonymous = true;
      
      setChats(prev => [newChat, ...prev]);
      setCurrentChatId(chatId);
      
      if (!isAnonymous) {
        generateChatTitle(text).then(title => {
          setChats(prev => prev.map(chat => 
            chat.id === chatId ? updateChat(chat, { title }) : chat
          ));
        });
      }
    } else {
      setChats(prev => prev.map(chat => 
        chat.id === chatId 
          ? updateChat(chat, { messages: [...chat.messages, userMessage] })
          : chat
      ));
    }
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Try Gemini API first, fallback to demo
    let fullResponse;
    
    if (isGeminiConfigured()) {
      const result = await sendMessageToGemini(text, messages);
      if (result.success) {
        fullResponse = result.text;
      } else {
        // Para erros técnicos como RATE_LIMIT, UNKNOWN, conexões e servidor, envia uma mensagem simpática e direta
        const backendErrors = ['RATE_LIMIT', 'UNKNOWN', 'SERVER_ERROR', 'UNAVAILABLE'];
        if (backendErrors.includes(result.error)) {
           fullResponse = result.userMessage;
        } else {
           fullResponse = `${result.userMessage}\n\n💬 Você pode continuar conversando, mas as respostas serão limitadas até resolver o problema.`;
        }
      }
    } else {
      fullResponse = '🤖 **Modo Demonstração** - Configure sua API Key do Gemini no arquivo .env\n\nOlá! Sou o PsyMind.AI, desenvolvido com **Google Gemini**. Estou aqui para te ajudar a compreender suas emoções e comportamentos através da psicologia científica.\n\nComo posso te apoiar hoje? 💜';
    }
    
    setTimeout(() => {
      setIsTyping(false);
      
      const aiMessage = createAIMessage(fullResponse, false);
      
      if (reducedMotion) {
        setMessages(prev => [...prev, aiMessage]);
        if (chatId) {
          setChats(prev => prev.map(chat => 
            chat.id === chatId 
              ? updateChat(chat, { messages: [...chat.messages, aiMessage] })
              : chat
          ));
        }
        return;
      }

      setMessages(prev => [...prev, createAIMessage('', true)]);
      setIsStreaming(true);

      const streamer = new TextStreamer(
        fullResponse,
        (chunk) => {
          setMessages(prev => {
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
          setMessages(prev => {
            const newMessages = [...prev];
            const lastIndex = newMessages.length - 1;
            if (lastIndex >= 0) {
              newMessages[lastIndex] = { ...newMessages[lastIndex], isStreaming: false };
            }
            return newMessages;
          });
          
          if (chatId) {
            setChats(prev => prev.map(chat => 
              chat.id === chatId 
                ? updateChat(chat, { messages: [...chat.messages, createAIMessage(fullResponse, false)] })
                : chat
            ));
          }
          setIsStreaming(false);
          streamTimeoutRef.current = null;
        },
        reducedMotion
      );

      streamTimeoutRef.current = streamer;
      streamer.start();
    }, 800);
  }, [messages, reducedMotion, currentChatId, chats, isAnonymous]);

  const stopStreaming = useCallback(() => {
    if (streamTimeoutRef.current) {
      if (typeof streamTimeoutRef.current.stop === 'function') {
        streamTimeoutRef.current.stop();
      } else {
        clearTimeout(streamTimeoutRef.current);
      }
      streamTimeoutRef.current = null;
    }
    setIsStreaming(false);
    setIsTyping(false);
    
    setMessages(prev => {
      const newMessages = [...prev];
      const lastIndex = newMessages.length - 1;
      if (lastIndex >= 0 && newMessages[lastIndex].type === 'ai') {
        newMessages[lastIndex] = { ...newMessages[lastIndex], isStreaming: false };
      }
      return newMessages;
    });
  }, []);

  const startAnonymousChat = useCallback(() => {
    setMessages([]);
    setCurrentChatId(null);
    setIsAnonymous(true);
    setInput('');
  }, []);

  const clearHistory = useCallback(() => {
    setIsAnonymous(false);
    setMessages([]);
    setCurrentChatId(null);
  }, []);

  const loadChat = useCallback((chatId) => {
    setCurrentChatId(chatId);
    setIsAnonymous(false);
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setMessages(chat.messages);
    }
  }, [chats]);

  const deleteChat = useCallback((chatId) => {
    setChats(prev => prev.filter(c => c.id !== chatId));
    if (currentChatId === chatId) {
      setMessages([]);
      setCurrentChatId(null);
    }
  }, [currentChatId]);

  const value = {
    messages,
    input,
    setInput,
    isTyping,
    isLoading,
    sendMessage,
    clearHistory,
    loadChat,
    chats: chats.filter(c => !c.isAnonymous), // never show anonymous chats in history
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
