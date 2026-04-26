# Story 1.3: Frontend Foundation & Design Tokens

Status: done

## Story

As a **developer**,
I want the React app configured with Tailwind design tokens, TanStack Query, and an API client,
so that I can build UI components with the correct visual foundation.

## Acceptance Criteria

1. **Given** the frontend app is running, **When** I inspect the Tailwind configuration, **Then** the warm neutral color system is defined (background #FAFAF8, surface #F5F5F0, text primary #2C2C2A, text secondary #8A8A85, placeholder #B5B5B0, accent #4A90A4, error #C5543A).

2. **And** the Inter typeface is loaded and set as the default font family.

3. **And** the 8px spacing grid is configured (xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, 2xl: 48px).

4. **And** TanStack Query provider wraps the app with default configuration.

5. **And** API client functions exist (getTodos, createTodo) with typed responses using @todo/shared types.

6. **And** Vite proxy is configured to forward /api requests to the backend in development.

7. **And** the page background is warm white (#FAFAF8) with Inter font rendering.

## Tasks / Subtasks

- [x] Task 1: Install dependencies (AC: #2, #4)
  - [x] Install `@tanstack/react-query` in frontend workspace
  - [x] Verify React 19 compatibility
- [x] Task 2: Configure Tailwind design tokens (AC: #1, #3)
  - [x] In `frontend/src/index.css`, add `@theme` block with custom colors: background, surface, text-primary, text-secondary, placeholder, accent, error
  - [x] Add spacing scale tokens: xs(4px), sm(8px), md(16px), lg(24px), xl(32px), 2xl(48px)
- [x] Task 3: Load Inter typeface and set as default (AC: #2, #7)
  - [x] Add Inter font import via `@import url(...)` in `frontend/src/index.css`
  - [x] Set Inter as default font family in Tailwind theme
  - [x] Set page background to #FAFAF8 and default text color to #2C2C2A via base styles
- [x] Task 4: Set up TanStack Query provider (AC: #4)
  - [x] Create QueryClient instance in `frontend/src/App.tsx`
  - [x] Wrap app content with `QueryClientProvider`
  - [x] Configure sensible defaults (staleTime, retry)
- [x] Task 5: Create typed API client (AC: #5)
  - [x] Create `frontend/src/api/todos.ts` with `getTodos()` and `createTodo(text)` functions
  - [x] Use `fetch` with typed responses: `ApiResponse<Todo[]>` and `ApiResponse<Todo>`
  - [x] Import types from `@todo/shared`
- [x] Task 6: Verify Vite proxy (AC: #6)
  - [x] Confirm `/api` proxy to `http://localhost:3001` is already configured in `frontend/vite.config.ts`
  - [x] No changes needed if already correct (it is)
- [x] Task 7: Verify end-to-end
  - [x] Run `npm run dev -w frontend`, verify page loads with warm white background and Inter font
  - [x] Verify Tailwind design tokens compile correctly
  - [x] Verify TanStack Query provider initializes without errors

### Review Findings

- [x] [Review][Defer] fetch network failure vs HTTP error not distinguished in API client — deferred, address in Epic 3 error handling
- [x] [Review][Defer] res.json() can throw on non-JSON response body — deferred, address in Epic 3 error handling
- [x] [Review][Defer] Error messages discard server detail (status code, body) — deferred, improve when error UX is built
- [x] [Review][Defer] No CSS variable fallback values — low risk, modern browsers only target
- [x] [Review][Defer] No client-side input validation on createTodo — server validates, client guard deferred

## Dev Notes

### Architecture Compliance

**Frontend file structure** (from architecture.md):
```
frontend/src/
├── api/
│   └── todos.ts            # API client functions (NEW)
├── components/              # NOT in this story — Story 1.4
├── hooks/                   # NOT in this story — Story 1.4
├── App.tsx                  # UPDATE: add QueryClientProvider
├── main.tsx                 # EXISTS, DO NOT MODIFY
└── index.css                # UPDATE: design tokens + Inter font
```

### Existing Files to Modify

**`frontend/src/index.css`** (current state):
```css
@import "tailwindcss";
```
Changes needed: Add Inter font import, `@theme` block with colors and spacing, base styles for background and font.

**`frontend/src/App.tsx`** (current state):
```typescript
function App() {
  return (
    <div>
      <h1>Todo</h1>
      <p>App is running.</p>
    </div>
  )
}

export default App
```
Changes needed: Import and configure QueryClientProvider, wrap content, apply background styling.

**`frontend/vite.config.ts`** (current state — DO NOT MODIFY):
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
```
Vite proxy already configured correctly. No changes needed.

**`frontend/main.tsx`** — DO NOT MODIFY.

### Tailwind CSS 4 Configuration Pattern

Tailwind CSS 4 uses CSS-first configuration via `@theme` directives in CSS, NOT a `tailwind.config.js` file. All customization happens in `index.css`:

```css
@import "tailwindcss";

@theme {
  --color-background: #FAFAF8;
  --color-surface: #F5F5F0;
  /* etc. */
  --spacing-xs: 4px;
  /* etc. */
}
```

This generates utility classes like `bg-background`, `text-text-primary`, `p-xs`, etc.

**CRITICAL: Do NOT create a tailwind.config.js or tailwind.config.ts file. Tailwind 4 does not use them.**

### Color System (exact values)

| Token Name | Hex | CSS Variable | Utility Class |
|-----------|-----|-------------|---------------|
| background | #FAFAF8 | `--color-background` | `bg-background` |
| surface | #F5F5F0 | `--color-surface` | `bg-surface` |
| text-primary | #2C2C2A | `--color-text-primary` | `text-text-primary` |
| text-secondary | #8A8A85 | `--color-text-secondary` | `text-text-secondary` |
| placeholder | #B5B5B0 | `--color-placeholder` | `text-placeholder` |
| accent | #4A90A4 | `--color-accent` | `bg-accent`, `text-accent` |
| error | #C5543A | `--color-error` | `bg-error`, `text-error` |

### Spacing Grid (exact values)

| Token | Value | CSS Variable | Utility Class |
|-------|-------|-------------|---------------|
| xs | 4px | `--spacing-xs` | `p-xs`, `m-xs`, `gap-xs` |
| sm | 8px | `--spacing-sm` | `p-sm`, `m-sm`, `gap-sm` |
| md | 16px | `--spacing-md` | `p-md`, `m-md`, `gap-md` |
| lg | 24px | `--spacing-lg` | `p-lg`, `m-lg`, `gap-lg` |
| xl | 32px | `--spacing-xl` | `p-xl`, `m-xl`, `gap-xl` |
| 2xl | 48px | `--spacing-2xl` | `p-2xl`, `m-2xl`, `gap-2xl` |

### Typography

**Font:** Inter — load via Google Fonts CDN `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap')`

Set as default font family:
```css
@theme {
  --font-sans: 'Inter', sans-serif;
}
```

### API Client Pattern

```typescript
// frontend/src/api/todos.ts
import type { Todo, ApiResponse } from '@todo/shared'

const API_BASE = '/api/todos'

export async function getTodos(): Promise<ApiResponse<Todo[]>> {
  const res = await fetch(API_BASE)
  if (!res.ok) throw new Error('Failed to fetch todos')
  return res.json()
}

export async function createTodo(text: string): Promise<ApiResponse<Todo>> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })
  if (!res.ok) throw new Error('Failed to create todo')
  return res.json()
}
```

Note: Only `getTodos` and `createTodo` are needed for this story. Additional functions (updateTodo, deleteTodo, restoreTodo) will be added in Epic 2 stories.

### TanStack Query Setup

```typescript
// In App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      retry: 1,
    },
  },
})
```

### Shared Package Types (already exists)

```typescript
// @todo/shared exports:
export interface Todo {
  id: string; text: string; completed: boolean;
  createdAt: string; updatedAt: string; deletedAt: string | null;
}
export interface ApiResponse<T> { data: T }
export interface ApiError { error: string }
```

### Critical Warnings

- Do NOT create a `tailwind.config.js` or `tailwind.config.ts` — Tailwind 4 uses `@theme` in CSS
- Do NOT create UI components (TaskInput, TaskList, etc.) — those are Story 1.4
- Do NOT create TanStack Query hooks (useTodos, etc.) — those are Story 1.4
- Do NOT modify `frontend/vite.config.ts` — proxy is already configured
- Do NOT modify `frontend/src/main.tsx` — entry point stays as-is
- Do NOT install Playwright — E2E tests are Story 4.4
- The Inter font MUST be loaded before first paint — use `display=swap` in Google Fonts URL
- API client functions must return the full `ApiResponse<T>` wrapper (not unwrap `.data`)

### Technology Versions

| Technology | Version | Notes |
|-----------|---------|-------|
| React | 19.2.5 | Already installed |
| Tailwind CSS | 4.2.4 | Already installed, uses CSS-first config |
| @tailwindcss/vite | 4.2.4 | Already installed |
| Vite | 8.0.10 | Already installed |
| TypeScript | 6.0.2 | Already installed |
| @tanstack/react-query | latest | INSTALL — verify React 19 compatibility |

### Previous Story Intelligence

From story 1.1:
- Tailwind CSS 4.2 already set up with `@tailwindcss/vite` plugin
- `index.css` has `@import "tailwindcss"` as the base
- Vite proxy already configured for `/api` → `http://localhost:3001`
- `@todo/shared` workspace dependency already in frontend/package.json

From story 1.2:
- Backend API verified: GET /api/todos returns `{ data: Todo[] }`, POST returns `{ data: Todo }` with 201
- `@todo/shared` package has `"type": "module"` and `"exports"` field for ESM compatibility
- API error responses use `{ error: "message" }` format

### Naming Conventions

- API client file: `todos.ts` (camelCase)
- API functions: camelCase (`getTodos`, `createTodo`)
- Components: PascalCase (`App.tsx`)
- CSS: Tailwind utility classes, `@theme` CSS variables use `--color-*` and `--spacing-*` prefix
- Import paths: NO `.js` extension needed in frontend (Vite handles resolution)

### Project Structure Notes

- All new files in `frontend/src/` as specified
- `frontend/src/api/` directory is new — create it
- No test files in this story (foundation only, tested by build verification)

### References

- [Source: architecture.md#Frontend Architecture] — TanStack Query, API client, component architecture
- [Source: architecture.md#Implementation Patterns] — Naming conventions, import order
- [Source: architecture.md#Project Structure & Boundaries] — Frontend directory layout
- [Source: epics.md#Story 1.3] — Acceptance criteria
- [Source: UX Design] — Color system, typography, spacing grid
- [Source: 1-1-project-scaffolding-and-database-setup.md] — Tailwind/Vite setup from story 1.1
- [Source: 1-2-task-api-and-validation.md] — API contract, shared package ESM config

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- Tailwind 4 tree-shakes unused CSS variables from build output — only tokens referenced by utility classes appear in dist. All 7 colors and 6 spacing tokens are correctly defined in the @theme block and available for use.

### Completion Notes List

- All 7 tasks and all subtasks completed successfully
- @tanstack/react-query 5.100.5 installed, compatible with React 19
- Tailwind CSS 4 @theme block with all 7 color tokens and 6 spacing tokens
- Inter font loaded via Google Fonts with weights 400, 500, 600 and display=swap
- Body base styles: background #FAFAF8, text #2C2C2A, font-family Inter
- QueryClientProvider wraps app with staleTime: 0, retry: 1
- API client with getTodos() and createTodo(text) functions, typed with @todo/shared types
- Vite proxy confirmed already configured from story 1.1
- TypeScript compiles cleanly, Vite production build succeeds
- Backend regression tests: 9/9 pass

### Change Log

- 2026-04-28: Story 1.3 implemented — design tokens, Inter font, TanStack Query, API client

### File List

- frontend/src/index.css (MODIFIED) — Inter font import, @theme block with colors/spacing, base body styles
- frontend/src/App.tsx (MODIFIED) — QueryClientProvider wrapping app with configured QueryClient
- frontend/src/api/todos.ts (NEW) — Typed API client with getTodos() and createTodo()
- frontend/package.json (MODIFIED) — Added @tanstack/react-query dependency
