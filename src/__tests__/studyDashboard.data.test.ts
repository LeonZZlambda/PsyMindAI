import { describe, expect, it } from 'vitest';
import { createStudyDashboardViewModel, formatMinutes, readStudyLogs } from '../components/study-dashboard/data';
import type { DerivedTelemetryMetrics, StudyLog } from '../components/study-dashboard/types';

const translate = (key: string, options?: Record<string, unknown>) => {
  if (key === 'study_stats.metrics.entries_logged') {
    return `${options?.count} entries`;
  }

  if (key === 'study_stats.ai_tip.good') {
    return `Focused on ${String(options?.topic)} with ${String(options?.score)} points`;
  }

  if (key === 'study_stats.ai_tip.no_telemetry') {
    return `Telemetry off for ${String(options?.topic)}`;
  }

  return key;
};

describe('study dashboard data helpers', () => {
  it('formats minutes into compact labels', () => {
    expect(formatMinutes(0)).toBe('0m');
    expect(formatMinutes(45)).toBe('45m');
    expect(formatMinutes(60)).toBe('1h');
    expect(formatMinutes(135)).toBe('2h 15m');
  });

  it('ignores malformed study logs in storage', () => {
    const storage = {
      getItem() {
        return '{"invalid": true}';
      },
      setItem() {},
    } as unknown as Storage;

    expect(readStudyLogs(storage)).toEqual([]);
  });

  it('derives a typed dashboard view model from logs and telemetry', () => {
    const logs: StudyLog[] = [
      { id: '1', date: '2026-04-21T10:00:00.000Z', minutes: 60, topic: 'Biologia' },
      { id: '2', date: '2026-04-22T10:00:00.000Z', minutes: 90, topic: 'Biologia' },
      { id: '3', date: '2026-04-23T10:00:00.000Z', minutes: 30, topic: 'Química' },
    ];

    const telemetry: DerivedTelemetryMetrics = {
      avgSessionMinutes: 24.5,
      daysActive: 5,
      errorCount: 0,
      topFeature: 'guidedLearning',
      totalMinutes: 120,
      totalSessions: 8,
      transformationScore: 12,
    };

    const viewModel = createStudyDashboardViewModel(logs, telemetry, translate as any);

    expect(viewModel.telemetryEnabled).toBe(true);
    expect(viewModel.metricCards).toHaveLength(4);
    expect(viewModel.metricCards[0].value).toBe('1h');
    expect(viewModel.disciplineBreakdown[0]).toMatchObject({ topic: 'Biologia', share: 83 });
    expect(viewModel.insight.body).toContain('Biologia');
    expect(viewModel.weeklyStudy).toHaveLength(7);
  });
});
