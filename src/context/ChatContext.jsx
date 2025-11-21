import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('chatMessages');
        return saved ? JSON.parse(saved) : [];
      } catch (error) {
        console.error('Error parsing chat messages from localStorage:', error);
        return [];
      }
    }
    return [];
  });

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const sendMessage = useCallback(async (text, files = []) => {
    if (!text.trim() && files.length === 0) return;

    const userMessage = { type: 'user', content: text, files };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        type: 'ai',
        content: 'Olá! Sou o PsyMind.AI e estou aqui para te ajudar a compreender suas emoções e comportamentos. Como posso te apoiar hoje?'
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  }, []);

  const clearHistory = useCallback(() => {
    setMessages([]);
    localStorage.removeItem('chatMessages');
  }, []);

  const loadChat = useCallback((chat) => {
    setMessages([
      { type: 'user', content: chat.title },
      { type: 'ai', content: `Entendo que você queira falar sobre **${chat.title}**. ${chat.preview} Como posso ajudar mais especificamente?` }
    ]);
  }, []);

  const value = {
    messages,
    input,
    setInput,
    isTyping,
    sendMessage,
    clearHistory,
    loadChat
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
