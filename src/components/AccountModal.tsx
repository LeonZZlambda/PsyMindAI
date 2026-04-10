import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import '../styles/settings.css'

interface AccountModalProps {
  isOpen: boolean
  onClose: () => void
  onOpenStudyStats?: () => void
  initialView?: 'account' | 'personalization'
}

const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose, onOpenStudyStats, initialView = 'account' }) => {
  const { t } = useTranslation()
  const [activeView, setActiveView] = useState(initialView)
  const [profileSettings, setProfileSettings] = useState<any>({
    responseMode: 'default',
    basicStyle: 'default',
    welcoming: 'default',
    enthusiastic: 'default',
    formatting: 'default',
    emojis: 'default',
    instantResponses: false,
    customInstructions: ''
  })

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setActiveView(initialView), 300)
    } else {
      const saved = localStorage.getItem('psymind_user_profile')
      if (saved) {
        try {
          setProfileSettings(JSON.parse(saved))
        } catch (e) {
          // ignore
        }
      }
    }
  }, [isOpen, initialView])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleSave = () => {
    localStorage.setItem('psymind_user_profile', JSON.stringify(profileSettings))
    setActiveView('account')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    const checked = (e.target as HTMLInputElement).checked
    setProfileSettings((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="account-modal"
          className="modal-overlay account-modal-overlay"
          onClick={handleOverlayClick}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <div className="modal-content account-modal-content" onClick={(e) => e.stopPropagation()}>
            <AnimatePresence mode="wait">
              {activeView === 'account' ? (
                <motion.div 
                  key="account"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="account-modal-body"
                >
                  <div className="account-modal-header">
                    <button className="close-btn" onClick={onClose} aria-label={t('account.close')}>
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>
                  
                  <div className="account-profile-box">
                    <p className="account-email">usuario@exemplo.com</p>
                    <div className="user-avatar account-avatar-circle">
                      <span className="material-symbols-outlined account-avatar-icon">account_circle</span>
                    </div>
                    <h2 className="account-greeting">{t('account.greeting', { name: 'Usuário' })}</h2>
                    <button className="account-manage-btn">{t('account.manage')}</button>
                  </div>

                  <div className="account-menu-list">
                    <button onClick={() => setActiveView('personalization')}>{t('account.personalization')}</button>
                    <button onClick={() => onOpenStudyStats?.()}>{t('account.study_stats')}</button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="personalization"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="account-modal-body"
                >
                  <div className="account-modal-header">
                    <button className="close-btn" onClick={() => setActiveView('account')} aria-label={t('account.back')}>
                      <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                  </div>
                  <div className="personalization-form">
                    <label>{t('account.custom_instructions')}</label>
                    <textarea name="customInstructions" value={profileSettings.customInstructions || ''} onChange={handleChange} />
                    <div className="personalization-actions">
                      <button onClick={handleSave} className="primary-btn">{t('account.save')}</button>
                      <button onClick={() => setActiveView('account')}>{t('account.cancel')}</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AccountModal
