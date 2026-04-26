---
stepsCompleted:
  - 1
  - 2
  - 3
  - 4
  - 5
  - 6
  - 7
  - 8
lastStep: 8
status: 'complete'
completedAt: '2026-04-26'
inputDocuments:
  - prd.md
  - ux-design-specification.md
  - product-brief-todo.md
  - product-brief-todo-distillate.md
workflowType: 'architecture'
project_name: 'Todo'
user_name: 'kris'
date: '2026-04-26'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
31 FRs across 8 capability areas. Architecturally, these map to a single CRUD resource (Task) with five client-side interactions (create, view, edit, complete, delete). No complex workflows, no multi-step processes, no inter-entity relationships. The undo-delete pattern is the only interaction requiring non-trivial state coordination between client and server.

**Non-Functional Requirements:**
20 NFRs across 5 categories. Architecture-driving NFRs:
- **Performance:** <1s page load, <100ms API response, minimal JS bundle (NFR1-5)
- **Reliability:** Zero data loss, atomic operations, graceful error recovery (NFR6-9)
- **Security:** HTTPS, input sanitization, no leaked internals (NFR10-12)
- **Maintainability:** Clean separation, documented API, 15-min developer setup (NFR13-17)
- **Deployment:** Docker single-command startup, reproducible, env vars externalized (NFR18-20)

**UX Architectural Implications:**
- 6 components total — lightweight frontend framework sufficient
- Optimistic UI with revert on failure — client needs local state management
- Two layout states (empty hero / active top-anchored) — conditional rendering, no routing
- Hover-reveal delete (desktop) / always-visible (mobile) — pointer capability detection
- Undo toast with 5s client-side window — client timer + soft-delete API

**Scale & Complexity:**
- Primary domain: Full-stack web (SPA + REST API + relational database)
- Complexity level: Low — single entity, single user, single screen
- Estimated architectural components: 3 (frontend SPA, backend API, database)

### Technical Constraints & Dependencies

- **No authentication** — API is open. Single-user model with direct database access.
- **Single database, single table** — Task entity with: id, text, completed (boolean), createdAt (timestamp), deletedAt (nullable timestamp for soft delete).
- **Soft delete pattern** — Server sets `deletedAt` timestamp on delete, clears it on restore. API queries filter out soft-deleted tasks by default. No cleanup job in V1.
- **No client-side routing** — single screen, no URL state management needed.
- **Docker required** — frontend, backend, and database must run as containers via `docker compose up`.
- **Modern browsers only** — no polyfills, no legacy compatibility layer.

### Cross-Cutting Concerns Identified

- **Error handling** — Spans both client (optimistic revert, inline error messages, error state) and server (input validation, database error handling, safe error responses). Must be consistent across all 5 task operations.
- **Accessibility** — WCAG 2.1 AA affects frontend component design, semantic HTML structure, ARIA attributes, keyboard interaction model, and color contrast. Cross-cuts every component.
- **Data integrity** — Atomic database operations for all task mutations. No partial writes. Server is the source of truth; client state is speculative.
- **Performance** — Affects frontend (bundle size, render speed), backend (API response time), and database (query efficiency). The <100ms API target is the binding constraint.

## Starter Template Evaluation

### Primary Technology Domain

Full-stack web application: React SPA (Vite) + Express API + PostgreSQL, all TypeScript, Docker deployed.

### Technology Versions (Verified April 2026)

| Technology | Version | Notes |
|-----------|---------|-------|
| Vite | 8.0.8 | Rolldown bundler (Rust-based, 10-30x faster builds) |
| React | 19.x | Via Vite react-ts template |
| TypeScript | 6.0.3 | Final JS-based compiler release |
| Express | 5.2.1 | Requires Node.js >= 18, native promise support |
| Prisma | 7.7.0 | New `prisma.config.ts`, type-safe queries |
| PostgreSQL | 18.3 | Docker image `postgres:18` |
| Tailwind CSS | 4.2.4 | V4 rewrite — no PostCSS config needed, `@tailwindcss/vite` plugin |
| Vitest | 4.1.5 | Native Vite 8 support |
| Playwright | 1.59.1 | E2E testing |

