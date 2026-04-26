import { z } from 'zod';
import { Telemetry } from '../../services/analytics/telemetry';
import type {
  DerivedTelemetryMetrics,
  DisciplineBreakdownItem,
  StudyDashboardViewModel,
  StudyLog,
  StudyMetricCard,
  StudyTranslation,
  WeeklyStudyPoint,
} from './types';
import { STUDY_LOGS_STORAGE_KEY } from './types';

const studyLogSchema = z.object({
  id: z.string().min(1).optional(),
  date: z.string().min(1),
  minutes: z.number().int().positive(),
  topic: z.string().trim().min(1),
});

const studyLogsSchema = z.array(studyLogSchema);

const telemetrySchema = z.object({
  avgSessionMinutes: z.union([z.number(), z.string()]),
  daysActive: z.number(),
  errorCount: z.number(),
  topFeature: z.string(),
  totalMinutes: z.union([z.number(), z.string()]),
  totalSessions: z.number(),
  transformationScore: z.union([z.number(), z.string()]),
});

type TelemetryService = {
  getDerivedMetrics?: () => unknown;
  isOptedIn?: () => boolean;
};

const telemetryService = Telemetry as TelemetryService;

const toneByMetric: Record<StudyMetricCard['id'], StudyMetricCard['tone']> = {
  activeDays: 'warning',
  avgFocus: 'primary',
  totalStudyTime: 'success',
  transformation: 'info',
};

export const createStudyLog = (topic: string, minutes: number, now = new Date()): StudyLog => ({
  id: `${now.getTime()}-${topic.toLowerCase().replace(/\s+/g, '-')}`,
  date: now.toISOString(),
  minutes,
  topic: topic.trim(),
});

export const formatMinutes = (minutes: number): string => {
  if (minutes <= 0) return '0m';

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) return `${remainingMinutes}m`;
  if (remainingMinutes === 0) return `${hours}h`;
  return `${hours}h ${remainingMinutes}m`;
};

