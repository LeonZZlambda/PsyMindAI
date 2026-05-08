import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import AccountModal from '../components/AccountModal'

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: 'pt' }
  })
}))

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  AnimatePresence: ({ children }) => <>{children}</>,
  m: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>
  }
}))

const Wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>

describe('AccountModal', () => {
  const mockOnClose = vi.fn()
  const mockOnOpenStudyStats = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renders account view by default', () => {
    render(
      <Wrapper>
        <AccountModal
          isOpen={true}
          onClose={mockOnClose}
          onOpenStudyStats={mockOnOpenStudyStats}
        />
      </Wrapper>
    )

    expect(screen.getByText('account.greeting')).toBeInTheDocument()
    expect(screen.getByText('account.menu.stats')).toBeInTheDocument()
    expect(screen.getByText('account.personalization.title')).toBeInTheDocument()
  })

  it('opens personalization view when manage button is clicked', async () => {
    const user = userEvent.setup()
    
    render(
      <Wrapper>
        <AccountModal
          isOpen={true}
          onClose={mockOnClose}
          onOpenStudyStats={mockOnOpenStudyStats}
        />
      </Wrapper>
    )

    const manageBtn = screen.getByText('account.manage')
    await user.click(manageBtn)

    await waitFor(() => {
      expect(screen.getByText('account.personalization.profile.title')).toBeInTheDocument()
    })
  })

  it('saves profile settings to localStorage', async () => {
    const user = userEvent.setup()
    
    render(
      <Wrapper>
        <AccountModal
          isOpen={true}
          onClose={mockOnClose}
          initialView="personalization"
        />
      </Wrapper>
    )

    // Find and click save button
    const saveBtn = screen.getByText('account.personalization.actions.save')
    await user.click(saveBtn)

    // Check if data was saved to localStorage
    const saved = localStorage.getItem('psymind_user_profile')
    expect(saved).toBeTruthy()
  })

  it('cancels changes and returns to account view', async () => {
    const user = userEvent.setup()
    
    render(
      <Wrapper>
        <AccountModal
          isOpen={true}
          onClose={mockOnClose}
          initialView="personalization"
        />
      </Wrapper>
    )

    const cancelBtn = screen.getByText('account.personalization.actions.cancel')
    await user.click(cancelBtn)

    await waitFor(() => {
      expect(screen.getByText('account.greeting')).toBeInTheDocument()
    })
  })

  it('calls onOpenStudyStats when stats button is clicked', async () => {
    const user = userEvent.setup()
    
    render(
      <Wrapper>
        <AccountModal
          isOpen={true}
          onClose={mockOnClose}
          onOpenStudyStats={mockOnOpenStudyStats}
        />
      </Wrapper>
    )

    const statsBtn = screen.getByText('account.menu.stats')
    await user.click(statsBtn)

    expect(mockOnOpenStudyStats).toHaveBeenCalledTimes(1)
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <Wrapper>
        <AccountModal
          isOpen={false}
          onClose={mockOnClose}
        />
      </Wrapper>
    )

    expect(container.querySelector('.modal-overlay')).not.toBeInTheDocument()
  })
})
