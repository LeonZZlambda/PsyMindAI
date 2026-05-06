import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import AddIcon from '@mui/icons-material/Add'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import RedoIcon from '@mui/icons-material/Redo'
import UndoIcon from '@mui/icons-material/Undo'
import {
  Alert,
  Box,
  Fab,
  IconButton,
  Pagination,
  Paper,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { addDays, format, isSameDay, startOfDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { AnimatePresence, m } from 'framer-motion'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
  <Box
    sx={{
      position: 'sticky',
      left: 0,
      width: 88,
      minWidth: 88,
      height: rowHeight,
      px: 1,
      pt: 0.5,
      bgcolor: 'background.default',
      zIndex: 2,
    }}
  >
    <Typography variant="caption" sx={{ opacity: 0.7 }}>
      {label}
    </Typography>
  </Box>
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

export const WeeklyGrid = ({ initialDate = new Date() }: WeeklyGridProps) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
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
    return `${t('schedule.today', { defaultValue: 'Hoje' })} • ${format(now, "EEEE, dd 'de' MMMM", { locale: ptBR })}`
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
    <Box>
      <Stack spacing={2}>
        <ScheduleSearch
          activities={activities}
          onFilterChange={setFilteredActivities}
          onSearchChange={setSearchQuery}
        />

        <Toolbar sx={{ px: 0, minHeight: 'auto', justifyContent: 'space-between' }}>
          <Stack spacing={1} sx={{ alignItems: 'center', flex: 1 }}>
            <Typography variant="h6" sx={{ textAlign: 'center' }}>
              {headerDateLabel}
            </Typography>
            <Pagination
              page={selectedDay}
              onChange={(_, page) => setSelectedDay(page)}
              count={7}
              color="primary"
              sx={{ mx: 'auto' }}
            />
          </Stack>
          <Stack direction="row" spacing={1}>
            <ExportButton
              activities={filteredActivities.length > 0 ? filteredActivities : activities}
            />
            <Tooltip title={t('schedule.actions.undo', { defaultValue: 'Desfazer (Ctrl+Z)' })}>
              <span>
                <IconButton
                  size="small"
                  onClick={undo}
                  disabled={!canUndo()}
                  aria-label={t('schedule.actions.undo', { defaultValue: 'Desfazer' })}
                >
                  <UndoIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title={t('schedule.actions.redo', { defaultValue: 'Refazer (Ctrl+Y)' })}>
              <span>
                <IconButton
                  size="small"
                  onClick={redo}
                  disabled={!canRedo()}
                  aria-label={t('schedule.actions.redo', { defaultValue: 'Refazer' })}
                >
                  <RedoIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        </Toolbar>

        {(filteredActivities.length === 0 && activities.length === 0) ||
        (searchQuery && filteredActivities.length === 0) ? (
          <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderRadius: 4 }}>
            <CalendarMonthIcon sx={{ fontSize: 42, opacity: 0.7 }} />
            {searchQuery ? (
              <>
                <Typography variant="h6">
                  {t('schedule.search.noResults', { defaultValue: 'Nenhuma atividade encontrada' })}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('schedule.search.tryDifferent', {
                    defaultValue: 'Tente uma busca diferente.',
                  })}
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="h6">
                  {t('schedule.empty.title', { defaultValue: 'Sem atividades na semana' })}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('schedule.empty.description', {
                    defaultValue: 'Comece criando sua primeira atividade.',
                  })}
                </Typography>
              </>
            )}
          </Paper>
        ) : null}

        <Alert severity="info">
          {t('schedule.resizeHint', {
            defaultValue: 'Arraste a base do card para redimensionar em passos configurados.',
          })}
        </Alert>

        <DndContext onDragEnd={onDragEnd} modifiers={[restrictToVerticalAxis]}>
          <Box
            className="weekly-grid-shell bg-surface-container-lowest border-outline-variant"
            sx={{
              overflowX: { xs: 'auto', md: 'hidden' },
              scrollSnapType: isMobile ? 'x mandatory' : 'none',
              borderRadius: 3,
              bgcolor: 'var(--background-color)',
            }}
          >
            <Box sx={{ minWidth: { xs: 840, md: '100%' } }}>
              <Box
                className="weekly-grid-header"
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '88px repeat(7, 128px)',
                    md: '88px repeat(7, minmax(0, 1fr))',
                  },
                  position: 'sticky',
                  top: 0,
                  zIndex: 4,
                  bgcolor: 'var(--secondary-color)',
                }}
              >
                <Box sx={{}} />
                {dayColumns.map(({ date, index }) => (
                  <Box
                    key={date.toISOString()}
                    sx={{
                      minWidth: 0,
                      py: 1,
                      textAlign: 'center',
                      scrollSnapAlign: isMobile
                        ? selectedDay === index + 1
                          ? 'center'
                          : undefined
                        : undefined,
                    }}
                  >
                    <Typography variant="caption" sx={{ display: 'block', opacity: 0.7 }}>
                      {format(date, weekdays[0], { locale: ptBR })}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: isSameDay(date, new Date()) ? 700 : 500 }}
                    >
                      {format(date, weekdays[1], { locale: ptBR })}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box sx={{ position: 'relative' }}>
                {slots.map((slot) => (
                  <Box
                    key={slot.id}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: '88px repeat(7, 128px)',
                        md: '88px repeat(7, minmax(0, 1fr))',
                      },
                    }}
                  >
                    <TimeSlotCell label={slot.label} rowHeight={rowHeightPx} />
                    {dayColumns.map(({ date }) => (
                      <Box
                        key={`${slot.id}-${date.toISOString()}`}
                        sx={{
                          minWidth: 0,
                          height: rowHeightPx,
                          borderBottom: '1px solid',
                          borderColor: 'color-mix(in srgb, var(--border-color) 40%, transparent)',
                        }}
                      />
                    ))}
                  </Box>
                ))}

                {dayColumns.map(({ day, date, index }) => (
                  <Box
                    key={`activities-layer-${day}`}
                    sx={{
                      position: 'absolute',
                      left: {
                        xs: `${88 + dayColumns.findIndex((column) => column.day === day) * 128}px`,
                        md: 0,
                      },
                      top: 0,
                      width: { xs: 128, md: `calc((100% - 88px) / 7)` },
                      ml: {
                        md: `calc(88px + (${dayColumns.findIndex((column) => column.day === day)} * ((100% - 88px) / 7))`,
                      },
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
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </DndContext>
      </Stack>

      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 32, right: 32 }}
        aria-label={t('schedule.actions.new', { defaultValue: 'Novo' })}
        onClick={() => {
          setEditingActivity(undefined)
          setIsFormOpen(true)
        }}
      >
        <AddIcon />
      </Fab>

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
    </Box>
  )
}

export default WeeklyGrid
