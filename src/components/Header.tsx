import { useState, lazy, Suspense } from 'react'
import '../styles/header.css'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../context/ThemeContext'
import { motion, AnimatePresence } from 'framer-motion'

const SoundscapesModal = lazy(() => import('./SoundscapesModal'))
const AccountModal = lazy(() => import('./AccountModal'))

interface HeaderProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  isLoading?: boolean;
  onOpenStudyStats?: () => void;
}

const Header: React.FC<HeaderProps> = ({ isSidebarOpen, toggleSidebar, isLoading, onOpenStudyStats }) => {
  const { isDarkMode, toggleTheme, fontSize, reducedMotion, highContrast, colorBlindMode } = useTheme()
  const [isSoundModalOpen, setIsSoundModalOpen] = useState(false)
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false)
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
          className="header-btn" 
          onClick={() => setIsSoundModalOpen(true)} 
          title={t('header.ambient_sounds', 'Sons Ambientais')}
          aria-label={t('header.ambient_sounds_aria', 'Abrir sons ambientais')}
        >
          <span className="material-symbols-outlined">headphones</span>
        </button>
        <button 
          className="header-btn" 
          onClick={toggleTheme as any} 
          title={isDarkMode ? `${t('header.light_mode')} (${cmdKey} + ${shiftKey} + L)` : `${t('header.dark_mode')} (${cmdKey} + ${shiftKey} + L)`}
          aria-label={isDarkMode ? t('header.activate_light_mode') : t('header.activate_dark_mode')}
        >
          <span className="material-symbols-outlined">
            {isDarkMode ? 'light_mode' : 'dark_mode'}
          </span>
        </button>
        <button className="user-profile" onClick={(e) => { e.stopPropagation(); setIsAccountModalOpen(prev => !prev); }} title={t('header.user_account')} aria-label={t('header.user_profile')}>
          <span className="material-symbols-outlined">account_circle</span>
        </button>
      </div>
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            className="header-loader-bar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>
      
      {isSoundModalOpen && createPortal(
        <div className={`app ${isDarkMode ? 'dark' : ''} ${fontSize === 'large' ? 'font-large' : ''} ${reducedMotion ? 'reduced-motion' : ''} ${highContrast ? 'high-contrast' : ''} color-blind-${colorBlindMode}`} style={{ display: 'contents' }}>
          <Suspense fallback={null}>
            <SoundscapesModal
              isOpen={isSoundModalOpen}
              onClose={() => setIsSoundModalOpen(false)}
            />
          </Suspense>
        </div>,
        document.body
      )}

      {createPortal(
        <div className={`app ${isDarkMode ? 'dark' : ''} ${fontSize === 'large' ? 'font-large' : ''} ${reducedMotion ? 'reduced-motion' : ''} ${highContrast ? 'high-contrast' : ''} color-blind-${colorBlindMode}`} style={{ display: 'contents' }} onClick={(e) => e.stopPropagation()}>
          <Suspense fallback={null}>
            <AccountModal
              isOpen={isAccountModalOpen}
              onClose={() => setIsAccountModalOpen(false)}
              onOpenStudyStats={onOpenStudyStats}
            />
          </Suspense>
        </div>,
        document.body
      )}
    </header>
  )
}

export default Header
