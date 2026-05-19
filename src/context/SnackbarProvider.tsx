import React, { useState, useCallback, useRef, useEffect } from 'react';
import Snackbar from '@/components/ui/Snackbar';
import { SnackbarContext, SnackbarMessage } from './SnackbarContext';

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queue, setQueue] = useState<SnackbarMessage[]>([]);
  const [current, setCurrent] = useState<SnackbarMessage | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const processQueue = useCallback(() => {
    if (queue.length > 0 && !current) {
      const nextMessage = queue[0];
      setCurrent(nextMessage);
      setQueue((prev) => prev.slice(1));
      setIsVisible(true);

      timerRef.current = setTimeout(() => {
        handleClose();
      }, nextMessage.duration || 4000);
    }
  }, [queue, current]);

  useEffect(() => {
    processQueue();
  }, [processQueue]);

  const showSnackbar = useCallback(
    (message: string, actionText?: string, onAction?: () => void, duration?: number) => {
      setQueue((prev) => [
        ...prev,
        {
          id: Date.now(),
          message,
          actionText,
          onAction,
          duration,
        },
      ]);
    },
    []
  );

  const handleClose = useCallback(() => {
    setIsVisible(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    // Wait for exit animation (Accelerated curve duration ~ 300ms) before processing next
    setTimeout(() => {
      setCurrent(null);
    }, 300);
  }, []);

  const handleActionClick = useCallback(() => {
    if (current?.onAction) {
      current.onAction();
    }
    handleClose();
  }, [current, handleClose]);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      {current && (
        <Snackbar
          message={current.message}
          actionText={current.actionText}
          onActionClick={handleActionClick}
          isVisible={isVisible}
        />
      )}
    </SnackbarContext.Provider>
  );
};