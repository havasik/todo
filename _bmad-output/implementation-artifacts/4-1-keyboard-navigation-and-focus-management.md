# Story 4.1: Keyboard Navigation & Focus Management

Status: done

## Story

As a **user who navigates with a keyboard**,
I want to perform all task operations without a mouse,
so that I can use the app regardless of my input method.

## Acceptance Criteria

1. **Given** the app is loaded, **When** I press Tab repeatedly, **Then** focus moves through interactive elements in visual order: input field → first task's checkbox → first task's text → first task's delete button → second task's checkbox → etc.

2. **Given** focus is on a task's checkbox, **When** I press Space, **Then** the task's completion state toggles.

3. **Given** focus is on a task's delete button, **When** I press Space or Enter, **Then** the task is deleted and undo toast appears.

4. **Given** the undo toast is visible, **When** I Tab to the Undo link and press Space or Enter, **Then** the task is restored.

5. **Given** any interactive element has focus, **When** I observe the screen, **Then** a visible focus ring (accent color) clearly indicates which element is focused.

6. **Given** a task enters edit mode, **When** editing completes (Enter, Escape, or blur), **Then** focus returns to a logical position (the task row or the next interactive element).

7. **And** focus is never trapped — the user can always Tab away from any element.

8. **And** the delete button becomes visible when its parent task row receives :focus-within.

## Tasks / Subtasks

- [x] Task 1: Make task text keyboard-focusable and editable via Enter (AC: #1, #6)
  - [x]Add `tabIndex={0}` and `role="button"` to task text `<span>` in TaskItem
  - [x]Add `onKeyDown` handler: Enter key triggers `startEditing()`
  - [x]After edit completes, return focus to the text span via ref
- [x] Task 2: Add visible focus rings to all interactive elements (AC: #5)
  - [x]Checkbox: `focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1`
  - [x]Delete button: `focus-visible:ring-2 focus-visible:ring-accent rounded`
  - [x]Undo button in UndoToast: add `focus-visible:ring-2 focus-visible:ring-accent rounded`
  - [x] Task text span: `focus-visible:ring-2 focus-visible:ring-accent rounded`
- [x] Task 3: Verify tab order and keyboard actions (AC: #1, #2, #3, #4, #7, #8)
  - [x]Verify: Tab flows input → checkbox → text → delete → next task → etc.
  - [x]Verify: Space on checkbox toggles completion (native behavior)
  - [x]Verify: Space/Enter on delete button triggers delete (native behavior)
  - [x]Verify: Undo button in toast is tabbable and works with Space/Enter
  - [x]Verify: No focus traps
  - [x]Run all tests, TypeScript check, build

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Completion Notes List

- Task text span: added tabIndex={0}, role="button", onKeyDown (Enter → edit), aria-label, focus-visible ring
- Focus return after edit: requestAnimationFrame → textRef.focus() in both saveEdit and cancelEdit
- Focus rings: checkbox (ring-offset-1), text span, delete button, undo button, ErrorState retry — all using focus-visible:ring-2 ring-accent
- Tab order verified: input → checkbox → text → delete → next task...
- Native checkbox/button behavior handles Space/Enter

### Change Log

- 2026-04-28: Story 4.1 implemented — keyboard navigation, focus rings, text focusable with Enter-to-edit

### File List

- frontend/src/components/TaskItem.tsx (MODIFIED) — Text span focusable (tabIndex, role, onKeyDown, aria-label), focus rings on all elements, focus return after edit
- frontend/src/components/UndoToast.tsx (MODIFIED) — Added focus-visible ring to Undo button
