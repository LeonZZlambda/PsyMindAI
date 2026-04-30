export const Telemetry = {
  sessionStart: null,
  lastPing: null,
  sessionId: Date.now().toString(),
  _visibilityListener: null,
  _heartbeatInterval: null,
  
  isOptedIn() {
    const pref = localStorage.getItem('psymind_telemetry_optin');
    // Por privacidade, default agora é opt-out: somente true quando o usuário aceitar explicitamente
    return pref === 'true';
  },

  setOptIn(value) {
    localStorage.setItem('psymind_telemetry_optin', value ? 'true' : 'false');
    if (value) {
      // Se o usuário aceitar, inicializa a telemetria (init é idempotente)
      try {
        this.init();
      } catch (e) {
        if (import.meta.env.DEV) console.warn('Telemetry.init failed', e);
      }
    } else {
      // Limpa rastros coletados caso ele desative (privacidade total)
      try {
        this.endSession();
        if (this._visibilityListener) {
          document.removeEventListener('visibilitychange', this._visibilityListener);
          this._visibilityListener = null;
        }
        if (this._heartbeatInterval) {
          clearInterval(this._heartbeatInterval);
          this._heartbeatInterval = null;
        }
      } catch (e) {
        // ignore
      }
      localStorage.removeItem('psymind_telemetry_events');
      localStorage.removeItem('psymind_telemetry_stats');
    }
  },

  init() {
    if (this.sessionStart) return; // Prevent double init
    
    // Registo de retenção histórica primária
    if (!localStorage.getItem('psymind_telemetry_first_visit')) {
      localStorage.setItem('psymind_telemetry_first_visit', Date.now().toString());
    }

    this.sessionStart = Date.now();
    this.lastPing = Date.now();
    this.saveEvent('SESSION_START');
    
    // visibilitychange é o padrão ouro moderno (especialmente PWA/Mobile)
    // para detectar quando o app vai pro background ou é fechado.
    if (!this._visibilityListener) {
      this._visibilityListener = () => {
        if (document.visibilityState === 'hidden') {
          this.flushSessionTime();
        } else if (document.visibilityState === 'visible') {
          this.lastPing = Date.now(); // Retomou o foco, reinicia o contador do trecho
        }
      };
      document.addEventListener('visibilitychange', this._visibilityListener);
    }

    // Heartbeat de segurança: salva o tempo a cada 30 segundos
    // para prevenir perda de dados em caso de crashes severos ou encerramento forçado do app web
    if (!this._heartbeatInterval) {
      this._heartbeatInterval = setInterval(() => {
        if (document.visibilityState === 'visible') {
          this.flushSessionTime();
        }
      }, 30000);
    }
  },

  flushSessionTime() {
    if (!this.lastPing || !this.isOptedIn()) return;
    const now = Date.now();
    const elapsed = now - this.lastPing;
    
    if (elapsed > 0) {
      const stats = this.getStats();
      stats.totalSessionTime = (stats.totalSessionTime || 0) + elapsed;
      localStorage.setItem('psymind_telemetry_stats', JSON.stringify(stats));
    }
    
    this.lastPing = now;
  },
  
  endSession() {
    if (!this.sessionStart) return;
    this.flushSessionTime();
    const durationMs = Date.now() - this.sessionStart;
    this.saveEvent('SESSION_END', { durationMs });
  },
  
  trackFeature(featureName, action = 'opened') {
    if (!this.isOptedIn()) return;
    this.saveEvent('FEATURE_USE', { featureName, action });
    
    // Incrementa contador da feature
    const stats = this.getStats();
    stats.featuresUsed[featureName] = (stats.featuresUsed[featureName] || 0) + 1;
    localStorage.setItem('psymind_telemetry_stats', JSON.stringify(stats));
  },
  
  trackError(source, errorDetails) {
    if (!this.isOptedIn()) return;
    this.saveEvent('ERROR', { source, errorDetails });
    
    // Salva falha no acumulador
    const stats = this.getStats();
    stats.errors.push({
      time: new Date().toISOString(),
      source,
      errorDetails: typeof errorDetails === 'string' ? errorDetails : JSON.stringify(errorDetails)
    });
    // Manter as últimas 50
    if (stats.errors.length > 50) stats.errors.shift();
    localStorage.setItem('psymind_telemetry_stats', JSON.stringify(stats));
  },

  trackTransformation(category, impact = 1) {
    if (!this.isOptedIn()) return;
    this.saveEvent('TRANSFORMATION', { category, impact });
    const stats = this.getStats();
    stats.transformationScore = (stats.transformationScore || 0) + impact;
    localStorage.setItem('psymind_telemetry_stats', JSON.stringify(stats));
  },
  
  saveEvent(type, payload = {}) {
    if (!this.isOptedIn()) return;
    const event = {
      id: this.sessionId,
      type,
      timestamp: new Date().toISOString(),
      payload
    };
    
    if (import.meta.env.DEV) {
      console.debug(`[Analytics] ${type}`, payload);
    }
    
    const events = this.getEvents();
    events.push(event);
    if(events.length > 500) events.shift(); // Evitar estourar storage
    localStorage.setItem('psymind_telemetry_events', JSON.stringify(events));
  },
  
  getEvents() {
    try {
      return JSON.parse(localStorage.getItem('psymind_telemetry_events')) || [];
    } catch {
      return [];
    }
  },
  
  getStats() {
    try {
      return JSON.parse(localStorage.getItem('psymind_telemetry_stats')) || {
        totalSessionTime: 0,
        featuresUsed: {},
        transformationScore: 0,
        errors: []
      };
    } catch {
      return { totalSessionTime: 0, featuresUsed: {}, transformationScore: 0, errors: [] };
    }
  },

  getDerivedMetrics() {
    const stats = this.getStats();
    const events = this.getEvents();
    
    // Retention/Loyalty Simulation calculation
    const firstVisit = localStorage.getItem('psymind_telemetry_first_visit');
    let daysActive = 1;
    if (firstVisit) {
      daysActive = Math.max(1, Math.ceil((Date.now() - parseInt(firstVisit, 10)) / (1000 * 60 * 60 * 24)));
    }
    
    // Avg session 
    const sessionStarts = events.filter(e => e.type === 'SESSION_START').length || 1;
    const avgSessionMinutes = (stats.totalSessionTime / sessionStarts / 60000).toFixed(1);
    const totalMinutes = (stats.totalSessionTime / 60000).toFixed(1);

    // Most used feature
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

  exportData() {
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
    document.body.appendChild(a); // Append logic is safer
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }
};
