# Story 2.3: Task Deletion with Undo

Status: done

## Story

As a **user**,
I want to delete tasks I no longer need with a brief window to undo,
so that I can clean up my list without fear of accidental data loss.

## Acceptance Criteria

1. **Given** a task exists in the list on desktop, **When** I hover over the task row, **Then** a delete icon (✕) appears on the right side of the row with a subtle fade-in.

2. **Given** a task exists in the list on desktop, **When** my mouse is not hovering over the task row, **Then** the delete icon is hidden.

3. **Given** a task exists in the list on mobile (touch device), **When** the task is displayed, **Then** the delete icon is always visible (no hover state on touch devices).

4. **Given** a task exists and the delete icon is visible, **When** I click/tap the delete icon, **Then** the task disappears from the list immediately and an undo toast slides up from the bottom: "Task deleted · Undo".

5. **Given** the undo toast is visible, **When** I click the "Undo" link within 5 seconds, **Then** the task is restored to its original position and state in the list, and the toast dismisses.

6. **Given** the undo toast is visible, **When** 5 seconds pass without clicking Undo, **Then** the toast auto-dismisses with a fade-out, and the deletion is permanent.

7. **Given** all tasks are deleted (list becomes empty), **When** the last deletion's undo window expires, **Then** the layout transitions back to the hero centered empty state.

8. **And** DELETE /api/todos/:id sets deletedAt timestamp (soft delete) and returns the deleted todo.

9. **And** PATCH /api/todos/:id/restore clears deletedAt and returns the restored todo.

10. **And** the delete and restore operations use optimistic mutations.

11. **And** the undo toast uses accent color for the "Undo" link.

12. **And** the delete icon is keyboard-accessible — visible on :focus-within of the task row.

13. **And** hover-reveal vs always-visible is determined by pointer capability (media query or pointer detection).

## Tasks / Subtasks

