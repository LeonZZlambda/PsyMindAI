import { zodResolver } from '@hookform/resolvers/zod'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
} from '@mui/material'
import { useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import CustomSelect from '../../../CustomSelect'
import {
  Activity,
  ActivityColorPreset,
  ActivityFormInput,
  ActivityType,
  DayOfWeek,
} from '../../types'
import DurationPicker from './DurationPicker'
import TimePickerField from './TimePickerField'

interface ActivityFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (input: ActivityFormInput, activityId?: string) => void
  onDelete?: (activityId: string) => void
  initialActivity?: Activity
}

const activityTypeOptions = [
  ActivityType.CLASS,
  ActivityType.STUDY,
  ActivityType.REVIEW,
  ActivityType.EXTRA,
] as const

const urlOrEmpty = z
  .string()
  .trim()
  .optional()
  .refine((value) => !value || /^https?:\/\/.+/i.test(value), 'invalid_url')

const dayOptions = [
  DayOfWeek.MONDAY,
  DayOfWeek.TUESDAY,
  DayOfWeek.WEDNESDAY,
  DayOfWeek.THURSDAY,
  DayOfWeek.FRIDAY,
  DayOfWeek.SATURDAY,
  DayOfWeek.SUNDAY,
] as const

const colorPalette: Array<{ preset: ActivityColorPreset; color: string }> = [
  { preset: ActivityColorPreset.PRIMARY, color: '#8B5CF6' }, // Purple - better contrast in both modes
  { preset: ActivityColorPreset.SECONDARY, color: '#06B6D4' }, // Cyan - good visibility
  { preset: ActivityColorPreset.TERTIARY, color: '#F59E0B' }, // Amber - stands out well
  { preset: ActivityColorPreset.ERROR, color: '#EF4444' }, // Red - maintains visibility
  { preset: ActivityColorPreset.CUSTOM, color: '#6B7280' }, // Gray - neutral
]

const formSchema = z.object({
  title: z.string().trim().min(2, 'title_min'),
  description: z.string().trim().optional(),
  type: z.nativeEnum(ActivityType),
  days: z.array(z.nativeEnum(DayOfWeek)).min(1, 'day_required'),
  startMinutes: z
    .number()
    .int()
    .min(0)
    .max(24 * 60),
  durationMinutes: z
    .number()
    .int()
    .min(15)
    .max(12 * 60),
  colorPreset: z.nativeEnum(ActivityColorPreset),
  customColor: z.string().trim().optional(),
  locationUrl: urlOrEmpty,
  meetingUrl: urlOrEmpty,
})

type FormSchema = z.infer<typeof formSchema>

const defaultValues: FormSchema = {
  title: '',
  description: '',
  type: ActivityType.STUDY,
  days: [DayOfWeek.MONDAY],
  startMinutes: 8 * 60,
  durationMinutes: 60,
  colorPreset: ActivityColorPreset.PRIMARY,
  customColor: '#6750A4',
  locationUrl: '',
  meetingUrl: '',
}