### Selected Approach: Composable Scaffold

**Rationale:** No single starter matches this stack without bloat. The project has 6 UI components and 5 API endpoints — scaffolding each layer independently is faster and cleaner than stripping unwanted code from a full-stack template.

**Monorepo:** npm workspaces with root `package.json`. Single `npm install`, shared scripts (`npm run dev` starts both frontend and backend), simplified Docker builds.

**Project Structure:**

```
todo/
├── frontend/               # Vite + React + TypeScript frontend
│   ├── src/
│   │   ├── components/     # 6 UI components
│   │   ├── api/            # API client functions
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
├── backend/                # Express + Prisma backend
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── middleware/     # Error handling, validation
│   │   └── index.ts        # Express app entry
│   ├── prisma/
│   │   └── schema.prisma   # Task model
│   ├── tsconfig.json
│   └── package.json
├── e2e/                    # Playwright E2E tests
│   └── tests/
├── docker-compose.yml      # Frontend + backend + PostgreSQL
├── Dockerfile.frontend
├── Dockerfile.backend
└── package.json            # Root workspace config

```

**Initialization Commands:**

```bash
# Frontend scaffold
npm create vite@latest frontend -- --template react-ts

# Backend setup
mkdir -p backend/src && cd backend && npm init -y
npm install express
npm install -D typescript @types/express @types/node tsx

# Prisma (in backend/)
cd backend && npx prisma init --datasource-provider postgresql

# Tailwind CSS (in frontend/)
cd frontend && npm install tailwindcss @tailwindcss/vite

# Testing
cd frontend && npm install -D vitest
npm init playwright@latest -- --lang=ts
```

**Architectural Decisions Provided by This Approach:**

- **Language & Runtime:** TypeScript 6.0 on both frontend and backend. Shared type definitions possible across the monorepo.
- **Styling:** Tailwind CSS 4.2 with `@tailwindcss/vite` plugin. No PostCSS config. Design tokens in Tailwind config.
- **Build Tooling:** Vite 8 with Rolldown for frontend. `tsx` for backend development (fast TypeScript execution without compile step).
- **Testing:** Vitest for unit/integration (both frontend and backend), Playwright for E2E.
- **Code Organization:** `frontend/` and `backend/` separation enforces the API contract boundary (NFR14). Shared types can live in a root `shared/` directory if needed.
- **Development Experience:** Vite dev server with HMR for frontend, `tsx watch` for backend auto-reload. Root `npm run dev` starts both concurrently.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (All Resolved):**
All blocking architectural decisions have been made. No outstanding decisions prevent implementation.

**Deferred Decisions (Post-MVP):**
- Authentication strategy (when/if user accounts are added)
- External logging service (if deployed beyond Docker)
- CI/CD pipeline specifics (can be added when deployment target is chosen)

### Data Architecture

**Database:** PostgreSQL 18.3 in Docker container.

**ORM:** Prisma 7.7 with `prisma.config.ts` configuration.

**Data Model:**

```prisma
model Todo {
  id          String    @id @default(uuid())
  text        String
  completed   Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  deletedAt   DateTime?
}
```

**Key model decisions:**
- `uuid()` for IDs — no sequential integers exposed in API (security hygiene, future-proof for multi-user)
- `updatedAt` auto-managed by Prisma — tracks last modification for debugging
- `deletedAt` nullable — null means active, timestamp means soft-deleted
- No `userId` column in V1 — added later via migration if auth is introduced

**Validation:** Zod schemas defined in a shared location, used for:
- Backend: API request validation in Express middleware (before hitting Prisma)
- Frontend: Form/input validation (before API call)
- Single source of truth for the Todo shape across the monorepo

