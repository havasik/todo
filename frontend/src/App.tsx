import { useState, useCallback, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTodos } from './hooks/useTodos'
import TaskInput from './components/TaskInput'
import TaskList from './components/TaskList'
import UndoToast from './components/UndoToast'
import ErrorState from './components/ErrorState'
import type { Todo } from '@todo/shared'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      retry: 1,
    },
  },
})

function TodoApp() {
  const { todos, isLoading, isError, refetch, actionError, createTodo, toggleTodo, editTodo, removeTodo, undoDelete } = useTodos()
  const [pendingDelete, setPendingDelete] = useState<Todo | null>(null)
  const [showLoading, setShowLoading] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      setShowLoading(false)
      return
    }
    const timer = setTimeout(() => setShowLoading(true), 200)
    return () => clearTimeout(timer)
  }, [isLoading])

  function handleDelete(id: string): void {
    const todo = todos.find((t) => t.id === id)
    if (!todo) return
    setPendingDelete(todo)
    removeTodo(id)
  }

  function handleUndo(): void {
    if (pendingDelete) {
      undoDelete(pendingDelete.id, pendingDelete)
      setPendingDelete(null)
    }
  }

  const handleDismiss = useCallback(() => {
    setPendingDelete(null)
  }, [])

  if (isError) {
    return <ErrorState onRetry={refetch} />
  }

  if (isLoading) {
    if (!showLoading) return null
    return (
      <main className="min-h-screen pt-2xl">
        <div className="w-full max-w-[640px] mx-auto px-md md:px-lg text-center mt-xl">
          <p className="text-text-secondary text-sm">Loading...</p>
        </div>
      </main>
    )
  }

  const isEmpty = todos.length === 0

  return (
    <>
      <main
        className={`min-h-screen flex flex-col transition-all duration-150 ${
          isEmpty ? 'items-center justify-center' : 'pt-2xl'
        }`}
      >
        <div className={`w-full max-w-[640px] px-md md:px-lg ${isEmpty ? '' : 'mx-auto'}`}>
          <h1
            className={`text-[20px] font-semibold leading-[28px] text-text-primary ${
              isEmpty ? 'mb-xl text-center' : ''
            }`}
          >
            Todo
          </h1>
          <div className={isEmpty ? '' : 'mt-lg'}>
            <TaskInput onSubmit={createTodo} autoFocus />
          </div>
          {actionError && (
            <p className="mt-sm text-error text-sm" role="alert">
              {actionError}
            </p>
          )}
          {!isEmpty && (
            <div className="mt-xl">
              <TaskList
                todos={todos}
                onToggle={toggleTodo}
                onEdit={editTodo}
                onDelete={handleDelete}
              />
            </div>
          )}
        </div>
      </main>
      {pendingDelete && (
        <UndoToast key={pendingDelete.id} onUndo={handleUndo} onDismiss={handleDismiss} />
      )}
    </>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TodoApp />
    </QueryClientProvider>
  )
}

export default App
