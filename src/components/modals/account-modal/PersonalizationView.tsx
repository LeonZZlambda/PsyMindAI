import React from 'react'
import { useTranslation } from 'react-i18next'
import CustomSelect from '@/components/ui/CustomSelect'
import { SegmentedControl } from './SegmentedControl'
import { ProfileSettings, ResponseMode, StyleLevel, TraitLevel } from './types'

interface PersonalizationViewProps {
  draft: ProfileSettings
  onCancel: () => void
  onSave: () => void
  updateDraft: <K extends keyof ProfileSettings>(key: K, value: ProfileSettings[K]) => void
}

export const PersonalizationView: React.FC<PersonalizationViewProps> = ({
  draft,
  onCancel,
  onSave,
  updateDraft,
}) => {
  const { t } = useTranslation()

  const RESPONSE_MODES: { key: ResponseMode; icon: string; label: string }[] = [
    {
      key: 'default',
      icon: 'auto_fix_normal',
      label: t('account.personalization.profile.modes.default.title'),
    },
    {
      key: 'reflective',
      icon: 'psychology',
      label: t('account.personalization.profile.modes.reflective.title'),
    },
    { key: 'action', icon: 'bolt', label: t('account.personalization.profile.modes.action.title') },
    {
      key: 'learning',
      icon: 'school',
      label: t('account.personalization.profile.modes.learning.title'),
    },
    {
      key: 'support',
      icon: 'favorite',
      label: t('account.personalization.profile.modes.support.title'),
    },
  ]

  const TRAIT_LEVELS = [
    t('account.personalization.traits.levels.less'),
    t('account.personalization.traits.levels.default'),
    t('account.personalization.traits.levels.more'),
  ] as [string, string, string]

  const TRAITS: { key: keyof ProfileSettings; label: string }[] = [
    { key: 'welcoming', label: t('account.personalization.traits.welcoming') },
    { key: 'enthusiastic', label: t('account.personalization.traits.enthusiastic') },
    { key: 'formatting', label: t('account.personalization.traits.formatting') },
    { key: 'emojis', label: t('account.personalization.traits.emojis') },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="account-pref-header">
        <button
          className="account-pref-back-btn"
          onClick={onCancel}
          aria-label={t('account.close')}
          type="button"
        >
          <span className="material-symbols-outlined icon-rtl-flip">arrow_back</span>
        </button>
        <h2 className="account-pref-title">{t('account.personalization.title')}</h2>
      </div>

      <hr className="account-divider" />

      <div className="account-pref-body">
        <p className="account-pref-section-title">
          {t('account.personalization.profile.title')}
        </p>
        <div
          className="account-mode-grid"
          role="radiogroup"
          aria-label={t('account.personalization.profile.title')}
        >
          {RESPONSE_MODES.map((mode) => (
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

        <p className="account-pref-section-title">
          {t('account.personalization.fine_tuning.title')}
        </p>
        <CustomSelect
          value={draft.basicStyle}
          onChange={(val) => updateDraft('basicStyle', val as StyleLevel)}
          ariaLabel={t('account.personalization.fine_tuning.style.label')}
          className="account-style-select"
          options={[
            {
              value: 'default',
              label: t('account.personalization.fine_tuning.style.options.default'),
            },
            {
              value: 'concise',
              label: t('account.personalization.fine_tuning.style.options.concise'),
            },
            {
              value: 'detailed',
              label: t('account.personalization.fine_tuning.style.options.detailed'),
            },
            {
              value: 'casual',
              label: t('account.personalization.fine_tuning.style.options.casual'),
            },
            {
              value: 'formal',
              label: t('account.personalization.fine_tuning.style.options.formal'),
            },
          ]}
        />

        <p className="account-pref-section-title">
          {t('account.personalization.traits.title')}
        </p>
        {TRAITS.map((trait) => (
          <div key={trait.key} className="account-trait-row">
            <span className="account-trait-label">{trait.label}</span>
            <SegmentedControl
              value={draft[trait.key] as TraitLevel}
              onChange={(val) => updateDraft(trait.key, val)}
              labels={TRAIT_LEVELS}
            />
          </div>
        ))}

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

        <p className="account-pref-section-title">
          {t('account.personalization.custom_instructions.title')}
        </p>
        <textarea
          className="account-textarea"
          value={draft.customInstructions}
          onChange={(e) => updateDraft('customInstructions', e.target.value)}
          placeholder={t('account.personalization.custom_instructions.placeholder')}
          rows={4}
          aria-label={t('account.personalization.custom_instructions.title')}
        />
      </div>

      <div className="account-pref-actions">
        <button className="secondary-btn" onClick={onCancel} type="button">
          {t('account.personalization.actions.cancel')}
        </button>
        <button className="primary-btn filled" onClick={onSave} type="button">
          {t('account.personalization.actions.save')}
        </button>
      </div>
    </div>
  )
}
