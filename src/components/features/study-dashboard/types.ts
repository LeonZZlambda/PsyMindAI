import type { TFunction } from 'i18next';

export const STUDY_LOGS_STORAGE_KEY = 'psymind_study_logs';

export interface StudyLog {
  id: string;
  date: string;
  minutes: number;
  topic: string;
}

export interface DerivedTelemetryMetrics {
  avgSessionMinutes: number;
  daysActive: number;
  errorCount: number;
  topFeature: string;
  totalMinutes: number;
  totalSessions: number;
  transformationScore: number;
}

export interface StudyMetricCard {
  id: string;
  icon: string;
  label: string;
  tone: 'primary' | 'success' | 'info' | 'warning';
  value: string;
  supportingText?: string;
}

export interface WeeklyStudyPoint {
  day: string;
  valueLabel: string;
  minutes: number;
  progress: number;
  isToday: boolean;
}

export interface DisciplineBreakdownItem {
  topic: string;
  minutes: number;
  share: number;
}

export interface StudyInsight {
  title: string;
  body: string;
  tone: 'default' | 'positive' | 'muted';
}

export interface StudyDashboardViewModel {
  disciplineBreakdown: DisciplineBreakdownItem[];
  hasStudyLogs: boolean;
  insight: StudyInsight;
  metricCards: StudyMetricCard[];
  telemetryDisabledMessage: string;
  telemetryEnabled: boolean;
  totalStudyMinutes: number;
  weeklyStudy: WeeklyStudyPoint[];
}

export interface StudyDashboardState {
  logs: StudyLog[];
  status: 'idle' | 'loading' | 'ready';
  telemetry: DerivedTelemetryMetrics | null;
  viewModel: StudyDashboardViewModel;
}

export type StudyTranslation = TFunction;
