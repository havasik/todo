import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import TaskItem from './TaskItem'
import type { Todo } from '@todo/shared'

const baseTodo: Todo = {
  id: '1',
  text: 'Buy groceries',
  completed: false,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
  deletedAt: null,
}

const defaultProps = {
  todo: baseTodo,
  onToggle: vi.fn(),
  onEdit: vi.fn(),
  onDelete: vi.fn(),
}

describe('TaskItem', () => {
  it('renders todo text', () => {
    render(<TaskItem {...defaultProps} />)
    expect(screen.getByText('Buy groceries')).toBeInTheDocument()
  })

  it('checkbox calls onToggle', async () => {
    const onToggle = vi.fn()
    const user = userEvent.setup()
    render(<TaskItem {...defaultProps} onToggle={onToggle} />)

    await user.click(screen.getByRole('checkbox'))
    expect(onToggle).toHaveBeenCalledWith('1', true)
  })

  it('completed todo has opacity-60 class', () => {
    const completedTodo = { ...baseTodo, completed: true }
    const { container } = render(<TaskItem {...defaultProps} todo={completedTodo} />)
    expect(container.querySelector('li')).toHaveClass('opacity-60')
  })

  it('clicking text enters edit mode', async () => {
    const user = userEvent.setup()
    render(<TaskItem {...defaultProps} />)

    await user.click(screen.getByText('Buy groceries'))
    expect(screen.getByLabelText('Edit task')).toBeInTheDocument()
  })

  it('Enter in edit mode calls onEdit', async () => {
    const onEdit = vi.fn()
    const user = userEvent.setup()
    render(<TaskItem {...defaultProps} onEdit={onEdit} />)

    await user.click(screen.getByText('Buy groceries'))
    const editInput = screen.getByLabelText('Edit task')
    await user.clear(editInput)
    await user.type(editInput, 'Updated text{Enter}')
    expect(onEdit).toHaveBeenCalledWith('1', 'Updated text')
  })

  it('Escape in edit mode cancels without saving', async () => {
    const onEdit = vi.fn()
    const user = userEvent.setup()
    render(<TaskItem {...defaultProps} onEdit={onEdit} />)

    await user.click(screen.getByText('Buy groceries'))
    const editInput = screen.getByLabelText('Edit task')
    await user.clear(editInput)
    await user.type(editInput, 'Changed{Escape}')
    expect(onEdit).not.toHaveBeenCalled()
    expect(screen.getByText('Buy groceries')).toBeInTheDocument()
  })

  it('delete button calls onDelete', async () => {
    const onDelete = vi.fn()
    const user = userEvent.setup()
    render(<TaskItem {...defaultProps} onDelete={onDelete} />)

    await user.click(screen.getByLabelText('Delete task'))
    expect(onDelete).toHaveBeenCalledWith('1')
  })

  it('has proper aria-labels', () => {
    render(<TaskItem {...defaultProps} />)
    expect(screen.getByLabelText(/Mark "Buy groceries" as complete/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Edit "Buy groceries"/)).toBeInTheDocument()
    expect(screen.getByLabelText('Delete task')).toBeInTheDocument()
  })
})
