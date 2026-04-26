import { useState, useRef, useEffect } from 'react'
import type { Todo } from '@todo/shared'

interface TaskItemProps {
  todo: Todo
  onToggle: (id: string, completed: boolean) => void
  onEdit: (id: string, text: string) => void
  onDelete: (id: string) => void
}

export default function TaskItem({ todo, onToggle, onEdit, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(todo.text)
  const inputRef = useRef<HTMLInputElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const escapingRef = useRef(false)
  const returnFocusRef = useRef(false)

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
    }
  }, [isEditing])

  useEffect(() => {
    if (!isEditing && returnFocusRef.current) {
      returnFocusRef.current = false
      textRef.current?.focus()
    }
  }, [isEditing])

  function startEditing(): void {
    setEditValue(todo.text)
    escapingRef.current = false
    setIsEditing(true)
  }

  function saveEdit(shouldReturnFocus = false): void {
    if (escapingRef.current) return
    const trimmed = editValue.trim()
    if (trimmed && trimmed !== todo.text) {
      onEdit(todo.id, trimmed)
    }
    setEditValue(todo.text)
    returnFocusRef.current = shouldReturnFocus
    setIsEditing(false)
  }

  function cancelEdit(): void {
    escapingRef.current = true
    setEditValue(todo.text)
    returnFocusRef.current = true
    setIsEditing(false)
  }

  function handleEditKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === 'Enter') {
      saveEdit(true)
    } else if (e.key === 'Escape') {
      cancelEdit()
    }
  }

  function handleTextKeyDown(e: React.KeyboardEvent<HTMLSpanElement>): void {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      startEditing()
    }
  }

  return (
    <li
      className={`group min-h-[48px] p-md flex items-center gap-sm transition-all duration-150 ${
        todo.completed ? 'opacity-60' : ''
      }`}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id, !todo.completed)}
        aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
        className="w-5 h-5 accent-accent cursor-pointer shrink-0 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1"
      />
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleEditKeyDown}
          onBlur={() => saveEdit(false)}
          aria-label="Edit task"
          className="flex-1 text-base text-text-primary bg-surface ring-2 ring-accent rounded p-xs"
        />
      ) : (
        <span
          ref={textRef}
          tabIndex={0}
          role="button"
          onClick={startEditing}
          onKeyDown={handleTextKeyDown}
          aria-label={`Edit "${todo.text}"`}
          className={`flex-1 text-base cursor-text rounded focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${
            todo.completed ? 'text-text-secondary' : 'text-text-primary'
          }`}
        >
          {todo.text}
        </span>
      )}
      <button
        onClick={() => onDelete(todo.id)}
        aria-label="Delete task"
        className="text-error shrink-0 cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center opacity-100 pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100 pointer-fine:group-focus-within:opacity-100 transition-opacity duration-150 rounded focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
      >
        ✕
      </button>
    </li>
  )
}
