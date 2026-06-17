import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { m } from 'framer-motion'
import { useTheme } from '../hooks/context/useTheme'
import '../styles/roadmap.css'
import { Telemetry } from '../services/analytics/telemetry'
import { generateMetaInsight } from '../services/chat/chatService'
import { defaultConfig } from '../services/config/apiConfig'
import Footer from '@/components/layout/Footer'
import ScrollToTopButton from '@/components/ui/ScrollToTopButton'
import LandingHeader from '@/components/layout/LandingHeader'

interface DerivedMetrics {
  transformationScore: number;
  avgSessionMinutes: string | number;
  daysActive: number;
  errorCount: number;
}

interface TelemetryStats {
  featuresUsed: Record<string, number>;
}

interface MetaInsight {
  pattern: string;
  suggestion: string;
}

interface FeatureUsedEntry {
  label: string;
  val: number;
  pct: number;
}

const AnalyticsPage: React.FC = () => {
  const { t, i18n } = useTranslation(['dashboard', 'translation'])
  const navigate = useNavigate()
  const { isDarkMode } = useTheme()

  const formatCompact = (value: number) => {
    try {
      return new Intl.NumberFormat(i18n.language, {
        notation: 'compact',
        compactDisplay: 'short',
        maximumFractionDigits: 1
      }).format(value)
    } catch (e) {
      return value.toString()
    }
  }

  const formatDecimal = (value: number) => {
    try {
      return new Intl.NumberFormat(i18n.language, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
      }).format(value)
    } catch (e) {
      return value.toString()
    }
  }

  const translateFeatureName = (label: string) => {
    const featureKeyMap: Record<string, string> = {
      pomodoro: 'analytics_page.features.pomodoro',
      weeklySchedule: 'analytics_page.features.weeklySchedule',
      mood: 'analytics_page.features.mood',
      journal: 'analytics_page.features.journal',
      reflexoes: 'analytics_page.features.reflexoes',
      vestibulares: 'analytics_page.features.vestibulares',
      vocational: 'analytics_page.features.vocational',
      kindness: 'analytics_page.features.kindness',
      helpline: 'analytics_page.features.helpline',
      learning: 'analytics_page.features.learning',
      settings: 'analytics_page.features.settings',
      help: 'analytics_page.features.help',
      chat: 'analytics_page.features.chat'
    }

    const key = featureKeyMap[label] || featureKeyMap[label.toLowerCase()]
    if (key) {
      return t(key)
    }
    return t(`analytics_page.features.${label}`, { defaultValue: label })
  }
  
  const [derived, setDerived] = useState<DerivedMetrics | null>(null)
  const [stats, setStats] = useState<TelemetryStats | null>(null)
  const [viewMode, setViewMode] = useState<'global' | 'local'>('global')
  
  // Meta-Análise State
  const [metaInsight, setMetaInsight] = useState<MetaInsight | null>(null)
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false)

  useEffect(() => {
    setDerived(Telemetry.getDerivedMetrics())
    setStats(Telemetry.getStats())
    window.scrollTo(0, 0)
  }, [])

  const handleGenerateInsight = async () => {
    if (!defaultConfig.isConfigured()) {
      alert(t('analytics_page.alerts.api_key'))
      return
    }
    setIsGeneratingInsight(true)
    try {
      const insight = await generateMetaInsight()
      if (insight && insight.pattern && insight.suggestion) {
        setMetaInsight(insight)
      } else {
        alert(t('analytics_page.alerts.insufficient_data'))
      }
    } catch (e) {
      alert(t('analytics_page.alerts.connection_failed'))
    } finally {
      setIsGeneratingInsight(false)
    }
  }

  const handleExport = () => {
    Telemetry.exportData()
  }

  // Mock global data since the app is currently client-only
  const globalStats = {
    activeUsers: `${formatCompact(14200)}+`,
    totalSessions: `${formatCompact(1200000)}+`,
    avgSessionMinutes: formatDecimal(12.4),
    transformationScore: formatCompact(89400),
    topFeatures: [
      { label: t('analytics_page.mock.top_features.assistant_chat'), val: 42500, pct: 100 },
      { label: t('analytics_page.mock.top_features.emotional_journal'), val: 28400, pct: 66.8 },
      { label: t('analytics_page.mock.top_features.pomodoro'), val: 19200, pct: 45.1 },
      { label: t('analytics_page.mock.top_features.resolution_wall'), val: 12400, pct: 29.1 },
      { label: t('analytics_page.mock.top_features.mind_maps'), val: 8900, pct: 20.9 }
    ]
  }

  const getChartData = (): FeatureUsedEntry[] => {
    if (!stats || !stats.featuresUsed) return []
    // Cast explicitly since Object.entries might strip the number type depending on tsconfig lib.
    const entries: [string, number][] = Object.entries(stats.featuresUsed) as [string, number][];
    entries.sort((a, b) => b[1] - a[1]);
    const topEntries = entries.slice(0, 5);
    const maxVal = Math.max(...topEntries.map((e) => e[1]), 1)
    return topEntries.map(([label, val]) => ({
      label,
      val,
      pct: (val / maxVal) * 100
    }))
  }

  if (!derived || !stats) return null

  const chartData = getChartData()

  return (
    <m.div 
      className={`landing-page ${isDarkMode ? 'dark' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <LandingHeader />

      <main className="roadmap-content" style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '80px', width: '100%', boxSizing: 'border-box' }}>
	          <div className="roadmap-header">
	          <h1>{t('analytics_page.title')}</h1>
	          <p>{t('analytics_page.subtitle')}</p>
	        </div>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap', gap: '15px' }}>
            <button className="secondary-btn" onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="material-symbols-outlined icon-rtl-flip">arrow_back</span>
              {t('analytics_page.back_home')}
            </button>

            <div style={{ display: 'flex', background: 'var(--hover-color)', padding: '4px', borderRadius: '20px' }}>
              <button 
                onClick={() => setViewMode('global')}
                style={{ 
                  background: viewMode === 'global' ? 'var(--primary-color)' : 'transparent',
                  color: viewMode === 'global' ? 'white' : 'var(--text-color)',
                  border: 'none', padding: '8px 16px', borderRadius: '16px', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s ease'
                }}
              >
                {t('analytics_page.tabs.global')}
              </button>
              <button 
                onClick={() => setViewMode('local')}
                style={{ 
                  background: viewMode === 'local' ? 'var(--primary-color)' : 'transparent',
                  color: viewMode === 'local' ? 'white' : 'var(--text-color)',
                  border: 'none', padding: '8px 16px', borderRadius: '16px', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s ease'
                }}
              >
                {t('analytics_page.tabs.personal')}
              </button>
            </div>
          </div>

          {viewMode === 'global' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              <div style={{ background: 'var(--hover-color)', padding: '16px', borderRadius: '12px', fontSize: '0.9rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--primary-color)' }}>warning</span>
                {t('analytics_page.mockup_warning')}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '20px' }}>
                <div style={{ background: 'var(--card-background)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '2rem', color: 'var(--primary-color)', marginBottom: '10px' }}>group</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>{t('analytics_page.metrics.active_users')}</span>
                  <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-color)' }}>{globalStats.activeUsers}</span>
                </div>
	                <div style={{ background: 'var(--card-background)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
	                  <span className="material-symbols-outlined" style={{ fontSize: '2rem', color: 'var(--primary-color)', marginBottom: '10px' }}>timer</span>
	                  <span style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>{t('analytics_page.metrics.avg_session')}</span>
	                  <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-color)' }}>{globalStats.avgSessionMinutes} {t('analytics_page.units.minutes_short')}</span>
	                </div>
                <div style={{ background: 'var(--card-background)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '2rem', color: 'var(--primary-color)', marginBottom: '10px' }}>psychology_alt</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>{t('analytics_page.metrics.transformation_score')}</span>
                  <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-color)' }}>{globalStats.transformationScore}</span>
                </div>
                <div style={{ background: 'var(--card-background)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '2rem', color: 'var(--primary-color)', marginBottom: '10px' }}>history</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>{t('analytics_page.metrics.total_sessions')}</span>
                  <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-color)' }}>{globalStats.totalSessions}</span>
                </div>
              </div>

              <div style={{ background: 'var(--card-background)', padding: '30px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ marginBottom: '25px', color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--primary-color)' }}>bar_chart</span>
                  {t('analytics_page.charts.top_features_community')}
                </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {globalStats.topFeatures.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span style={{ width: '130px', fontSize: '0.95rem', color: 'var(--text-color)', textTransform: 'capitalize', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.label}
                        </span>
                        <div style={{ flex: 1, backgroundColor: 'var(--hover-color)', height: '24px', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
                          <m.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${item.pct}%` }}
                            transition={{ duration: 1, delay: idx * 0.1, ease: 'easeOut' }}
                            style={{ position: 'absolute', top: 0, insetInlineStart: 0, height: '100%', backgroundColor: 'var(--primary-color)', borderRadius: '12px' }}
                          />
                        </div>
                        <span style={{ width: '50px', fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-color)', textAlign: 'right' }}>
                          {formatCompact(item.val)}
                        </span>
                      </div>
                    ))}
                  </div>
              </div>
            </div>
          )}

          {viewMode === 'local' && (
            !Telemetry.isOptedIn() ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--card-background)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '64px', color: 'var(--text-light)' }}>visibility_off</span>
                <h3 style={{ marginTop: '20px', marginBottom: '10px', color: 'var(--text-color)' }}>{t('analytics_page.alerts.telemetry_disabled').split('.')[0]}</h3>
                <p style={{ color: 'var(--text-light)' }}>{t('analytics_page.alerts.telemetry_disabled').split('.').slice(1).join('.')}</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                {/* Meta Insight Panel */}
                <div style={{ background: 'linear-gradient(135deg, rgba(82, 196, 26, 0.1) 0%, rgba(0, 121, 107, 0.1) 100%)', border: '1px solid var(--primary-color)', padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
                    <div>
                      <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-color)', margin: 0 }}>
                        <span className="material-symbols-outlined" style={{ color: 'var(--primary-color)' }}>psychology</span>
                        {t('analytics_page.meta_analysis.title')}
                      </h3>
                      <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem', color: 'var(--text-light)' }}>
                        {t('analytics_page.meta_analysis.description')}
                      </p>
                    </div>
                    {!metaInsight && (
                      <button 
                        className="primary-btn cta"
                        onClick={handleGenerateInsight}
                        disabled={isGeneratingInsight}
                        style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                      >
                        {isGeneratingInsight ? t('analytics_page.meta_analysis.generating') : t('analytics_page.meta_analysis.button')}
                      </button>
                    )}
                  </div>
                  
                  {metaInsight && (
                    <m.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }} 
                      style={{ background: 'var(--card-background)', padding: '20px', borderRadius: '12px', marginTop: '10px' }}
                    >
                      <div style={{ marginBottom: '15px' }}>
                        <strong style={{ color: 'var(--text-color)', display: 'block', marginBottom: '4px' }}>{t('analytics_page.meta_analysis.pattern_label')}</strong>
                        <span style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>{metaInsight.pattern}</span>
                      </div>
                      <div>
                        <strong style={{ color: 'var(--primary-color)', display: 'block', marginBottom: '4px' }}>{t('analytics_page.meta_analysis.suggestion_label')}</strong>
                        <span style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>{metaInsight.suggestion}</span>
                      </div>
                      <button 
                        onClick={handleGenerateInsight}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-light)', fontSize: '0.8rem', marginTop: '15px', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                      >
                        {t('analytics_page.meta_analysis.generate_new')}
                      </button>
                    </m.div>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '20px' }}>
	                <div style={{ background: 'var(--card-background)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
	                  <span className="material-symbols-outlined" style={{ fontSize: '2rem', color: 'var(--primary-color)', marginBottom: '10px' }}>psychology_alt</span>
	                  <span style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>{t('analytics_page.metrics.transformation_score')}</span>
	                  <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-color)' }}>{new Intl.NumberFormat(i18n.language).format(derived.transformationScore)} {t('analytics_page.units.points_short')}</span>
	                </div>
	                <div style={{ background: 'var(--card-background)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
	                  <span className="material-symbols-outlined" style={{ fontSize: '2rem', color: 'var(--primary-color)', marginBottom: '10px' }}>timer</span>
	                  <span style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>{t('analytics_page.metrics.avg_session')}</span>
	                  <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-color)' }}>{new Intl.NumberFormat(i18n.language, { maximumFractionDigits: 1 }).format(Number.parseFloat(derived.avgSessionMinutes.toString()))} {t('analytics_page.units.minutes_short')}</span>
	                </div>
	                <div style={{ background: 'var(--card-background)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
	                  <span className="material-symbols-outlined" style={{ fontSize: '2rem', color: 'var(--primary-color)', marginBottom: '10px' }}>calendar_month</span>
	                  <span style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>{t('analytics_page.metrics.retention')}</span>
	                  <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-color)' }}>{derived.daysActive} {t('analytics_page.units.days', { count: derived.daysActive })}</span>
	                </div>
	                <div style={{ background: 'var(--card-background)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
	                  <span className="material-symbols-outlined" style={{ fontSize: '2rem', color: 'var(--primary-color)', marginBottom: '10px' }}>error</span>
	                  <span style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>{t('analytics_page.metrics.error_count')}</span>
	                  <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-color)' }}>{derived.errorCount} {t('analytics_page.units.errors', { count: derived.errorCount })}</span>
	                </div>
	              </div>

              {/* Chart Secao */}
              <div style={{ background: 'var(--card-background)', padding: '30px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ marginBottom: '25px', color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--primary-color)' }}>bar_chart</span>
                  {t('analytics_page.charts.top_features_personal')}
                </h3>
                
	                {chartData.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {chartData.map((item: FeatureUsedEntry, idx: number) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span style={{ width: '100px', fontSize: '0.95rem', color: 'var(--text-color)', textTransform: 'capitalize', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {translateFeatureName(item.label)}
                        </span>
                        <div style={{ flex: 1, backgroundColor: 'var(--hover-color)', height: '24px', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
                          <m.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${item.pct}%` }}
                            transition={{ duration: 1, delay: idx * 0.1, ease: 'easeOut' }}
                            style={{ position: 'absolute', top: 0, insetInlineStart: 0, height: '100%', backgroundColor: 'var(--primary-color)', borderRadius: '12px' }}
                          />
                        </div>
                        <span style={{ width: '30px', fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-color)', textAlign: 'right' }}>
                          {new Intl.NumberFormat(i18n.language).format(item.val)}
                        </span>
                      </div>
                    ))}
                  </div>
	                ) : (
	                  <p style={{ color: 'var(--text-light)', fontStyle: 'italic' }}>{t('analytics_page.charts.empty_personal')}</p>
	                )}
	              </div>

              {/* Botão de Exportação */}
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
	                <button 
	                  className="primary-btn pulse-animation" 
	                  onClick={handleExport} 
	                  style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '12px 24px', fontSize: '1.05rem', boxShadow: '0 4px 15px rgba(0, 121, 107, 0.25)' }}
	                >
	                  <span className="material-symbols-outlined">download</span>
	                  {t('analytics_page.export_json')}
	                </button>
	              </div>
            </div>
            )
          )}

        </m.div>
      </main>

      <ScrollToTopButton />
      <Footer />
    </m.div>
  )
}

export default AnalyticsPage
