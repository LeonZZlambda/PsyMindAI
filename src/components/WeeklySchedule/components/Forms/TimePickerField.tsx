import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import { memo, useCallback, useMemo } from 'react'

interface TimePickerFieldProps {
  label: string
  minutes: number
  onChange: (minutes: number) => void
}

/**
 * Converts minutes since midnight to HH:MM format
 */
const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
}

/**
 * Converts HH:MM format to minutes since midnight
 */
const timeToMinutes = (time: string): number => {
  const [hours, mins] = time.split(':').map(Number)
  return (hours || 0) * 60 + (mins || 0)
}

export const TimePickerField = memo(({ label, minutes, onChange }: TimePickerFieldProps) => {
  const timeValue = useMemo(() => minutesToTime(minutes), [minutes])

  const handleTimeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTime = e.target.value
      if (newTime) {
        onChange(timeToMinutes(newTime))
      }
    },
    [onChange],
  )

  const handleQuickSet = useCallback(
    (newMinutes: number) => {
      onChange(newMinutes)
    },
    [onChange],
  )

  return (
    <Stack spacing={1} sx={{ width: '100%' }}>
      <TextField
        type="time"
        label={label}
        value={timeValue}
        onChange={handleTimeChange}
        variant="outlined"
        fullWidth
        slotProps={{
          inputLabel: {
            shrink: true,
          },
        }}
      />
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { label: '08:00', minutes: 8 * 60 },
          { label: '09:00', minutes: 9 * 60 },
          { label: '12:00', minutes: 12 * 60 },
          { label: '14:00', minutes: 14 * 60 },
          { label: '17:00', minutes: 17 * 60 },
          { label: '19:00', minutes: 19 * 60 },
        ].map(({ label: btnLabel, minutes: btnMinutes }) => (
          <Button
            key={btnLabel}
            size="small"
            variant={timeValue === btnLabel ? 'contained' : 'outlined'}
            onClick={() => handleQuickSet(btnMinutes)}
            sx={{ borderRadius: '20px', textTransform: 'none', fontWeight: 500 }}
          >
            {btnLabel}
          </Button>
        ))}
      </Box>
    </Stack>
  )
})

TimePickerField.displayName = 'TimePickerField'

export default TimePickerField
