import { Box, Stack, TextField } from '@mui/material'
import { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Activity, ActivityType } from '../types'

interface ScheduleSearchProps {
  activities: Activity[]
  onFilterChange: (filtered: Activity[]) => void
  onSearchChange: (query: string) => void
}

export const ScheduleSearch = memo(
  ({ activities, onFilterChange, onSearchChange }: ScheduleSearchProps) => {
    const { t } = useTranslation()
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedTypes, setSelectedTypes] = useState<Set<ActivityType>>(new Set())

    const filtered = useMemo(() => {
      let result = activities

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        result = result.filter(
          (activity) =>
            activity.title.toLowerCase().includes(query) ||
            (activity.description && activity.description.toLowerCase().includes(query)),
        )
      }

      // Filter by type
      if (selectedTypes.size > 0) {
        result = result.filter((activity) => selectedTypes.has(activity.type))
      }

      return result
    }, [activities, searchQuery, selectedTypes])

    useCallback(() => {
      onFilterChange(filtered)
      onSearchChange(searchQuery)
    }, [filtered, searchQuery, onFilterChange, onSearchChange])()

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value)
    }, [])

    const handleTypeToggle = useCallback((type: ActivityType) => {
      setSelectedTypes((prev) => {
        const next = new Set(prev)
        if (next.has(type)) {
          next.delete(type)
        } else {
          next.add(type)
        }
        return next
      })
    }, [])

    return (
      <Stack spacing={2}>
        <TextField
          placeholder={t('schedule.search.placeholder', { defaultValue: 'Buscar atividades...' })}
          value={searchQuery}
          onChange={handleSearchChange}
          variant="outlined"
          size="small"
          fullWidth
          slotProps={{
            input: {
              'aria-label': t('schedule.search.placeholder', { defaultValue: 'Buscar atividades' }),
            },
          }}
        />
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
          {Object.values(ActivityType).map((type) => (
            <Box
              key={type}
              component="button"
              onClick={() => handleTypeToggle(type)}
              sx={{
                px: 2,
                py: 1,
                borderRadius: '20px',
                border: '1px solid',
                bgcolor: selectedTypes.has(type) ? 'primary.main' : 'transparent',
                color: selectedTypes.has(type) ? 'primary.contrastText' : 'inherit',
                borderColor: 'divider',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: selectedTypes.has(type) ? 'primary.dark' : 'action.hover',
                },
                transition: 'all 0.2s ease-in-out',
              }}
              aria-pressed={selectedTypes.has(type)}
            >
              {t(`schedule.type.${type}`, { defaultValue: type })}
            </Box>
          ))}
        </Box>
      </Stack>
    )
  },
)

ScheduleSearch.displayName = 'ScheduleSearch'

export default ScheduleSearch
