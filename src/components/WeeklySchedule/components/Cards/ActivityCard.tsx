import { useDraggable } from '@dnd-kit/core'
import LinkIcon from '@mui/icons-material/Link'
import MapIcon from '@mui/icons-material/Map'
import { Box, IconButton, Typography } from '@mui/material'
import { memo, PointerEvent as ReactPointerEvent, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Activity } from '../../types'

interface ActivityCardProps {
  activity: Activity
  dayKey: string
  top: number
  height: number
  isDesktop: boolean
  onSelect: (activity: Activity) => void
  onRequestResize: (activityId: string, deltaPixels: number) => void
}

const LONG_PRESS_MS = 420

const withOpacity = (hexColor: string, alpha: number) => {
  const sanitized = hexColor.replace('#', '')
  const normalized =
    sanitized.length === 3
      ? sanitized
          .split('')
          .map((char) => `${char}${char}`)
          .join('')
      : sanitized
  const int = Number.parseInt(normalized, 16)
  const r = (int >> 16) & 255
  const g = (int >> 8) & 255
  const b = int & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const ActivityCardComponent = ({
  activity,
  dayKey,
  top,
  height,
  isDesktop,
  onSelect,
  onRequestResize,
}: ActivityCardProps) => {
  const { t } = useTranslation()
  const longPressRef = useRef<number | null>(null)
  const initialYRef = useRef<number | null>(null)

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `activity::${activity.id}::${dayKey}`,
  })

  useEffect(
    () => () => {
      if (longPressRef.current) {
        window.clearTimeout(longPressRef.current)
      }
    },
    [],
  )

  const onTouchStart = () => {
    longPressRef.current = window.setTimeout(() => onSelect(activity), LONG_PRESS_MS)
  }

  const onTouchEnd = () => {
    if (longPressRef.current) {
      window.clearTimeout(longPressRef.current)
      longPressRef.current = null
    }
  }

  const onResizePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.stopPropagation()
    initialYRef.current = event.clientY
    const onPointerMove = (moveEvent: PointerEvent) => {
      if (initialYRef.current === null) return
      onRequestResize(activity.id, moveEvent.clientY - initialYRef.current)
    }
    const onPointerUp = () => {
      initialYRef.current = null
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
  }

  return (
    <Box
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={() => onSelect(activity)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      sx={{
        position: 'absolute',
        left: 6,
        right: 6,
        top,
        height,
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        borderRadius: 3,
        bgcolor: withOpacity(activity.color.value, 0.2),
        border: '1px solid',
        borderColor: 'var(--border-color)',
        boxShadow: 1,
        display: 'flex',
        overflow: 'hidden',
        cursor: 'grab',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 4,
          bgcolor: withOpacity(activity.color.value, 0.3),
        },
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: 'primary.main',
          outlineOffset: 2,
        },
        minHeight: { xs: 44, sm: 56 }, // Better touch targets on mobile
      }}
      className="weekly-activity-card"
      role="button"
      tabIndex={0}
      aria-label={`${activity.title} - ${activity.type}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(activity)
        }
      }}
    >
      <Box sx={{ width: 6, bgcolor: activity.color.value, flexShrink: 0 }} />
      <Box sx={{ flex: 1, p: isDesktop ? 1.5 : 1 }}>
        <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: 500 }}>
          {t(`schedule.type.${activity.type}`, { defaultValue: activity.type })}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {activity.title}
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
          {activity.meetingUrl ? (
            <IconButton
              size="small"
              component="a"
              href={activity.meetingUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={t('schedule.actions.openMeeting', { defaultValue: 'Abrir meeting' })}
              onClick={(e) => e.stopPropagation()}
            >
              <LinkIcon fontSize="inherit" />
            </IconButton>
          ) : null}
          {activity.locationUrl ? (
            <IconButton
              size="small"
              component="a"
              href={activity.locationUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={t('schedule.actions.openLocation', { defaultValue: 'Abrir localização' })}
              onClick={(e) => e.stopPropagation()}
            >
              <MapIcon fontSize="inherit" />
            </IconButton>
          ) : null}
        </Box>
      </Box>
      <Box
        onPointerDown={onResizePointerDown}
        sx={{
          width: '100%',
          height: 10,
          position: 'absolute',
          bottom: 0,
          cursor: 'ns-resize',
          bgcolor: 'transparent',
        }}
        role="slider"
        aria-label={t('schedule.actions.resize', { defaultValue: 'Redimensionar duração' })}
      />
    </Box>
  )
}

export const ActivityCard = memo(ActivityCardComponent)

export default ActivityCard
