interface ErrorStateProps {
  onRetry: () => void
}

export default function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <main className="min-h-screen pt-2xl">
      <div
        role="alert"
        className="w-full max-w-[640px] mx-auto px-md md:px-lg text-center mt-xl"
      >
        <p className="text-error text-sm font-medium">
          Unable to load tasks. Check your connection and try again.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-lg text-accent font-medium underline cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
        >
          Retry
        </button>
      </div>
    </main>
  )
}