export const readStudyLogs = (storage: Storage = window.localStorage): StudyLog[] => {
  const rawValue = storage.getItem(STUDY_LOGS_STORAGE_KEY);
  if (!rawValue) return [];

  try {
    const parsed = JSON.parse(rawValue);
    const safeLogs = studyLogsSchema.parse(parsed);

    return safeLogs
      .map((log) => ({
        id: log.id ?? `${log.date}-${log.topic.toLowerCase().replace(/\s+/g, '-')}`,
        date: log.date,
        minutes: log.minutes,
        topic: log.topic.trim(),
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } catch {
    return [];
  }
};

export const saveStudyLogs = (logs: StudyLog[], storage: Storage = window.localStorage): void => {
  storage.setItem(STUDY_LOGS_STORAGE_KEY, JSON.stringify(logs));
};

export const readTelemetryMetrics = (): DerivedTelemetryMetrics | null => {
  if (!telemetryService.isOptedIn?.()) return null;

  const rawMetrics = telemetryService.getDerivedMetrics?.();
  if (!rawMetrics) return null;

  const parsed = telemetrySchema.safeParse(rawMetrics);
  if (!parsed.success) return null;

  const data = parsed.data;

  return {
    avgSessionMinutes: Number.parseFloat(String(data.avgSessionMinutes)) || 0,
    daysActive: data.daysActive,
    errorCount: data.errorCount,
    topFeature: data.topFeature,
    totalMinutes: Number.parseFloat(String(data.totalMinutes)) || 0,
    totalSessions: data.totalSessions,
    transformationScore: Number.parseFloat(String(data.transformationScore)) || 0,
  };
};

const getStartOfWeek = (referenceDate: Date): Date => {
  const startOfWeek = new Date(referenceDate);
  const dayOfWeek = referenceDate.getDay();
  const offset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  startOfWeek.setDate(referenceDate.getDate() - offset);
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
};

const createWeeklyStudy = (logs: StudyLog[], t: StudyTranslation, now = new Date()): WeeklyStudyPoint[] => {
  const dayLabels = [
    t('study_stats.days.mon'),
    t('study_stats.days.tue'),
    t('study_stats.days.wed'),
    t('study_stats.days.thu'),
    t('study_stats.days.fri'),
    t('study_stats.days.sat'),
    t('study_stats.days.sun'),
  ];
  const startOfWeek = getStartOfWeek(now);
  const dayInMs = 24 * 60 * 60 * 1000;
  const todayIndex = now.getDay() === 0 ? 6 : now.getDay() - 1;

  const weeklyMinutes = dayLabels.map((label, index) => {
    const dayStart = new Date(startOfWeek.getTime() + dayInMs * index);
    const dayEnd = new Date(dayStart.getTime() + dayInMs);

    const minutes = logs
      .filter((log) => {
        const logDate = new Date(log.date);
        return logDate >= dayStart && logDate < dayEnd;
      })
      .reduce((total, log) => total + log.minutes, 0);

    return {
      day: label,
      isToday: index === todayIndex,
      minutes,
      valueLabel: formatMinutes(minutes),
    };
  });

  const peakMinutes = Math.max(...weeklyMinutes.map((item) => item.minutes), 60);

  return weeklyMinutes.map((item) => ({
    ...item,
    progress: peakMinutes === 0 ? 0 : Math.round((item.minutes / peakMinutes) * 100),
  }));
};

const createDisciplineBreakdown = (logs: StudyLog[]): DisciplineBreakdownItem[] => {
  const totals = new Map<string, number>();

  for (const log of logs) {
    totals.set(log.topic, (totals.get(log.topic) || 0) + log.minutes);
  }

  const totalMinutes = Array.from(totals.values()).reduce((sum, minutes) => sum + minutes, 0);

  return Array.from(totals.entries())
    .map(([topic, minutes]) => ({
      topic,
      minutes,
      share: totalMinutes === 0 ? 0 : Math.round((minutes / totalMinutes) * 100),
    }))
    .sort((left, right) => right.minutes - left.minutes);
};

const createMetricCards = (
  totalStudyMinutes: number,
  totalStudySessions: number,
  telemetry: DerivedTelemetryMetrics | null,
  t: StudyTranslation,
): StudyMetricCard[] => {
  const averageFocus = totalStudySessions === 0 ? 0 : Math.round(totalStudyMinutes / totalStudySessions);

  return [
    {
      id: 'avgFocus',
      icon: 'timer',
      label: t('study_stats.metrics.avg_focus'),
      tone: toneByMetric.avgFocus,
      value: formatMinutes(averageFocus),
      supportingText: totalStudySessions > 0 ? t('study_stats.metrics.entries_logged', { count: totalStudySessions }) : t('study_stats.empty'),
    },
    {
      id: 'totalStudyTime',
      icon: 'school',
      label: t('study_stats.metrics.total_study_time'),
      tone: toneByMetric.totalStudyTime,
      value: formatMinutes(totalStudyMinutes),
      supportingText: totalStudyMinutes > 0 ? t('study_stats.metrics.this_journey') : t('study_stats.empty'),
    },
    {
      id: 'transformation',
      icon: 'psychology_alt',
      label: t('study_stats.metrics.transformation'),
      tone: toneByMetric.transformation,
      value: telemetry ? `${Math.round(telemetry.transformationScore)}` : '--',
      supportingText: telemetry ? `${Math.round(telemetry.avgSessionMinutes)} min/${t('study_stats.metrics.session')}` : t('study_stats.telemetry_off'),
    },
    {
      id: 'activeDays',
      icon: 'local_fire_department',
      label: t('study_stats.metrics.active_days'),
      tone: toneByMetric.activeDays,
      value: telemetry ? `${telemetry.daysActive}` : '--',
      supportingText: telemetry ? `${telemetry.totalSessions} ${t('study_stats.metrics.app_sessions')}` : t('study_stats.telemetry_off'),
    },
  ];
};

const createInsight = (
  disciplines: DisciplineBreakdownItem[],
  telemetry: DerivedTelemetryMetrics | null,
  t: StudyTranslation,
) => {
  if (disciplines.length === 0) {
    return {
      body: t('study_stats.ai_tip.empty'),
      title: t('study_stats.ai_tip.label'),
      tone: 'muted' as const,
    };
  }

  if (!telemetry) {
    return {
      body: t('study_stats.ai_tip.no_telemetry', { topic: disciplines[0].topic }),
      title: t('study_stats.ai_tip.label'),
      tone: 'default' as const,
    };
  }

  return {
    body: t('study_stats.ai_tip.good', {
      topic: disciplines[0].topic,
      score: Math.round(telemetry.transformationScore),
    }),
    title: t('study_stats.ai_tip.label'),
    tone: telemetry.transformationScore > 0 ? ('positive' as const) : ('default' as const),
  };
};

export const createStudyDashboardViewModel = (
  logs: StudyLog[],
  telemetry: DerivedTelemetryMetrics | null,
  t: StudyTranslation,
): StudyDashboardViewModel => {
  const totalStudyMinutes = logs.reduce((sum, log) => sum + log.minutes, 0);
  const disciplineBreakdown = createDisciplineBreakdown(logs);

  return {
    disciplineBreakdown,
    hasStudyLogs: logs.length > 0,
    insight: createInsight(disciplineBreakdown, telemetry, t),
    metricCards: createMetricCards(totalStudyMinutes, logs.length, telemetry, t),
    telemetryDisabledMessage: t('study_stats.telemetry_disabled'),
    telemetryEnabled: telemetry !== null,
    totalStudyMinutes,
    weeklyStudy: createWeeklyStudy(logs, t),
  };
};
