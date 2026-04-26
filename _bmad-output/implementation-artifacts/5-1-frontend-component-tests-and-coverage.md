# Story 5.1: Frontend Component Tests & Coverage

Status: done

## Story

As a **developer**,
I want comprehensive frontend component tests with coverage measurement,
so that I can confidently refactor and catch regressions.

## Acceptance Criteria

1. Unit tests exist for all 6 frontend components: TaskInput, TaskItem, TaskList, EmptyState, ErrorState, UndoToast.
2. Tests use Vitest + React Testing Library with jsdom environment.
3. Tests are co-located with source files (ComponentName.test.tsx).
4. Vitest coverage configuration exists with 70% threshold.
5. `npm test -w frontend` runs all component tests.
6. All tests pass.

## Tasks / Subtasks

- [x] Task 1: Install test dependencies
  - [x]Install `vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/coverage-v8` in frontend
  - [x]Create `frontend/vitest.config.ts` with jsdom environment and coverage settings (70% threshold)
  - [x]Create `frontend/src/test/setup.ts` with jest-dom matchers
  - [x]Add `"test": "vitest run"` and `"test:coverage": "vitest run --coverage"` scripts to frontend/package.json
- [x] Task 2: Create TaskInput.test.tsx
  - [x]Test: renders with placeholder "What needs to be done?"
  - [x]Test: calls onSubmit with trimmed text on Enter
  - [x]Test: clears input after submit
  - [x]Test: does not call onSubmit on empty Enter
  - [x]Test: has aria-label "Add a new task"
- [x] Task 3: Create TaskItem.test.tsx
  - [x]Test: renders todo text
  - [x]Test: checkbox toggles completion via onToggle
  - [x]Test: completed state shows opacity-60 class
  - [x]Test: click text triggers edit mode (shows input)
  - [x]Test: Enter in edit mode saves via onEdit
  - [x]Test: Escape in edit mode cancels (restores original text)
  - [x]Test: delete button calls onDelete
  - [x]Test: proper aria-labels on all controls
- [x] Task 4: Create TaskList.test.tsx
  - [x]Test: renders correct number of TaskItems
  - [x]Test: has aria-label "Task list"
  - [x]Test: passes onToggle, onEdit, onDelete to children
- [x] Task 5: Create EmptyState.test.tsx
  - [x]Test: renders "Todo" heading
  - [x]Test: renders TaskInput
  - [x]Test: calls onCreateTodo when input submits
- [x] Task 6: Create ErrorState.test.tsx
  - [x]Test: renders error message text
  - [x]Test: retry button calls onRetry
  - [x]Test: has role="alert"
- [x] Task 7: Create UndoToast.test.tsx
  - [x]Test: renders "Task deleted" and "Undo" button
  - [x]Test: Undo button calls onUndo
  - [x]Test: auto-dismisses after 5s (fake timers)
  - [x]Test: has role="status"
- [x] Task 8: Run coverage and verify 70% threshold
  - [x]Run `npm run test:coverage -w frontend`
  - [x]Verify coverage meets 70% threshold

## Dev Notes

### Dependencies to Install

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/coverage-v8 -w frontend
```

### Vitest Config

```typescript
// frontend/vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    globals: true,
    coverage: {
      provider: 'v8',
      include: ['src/components/**'],
      thresholds: { statements: 70, branches: 70, functions: 70, lines: 70 },
    },
  },
})
```

### Test Setup

```typescript
// frontend/src/test/setup.ts
import '@testing-library/jest-dom/vitest'
```

### Testing Patterns

- Use `render()` from @testing-library/react
- Use `screen` for queries (getByRole, getByText, getByPlaceholder, getByLabelText)
- Use `userEvent` from @testing-library/user-event for interactions
- Use `vi.fn()` for mock callbacks
- Use `vi.useFakeTimers()` for UndoToast auto-dismiss test
- Components that use TanStack Query need `QueryClientProvider` wrapper in tests
- Components are simple enough that most tests don't need the query provider (they receive data via props)

### Critical Warnings

- Do NOT modify any component source files — tests only
- Tests must be co-located: `frontend/src/components/ComponentName.test.tsx`
- EmptyState.tsx is unused in App.tsx (layout was unified) but still needs tests since the file exists
- TaskItem has complex edit mode — test Enter save, Escape cancel, blur save, empty rejection

### Component Props Reference

- TaskInput: `{ onSubmit: (text: string) => void, autoFocus?: boolean }`
- TaskItem: `{ todo: Todo, onToggle: (id, completed) => void, onEdit: (id, text) => void, onDelete: (id) => void }`
- TaskList: `{ todos: Todo[], onToggle, onEdit, onDelete }`
- EmptyState: `{ onCreateTodo: (text: string) => void }`
- ErrorState: `{ onRetry: () => void }`
- UndoToast: `{ onUndo: () => void, onDismiss: () => void }`

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6 (1M context)

### Completion Notes List
- 6 test files, 27 component tests, all passing
- Coverage: 91.5% statements, 82.4% branches, 90.9% functions, 92.7% lines (all above 70%)
- Vitest config with jsdom, v8 coverage, 70% threshold
- Test setup with jest-dom matchers

### Change Log
- 2026-04-28: Story 5.1 — frontend component tests + coverage config

### File List
- frontend/vitest.config.ts (NEW) — Vitest config with jsdom + coverage
- frontend/src/test/setup.ts (NEW) — jest-dom matchers setup
- frontend/src/components/TaskInput.test.tsx (NEW) — 6 tests
- frontend/src/components/TaskItem.test.tsx (NEW) — 8 tests
- frontend/src/components/TaskList.test.tsx (NEW) — 3 tests
- frontend/src/components/EmptyState.test.tsx (NEW) — 3 tests
- frontend/src/components/ErrorState.test.tsx (NEW) — 3 tests
- frontend/src/components/UndoToast.test.tsx (NEW) — 4 tests
- frontend/package.json (MODIFIED) — Added test scripts + test dependencies
