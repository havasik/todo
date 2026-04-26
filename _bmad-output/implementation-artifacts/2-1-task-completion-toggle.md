# Story 2.1: Task Completion Toggle

Status: done

## Story

As a **user**,
I want to mark tasks as complete and see them visually distinguished from active tasks,
so that I can track my progress at a glance.

## Acceptance Criteria

1. **Given** an active task exists in the list, **When** I click/tap the checkbox, **Then** the task toggles to completed: checkbox fills, text and row visually mute (reduced opacity ~50-60%), task stays inline in the same position.

2. **Given** a completed task exists in the list, **When** I click/tap the checkbox again, **Then** the task toggles back to active: full opacity restored, checkbox unchecked.

3. **Given** I toggle a task's completion, **When** the API call completes, **Then** the UI updated optimistically before the server responded (TanStack Query optimistic mutation).

4. **Given** I toggle a task's completion, **When** the API call fails, **Then** the toggle reverts to its previous state automatically (TanStack Query rollback).

5. **And** the PATCH /api/todos/:id endpoint accepts `{ completed: boolean }` and returns the updated todo.

6. **And** the completion transition uses a 150ms opacity/style transition.

7. **And** the checkbox and task text are visually and spatially distinct click targets — clicking the checkbox toggles completion, clicking the text does NOT.

## Tasks / Subtasks

