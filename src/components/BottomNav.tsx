import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/bottom-nav.css';

interface BottomNavProps {
  onNewChat: () => void;
  onOpenSettings: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onNewChat, onOpenSettings }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const isChat = location.pathname === '/chat' || location.pathname === '/';
  
  return (
    <nav className="bottom-nav">
      <button 
        className={`bottom-nav-item ${isChat ? 'active' : ''}`}
        onClick={() => navigate('/chat')}
      >
        <div className="bottom-nav-indicator">
          <span className="material-symbols-outlined">{isChat ? 'chat_bubble' : 'chat_bubble_outline'}</span>
        </div>
        <span className="bottom-nav-label">Chat</span>
      </button>

      <button 
        className="bottom-nav-item bottom-nav-fab"
        onClick={onNewChat}
        aria-label={t('sidebar.new_chat')}
      >
        <div className="bottom-nav-fab-container">
          <span className="material-symbols-outlined">add</span>
        </div>
      </button>

      <button 
        className="bottom-nav-item"
        onClick={onOpenSettings}
      >
        <div className="bottom-nav-indicator">
          <span className="material-symbols-outlined">settings</span>
        </div>
        <span className="bottom-nav-label">{t('sidebar.settings')}</span>
      </button>
    </nav>
  );
};

export default BottomNav;
