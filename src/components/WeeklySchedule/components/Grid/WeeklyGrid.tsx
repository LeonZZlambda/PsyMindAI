import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { addDays, format, isSameDay, startOfDay } from 'date-fns'
import { AnimatePresence, m } from 'framer-motion'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import MaterialIcon from '../../../MaterialIcon'
import { useScheduleCalculations } from '../../hooks/useScheduleCalculations'
import { useScheduleStore } from '../../store/useScheduleStore'
import { Activity, ActivityFormInput, DayOfWeek } from '../../types'
import ActivityCard from '../Cards/ActivityCard'
import ActivityForm from '../Forms/ActivityForm'
import CurrentTimeIndicator from '../CurrentTimeIndicator'
import ExportButton from '../ExportButton'
import ScheduleSearch from '../ScheduleSearch'

interface WeeklyGridProps {
  initialDate?: Date
}

interface TimeSlotCellProps {
  label: string
  rowHeight: number
}

const TimeSlotCell = memo(({ label, rowHeight }: TimeSlotCellProps) => (
  <div
    className="weekly-schedule__time-slot"
    style={{
      position: 'sticky',
      insetInlineStart: 0,
      width: 88,
      minWidth: 88,
      height: rowHeight,
      paddingLeft: 8,
      paddingRight: 8,
      paddingTop: 2,
      backgroundColor: 'var(--background-color)',
      zIndex: 2,
    }}
  >
    <span
      style={{
        fontSize: '0.75rem',
        opacity: 0.7,
        color: 'var(--text-color)',
      }}
    >
      {label}
    </span>
  </div>
))

const weekdays = ['EEE', 'dd/MM']
const dayOrder: DayOfWeek[] = [
  DayOfWeek.MONDAY,
  DayOfWeek.TUESDAY,
  DayOfWeek.WEDNESDAY,
  DayOfWeek.THURSDAY,
  DayOfWeek.FRIDAY,
  DayOfWeek.SATURDAY,
  DayOfWeek.SUNDAY,
]

const getDayName = (day: DayOfWeek, t: (key: string, options?: any) => string): string => {
  const dayNames: Record<DayOfWeek, string> = {
    [DayOfWeek.MONDAY]: t('days.MONDAY', { defaultValue: 'Mon' }),
    [DayOfWeek.TUESDAY]: t('days.TUESDAY', { defaultValue: 'Tue' }),
    [DayOfWeek.WEDNESDAY]: t('days.WEDNESDAY', { defaultValue: 'Wed' }),
    [DayOfWeek.THURSDAY]: t('days.THURSDAY', { defaultValue: 'Thu' }),
    [DayOfWeek.FRIDAY]: t('days.FRIDAY', { defaultValue: 'Fri' }),
    [DayOfWeek.SATURDAY]: t('days.SATURDAY', { defaultValue: 'Sat' }),
    [DayOfWeek.SUNDAY]: t('days.SUNDAY', { defaultValue: 'Sun' }),
  }
  return dayNames[day]
}

