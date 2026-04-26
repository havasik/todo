import { useState } from 'react'

interface TaskInputProps {
  onSubmit: (text: string) => void
  autoFocus?: boolean
}

export default function TaskInput({ onSubmit, autoFocus = false }: TaskInputProps) {
  const [value, setValue] = useState('')

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key !== 'Enter') return
    const trimmed = value.trim()
    if (!trimmed) return
    onSubmit(trimmed)
    setValue('')
  }

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="What needs to be done?"
      autoFocus={autoFocus}
      aria-label="Add a new task"
      className="w-full bg-surface text-text-primary placeholder:text-placeholder rounded-lg p-md text-base focus:outline-none focus:ring-2 focus:ring-accent"
    />
  )
}
