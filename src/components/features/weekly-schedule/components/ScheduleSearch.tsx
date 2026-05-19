import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import MaterialIcon from '@/components/ui/MaterialIcon'
import { Activity, ActivityType } from '../types'

interface ScheduleSearchProps {
  activities: Activity[]
  onFilterChange: (filtered: Activity[]) => void
  onSearchChange: (query: string) => void
}

export const ScheduleSearch = memo(
  ({ activities, onFilterChange, onSearchChange }: ScheduleSearchProps) => {
    const { t } = useTranslation(['schedule', 'translation'])
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

    useEffect(() => {
      onFilterChange(filtered)
      onSearchChange(searchQuery)
    }, [filtered, searchQuery, onFilterChange, onSearchChange])

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
      <div className="weekly-schedule__search">
        <div className="weekly-schedule__search-input-wrapper">
          <MaterialIcon name="search" className="weekly-schedule__search-icon" />
          <input
            type="text"
            placeholder={t('search.placeholder', { defaultValue: 'Buscar atividades...' })}
            value={searchQuery}
            onChange={handleSearchChange}
            className="weekly-schedule__search-input"
            aria-label={t('search.placeholder', { defaultValue: 'Buscar atividades' })}
          />
        </div>
        <div className="weekly-schedule__type-filters">
          {Object.values(ActivityType).map((type) => (
            <button
              key={type}
              onClick={() => handleTypeToggle(type)}
              className={`weekly-schedule__type-filter ${
                selectedTypes.has(type) ? 'active' : ''
              }`}
              aria-pressed={selectedTypes.has(type)}
            >
              {t(`type.${type}`, { defaultValue: type })}
            </button>
          ))}
        </div>
      </div>
    )
  },
)

ScheduleSearch.displayName = 'ScheduleSearch'

export default ScheduleSearch
