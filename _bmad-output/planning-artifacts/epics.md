---
stepsCompleted:
  - 1
  - 2
  - 3
  - 4
status: complete
inputDocuments:
  - prd.md
  - architecture.md
  - ux-design-specification.md
---

# Todo - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Todo, decomposing the requirements from the PRD, UX Design, and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

- FR1: User can create a new task by typing text into an input field and pressing enter
- FR2: User can see the input field immediately upon opening the application, without any prerequisite actions
- FR3: User can create a task with a short text description (the only required field)
- FR4: System assigns a creation timestamp to each new task automatically
- FR5: User can view all tasks immediately upon opening the application
- FR6: User can see tasks ordered by creation time, newest first
- FR7: User can visually distinguish completed tasks from active tasks at a glance
- FR8: User can see a clear empty state when no tasks exist, with an obvious affordance to create the first task
- FR9: User can edit the text of an existing task inline by clicking on the task text
- FR10: User can save an edited task by pressing enter or clicking/tapping away (blur)
- FR11: User can cancel an edit without saving changes
- FR12: User can toggle a task between active and completed states
- FR13: User can see completed tasks visually muted but remaining inline with active tasks
- FR14: User can un-complete a previously completed task (toggle back to active)
- FR15: User can permanently delete an individual task
- FR16: System removes deleted tasks from the list immediately
- FR17: System persists all task data server-side via a backend API
- FR18: System preserves all tasks across browser restarts, cache clears, and device reboots
- FR19: System stores task data indefinitely with no session expiry or automatic cleanup
- FR20: System supports all task operations (create, read, update, delete) through a RESTful API
- FR21: System displays clear feedback when a task operation fails due to network or server error
- FR22: System distinguishes between an empty task list (no tasks created) and a failed data load (error state)
- FR23: System displays a loading state while fetching task data
- FR24: System never silently loses user data — all failures are surfaced visibly
- FR25: User can perform all task operations on both desktop and mobile viewports
- FR26: System adapts its layout to the current viewport width without horizontal scrolling
- FR27: User can interact with all touch targets at a size appropriate for thumb interaction on mobile
- FR28: User can perform all task operations (create, edit, complete, delete) using only a keyboard
- FR29: User can navigate all interactive elements in a logical tab order with visible focus indicators
- FR30: Screen reader users can understand the state and content of all tasks and controls via proper semantic markup and ARIA attributes
- FR31: System provides sufficient color contrast for all text and interactive elements per WCAG 2.1 AA

### NonFunctional Requirements

- NFR1: Initial page load completes in under 1 second on a standard broadband connection
- NFR2: All user-initiated actions (create, edit, complete, delete) reflect in the UI in under 100ms
- NFR3: API response times remain under 100ms for all CRUD operations under normal conditions
- NFR4: JavaScript bundle size stays minimal — no unnecessary dependencies or frameworks beyond what the app requires
- NFR5: Performance does not degrade noticeably as the task list grows to 100+ items
- NFR6: Task data persists with zero data loss across browser restarts, cache clears, and server restarts
- NFR7: The application handles server unavailability gracefully — users see clear error states, never corrupted or partial data
- NFR8: Database operations are atomic — a failed write does not leave data in an inconsistent state
- NFR9: The application recovers cleanly from network interruptions without requiring a manual page refresh
- NFR10: All client-server communication uses HTTPS in production
- NFR11: API inputs are validated and sanitized server-side to prevent injection attacks
- NFR12: Error responses do not leak internal implementation details (stack traces, database structure)
- NFR13: Codebase follows consistent formatting and naming conventions across frontend and backend
- NFR14: Frontend and backend are cleanly separated with a well-defined API contract between them
- NFR15: API endpoints are documented sufficiently for another developer to understand and extend
- NFR16: Automated tests cover all API endpoints and core UI interaction flows
- NFR17: A new developer can set up the local development environment and run the application within 15 minutes using documented steps
- NFR18: The complete application (frontend, backend, database) runs in Docker containers via a single docker compose up command
- NFR19: The deployment configuration is reproducible — same containers produce the same behavior across environments
- NFR20: Environment-specific configuration (ports, database connection) is externalized via environment variables, not hardcoded

