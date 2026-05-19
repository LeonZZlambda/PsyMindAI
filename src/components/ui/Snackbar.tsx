import React from 'react';
import { useTheme } from '../../hooks/context/useTheme';
import '../../styles/snackbar.css';

interface SnackbarProps {
  message: string;
  actionText?: string;
  onActionClick?: () => void;
  isVisible: boolean;
}

const Snackbar: React.FC<SnackbarProps> = ({ message, actionText, onActionClick, isVisible }) => {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`snackbar-container ${isVisible ? 'snackbar-enter' : 'snackbar-exit'} ${isDarkMode ? 'dark' : ''}`}
      role="alert"
      aria-live="polite"
    >
      <div className="snackbar-content">
        <span className="snackbar-message">{message}</span>
        {actionText && (
          <button className="snackbar-action" onClick={onActionClick}>
            {actionText}
          </button>
        )}
      </div>
    </div>
  );
};

export default Snackbar;
