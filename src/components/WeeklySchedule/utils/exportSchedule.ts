import { Activity } from '../types'

/**
 * Converts minutes since midnight to HH:MM format
 */
const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
}

/**
 * Exports schedule to CSV format
 */
export const exportToCSV = (activities: Activity[], fileName = 'schedule.csv'): void => {
  const headers = [
    'Title',
    'Type',
    'Days',
    'Start Time',
    'Duration (minutes)',
    'Description',
    'Meeting URL',
    'Location URL',
  ]
  const rows = activities.map((activity) => [
    activity.title,
    activity.type,
    activity.days.join(', '),
    minutesToTime(activity.startMinutes),
    activity.durationMinutes.toString(),
    activity.description || '',
    activity.meetingUrl || '',
    activity.locationUrl || '',
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row
        .map((cell) => {
          // Escape quotes and wrap in quotes if contains comma or quote
          const escaped = String(cell).replace(/"/g, '""')
          return escaped.includes(',') || escaped.includes('"') || escaped.includes('\n')
            ? `"${escaped}"`
            : escaped
        })
        .join(','),
    ),
  ].join('\n')

  downloadFile(csvContent, fileName, 'text/csv')
}

/**
 * Exports schedule to JSON format
 */
export const exportToJSON = (activities: Activity[], fileName = 'schedule.json'): void => {
  const jsonContent = JSON.stringify(activities, null, 2)
  downloadFile(jsonContent, fileName, 'application/json')
}

/**
 * Exports schedule to iCalendar format
 */
export const exportToICAL = (activities: Activity[], fileName = 'schedule.ics'): void => {
  const now = new Date()
  const currentYear = now.getFullYear()

  // Calculate dates for each activity based on the day of week
  const events = activities.flatMap((activity) => {
    return activity.days.map((day) => {
      const dayIndex = [
        'MONDAY',
        'TUESDAY',
        'WEDNESDAY',
        'THURSDAY',
        'FRIDAY',
        'SATURDAY',
        'SUNDAY',
      ].indexOf(day)

      // Find the next occurrence of this day
      const date = new Date(currentYear, now.getMonth(), now.getDate())
      const currentDay = date.getDay()
      const daysAhead =
        dayIndex === 0 ? (currentDay === 0 ? 0 : 7 - currentDay) : ((dayIndex + 1) % 7) - currentDay
      date.setDate(date.getDate() + (daysAhead <= 0 ? daysAhead + 7 : daysAhead))

      const startHour = Math.floor(activity.startMinutes / 60)
      const startMinute = activity.startMinutes % 60
      const endMinute = activity.startMinutes + activity.durationMinutes
      const endHour = Math.floor(endMinute / 60)
      const endMin = endMinute % 60

      const dtstart = formatICALDate(
        new Date(date.getFullYear(), date.getMonth(), date.getDate(), startHour, startMinute),
      )
      const dtend = formatICALDate(
        new Date(date.getFullYear(), date.getMonth(), date.getDate(), endHour, endMin),
      )

      return `BEGIN:VEVENT
UID:${activity.id}@psymind.ai
DTSTAMP:${formatICALDate(new Date())}
DTSTART:${dtstart}
DTEND:${dtend}
SUMMARY:${escapeICAL(activity.title)}
DESCRIPTION:${escapeICAL(activity.description || '')}
${activity.meetingUrl ? `URL:${activity.meetingUrl}` : ''}
END:VEVENT`
    })
  })

  const icalContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PsyMind.AI//Schedule//EN',
    'CALSCALE:GREGORIAN',
    ...events,
    'END:VCALENDAR',
  ].join('\n')

  downloadFile(icalContent, fileName, 'text/calendar')
}

/**
 * Helper function to format date for iCalendar format
 */
const formatICALDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  const second = String(date.getSeconds()).padStart(2, '0')

  return `${year}${month}${day}T${hour}${minute}${second}`
}

/**
 * Escape special characters for iCalendar format
 */
const escapeICAL = (text: string): string => {
  return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
}

/**
 * Helper function to download a file
 */
const downloadFile = (content: string, fileName: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Export schedule in multiple formats
 */
export const exportSchedule = (
  activities: Activity[],
  format: 'csv' | 'json' | 'ical' = 'json',
  fileName?: string,
): void => {
  const defaultFileName = `schedule-${new Date().toISOString().split('T')[0]}`

  switch (format) {
    case 'csv':
      exportToCSV(activities, fileName || `${defaultFileName}.csv`)
      break
    case 'json':
      exportToJSON(activities, fileName || `${defaultFileName}.json`)
      break
    case 'ical':
      exportToICAL(activities, fileName || `${defaultFileName}.ics`)
      break
    default:
      exportToJSON(activities, fileName || `${defaultFileName}.json`)
  }
}
