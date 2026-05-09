import { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSnackbar } from '../../../context/SnackbarContext'
import BaseModal from '@/components/BaseModal'
import MaterialIcon from '@/components/MaterialIcon'
import { Activity } from '../types'
import { exportSchedule } from '../utils/exportSchedule'

interface ExportButtonProps {
  activities: Activity[]
}

export const ExportButton = memo(({ activities }: ExportButtonProps) => {
  const { t } = useTranslation(['schedule', 'translation'])
  const { showSnackbar } = useSnackbar()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [format, setFormat] = useState<'csv' | 'json' | 'ical'>('json')
  const [fileName, setFileName] = useState(`schedule-${new Date().toISOString().split('T')[0]}`)

  const handleExport = () => {
    if (activities.length === 0) {
      showSnackbar(t('export.noActivities', { defaultValue: 'Nenhuma atividade para exportar.' }))
      return
    }

    const extension = format === 'ical' ? 'ics' : format
    exportSchedule(activities, format, `${fileName}.${extension}`)
    setIsDialogOpen(false)
  }

  return (
    <>
      <button
        className="weekly-schedule__icon-btn"
        onClick={() => setIsDialogOpen(true)}
        title={t('actions.export', { defaultValue: 'Exportar agendamento' })}
        aria-label={t('actions.export', { defaultValue: 'Exportar' })}
      >
        <MaterialIcon name="download" />
      </button>

      <BaseModal
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={t('export.title', { defaultValue: 'Exportar agendamento' })}
        icon="download"
        size="small"
        className="export-modal"
      >
        <div className="export-form">
          <div className="export-field">
            <label htmlFor="export-format" className="export-label">
              {t('export.format', { defaultValue: 'Formato' })}
            </label>
            <select
              id="export-format"
              value={format}
              onChange={(e) => setFormat(e.target.value as 'csv' | 'json' | 'ical')}
              className="export-select"
            >
              <option value="json">JSON</option>
              <option value="csv">CSV (Planilha)</option>
              <option value="ical">iCal (Calendário)</option>
            </select>
          </div>

          <div className="export-field">
            <label htmlFor="export-filename" className="export-label">
              {t('export.fileName', { defaultValue: 'Nome do arquivo' })}
            </label>
            <input
              id="export-filename"
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="export-input"
            />
            <span className="export-helper">
              {t('export.fileNameHelper', {
                defaultValue: 'Extensão será adicionada automaticamente',
              })}
            </span>
          </div>

          <div className="export-info">
            {format === 'json' && (
              <p>
                {t('export.jsonDescription', {
                  defaultValue: 'Exporta em formato JSON para importação posterior.',
                })}
              </p>
            )}
            {format === 'csv' && (
              <p>
                {t('export.csvDescription', {
                  defaultValue: 'Exporta em formato CSV compatível com Excel/Sheets.',
                })}
              </p>
            )}
            {format === 'ical' && (
              <p>
                {t('export.icalDescription', {
                  defaultValue: 'Exporta em formato iCalendar para sincronizar com seu calendário.',
                })}
              </p>
            )}
          </div>
          <div className="export-actions">
            <button
              type="button"
              onClick={() => setIsDialogOpen(false)}
              className="export-btn secondary"
            >
              {t('actions.cancel', { defaultValue: 'Cancelar' })}
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="export-btn primary"
            >
              <MaterialIcon name="download" />
              {t('actions.export', { defaultValue: 'Exportar' })}
            </button>
          </div>
        </div>
      </BaseModal>
    </>
  )
})

ExportButton.displayName = 'ExportButton'

export default ExportButton
