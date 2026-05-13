import { useContext } from 'react';
import { ChatContext, type ChatContextValue } from '../../context/ChatContext';

/**
 * Hook to access the Chat context
 * @returns Chat context value
 * @throws Error if used outside of ChatProvider
 */
export const useChat = (): ChatContextValue => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
