import { Box, Typography } from '@mui/material'
import { memo, useEffect, useMemo, useState } from 'react'

interface CurrentTimeIndicatorProps {
  dayIndex: number
  timeToPixels: (minutes: number) => number
  rowHeightPx: number
  dayStartHour: number
  dayEndHour: number
}

export const CurrentTimeIndicator = memo(
  ({
    dayIndex,
    timeToPixels,
    rowHeightPx,
    dayStartHour,
    dayEndHour,
  }: CurrentTimeIndicatorProps) => {
    const [currentMinutes, setCurrentMinutes] = useState<number | null>(null)

    useEffect(() => {
      // Only show on today's column
      const now = new Date()
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const todayStart = today.getTime()
      const todayEnd = todayStart + 24 * 60 * 60 * 1000

      if (now.getTime() < todayStart || now.getTime() > todayEnd) {
        return // Not today
      }

      const minutes = now.getHours() * 60 + now.getMinutes()
      if (minutes >= dayStartHour * 60 && minutes <= dayEndHour * 60) {
        setCurrentMinutes(minutes)
      }

      // Update every minute
      const interval = setInterval(() => {
        const updated = new Date()
        const updatedMinutes = updated.getHours() * 60 + updated.getMinutes()
        if (updatedMinutes >= dayStartHour * 60 && updatedMinutes <= dayEndHour * 60) {
          setCurrentMinutes(updatedMinutes)
        }
      }, 60000)

      return () => clearInterval(interval)
    }, [dayStartHour, dayEndHour])

    if (currentMinutes === null) {
      return null
    }

    const top = timeToPixels(currentMinutes)

    return (
      <Box
        sx={{
          position: 'absolute',
          top,
          insetInlineStart: 0,
          insetInlineEnd: 0,
          height: 2,
          bgcolor: 'error.main',
          zIndex: 10,
          '&::before': {
            content: '""',
            position: 'absolute',
            insetInlineStart: -8,
            top: -3,
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: 'error.main',
          },
        }}
      />
    )
  },
)

CurrentTimeIndicator.displayName = 'CurrentTimeIndicator'

export default CurrentTimeIndicator
