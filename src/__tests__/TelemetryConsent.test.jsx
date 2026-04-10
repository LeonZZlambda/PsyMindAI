import React from 'react'
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, afterEach } from 'vitest'

// Mock i18n to simplify rendering
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k) => k }),
  Trans: ({ children }) => <>{children}</>
}))

// Mock telemetry module with factory (avoid referencing hoisted variables)
vi.mock('../services/analytics/telemetry', () => {
  return {
    Telemetry: {
      setOptIn: vi.fn(),
      init: vi.fn()
    }
  }
})

describe('TelemetryConsent', () => {
  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('shows consent toast after delay and accepts', async () => {
    const user = userEvent.setup()

    // Ensure a working localStorage for this test (some node flags can break it)
    if (!globalThis.localStorage || typeof globalThis.localStorage.getItem !== 'function') {
      let _s = {};
      globalThis.localStorage = {
        getItem: (k) => (_s.hasOwnProperty(k) ? _s[k] : null),
        setItem: (k, v) => { _s[k] = String(v); },
        removeItem: (k) => { delete _s[k]; },
        clear: () => { _s = {}; }
      };
    }
    // Ensure no prior choice
    localStorage.removeItem('psymind_telemetry_optin')

    const telemetry = await import('../services/analytics/telemetry')
    const TelemetryMock = telemetry.Telemetry
    TelemetryMock.setOptIn.mockClear()
    TelemetryMock.init.mockClear()

    const { default: TelemetryConsent } = await import('../components/TelemetryConsent.jsx')

    render(
      <MemoryRouter>
        <TelemetryConsent />
      </MemoryRouter>
    )

    await waitFor(() => expect(screen.getByRole('dialog')).toBeTruthy())

    const accept = screen.getByRole('button', { name: 'telemetry.accept' })
    expect(accept).toBeTruthy()

    // accept should call Telemetry.setOptIn(true)
    await user.click(accept)
    expect(TelemetryMock.setOptIn).toHaveBeenCalledWith(true)
  })

  it('closes on Escape and calls decline', async () => {
    const user = userEvent.setup()

    // Ensure a working localStorage for this test
    if (!globalThis.localStorage || typeof globalThis.localStorage.getItem !== 'function') {
      let _s = {};
      globalThis.localStorage = {
        getItem: (k) => (_s.hasOwnProperty(k) ? _s[k] : null),
        setItem: (k, v) => { _s[k] = String(v); },
        removeItem: (k) => { delete _s[k]; },
        clear: () => { _s = {}; }
      };
    }
    // Ensure no prior choice
    localStorage.removeItem('psymind_telemetry_optin')

    const telemetry = await import('../services/analytics/telemetry')
    const TelemetryMock = telemetry.Telemetry
    TelemetryMock.setOptIn.mockClear()

    const { default: TelemetryConsent } = await import('../components/TelemetryConsent.jsx')

    render(
      <MemoryRouter>
        <TelemetryConsent />
      </MemoryRouter>
    )

    await waitFor(() => expect(screen.getByRole('dialog')).toBeTruthy())

    // Press Escape to decline
    await user.keyboard('{Escape}')
    expect(TelemetryMock.setOptIn).toHaveBeenCalledWith(false)
  })
})
