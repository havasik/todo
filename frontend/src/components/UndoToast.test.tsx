import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import UndoToast from './UndoToast'

describe('UndoToast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders "Task deleted" and Undo button', () => {
    render(<UndoToast onUndo={vi.fn()} onDismiss={vi.fn()} />)
    expect(screen.getByText('Task deleted')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Undo' })).toBeInTheDocument()
  })

  it('Undo button calls onUndo', () => {
    const onUndo = vi.fn()
    render(<UndoToast onUndo={onUndo} onDismiss={vi.fn()} />)

    screen.getByRole('button', { name: 'Undo' }).click()
    expect(onUndo).toHaveBeenCalledOnce()
  })

  it('auto-dismisses after 5 seconds', () => {
    const onDismiss = vi.fn()
    render(<UndoToast onUndo={vi.fn()} onDismiss={onDismiss} />)

    expect(onDismiss).not.toHaveBeenCalled()
    act(() => { vi.advanceTimersByTime(5000) })
    expect(onDismiss).toHaveBeenCalledOnce()
  })

  it('has role="status"', () => {
    render(<UndoToast onUndo={vi.fn()} onDismiss={vi.fn()} />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})
