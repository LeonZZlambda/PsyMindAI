import React from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../context/ChatContext';

const Sidebar = ({ isOpen, toggleSidebar, onNewChat, onChatSelect, isNewChatAnimating, onOpenSettings, onOpenHelp, onOpenMoodTracker }) => {
  const navigate = useNavigate();
  const { loadChat, chats, currentChatId, deleteChat } = useChat();
  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const cmdKey = isMac ? '⌘' : 'Ctrl';
  const shiftKey = isMac ? '⇧' : 'Shift';

  const handleChatClick = (chatId) => {
    loadChat(chatId);
    if (onChatSelect) {
      onChatSelect();
    }
  };
  
  const handleDeleteChat = (e, chatId) => {
    e.stopPropagation();
    deleteChat(chatId);
    toast.success('Chat excluído');
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins}m atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays}d atrás`;
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const handleActivityClick = () => {
    toast.info('Histórico de atividades em breve!', {
      description: 'Estamos trabalhando para trazer estatísticas sobre seu bem-estar.'
    });
  };

  return (
    <aside className={`sidebar ${!isOpen ? 'closed' : ''}`} aria-label="Menu lateral">
      <div className="sidebar-header">
        <button 
          className="menu-btn" 
          onClick={toggleSidebar} 
          title="Fechar menu"
          aria-label="Fechar menu lateral"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>
      <button 
        className={`new-chat-btn ${isNewChatAnimating ? 'active' : ''}`}
        onClick={onNewChat} 
        title={`Novo chat (${cmdKey} + ${shiftKey} + O)`}
        aria-label="Iniciar novo chat"
      >
        <span className="material-symbols-outlined">add</span>
        <span>Novo chat</span>
        {isOpen && (
          <span className="keyboard-shortcut">
            <span className="key">{shiftKey}</span>
            <span className="key">{cmdKey}</span>
            <span className="key">O</span>
          </span>
        )}
      </button>
      
      <div className="recent-chats" role="group" aria-label="Chats recentes">
        {chats.length > 0 && <span className="recent-label">Recentes</span>}
        {chats.map(chat => (
          <button 
            key={chat.id} 
            className={`recent-item ${currentChatId === chat.id ? 'active' : ''}`}
            onClick={() => handleChatClick(chat.id)}
            aria-label={`Carregar chat: ${chat.title}`}
          >
            <span className="material-symbols-outlined">chat_bubble_outline</span>
            <div className="recent-item-content">
              <span className="recent-item-title">{chat.title}</span>
              <span className="recent-item-date">{formatDate(chat.updatedAt)}</span>
            </div>
            <button 
              className="delete-chat-btn"
              onClick={(e) => handleDeleteChat(e, chat.id)}
              aria-label="Excluir chat"
            >
              <span className="material-symbols-outlined">delete</span>
            </button>
          </button>
        ))}
      </div>

      <div className="sidebar-footer">
        <button 
          className="sidebar-item" 
          title="Diário de Emoções" 
          onClick={onOpenMoodTracker}
          aria-label="Abrir diário de emoções"
        >
          <span className="material-symbols-outlined">mood</span>
          <span>Diário de Emoções</span>
        </button>
        <button 
          className="sidebar-item" 
          title={`Ajuda (${cmdKey} + /)`}
          onClick={() => onOpenHelp('faq')}
          aria-label="Abrir ajuda"
        >
          <span className="material-symbols-outlined">help</span>
          <span>Ajuda</span>
          {isOpen && (
            <span className="keyboard-shortcut">
              <span className="key">{cmdKey}</span>
              <span className="key">/</span>
            </span>
          )}
        </button>
        <button 
          className="sidebar-item" 
          title="Atividade" 
          onClick={handleActivityClick}
          aria-label="Ver histórico de atividades"
        >
          <span className="material-symbols-outlined">history</span>
          <span>Atividade</span>
        </button>
        <button 
          className="sidebar-item" 
          title={`Configurações (${cmdKey} + ,)`}
          onClick={onOpenSettings}
          aria-label="Abrir configurações"
        >
          <span className="material-symbols-outlined">settings</span>
          <span>Configurações</span>
          {isOpen && (
            <span className="keyboard-shortcut">
              <span className="key">{cmdKey}</span>
              <span className="key">,</span>
            </span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
