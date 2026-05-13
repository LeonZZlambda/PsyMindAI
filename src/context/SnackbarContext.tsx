import React, { createContext } from 'react';

export interface SnackbarMessage {
  id: number;
  message: string;
  actionText?: string;
  onAction?: () => void;
  duration?: number;
}

interface SnackbarContextType {
  showSnackbar: (message: string, actionText?: string, onAction?: () => void, duration?: number) => void;
}

export const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);
