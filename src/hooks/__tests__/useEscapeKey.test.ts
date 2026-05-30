import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useEscapeKey } from '../useEscapeKey'

describe('useEscapeKey', () => {
  it('deve chamar o callback quando a tecla Escape for pressionada', () => {
    const callback = vi.fn()
    renderHook(() => useEscapeKey(callback))

    const event = new KeyboardEvent('keydown', { key: 'Escape' })
    document.dispatchEvent(event)

    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('não deve chamar o callback se outra tecla for pressionada', () => {
    const callback = vi.fn()
    renderHook(() => useEscapeKey(callback))

    const event = new KeyboardEvent('keydown', { key: 'Enter' })
    document.dispatchEvent(event)

    expect(callback).not.toHaveBeenCalled()
  })

  it('não deve acionar o callback se estiver inativo (isActive = false)', () => {
    const callback = vi.fn()
    renderHook(() => useEscapeKey(callback, false))

    const event = new KeyboardEvent('keydown', { key: 'Escape' })
    document.dispatchEvent(event)

    expect(callback).not.toHaveBeenCalled()
  })
})
