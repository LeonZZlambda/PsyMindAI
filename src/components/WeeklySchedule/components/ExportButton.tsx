import DownloadIcon from '@mui/icons-material/Download'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material'
import { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Activity } from '../types'
import { exportSchedule } from '../utils/exportSchedule'

interface ExportButtonProps {
  activities: Activity[]
}

export const ExportButton = memo(({ activities }: ExportButtonProps) => {
  const { t } = useTranslation()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [format, setFormat] = useState<'csv' | 'json' | 'ical'>('json')
  const [fileName, setFileName] = useState(`schedule-${new Date().toISOString().split('T')[0]}`)

  const handleExport = () => {
    if (activities.length === 0) {
      alert(t('schedule.export.noActivities', { defaultValue: 'Nenhuma atividade para exportar.' }))
      return
    }

    const extension = format === 'ical' ? 'ics' : format
    exportSchedule(activities, format, `${fileName}.${extension}`)
    setIsDialogOpen(false)
  }

  return (
    <>
      <Tooltip title={t('schedule.actions.export', { defaultValue: 'Exportar agendamento' })}>
        <IconButton
          size="small"
          onClick={() => setIsDialogOpen(true)}
          aria-label={t('schedule.actions.export', { defaultValue: 'Exportar' })}
        >
          <DownloadIcon />
        </IconButton>
      </Tooltip>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>
          {t('schedule.export.title', { defaultValue: 'Exportar agendamento' })}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              select
              label={t('schedule.export.format', { defaultValue: 'Formato' })}
              value={format}
              onChange={(e) => setFormat(e.target.value as 'csv' | 'json' | 'ical')}
              fullWidth
            >
              <MenuItem value="json">JSON</MenuItem>
              <MenuItem value="csv">CSV (Planilha)</MenuItem>
              <MenuItem value="ical">iCal (Calendário)</MenuItem>
            </TextField>

            <TextField
              label={t('schedule.export.fileName', { defaultValue: 'Nome do arquivo' })}
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              fullWidth
              helperText={t('schedule.export.fileNameHelper', {
                defaultValue: 'Extensão será adicionada automaticamente',
              })}
            />

            <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
              {format === 'json' && (
                <p>
                  {t('schedule.export.jsonDescription', {
                    defaultValue: 'Exporta em formato JSON para importação posterior.',
                  })}
                </p>
              )}
              {format === 'csv' && (
                <p>
                  {t('schedule.export.csvDescription', {
                    defaultValue: 'Exporta em formato CSV compatível com Excel/Sheets.',
                  })}
                </p>
              )}
              {format === 'ical' && (
                <p>
                  {t('schedule.export.icalDescription', {
                    defaultValue:
                      'Exporta em formato iCalendar para sincronizar com seu calendário.',
                  })}
                </p>
              )}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 1, pb: 2 }}>
          <Button
            onClick={() => setIsDialogOpen(false)}
            sx={{ borderRadius: '20px', px: 3, textTransform: 'none' }}
          >
            {t('schedule.actions.cancel', { defaultValue: 'Cancelar' })}
          </Button>
          <Button
            variant="contained"
            onClick={handleExport}
            startIcon={<DownloadIcon />}
            sx={{ borderRadius: '20px', px: 3, textTransform: 'none' }}
          >
            {t('schedule.actions.export', { defaultValue: 'Exportar' })}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
})

ExportButton.displayName = 'ExportButton'

export default ExportButton
