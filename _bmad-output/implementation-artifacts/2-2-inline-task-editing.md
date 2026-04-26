# Story 2.2: Inline Task Editing

Status: done

## Story

As a **user**,
I want to edit a task's text by clicking on it,
so that I can fix typos without deleting and recreating the task.

## Acceptance Criteria

1. **Given** a task is displayed in the list, **When** I click/tap on the task text (not the checkbox), **Then** the text becomes an editable input field in place, a visual border/highlight appears signaling edit mode, and the cursor is positioned in the text.

2. **Given** a task is in edit mode, **When** I modify the text and press Enter, **Then** the edit is saved, the task returns to display mode, and the updated text is shown.

3. **Given** a task is in edit mode, **When** I modify the text and click/tap outside the field (blur), **Then** the edit is saved, the task returns to display mode.

4. **Given** a task is in edit mode, **When** I press Escape, **Then** the edit is cancelled, the original text is restored, and the task returns to display mode.

5. **Given** a task is in edit mode, **When** I clear all text and press Enter (empty text), **Then** the edit is rejected — original text is restored (cannot save empty task).

6. **Given** I save an edit, **When** the API call completes, **Then** the text updated optimistically before the server responded.

7. **Given** I save an edit, **When** the API call fails, **Then** the text reverts to its pre-edit value automatically.

8. **And** the PATCH /api/todos/:id endpoint accepts `{ text: string }` and validates via Zod (non-empty string).

9. **And** edit mode is visually distinct from display mode — clear enough that the user knows they're editing, not selecting.

10. **And** entering edit mode on one task does not affect other tasks — other tasks remain interactive.

## Tasks / Subtasks

