import React from 'react'
import { TraitLevel } from './types'

interface SegmentedControlProps {
  value: TraitLevel
  onChange: (val: TraitLevel) => void
  labels: [string, string, string]
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({ value, onChange, labels }) => {
  const segments: TraitLevel[] = ['less', 'default', 'more']
  return (
    <div className="account-segment-group" role="group">
      {segments.map((seg, i) => (
        <button
          key={seg}
          className={`account-segment-btn${value === seg ? ' active' : ''}`}
          onClick={() => onChange(seg)}
          aria-pressed={value === seg}
          type="button"
        >
          {labels[i]}
        </button>
      ))}
    </div>
  )
}
