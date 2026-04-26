# Story 3.2: Action Error Handling & Recovery

Status: done

## Story

As a **user**,
I want failed actions to revert cleanly with visible feedback,
so that I never silently lose data or end up in a confusing state.

## Acceptance Criteria

1. **Given** I create a task and the API call fails, **When** the server returns an error, **Then** the optimistically-added task is removed from the list, and an inline error message appears near the input area.

2. **Given** I toggle a task's completion and the API call fails, **When** the server returns an error, **Then** the checkbox and visual state revert to their pre-toggle state, and an inline error message appears.

3. **Given** I edit a task's text and the API call fails, **When** the server returns an error, **Then** the task text reverts to its pre-edit value, and an inline error message appears.

4. **Given** I delete a task and the API call fails, **When** the server returns an error, **Then** the task reappears in the list at its original position, and an inline error message appears.

5. **Given** an inline error message is displayed, **When** I observe the message, **Then** it is displayed in the error color (#C5543A), is non-modal, and clearly describes what failed.

6. **Given** an action fails and the UI has reverted, **When** I perform the same action again, **Then** the action retries normally — there is no "stuck" state requiring a page refresh.

## Tasks / Subtasks

- [x] Task 1: Add error state to useTodos hook
  - [x]Track `actionError: string | null` state
  - [x]Set error message in each mutation's `onError` callback
  - [x]Clear error on next successful action or after timeout
  - [x]Return `actionError` and `clearError` from hook
- [x] Task 2: Display inline error in App.tsx
  - [x]Show error message near input area when `actionError` is set
  - [x]Error color (#C5543A), non-modal, text-sm
  - [x]Auto-dismiss after 5 seconds
- [x] Task 3: Verify end-to-end
  - [x]All existing tests pass, TypeScript clean, build succeeds

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Completion Notes List

- actionError state in useTodos with showError helper (5s auto-dismiss)
- Each mutation onError sets descriptive error message: create/toggle/edit/delete
- Inline error display in App.tsx near input area, error color, role="alert"
- clearError exposed for manual dismissal
- 20/20 backend tests, TypeScript clean, Vite build succeeds

### Change Log

- 2026-04-28: Story 3.2 implemented — inline action error messages with 5s auto-dismiss

### File List

- frontend/src/hooks/useTodos.ts (MODIFIED) — actionError state, showError in each mutation onError
- frontend/src/App.tsx (MODIFIED) — Inline error message display near input
