import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Telemetry } from '../services/analytics/telemetry';

type StudyLog = {
  date: string;
  minutes: number;
  topic: string;
};

type TelemetryMetrics = {
  totalSessions?: number;
  transformationScore?: number | string;
  daysActive?: number;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const StudyStatsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  const [studyLogs, setStudyLogs] = useState<StudyLog[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLogTopic, setNewLogTopic] = useState('');
  const [newLogMinutes, setNewLogMinutes] = useState('30');
  const [telemetry, setTelemetry] = useState<TelemetryMetrics | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    if (Telemetry.isOptedIn && Telemetry.isOptedIn()) {
      if (Telemetry.getDerivedMetrics) {
        setTelemetry(Telemetry.getDerivedMetrics());
      }
    }

    const stored = localStorage.getItem('psymind_study_logs');
    if (stored) {
      try {
        setStudyLogs(JSON.parse(stored));
      } catch (e) {
        // ignore parse errors and continue with empty/default data
        // eslint-disable-next-line no-console
        console.error('Error parsing study logs', e);
      }
    } else {
      const today = new Date();
      const yDay = new Date(today);
      yDay.setDate(today.getDate() - 1);
      const yyDay = new Date(today);
      yyDay.setDate(today.getDate() - 2);

      const initialLogs: StudyLog[] = [
        { date: yyDay.toISOString(), minutes: 120, topic: 'Matemática Financeira' },
        { date: yDay.toISOString(), minutes: 180, topic: 'História do Brasil' },
        { date: today.toISOString(), minutes: 240, topic: 'Matemática Financeira' },
        { date: today.toISOString(), minutes: 60, topic: 'Redação' }
      ];

      setStudyLogs(initialLogs);
      localStorage.setItem('psymind_study_logs', JSON.stringify(initialLogs));
    }
  }, [isOpen]);

  const handleAddLog = () => {
    if (!newLogTopic.trim() || !newLogMinutes) return;

    const log: StudyLog = {
      date: new Date().toISOString(),
      minutes: parseInt(newLogMinutes, 10),
      topic: newLogTopic.trim()
    };

    const updated = [...studyLogs, log];
    setStudyLogs(updated);
    localStorage.setItem('psymind_study_logs', JSON.stringify(updated));
    setNewLogTopic('');
    setShowAddForm(false);
  };

  const computedStats = useMemo(() => {
    if (!studyLogs.length) {
      return {
        avgFocus: '0m',
        retention: '0%',
        streakWeeks: 0,
        weeklyData: [
          { day: t('study_stats.days.mon'), percent: 0, value: '0h', active: false },
          { day: t('study_stats.days.tue'), percent: 0, value: '0h', active: false },
          { day: t('study_stats.days.wed'), percent: 0, value: '0h', active: false },
          { day: t('study_stats.days.thu'), percent: 0, value: '0h', active: false },
          { day: t('study_stats.days.fri'), percent: 0, value: '0h', active: false },
          { day: t('study_stats.days.sat'), percent: 0, value: '0h', active: false },
          { day: t('study_stats.days.sun'), percent: 0, value: '0h', active: false }
        ],
        disciplines: [],
        aiTip: t('study_stats.empty')
      };
    }

    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    startOfWeek.setHours(0, 0, 0, 0);

    const msInDay = 24 * 60 * 60 * 1000;
    const weekDays = [
      t('study_stats.days.mon'), t('study_stats.days.tue'), t('study_stats.days.wed'),
      t('study_stats.days.thu'), t('study_stats.days.fri'), t('study_stats.days.sat'),
      t('study_stats.days.sun')
    ];

    const baseWeekly = weekDays.map((name, index) => {
      const dayStart = new Date(startOfWeek.getTime() + index * msInDay);
      const dayEnd = new Date(dayStart.getTime() + msInDay);

      const dayMins = studyLogs
        .filter(l => {
          const d = new Date(l.date);
          return d >= dayStart && d < dayEnd;
        })
        .reduce((acc, l) => acc + l.minutes, 0);

      const isToday = index === (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
      return {
        day: name,
        minutes: dayMins,
        value: dayMins >= 60 ? `${Math.floor(dayMins / 60)}h${dayMins % 60 > 0 ? ` ${dayMins % 60}m` : ''}` : `${dayMins}m`,
        active: isToday
      };
    });

    const maxMins = Math.max(...baseWeekly.map(d => d.minutes), 60);
    const weeklyData = baseWeekly.map(d => ({
      ...d,
      percent: Math.min((d.minutes / maxMins) * 100, 100)
    }));

    const discMap: Record<string, number> = {};
    let totalMins = 0;
    studyLogs.forEach(l => {
      discMap[l.topic] = (discMap[l.topic] || 0) + l.minutes;
      totalMins += l.minutes;
    });

    const defaultColors = ['#4CAF50', '#2196F3', '#9C27B0', '#FF9800', '#F44336'];
    const disciplines = Object.entries(discMap).map(([topic, mins], i) => ({
      topic,
      minutes: mins,
      percent: Math.round((mins / totalMins) * 100),
      color: defaultColors[i % defaultColors.length]
    })).sort((a, b) => b.percent - a.percent);

    const avgFocusValue = Math.round(totalMins / studyLogs.length);
    const avgFocusStr = avgFocusValue >= 60 ? `${Math.floor(avgFocusValue / 60)}h${avgFocusValue % 60 > 0 ? ` ${avgFocusValue % 60}m` : ''}` : `${avgFocusValue}m`;

    return {
      avgFocus: avgFocusStr,
      weeklyData,
      disciplines,
      aiTip: disciplines.length > 0
        ? t('study_stats.ai_tip.good', { topic: disciplines[0].topic, score: telemetry ? telemetry.transformationScore : '0' })
        : t('study_stats.ai_tip.empty')
    };
  }, [studyLogs, telemetry, t]);

  if (!isOpen) return null;

  const { weeklyData, disciplines } = computedStats;

  const chartWidth = 500;
  const chartHeight = 160;
  const paddingX = 30;
  const paddingTop = 30;
  const paddingBottom = 40;

  const points = weeklyData.map((d, i: number) => {
    const x = paddingX + (i * ((chartWidth - paddingX * 2) / (weeklyData.length - 1)));
    const y = chartHeight - paddingBottom - (d.percent / 100) * (chartHeight - paddingTop - paddingBottom);
    return { x, y, ...d };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');
  const polygonPoints = `${Math.min(...points.map((p) => p.x))},${chartHeight - paddingBottom} ${polylinePoints} ${Math.max(...points.map((p) => p.x))},${chartHeight - paddingBottom}`;

  return (
    <motion.div
      className="modal-overlay"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden'
        }}
      >
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--card-background)' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-color)' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--primary-color)' }}>school</span>
            {t('study_stats.title')}
          </h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              style={{ background: 'var(--primary-color)', color: '#fff', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
              {t('study_stats.add_session')}
            </button>
            <button className="close-btn" onClick={onClose} aria-label={t('study_stats.close')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-color)', display: 'flex', alignItems: 'center' }}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', background: 'var(--bg-color)' }}>
          {showAddForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ padding: '16px', background: 'var(--card-background)', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-color)' }}>{t('study_stats.form.title')}</h3>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    placeholder={t('study_stats.form.topic_placeholder')}
                    value={newLogTopic}
                    onChange={(e) => setNewLogTopic(e.target.value)}
                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)' }}
                  />
                  <select
                    value={newLogMinutes}
                    onChange={(e) => setNewLogMinutes(e.target.value)}
                    style={{ width: '120px', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)' }}
                  >
                    {['15', '30', '45', '60', '90', '120'].map(val => (
                      <option key={val} value={val}>{t(`study_stats.form.durations.${val}`)}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleAddLog}
                    style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>
                    {t('study_stats.form.save')}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'var(--card-hover)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#4CAF50', marginBottom: '8px' }}>psychology</span>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: 'var(--text-light)' }}>{t('study_stats.metrics.avg_focus')}</h3>
              <p style={{ margin: 0, fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--text-color)' }}>{computedStats.avgFocus}</p>
            </div>

            <div style={{ background: 'var(--card-hover)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#2196F3', marginBottom: '8px' }}>timeline</span>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: 'var(--text-light)' }}>{t('study_stats.metrics.sessions')}</h3>
              <p style={{ margin: 0, fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--text-color)' }}>{telemetry ? telemetry.totalSessions : '--'}</p>
            </div>

            <div style={{ background: 'var(--card-hover)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '28px', color: 'var(--primary-color)', marginBottom: '8px' }}>psychology_alt</span>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: 'var(--text-light)' }}>{t('study_stats.metrics.transformation')}</h3>
              <p style={{ margin: 0, fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--text-color)' }}>{telemetry ? telemetry.transformationScore : '--'}</p>
            </div>

            <div style={{ background: 'var(--card-hover)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#FF9800', marginBottom: '8px' }}>local_fire_department</span>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: 'var(--text-light)' }}>{t('study_stats.metrics.active_days')}</h3>
              <p style={{ margin: 0, fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--text-color)' }}>{telemetry ? telemetry.daysActive : '--'}</p>
            </div>
          </div>

          <div style={{ background: 'var(--card-hover)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem', color: 'var(--text-color)' }}>{t('study_stats.charts.weekly_title')}</h3>
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%', overflowX: 'auto', paddingBottom: '8px' }}>
              <div style={{ minWidth: '400px', width: '100%', position: 'relative' }}>
                <svg width="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary-color)" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="var(--primary-color)" stopOpacity="0.01" />
                    </linearGradient>
                  </defs>

                  {[0, 25, 50, 75, 100].map(percent => {
                    const y = chartHeight - paddingBottom - (percent / 100) * (chartHeight - paddingTop - paddingBottom);
                    return (
                      <line key={percent} x1={paddingX} y1={y} x2={chartWidth - paddingX} y2={y} stroke="var(--border-color)" strokeWidth="1" strokeDasharray="4 4" />
                    );
                  })}

                  <motion.polygon
                    points={polygonPoints}
                    fill="url(#chartGradient)"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  />

                  <motion.polyline
                    points={polylinePoints}
                    fill="none"
                    stroke="var(--primary-color)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                  />

                  {points.map((p, i: number) => (
                    <g key={i}>
                      <motion.circle
                        cx={p.x} cy={p.y} r={p.active ? 6 : 4}
                        fill={p.active ? 'var(--bg-color)' : 'var(--primary-color)'}
                        stroke='var(--primary-color)'
                        strokeWidth={p.active ? 3 : 0}
                        style={{ zIndex: 10 }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
                      />

                      <motion.text
                        x={p.x} y={p.y - 12}
                        textAnchor="middle"
                        fontSize="11"
                        fill={p.active ? 'var(--text-color)' : 'var(--text-light)'}
                        fontWeight={p.active ? 'bold' : 'normal'}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.6 + i * 0.05 }}
                      >
                        {p.value}
                      </motion.text>

                      <text
                        x={p.x} y={chartHeight - paddingBottom + 24}
                        textAnchor="middle"
                        fontSize="12"
                        fill={p.active ? 'var(--primary-color)' : 'var(--text-light)'}
                        fontWeight={p.active ? 'bold' : 'normal'}
                      >
                        {p.day}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-color)' }}>{t('study_stats.charts.discipline_title')}</h3>

            <div style={{ background: 'var(--card-hover)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {disciplines.map((item, i: number) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-color)', fontWeight: '500' }}>{item.topic}</span>
                      <span style={{ color: 'var(--text-light)' }}>{item.percent}%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${item.percent}%`, height: '100%', background: item.color, borderRadius: '4px' }}></div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '20px', padding: '12px', background: 'var(--user-msg-bg)', borderRadius: '8px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--primary-color)', fontSize: '20px' }}>lightbulb</span>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-color)', lineHeight: '1.4' }}>
                  <strong>{t('study_stats.ai_tip.label')}</strong> {computedStats.aiTip}
                </p>
              </div>

            </div>
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
};

export default StudyStatsModal;
