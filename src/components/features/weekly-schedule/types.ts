export enum ActivityType {
  CLASS = 'CLASS',
  STUDY = 'STUDY',
  REVIEW = 'REVIEW',
  EXTRA = 'EXTRA',
}

export enum DayOfWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export enum ActivityColorPreset {
  PRIMARY = 'PRIMARY',
  SECONDARY = 'SECONDARY',
  TERTIARY = 'TERTIARY',
  ERROR = 'ERROR',
  CUSTOM = 'CUSTOM',
}

export interface ActivityColor {
  preset: ActivityColorPreset;
  value: string;
}

export interface ScheduleSettings {
  slotMinutes: 30 | 60;
  resizeStepMinutes: 15 | 30;
  dayStartHour: number;
  dayEndHour: number;
  timezone: string;
}

export interface Activity {
  id: string;
  title: string;
  description?: string;
  days: DayOfWeek[];
  startMinutes: number;
  durationMinutes: number;
  type: ActivityType;
  color: ActivityColor;
  locationUrl?: string;
  meetingUrl?: string;
  isCompleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TimeSlot {
  id: string;
  dayIndex: number;
  startMinutes: number;
  endMinutes: number;
  label: string;
  isCurrentTime?: boolean;
}

export interface ActivityFormInput {
  title: string;
  description?: string;
  type: ActivityType;
  days: DayOfWeek[];
  startMinutes: number;
  durationMinutes: number;
  color: ActivityColor;
  locationUrl?: string;
  meetingUrl?: string;
}
