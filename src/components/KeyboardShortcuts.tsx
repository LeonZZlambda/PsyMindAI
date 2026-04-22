import { useEffect } from 'react';

/**
 * KeyboardShortcuts Hook Component
 * Centralizes all keyboard shortcut handlers
 * 
 * Shortcuts:
 * - Cmd/Ctrl + Shift + O: New Chat
 * - Cmd/Ctrl + B: Toggle Sidebar
 * - Cmd/Ctrl + Shift + L: Toggle Theme
 * - Cmd/Ctrl + ,: Open Settings
 * - Cmd/Ctrl + /: Open FAQ Help
 * - Cmd/Ctrl + Shift + /: Open Shortcuts Help
 * - /: Focus Input (when not in text field)
 */
export const useKeyboardShortcuts = ({
  onNewChat,
  onToggleSidebar,
  onToggleTheme,
  onOpenSettings,
  onOpenHelp,
  inputRef
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const metaKey = isMac ? e.metaKey : e.ctrlKey;

      // New Chat: Shift + Command + O
      if (metaKey && e.shiftKey && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        onNewChat?.();
      }

      // Toggle Sidebar: Command + B
      if (metaKey && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        onToggleSidebar?.();
      }

      // Toggle Theme: Command + Shift + L
      if (metaKey && e.shiftKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        onToggleTheme?.();
      }

      // Settings: Command + ,
      if (metaKey && e.key === ',') {
        e.preventDefault();
        onOpenSettings?.();
      }

      // Help: Command + /
      if (metaKey && e.key === '/') {
        e.preventDefault();
        onOpenHelp?.('faq');
      }

      // Shortcuts: Command + Shift + / (or ?)
      if (metaKey && (e.key === '?' || (e.shiftKey && e.key === '/'))) {
        e.preventDefault();
        onOpenHelp?.('shortcuts');
      }

      // Focus Input: /
      if (e.key === '/' && !metaKey && !e.ctrlKey && !e.altKey && 
          document.activeElement.tagName !== 'INPUT' && 
          document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNewChat, onToggleSidebar, onToggleTheme, onOpenSettings, onOpenHelp, inputRef]);
};

export default useKeyboardShortcuts;
