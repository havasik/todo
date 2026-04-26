import { useEffect } from 'react'

interface UndoToastProps {
  onUndo: () => void
  onDismiss: () => void
}

export default function UndoToast({ onUndo, onDismiss }: UndoToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-xl left-1/2 -translate-x-1/2 bg-surface rounded-lg shadow-lg px-lg py-md flex items-center gap-sm text-sm animate-[slideUp_200ms_ease-out]"
    >
      <span className="text-text-secondary">Task deleted</span>
      <span className="text-text-secondary">·</span>
      <button
        onClick={onUndo}
        className="text-accent underline font-medium cursor-pointer rounded focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
      >
        Undo
      </button>
    </div>
  )
}
