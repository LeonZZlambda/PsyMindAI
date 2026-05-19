import { useState, useEffect } from 'react'
import { ProfileSettings, DEFAULT_PROFILE } from './types'

const STORAGE_KEY = 'psymind_user_profile'

export const useAccountModal = (isOpen: boolean, initialView: 'account' | 'personalization') => {
  const [activeView, setActiveView] = useState<'account' | 'personalization'>(initialView)
  const [profileSettings, setProfileSettings] = useState<ProfileSettings>(DEFAULT_PROFILE)
  const [draft, setDraft] = useState<ProfileSettings>(DEFAULT_PROFILE)

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined
    if (!isOpen) {
      timer = setTimeout(() => setActiveView(initialView), 300)
    } else {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try {
          const parsed: ProfileSettings = JSON.parse(saved)
          setProfileSettings(parsed)
          setDraft(parsed)
        } catch {
          // ignore malformed data
        }
      }
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [isOpen, initialView])

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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
    setActiveView('account')
  }

  const updateDraft = <K extends keyof ProfileSettings>(key: K, value: ProfileSettings[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  return {
    activeView,
    draft,
    handleOpenPersonalization,
    handleCancel,
    handleSave,
    updateDraft,
  }
}
