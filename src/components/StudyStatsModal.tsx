import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import BaseModal from './BaseModal';
import StudyDashboardSkeleton from './study-dashboard/StudyDashboardSkeleton';
import { useStudyDashboardData } from '../hooks/useStudyDashboardData';
import type { DisciplineBreakdownItem, StudyMetricCard, WeeklyStudyPoint } from './study-dashboard/types';
import '../styles/study-dashboard.css';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

type StudySessionFormProps = {
  onSubmit: (topic: string, minutes: number) => void;
};

type StudyMetricsGridProps = {
  items: StudyMetricCard[];
};

type WeeklyStudyChartProps = {
  caption: string;
  items: WeeklyStudyPoint[];
  title: string;
};

type DisciplineBreakdownProps = {
  emptyMessage: string;
  items: DisciplineBreakdownItem[];
  title: string;
};

const durationOptions = [15, 30, 45, 60, 90, 120];

const StudySessionForm: React.FC<StudySessionFormProps> = ({ onSubmit }) => {
  const { t } = useTranslation();
  const [topic, setTopic] = useState('');
  const [minutes, setMinutes] = useState('30');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedTopic = topic.trim();
    if (!normalizedTopic) return;

    onSubmit(normalizedTopic, Number.parseInt(minutes, 10));
    setTopic('');
    setMinutes('30');
  };

  return (
    <div className="modal-card">
      <form className="study-dashboard__form" onSubmit={handleSubmit}>
        <div>
          <h3 className="study-dashboard__form-title">{t('study_stats.form.title')}</h3>
        </div>

        <div className="study-dashboard__form-fields">
          <input
            className="study-dashboard__input"
            onChange={(event) => setTopic(event.target.value)}
            placeholder={t('study_stats.form.topic_placeholder')}
            type="text"
            value={topic}
          />

          <select
            aria-label={t('study_stats.form.duration_aria')}
            className="study-dashboard__select"
            onChange={(event) => setMinutes(event.target.value)}
            value={minutes}
          >
            {durationOptions.map((value) => (
              <option key={value} value={String(value)}>
                {t(`study_stats.form.durations.${value}`)}
              </option>
            ))}
          </select>

          <button className="study-dashboard__form-submit" type="submit">
            <span className="material-symbols-outlined">add</span>
            {t('study_stats.form.save')}
          </button>
        </div>
      </form>
    </div>
  );
};

const StudyMetricsGrid: React.FC<StudyMetricsGridProps> = ({ items }) => (
  <div className="study-dashboard__metrics-grid">
    {items.map((item) => (
      <div key={item.id} className="modal-card study-dashboard__metric-card">
        <div className={`study-dashboard__metric-icon study-dashboard__metric-icon--${item.tone}`}>
          <span className="material-symbols-outlined">{item.icon}</span>
        </div>
        <span className="study-dashboard__metric-label">{item.label}</span>
        <strong className="study-dashboard__metric-value">{item.value}</strong>
        {item.supportingText ? (
          <span className="study-dashboard__metric-supporting">{item.supportingText}</span>
        ) : null}
      </div>
    ))}
  </div>
);

const WeeklyStudyChart: React.FC<WeeklyStudyChartProps> = ({ caption, items, title }) => (
  <div className="modal-card study-dashboard__panel">
    <div className="study-dashboard__panel-header">
      <div>
        <h3 className="study-dashboard__panel-title">{title}</h3>
        <span className="study-dashboard__panel-caption">{caption}</span>
      </div>
    </div>

    <div className="study-dashboard__chart" role="img" aria-label={title}>
      {items.map((item) => (
        <div
          key={item.day}
          className={`study-dashboard__chart-column ${item.isToday ? 'study-dashboard__chart-column--today' : ''}`}
        >
          <span className="study-dashboard__chart-value">{item.minutes > 0 ? item.valueLabel : '0m'}</span>
          <div className="study-dashboard__chart-track">
            <div className="study-dashboard__chart-bar-shell">
              <div
                className="study-dashboard__chart-bar"
                style={{ height: `${Math.max(item.progress, item.minutes > 0 ? 10 : 6)}%` }}
              />
            </div>
          </div>
          <span className="study-dashboard__chart-day">{item.day}</span>
        </div>
      ))}
    </div>
  </div>
);

