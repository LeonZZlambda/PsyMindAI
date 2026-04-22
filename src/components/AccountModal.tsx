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
          key="account-modal-overlay"
          className="modal-overlay account-modal-overlay"
          onClick={handleOverlayClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="account-modal-content" onClick={(e) => e.stopPropagation()}>
            <AnimatePresence mode="wait">
              {activeView === 'account' ? (
                <motion.div 
                  key="account-view"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="account-modal-header" style={{ justifyContent: 'flex-end' }}>
                    <button className="close-btn" onClick={onClose} aria-label={t('account.close')}>
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>
                  
                  <div className="account-profile-box">
                    <div className="account-avatar-circle">
                      <span className="material-symbols-outlined" style={{ fontSize: '40px' }}>account_circle</span>
                    </div>
                    <h2 className="account-greeting">{t('account.greeting', { name: t('account.guest') })}</h2>
                    <p className="account-email">convidado@psymind.ai</p>
                    <button className="account-manage-btn" onClick={() => setActiveView('personalization')}>
                      {t('account.manage')}
                    </button>
                  </div>

                  <hr className="account-divider" />

                  <div className="account-menu-list">
                    <button className="account-menu-item" onClick={() => onOpenStudyStats?.()}>
                      <span className="material-symbols-outlined account-menu-icon">analytics</span>
                      <span>{t('account.menu.stats')}</span>
                    </button>
                    <button className="account-menu-item" onClick={() => setActiveView('personalization')}>
                      <span className="material-symbols-outlined account-menu-icon">tune</span>
                      <span>{t('account.personalization.title')}</span>
                    </button>
                  </div>

                  <hr className="account-divider" />

                  <div className="account-footer">
                     <button className="account-footer-btn" onClick={onClose}>{t('account.menu.add_account')}</button>
                     <button className="account-footer-btn" onClick={onClose}>{t('account.menu.logout')}</button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="personalization-view"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="account-modal-header">
                     <button className="close-btn" onClick={() => setActiveView('account')} aria-label={t('common.close')}>
                      <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                  </div>
                  <div className="personalization-form">
                    <h2 className="account-greeting" style={{ textAlign: 'left' }}>{t('account.personalization.title')}</h2>
                    <label>{t('account.personalization.custom_instructions.title')}</label>
                    <textarea 
                      name="customInstructions" 
                      value={profileSettings.customInstructions || ''} 
                      onChange={handleChange} 
                      placeholder={t('account.personalization.custom_instructions.placeholder')}
                    />
                    <div className="personalization-actions">
                      <button onClick={() => setActiveView('account')} className="secondary-btn">{t('account.personalization.actions.cancel')}</button>
                      <button onClick={handleSave} className="primary-btn">{t('account.personalization.actions.save')}</button>
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
