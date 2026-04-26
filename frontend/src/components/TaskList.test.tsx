import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import TaskList from './TaskList'
import type { Todo } from '@todo/shared'

const todos: Todo[] = [
  { id: '1', text: 'Task A', completed: false, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z', deletedAt: null },
  { id: '2', text: 'Task B', completed: true, createdAt: '2026-01-02T00:00:00Z', updatedAt: '2026-01-02T00:00:00Z', deletedAt: null },
]

describe('TaskList', () => {
  it('renders correct number of items', () => {
    render(<TaskList todos={todos} onToggle={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('has aria-label "Task list"', () => {
    render(<TaskList todos={todos} onToggle={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByLabelText('Task list')).toBeInTheDocument()
  })

  it('renders empty list when no todos', () => {
    render(<TaskList todos={[]} onToggle={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })
})