**Migrations:** Prisma Migrate. Schema changes produce versioned SQL migration files tracked in git.

### Authentication & Security

**No authentication in V1.** API is open. Security measures limited to:
- **Input sanitization:** Zod validation on all API inputs. Reject malformed requests at the middleware layer.
- **CORS:** Configured to allow only the frontend origin in production.
- **Security headers:** `helmet` middleware for Express — sets standard security headers (X-Content-Type-Options, X-Frame-Options, etc.) with zero configuration.
- **No stack traces in production:** Error middleware returns generic messages. Internal details logged server-side only (NFR12).

### API & Communication Patterns

**REST API with consistent JSON contract.**

**Endpoints:**

| Method | Path | Request Body | Response | Status |
|--------|------|-------------|----------|--------|
| GET | /api/todos | — | `{ data: Todo[] }` | 200 |
| POST | /api/todos | `{ text: string }` | `{ data: Todo }` | 201 |
| PATCH | /api/todos/:id | `{ text?: string, completed?: boolean }` | `{ data: Todo }` | 200 |
| DELETE | /api/todos/:id | — | `{ data: Todo }` | 200 |
| PATCH | /api/todos/:id/restore | — | `{ data: Todo }` | 200 |

**Response format:**
- Success: `{ data: <payload> }` with appropriate HTTP status
- Error: `{ error: "<message>" }` with appropriate HTTP status (400, 404, 500)
- No envelope nesting beyond one level

**Error handling:** Centralized Express error middleware. Route handlers throw typed errors (NotFoundError, ValidationError). Middleware catches all, formats consistent JSON, logs internally, returns safe response.

**Query behavior:**
- GET /api/todos returns only non-deleted todos (`WHERE deletedAt IS NULL`), ordered by `createdAt DESC`
- DELETE sets `deletedAt = now()`, does not remove the row
- Restore clears `deletedAt` back to null

### Frontend Architecture

**State Management:** TanStack Query (React Query) for all server state.

**Why TanStack Query:**
- Built-in optimistic mutation with automatic rollback on failure — directly supports our error-revert UX pattern
- Cache management — todo list is fetched once and updated optimistically, no redundant API calls
- Loading/error states provided as hook return values — maps directly to our three UI states (loading, active, error)
- Stale-while-revalidate pattern means the UI always shows data immediately on return visits

**Optimistic update pattern:**
1. User performs action (create, edit, complete, delete)
2. TanStack Query updates the local cache immediately (optimistic)
3. API call fires in the background
4. On success: cache is already correct, no action needed
5. On failure: TanStack Query reverts to previous cache state, error surfaces in UI

**Undo-delete flow:**
1. User clicks delete → optimistic removal from cache + API soft-delete call
2. Undo toast appears (5s client timer)
3. If undo clicked: API restore call + optimistic cache restoration
4. If timeout: toast dismisses, deletion is final (already soft-deleted on server)

**Component architecture:** 6 components as defined in UX spec. Functional React components with hooks. No class components. No global state store — TanStack Query is the only state layer.

**API client:** Thin `fetch` wrapper in `frontend/src/api/` — typed functions per endpoint (`getTodos()`, `createTodo(text)`, `updateTodo(id, data)`, `deleteTodo(id)`, `restoreTodo(id)`). TanStack Query wraps these functions.

### Infrastructure & Deployment

**Docker Compose** orchestrates three services:

```yaml
services:
  frontend:    # Vite build served by nginx (production) or Vite dev server (development)
  backend:     # Express app via Node.js
  db:          # PostgreSQL 18
```

**Multi-stage Docker builds:**
- Frontend: Stage 1 builds Vite output, Stage 2 copies to nginx for static serving
- Backend: Stage 1 compiles TypeScript, Stage 2 runs compiled JS with production Node.js

