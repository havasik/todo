# Story 1.4: Task Creation & List Display

Status: done

## Story

As a **user**,
I want to open the app, see an inviting empty state, create tasks, and see them in a list,
so that I can start tracking my tasks immediately without any setup.

## Acceptance Criteria

1. **Given** the app loads with no existing todos, **When** the page finishes loading, **Then** the user sees the hero centered empty state: "Todo" title and input field vertically centered in the viewport, with placeholder "What needs to be done?"

2. **Given** the input field is visible, **When** the page loads, **Then** the input field has autofocus — the cursor is active without clicking.

3. **Given** the user types "Buy groceries" in the input field, **When** they press Enter, **Then** the task appears instantly at the top of the task list, the input field clears, and the layout transitions from hero centered to top-anchored active state.

4. **Given** the user has created 3 tasks in order: "Task A", "Task B", "Task C", **When** they view the task list, **Then** tasks are displayed newest first: "Task C", "Task B", "Task A".

5. **Given** the user types in the input field, **When** they press Enter with empty text, **Then** nothing happens — no task is created, no error is shown.

6. **Given** the user has created tasks and closes the browser tab, **When** they reopen the app later, **Then** all tasks are present exactly as they were (server-side persistence confirmed).

7. **And** the max content width is 640px, centered on desktop.

8. **And** task rows use the 8px spacing grid with 24px gap between items.

9. **And** the layout transition from empty state to active state is smooth (CSS transition).

## Tasks / Subtasks

