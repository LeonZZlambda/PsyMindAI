import { useTranslation } from 'react-i18next'
import BaseModal from '@/components/modals/BaseModal'
import WeeklyGrid from './Grid/WeeklyGrid'
import '@/styles/weekly-schedule.css'

interface WeeklyScheduleModalProps {
  isOpen: boolean
  onClose: () => void
}

export const WeeklyScheduleModal = ({ isOpen, onClose }: WeeklyScheduleModalProps) => {
  const { t } = useTranslation(['schedule', 'translation'])

  if (!isOpen) return null

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('title', { defaultValue: 'Weekly Schedule Builder' })}
      icon="calendar_month"
      size="large"
      className="weekly-schedule-modal"
      maxWidth="95%"
    >
      <WeeklyGrid />
    </BaseModal>
  )
}

export default WeeklyScheduleModal
