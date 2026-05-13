import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import BaseModal from '../../../BaseModal'
import CustomSelect from '../../../CustomSelect'
import MaterialIcon from '../../../MaterialIcon'
import {
  Activity,
  ActivityColorPreset,
  ActivityFormInput,
  ActivityType,
  DayOfWeek,
} from '../../types'
import DurationPicker from './DurationPicker'
import TimePickerField from './TimePickerField'

/**
 * Calculates the best contrasting color (black or white) for a given hex/rgb background
 */
const getContrastingColor = (bgColor: string): string => {
  if (!bgColor) return '#fff'

  // Standardize color to RGB
  let r, g, b

  // Handle color names (basic support for common ones)
  const colorNames: Record<string, string> = {
    white: '#ffffff',
    black: '#000000',
    red: '#ff0000',
    green: '#00ff00',
    blue: '#0000ff',
    yellow: '#ffff00',
    cyan: '#00ffff',
    magenta: '#ff00ff',
    silver: '#c0c0c0',
    gray: '#808080',
    grey: '#808080',
    maroon: '#800000',
    olive: '#808000',
    purple: '#800080',
    teal: '#008080',
    navy: '#000080',
  }

  let color = bgColor.toLowerCase().trim()
  if (colorNames[color]) {
    color = colorNames[color]
  }

  if (color.startsWith('#')) {
    const hex = color.replace('#', '')
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16)
      g = parseInt(hex[1] + hex[1], 16)
      b = parseInt(hex[2] + hex[2], 16)
    } else {
      r = parseInt(hex.substring(0, 2), 16)
      g = parseInt(hex.substring(2, 4), 16)
      b = parseInt(hex.substring(4, 6), 16)
    }
  } else if (color.startsWith('rgb')) {
    const rgbValues = color.match(/\d+/g)
    if (rgbValues && rgbValues.length >= 3) {
      r = parseInt(rgbValues[0])
      g = parseInt(rgbValues[1])
      b = parseInt(rgbValues[2])
    }
  }

  if (r === undefined || g === undefined || b === undefined || isNaN(r) || isNaN(g) || isNaN(b)) {
    return '#fff'
  }

  // HSP equation for perceived brightness
  const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b))

  // If brightness is more than 155 (out of 255), use black text
  return hsp > 155 ? '#000000' : '#ffffff'
}

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
  const { t } = useTranslation(['schedule', 'translation'])
  const resolver = useMemo(() => zodResolver(formSchema), [])

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
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

  // Watch customColor for dynamic color updates
  const customColorValue = useWatch({
    control,
    name: 'customColor',
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
        t('form.deleteConfirm', {
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
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={t(initialActivity ? 'form.edit' : 'form.new', {
        defaultValue: 'Nova atividade',
      })}
      icon="event"
      size="small"
      className="activity-form-modal"
    >
      <div className="activity-form-content">
        <form className="activity-form-grid" onSubmit={handleSubmit(internalSubmit)}>
          <div className="activity-form-field full-width">
            <label htmlFor="title" className="activity-form-label">
              {t('form.title', { defaultValue: 'Titulo' })}
            </label>
            <div className="activity-form-input-wrapper">
              <input
                {...register('title')}
                id="title"
                type="text"
                className={`activity-form-input ${errors.title ? 'error' : ''}`}
                placeholder={t('form.title', { defaultValue: 'Titulo' })}
              />
              {initialActivity && (
                <button
                  type="button"
                  className="activity-form-delete-btn"
                  onClick={handleDeleteClick}
                  aria-label={t('actions.delete', { defaultValue: 'Deletar' })}
                  title={t('actions.delete', { defaultValue: 'Deletar' })}
                >
                  <MaterialIcon name="delete" />
                </button>
              )}
            </div>
            {errors.title && (
              <span className="activity-form-error">
                {t('form.errors.title', { defaultValue: 'Informe um titulo valido.' })}
              </span>
            )}
          </div>

          <div className="activity-form-field full-width">
            <label htmlFor="description" className="activity-form-label">
              {t('form.description', { defaultValue: 'Descricao' })}
            </label>
            <textarea
              {...register('description')}
              id="description"
              className="activity-form-textarea"
              rows={3}
              placeholder={t('form.description', { defaultValue: 'Descricao' })}
            />
          </div>

          <div className="activity-form-field full-width">
            <label className="activity-form-label">
              {t('form.type', { defaultValue: 'Tipo' })}
            </label>
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
                    label: t(`type.${option}`, { defaultValue: option }),
                  }))}
                  ariaLabel={t('form.type', { defaultValue: 'Tipo' })}
                />
              )}
            />
          </div>

          <div className="activity-form-field full-width">
            <label className="activity-form-label">
              {t('form.days', { defaultValue: 'Dias' })}
            </label>
            <Controller
              control={control}
              name="days"
              render={({ field }) => (
                <div className="activity-form-days">
                  {dayOptions.map((day) => {
                    const isSelected = field.value.includes(day)
                    return (
                      <button
                        key={day}
                        type="button"
                        className={`activity-form-day-chip ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          field.onChange(
                            isSelected
                              ? field.value.filter((value) => value !== day)
                              : [...field.value, day],
                          )
                        }}
                      >
                        {t(`days.${day}`, { defaultValue: day.slice(0, 3) })}
                      </button>
                    )
                  })}
                </div>
              )}
            />
          </div>

          <div className="activity-form-time-row full-width">
            <Controller
              control={control}
              name="startMinutes"
              render={({ field }) => (
                <div className="activity-form-field">
                  <TimePickerField
                    label={t('form.start', { defaultValue: 'Hora de início' })}
                    minutes={field.value}
                    onChange={field.onChange}
                  />
                </div>
              )}
            />
            <Controller
              control={control}
              name="durationMinutes"
              render={({ field }) => (
                <div className="activity-form-field">
                  <DurationPicker
                    label={t('form.duration', { defaultValue: 'Duração' })}
                    minutes={field.value}
                    onChange={field.onChange}
                  />
                </div>
              )}
            />
          </div>

          <div className="activity-form-field full-width">
            <label className="activity-form-label">
              {t('form.color', { defaultValue: 'Cor' })}
            </label>
            <Controller
              control={control}
              name="colorPreset"
              render={({ field }) => {
                return (
                  <div className="activity-form-colors">
                    {colorPalette.map((item) => {
                      const displayColor =
                        item.preset === ActivityColorPreset.CUSTOM
                          ? customColorValue || item.color
                          : item.color

                      return (
                        <button
                          key={item.preset}
                          type="button"
                          className={`activity-form-color-chip ${field.value === item.preset ? 'selected' : ''}`}
                          onClick={() => field.onChange(item.preset)}
                          style={{
                            borderColor: displayColor,
                            backgroundColor:
                              field.value === item.preset ? displayColor : 'transparent',
                            color:
                              field.value === item.preset
                                ? getContrastingColor(displayColor)
                                : 'var(--text-color)',
                          }}
                        >
                          {t(`colors.${item.preset}`, { defaultValue: item.preset })}
                        </button>
                      )
                    })}
                  </div>
                )
              }}
            />
          </div>

          <Controller
            control={control}
            name="colorPreset"
            render={({ field }) => (
              <>
                {field.value === ActivityColorPreset.CUSTOM && (
                  <div className="activity-form-field full-width">
                    <label htmlFor="customColor" className="activity-form-label">
                      {t('form.customColor', {
                        defaultValue: 'Cor customizada (Hex/RGB)',
                      })}
                    </label>
                    <input
                      {...register('customColor')}
                      id="customColor"
                      type="text"
                      className="activity-form-input"
                      placeholder="#6750A4"
                    />
                  </div>
                )}
              </>
            )}
          />

          <div className="activity-form-field">
            <label htmlFor="meetingUrl" className="activity-form-label">
              {t('form.meetingUrl', { defaultValue: 'Link rapido' })}
            </label>
            <input
              {...register('meetingUrl')}
              id="meetingUrl"
              type="url"
              className="activity-form-input"
              placeholder="https://..."
            />
          </div>

          <div className="activity-form-field">
            <label htmlFor="locationUrl" className="activity-form-label">
              {t('form.locationUrl', { defaultValue: 'Maps URL' })}
            </label>
            <input
              {...register('locationUrl')}
              id="locationUrl"
              type="url"
              className="activity-form-input"
              placeholder="https://..."
            />
          </div>

          <div className="activity-form-actions full-width">
            <button
              type="button"
              onClick={handleClose}
              className="activity-form-btn secondary"
            >
              {t('actions.cancel', { defaultValue: 'Cancelar' })}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="activity-form-btn primary"
            >
              {t('actions.save', { defaultValue: 'Salvar' })}
            </button>
          </div>
        </form>
      </div>
    </BaseModal>
  )
}

export default ActivityForm
