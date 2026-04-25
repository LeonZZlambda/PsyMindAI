import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import '../styles/account.css'

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type ResponseMode = 'default' | 'reflective' | 'action' | 'learning' | 'support'
type StyleLevel = 'default' | 'concise' | 'detailed' | 'casual' | 'formal'
type TraitLevel = 'less' | 'default' | 'more'

interface ProfileSettings {
  responseMode: ResponseMode
  basicStyle: StyleLevel
  welcoming: TraitLevel
  enthusiastic: TraitLevel
  formatting: TraitLevel
  emojis: TraitLevel
  instantResponses: boolean
  customInstructions: string
}

const DEFAULT_PROFILE: ProfileSettings = {
  responseMode: 'default',
  basicStyle: 'default',
  welcoming: 'default',
  enthusiastic: 'default',
  formatting: 'default',
  emojis: 'default',
  instantResponses: false,
  customInstructions: '',
}

/* -------------------------------------------------------------------------- */
/*  Sub-components                                                             */
/* -------------------------------------------------------------------------- */

interface SegmentedControlProps {
  value: TraitLevel
  onChange: (val: TraitLevel) => void
  labels: [string, string, string]
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({ value, onChange, labels }) => {
  const segments: TraitLevel[] = ['less', 'default', 'more']
  return (
    <div className="account-segment-group" role="group">
      {segments.map((seg, i) => (
        <button
          key={seg}
          className={`account-segment-btn${value === seg ? ' active' : ''}`}
          onClick={() => onChange(seg)}
          aria-pressed={value === seg}
          type="button"
        >
          {labels[i]}
        </button>
      ))}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Main Component                                                             */
/* -------------------------------------------------------------------------- */

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
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [activeView, setActiveView] = useState<'account' | 'personalization'>(initialView)
  const [profileSettings, setProfileSettings] = useState<ProfileSettings>(DEFAULT_PROFILE)
  // Draft kept separate so Cancel reverts without saving
  const [draft, setDraft] = useState<ProfileSettings>(DEFAULT_PROFILE)

  /* --- Load / reset -------------------------------------------------------- */
  useEffect(() => {
    if (!isOpen) {
      // Reset view after closing animation
      const timer = setTimeout(() => setActiveView(initialView), 300)
      return () => clearTimeout(timer)
    }
    const saved = localStorage.getItem('psymind_user_profile')
    if (saved) {
      try {
        const parsed: ProfileSettings = JSON.parse(saved)
        setProfileSettings(parsed)
        setDraft(parsed)
      } catch {
        // ignore malformed data
      }
    }
  }, [isOpen, initialView])

  /* --- Keyboard ------------------------------------------------------------ */
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  /* --- Handlers ------------------------------------------------------------ */
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  const handleOpenPersonalization = () => {
    setDraft({ ...profileSettings })
    setActiveView('personalization')
  }

  const handleCancel = () => {
    setDraft({ ...profileSettings })
    setActiveView('account')
  }

  const handleSave = () => {
    setProfileSettings({ ...draft })
    localStorage.setItem('psymind_user_profile', JSON.stringify(draft))
    setActiveView('account')
  }

  const updateDraft = <K extends keyof ProfileSettings>(key: K, value: ProfileSettings[K]) => {
    setDraft(prev => ({ ...prev, [key]: value }))
  }

  const handleOpenStats = () => {
    onOpenStudyStats?.()
    onClose()
  }

  /* --- Response mode config ----------------------------------------------- */
  type ModeConfig = { key: ResponseMode; icon: string; label: string }
  const RESPONSE_MODES: ModeConfig[] = [
    { key: 'default',    icon: 'auto_fix_normal', label: t('account.personalization.profile.modes.default.title') },
    { key: 'reflective', icon: 'psychology',      label: t('account.personalization.profile.modes.reflective.title') },
    { key: 'action',     icon: 'bolt',            label: t('account.personalization.profile.modes.action.title') },
    { key: 'learning',   icon: 'school',          label: t('account.personalization.profile.modes.learning.title') },
    { key: 'support',    icon: 'favorite',        label: t('account.personalization.profile.modes.support.title') },
  ]

  const TRAIT_LEVELS = [
    t('account.personalization.traits.levels.less'),
    t('account.personalization.traits.levels.default'),
    t('account.personalization.traits.levels.more'),
  ] as [string, string, string]

  const TRAITS: { key: keyof ProfileSettings; label: string }[] = [
    { key: 'welcoming',    label: t('account.personalization.traits.welcoming') },
    { key: 'enthusiastic', label: t('account.personalization.traits.enthusiastic') },
    { key: 'formatting',   label: t('account.personalization.traits.formatting') },
    { key: 'emojis',       label: t('account.personalization.traits.emojis') },
  ]

  /* ========================================================================= */
  /*  Render                                                                    */
  /* ========================================================================= */
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
          transition={{ duration: 0.18 }}
          role="dialog"
          aria-modal="true"
          aria-label={t('account.close')}
        >
          <motion.div
            className="account-modal-content"
            onClick={e => e.stopPropagation()}
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
          >
            <AnimatePresence mode="wait">

              {/* ============================================================ */}
              {/* ACCOUNT VIEW                                                   */}
              {/* ============================================================ */}
              {activeView === 'account' && (
                <motion.div
                  key="account-view"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
                >
                  {/* Close button */}
                  <button
                    className="account-close-btn"
                    onClick={onClose}
                    aria-label={t('account.close')}
                    type="button"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>

                  {/* ---- Avatar Hero ---------------------------------------- */}
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
                      onClick={handleOpenPersonalization}
                      type="button"
                    >
                      <span className="material-symbols-outlined">manage_accounts</span>
                      {t('account.manage')}
                    </button>
                  </div>

                  <hr className="account-divider" />

                  {/* ---- Menu List ------------------------------------------ */}
                  <nav className="account-menu-list" aria-label="Menu da conta">
                    <button
                      className="account-menu-item"
                      onClick={handleOpenStats}
                      type="button"
                    >
                      <span className="material-symbols-outlined account-menu-icon">analytics</span>
                      <span className="account-menu-label">{t('account.menu.stats')}</span>
                      <span className="material-symbols-outlined account-menu-chevron">chevron_right</span>
                    </button>
                    <button
                      className="account-menu-item"
                      onClick={handleOpenPersonalization}
                      type="button"
                    >
                      <span className="material-symbols-outlined account-menu-icon">tune</span>
                      <span className="account-menu-label">{t('account.personalization.title')}</span>
                      <span className="material-symbols-outlined account-menu-chevron">chevron_right</span>
                    </button>
                  </nav>

                  <hr className="account-divider" />

                  {/* ---- Footer --------------------------------------------- */}
                  <div className="account-footer">
                    <button className="account-footer-btn" onClick={onClose} type="button">
                      {t('account.menu.add_account')}
                    </button>
                    <span className="account-footer-dot" aria-hidden="true">·</span>
                    <button className="account-footer-btn" onClick={onClose} type="button">
                      {t('account.menu.logout')}
                    </button>

                    <div className="account-footer-links">
                      <button
                        className="account-footer-link"
                        onClick={() => { onClose(); navigate('/privacy') }}
                        type="button"
                      >
                        {t('account.links.privacy')}
                      </button>
                      <span className="account-footer-dot" aria-hidden="true">·</span>
                      <button
                        className="account-footer-link"
                        onClick={() => { onClose(); navigate('/terms') }}
                        type="button"
                      >
                        {t('account.links.terms')}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ============================================================ */}
              {/* PERSONALIZATION VIEW                                           */}
              {/* ============================================================ */}
              {activeView === 'personalization' && (
                <motion.div
                  key="personalization-view"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
                  style={{ display: 'flex', flexDirection: 'column' }}
                >
                  {/* Header */}
                  <div className="account-pref-header">
                    <button
                      className="account-pref-back-btn"
                      onClick={handleCancel}
                      aria-label={t('account.close')}
                      type="button"
                    >
                      <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h2 className="account-pref-title">{t('account.personalization.title')}</h2>
                  </div>

                  <hr className="account-divider" />

                  {/* Body */}
                  <div className="account-pref-body">

                    {/* ---- Response Profile --------------------------------- */}
                    <p className="account-pref-section-title">
                      {t('account.personalization.profile.title')}
                    </p>
                    <div className="account-mode-grid" role="radiogroup" aria-label={t('account.personalization.profile.title')}>
                      {RESPONSE_MODES.map(mode => (
                        <button
                          key={mode.key}
                          className={`account-mode-chip${draft.responseMode === mode.key ? ' active' : ''}`}
                          onClick={() => updateDraft('responseMode', mode.key)}
                          role="radio"
                          aria-checked={draft.responseMode === mode.key}
                          type="button"
                        >
                          <span className="material-symbols-outlined">{mode.icon}</span>
                          {mode.label}
                        </button>
                      ))}
                    </div>

                    {/* ---- Fine Tuning: Style ------------------------------ */}
                    <p className="account-pref-section-title">
                      {t('account.personalization.fine_tuning.title')}
                    </p>
                    <select
                      className="select-input account-style-select"
                      value={draft.basicStyle}
                      onChange={e => updateDraft('basicStyle', e.target.value as StyleLevel)}
                      aria-label={t('account.personalization.fine_tuning.style.label')}
                    >
                      <option value="default">{t('account.personalization.fine_tuning.style.options.default')}</option>
                      <option value="concise">{t('account.personalization.fine_tuning.style.options.concise')}</option>
                      <option value="detailed">{t('account.personalization.fine_tuning.style.options.detailed')}</option>
                      <option value="casual">{t('account.personalization.fine_tuning.style.options.casual')}</option>
                      <option value="formal">{t('account.personalization.fine_tuning.style.options.formal')}</option>
                    </select>

                    {/* ---- Traits ------------------------------------------ */}
                    <p className="account-pref-section-title">
                      {t('account.personalization.traits.title')}
                    </p>
                    {TRAITS.map(trait => (
                      <div key={trait.key} className="account-trait-row">
                        <span className="account-trait-label">{trait.label}</span>
                        <SegmentedControl
                          value={draft[trait.key] as TraitLevel}
                          onChange={val => updateDraft(trait.key, val)}
                          labels={TRAIT_LEVELS}
                        />
                      </div>
                    ))}

                    {/* ---- Instant Responses toggle ------------------------- */}
                    <div className="account-toggle-row">
                      <div className="account-toggle-info">
                        <span className="account-toggle-label">
                          {t('account.personalization.instant')}
                        </span>
                      </div>
                      <button
                        className={`toggle-switch${draft.instantResponses ? ' active' : ''}`}
                        onClick={() => updateDraft('instantResponses', !draft.instantResponses)}
                        aria-checked={draft.instantResponses}
                        role="switch"
                        type="button"
                        aria-label={t('account.personalization.instant')}
                      >
                        <span className="toggle-thumb" />
                      </button>
                    </div>

                    {/* ---- Custom Instructions ------------------------------ */}
                    <p className="account-pref-section-title">
                      {t('account.personalization.custom_instructions.title')}
                    </p>
                    <textarea
                      className="account-textarea"
                      value={draft.customInstructions}
                      onChange={e => updateDraft('customInstructions', e.target.value)}
                      placeholder={t('account.personalization.custom_instructions.placeholder')}
                      rows={4}
                      aria-label={t('account.personalization.custom_instructions.title')}
                    />

                    {/* ---- Actions ----------------------------------------- */}
                    <div className="account-pref-actions">
                      <button className="secondary-btn" onClick={handleCancel} type="button">
                        {t('account.personalization.actions.cancel')}
                      </button>
                      <button className="primary-btn filled" onClick={handleSave} type="button">
                        {t('account.personalization.actions.save')}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AccountModal
