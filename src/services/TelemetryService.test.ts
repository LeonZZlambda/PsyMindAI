import { describe, it, expect, vi, beforeEach } from 'vitest';
import TelemetryService from './TelemetryService';

describe('TelemetryService Stress & Network Validation', () => {
  const QUEUE_KEY = 'psymind_telemetry_queue';

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    // Mock navigator properties
    Object.defineProperty(navigator, 'onLine', { configurable: true, value: true });
    Object.defineProperty(navigator, 'sendBeacon', { configurable: true, value: vi.fn(() => true) });
  });

  it('should enforce the maximum limit of 50 events (Stress Test)', () => {
    // Force offline to fill the queue
    Object.defineProperty(navigator, 'onLine', { value: false });

    // Push 60 events
    for (let i = 1; i <= 60; i++) {
      TelemetryService.trackEvent('stress_test', { index: i });
    }

    const stored = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
    
    expect(stored.length).toBe(50);
    // The first 10 should have been shifted out
    expect(stored[0].payload.index).toBe(11);
    expect(stored[49].payload.index).toBe(60);
  });

  it('should sync events in batch when returning online (Network Flapping)', async () => {
    // 1. Start Offline
    Object.defineProperty(navigator, 'onLine', { value: false });
    
    // 2. Queue 10 events
    for (let i = 1; i <= 10; i++) {
      TelemetryService.trackEvent('flapping_test', { id: i });
    }
    
    expect(JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]').length).toBe(10);
    expect(navigator.sendBeacon).not.toHaveBeenCalled();

    // 3. Go Online and trigger sync
    Object.defineProperty(navigator, 'onLine', { value: true });
    window.dispatchEvent(new Event('online'));

    // 4. Verify batch send
    expect(navigator.sendBeacon).toHaveBeenCalledTimes(1);
    const [url, data] = (navigator.sendBeacon as any).mock.calls[0];
    const parsedData = JSON.parse(data);
    
    expect(url).toBe('/api/telemetry');
    expect(parsedData.events.length).toBe(10);
    expect(parsedData.events[0].payload.id).toBe(1);
    
    // 5. Queue should be empty after success
    expect(localStorage.getItem(QUEUE_KEY)).toBeNull();
  });

  it('should maintain schema consistency for Modal events', () => {
    Object.defineProperty(navigator, 'onLine', { value: false });

    // Test ExamsModal Payload
    TelemetryService.trackEvent('exams_funnel', { step: 1, category: 'nacional' });
    
    // Test VocationalTestModal Payload
    TelemetryService.trackEvent('vocational_test_step', { step: 5, question_id: 10 });

    const queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
    
    // Verify Exams schema
    const examEvent = queue.find((e: any) => e.type === 'exams_funnel');
    expect(examEvent.payload).toHaveProperty('step', 1);
    expect(examEvent.payload).toHaveProperty('category', 'nacional');
    
    // Verify Vocational schema
    const vocationalEvent = queue.find((e: any) => e.type === 'vocational_test_step');
    expect(vocationalEvent.payload).toHaveProperty('step', 5);
    expect(vocationalEvent.payload).toHaveProperty('question_id', 10);
  });
});
