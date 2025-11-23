import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useTheme } from './ThemeContext';
import { sendMessageToGemini, isGeminiConfigured, generateChatTitle } from '../services/gemini';
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
  const [chats, setChats] = useState(loadChats);
  
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const streamTimeoutRef = React.useRef(null);

  useEffect(() => {
    saveChats(chats);
  }, [chats]);

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
      const tempTitle = text.slice(0, 40) + (text.length > 40 ? '...' : '');
      setChats(prev => [createChat(chatId, tempTitle, [userMessage]), ...prev]);
      setCurrentChatId(chatId);
      
      generateChatTitle(text).then(title => {
        setChats(prev => prev.map(chat => 
          chat.id === chatId ? updateChat(chat, { title }) : chat
        ));
      });
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
        fullResponse = `${result.userMessage}\n\n💬 Você pode continuar conversando, mas as respostas serão limitadas até resolver o problema.`;
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
  }, [messages, reducedMotion, currentChatId, chats]);

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

  const clearHistory = useCallback(() => {
    setMessages([]);
    setCurrentChatId(null);
  }, []);

  const deleteChat = useCallback((chatId) => {
    setChats(prev => prev.filter(c => c.id !== chatId));
    if (currentChatId === chatId) {
      setMessages([]);
      setCurrentChatId(null);
    }
  }, [currentChatId]);

  const loadChat = useCallback((chatId) => {
    setCurrentChatId(chatId);
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setMessages(chat.messages);
    }
  }, [chats]);

  const value = {
    messages,
    input,
    setInput,
    isTyping,
    isLoading,
    sendMessage,
    clearHistory,
    loadChat,
    chats,
    currentChatId,
    deleteChat,
    isStreaming,
    stopStreaming
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