const DisciplineBreakdown: React.FC<DisciplineBreakdownProps> = ({ emptyMessage, items, title }) => (
  <div className="modal-card study-dashboard__panel">
    <div className="study-dashboard__panel-header">
      <div>
        <h3 className="study-dashboard__panel-title">{title}</h3>
      </div>
    </div>

    {items.length > 0 ? (
      <div className="study-dashboard__progress-list">
        {items.map((item) => (
          <div key={item.topic} className="study-dashboard__progress-item">
            <div className="study-dashboard__progress-meta">
              <span className="study-dashboard__progress-topic">{item.topic}</span>
              <span className="study-dashboard__progress-share">
                {item.share}% · {item.minutes} min
              </span>
            </div>
            <div className="study-dashboard__progress-track">
              <div className="study-dashboard__progress-bar" style={{ width: `${Math.max(item.share, 8)}%` }} />
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="study-dashboard__empty-state">
        <span className="material-symbols-outlined">library_books</span>
        <p>{emptyMessage}</p>
      </div>
    )}
  </div>
);

const StudyStatsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { addLog, status, viewModel } = useStudyDashboardData(isOpen, t);

  if (!isOpen) return null;

  const handleAddLog = (topic: string, minutes: number) => {
    addLog(topic, minutes);
    setIsFormVisible(false);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('study_stats.title')}
      icon="school"
      size="large"
      className="study-stats-modal"
    >
      {status === 'loading' ? (
        <StudyDashboardSkeleton />
      ) : (
        <div className="study-dashboard">
          <div className="modal-hero study-dashboard__hero">
            <div className="study-dashboard__hero-copy">
              <span className="study-dashboard__hero-eyebrow">
                <span className="material-symbols-outlined">monitoring</span>
                {t('study_stats.eyebrow')}
              </span>
              <h3>{t('study_stats.hero_title')}</h3>
              <p>{t('study_stats.hero_description')}</p>
            </div>

            <button
              className="study-dashboard__action-btn"
              onClick={() => setIsFormVisible((currentValue) => !currentValue)}
              type="button"
            >
              <span className="material-symbols-outlined">
                {isFormVisible ? 'remove' : 'add'}
              </span>
              {isFormVisible ? t('study_stats.hide_form') : t('study_stats.add_session')}
            </button>
          </div>

          {isFormVisible ? <StudySessionForm onSubmit={handleAddLog} /> : null}

          <StudyMetricsGrid items={viewModel.metricCards} />

          {!viewModel.telemetryEnabled ? (
            <div className="study-dashboard__telemetry-banner">
              <span className="material-symbols-outlined">visibility_off</span>
              <p>{viewModel.telemetryDisabledMessage}</p>
            </div>
          ) : null}

          <div className="study-dashboard__content-grid">
            <WeeklyStudyChart
              caption={t('study_stats.weekly_caption')}
              items={viewModel.weeklyStudy}
              title={t('study_stats.charts.weekly_title')}
            />

            <DisciplineBreakdown
              emptyMessage={t('study_stats.empty')}
              items={viewModel.disciplineBreakdown}
              title={t('study_stats.charts.discipline_title')}
            />
          </div>

          <div className={`study-dashboard__insight study-dashboard__insight--${viewModel.insight.tone}`}>
            <span className="material-symbols-outlined study-dashboard__insight-icon">lightbulb</span>
            <div className="study-dashboard__insight-copy">
              <strong className="study-dashboard__insight-title">{viewModel.insight.title}</strong>
              <p>{viewModel.insight.body}</p>
            </div>
          </div>
        </div>
      )}
    </BaseModal>
  );
};

export default StudyStatsModal;
