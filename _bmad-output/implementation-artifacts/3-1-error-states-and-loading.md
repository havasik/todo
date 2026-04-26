# Story 3.1: Error States & Loading

Status: done

## Story

As a **user**,
I want to see clear feedback when the app is loading or can't connect to the server,
so that I always know the current state of my data and never wonder "is it broken?"

## Acceptance Criteria

1. **Given** the app is opening and the API call to fetch todos takes longer than 200ms, **When** the loading threshold is exceeded, **Then** a loading indicator is displayed (spinner or skeleton).

2. **Given** the app is opening and the API responds within 200ms, **When** data loads quickly, **Then** no loading indicator is ever shown — tasks appear directly.

3. **Given** the API is unreachable on page load, **When** the fetch todos request fails, **Then** the ErrorState component is displayed: centered error message ("Unable to load tasks. Check your connection and try again.") with a retry button.

4. **Given** the error state is displayed, **When** I click the retry button, **Then** the app attempts to fetch todos again.

5. **Given** the error state is displayed, **When** I observe the screen, **Then** the error state is visually distinct from the empty state — no input field is shown, no hero centering that implies "no tasks exist".

6. **And** the ErrorState component uses `role="alert"` and `aria-live="polite"` for screen reader announcement.

7. **And** the retry button is styled with the accent color and is keyboard-accessible.

## Tasks / Subtasks

- [x] Task 1: Create ErrorState component (AC: #3, #5, #6, #7)
  - [x]Create `frontend/src/components/ErrorState.tsx`
  - [x]Centered layout (NOT hero-centered like EmptyState — use different visual treatment)
  - [x]Error message: "Unable to load tasks. Check your connection and try again." in error color (#C5543A)
  - [x]Retry button: accent color (#4A90A4), keyboard-accessible
  - [x]`role="alert"` and `aria-live="polite"` on the container
  - [x]No input field, no title — visually distinct from empty state
- [x] Task 2: Implement 200ms loading delay in App.tsx (AC: #1, #2)
  - [x]Add `showLoading` state with `useState(false)`
  - [x]Use `useEffect` with 200ms `setTimeout` — only set `showLoading = true` after 200ms if still loading
  - [x]Clear timer when loading completes
  - [x]When `isLoading && showLoading`: render a simple loading indicator (centered spinner text or dots)
  - [x]When `isLoading && !showLoading`: render null (no flash of loading state)
- [x] Task 3: Add error state rendering in App.tsx (AC: #3, #4)
  - [x]When `isError`: render `<ErrorState onRetry={refetch} />`
  - [x]Extract `refetch` from `useQuery` in useTodos hook and return it
  - [x]Error state takes priority over loading and empty states
- [x] Task 4: Update useTodos hook to expose refetch (AC: #4)
  - [x]Add `refetch` from useQuery destructuring
  - [x]Return `refetch` from the hook
- [x] Task 5: Verify end-to-end
  - [x]Stop backend, load app → verify ErrorState shows with retry button
  - [x]Click retry → verify app attempts to refetch
  - [x]Start backend, load app with fast response → verify no loading indicator
  - [x]Run all tests

## Dev Notes

### Architecture Compliance

**Files to create/modify:**
```
frontend/src/components/ErrorState.tsx  # NEW
frontend/src/hooks/useTodos.ts          # UPDATE: expose refetch
frontend/src/App.tsx                    # UPDATE: loading delay + error rendering
```

### Existing App.tsx State

Current loading handling: `if (isLoading) return null` — needs 200ms delay logic.
Current error handling: `isError` destructured from useTodos but unused — needs ErrorState render.

### ErrorState Component Spec

```tsx
// Centered but NOT vertically centered like EmptyState
// Use pt-2xl (same as active state) to distinguish from hero-centered empty state
<main className="min-h-screen pt-2xl">
  <div role="alert" aria-live="polite"
    className="w-full max-w-[640px] mx-auto px-md md:px-lg text-center mt-xl">
    <p className="text-error text-sm font-medium">
      Unable to load tasks. Check your connection and try again.
    </p>
    <button onClick={onRetry}
      className="mt-lg text-accent font-medium underline cursor-pointer">
      Retry
    </button>
  </div>
</main>
```

### 200ms Loading Delay Pattern

```tsx
const [showLoading, setShowLoading] = useState(false)

useEffect(() => {
  if (!isLoading) {
    setShowLoading(false)
    return
  }
  const timer = setTimeout(() => setShowLoading(true), 200)
  return () => clearTimeout(timer)
}, [isLoading])
```

Render logic order:
1. `isError` → ErrorState
2. `isLoading && showLoading` → Loading indicator
3. `isLoading && !showLoading` → null (invisible, waiting for 200ms)
4. `todos.length === 0` → Empty state
5. Otherwise → Active task list

### Loading Indicator

Simple centered text "Loading..." — no external spinner library needed. Keep it minimal per architecture (NFR4: minimal JS bundle).

### Critical Warnings

- Do NOT add inline error messages for mutations (create/edit/delete failures) — that's Story 3.2
- Do NOT modify backend routes or API client
- Do NOT change the empty state or active state layouts
- ErrorState must NOT show the TaskInput — that would confuse it with the empty state
- The 200ms threshold is for initial page load ONLY — mutations use optimistic updates (no loading shown)
- `refetch` from TanStack Query retries the GET /api/todos call

### Technology Versions

| Technology | Version |
|-----------|---------|
| React | 19.2.5 |
| @tanstack/react-query | 5.100.5 |
| Tailwind CSS | 4.2.4 |

### References

- [Source: epics.md#Story 3.1] — Acceptance criteria
- [Source: UX Design Spec] — ErrorState component, loading state 200ms threshold
- [Source: architecture.md#Frontend Architecture] — Loading/error state patterns

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- No issues encountered.

### Completion Notes List

- ErrorState component: centered error message + retry button, role="alert", aria-live="polite"
- 200ms loading delay: useEffect + setTimeout, no flash for fast loads
- Error state rendered when isError, loading indicator when isLoading && showLoading
- useTodos exposes refetch for retry functionality
- 20/20 backend tests pass, TypeScript clean, Vite build succeeds

### Change Log

- 2026-04-28: Story 3.1 implemented — ErrorState component, 200ms loading delay, refetch retry

### File List

- frontend/src/components/ErrorState.tsx (NEW) — Error state with retry button
- frontend/src/hooks/useTodos.ts (MODIFIED) — Exposed refetch from useQuery
- frontend/src/App.tsx (MODIFIED) — 200ms loading delay, error state rendering
