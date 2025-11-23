import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useTheme } from './ThemeContext';
import { sendMessageToGemini, isGeminiConfigured } from '../services/gemini';

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
  const [chats, setChats] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('chatHistory');
        return saved ? JSON.parse(saved) : [];
      } catch (error) {
        console.error('Error parsing chat history:', error);
        return [];
      }
    }
    return [];
  });
  
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    if (currentChatId) {
      const chat = chats.find(c => c.id === currentChatId);
      if (chat) {
        setMessages(chat.messages);
      }
    }
  }, [currentChatId, chats]);

  const generateTitle = async (text) => {
    try {
      const { sendMessageToGemini } = await import('../services/gemini');
      const prompt = `Resuma esta mensagem em no máximo 4 palavras: "${text}". Responda APENAS com o resumo, sem aspas ou pontuação extra.`;
      const result = await sendMessageToGemini(prompt, []);
      if (result.success) {
        return result.text.trim().replace(/["']/g, '');
      }
    } catch (error) {
      console.error('Error generating title:', error);
    }
    return text.slice(0, 40) + (text.length > 40 ? '...' : '');
  };

  const sendMessage = useCallback(async (text, files = []) => {
    if (!text.trim() && files.length === 0) return;

    const userMessage = { type: 'user', content: text, files };
    
    let chatId = currentChatId;
    if (!chatId) {
      chatId = Date.now().toString();
      const tempTitle = text.slice(0, 40) + (text.length > 40 ? '...' : '');
      setChats(prev => [{
        id: chatId,
        title: tempTitle,
        messages: [userMessage],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, ...prev]);
      setCurrentChatId(chatId);
      
      generateTitle(text).then(title => {
        setChats(prev => prev.map(chat => 
          chat.id === chatId ? { ...chat, title } : chat
        ));
      });
    } else {
      setChats(prev => prev.map(chat => 
        chat.id === chatId 
          ? { ...chat, messages: [...chat.messages, userMessage], updatedAt: new Date().toISOString() }
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
      
      const aiMessage = { type: 'ai', content: fullResponse, isStreaming: false };
      
      if (reducedMotion) {
        setMessages(prev => [...prev, aiMessage]);
        if (chatId) {
          setChats(prev => prev.map(chat => 
            chat.id === chatId 
              ? { ...chat, messages: [...chat.messages, aiMessage], updatedAt: new Date().toISOString() }
              : chat
          ));
        }
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
          
          if (chatId) {
            setChats(prev => prev.map(chat => 
              chat.id === chatId 
                ? { ...chat, messages: [...chat.messages, { type: 'ai', content: fullResponse, isStreaming: false }], updatedAt: new Date().toISOString() }
                : chat
            ));
          }
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
    }, 800);
  }, [messages, reducedMotion, currentChatId, chats]);

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
    deleteChat
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
