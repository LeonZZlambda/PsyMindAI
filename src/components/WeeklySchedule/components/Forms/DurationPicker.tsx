import { Box, Button, Stack, TextField } from '@mui/material'
import { memo, useCallback, useMemo } from 'react'

interface DurationPickerProps {
  label: string
  minutes: number
  onChange: (minutes: number) => void
}

const minutesToDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) {
    return `${mins}m`
  }
  if (mins === 0) {
    return `${hours}h`
  }
  return `${hours}h ${mins}m`
}

export const DurationPicker = memo(({ label, minutes, onChange }: DurationPickerProps) => {
  const displayDuration = useMemo(() => minutesToDuration(minutes), [minutes])

  const handleMinutesChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10)
      if (!isNaN(value) && value >= 15) {
        onChange(value)
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
        type="number"
        label={label}
        value={minutes}
        onChange={handleMinutesChange}
        variant="outlined"
        fullWidth
        inputProps={{ min: 15, step: 15 }}
      />
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { label: '15m', minutes: 15 },
          { label: '30m', minutes: 30 },
          { label: '45m', minutes: 45 },
          { label: '1h', minutes: 60 },
          { label: '1.5h', minutes: 90 },
          { label: '2h', minutes: 120 },
        ].map(({ label: btnLabel, minutes: btnMinutes }) => (
          <Button
            key={btnLabel}
            size="small"
            variant={minutes === btnMinutes ? 'contained' : 'outlined'}
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

DurationPicker.displayName = 'DurationPicker'

export default DurationPicker
