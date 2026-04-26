import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import EmptyState from './EmptyState'

describe('EmptyState', () => {
  it('renders "Todo" heading', () => {
    render(<EmptyState onCreateTodo={vi.fn()} />)
    expect(screen.getByRole('heading', { name: 'Todo' })).toBeInTheDocument()
  })

  it('renders TaskInput with placeholder', () => {
    render(<EmptyState onCreateTodo={vi.fn()} />)
    expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument()
  })

  it('calls onCreateTodo when input submits', async () => {
    const onCreateTodo = vi.fn()
    const user = userEvent.setup()
    render(<EmptyState onCreateTodo={onCreateTodo} />)

    await user.type(screen.getByLabelText('Add a new task'), 'New task{Enter}')
    expect(onCreateTodo).toHaveBeenCalledWith('New task')
  })
})