**Environment configuration:**
- `.env` file at root (gitignored) with `DATABASE_URL`, `PORT`, `NODE_ENV`, `CORS_ORIGIN`
- Docker Compose reads `.env` and passes to containers
- `.env.example` tracked in git with placeholder values (NFR20)

**Development workflow:**
- `npm run dev` at root starts frontend (Vite HMR) + backend (`tsx watch`) concurrently
- PostgreSQL runs in Docker even during development (consistent with production)
- Prisma Studio available for database inspection during development

**Logging:** Structured `console.log` with timestamp, level, and message. No external service for V1. Sufficient for single-user Docker deployment.

### Decision Impact Analysis

**Implementation Sequence:**
1. Project scaffolding (monorepo, npm workspaces, Docker Compose)
2. Database setup (Prisma schema, migration, PostgreSQL container)
3. Backend API (Express routes, Zod validation, error middleware)
4. Frontend foundation (React + TanStack Query + Tailwind)
5. UI components (6 components per UX spec)
6. Integration (frontend ↔ backend wiring)
7. E2E tests (Playwright)

**Cross-Component Dependencies:**
- Zod schemas shared between frontend and backend → define in shared workspace package or duplicate (shared package is cleaner)
- TanStack Query depends on API client functions → API client must match backend contract exactly
- Docker Compose networking → frontend dev server proxies API calls to backend container

## Implementation Patterns & Consistency Rules

### Naming Patterns

**Database (Prisma):**
- Model names: PascalCase singular (`Todo`, not `Todos` or `todo`)
- Column names: camelCase (`createdAt`, `deletedAt`) — Prisma default
- Table names: auto-generated by Prisma from model name (lowercase `todo`)

**API:**
- Endpoints: lowercase plural (`/api/todos`)
- URL parameters: camelCase (`:id`)
- JSON request/response fields: camelCase (`{ createdAt, deletedAt }`) — matches TypeScript and Prisma output directly, no transformation layer

**TypeScript:**
- Interfaces/Types: PascalCase (`Todo`, `CreateTodoRequest`)
- Functions: camelCase (`getTodos`, `createTodo`)
- Variables/constants: camelCase (`todoList`, `isCompleted`)
- Enum-like constants: UPPER_SNAKE_CASE (`API_BASE_URL`)
- Files: camelCase for utilities (`api.ts`, `validation.ts`), PascalCase for React components (`TaskItem.tsx`, `TaskInput.tsx`)

**React Components:**
- Component names: PascalCase matching file name (`TaskItem` in `TaskItem.tsx`)
- Props types: `ComponentNameProps` (`TaskItemProps`)
- Hooks: `use` prefix (`useTodos`, `useDeleteTodo`)

### Structure Patterns

**Test location:** Co-located with source files.
- `TaskItem.tsx` → `TaskItem.test.tsx` (same directory)
- `routes/todos.ts` → `routes/todos.test.ts` (same directory)
- E2E tests in `e2e/tests/` (separate, since they test the full stack)

**Component organization:** Flat, by component name.
```
frontend/src/components/
├── TaskInput.tsx
├── TaskInput.test.tsx
├── TaskItem.tsx
├── TaskItem.test.tsx
├── TaskList.tsx
├── EmptyState.tsx
├── ErrorState.tsx
└── UndoToast.tsx
```

**Backend organization:** By concern.
```
backend/src/
├── routes/
│   └── todos.ts
├── middleware/
│   ├── errorHandler.ts
│   └── validate.ts
├── errors/
│   └── index.ts
└── index.ts
```

**Shared types:** Root `shared/` directory as npm workspace package.
```
shared/
├── src/
│   ├── types.ts
│   └── validation.ts
└── package.json
```

### Format Patterns

**API responses:**

```typescript
// Success
{ data: Todo | Todo[] }

// Error
{ error: "Human-readable error message" }
```

