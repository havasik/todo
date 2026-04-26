import type { Todo } from '@todo/shared'
import TaskItem from './TaskItem'

interface TaskListProps {
  todos: Todo[]
  onToggle: (id: string, completed: boolean) => void
  onEdit: (id: string, text: string) => void
  onDelete: (id: string) => void
}

export default function TaskList({ todos, onToggle, onEdit, onDelete }: TaskListProps) {
  return (
    <ul aria-label="Task list" className="flex flex-col gap-lg">
      {todos.map((todo) => (
        <TaskItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}
