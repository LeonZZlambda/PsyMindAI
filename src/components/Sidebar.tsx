import { useNavigate } from 'react-router-dom'
import '../styles/sidebar.css'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { useChat } from '../context/ChatContext'
import { Telemetry } from '../services/analytics/telemetry'

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  onNewChat: () => void;
  onAnonymousChat: () => void;
  onChatSelect: () => void;
  isNewChatAnimating: boolean;
  onOpenSettings: () => void;
  onOpenHelp: (tab?: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, onNewChat, onAnonymousChat, onChatSelect, isNewChatAnimating, onOpenSettings, onOpenHelp }) => {
  const navigate = useNavigate()
  const { loadChat, chats = [], currentChatId, deleteChat } = useChat()
  const { t } = useTranslation()
  
  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform)
  const cmdKey = isMac ? '⌘' : 'Ctrl'
  const shiftKey = isMac ? '⇧' : 'Shift'

  const handleChatClick = (chatId: string) => {
    loadChat(chatId)
    if (onChatSelect) onChatSelect()
  }
  
  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation()
    deleteChat(chatId)
    toast.success(t('sidebar.chat_deleted'))
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 1) return t('sidebar.time.now')
    if (diffMins < 60) return t('sidebar.time.minutes_ago', { count: diffMins })
    if (diffHours < 24) return t('sidebar.time.hours_ago', { count: diffHours })
    if (diffDays === 1) return t('sidebar.time.yesterday')
    if (diffDays < 7) return t('sidebar.time.days_ago', { count: diffDays })
    
    return t('sidebar.time.date', { 
      day: date.getDate().toString().padStart(2, '0'), 
      month: (date.getMonth() + 1).toString().padStart(2, '0') 
    })
  }

  return (
    <aside className={`sidebar ${!isOpen ? 'closed' : ''}`} aria-label={t('sidebar.menu_aria')}>
      <div className="sidebar-header">
        <button 
          className="menu-btn" 
          onClick={toggleSidebar} 
          title={t('sidebar.close_menu')}
          aria-label={t('sidebar.close_menu')}
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>
      <button 
        className={`new-chat-btn ${isNewChatAnimating ? 'active' : ''}`}
        onClick={onNewChat} 
        title={`${t('sidebar.new_chat')} (${cmdKey} + ${shiftKey} + O)`}
        aria-label={t('sidebar.new_chat')}
      >
        <span className="material-symbols-outlined">add</span>
        <span>{t('sidebar.new_chat')}</span>
        {isOpen && (
          <span className="keyboard-shortcut">
            <span className="key">{cmdKey}</span>
            <span className="key">O</span>
          </span>
        )}
      </button>

      <button 
        className="new-chat-btn secondary anonymous-btn"
        onClick={onAnonymousChat} 
        title={t('sidebar.anonymous_tooltip')}
        aria-label={t('sidebar.anonymous_chat')}
        style={{ 
          background: 'var(--card-hover)', 
          color: 'var(--text-color)',
          marginTop: '0.5rem',
          border: '1px dashed var(--border-color)' 
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>visibility_off</span>
        <span>{t('sidebar.anonymous_chat')}</span>
      </button>
      
      <div className="recent-chats" role="group" aria-label={t('sidebar.recent_label')}>
        {chats.length > 0 && <span className="recent-label">{t('sidebar.recent_label')}</span>}
        {chats.map(chat => (
          <div
            key={chat.id}
            className={`recent-item ${currentChatId === chat.id ? 'active' : ''}`}
            onClick={() => handleChatClick(chat.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e as any).key === 'Enter' && handleChatClick(chat.id)}
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
              aria-label={t('sidebar.chat_deleted')}
            >
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <button 
          className="sidebar-item" 
          title={`${t('sidebar.help')} (${cmdKey} + /)`}
          onClick={() => { Telemetry.trackFeature('help', 'opened'); onOpenHelp('faq'); }}
          aria-label={t('sidebar.help')}
        >
          <span className="material-symbols-outlined">help</span>
          <span>{t('sidebar.help')}</span>
          {isOpen && (
            <span className="keyboard-shortcut">
              <span className="key">{cmdKey}</span>
              <span className="key">/</span>
            </span>
          )}
        </button>
        <button 
          className="sidebar-item" 
          title={`${t('sidebar.settings')} (${cmdKey} + ,)`}
          onClick={() => { Telemetry.trackFeature('settings', 'opened'); onOpenSettings(); }}
          aria-label={t('sidebar.settings')}
        >
          <span className="material-symbols-outlined">settings</span>
          <span>{t('sidebar.settings')}</span>
          {isOpen && (
            <span className="keyboard-shortcut">
              <span className="key">{cmdKey}</span>
              <span className="key">,</span>
            </span>
          )}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
