/**
 * TelemetryService (Singleton)
 * Implements Offline-First buffering with localStorage and batch synchronization.
 * Optimized for Mobile S (max 50 events) and reliability (navigator.sendBeacon).
 */

interface TelemetryEvent {
  type: string;
  payload: any;
  timestamp: number;
}

class TelemetryService {
  private static instance: TelemetryService;
  private readonly QUEUE_KEY = 'psymind_telemetry_queue';
  private readonly MAX_QUEUE_SIZE = 50;
  private readonly SYNC_URL = '/api/telemetry'; // Placeholder endpoint

  private constructor() {
    this.initListeners();
  }

  public static getInstance(): TelemetryService {
    if (!TelemetryService.instance) {
      TelemetryService.instance = new TelemetryService();
    }
    return TelemetryService.instance;
  }

  /**
   * Main tracking function
   */
  public trackEvent(type: string, payload: any = {}): void {
    const event: TelemetryEvent = {
      type,
      payload,
      timestamp: Date.now()
    };

    if (navigator.onLine) {
      this.sendInBatch([event]);
    } else {
      this.enqueue(event);
    }
  }

  /**
   * Store event in localStorage with size limits
   */
  private enqueue(event: TelemetryEvent): void {
    try {
      const queue = this.getQueue();
      
      // Limit check (Mobile S optimization)
      if (queue.length >= this.MAX_QUEUE_SIZE) {
        queue.shift(); // Remove oldest to make room
      }
      
      queue.push(event);
      localStorage.setItem(this.QUEUE_KEY, JSON.stringify(queue));
    } catch (e) {
      console.error('Telemetry storage failed', e);
    }
  }

  /**
   * Retrieve current queue
   */
  private getQueue(): TelemetryEvent[] {
    try {
      const stored = localStorage.getItem(this.QUEUE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Send events in batch using navigator.sendBeacon for reliability
   */
  private sendInBatch(events: TelemetryEvent[]): boolean {
    if (events.length === 0) return true;

    const data = JSON.stringify({ events, sentAt: Date.now() });

    // Use sendBeacon if available (guarantees delivery even if tab closes)
    if (navigator.sendBeacon) {
      return navigator.sendBeacon(this.SYNC_URL, data);
    }

    // Fallback to fetch for browsers without sendBeacon support
    fetch(this.SYNC_URL, {
      method: 'POST',
      body: data,
      headers: { 'Content-Type': 'application/json' },
      keepalive: true // Hint to browser to keep request alive after page close
    }).catch(err => console.warn('Telemetry sync failed', err));

    return true;
  }

  /**
   * Sync all stored events when connection is restored
   */
  public async sync(): Promise<void> {
    const queue = this.getQueue();
    if (queue.length === 0) return;

    console.log(`Syncing ${queue.length} telemetry events...`);
    const success = this.sendInBatch(queue);

    if (success) {
      localStorage.removeItem(this.QUEUE_KEY);
    }
  }

  /**
   * Setup auto-sync listeners
   */
  private initListeners(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.sync());
      
      // Also try to sync on visibility change (best practice for mobile)
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden' && navigator.onLine) {
          this.sync();
        }
      });
    }
  }
}

export default TelemetryService.getInstance();
