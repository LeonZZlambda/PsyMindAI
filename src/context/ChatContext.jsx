import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useTheme } from './ThemeContext';

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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const sendMessage = useCallback(async (text, files = []) => {
    if (!text.trim() && files.length === 0) return;

    const userMessage = { type: 'user', content: text, files };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response with streaming effect
    setTimeout(() => {
      setIsTyping(false);
      
      const fullResponse = 'Olá! Sou o PsyMind.AI e estou aqui para te ajudar a compreender suas emoções e comportamentos. \n\nSe precisar de exemplos de código, posso ajudar também:\n\n```javascript\nconsole.log("Olá, mundo!");\nconst emocao = "felicidade";\n```\n\nComo posso te apoiar hoje?';
      
      if (reducedMotion) {
        setMessages(prev => [...prev, { type: 'ai', content: fullResponse, isStreaming: false }]);
        return;
      }

      // Add empty AI message first with isStreaming: true
      setMessages(prev => [...prev, { type: 'ai', content: '', isStreaming: true }]);

      let currentIndex = 0;

      const streamText = () => {
        if (currentIndex >= fullResponse.length) {
          setMessages(prev => {
            const newMessages = [...prev];
            const lastIndex = newMessages.length - 1;
            if (lastIndex >= 0) {
              newMessages[lastIndex] = { ...newMessages[lastIndex], isStreaming: false };
            }
            return newMessages;
          });
          return;
        }

        // Variable chunk size for more natural feel
        const chunkSize = Math.floor(Math.random() * 3) + 1;
        const chunk = fullResponse.slice(currentIndex, currentIndex + chunkSize);
        
        setMessages(prev => {
          const newMessages = [...prev];
          const lastIndex = newMessages.length - 1;
          
          if (lastIndex >= 0 && newMessages[lastIndex].type === 'ai') {
             const currentContent = newMessages[lastIndex].content || '';
             newMessages[lastIndex] = {
               ...newMessages[lastIndex],
               content: currentContent + chunk
             };
          }
          return newMessages;
        });

        currentIndex += chunkSize;

        // Dynamic delay based on content (punctuation pauses)
        let delay = 15 + Math.random() * 20;
        const lastChar = chunk[chunk.length - 1];
        
        if (['.', '!', '?', '\n'].includes(lastChar)) {
          delay += 300;
        } else if ([',', ';', ':'].includes(lastChar)) {
          delay += 150;
        }

        setTimeout(streamText, delay);
      };

      streamText();
    }, 1500);
  }, []);

  const clearHistory = useCallback(() => {
    setMessages([]);
    localStorage.removeItem('chatMessages');
  }, []);

  const loadChat = useCallback((chat) => {
    setIsLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      setMessages([
        { type: 'user', content: chat.title },
        { type: 'ai', content: `Entendo que você queira falar sobre **${chat.title}**. ${chat.preview} Como posso ajudar mais especificamente?` }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const value = {
    messages,
    input,
    setInput,
    isTyping,
    isLoading,
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