- Dates serialized as ISO 8601 strings (`"2026-04-26T14:30:00.000Z"`)
- Null fields included in response (don't omit `deletedAt: null`)
- HTTP status codes: 200 (success), 201 (created), 400 (validation), 404 (not found), 500 (server error)

**TypeScript strictness:**
- `strict: true` in all tsconfig files
- No `any` types — use `unknown` with type narrowing
- Explicit return types on exported functions
- No non-null assertions (`!`)

### Process Patterns

**Error handling flow:**

```
Frontend action
  → API client function (fetch + typed response)
    → TanStack Query mutation (optimistic update)
      → Express route handler
        → Zod validation (throws ValidationError on failure)
          → Prisma query (throws on DB error)
        ← Error middleware catches, formats { error }, returns status
      ← TanStack Query auto-reverts on error response
    ← Component reads error from mutation state
  → UI shows inline error message
```

**Loading state pattern:**
- TanStack Query provides `isLoading`, `isError`, `data` from `useQuery`
- Initial load: show loading state only if >200ms
- Mutations: never show loading — optimistic updates make them instant

**Import order convention:**
1. React imports
2. Third-party library imports
3. Shared package imports (`@todo/shared`)
4. Local imports (components, utils)
5. Type-only imports
6. CSS/style imports

### Enforcement Guidelines

**All AI agents implementing this project MUST:**
- Follow naming conventions exactly — no variations
- Co-locate tests next to source files
- Use shared Zod schemas for validation — never define validation rules inline
- Return API responses in the exact `{ data }` / `{ error }` format
- Handle errors through centralized middleware — never catch-and-swallow in route handlers
- Use TanStack Query for all API calls — no raw `fetch` in components

**Anti-patterns to reject:**
- `any` type usage
- Inline validation logic (use Zod schemas)
- Direct DOM manipulation (use React state)
- Console.log in production code (use the logging utility)
- Catching errors without rethrowing or handling

## Project Structure & Boundaries

### Complete Project Directory Structure

```
todo/
├── package.json                    # Root workspace config, shared scripts
├── .env                            # Environment variables (gitignored)
├── .env.example                    # Placeholder env vars (tracked in git)
├── .gitignore
├── docker-compose.yml              # Frontend + backend + PostgreSQL
├── Dockerfile.frontend             # Multi-stage: Vite build → nginx
├── Dockerfile.backend              # Multi-stage: TS compile → Node.js
├── README.md
│
├── shared/                         # npm workspace: shared types & validation
│   ├── package.json
│   └── src/
│       ├── types.ts                # Todo type, API request/response types
│       └── validation.ts           # Zod schemas (CreateTodo, UpdateTodo)
│
├── frontend/                       # npm workspace: React + Vite SPA
│   ├── package.json
│   ├── index.html                  # Vite entry HTML
│   ├── vite.config.ts              # Vite config + Tailwind plugin + API proxy
│   ├── tsconfig.json
│   └── src/
│       ├── main.tsx                # React DOM render entry
│       ├── App.tsx                 # Root component (layout state switching)
│       ├── index.css               # Tailwind imports + Inter font
│       ├── api/
│       │   └── todos.ts            # API client: getTodos, createTodo, etc.
│       ├── hooks/
│       │   └── useTodos.ts         # TanStack Query hooks for all todo operations
│       ├── components/
│       │   ├── TaskInput.tsx        # Task creation input field
│       │   ├── TaskInput.test.tsx
│       │   ├── TaskItem.tsx         # Single task row (checkbox, text, delete)
│       │   ├── TaskItem.test.tsx
│       │   ├── TaskList.tsx         # Task list container
│       │   ├── EmptyState.tsx       # Hero centered empty state
│       │   ├── ErrorState.tsx       # Load error with retry
│       │   └── UndoToast.tsx        # Deletion undo toast
│       └── test/
│           └── setup.ts            # Vitest setup (testing-library config)
│
├── backend/                        # npm workspace: Express + Prisma API
│   ├── package.json
│   ├── tsconfig.json
│   ├── prisma/
│   │   ├── schema.prisma           # Todo model definition
│   │   └── migrations/             # Prisma Migrate output (tracked in git)
│   └── src/
│       ├── index.ts                # Express app setup, middleware, listen
│       ├── routes/
│       │   ├── todos.ts            # CRUD route handlers for /api/todos
│       │   └── todos.test.ts       # API integration tests
│       ├── middleware/
│       │   ├── errorHandler.ts     # Centralized error → JSON response
│       │   └── validate.ts         # Zod schema validation middleware
│       ├── errors/
│       │   └── index.ts            # NotFoundError, ValidationError classes
│       └── lib/
│           └── prisma.ts           # Prisma client singleton
│
└── e2e/                            # Playwright E2E tests
    ├── playwright.config.ts
    └── tests/
        ├── todo-crud.spec.ts       # Full CRUD flow test
        └── todo-errors.spec.ts     # Error state and recovery tests
```

### Architectural Boundaries

**API Boundary (the contract):**
- Frontend communicates with backend exclusively through `/api/todos` REST endpoints
- The `shared/` package defines the exact TypeScript types and Zod schemas both sides use
- Frontend never accesses the database. Backend never renders UI. The API is the only bridge.

**Component Boundaries (frontend):**
- `App.tsx` owns layout state (empty vs active) and renders the appropriate top-level component
- `useTodos.ts` hook is the single source of truth for all todo data and mutations — components never call API functions directly
- Components receive data and callbacks via props from parent or hooks — no prop drilling beyond one level

**Data Boundaries (backend):**
- Route handlers call Prisma through `lib/prisma.ts` singleton — no raw SQL
- Validation happens in middleware before route handlers execute — handlers receive pre-validated data
- Error handling happens in middleware after route handlers — handlers throw, middleware catches

### Requirements to Structure Mapping

| FR Category | Frontend Files | Backend Files | Shared Files |
|------------|---------------|---------------|-------------|
| Task Creation (FR1-4) | TaskInput.tsx, useTodos.ts | routes/todos.ts (POST) | validation.ts (CreateTodoSchema) |
| Task Viewing (FR5-8) | TaskList.tsx, EmptyState.tsx, App.tsx | routes/todos.ts (GET) | types.ts (Todo) |
| Task Editing (FR9-11) | TaskItem.tsx, useTodos.ts | routes/todos.ts (PATCH) | validation.ts (UpdateTodoSchema) |
| Task Completion (FR12-14) | TaskItem.tsx, useTodos.ts | routes/todos.ts (PATCH) | validation.ts (UpdateTodoSchema) |
| Task Deletion (FR15-16) | TaskItem.tsx, UndoToast.tsx, useTodos.ts | routes/todos.ts (DELETE, PATCH restore) | types.ts (Todo) |
| Data Persistence (FR17-20) | api/todos.ts | routes/todos.ts, lib/prisma.ts, prisma/schema.prisma | — |
| Error Handling (FR21-24) | ErrorState.tsx, useTodos.ts | middleware/errorHandler.ts, errors/index.ts | — |
| Responsive (FR25-27) | All components (Tailwind responsive utilities) | — | — |
| Accessibility (FR28-31) | All components (semantic HTML, ARIA, keyboard) | — | — |

### Data Flow

```
User action → Component → useTodos hook → TanStack Query
  → api/todos.ts (fetch) → Express route → Zod validation
    → Prisma query → PostgreSQL
    ← JSON response
  ← TanStack Query cache update
← Component re-renders with new data
```

**Optimistic flow (create, edit, complete, delete):**
```
User action → useTodos hook → TanStack Query optimistic cache update
  → UI updates immediately
  → API call fires in background
    → Success: cache already correct
    → Failure: cache auto-reverts, error surfaces in UI
```

## Architecture Validation Results

### Coherence Validation

**Decision Compatibility:** All clear.
- React 19 + Vite 8, Express 5.2 + TypeScript 6.0, Prisma 7.7 + PostgreSQL 18, Tailwind CSS 4.2 + Vite 8, TanStack Query + React 19, Vitest 4.1 + Vite 8, Zod shared via npm workspace — no version conflicts or incompatibilities.

**Pattern Consistency:** All aligned.
- camelCase flows unbroken from Prisma → API JSON → TypeScript → React (no transformation layer)
- Co-located tests consistent across frontend and backend
- Error flow consistent end-to-end (Zod → Express middleware → TanStack Query rollback → UI)

**Structure Alignment:** Clean separation.
- frontend/backend/shared enforces API contract boundary
- npm workspaces enables shared type/validation package
- Docker Compose maps cleanly to workspace packages + PostgreSQL

### Requirements Coverage Validation

**Functional Requirements:** 31/31 covered.

| FR Range | Category | Architectural Support |
|----------|----------|----------------------|
| FR1-4 | Task Creation | TaskInput → useTodos → POST /api/todos → Prisma create |
| FR5-8 | Task Viewing | TaskList/EmptyState → useQuery → GET /api/todos → Prisma findMany |
| FR9-11 | Task Editing | TaskItem inline edit → useTodos → PATCH /api/todos/:id |
| FR12-14 | Task Completion | TaskItem checkbox → useTodos → PATCH /api/todos/:id |
| FR15-16 | Task Deletion | TaskItem → UndoToast → DELETE + PATCH restore |
| FR17-20 | Data Persistence | Express REST API → Prisma → PostgreSQL in Docker |
| FR21-24 | Error Handling | ErrorState + TanStack Query rollback + errorHandler middleware |
| FR25-27 | Responsive | Tailwind responsive utilities, 2 breakpoints |
| FR28-31 | Accessibility | Semantic HTML, ARIA, keyboard model, focus management |

**Non-Functional Requirements:** 20/20 covered.

| NFR Range | Category | Architectural Support |
|-----------|----------|----------------------|
| NFR1-5 | Performance | Vite 8 Rolldown, Express <100ms, PostgreSQL single-table |
| NFR6-9 | Reliability | Prisma atomic ops, TanStack Query rollback, distinct error/empty states |
| NFR10-12 | Security | HTTPS, Zod validation, helmet headers, safe error responses |
| NFR13-17 | Maintainability | TypeScript strict, co-located tests, shared types, npm workspaces |
| NFR18-20 | Deployment | Docker Compose, multi-stage builds, .env externalization |

### Gap Analysis Results

**Critical Gaps:** None.

**Minor Items (non-blocking, resolve during implementation):**
1. Node.js version for Docker — Recommend Node.js 22 LTS
2. Shared package naming — Set `"name": "@todo/shared"` in shared/package.json
3. Vite API proxy — Add `server.proxy` config in vite.config.ts for development

### Architecture Completeness Checklist

- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed (low)
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified (10 technologies, all versioned)
- [x] Integration patterns defined
- [x] Performance considerations addressed
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Format patterns specified
- [x] Process patterns documented
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete (all 31 FRs + 20 NFRs)

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High — low-complexity project with well-established technology patterns. Every decision uses proven, widely-documented approaches.

**Key Strengths:**
- Zero transformation layers — camelCase flows from DB to UI without mapping
- Single source of truth for types and validation (shared Zod schemas)
- Optimistic UI handled by TanStack Query, not custom code
- Soft delete is cleaner than delayed deletion for undo
- Project structure is as simple as the product itself

**Areas for Future Enhancement (Post-MVP):**
- Authentication layer (when user accounts are needed)
- CI/CD pipeline (when deployment target is decided)
- Structured logging service (if deployed beyond local Docker)
- API rate limiting (if exposed publicly)
