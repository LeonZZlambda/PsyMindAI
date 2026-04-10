import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { vi } from 'vitest'

import BaseModal from '../components/BaseModal.jsx'

describe('BaseModal accessibility and focus behavior', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('focuses close button on open, traps focus, Escape closes and restores focus', async () => {
    vi.useFakeTimers()
    const user = userEvent.setup()

    function Wrapper() {
      const [open, setOpen] = React.useState(false)
      return (
        <>
          <button data-testid="outside-btn" onClick={() => setOpen(true)}>Open</button>
          <BaseModal isOpen={open} onClose={() => setOpen(false)} title="Test Modal">
            <button data-testid="inside-btn">Inside</button>
            <a href="#" data-testid="link-inside">Link</a>
          </BaseModal>
        </>
      )
    }

    render(<Wrapper />)

    const outside = screen.getByTestId('outside-btn')
    outside.focus()
    expect(document.activeElement).toBe(outside)

    // open modal
    await user.click(outside)

    // close button should get focus
    const closeBtn = await screen.findByLabelText('Close Test Modal')
    expect(document.activeElement).toBe(closeBtn)

    // Tab -> inside button
    await user.tab()
    expect(document.activeElement).toBe(screen.getByTestId('inside-btn'))

    // Shift+Tab -> back to close
    await user.keyboard('{Shift>}{Tab}{/Shift}')
    expect(document.activeElement).toBe(closeBtn)

    // Escape to close (onClose runs after 300ms animation)
    await user.keyboard('{Escape}')
    vi.advanceTimersByTime(300)

    await waitFor(() => expect(document.activeElement).toBe(outside))
  })
})
