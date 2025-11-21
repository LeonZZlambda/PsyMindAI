import React from 'react';

const Sidebar = ({ isOpen, toggleSidebar, onNewChat, onLoadChat, onOpenSettings, onOpenHelp }) => {
  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const cmdKey = isMac ? '⌘' : 'Ctrl';
  const shiftKey = isMac ? '⇧' : 'Shift';

  const recentChats = [
    { id: 1, title: 'Ansiedade com provas', preview: 'Estou me sentindo ansioso...' },
    { id: 2, title: 'Dicas de estudo', preview: 'Como posso melhorar...' },
    { id: 3, title: 'Problemas de sono', preview: 'Não consigo dormir...' }
  ];

  return (
    <aside className={`sidebar ${!isOpen ? 'closed' : ''}`}>
      <div className="sidebar-header">
        <button className="menu-btn" onClick={toggleSidebar} title="Fechar menu">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>
      <button className="new-chat-btn" onClick={onNewChat} title="Novo chat">
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
      
      <div className="recent-chats">
        <span className="recent-label">Recentes</span>
        {recentChats.map(chat => (
          <button 
            key={chat.id} 
            className="recent-item" 
            onClick={() => onLoadChat(chat)}
            title={chat.preview}
          >
            <span className="material-symbols-outlined">chat_bubble_outline</span>
            <span>{chat.title}</span>
          </button>
        ))}
      </div>

      <div className="sidebar-footer">
        <button className="sidebar-item" title="Ajuda" onClick={onOpenHelp}>
          <span className="material-symbols-outlined">help</span>
          <span>Ajuda</span>
          {isOpen && (
            <span className="keyboard-shortcut">
              <span className="key">{cmdKey}</span>
              <span className="key">/</span>
            </span>
          )}
        </button>
        <button className="sidebar-item" title="Atividade" onClick={() => alert('Histórico de atividades em breve')}>
          <span className="material-symbols-outlined">history</span>
          <span>Atividade</span>
        </button>
        <button className="sidebar-item" title="Configurações" onClick={onOpenSettings}>
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