export const WeeklyGrid = ({ initialDate = new Date() }: WeeklyGridProps) => {
  const { t } = useTranslation(['schedule', 'translation'])
  const isMobile = false // TODO: Add proper mobile detection hook
  const {
    activities,
    settings,
    moveActivity,
    resizeActivity,
    upsertActivity,
    removeActivity,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useScheduleStore()
  const [selectedDay, setSelectedDay] = useState(1)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingActivity, setEditingActivity] = useState<Activity | undefined>()
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const weekStart = useMemo(() => startOfDay(initialDate), [initialDate])
  const days = useMemo(
    () => Array.from({ length: 7 }, (_, index) => addDays(weekStart, index)),
    [weekStart],
  )
  const dayColumns = useMemo(
    () => dayOrder.map((day, dayIndex) => ({ day, date: days[dayIndex], index: dayIndex })),
    [days],
  )

  const { slots, rowHeightPx, durationToPixels, timeToPixels, snapMinutes, pixelsToMinutes } =
    useScheduleCalculations({
      dayStartHour: settings.dayStartHour,
      dayEndHour: settings.dayEndHour,
      slotMinutes: settings.slotMinutes,
    })

  const headerDateLabel = useMemo(() => {
    const now = new Date()
    const dayName = format(now, 'EEEE')
    const day = format(now, 'dd')
    const month = format(now, 'MMMM')
    return `${t('today', { defaultValue: 'Hoje' })} • ${dayName}, ${day} ${t('of', { defaultValue: 'de' })} ${month}`
  }, [t])

  const onCardSelect = useCallback((activity: Activity) => {
    setEditingActivity(activity)
    setIsFormOpen(true)
  }, [])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        redo()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo])

  const onRequestResize = useCallback(
    (activityId: string, deltaPixels: number) => {
      const deltaMinutes = Math.round(deltaPixels / (rowHeightPx / settings.slotMinutes))
      const current = activities.find((item) => item.id === activityId)
      if (!current) return
      const nextDuration = snapMinutes(
        current.durationMinutes + deltaMinutes,
        settings.resizeStepMinutes,
      )
      resizeActivity(activityId, nextDuration)
    },
    [
      activities,
      resizeActivity,
      rowHeightPx,
      settings.resizeStepMinutes,
      settings.slotMinutes,
      snapMinutes,
    ],
  )

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      const [prefix, activityId, droppedDay] = String(event.active.id).split('::')
      if (prefix !== 'activity') return
      const activity = activities.find((item) => item.id === activityId)
      if (!activity) return

      const rawTop = timeToPixels(activity.startMinutes) + (event.delta.y || 0)
      const snappedStart = snapMinutes(pixelsToMinutes(rawTop), settings.resizeStepMinutes)
      moveActivity(activityId, droppedDay as DayOfWeek, snappedStart)
    },
    [
      activities,
      moveActivity,
      pixelsToMinutes,
      settings.resizeStepMinutes,
      snapMinutes,
      timeToPixels,
    ],
  )

  const submitForm = useCallback(
    (input: ActivityFormInput, activityId?: string) => {
      upsertActivity(input, activityId)
      setEditingActivity(undefined)
      setIsFormOpen(false)
    },
    [upsertActivity],
  )

  return (
    <div className="weekly-schedule">
      <div className="weekly-schedule__content">
        <ScheduleSearch
          activities={activities}
          onFilterChange={setFilteredActivities}
          onSearchChange={setSearchQuery}
        />

        <div className="weekly-schedule__toolbar">
          <div className="weekly-schedule__header-info">
            <h6 className="weekly-schedule__title">{headerDateLabel}</h6>
            <div className="weekly-schedule__pagination">
              {/* TODO: Custom pagination component */}
              <button
                onClick={() => setSelectedDay(Math.max(1, selectedDay - 1))}
                disabled={selectedDay === 1}
                className="weekly-schedule__pagination-btn"
              >
                ‹
              </button>
              <span>{selectedDay} / 7</span>
              <button
                onClick={() => setSelectedDay(Math.min(7, selectedDay + 1))}
                disabled={selectedDay === 7}
                className="weekly-schedule__pagination-btn"
              >
                ›
              </button>
            </div>
          </div>
          <div className="weekly-schedule__actions">
            <ExportButton
              activities={filteredActivities.length > 0 ? filteredActivities : activities}
            />
            <button
              className="weekly-schedule__icon-btn"
              onClick={undo}
              disabled={!canUndo()}
              title={t('actions.undo', { defaultValue: 'Desfazer (Ctrl+Z)' })}
              aria-label={t('actions.undo', { defaultValue: 'Desfazer' })}
            >
              <MaterialIcon name="undo" />
            </button>
            <button
              className="weekly-schedule__icon-btn"
              onClick={redo}
              disabled={!canRedo()}
              title={t('actions.redo', { defaultValue: 'Refazer (Ctrl+Y)' })}
              aria-label={t('actions.redo', { defaultValue: 'Refazer' })}
            >
              <MaterialIcon name="redo" />
            </button>
          </div>
        </div>

        {(filteredActivities.length === 0 && activities.length === 0) ||
        (searchQuery && filteredActivities.length === 0) ? (
          <div className="weekly-schedule__empty-state">
            <MaterialIcon name="calendar_month" className="weekly-schedule__empty-icon" />
            {searchQuery ? (
              <>
                <h6 className="weekly-schedule__empty-title">
                  {t('search.noResults', { defaultValue: 'Nenhuma atividade encontrada' })}
                </h6>
                <p className="weekly-schedule__empty-description">
                  {t('search.tryDifferent', {
                    defaultValue: 'Tente uma busca diferente.',
                  })}
                </p>
              </>
            ) : (
              <>
                <h6 className="weekly-schedule__empty-title">
                  {t('empty.title', { defaultValue: 'Sem atividades na semana' })}
                </h6>
                <p className="weekly-schedule__empty-description">
                  {t('empty.description', {
                    defaultValue: 'Comece criando sua primeira atividade.',
                  })}
                </p>
              </>
            )}
          </div>
        ) : null}

        <div className="weekly-schedule__alert">
          {t('resizeHint', {
            defaultValue: 'Arraste a base do card para redimensionar em passos configurados.',
          })}
        </div>

        <DndContext onDragEnd={onDragEnd} modifiers={[restrictToVerticalAxis]}>
          <div className="weekly-grid-shell">
            <div className="weekly-grid-container">
              <div className="weekly-grid-header">
                <div></div>
                {dayColumns.map(({ day, date, index }) => (
                  <div
                    key={date.toISOString()}
                    className="weekly-grid-header-day"
                    style={{
                      scrollSnapAlign: isMobile && selectedDay === index + 1 ? 'center' : undefined,
                    }}
                  >
                    <span className="weekly-grid-header-day-weekday">
                      {getDayName(day, t)}
                    </span>
                    <span
                      className={`weekly-grid-header-day-date ${
                        isSameDay(date, new Date()) ? 'today' : ''
                      }`}
                    >
                      {format(date, weekdays[1])}
                    </span>
                  </div>
                ))}
              </div>

              <div className="weekly-grid-body">
                {slots.map((slot) => (
                  <div key={slot.id} className="weekly-grid-row">
                    <TimeSlotCell label={slot.label} rowHeight={rowHeightPx} />
                    {dayColumns.map(({ date }) => (
                      <div
                        key={`${slot.id}-${date.toISOString()}`}
                        className="weekly-grid-cell"
                        style={{ height: rowHeightPx }}
                      />
                    ))}
                  </div>
                ))}

                {dayColumns.map(({ day, date, index }) => (
                  <div
                    key={`activities-layer-${day}`}
                    className="weekly-activities-layer"
                    style={{
                      insetInlineStart: isMobile ? `${88 + index * 128}px` : 0,
                      width: isMobile ? 128 : `calc((100% - 88px) / 7)`,
                      marginLeft: !isMobile ? `calc(88px + (${index} * ((100% - 88px) / 7)))` : 0,
                      height: rowHeightPx * slots.length,
                    }}
                  >
                    <CurrentTimeIndicator
                      dayIndex={index}
                      timeToPixels={timeToPixels}
                      rowHeightPx={rowHeightPx}
                      dayStartHour={settings.dayStartHour}
                      dayEndHour={settings.dayEndHour}
                    />
                    <AnimatePresence>
                      <m.div
                        initial="hidden"
                        animate="show"
                        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
                        style={{ position: 'relative', height: '100%' }}
                      >
                        {(filteredActivities.length > 0 ? filteredActivities : activities)
                          .filter(
                            (activity) =>
                              Array.isArray((activity as any).days) && activity.days.includes(day),
                          )
                          .map((activity) => (
                            <m.div
                              key={`${activity.id}-${day}`}
                              variants={{
                                hidden: { opacity: 0, y: 8 },
                                show: { opacity: 1, y: 0 },
                              }}
                            >
                              <ActivityCard
                                dayKey={day}
                                activity={activity}
                                top={timeToPixels(activity.startMinutes)}
                                height={durationToPixels(activity.durationMinutes)}
                                isDesktop={!isMobile}
                                onSelect={onCardSelect}
                                onRequestResize={onRequestResize}
                              />
                            </m.div>
                          ))}
                      </m.div>
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DndContext>
      </div>

      <button
        className="weekly-schedule__fab"
        aria-label={t('actions.new', { defaultValue: 'Novo' })}
        onClick={() => {
          setEditingActivity(undefined)
          setIsFormOpen(true)
        }}
      >
        <MaterialIcon name="add" />
      </button>

      <ActivityForm
        isOpen={isFormOpen}
        onClose={() => {
          setEditingActivity(undefined)
          setIsFormOpen(false)
        }}
        onSubmit={submitForm}
        onDelete={removeActivity}
        initialActivity={editingActivity}
      />
    </div>
  )
}

export default WeeklyGrid
