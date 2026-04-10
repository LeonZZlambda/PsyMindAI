import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock i18n to simplify rendering
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k) => k }),
  Trans: ({ children }) => <>{children}</>
}))

// Provide a mock Telemetry object
const TelemetryMock = {
  setOptIn: vi.fn(),
  init: vi.fn()
}
vi.mock('../services/analytics/telemetry', () => ({ Telemetry: TelemetryMock }))

import TelemetryConsent from '../components/TelemetryConsent.jsx'

describe('TelemetryConsent', () => {
  beforeEach(() => {
    localStorage.removeItem('psymind_telemetry_optin')
    TelemetryMock.setOptIn.mockClear()
    TelemetryMock.init.mockClear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows consent toast after delay and accepts', async () => {
    vi.useFakeTimers()
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <TelemetryConsent />
      </MemoryRouter>
    )

    // advance timers to show the toast
    vi.advanceTimersByTime(2000)

    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument())

    const accept = screen.getByRole('button', { name: 'telemetry.accept' })
    expect(accept).toBeInTheDocument()

    // accept should call Telemetry.setOptIn(true)
    await user.click(accept)
    expect(TelemetryMock.setOptIn).toHaveBeenCalledWith(true)
  })

  it('closes on Escape and calls decline', async () => {
    vi.useFakeTimers()
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <TelemetryConsent />
      </MemoryRouter>
    )

    vi.advanceTimersByTime(2000)
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument())

    // Press Escape to decline
    await user.keyboard('{Escape}')
    expect(TelemetryMock.setOptIn).toHaveBeenCalledWith(false)
  })
})