### Additional Requirements

From Architecture:
- Composable scaffold: npm workspaces monorepo with frontend/, backend/, shared/ directories
- Starter template: Vite 8 react-ts for frontend, manual Express 5.2 setup for backend
- Database: PostgreSQL 18.3 in Docker, Prisma 7.7 ORM with prisma.config.ts
- Data model: Todo entity with uuid id, text, completed, createdAt, updatedAt, deletedAt (soft delete)
- Validation: Zod schemas in shared/ package, used by both frontend and backend
- State management: TanStack Query for all server state, optimistic mutations with rollback
- API client: Thin fetch wrapper in frontend/src/api/todos.ts, typed per endpoint
- Error handling: Centralized Express error middleware with typed error classes (NotFoundError, ValidationError)
- Security: helmet middleware, CORS configured, Zod input sanitization
- Docker: Multi-stage builds (Vite→nginx for frontend, TS compile→Node.js for backend), docker-compose.yml
- Development: Vite HMR + tsx watch concurrently via root npm run dev, PostgreSQL in Docker during dev
- Testing: Vitest 4.1 for unit/integration, Playwright 1.59 for E2E, co-located test files
- Node.js 22 LTS for Docker images
- Shared package named @todo/shared
- Vite API proxy for development (server.proxy in vite.config.ts)

### UX Design Requirements