- [x] Task 1: Create useTodos hook (AC: #3, #4, #6)
  - [x] Create `frontend/src/hooks/useTodos.ts`
  - [x] `useTodos()` hook using `useQuery` to fetch todos via `getTodos()` from api/todos.ts
  - [x] `useCreateTodo()` hook using `useMutation` with optimistic update: add new todo to cache immediately, invalidate on success
  - [x] Return `{ todos, isLoading, isError, createTodo }` from the hook
- [x] Task 2: Create TaskInput component (AC: #1, #2, #3, #5)
  - [x] Create `frontend/src/components/TaskInput.tsx`
  - [x] Full-width input with placeholder "What needs to be done?"
  - [x] `autoFocus` on mount
  - [x] Enter key submits: if text is non-empty after trim, call `onSubmit(text)` prop and clear input; if empty, do nothing
  - [x] Surface background (#F5F5F0), accent focus ring, 16px padding, Inter 16px font
  - [x] `aria-label="Add a new task"`
- [x] Task 3: Create TaskItem component (AC: #4, #8)
  - [x] Create `frontend/src/components/TaskItem.tsx`
  - [x] Display task text in a `<li>` element
  - [x] 48px minimum height, md (16px) internal padding, text-primary color
  - [x] No checkbox, delete, or edit functionality yet — those are Epic 2
- [x] Task 4: Create TaskList component (AC: #4, #8)
  - [x] Create `frontend/src/components/TaskList.tsx`
  - [x] Semantic `<ul aria-label="Task list">` containing TaskItem for each todo
  - [x] 24px (lg) gap between items
  - [x] Renders todos in the order received (backend returns newest-first)
- [x] Task 5: Create EmptyState component (AC: #1)
  - [x] Create `frontend/src/components/EmptyState.tsx`
  - [x] Hero centered layout: `min-h-screen flex flex-col items-center justify-center`
  - [x] "Todo" title: Inter 20px, font-semibold (600 weight), 28px line height
  - [x] Contains TaskInput component below title
  - [x] Max width 640px, horizontal padding 16px mobile / 24px desktop
- [x] Task 6: Update App.tsx with layout orchestration (AC: #1, #3, #7, #9)
  - [x] Replace placeholder content with layout logic
  - [x] Use `useTodos()` hook to get todos, loading, error state
  - [x] If no todos: render EmptyState (hero centered)
  - [x] If todos exist: render top-anchored active state (title + input at top, TaskList below)
  - [x] Max content width 640px centered (`max-w-[640px] mx-auto`)
  - [x] Horizontal padding: `px-md md:px-lg`
  - [x] Semantic `<main>` wrapper with `<h1>` for title
  - [x] Layout transition: CSS transition on container for smooth empty→active switch
- [x] Task 7: Verify end-to-end
  - [x] Start full stack (`docker compose up -d && npm run dev`)
  - [x] Verify empty state renders correctly (hero centered, autofocus)
  - [x] Create a task via Enter, verify it appears and layout transitions
  - [x] Create multiple tasks, verify newest-first ordering
  - [x] Verify empty input Enter does nothing
  - [x] Refresh page, verify tasks persist
  - [x] Run backend tests to confirm no regressions

### Review Findings

- [x] [Review][Patch] AC9: No smooth layout transition — refactored to single `<main>` with CSS `transition-all duration-150` between centered/top-anchored states
- [x] [Review][Patch] Optimistic update drops ApiResponse fields — fixed with `...old` spread
- [x] [Review][Defer] crypto.randomUUID() browser compat — modern browsers only target, acceptable
- [x] [Review][Defer] Rapid Enter causes duplicate submissions — deferred, Epic 2 will add isPending guard
- [x] [Review][Defer] isError not consumed — ErrorState is Epic 3 scope
- [x] [Review][Defer] staleTime: 0 + optimistic update race on window focus — low risk
- [x] [Review][Defer] QueryClient at module scope — no SSR, acceptable for SPA
- [x] [Review][Defer] Unicode whitespace bypass — server validates
- [x] [Review][Defer] No maxLength on input — server validates, layout overflow deferred

## Dev Notes

### Architecture Compliance

**Frontend component structure** (from architecture.md):
```
frontend/src/
├── api/
│   └── todos.ts            # EXISTS from 1.3 — getTodos(), createTodo()
├── hooks/
│   └── useTodos.ts         # NEW — TanStack Query hooks
├── components/
│   ├── TaskInput.tsx        # NEW — task creation input
│   ├── TaskItem.tsx         # NEW — single task row
│   ├── TaskList.tsx         # NEW — task list container
│   └── EmptyState.tsx       # NEW — hero centered empty state
├── App.tsx                  # UPDATE — layout orchestration
├── main.tsx                 # EXISTS — DO NOT MODIFY
└── index.css                # EXISTS — DO NOT MODIFY (tokens from 1.3)
```

### Existing Files to Modify

**`frontend/src/App.tsx`** (current state):
```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 0, retry: 1 },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <h1>Todo</h1>
        <p>App is running.</p>
      </div>
    </QueryClientProvider>
  )
}

export default App
```
Changes: Replace inner `<div>` content with layout orchestration. Keep QueryClientProvider wrapper.

### Component Specifications

**TaskInput:**
- Full-width input, no submit button
- Placeholder: "What needs to be done?"
- Styling: `bg-surface text-text-primary placeholder:text-placeholder rounded-lg p-md text-base font-normal focus:outline-none focus:ring-2 focus:ring-accent w-full`
- `autoFocus` prop
- `aria-label="Add a new task"`
- Props: `onSubmit: (text: string) => void`
- Internal state: controlled input value
- On Enter: trim text, if non-empty call onSubmit and clear, if empty do nothing
- On keyDown: only respond to Enter key

**TaskItem:**
- Simple display row for Story 1.4 — no checkbox, no edit, no delete
- Styling: `min-h-[48px] p-md text-base text-text-primary`
- Semantic `<li>` element
- Props: `todo: Todo`
- Display: `todo.text`

**TaskList:**
- Semantic `<ul aria-label="Task list">`
- Gap: `flex flex-col gap-lg` (24px)
- Maps todos to TaskItem components
- Props: `todos: Todo[]`

**EmptyState:**
- Hero centered: `min-h-screen flex flex-col items-center justify-center`
- Content wrapper: `w-full max-w-[640px] px-md md:px-lg`
- Title: `<h1>` with `text-[20px] font-semibold leading-[28px] text-text-primary mb-xl text-center`
- Contains `<TaskInput onSubmit={...} />`

**Active State Layout (in App.tsx):**
- Container: `min-h-screen pt-2xl`
- Content wrapper: `w-full max-w-[640px] mx-auto px-md md:px-lg`
- Title: `<h1>` with same styling as EmptyState but not centered vertically
- Input below title with `mt-lg` margin
- TaskList below input with `mt-xl` margin

### TanStack Query Hook Pattern

```typescript
// hooks/useTodos.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTodos, createTodo } from '../api/todos'
import type { Todo } from '@todo/shared'

export function useTodos() {
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['todos'],
    queryFn: getTodos,
    select: (response) => response.data, // unwrap ApiResponse
  })

  const createMutation = useMutation({
    mutationFn: (text: string) => createTodo(text),
    onMutate: async (text) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })
      const previous = queryClient.getQueryData(['todos'])
      // Optimistic update: add temp todo to top of list
      queryClient.setQueryData(['todos'], (old) => ({
        data: [{ id: crypto.randomUUID(), text, completed: false,
          createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
          deletedAt: null }, ...(old?.data ?? [])],
      }))
      return { previous }
    },
    onError: (_err, _text, context) => {
      queryClient.setQueryData(['todos'], context?.previous)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  return {
    todos: data ?? [],
    isLoading,
    isError,
    createTodo: createMutation.mutate,
  }
}
```

### Layout Transition

The transition from empty→active state uses conditional rendering:
- `todos.length === 0 && !isLoading` → EmptyState
- `todos.length > 0` → Active state layout

For smooth transition, apply CSS transition on the container that changes from centered to top-anchored. Use `transition-all duration-150` on the wrapper. However, since we conditionally render different components (EmptyState vs Active), the transition is more of a layout swap — keep it simple with CSS.

**`prefers-reduced-motion`:** The story specifies smooth transitions. The design tokens from 1.3 don't include motion settings. For now, use standard CSS transitions. Motion reduction will be addressed in Story 4.3.

### API Contract (from Story 1.2)

- `GET /api/todos` → `{ data: Todo[] }` (200) — newest first, excludes soft-deleted
- `POST /api/todos` with `{ text: string }` → `{ data: Todo }` (201)
- Validation: empty text returns 400 (but client prevents sending empty text)

### Design Tokens Available (from Story 1.3)

Colors: `bg-background`, `bg-surface`, `text-text-primary`, `text-text-secondary`, `text-placeholder`, `text-accent`, `text-error`, `bg-accent`, `bg-error`

Spacing: `p-xs` (4px), `p-sm` (8px), `p-md` (16px), `p-lg` (24px), `p-xl` (32px), `p-2xl` (48px) — same for margin, gap, etc.

Font: `font-sans` (Inter) is the default.

### Critical Warnings

- Do NOT create ErrorState or UndoToast components — those are Epic 3 and Epic 2 scope
- Do NOT add checkbox, delete, or edit functionality to TaskItem — those are Epic 2
- Do NOT modify `frontend/src/index.css` — design tokens are already set from Story 1.3
- Do NOT modify `frontend/src/main.tsx`
- Do NOT modify `frontend/src/api/todos.ts` — API client is already set from Story 1.3
- Do NOT create Playwright E2E tests — those are Story 4.4
- TaskItem is display-only in this story — just text, no interactive elements beyond the row itself
- The `useTodos` hook should use `select` to unwrap `ApiResponse.data` so components receive `Todo[]` directly
- Import paths in frontend do NOT need `.js` extension (Vite handles resolution)

### Technology Versions

| Technology | Version |
|-----------|---------|
| React | 19.2.5 |
| @tanstack/react-query | 5.100.5 |
| Tailwind CSS | 4.2.4 |
| TypeScript | 6.0.2 |
| Vite | 8.0.10 |

### Previous Story Intelligence

From story 1.3:
- Design tokens configured in index.css `@theme` block — all 7 colors and 6 spacing tokens available
- TanStack Query provider wraps app in App.tsx with `staleTime: 0, retry: 1`
- API client functions `getTodos()` and `createTodo(text)` exist in `api/todos.ts`
- Both return `Promise<ApiResponse<T>>` — the hook must unwrap `.data`
- Frontend builds cleanly, TypeScript strict mode

From story 1.2:
- Backend API verified and tested with 9 integration tests
- `GET /api/todos` returns `{ data: Todo[] }` ordered by `createdAt DESC`
- `POST /api/todos` with `{ text: string }` returns `{ data: Todo }` with 201
- Soft-deleted todos excluded from GET response

### Naming Conventions

- Components: PascalCase files (`TaskInput.tsx`, `TaskItem.tsx`)
- Hooks: camelCase with `use` prefix (`useTodos.ts`)
- Props types: `ComponentNameProps` (`TaskInputProps`, `TaskItemProps`)
- Functions: camelCase (`createTodo`, `getTodos`)
- No `.js` extension in frontend imports

### Shared Types (from @todo/shared)

```typescript
interface Todo {
  id: string; text: string; completed: boolean;
  createdAt: string; updatedAt: string; deletedAt: string | null;
}
interface ApiResponse<T> { data: T }
```

### References

- [Source: architecture.md#Frontend Architecture] — TanStack Query, component architecture, data flow
- [Source: architecture.md#Project Structure & Boundaries] — Frontend directory layout
- [Source: UX Design Spec] — Component specs, layout states, spacing, typography
- [Source: epics.md#Story 1.4] — Acceptance criteria
- [Source: 1-3-frontend-foundation-and-design-tokens.md] — Design tokens, API client, TanStack Query setup
- [Source: 1-2-task-api-and-validation.md] — API contract, backend endpoints

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- No issues encountered. All components compiled and built cleanly on first attempt.

### Completion Notes List

- All 7 tasks and all subtasks completed successfully
- useTodos hook: useQuery with select to unwrap ApiResponse, useMutation with optimistic create (temp UUID, prepend to cache, invalidate on settle, rollback on error)
- TaskInput: controlled input, Enter key submit, empty text guard, autoFocus, aria-label, surface bg with accent focus ring
- TaskItem: simple display-only <li> with 48px min height, text-primary color
- TaskList: semantic <ul> with aria-label, flex col with 24px gap
- EmptyState: hero centered layout (min-h-screen flex center), title + TaskInput
- App.tsx: TodoApp inner component uses useTodos, conditional render (empty→EmptyState, populated→active layout), QueryClientProvider wrapper preserved
- Active layout: top-anchored with 640px max-width, responsive padding, title + input + task list
- TypeScript strict mode: clean compile
- Vite build: successful (228KB JS, 9KB CSS)
- Backend regression: 9/9 tests pass

### Change Log

- 2026-04-28: Story 1.4 implemented — complete "first visit" experience with empty state, task creation, and list display

### File List

- frontend/src/hooks/useTodos.ts (NEW) — TanStack Query hook with useQuery + optimistic useMutation
- frontend/src/components/TaskInput.tsx (NEW) — Task creation input with Enter submit
- frontend/src/components/TaskItem.tsx (NEW) — Single task display row
- frontend/src/components/TaskList.tsx (NEW) — Task list container with semantic markup
- frontend/src/components/EmptyState.tsx (NEW) — Hero centered empty state layout
- frontend/src/App.tsx (MODIFIED) — Layout orchestration: empty vs active state, TodoApp component
