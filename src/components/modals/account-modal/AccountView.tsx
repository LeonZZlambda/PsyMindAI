import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

interface AccountViewProps {
  onClose: () => void
  onOpenPersonalization: () => void
  onOpenStats: () => void
}

export const AccountView: React.FC<AccountViewProps> = ({
  onClose,
  onOpenPersonalization,
  onOpenStats,
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <>
      <button
        className="account-close-btn"
        onClick={onClose}
        aria-label={t('account.close')}
        type="button"
      >
        <span className="material-symbols-outlined">close</span>
      </button>

      <div className="account-avatar-hero">
        <div className="account-avatar-circle" aria-hidden="true">
          <span className="material-symbols-outlined">account_circle</span>
        </div>
        <p className="account-name">
          {t('account.greeting', { name: t('account.guest') })}
        </p>
        <p className="account-email">convidado@psymind.ai</p>
        <button
          className="account-manage-btn"
          onClick={onOpenPersonalization}
          type="button"
        >
          <span className="material-symbols-outlined">manage_accounts</span>
          {t('account.manage')}
        </button>
      </div>

      <hr className="account-divider" />

      <nav className="account-menu-list" aria-label="Menu da conta">
        <button className="account-menu-item" onClick={onOpenStats} type="button">
          <span className="material-symbols-outlined account-menu-icon">analytics</span>
          <span className="account-menu-label">{t('account.menu.stats')}</span>
          <span className="material-symbols-outlined account-menu-chevron">
            chevron_right
          </span>
        </button>
        <button
          className="account-menu-item"
          onClick={onOpenPersonalization}
          type="button"
        >
          <span className="material-symbols-outlined account-menu-icon">tune</span>
          <span className="account-menu-label">
            {t('account.personalization.title')}
          </span>
          <span className="material-symbols-outlined account-menu-chevron">
            chevron_right
          </span>
        </button>
      </nav>

      <hr className="account-divider" />

      <div className="account-footer">
        <div className="account-footer-links">
          <button
            className="account-footer-link"
            onClick={() => {
              onClose()
              navigate('/privacy')
            }}
            type="button"
          >
            {t('account.links.privacy')}
          </button>
          <span className="account-footer-dot" aria-hidden="true">
            ·
          </span>
          <button
            className="account-footer-link"
            onClick={() => {
              onClose()
              navigate('/terms')
            }}
            type="button"
          >
            {t('account.links.terms')}
          </button>
        </div>
      </div>
    </>
  )
}