- UX-DR1: Implement warm neutral color system — background (#FAFAF8), surface (#F5F5F0), text primary (#2C2C2A), text secondary (#8A8A85), placeholder (#B5B5B0), accent (#4A90A4), error (#C5543A)
- UX-DR2: Implement Inter typeface with type scale — app title 20px/600, task text 16px/400, error/toast 14px/500, all on 8px grid line heights
- UX-DR3: Implement 8px spacing grid with defined tokens — xs(4px), sm(8px), md(16px), lg(24px), xl(32px), 2xl(48px)
- UX-DR4: Implement 640px max-width centered layout with responsive horizontal padding (16px mobile, 24px+ desktop)
- UX-DR5: Implement hero centered empty state (flexbox vertical centering, title + input) that transitions to top-anchored active state when tasks exist
- UX-DR6: Implement TaskInput component — full-width input, placeholder "What needs to be done?", autofocus on load, enter to submit, no submit button
- UX-DR7: Implement TaskItem component — three-zone layout [Checkbox][Task Text][Delete Icon], with active/completed/hover/edit/deleting states
- UX-DR8: Implement hover-reveal delete — visible on desktop :hover and :focus-within, always visible on mobile (pointer capability detection)
- UX-DR9: Implement inline editing — click task text to enter edit mode with visual border, enter/blur to save, escape to cancel
- UX-DR10: Implement completed task visual treatment — reduced opacity (~50-60%), checkbox filled, stays inline with active tasks
- UX-DR11: Implement UndoToast component — slides up on delete, "Task deleted · Undo" text, 5s auto-dismiss, accent color undo link
- UX-DR12: Implement keyboard navigation model — full tab order (input → checkbox → text → delete per row), visible focus rings, space/enter for actions
- UX-DR13: Implement screen reader support — semantic HTML (main, h1, ul/li, input), ARIA labels on all controls, role="alert" for errors, role="status" for undo toast, aria-live regions
- UX-DR14: Implement error state — distinct from empty state, centered error message + retry button, no input field shown during load failure
- UX-DR15: Implement loading state — only shown if initial load takes >200ms, never shown between user-initiated actions (optimistic updates)
- UX-DR16: Implement responsive breakpoint strategy — mobile-first base styles, md (768px+) for desktop adjustments (hover states, larger padding, max-width constraint)
- UX-DR17: Implement prefers-reduced-motion support — suppress or make instant all transitions (150ms completion, 200ms toast entrance)

### FR Coverage Map

| FR | Epic | Description |
|----|------|-------------|
| FR1 | Epic 1 | Create task via input + enter |
| FR2 | Epic 1 | Input field visible immediately |
| FR3 | Epic 1 | Task with text description |
| FR4 | Epic 1 | Auto creation timestamp |
| FR5 | Epic 1 | View all tasks on open |
| FR6 | Epic 1 | Tasks ordered newest first |
| FR7 | Epic 2 | Visual distinction completed/active |
| FR8 | Epic 1 | Empty state with affordance |
| FR9 | Epic 2 | Inline edit by clicking text |
| FR10 | Epic 2 | Save edit on enter/blur |
| FR11 | Epic 2 | Cancel edit without saving |
| FR12 | Epic 2 | Toggle completion |
| FR13 | Epic 2 | Completed tasks muted inline |
| FR14 | Epic 2 | Un-complete toggle |
| FR15 | Epic 2 | Delete individual task |
| FR16 | Epic 2 | Deleted tasks removed immediately |
| FR17 | Epic 1 | Server-side persistence |
| FR18 | Epic 1 | Persist across restarts |
| FR19 | Epic 1 | Indefinite storage |
| FR20 | Epic 1 | RESTful CRUD API |
| FR21 | Epic 3 | Error feedback on failure |
| FR22 | Epic 3 | Distinguish empty vs error |
| FR23 | Epic 3 | Loading state |
| FR24 | Epic 3 | Never silently lose data |
| FR25 | Epic 4 | All actions on desktop + mobile |
| FR26 | Epic 4 | Responsive layout |
| FR27 | Epic 4 | Touch-appropriate targets |
| FR28 | Epic 4 | Keyboard-only operation |
| FR29 | Epic 4 | Logical tab order + focus |
| FR30 | Epic 4 | Screen reader support |
| FR31 | Epic 4 | WCAG 2.1 AA contrast |

## Epic List

### Epic 1: Project Foundation & First Task Journey
After this epic, a user can open the app and create and view tasks — the complete "first visit" experience.
**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR8, FR17, FR18, FR19, FR20
**UX-DRs covered:** UX-DR1, UX-DR2, UX-DR3, UX-DR4, UX-DR5, UX-DR6
**NFRs addressed:** NFR10-14, NFR18-20

### Epic 2: Complete Task Lifecycle
After this epic, a user can fully manage tasks — complete, edit, delete with undo recovery.
**FRs covered:** FR7, FR9, FR10, FR11, FR12, FR13, FR14, FR15, FR16
**UX-DRs covered:** UX-DR7, UX-DR8, UX-DR9, UX-DR10, UX-DR11

### Epic 3: Resilient Experience
After this epic, the app handles all failure scenarios gracefully — the user always knows what happened and can recover.
**FRs covered:** FR21, FR22, FR23, FR24
**UX-DRs covered:** UX-DR14, UX-DR15

### Epic 4: Accessibility, Responsive & Production Readiness
After this epic, anyone can use the app on any device, and it's deployed as a polished, tested product.
**FRs covered:** FR25, FR26, FR27, FR28, FR29, FR30, FR31
**UX-DRs covered:** UX-DR12, UX-DR13, UX-DR16, UX-DR17
**NFRs addressed:** NFR1-5, NFR15-17

## Epic 1: Project Foundation & First Task Journey

After this epic, a user can open the app, see a clean empty state, create tasks, and view them in a list — the complete Journey 1 ("That's it?") experience, running in Docker.

### Story 1.1: Project Scaffolding & Database Setup

As a **developer**,
I want a working monorepo with Docker, PostgreSQL, and basic Express + React apps,
So that I have a foundation to build features on.

**Acceptance Criteria:**

**Given** a fresh clone of the repository
**When** I run `npm install` at the root
**Then** all workspace dependencies are installed for frontend/, backend/, and shared/

**Given** the monorepo is set up
**When** I run `docker compose up`
**Then** PostgreSQL starts and is accessible, Express server starts and responds to health check, Vite dev server starts and serves the React app

**Given** Docker is running
**When** I run `npx prisma migrate dev` in the backend directory
**Then** the Todo table is created with columns: id (uuid), text (string), completed (boolean, default false), createdAt (datetime), updatedAt (datetime), deletedAt (datetime, nullable)

**Given** the development environment is ready
**When** I run `npm run dev` at the root
**Then** frontend (Vite HMR) and backend (tsx watch) start concurrently, and the frontend proxies /api requests to the backend

### Story 1.2: Task API & Validation

As a **developer**,
I want working API endpoints to create and list todos with input validation,
So that the frontend has a reliable backend to communicate with.

**Acceptance Criteria:**

**Given** the backend is running with a connected database
**When** I send `POST /api/todos` with `{ "text": "Buy groceries" }`
**Then** a new todo is created and returned as `{ data: { id, text, completed: false, createdAt, ... } }` with status 201

**Given** todos exist in the database
**When** I send `GET /api/todos`
**Then** all non-deleted todos are returned as `{ data: [...] }` ordered by createdAt descending, with status 200

**Given** a soft-deleted todo exists (deletedAt is set)
**When** I send `GET /api/todos`
**Then** the soft-deleted todo is NOT included in the response

**Given** the backend is running
**When** I send `POST /api/todos` with `{ "text": "" }` (empty text)
**Then** the request is rejected with `{ error: "..." }` and status 400 (Zod validation)

**Given** the backend is running
**When** I send a request to a non-existent endpoint
**Then** the response is `{ error: "..." }` with status 404, no stack traces

**And** Zod schemas are defined in @todo/shared and used by the backend validation middleware
**And** helmet middleware is active with security headers
**And** CORS is configured for the frontend origin
**And** API integration tests exist for all endpoints (Vitest)

### Story 1.3: Frontend Foundation & Design Tokens

As a **developer**,
I want the React app configured with Tailwind design tokens, TanStack Query, and an API client,
So that I can build UI components with the correct visual foundation.

**Acceptance Criteria:**

**Given** the frontend app is running
**When** I inspect the Tailwind configuration
**Then** the warm neutral color system is defined (background #FAFAF8, surface #F5F5F0, text primary #2C2C2A, text secondary #8A8A85, placeholder #B5B5B0, accent #4A90A4, error #C5543A)

**And** the Inter typeface is loaded and set as the default font family
**And** the 8px spacing grid is configured (xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, 2xl: 48px)
**And** TanStack Query provider wraps the app with default configuration
**And** API client functions exist (getTodos, createTodo) with typed responses using @todo/shared types
**And** Vite proxy is configured to forward /api requests to the backend in development
**And** the page background is warm white (#FAFAF8) with Inter font rendering

### Story 1.4: Task Creation & List Display

As a **user**,
I want to open the app, see an inviting empty state, create tasks, and see them in a list,
So that I can start tracking my tasks immediately without any setup.

**Acceptance Criteria:**

**Given** the app loads with no existing todos
**When** the page finishes loading
**Then** the user sees the hero centered empty state: "Todo" title and input field vertically centered in the viewport, with placeholder "What needs to be done?"

**Given** the input field is visible
**When** the page loads
**Then** the input field has autofocus — the cursor is active without clicking

**Given** the user types "Buy groceries" in the input field
**When** they press Enter
**Then** the task appears instantly at the top of the task list, the input field clears, and the layout transitions from hero centered to top-anchored active state

**Given** the user has created 3 tasks in order: "Task A", "Task B", "Task C"
**When** they view the task list
**Then** tasks are displayed newest first: "Task C", "Task B", "Task A"

**Given** the user types in the input field
**When** they press Enter with empty text
**Then** nothing happens — no task is created, no error is shown

**Given** the user has created tasks and closes the browser tab
**When** they reopen the app later
**Then** all tasks are present exactly as they were (server-side persistence confirmed)

**And** the max content width is 640px, centered on desktop
**And** task rows use the 8px spacing grid with 24px gap between items
**And** the layout transition from empty state to active state is smooth (CSS transition)

## Epic 2: Complete Task Lifecycle

After this epic, a user can fully manage their tasks — mark them done, fix typos, and delete with a safety net.

### Story 2.1: Task Completion Toggle

As a **user**,
I want to mark tasks as complete and see them visually distinguished from active tasks,
So that I can track my progress at a glance.

**Acceptance Criteria:**

**Given** an active task exists in the list
**When** I click/tap the checkbox
**Then** the task toggles to completed: checkbox fills, text and row visually mute (reduced opacity ~50-60%), task stays inline in the same position

**Given** a completed task exists in the list
**When** I click/tap the checkbox again
**Then** the task toggles back to active: full opacity restored, checkbox unchecked

**Given** I toggle a task's completion
**When** the API call completes
**Then** the UI updated optimistically before the server responded (TanStack Query optimistic mutation)

**Given** I toggle a task's completion
**When** the API call fails
**Then** the toggle reverts to its previous state automatically (TanStack Query rollback)

**And** the PATCH /api/todos/:id endpoint accepts `{ completed: boolean }` and returns the updated todo
**And** the completion transition uses a 150ms opacity/style transition
**And** the checkbox and task text are visually and spatially distinct click targets — clicking the checkbox toggles completion, clicking the text does NOT

### Story 2.2: Inline Task Editing

As a **user**,
I want to edit a task's text by clicking on it,
So that I can fix typos without deleting and recreating the task.

**Acceptance Criteria:**

**Given** a task is displayed in the list
**When** I click/tap on the task text (not the checkbox)
**Then** the text becomes an editable input field in place, a visual border/highlight appears signaling edit mode, and the cursor is positioned in the text

**Given** a task is in edit mode
**When** I modify the text and press Enter
**Then** the edit is saved, the task returns to display mode, and the updated text is shown

**Given** a task is in edit mode
**When** I modify the text and click/tap outside the field (blur)
**Then** the edit is saved, the task returns to display mode

**Given** a task is in edit mode
**When** I press Escape
**Then** the edit is cancelled, the original text is restored, and the task returns to display mode

**Given** a task is in edit mode
**When** I clear all text and press Enter (empty text)
**Then** the edit is rejected — original text is restored (cannot save empty task)

**Given** I save an edit
**When** the API call completes
**Then** the text updated optimistically before the server responded

**Given** I save an edit
**When** the API call fails
**Then** the text reverts to its pre-edit value automatically

**And** the PATCH /api/todos/:id endpoint accepts `{ text: string }` and validates via Zod (non-empty string)
**And** edit mode is visually distinct from display mode — clear enough that the user knows they're editing, not selecting
**And** entering edit mode on one task does not affect other tasks — other tasks remain interactive

### Story 2.3: Task Deletion with Undo

As a **user**,
I want to delete tasks I no longer need with a brief window to undo,
So that I can clean up my list without fear of accidental data loss.

**Acceptance Criteria:**

**Given** a task exists in the list on desktop
**When** I hover over the task row
**Then** a delete icon (✕) appears on the right side of the row with a subtle fade-in

**Given** a task exists in the list on desktop
**When** my mouse is not hovering over the task row
**Then** the delete icon is hidden

**Given** a task exists in the list on mobile (touch device)
**When** the task is displayed
**Then** the delete icon is always visible (no hover state on touch devices)

**Given** a task exists and the delete icon is visible
**When** I click/tap the delete icon
**Then** the task disappears from the list immediately and an undo toast slides up from the bottom: "Task deleted · Undo"

**Given** the undo toast is visible
**When** I click the "Undo" link within 5 seconds
**Then** the task is restored to its original position and state in the list, and the toast dismisses

**Given** the undo toast is visible
**When** 5 seconds pass without clicking Undo
**Then** the toast auto-dismisses with a fade-out, and the deletion is permanent

**Given** all tasks are deleted (list becomes empty)
**When** the last deletion's undo window expires
**Then** the layout transitions back to the hero centered empty state

**And** DELETE /api/todos/:id sets deletedAt timestamp (soft delete) and returns the deleted todo
**And** PATCH /api/todos/:id/restore clears deletedAt and returns the restored todo
**And** the delete and restore operations use optimistic mutations
**And** the undo toast uses accent color for the "Undo" link
**And** the delete icon is keyboard-accessible — visible on :focus-within of the task row
**And** hover-reveal vs always-visible is determined by pointer capability (media query or pointer detection)

## Epic 3: Resilient Experience

After this epic, the app handles all failure scenarios gracefully — the user always knows what happened and can recover.

### Story 3.1: Error States & Loading

As a **user**,
I want to see clear feedback when the app is loading or can't connect to the server,
So that I always know the current state of my data and never wonder "is it broken?"

**Acceptance Criteria:**

**Given** the app is opening and the API call to fetch todos takes longer than 200ms
**When** the loading threshold is exceeded
**Then** a loading indicator is displayed (spinner or skeleton)

**Given** the app is opening and the API responds within 200ms
**When** data loads quickly
**Then** no loading indicator is ever shown — tasks appear directly

**Given** the API is unreachable on page load
**When** the fetch todos request fails
**Then** the ErrorState component is displayed: centered error message ("Unable to load tasks. Check your connection and try again.") with a retry button

**Given** the error state is displayed
**When** I click the retry button
**Then** the app attempts to fetch todos again

**Given** the error state is displayed
**When** I observe the screen
**Then** the error state is visually distinct from the empty state — no input field is shown, no hero centering that implies "no tasks exist"

**And** the ErrorState component uses `role="alert"` and `aria-live="polite"` for screen reader announcement
**And** the retry button is styled with the accent color and is keyboard-accessible

### Story 3.2: Action Error Handling & Recovery

As a **user**,
I want failed actions to revert cleanly with visible feedback,
So that I never silently lose data or end up in a confusing state.

**Acceptance Criteria:**

**Given** I create a task and the API call fails
**When** the server returns an error
**Then** the optimistically-added task is removed from the list, and an inline error message appears near the input area

**Given** I toggle a task's completion and the API call fails
**When** the server returns an error
**Then** the checkbox and visual state revert to their pre-toggle state, and an inline error message appears

**Given** I edit a task's text and the API call fails
**When** the server returns an error
**Then** the task text reverts to its pre-edit value, and an inline error message appears

**Given** I delete a task and the API call fails
**When** the server returns an error
**Then** the task reappears in the list at its original position, and an inline error message appears

**Given** an inline error message is displayed
**When** I observe the message
**Then** it is displayed in the error color (#C5543A), is non-modal, and clearly describes what failed

**Given** an action fails and the UI has reverted
**When** I perform the same action again
**Then** the action retries normally — there is no "stuck" state requiring a page refresh

**And** error responses from the server never contain stack traces or internal details (NFR12)
**And** the application recovers from network interruptions without requiring manual page refresh (NFR9)
**And** no action ever results in silent data loss — all failures are surfaced visibly (FR24)

## Epic 4: Accessibility, Responsive & Production Readiness

After this epic, anyone can use the app on any device, and it ships as a polished, tested, production-deployed product.

### Story 4.1: Keyboard Navigation & Focus Management

As a **user who navigates with a keyboard**,
I want to perform all task operations without a mouse,
So that I can use the app regardless of my input method.

**Acceptance Criteria:**

**Given** the app is loaded
**When** I press Tab repeatedly
**Then** focus moves through interactive elements in visual order: input field → first task's checkbox → first task's text → first task's delete button → second task's checkbox → etc.

**Given** focus is on a task's checkbox
**When** I press Space
**Then** the task's completion state toggles

**Given** focus is on a task's delete button
**When** I press Space or Enter
**Then** the task is deleted and undo toast appears

**Given** the undo toast is visible
**When** I Tab to the Undo link and press Space or Enter
**Then** the task is restored

**Given** any interactive element has focus
**When** I observe the screen
**Then** a visible focus ring (accent color) clearly indicates which element is focused

**Given** a task enters edit mode
**When** editing completes (Enter, Escape, or blur)
**Then** focus returns to a logical position (the task row or the next interactive element)

**And** focus is never trapped — the user can always Tab away from any element
**And** the delete button becomes visible when its parent task row receives :focus-within

### Story 4.2: Screen Reader & WCAG Compliance

As a **screen reader user**,
I want to understand the state and content of all tasks and controls,
So that I can use the app with the same confidence as a sighted user.

**Acceptance Criteria:**

**Given** the app is loaded with tasks
**When** a screen reader reads the page
**Then** the page structure is announced: heading ("Todo"), input field ("Add a new task"), task list with item count

**Given** a task exists in the list
**When** a screen reader reads the task
**Then** the task text, completion state (checked/unchecked), and available actions are announced

**Given** I complete a task
**When** the completion state changes
**Then** the screen reader announces the state change via aria attributes

**Given** an error occurs
**When** the ErrorState or inline error appears
**Then** the screen reader announces the error via `role="alert"` and `aria-live="polite"`

**Given** I delete a task
**When** the undo toast appears
**Then** the screen reader announces "Task deleted" via `role="status"` and `aria-live="polite"`

**And** the page uses semantic HTML: `<main>`, `<h1>` for title, `<ul>`/`<li>` for task list, native `<input>` and `<button>` elements
**And** all interactive elements have descriptive `aria-label` attributes where visual labels are absent
**And** all text/background color combinations meet WCAG 2.1 AA contrast ratios (4.5:1 for normal text, 3:1 for large text)
**And** completed task muting maintains minimum 3:1 contrast ratio

### Story 4.3: Responsive Design & Touch Optimization

As a **mobile user**,
I want the app to work perfectly on my phone,
So that I can manage tasks on any device.

**Acceptance Criteria:**

**Given** I open the app on a mobile device (viewport < 768px)
**When** the page loads
**Then** the layout uses full width minus 16px padding, no horizontal scrolling at any viewport width

**Given** I open the app on a desktop (viewport >= 768px)
**When** the page loads
**Then** the content is constrained to 640px max-width, centered, with desktop padding

**Given** I'm using a touch device
**When** I interact with task rows
**Then** all touch targets are at minimum 48px height for comfortable thumb interaction

**Given** I'm using a touch device
**When** I view task rows
**Then** the delete icon is always visible (not hover-dependent)

**Given** the user has enabled "reduce motion" in their OS settings
**When** transitions occur (completion toggle, toast entrance/exit, layout transition)
**Then** all transitions are suppressed or made instant — no animation plays

**And** the app uses mobile-first CSS with Tailwind's `md:` breakpoint for desktop adjustments
**And** the empty state hero centering works at all viewport sizes

### Story 4.4: E2E Tests & Production Deployment

As a **developer**,
I want automated E2E tests and production-ready Docker builds,
So that the app is verifiably correct and deployable.

**Acceptance Criteria:**

**Given** the full application is running
**When** I run Playwright E2E tests
**Then** the following flows pass:
- Create a task, verify it appears in the list
- Complete a task, verify visual muting
- Edit a task, verify text updates
- Delete a task, verify removal and undo toast
- Undo a deletion, verify task restoration
- Verify empty state displays when no tasks exist
- Verify error state displays when API is unreachable

**Given** I run `docker compose -f docker-compose.prod.yml up`
**When** the production build completes
**Then** the frontend is served via nginx (static Vite build), the backend runs compiled JavaScript on Node.js 22 LTS, PostgreSQL is running, and the app is fully functional

**Given** a new developer clones the repository
**When** they follow the README instructions
**Then** they can have the development environment running within 15 minutes (NFR17)

**And** .env.example is present with all required environment variables documented
**And** README includes: project overview, prerequisites, setup instructions, development workflow, testing instructions, production deployment, API documentation
**And** the production Docker build uses multi-stage builds (minimal final images)
