/**
 * EXEMPLO: Como adicionar uma nova view ao AccountModal
 * 
 * Este arquivo demonstra como estender o AccountModal com uma nova view
 * seguindo o padrão modular estabelecido.
 */

// ============================================================================
// 1. Criar o componente da nova view
// ============================================================================

// src/components/account-modal/SecurityView.tsx
import React from 'react'
import { useTranslation } from 'react-i18next'

interface SecurityViewProps {
  onBack: () => void
  onSave: () => void
}

export const SecurityView: React.FC<SecurityViewProps> = ({ onBack, onSave }) => {
  const { t } = useTranslation()
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="account-pref-header">
        <button
          className="account-pref-back-btn"
          onClick={onBack}
          aria-label={t('account.close')}
          type="button"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="account-pref-title">Segurança</h2>
      </div>

      <hr className="account-divider" />

      <div className="account-pref-body">
        <p className="account-pref-section-title">Autenticação</p>
        
        <div className="account-toggle-row">
          <div className="account-toggle-info">
            <span className="account-toggle-label">
              Autenticação de dois fatores
            </span>
          </div>
          <button
            className={`toggle-switch${twoFactorEnabled ? ' active' : ''}`}
            onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
            aria-checked={twoFactorEnabled}
            role="switch"
            type="button"
          >
            <span className="toggle-thumb" />
          </button>
        </div>
      </div>

      <div className="account-pref-actions">
        <button className="secondary-btn" onClick={onBack} type="button">
          Voltar
        </button>
        <button className="primary-btn filled" onClick={onSave} type="button">
          Salvar
        </button>
      </div>
    </div>
  )
}

// ============================================================================
// 2. Atualizar o hook useAccountModal
// ============================================================================

// src/components/account-modal/useAccountModal.ts
import { useState, useEffect } from 'react'
import { ProfileSettings, DEFAULT_PROFILE } from './types'

const STORAGE_KEY = 'psymind_user_profile'

// Adicionar novo tipo de view
type ViewType = 'account' | 'personalization' | 'security'

export const useAccountModal = (isOpen: boolean, initialView: ViewType) => {
  const [activeView, setActiveView] = useState<ViewType>(initialView)
  const [profileSettings, setProfileSettings] = useState<ProfileSettings>(DEFAULT_PROFILE)
  const [draft, setDraft] = useState<ProfileSettings>(DEFAULT_PROFILE)

  // ... resto do código existente ...

  // Adicionar handler para nova view
  const handleOpenSecurity = () => {
    setActiveView('security')
  }

  const handleBackToAccount = () => {
    setActiveView('account')
  }

  return {
    activeView,
    draft,
    handleOpenPersonalization,
    handleOpenSecurity, // Novo handler
    handleBackToAccount, // Novo handler
    handleCancel,
    handleSave,
    updateDraft,
  }
}

// ============================================================================
// 3. Atualizar o AccountModal principal
// ============================================================================

// src/components/AccountModal.tsx
import React from 'react'
import { AnimatePresence, m } from 'framer-motion'
import BaseModal from './BaseModal'
import { AccountView } from './account-modal/AccountView'
import { PersonalizationView } from './account-modal/PersonalizationView'
import { SecurityView } from './account-modal/SecurityView' // Nova importação
import { useAccountModal } from './account-modal/useAccountModal'
import '../styles/account.css'

interface AccountModalProps {
  isOpen: boolean
  onClose: () => void
  onOpenStudyStats?: () => void
  initialView?: 'account' | 'personalization' | 'security' // Atualizar tipo
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
    handleOpenSecurity, // Novo handler
    handleBackToAccount, // Novo handler
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
              onClose={onClose}
              onOpenPersonalization={handleOpenPersonalization}
              onOpenSecurity={handleOpenSecurity} // Passar novo handler
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

        {/* Nova view */}
        {activeView === 'security' && (
          <m.div
            key="security-view"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
          >
            <SecurityView
              onBack={handleBackToAccount}
              onSave={() => {
                // Salvar configurações de segurança
                handleBackToAccount()
              }}
            />
          </m.div>
        )}
      </AnimatePresence>
    </BaseModal>
  )
}

export default AccountModal

// ============================================================================
// 4. Atualizar AccountView para incluir botão da nova view
// ============================================================================

// src/components/account-modal/AccountView.tsx
interface AccountViewProps {
  onClose: () => void
  onOpenPersonalization: () => void
  onOpenSecurity: () => void // Nova prop
  onOpenStats: () => void
}

export const AccountView: React.FC<AccountViewProps> = ({
  onClose,
  onOpenPersonalization,
  onOpenSecurity, // Nova prop
  onOpenStats,
}) => {
  // ... código existente ...

  return (
    <>
      {/* ... código existente ... */}
      
      <nav className="account-menu-list" aria-label="Menu da conta">
        {/* ... botões existentes ... */}
        
        {/* Novo botão */}
        <button
          className="account-menu-item"
          onClick={onOpenSecurity}
          type="button"
        >
          <span className="material-symbols-outlined account-menu-icon">security</span>
          <span className="account-menu-label">Segurança</span>
          <span className="material-symbols-outlined account-menu-chevron">
            chevron_right
          </span>
        </button>
      </nav>
      
      {/* ... resto do código ... */}
    </>
  )
}

// ============================================================================
// RESUMO: Passos para adicionar uma nova view
// ============================================================================

/**
 * 1. Criar componente da view em account-modal/NovaView.tsx
 * 2. Atualizar tipo ViewType em useAccountModal.ts
 * 3. Adicionar handlers no hook useAccountModal
 * 4. Importar nova view no AccountModal.tsx
 * 5. Adicionar case no AnimatePresence
 * 6. Atualizar AccountView para incluir botão de navegação
 * 7. (Opcional) Adicionar novos tipos em types.ts se necessário
 * 8. (Opcional) Adicionar testes em __tests__/AccountModal.test.jsx
 */
