import React from 'react';
import { toast } from 'sonner';
import { useChat } from '../context/ChatContext';

const Sidebar = ({ isOpen, toggleSidebar, onNewChat, onChatSelect, isNewChatAnimating, onOpenSettings, onOpenHelp }) => {
  const { loadChat } = useChat();
  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const cmdKey = isMac ? '⌘' : 'Ctrl';
  const shiftKey = isMac ? '⇧' : 'Shift';

  const recentChats = [
    { id: 1, title: 'Ansiedade com provas', preview: 'Estou me sentindo ansioso...' },
    { id: 2, title: 'Dicas de estudo', preview: 'Como posso melhorar...' },
    { id: 3, title: 'Problemas de sono', preview: 'Não consigo dormir...' }
  ];

  const handleChatClick = (chat) => {
    loadChat(chat);
    if (onChatSelect) {
      onChatSelect();
    }
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
        title="Novo chat"
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
        <span className="recent-label">Recentes</span>
        {recentChats.map(chat => (
          <button 
            key={chat.id} 
            className="recent-item" 
            onClick={() => handleChatClick(chat)}
            title={chat.preview}
            aria-label={`Carregar chat: ${chat.title}`}
          >
            <span className="material-symbols-outlined">chat_bubble_outline</span>
            <span>{chat.title}</span>
          </button>
        ))}
      </div>

      <div className="sidebar-footer">
        <button 
          className="sidebar-item" 
          title="Ajuda" 
          onClick={onOpenHelp}
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
          title="Configurações" 
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