- [x] Task 1: Add DELETE and restore endpoints to backend (AC: #8, #9)
  - [x]Add `DELETE /:id` route — `prisma.todo.update({ where: { id, deletedAt: null }, data: { deletedAt: new Date() } })`, return `{ data: todo }` with 200
  - [x]Add `PATCH /:id/restore` route — `prisma.todo.update({ where: { id }, data: { deletedAt: null } })`, return `{ data: todo }` with 200
  - [x]Handle 404 for non-existent todos (Prisma P2025 → error handler)
- [x] Task 2: Add deleteTodo and restoreTodo API client functions (AC: #10)
  - [x]Add `deleteTodo(id)` to `frontend/src/api/todos.ts` — DELETE request
  - [x]Add `restoreTodo(id)` to `frontend/src/api/todos.ts` — PATCH request to `/restore`
- [x] Task 3: Add delete and restore mutations to useTodos hook (AC: #10)
  - [x]`deleteTodo` mutation: optimistically remove todo from cache, return deleted todo in context for undo
  - [x]`restoreTodo` mutation: optimistically add todo back to cache at correct position
  - [x]Return `deleteTodo` and `restoreTodo` from hook
- [x] Task 4: Create UndoToast component (AC: #4, #5, #6, #11)
  - [x]Create `frontend/src/components/UndoToast.tsx`
  - [x]Props: `onUndo: () => void`, `onDismiss: () => void`
  - [x]Message: "Task deleted · Undo" with accent-colored "Undo" link
  - [x]5-second auto-dismiss timer via useEffect
  - [x]Slide-up entrance, fade-out exit (200ms transition)
  - [x]`role="status"` and `aria-live="polite"` for screen readers
  - [x]Fixed position at bottom of content area
  - [x]14px text, 500 weight for "Undo" link
- [x] Task 5: Add delete icon to TaskItem (AC: #1, #2, #3, #12, #13)
  - [x]Add delete button (✕) right-aligned in TaskItem
  - [x]Desktop: hidden by default, visible on row `:hover` and `:focus-within` with fade-in
  - [x]Mobile: always visible — use `@media (pointer: fine)` to detect pointer capability
  - [x]`aria-label="Delete task"` on the button
  - [x]`onDelete: (id: string) => void` prop
  - [x]Error color (#C5543A) for the delete icon
- [x] Task 6: Wire delete flow in App.tsx (AC: #4, #5, #6, #7)
  - [x]Add state: `pendingDelete: { id: string; todo: Todo } | null`
  - [x]`handleDelete(id)`: call `deleteTodo`, store deleted todo in state, show toast
  - [x]`handleUndo()`: call `restoreTodo` with stored todo id, clear state
  - [x]`handleDismiss()`: clear state (deletion already committed on server)
  - [x]Pass `onDelete` through TaskList to TaskItem
  - [x]Render UndoToast when `pendingDelete` is set
  - [x]Empty state transition when all tasks deleted and undo expires
- [x] Task 7: Add backend integration tests (AC: #8, #9)
  - [x]Test: DELETE /api/todos/:id returns deleted todo with deletedAt set, status 200
  - [x]Test: DELETE /api/todos/:id for non-existent id returns 404
  - [x]Test: Deleted todo excluded from GET /api/todos (already tested in story 1.2)
  - [x]Test: PATCH /api/todos/:id/restore returns restored todo with deletedAt null, status 200
  - [x]Test: PATCH /api/todos/:id/restore for non-existent id returns 404
- [x] Task 8: Verify end-to-end
  - [x]Hover over task → delete icon appears (desktop)
  - [x]Click delete → task disappears, undo toast shows
  - [x]Click Undo within 5s → task restored
  - [x]Wait 5s → toast auto-dismisses
  - [x]Delete all tasks → empty state returns
  - [x]Run all tests

## Dev Notes

### Architecture Compliance

**Files to create/modify:**
```
backend/src/routes/todos.ts         # UPDATE: add DELETE /:id and PATCH /:id/restore
backend/src/routes/todos.test.ts    # UPDATE: add DELETE and restore tests
frontend/src/api/todos.ts           # UPDATE: add deleteTodo and restoreTodo
frontend/src/hooks/useTodos.ts      # UPDATE: add delete and restore mutations
frontend/src/components/TaskItem.tsx # UPDATE: add delete button
frontend/src/components/TaskList.tsx # UPDATE: add onDelete prop
frontend/src/components/UndoToast.tsx # NEW: undo toast component
frontend/src/App.tsx                # UPDATE: delete flow state + UndoToast render
```

### Backend Endpoints

**DELETE /api/todos/:id** — Soft delete:
```typescript
router.delete('/:id', async (req, res) => {
  const todo = await prisma.todo.update({
    where: { id: req.params.id, deletedAt: null },
    data: { deletedAt: new Date() },
  })
  res.json({ data: todo })
})
```

**PATCH /api/todos/:id/restore** — Restore:
```typescript
router.patch('/:id/restore', async (req, res) => {
  const todo = await prisma.todo.update({
    where: { id: req.params.id },
    data: { deletedAt: null },
  })
  res.json({ data: todo })
})
```

Both use Prisma P2025 error handling from existing middleware. No Zod validation needed (no request body).

Note: The restore route MUST be defined BEFORE the existing `PATCH /:id` route, otherwise Express matches `:id` as "restore". Place it above the generic PATCH handler.

### Frontend API Functions

```typescript
export async function deleteTodo(id: string): Promise<ApiResponse<Todo>> {
  const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete todo')
  return res.json()
}

export async function restoreTodo(id: string): Promise<ApiResponse<Todo>> {
  const res = await fetch(`${API_BASE}/${id}/restore`, { method: 'PATCH' })
  if (!res.ok) throw new Error('Failed to restore todo')
  return res.json()
}
```

### Delete Mutation Pattern

```typescript
const deleteMutation = useMutation({
  mutationFn: (id: string) => deleteTodo(id),
  onMutate: async (id) => {
    await queryClient.cancelQueries({ queryKey: ['todos'] })
    const previous = queryClient.getQueryData<ApiResponse<Todo[]>>(['todos'])
    queryClient.setQueryData<ApiResponse<Todo[]>>(['todos'], (old) => ({
      ...old,
      data: (old?.data ?? []).filter((t) => t.id !== id),
    }))
    return { previous }
  },
  onError: (_err, _id, context) => {
    if (context?.previous) queryClient.setQueryData(['todos'], context.previous)
  },
  onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
})
```

### UndoToast Component Spec

- Fixed position: `fixed bottom-xl left-1/2 -translate-x-1/2` (centered at bottom)
- Max width matches content: `max-w-[640px]`
- Background: surface color, rounded, shadow
- Text: "Task deleted · Undo" — 14px, secondary color for "Task deleted", accent color + underline for "Undo"
- Auto-dismiss: `useEffect` with `setTimeout(onDismiss, 5000)`, cleanup on unmount
- Entrance: `animate-slide-up` or `transition-all` with translate-y
- `role="status"` `aria-live="polite"`

### Delete Icon in TaskItem

```tsx
<button
  onClick={() => onDelete(todo.id)}
  aria-label="Delete task"
  className="text-error opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-150 shrink-0
    pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100"
>
  ✕
</button>
```

TaskItem `<li>` needs `group` class for group-hover. For mobile, the delete icon should be `opacity-100` by default, with `pointer-fine:opacity-0` overriding only for fine-pointer (mouse) devices.

Tailwind 4 supports `@media (pointer: fine)` via custom variant or inline `@media` in the `@theme` block. Use the Tailwind `@custom-variant` or inline media query approach:
```css
@custom-variant pointer-fine (@media (pointer: fine));
```
Add this to `frontend/src/index.css`.

### App.tsx Delete Flow State

```typescript
const [pendingDelete, setPendingDelete] = useState<Todo | null>(null)

function handleDelete(id: string) {
  const todo = todos.find(t => t.id === id)
  if (todo) setPendingDelete(todo)
  deleteTodo(id)
}

function handleUndo() {
  if (pendingDelete) {
    restoreTodo(pendingDelete.id)
    setPendingDelete(null)
  }
}

function handleDismiss() {
  setPendingDelete(null)
}
```

### Critical Warnings

- The restore route `PATCH /:id/restore` MUST be defined BEFORE `PATCH /:id` in the Express router — otherwise `:id` captures "restore" as the id parameter
- Do NOT add error display UI — that's Epic 3
- Do NOT modify `frontend/src/index.css` beyond adding the pointer-fine custom variant
- The undo toast timer must be CLEANED UP on unmount to prevent memory leaks
- When a new delete happens while an undo toast is visible, the previous deletion becomes permanent and the new toast replaces it
- The soft delete is already committed to the server when the toast shows — undo calls restore, NOT a new create

### Technology Versions

| Technology | Version |
|-----------|---------|
| React | 19.2.5 |
| @tanstack/react-query | 5.100.5 |
| Tailwind CSS | 4.2.4 |
| Express | 5.2.1 |
| Vitest | 4.1+ |

### Previous Story Intelligence

From story 2.2:
- TaskItem has checkbox + edit mode (isEditing state, click-to-edit, escapingRef guard for blur/cancel race)
- useTodos returns: todos, isLoading, isError, createTodo, toggleTodo, editTodo
- All mutations use cancel → snapshot → update → rollback → invalidate pattern
- TaskList passes onToggle + onEdit props

From story 2.1:
- PATCH endpoint uses `deletedAt: null` in where clause (soft-delete guard)
- Backend tests use `prisma.todo.deleteMany()` in beforeEach for cleanup

### References

- [Source: architecture.md#API & Communication Patterns] — DELETE and restore endpoints
- [Source: architecture.md#Frontend Architecture] — Undo-delete flow
- [Source: UX Design Spec] — UndoToast spec, delete icon, hover-reveal, animations
- [Source: epics.md#Story 2.3] — Acceptance criteria
- [Source: 2-2-inline-task-editing.md] — Previous story context

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- Restore route placed BEFORE generic PATCH /:id to avoid Express route parameter capture
- Used @custom-variant for pointer-fine media query in Tailwind 4
- slideUp keyframe animation added to index.css for toast entrance

### Completion Notes List

- All 8 tasks completed
- DELETE /api/todos/:id — soft delete (sets deletedAt), returns deleted todo
- PATCH /api/todos/:id/restore — clears deletedAt, returns restored todo
- deleteTodo + restoreTodo API client functions
- deleteMutation (optimistic filter) + restoreMutation in useTodos hook
- UndoToast: "Task deleted · Undo", 5s auto-dismiss, slideUp animation, role="status"
- TaskItem: delete button (✕) with hover-reveal on desktop (pointer-fine), always visible on mobile, focus:opacity-100 for keyboard
- App.tsx: pendingDelete state, handleDelete/handleUndo/handleDismiss flow
- 5 new backend tests (soft-delete, 404s, already-deleted, restore)
- Total: 20/20 backend tests pass, TypeScript clean, Vite build succeeds

### Change Log

- 2026-04-28: Story 2.3 implemented — task deletion with undo toast, soft delete, restore endpoint

### File List

- backend/src/routes/todos.ts (MODIFIED) — Added DELETE /:id and PATCH /:id/restore endpoints
- backend/src/routes/todos.test.ts (MODIFIED) — Added 5 DELETE/restore integration tests
- frontend/src/api/todos.ts (MODIFIED) — Added deleteTodo and restoreTodo functions
- frontend/src/hooks/useTodos.ts (MODIFIED) — Added deleteMutation and restoreMutation
- frontend/src/components/TaskItem.tsx (MODIFIED) — Added delete button with hover-reveal
- frontend/src/components/TaskList.tsx (MODIFIED) — Added onDelete prop
- frontend/src/components/UndoToast.tsx (NEW) — Undo toast with 5s timer, slide-up animation
- frontend/src/App.tsx (MODIFIED) — Delete flow state management, UndoToast render
- frontend/src/index.css (MODIFIED) — Added pointer-fine custom variant, slideUp keyframe
