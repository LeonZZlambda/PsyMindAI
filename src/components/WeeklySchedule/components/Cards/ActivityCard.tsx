import { useDraggable } from '@dnd-kit/core'
import { memo, PointerEvent as ReactPointerEvent, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import MaterialIcon from '../../../MaterialIcon'
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
  const { t } = useTranslation(['schedule', 'translation'])
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
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={() => onSelect(activity)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="weekly-schedule__activity"
      style={{
        top: `${top}px`,
        height: `${height}px`,
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        '--activity-bg-color': withOpacity(activity.color.value, 0.15),
        minHeight: isDesktop ? '56px' : '44px',
      } as React.CSSProperties}
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
      <div
        className="weekly-schedule__activity-color-bar"
        style={{ backgroundColor: activity.color.value }}
      />
      <div className="weekly-schedule__activity-content">
        <span className="weekly-schedule__activity-type">
          {t(`type.${activity.type}`, { defaultValue: activity.type })}
        </span>
        <div className="weekly-schedule__activity-title">{activity.title}</div>
        {activity.description && (
          <div className="weekly-schedule__activity-description">
            {activity.description.length > 50
              ? `${activity.description.substring(0, 50)}...`
              : activity.description}
          </div>
        )}
        <div className="weekly-schedule__activity-actions">
          {activity.meetingUrl ? (
            <a
              href={activity.meetingUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={t('actions.openMeeting', { defaultValue: 'Abrir meeting' })}
              onClick={(e) => e.stopPropagation()}
              className="weekly-schedule__activity-action-btn"
            >
              <MaterialIcon name="link" />
            </a>
          ) : null}
          {activity.locationUrl ? (
            <a
              href={activity.locationUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={t('actions.openLocation', { defaultValue: 'Abrir localização' })}
              onClick={(e) => e.stopPropagation()}
              className="weekly-schedule__activity-action-btn"
            >
              <MaterialIcon name="map" />
            </a>
          ) : null}
        </div>
      </div>
      <div
        onPointerDown={onResizePointerDown}
        className="weekly-schedule__resize-handle"
        role="slider"
        aria-label={t('actions.resize', { defaultValue: 'Redimensionar duração' })}
      >
        <MaterialIcon name="height" />
      </div>
    </div>
  )
}

export const ActivityCard = memo(ActivityCardComponent)

export default ActivityCard