export const ActivityForm = ({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  initialActivity,
}: ActivityFormProps) => {
  const { t } = useTranslation()
  const resolver = useMemo(() => zodResolver(formSchema), [])

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormSchema>({
    resolver,
    defaultValues: initialActivity
      ? {
          ...initialActivity,
          colorPreset: initialActivity.color.preset,
          customColor: initialActivity.color.value,
        }
      : defaultValues,
  })

  const handleClose = () => {
    reset(initialActivity ? { ...initialActivity } : defaultValues)
    onClose()
  }

  const handleDeleteClick = () => {
    if (
      initialActivity &&
      onDelete &&
      window.confirm(
        t('schedule.form.deleteConfirm', {
          defaultValue: 'Tem certeza que deseja deletar esta atividade?',
        }),
      )
    ) {
      onDelete(initialActivity.id)
      handleClose()
    }
  }

  const internalSubmit = (values: FormSchema) => {
    const selectedPalette = colorPalette.find((item) => item.preset === values.colorPreset)
    const colorValue =
      values.colorPreset === ActivityColorPreset.CUSTOM
        ? values.customColor || '#5F6368'
        : selectedPalette?.color || '#6750A4'

    const payload: ActivityFormInput = {
      title: values.title,
      description: values.description,
      type: values.type,
      days: values.days,
      startMinutes: values.startMinutes,
      durationMinutes: values.durationMinutes,
      color: {
        preset: values.colorPreset,
        value: colorValue,
      },
      locationUrl: values.locationUrl,
      meetingUrl: values.meetingUrl,
    }

    onSubmit(payload, initialActivity?.id)
    handleClose()
  }

  return (
    <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pr: 1,
          textAlign: 'center',
        }}
      >
        <span>
          {t(initialActivity ? 'schedule.form.edit' : 'schedule.form.new', {
            defaultValue: 'Nova atividade',
          })}
        </span>
        {initialActivity && (
          <IconButton
            size="small"
            color="error"
            onClick={handleDeleteClick}
            aria-label={t('schedule.actions.delete', { defaultValue: 'Deletar' })}
            title={t('schedule.actions.delete', { defaultValue: 'Deletar' })}
            sx={{ borderRadius: '50%' }}
          >
            <DeleteIcon />
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            {...register('title')}
            label={t('schedule.form.title', { defaultValue: 'Titulo' })}
            variant="outlined"
            error={Boolean(errors.title)}
            helperText={
              errors.title
                ? t('schedule.form.errors.title', { defaultValue: 'Informe um titulo valido.' })
                : undefined
            }
          />

          <TextField
            {...register('description')}
            label={t('schedule.form.description', { defaultValue: 'Descricao' })}
            multiline
            minRows={3}
            variant="outlined"
          />

          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <CustomSelect
                className="weekly-schedule-select"
                value={field.value}
                onChange={(value) => field.onChange(value as ActivityType)}
                options={activityTypeOptions.map((option) => ({
                  value: option,
                  label: t(`schedule.type.${option}`, { defaultValue: option }),
                }))}
                ariaLabel={t('schedule.form.type', { defaultValue: 'Tipo' })}
              />
            )}
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Controller
              control={control}
              name="days"
              render={({ field }) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, flex: 1 }}>
                  {dayOptions.map((day) => {
                    const isSelected = field.value.includes(day)
                    return (
                      <Chip
                        key={day}
                        label={t(`schedule.days.${day}`, { defaultValue: day.slice(0, 3) })}
                        variant={isSelected ? 'filled' : 'outlined'}
                        color={isSelected ? 'primary' : 'default'}
                        onClick={() => {
                          field.onChange(
                            isSelected
                              ? field.value.filter((value) => value !== day)
                              : [...field.value, day],
                          )
                        }}
                        sx={{ borderRadius: '16px' }}
                      />
                    )
                  })}
                </Box>
              )}
            />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Controller
              control={control}
              name="startMinutes"
              render={({ field }) => (
                <Box sx={{ flex: 1 }}>
                  <TimePickerField
                    label={t('schedule.form.start', { defaultValue: 'Hora de início' })}
                    minutes={field.value}
                    onChange={field.onChange}
                  />
                </Box>
              )}
            />
            <Controller
              control={control}
              name="durationMinutes"
              render={({ field }) => (
                <Box sx={{ flex: 1 }}>
                  <DurationPicker
                    label={t('schedule.form.duration', { defaultValue: 'Duração' })}
                    minutes={field.value}
                    onChange={field.onChange}
                  />
                </Box>
              )}
            />
          </Stack>

          <Controller
            control={control}
            name="colorPreset"
            render={({ field }) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {colorPalette.map((item) => (
                  <Chip
                    key={item.preset}
                    label={t(`schedule.colors.${item.preset}`, { defaultValue: item.preset })}
                    onClick={() => field.onChange(item.preset)}
                    variant={field.value === item.preset ? 'filled' : 'outlined'}
                    sx={{
                      borderColor: item.color,
                      bgcolor: field.value === item.preset ? item.color : 'transparent',
                      color: field.value === item.preset ? '#fff' : 'inherit',
                      borderRadius: '16px',
                    }}
                  />
                ))}
              </Box>
            )}
          />
          <Controller
            control={control}
            name="colorPreset"
            render={({ field }) => (
              <>
                {field.value === ActivityColorPreset.CUSTOM ? (
                  <TextField
                    {...register('customColor')}
                    label={t('schedule.form.customColor', {
                      defaultValue: 'Cor customizada (Hex/RGB)',
                    })}
                    variant="outlined"
                  />
                ) : (
                  <></>
                )}
              </>
            )}
          />
          <TextField
            {...register('meetingUrl')}
            label={t('schedule.form.meetingUrl', { defaultValue: 'Link rapido' })}
            variant="outlined"
          />
          <TextField
            {...register('locationUrl')}
            label={t('schedule.form.locationUrl', { defaultValue: 'Maps URL' })}
            variant="outlined"
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 2, gap: 1 }}>
        <Button
          onClick={handleClose}
          sx={{ borderRadius: '20px', px: 3, textTransform: 'none', fontWeight: 500 }}
        >
          {t('schedule.actions.cancel', { defaultValue: 'Cancelar' })}
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit(internalSubmit)}
          disabled={isSubmitting}
          sx={{ borderRadius: '20px', px: 3, textTransform: 'none', fontWeight: 500 }}
        >
          {t('schedule.actions.save', { defaultValue: 'Salvar' })}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ActivityForm
