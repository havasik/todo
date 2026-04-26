import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import TaskInput from './TaskInput'

describe('TaskInput', () => {
  it('renders with correct placeholder', () => {
    render(<TaskInput onSubmit={vi.fn()} />)
    expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument()
  })

  it('has aria-label "Add a new task"', () => {
    render(<TaskInput onSubmit={vi.fn()} />)
    expect(screen.getByLabelText('Add a new task')).toBeInTheDocument()
  })

  it('calls onSubmit with trimmed text on Enter', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    render(<TaskInput onSubmit={onSubmit} />)

    const input = screen.getByLabelText('Add a new task')
    await user.type(input, '  Buy groceries  {Enter}')
    expect(onSubmit).toHaveBeenCalledWith('Buy groceries')
  })

  it('clears input after submit', async () => {
    const user = userEvent.setup()
    render(<TaskInput onSubmit={vi.fn()} />)

    const input = screen.getByLabelText('Add a new task')
    await user.type(input, 'Test{Enter}')
    expect(input).toHaveValue('')
  })

  it('does not call onSubmit on empty Enter', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    render(<TaskInput onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Add a new task'), '{Enter}')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('does not call onSubmit on whitespace-only Enter', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    render(<TaskInput onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Add a new task'), '   {Enter}')
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
