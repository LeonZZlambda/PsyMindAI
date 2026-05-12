import React from 'react'
import '../styles/header.css'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../context/ThemeContext'
import { useSound } from '../context/SoundContext'
import { useModal } from '../context/ModalContext'

interface HeaderProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  isLoading?: boolean;
  onOpenStudyStats?: () => void;
}

const Header: React.FC<HeaderProps> = ({ isSidebarOpen, toggleSidebar, isLoading, onOpenStudyStats }) => {
  const { isDarkMode, toggleTheme } = useTheme()
  const { isPlaying } = useSound()
  const { toggleModal } = useModal()
  const { t } = useTranslation()
  
  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform)
  const cmdKey = isMac ? '⌘' : 'Ctrl'
  const shiftKey = isMac ? '⇧' : 'Shift'

  return (
    <header className="header">
      <div className="header-left">
        {!isSidebarOpen && (
          <button 
            className="header-btn menu-toggle" 
            onClick={toggleSidebar} 
            title={`${t('header.open_menu')} (${cmdKey} + B)`}
            aria-label={t('header.open_menu_aria', 'Abrir menu lateral')}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        )}
        <div className="logo">
          <div className="logo-icon" aria-hidden="true">
            <span className="material-symbols-outlined">psychology</span>
          </div>
          <h1>PsyMind.AI</h1>
        </div>
      </div>
      <div className="header-actions">
        <button 
          className={`header-btn ${isPlaying ? 'playing' : ''}`} 
          onClick={() => toggleModal('soundscapes')} 
          title={t('header.ambient_sounds', 'Sons Ambientais')}
          aria-label={t('header.ambient_sounds_aria', 'Abrir sons ambientais')}
        >
          <span className="material-symbols-outlined">headphones</span>
        </button>
        <button 
          className="header-btn" 
          onClick={toggleTheme} 
          title={isDarkMode ? `${t('header.light_mode')} (${cmdKey} + ${shiftKey} + L)` : `${t('header.dark_mode')} (${cmdKey} + ${shiftKey} + L)`}
          aria-label={isDarkMode ? t('header.activate_light_mode') : t('header.activate_dark_mode')}
        >
          <span className="material-symbols-outlined">
            {isDarkMode ? 'light_mode' : 'dark_mode'}
          </span>
        </button>
        <button 
          className="header-btn" 
          onClick={() => toggleModal('achievements')} 
          title={t('header.achievements', 'Conquistas')}
          aria-label={t('header.achievements_aria', 'Ver conquistas')}
        >
          <span className="material-symbols-outlined">emoji_events</span>
        </button>
        <button 
          className="header-btn" 
          onClick={() => toggleModal('learningGoals')} 
          title="Metas de Aprendizado"
          aria-label="Ver metas de aprendizado"
        >
          <span className="material-symbols-outlined">flag</span>
        </button>
        <button 
          className="user-profile" 
          onClick={(e) => { e.stopPropagation(); toggleModal('account'); }} 
          title={t('header.user_account')} 
          aria-label={t('header.user_profile')}
        >
          <span className="material-symbols-outlined">account_circle</span>
        </button>
      </div>
      {/* CSS-animated loader bar — no framer-motion dependency */}
      <div 
        className="header-loader-bar"
        style={{ opacity: isLoading ? 1 : 0 }}
        aria-hidden="true"
      />
    </header>
  )
}

export default Header