- [x] Task 1: Add PATCH endpoint to backend (AC: #5)
  - [x]Add PATCH `/:id` route to `backend/src/routes/todos.ts` — validate with `UpdateTodoSchema`, `prisma.todo.update({ where: { id }, data })`, return `{ data: todo }` with 200
  - [x]Handle 404 when todo not found (Prisma P2025 → error handler)
- [x] Task 2: Add updateTodo API client function (AC: #3)
  - [x]Add `updateTodo(id, data)` to `frontend/src/api/todos.ts` — PATCH request with typed response
- [x] Task 3: Add toggle mutation to useTodos hook (AC: #3, #4)
  - [x]Add `toggleTodo` mutation to `frontend/src/hooks/useTodos.ts`
  - [x]Optimistic update: flip `completed` boolean in cache for the specific todo
  - [x]Rollback on error: restore previous cache state
  - [x]Invalidate queries on settle
  - [x]Return `toggleTodo` from hook
- [x] Task 4: Update TaskItem with checkbox and completed state (AC: #1, #2, #6, #7)
  - [x]Add `<input type="checkbox">` to left of task text in `frontend/src/components/TaskItem.tsx`
  - [x]Add `onToggle: (id: string) => void` prop
  - [x]Completed state: `opacity-50` on the `<li>`, text secondary color `text-text-secondary`
  - [x]Checkbox: accent color when checked
  - [x]150ms transition: `transition-all duration-150` on the `<li>`
  - [x]Checkbox and text are separate click targets — checkbox has `onChange`, text has no click handler
  - [x]`aria-label` on checkbox: "Mark [task text] as complete/incomplete"
- [x] Task 5: Wire toggleTodo through TaskList to TaskItem (AC: #1, #2)
  - [x]Pass `onToggle` from App.tsx → TaskList → TaskItem
  - [x]Update TaskList props to include `onToggle`
- [x] Task 6: Add backend integration tests (AC: #5)
  - [x]Test: PATCH /api/todos/:id with `{ completed: true }` returns updated todo with 200
  - [x]Test: PATCH /api/todos/:id with `{ completed: false }` returns updated todo with 200
  - [x]Test: PATCH /api/todos/:id for non-existent id returns 404
  - [x]Test: PATCH /api/todos/:id with invalid body returns 400
- [x] Task 7: Verify end-to-end
  - [x]Create tasks, toggle completion via checkbox, verify visual muting
  - [x]Toggle back to active, verify opacity restored
  - [x]Refresh page, verify completed state persists
  - [x]Run all tests (backend + frontend build)

### Review Findings

- [x] [Review][Patch] Mass assignment — PATCH used raw req.body, fixed to destructure only { text, completed }
- [x] [Review][Patch] No soft-delete guard on PATCH — added `deletedAt: null` to where clause
- [x] [Review][Defer] Rapid double-click fires concurrent mutations — deferred, add isPending guard later
- [x] [Review][Defer] Stale snapshot in concurrent mutation rollback — low risk, onSettled corrects
- [x] [Review][Defer] Empty body {} is a silent no-op — acceptable, server handles gracefully
- [x] [Review][Defer] Soft-deleted todo can be patched — addressed by adding deletedAt: null guard

## Dev Notes

### Architecture Compliance

**Files to modify/create:**
```
backend/src/routes/todos.ts       # UPDATE: add PATCH /:id handler
backend/src/routes/todos.test.ts  # UPDATE: add PATCH tests
frontend/src/api/todos.ts         # UPDATE: add updateTodo function
frontend/src/hooks/useTodos.ts    # UPDATE: add toggleTodo mutation
frontend/src/components/TaskItem.tsx  # UPDATE: add checkbox + completed state
frontend/src/components/TaskList.tsx  # UPDATE: pass onToggle prop
frontend/src/App.tsx              # UPDATE: pass toggleTodo to TaskList
```

### Existing File States

**`backend/src/routes/todos.ts`** (current — GET and POST only):
```typescript
import { Router } from 'express'
import { CreateTodoSchema } from '@todo/shared'
import prisma from '../lib/prisma.js'
import { validate } from '../middleware/validate.js'

const router = Router()
router.get('/', async (_req, res) => { ... })
router.post('/', validate(CreateTodoSchema), async (req, res) => { ... })
export default router
```
Add: PATCH `/:id` with `validate(UpdateTodoSchema)`.

**`frontend/src/api/todos.ts`** (current — getTodos and createTodo):
```typescript
import type { Todo, ApiResponse } from '@todo/shared'
const API_BASE = '/api/todos'
export async function getTodos(): Promise<ApiResponse<Todo[]>> { ... }
export async function createTodo(text: string): Promise<ApiResponse<Todo>> { ... }
```
Add: `updateTodo(id: string, data: { completed?: boolean; text?: string })`.

**`frontend/src/hooks/useTodos.ts`** (current — useQuery + createMutation):
Returns `{ todos, isLoading, isError, createTodo }`. Add `toggleTodo` mutation.

**`frontend/src/components/TaskItem.tsx`** (current — text only):
```typescript
export default function TaskItem({ todo }: TaskItemProps) {
  return <li className="min-h-[48px] p-md text-base text-text-primary">{todo.text}</li>
}
```
Transform into three-zone layout: `[Checkbox][Text][future: Delete]`.

### API Contract — PATCH Endpoint

```
PATCH /api/todos/:id
Body: { completed?: boolean, text?: string }
Response: { data: Todo } (200)
Error: { error: "..." } (400/404/500)
```

Validation: `UpdateTodoSchema` from `@todo/shared` — already defined:
```typescript
const UpdateTodoSchema = z.object({
  text: z.string().min(1).optional(),
  completed: z.boolean().optional(),
})
```

### Backend PATCH Implementation

```typescript
router.patch('/:id', validate(UpdateTodoSchema), async (req, res) => {
  const todo = await prisma.todo.update({
    where: { id: req.params.id },
    data: req.body,
  })
  res.json({ data: todo })
})
```
Prisma P2025 error (not found) is already handled by `errorHandler` middleware from Story 1.2.

### Frontend updateTodo API Function

```typescript
export async function updateTodo(
  id: string,
  data: { completed?: boolean; text?: string },
): Promise<ApiResponse<Todo>> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update todo')
  return res.json()
}
```

### Toggle Mutation Pattern

```typescript
const toggleMutation = useMutation({
  mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
    updateTodo(id, { completed }),
  onMutate: async ({ id, completed }) => {
    await queryClient.cancelQueries({ queryKey: ['todos'] })
    const previous = queryClient.getQueryData<ApiResponse<Todo[]>>(['todos'])
    queryClient.setQueryData<ApiResponse<Todo[]>>(['todos'], (old) => ({
      ...old,
      data: (old?.data ?? []).map((t) =>
        t.id === id ? { ...t, completed } : t
      ),
    }))
    return { previous }
  },
  onError: (_err, _vars, context) => {
    if (context?.previous) queryClient.setQueryData(['todos'], context.previous)
  },
  onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
})
```

### TaskItem Visual Design

**Active state:** Full opacity, unchecked checkbox
```
┌─────────────────────────────────────┐
│ ☐  Buy groceries                    │
└─────────────────────────────────────┘
```

**Completed state:** 50% opacity, checked checkbox, secondary text color
```
┌─────────────────────────────────────┐
│ ☑  Buy groceries                    │  (opacity-50, text-text-secondary)
└─────────────────────────────────────┘
```

**Layout:** `flex items-center gap-sm` within `<li>`
- Checkbox: `<input type="checkbox">` with accent color, `w-5 h-5`
- Text: `<span>` with text, flex-1

**CSS for completed state:**
```
<li className={`min-h-[48px] p-md flex items-center gap-sm transition-all duration-150 ${
  todo.completed ? 'opacity-50' : ''
}`}>
  <input type="checkbox" checked={todo.completed} ... />
  <span className={todo.completed ? 'text-text-secondary' : 'text-text-primary'}>
    {todo.text}
  </span>
</li>
```

### Critical Warnings

- Do NOT add inline editing — that's Story 2.2
- Do NOT add delete functionality — that's Story 2.3
- Do NOT add error display UI — that's Epic 3
- Do NOT modify `frontend/src/index.css` or `frontend/src/main.tsx`
- The PATCH endpoint handles BOTH `completed` and `text` updates (UpdateTodoSchema) — Story 2.2 will use the same endpoint for text editing
- Clicking the task TEXT must NOT toggle completion — only the checkbox does
- `UpdateTodoSchema` already exists in `@todo/shared` — import it, don't recreate
- The `validate` middleware already exists in `backend/src/middleware/validate.ts` — reuse it
- Error handler already catches Prisma P2025 — no need for manual try/catch in route handler

### Technology Versions

| Technology | Version |
|-----------|---------|
| React | 19.2.5 |
| @tanstack/react-query | 5.100.5 |
| Tailwind CSS | 4.2.4 |
| Express | 5.2.1 |
| Prisma | 7.7.0 |
| Vitest | 4.1+ |

### Previous Story Intelligence

From story 1.4:
- TanStack Query optimistic mutation pattern established with `...old` spread
- TaskItem is display-only `<li>` with `min-h-[48px] p-md text-base text-text-primary`
- TaskList passes `key={todo.id}` for each TaskItem
- App.tsx passes `createTodo` from useTodos hook to components
- Layout uses single `<main>` with CSS transitions

From story 1.2:
- Error handler catches `AppError` (ValidationError → 400, NotFoundError → 404) and Prisma P2025 → 404
- SyntaxError (malformed JSON) → 400
- Backend tests use Vitest + supertest importing `app` from `../index.js`
- Tests clean up with `prisma.todo.deleteMany()` in `beforeEach`

### Naming Conventions

- Backend route: `PATCH /:id` in `todos.ts`
- API function: `updateTodo(id, data)` (camelCase)
- Hook mutation: `toggleTodo(id)` — wraps updateTodo with completion toggle logic
- Props: `onToggle: (id: string) => void`
- CSS: Tailwind utilities (`opacity-50`, `text-text-secondary`, `transition-all duration-150`)

### References

- [Source: architecture.md#API & Communication Patterns] — PATCH endpoint contract
- [Source: architecture.md#Frontend Architecture] — Optimistic update pattern
- [Source: UX Design Spec] — TaskItem completed state, 150ms transition, opacity 50-60%
- [Source: epics.md#Story 2.1] — Acceptance criteria
- [Source: 1-4-task-creation-and-list-display.md] — Previous story learnings
- [Source: 1-2-task-api-and-validation.md] — Backend middleware patterns

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- No issues. PATCH endpoint, optimistic toggle mutation, and checkbox UI all worked on first attempt.

### Completion Notes List

- All 7 tasks completed
- PATCH /api/todos/:id endpoint with UpdateTodoSchema validation
- updateTodo API client function added to frontend/src/api/todos.ts
- toggleTodo optimistic mutation in useTodos hook — flips completed in cache, rollback on error
- TaskItem updated: checkbox + text layout, 150ms opacity transition, secondary color on completed
- TaskList and App.tsx wired with onToggle prop
- 4 new backend integration tests (PATCH completed true/false, 404, invalid body)
- Total backend tests: 13/13 pass
- Frontend TypeScript clean, Vite build succeeds

### Change Log

- 2026-04-28: Story 2.1 implemented — task completion toggle with PATCH endpoint, optimistic UI, and 150ms transitions

### File List

- backend/src/routes/todos.ts (MODIFIED) — Added PATCH /:id with UpdateTodoSchema validation
- backend/src/routes/todos.test.ts (MODIFIED) — Added 4 PATCH integration tests
- frontend/src/api/todos.ts (MODIFIED) — Added updateTodo(id, data) function
- frontend/src/hooks/useTodos.ts (MODIFIED) — Added toggleTodo optimistic mutation, returns toggleTodo
- frontend/src/components/TaskItem.tsx (MODIFIED) — Checkbox + completed state (opacity-50, text-secondary, 150ms transition)
- frontend/src/components/TaskList.tsx (MODIFIED) — Added onToggle prop passthrough
- frontend/src/App.tsx (MODIFIED) — Passes toggleTodo to TaskList
