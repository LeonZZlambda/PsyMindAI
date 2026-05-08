import React from 'react'
import { AnimatePresence, m } from 'framer-motion'
import BaseModal from './BaseModal'
import { AccountView } from './account-modal/AccountView'
import { PersonalizationView } from './account-modal/PersonalizationView'
import { useAccountModal } from './account-modal/useAccountModal'
import '../styles/account.css'

interface AccountModalProps {
  isOpen: boolean
  onClose: () => void
  onOpenStudyStats?: () => void
  initialView?: 'account' | 'personalization'
}

const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  onOpenStudyStats,
  initialView = 'account',
}) => {
  const {
    activeView,
    draft,
    handleOpenPersonalization,
    handleCancel,
    handleSave,
    updateDraft,
  } = useAccountModal(isOpen, initialView)

  const handleOpenStats = () => {
    onOpenStudyStats?.()
    onClose()
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      closeButton={false}
      className="account-modal"
      maxWidth="480px"
    >
      {({ handleClose }) => (
        <AnimatePresence mode="wait">
          {activeView === 'account' && (
            <m.div
              key="account-view"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
            >
              <AccountView
                onClose={handleClose}
                onOpenPersonalization={handleOpenPersonalization}
                onOpenStats={handleOpenStats}
              />
            </m.div>
          )}

          {activeView === 'personalization' && (
            <m.div
              key="personalization-view"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
            >
              <PersonalizationView
                draft={draft}
                onCancel={handleCancel}
                onSave={handleSave}
                updateDraft={updateDraft}
              />
            </m.div>
          )}
        </AnimatePresence>
      )}
    </BaseModal>
  )
}

export default AccountModal
