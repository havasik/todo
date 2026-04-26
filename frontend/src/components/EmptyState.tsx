import TaskInput from './TaskInput'

interface EmptyStateProps {
  onCreateTodo: (text: string) => void
}

export default function EmptyState({ onCreateTodo }: EmptyStateProps) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-[640px] px-md md:px-lg">
        <h1 className="text-[20px] font-semibold leading-[28px] text-text-primary mb-xl text-center">
          Todo
        </h1>
        <TaskInput onSubmit={onCreateTodo} autoFocus />
      </div>
    </main>
  )
}
