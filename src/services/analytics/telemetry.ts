import logger from '../../utils/logger';

export interface TelemetryStats {
  totalSessionTime: number;
  featuresUsed: Record<string, number>;
  transformationScore: number;
  errors: Array<{
    time: string;
    source: string;
    errorDetails: string;
  }>;
}

export interface TelemetryEvent {
  id: string;
  type: string;
  timestamp: string;
  payload: any;
}

export interface DerivedMetrics {
  daysActive: number;
  totalSessions: number;
  avgSessionMinutes: string;
  totalMinutes: string;
  errorCount: number;
  topFeature: string;
  transformationScore: number;
}

export const Telemetry = {
  sessionStart: null as number | null,
  lastPing: null as number | null,
  sessionId: Date.now().toString(),
  _visibilityListener: null as (() => void) | null,
  _heartbeatInterval: null as NodeJS.Timeout | null,
  
  isOptedIn(): boolean {
    if (typeof window === 'undefined') return false;
    const pref = localStorage.getItem('psymind_telemetry_optin');
    return pref === 'true';
  },

  setOptIn(value: boolean): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('psymind_telemetry_optin', value ? 'true' : 'false');
    if (value) {
      try {
        this.init();
      } catch (e) {
        logger.warn('Telemetry.init failed', e);
      }
    } else {
      try {
        this.cleanup();
      } catch (e) {
        // ignore
      }
      localStorage.removeItem('psymind_telemetry_events');
      localStorage.removeItem('psymind_telemetry_stats');
    }
  },

  init(): void {
    if (typeof window === 'undefined') return;
    if (this.sessionStart) return; 
    
    if (!localStorage.getItem('psymind_telemetry_first_visit')) {
      localStorage.setItem('psymind_telemetry_first_visit', Date.now().toString());
    }

    this.sessionStart = Date.now();
    this.lastPing = Date.now();
    this.saveEvent('SESSION_START');
    
    if (!this._visibilityListener) {
      this._visibilityListener = () => {
        if (document.visibilityState === 'hidden') {
          this.flushSessionTime();
        } else if (document.visibilityState === 'visible') {
          this.lastPing = Date.now(); 
        }
      };
      document.addEventListener('visibilitychange', this._visibilityListener);
    }

    if (!this._heartbeatInterval) {
      this._heartbeatInterval = setInterval(() => {
        if (document.visibilityState === 'visible') {
          this.flushSessionTime();
        }
      }, 30000);
    }
  },

  cleanup(): void {
    if (typeof window === 'undefined') return;
    this.endSession();
    if (this._visibilityListener) {
      document.removeEventListener('visibilitychange', this._visibilityListener);
      this._visibilityListener = null;
    }
    if (this._heartbeatInterval) {
      clearInterval(this._heartbeatInterval);
      this._heartbeatInterval = null;
    }
    this.sessionStart = null;
    this.lastPing = null;
  },

  flushSessionTime(): void {
    if (!this.lastPing || !this.isOptedIn() || typeof window === 'undefined') return;
    const now = Date.now();
    const elapsed = now - this.lastPing;
    
    if (elapsed > 0) {
      const stats = this.getStats();
      stats.totalSessionTime = (stats.totalSessionTime || 0) + elapsed;
      localStorage.setItem('psymind_telemetry_stats', JSON.stringify(stats));
    }
    
    this.lastPing = now;
  },
  
  endSession(): void {
    if (!this.sessionStart) return;
    this.flushSessionTime();
    const durationMs = Date.now() - this.sessionStart;
    this.saveEvent('SESSION_END', { durationMs });
  },
  
  trackFeature(featureName: string, action = 'opened'): void {
    if (!this.isOptedIn() || typeof window === 'undefined') return;
    this.saveEvent('FEATURE_USE', { featureName, action });
    
    const stats = this.getStats();
    stats.featuresUsed[featureName] = (stats.featuresUsed[featureName] || 0) + 1;
    localStorage.setItem('psymind_telemetry_stats', JSON.stringify(stats));
  },
  
  trackError(source: string, errorDetails: any): void {
    if (!this.isOptedIn() || typeof window === 'undefined') return;
    this.saveEvent('ERROR', { source, errorDetails });
    
    const stats = this.getStats();
    stats.errors.push({
      time: new Date().toISOString(),
      source,
      errorDetails: typeof errorDetails === 'string' ? errorDetails : JSON.stringify(errorDetails)
    });
    if (stats.errors.length > 50) stats.errors.shift();
    localStorage.setItem('psymind_telemetry_stats', JSON.stringify(stats));
  },

  trackTransformation(category: string, impact = 1): void {
    if (!this.isOptedIn() || typeof window === 'undefined') return;
    this.saveEvent('TRANSFORMATION', { category, impact });
    const stats = this.getStats();
    stats.transformationScore = (stats.transformationScore || 0) + impact;
    localStorage.setItem('psymind_telemetry_stats', JSON.stringify(stats));
  },
  
  saveEvent(type: string, payload = {}): void {
    if (!this.isOptedIn() || typeof window === 'undefined') return;
    const event: TelemetryEvent = {
      id: this.sessionId,
      type,
      timestamp: new Date().toISOString(),
      payload
    };
    
    logger.debug(`[Analytics] ${type}`, payload);
    
    const events = this.getEvents();
    events.push(event);
    if(events.length > 500) events.shift(); 
    localStorage.setItem('psymind_telemetry_events', JSON.stringify(events));
  },
  
  getEvents(): TelemetryEvent[] {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem('psymind_telemetry_events') || '[]');
    } catch {
      return [];
    }
  },
  
  getStats(): TelemetryStats {
    const defaultStats: TelemetryStats = {
      totalSessionTime: 0,
      featuresUsed: {},
      transformationScore: 0,
      errors: []
    };
    if (typeof window === 'undefined') return defaultStats;
    try {
      return JSON.parse(localStorage.getItem('psymind_telemetry_stats') || JSON.stringify(defaultStats));
    } catch {
      return defaultStats;
    }
  },

  getDerivedMetrics(): DerivedMetrics {
    const stats = this.getStats();
    const events = this.getEvents();
    
    let daysActive = 1;
    if (typeof window !== 'undefined') {
      const firstVisit = localStorage.getItem('psymind_telemetry_first_visit');
      if (firstVisit) {
        daysActive = Math.max(1, Math.ceil((Date.now() - parseInt(firstVisit, 10)) / (1000 * 60 * 60 * 24)));
      }
    }
    
    const sessionStarts = events.filter(e => e.type === 'SESSION_START').length || 1;
    const avgSessionMinutes = (stats.totalSessionTime / sessionStarts / 60000).toFixed(1);
    const totalMinutes = (stats.totalSessionTime / 60000).toFixed(1);

    const sortedFeatures = Object.entries(stats.featuresUsed).sort((a,b) => b[1] - a[1]);
    const topFeature = sortedFeatures[0] ? sortedFeatures[0][0] : 'Nenhuma';

    return {
      daysActive,
      totalSessions: sessionStarts,
      avgSessionMinutes,
      totalMinutes,
      errorCount: stats.errors ? stats.errors.length : 0,
      topFeature,
      transformationScore: stats.transformationScore || 0
    };
  },

  exportData(): void {
    if (typeof window === 'undefined') return;
    const data = {
      exportedAt: new Date().toISOString(),
      stats: this.getStats(),
      derived: this.getDerivedMetrics(),
      eventsRaw: this.getEvents()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `psymind_analytics_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a); 
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }
};