- [x] Task 1: Add editTodo mutation to useTodos hook (AC: #6, #7)
  - [x]Add `editTodo` mutation using `useMutation` with optimistic text update in cache
  - [x]Rollback on error: restore previous cache state
  - [x]Invalidate queries on settle
  - [x]Return `editTodo` from hook
- [x] Task 2: Update TaskItem with inline edit mode (AC: #1, #2, #3, #4, #5, #9, #10)
  - [x]Add `isEditing` local state and `editValue` controlled input state
  - [x]Click on task text `<span>` → enters edit mode: replace span with `<input>`, focus it, set editValue to current text
  - [x]Enter key → if trimmed text is non-empty and changed, call `onEdit(id, text)` and exit edit mode; if empty, restore original text and exit edit mode
  - [x]Blur → same save logic as Enter (save if non-empty and changed, otherwise restore)
  - [x]Escape → cancel: restore original text, exit edit mode
  - [x]Edit mode visual: accent border ring on the input (`focus:ring-2 focus:ring-accent`), surface background
  - [x]`aria-label="Edit task"` on the edit input
  - [x]Add `onEdit: (id: string, text: string) => void` prop
- [x] Task 3: Wire editTodo through TaskList and App.tsx (AC: #6)
  - [x]Add `onEdit` prop to TaskList, pass through to TaskItem
  - [x]Pass `editTodo` from useTodos hook through App.tsx → TaskList → TaskItem
- [x] Task 4: Add backend test for text update via PATCH (AC: #8)
  - [x]Test: PATCH /api/todos/:id with `{ text: "Updated" }` returns updated todo with 200
  - [x]Test: PATCH /api/todos/:id with `{ text: "" }` returns 400 (Zod rejects empty text)
- [x] Task 5: Verify end-to-end
  - [x]Click task text, verify edit mode with visual border
  - [x]Modify text + Enter → saves, returns to display mode
  - [x]Modify text + blur → saves
  - [x]Escape → cancels, original text restored
  - [x]Empty text + Enter → rejects, original text restored
  - [x]Run all tests

## Dev Notes

### Architecture Compliance

**Files to modify:**
```
frontend/src/hooks/useTodos.ts       # UPDATE: add editTodo mutation
frontend/src/components/TaskItem.tsx  # UPDATE: add edit mode with local state
frontend/src/components/TaskList.tsx  # UPDATE: add onEdit prop
frontend/src/App.tsx                 # UPDATE: pass editTodo to TaskList
backend/src/routes/todos.test.ts     # UPDATE: add PATCH text tests
```

### Existing File States

**`frontend/src/components/TaskItem.tsx`** (current):
```tsx
import type { Todo } from '@todo/shared'

interface TaskItemProps {
  todo: Todo
  onToggle: (id: string, completed: boolean) => void
}

export default function TaskItem({ todo, onToggle }: TaskItemProps) {
  return (
    <li className={`min-h-[48px] p-md flex items-center gap-sm transition-all duration-150 ${
      todo.completed ? 'opacity-50' : ''}`}>
      <input type="checkbox" checked={todo.completed}
        onChange={() => onToggle(todo.id, !todo.completed)}
        aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
        className="w-5 h-5 accent-accent cursor-pointer shrink-0" />
      <span className={`text-base ${todo.completed ? 'text-text-secondary' : 'text-text-primary'}`}>
        {todo.text}
      </span>
    </li>
  )
}
```
Changes: Add `isEditing` state, `editValue` state, click handler on span, conditional render (span vs input), keyboard handlers, blur handler, `onEdit` prop.

**Backend PATCH endpoint** — already supports `{ text: string }` updates via `UpdateTodoSchema`. No backend route changes needed.

**`updateTodo` API function** — already exists in `frontend/src/api/todos.ts`, accepts `{ text?: string }`.

### Edit Mode Implementation Pattern

```tsx
// In TaskItem:
const [isEditing, setIsEditing] = useState(false)
const [editValue, setEditValue] = useState(todo.text)

function startEditing() {
  setIsEditing(true)
  setEditValue(todo.text)
}

function saveEdit() {
  const trimmed = editValue.trim()
  if (trimmed && trimmed !== todo.text) {
    onEdit(todo.id, trimmed)
  }
  setEditValue(todo.text) // Reset to current (will update via optimistic)
  setIsEditing(false)
}

function cancelEdit() {
  setEditValue(todo.text)
  setIsEditing(false)
}

function handleKeyDown(e: React.KeyboardEvent) {
  if (e.key === 'Enter') saveEdit()
  if (e.key === 'Escape') cancelEdit()
}
```

Display mode: `<span onClick={startEditing}>` with cursor-text
Edit mode: `<input value={editValue} onChange={...} onKeyDown={...} onBlur={saveEdit} autoFocus />`

### Edit Mutation Pattern (in useTodos)

```typescript
const editMutation = useMutation({
  mutationFn: ({ id, text }: { id: string; text: string }) =>
    updateTodo(id, { text }),
  onMutate: async ({ id, text }) => {
    await queryClient.cancelQueries({ queryKey: ['todos'] })
    const previous = queryClient.getQueryData<ApiResponse<Todo[]>>(['todos'])
    queryClient.setQueryData<ApiResponse<Todo[]>>(['todos'], (old) => ({
      ...old,
      data: (old?.data ?? []).map((t) =>
        t.id === id ? { ...t, text } : t
      ),
    }))
    return { previous }
  },
  onError/onSettled same pattern as toggleMutation
})
```

### Visual Design for Edit Mode

**Display mode (span):**
- `cursor-text` to hint clickability
- Normal text styling (text-primary or text-secondary if completed)

**Edit mode (input):**
- Same size/font as display text (16px, Inter)
- Surface background `bg-surface`
- Accent border ring `ring-2 ring-accent rounded`
- Padding to match display text position
- `autoFocus` for immediate cursor placement

### Critical Warnings

- Do NOT modify backend routes — PATCH already handles `{ text }` via UpdateTodoSchema
- Do NOT add delete functionality — that's Story 2.3
- Do NOT add error display UI — that's Epic 3
- Do NOT modify `frontend/src/index.css` or `frontend/src/main.tsx`
- Clicking the CHECKBOX must NOT enter edit mode — only text click does
- Empty text must be REJECTED on save (not sent to API) — restore original text
- Blur must SAVE (not cancel) — this is explicit in ACs
- Only ONE task in edit mode at a time — but this is naturally handled by local state (each TaskItem manages its own `isEditing`)
- The `autoFocus` on the edit input needs a `useEffect` + `ref.focus()` for reliable behavior

### Technology Versions

| Technology | Version |
|-----------|---------|
| React | 19.2.5 |
| @tanstack/react-query | 5.100.5 |
| Tailwind CSS | 4.2.4 |
| Express | 5.2.1 |
| Vitest | 4.1+ |

### Previous Story Intelligence

From story 2.1:
- PATCH endpoint with `deletedAt: null` guard, destructured `{ text, completed }` from req.body
- `updateTodo(id, data)` API function already supports `{ text?: string }`
- Toggle mutation established the optimistic update pattern (cancel → snapshot → update → rollback → invalidate)
- TaskItem has checkbox + completed state with 150ms transitions
- Review: mass assignment fixed, soft-delete guard added

### Naming Conventions

- Hook mutation: `editTodo` (wraps updateTodo with text-only data)
- Props: `onEdit: (id: string, text: string) => void`
- Local state: `isEditing`, `editValue`
- Handlers: `startEditing`, `saveEdit`, `cancelEdit`

### References

- [Source: epics.md#Story 2.2] — Acceptance criteria
- [Source: UX Design Spec] — Edit mode visual spec, keyboard interaction
- [Source: architecture.md#Frontend Architecture] — Optimistic update pattern
- [Source: 2-1-task-completion-toggle.md] — PATCH endpoint, updateTodo function, mutation pattern

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- No issues. All components compiled cleanly on first attempt. PATCH endpoint already supports text updates from story 2.1.

### Completion Notes List

- All 5 tasks completed
- editTodo optimistic mutation added to useTodos hook (cancel → snapshot → update text in cache → rollback → invalidate)
- TaskItem: click text → edit mode (input with accent ring), Enter/blur saves, Escape cancels, empty text rejected
- useRef + useEffect for reliable autoFocus on edit input
- TaskList and App.tsx wired with onEdit prop
- 2 new backend tests: PATCH text update (200), PATCH empty text (400)
- Total: 15/15 backend tests pass, TypeScript clean, Vite build succeeds

### Change Log

- 2026-04-28: Story 2.2 implemented — inline task editing with optimistic updates, Enter/blur save, Escape cancel

### File List

- frontend/src/hooks/useTodos.ts (MODIFIED) — Added editTodo optimistic mutation
- frontend/src/components/TaskItem.tsx (MODIFIED) — Edit mode with local state, click-to-edit, Enter/blur/Escape handlers
- frontend/src/components/TaskList.tsx (MODIFIED) — Added onEdit prop passthrough
- frontend/src/App.tsx (MODIFIED) — Passes editTodo to TaskList
- backend/src/routes/todos.test.ts (MODIFIED) — Added 2 PATCH text tests
