import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import ErrorState from './ErrorState'

describe('ErrorState', () => {
  it('renders error message', () => {
    render(<ErrorState onRetry={vi.fn()} />)
    expect(screen.getByText(/Unable to load tasks/)).toBeInTheDocument()
  })

  it('retry button calls onRetry', async () => {
    const onRetry = vi.fn()
    const user = userEvent.setup()
    render(<ErrorState onRetry={onRetry} />)

    await user.click(screen.getByRole('button', { name: 'Retry' }))
    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('has role="alert"', () => {
    render(<ErrorState onRetry={vi.fn()} />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})
