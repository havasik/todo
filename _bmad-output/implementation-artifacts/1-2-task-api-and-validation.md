# Story 1.2: Task API & Validation

Status: done

## Story

As a **developer**,
I want working API endpoints to create and list todos with input validation,
so that the frontend has a reliable backend to communicate with.

## Acceptance Criteria

1. **Given** the backend is running with a connected database, **When** I send `POST /api/todos` with `{ "text": "Buy groceries" }`, **Then** a new todo is created and returned as `{ data: { id, text, completed: false, createdAt, ... } }` with status 201.

2. **Given** todos exist in the database, **When** I send `GET /api/todos`, **Then** all non-deleted todos are returned as `{ data: [...] }` ordered by createdAt descending, with status 200.

3. **Given** a soft-deleted todo exists (deletedAt is set), **When** I send `GET /api/todos`, **Then** the soft-deleted todo is NOT included in the response.

4. **Given** the backend is running, **When** I send `POST /api/todos` with `{ "text": "" }` (empty text), **Then** the request is rejected with `{ error: "..." }` and status 400 (Zod validation).

5. **Given** the backend is running, **When** I send a request to a non-existent endpoint, **Then** the response is `{ error: "..." }` with status 404, no stack traces.

6. **And** Zod schemas are defined in @todo/shared and used by the backend validation middleware.

7. **And** helmet middleware is active with security headers.

8. **And** CORS is configured for the frontend origin.

9. **And** API integration tests exist for all endpoints (Vitest).

## Tasks / Subtasks

- [x] Task 1: Create error classes (AC: #5)
  - [x] Create `backend/src/errors/index.ts` with `NotFoundError` and `ValidationError` extending `Error` with a `statusCode` property
- [x] Task 2: Create validation middleware (AC: #4, #6)
  - [x] Create `backend/src/middleware/validate.ts` — accepts a Zod schema, parses `req.body`, throws `ValidationError` on failure
- [x] Task 3: Create centralized error handler middleware (AC: #4, #5)
  - [x] Create `backend/src/middleware/errorHandler.ts` — catches all errors, returns `{ error: message }` with correct status code, no stack traces in response
  - [x] Handle `ValidationError`, `NotFoundError`, Prisma `P2025` (record not found), and generic errors
- [x] Task 4: Create todo route handlers (AC: #1, #2, #3)
  - [x] Create `backend/src/routes/todos.ts` as an Express Router
  - [x] `GET /api/todos` — `prisma.todo.findMany({ where: { deletedAt: null }, orderBy: { createdAt: 'desc' } })`, returns `{ data: Todo[] }` with 200
  - [x] `POST /api/todos` — validate with `CreateTodoSchema`, `prisma.todo.create({ data: { text } })`, returns `{ data: Todo }` with 201
- [x] Task 5: Wire routes and middleware into Express app (AC: #7, #8)
  - [x] In `backend/src/index.ts`: import and mount todo router at `/api/todos`, add 404 catch-all handler, add error handler middleware (must be last)
  - [x] Verify helmet and CORS already configured from story 1.1
- [x] Task 6: Write API integration tests (AC: #9)
  - [x] Create `backend/src/routes/todos.test.ts` using Vitest + supertest
  - [x] Test: POST creates todo and returns 201 with `{ data: { id, text, completed: false, createdAt, ... } }`
  - [x] Test: GET returns todos ordered by createdAt desc, excludes soft-deleted
  - [x] Test: POST with empty text returns 400 with `{ error: "..." }`
  - [x] Test: Request to non-existent endpoint returns 404 with `{ error: "..." }`
- [x] Task 7: Verify end-to-end
  - [x] Start backend with `npm run dev -w backend`, run tests, verify all pass
  - [x] Manual curl tests for POST and GET endpoints

### Review Findings

- [x] [Review][Patch] Malformed JSON body returns 500 instead of 400 — add `SyntaxError` handling to `errorHandler` [backend/src/middleware/errorHandler.ts]
- [x] [Review][Patch] Missing `DATABASE_URL` guard — `pg.Pool` silently misconfigures on undefined [backend/src/lib/prisma.ts]
- [x] [Review][Defer] Duplicate dotenv loading with different relative paths — fragile but working, address when env management is consolidated
- [x] [Review][Defer] Unhandled Prisma errors beyond P2025 (e.g. P2002 unique constraint) → generic 500 — acceptable for V1, revisit with API route hardening
- [x] [Review][Defer] Validation error messages may leak Zod field paths to clients — low risk for V1, harden in error response story
- [x] [Review][Defer] Tests have no NODE_ENV guard against running on non-test database — deferred, add with test infrastructure story
- [x] [Review][Defer] `UpdateTodoSchema` in @todo/shared is premature (Epic 2 scope) — already shipped in story 1.1, harmless until consumed

## Dev Notes

### Architecture Compliance

**Backend organization** (from architecture.md):
```
backend/src/
├── routes/
│   ├── todos.ts            # CRUD route handlers
│   └── todos.test.ts       # API integration tests
├── middleware/
│   ├── errorHandler.ts     # Centralized error → JSON response
│   └── validate.ts         # Zod schema validation middleware
├── errors/
│   └── index.ts            # NotFoundError, ValidationError classes
├── lib/
│   └── prisma.ts           # Prisma client singleton (EXISTS from 1.1)
├── index.ts                # Express app setup (EXISTS from 1.1, UPDATE)
└── server.ts               # app.listen (EXISTS from 1.1, DO NOT MODIFY)
```

### Existing Files to Modify

**`backend/src/index.ts`** (current state):
```typescript
import 'dotenv/config'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'

const app = express()

app.use(helmet())
app.use(cors({ origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173' }))
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

export default app
```

Changes needed: import and mount the todo router, add 404 catch-all for unmatched routes, add error handler middleware as the last middleware.

**`backend/src/server.ts`** — DO NOT MODIFY. `app.listen()` is separated for testability (from story 1.1 review).

### API Contract

| Method | Path | Request Body | Response | Status |
|--------|------|-------------|----------|--------|
| GET | /api/todos | — | `{ data: Todo[] }` | 200 |
| POST | /api/todos | `{ text: string }` | `{ data: Todo }` | 201 |

Note: PATCH, DELETE, and restore endpoints are NOT in this story. They come in Epic 2.

### Response Format

- Success: `{ data: <payload> }` — dates as ISO 8601 strings, include `deletedAt: null`
- Error: `{ error: "<human-readable message>" }` — no stack traces, no internal details

### Shared Package (already exists from 1.1)

**`shared/src/validation.ts`** — `CreateTodoSchema` and `UpdateTodoSchema` are already defined. Import from `@todo/shared`.

**`shared/src/types.ts`** — `Todo`, `ApiResponse<T>`, `ApiError` types already defined.

### Validation Middleware Pattern

```typescript
// middleware/validate.ts
import { ZodSchema } from 'zod'
// Returns Express middleware that parses req.body against the schema
// On success: replaces req.body with parsed data, calls next()
// On failure: throws ValidationError with Zod error message
```

### Error Handler Pattern

```typescript
// middleware/errorHandler.ts
// Express error middleware (err, req, res, next) signature
// Switch on error type:
//   ValidationError → 400 { error: message }
//   NotFoundError → 404 { error: message }
//   Prisma P2025 → 404 { error: "Not found" }
//   Default → 500 { error: "Internal server error" }
// Never expose stack traces or internal details in response
// Log full error server-side with console.error
```

### Error Classes Pattern

```typescript
// errors/index.ts
export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message)
  }
}
export class NotFoundError extends AppError { constructor(msg = 'Not found') { super(404, msg) } }
export class ValidationError extends AppError { constructor(msg: string) { super(400, msg) } }
```

### Testing Setup

- Use **Vitest** (already in backend devDependencies)
- Install **supertest** for HTTP integration tests: `npm install -D supertest @types/supertest -w backend`
- Import `app` from `../index.js` (the Express app without listen) — this is why server.ts was separated in story 1.1
- Tests hit a real database (use the dev PostgreSQL from Docker)
- Clean up test data between tests (delete all todos in beforeEach)

### Prisma Query Patterns

```typescript
// GET — non-deleted, newest first
prisma.todo.findMany({
  where: { deletedAt: null },
  orderBy: { createdAt: 'desc' },
})

// POST — create with text only, defaults handle rest
prisma.todo.create({
  data: { text: validatedBody.text },
})
```

### Critical Warnings

- Do NOT create PATCH, DELETE, or restore endpoints — those are Story 2.x scope
- Do NOT install TanStack Query or any frontend packages — this is backend only
- Do NOT modify `backend/src/server.ts` — keep app.listen() separated
- Do NOT add `express.json()` size limit yet — deferred from story 1.1 review
- Do NOT add graceful shutdown — deferred from story 1.1 review
- The health endpoint (`GET /api/health`) must continue to work after changes
- Route handler functions must use `async` and pass errors to `next()` or use Express 5 async error handling
- Express 5.2 natively handles async route errors (rejected promises auto-forward to error middleware) — no need for `express-async-errors` or manual try/catch wrapping

### Technology Versions (from story 1.1)

| Technology | Version |
|-----------|---------|
| Express | 5.2.1 |
| Prisma | 7.7.0 |
| Zod | 3.23+ |
| Vitest | 4.1+ |
| TypeScript | 6.0.3 |
| Node.js | 22 LTS |

### Previous Story Intelligence (from 1.1)

- **Prisma 7 config**: Uses `prisma.config.ts` (not datasource url in schema.prisma). Client uses `datasourceUrl` from env.
- **dotenv**: Already imported in `index.ts` via `import 'dotenv/config'`.
- **app/server separation**: `index.ts` exports the Express `app`, `server.ts` does `app.listen()`. Tests import from `index.ts`.
- **PG volume**: PostgreSQL 18 uses `/var/lib/postgresql` mount path.
- **Package type**: `"type": "module"` in backend/package.json — use `.js` extensions in imports.

### Naming Conventions

- Route file: `todos.ts` (camelCase, plural)
- Middleware files: `errorHandler.ts`, `validate.ts` (camelCase)
- Error classes: PascalCase (`NotFoundError`, `ValidationError`)
- Functions: camelCase (`getTodos`, `createTodo`)
- Explicit return types on exported functions

### Project Structure Notes

- All new files go in `backend/src/` subdirectories as specified above
- Test file co-located: `routes/todos.test.ts` next to `routes/todos.ts`
- Import paths use `.js` extension (ESM with `"type": "module"`)

### References

- [Source: architecture.md#API & Communication Patterns] — Endpoint contract, response format
- [Source: architecture.md#Implementation Patterns] — Error handling flow, naming conventions
- [Source: architecture.md#Project Structure & Boundaries] — Backend file organization
- [Source: epics.md#Story 1.2] — Acceptance criteria
- [Source: 1-1-project-scaffolding-and-database-setup.md] — Previous story learnings, review patches

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- Prisma 7.7 "client" engine requires `@prisma/adapter-pg` + `pg` — PrismaClient no longer accepts `datasourceUrl` or `datasources` constructor options. Fixed by installing adapter and creating pg.Pool with connectionString.
- ESM import ordering: `dotenv/config` in index.ts loads after `prisma.ts` module executes (ESM hoists imports). Fixed by loading dotenv directly in `prisma.ts` with explicit path to project root `.env`.
- `@todo/shared` package needed `"type": "module"` and `"exports"` field in package.json for Node.js ESM module resolution with tsx. Without this, tsx could not resolve named exports from the workspace package.

### Completion Notes List

- All 7 tasks and all subtasks completed successfully
- Error classes: AppError, NotFoundError, ValidationError with statusCode property
- Validation middleware: Zod schema-based with proper error formatting
- Error handler: Centralized, handles AppError, Prisma P2025, generic 500, no stack traces in response
- Routes: GET /api/todos (non-deleted, createdAt desc), POST /api/todos (with CreateTodoSchema validation)
- Express app wired: todo router mounted, 404 catch-all, error handler as last middleware
- Health endpoint preserved and verified
- 8 integration tests: POST create (201), POST empty text (400), POST missing text (400), GET empty (200), GET ordered (200), GET excludes soft-deleted (200), 404 handling, health check
- Manual curl tests verified all endpoints return correct JSON responses

### Change Log

- 2026-04-28: Story 1.2 implemented — Task API with validation, error handling, integration tests
- 2026-04-28: Fixed Prisma 7 client to use @prisma/adapter-pg (client engine requires adapter)
- 2026-04-28: Fixed dotenv loading order for ESM (load in prisma.ts, not index.ts)
- 2026-04-28: Fixed @todo/shared package.json for ESM compatibility (added type:module, exports)

### File List

- backend/src/errors/index.ts (NEW) — AppError, NotFoundError, ValidationError classes
- backend/src/middleware/validate.ts (NEW) — Zod schema validation middleware
- backend/src/middleware/errorHandler.ts (NEW) — Centralized error handler, no stack traces
- backend/src/routes/todos.ts (NEW) — GET and POST /api/todos route handlers
- backend/src/routes/todos.test.ts (NEW) — 8 integration tests with Vitest + supertest
- backend/src/index.ts (MODIFIED) — Added todo router, 404 catch-all, error handler middleware, fixed dotenv path
- backend/src/lib/prisma.ts (MODIFIED) — Uses @prisma/adapter-pg with pg.Pool, loads dotenv
- backend/package.json (MODIFIED) — Added supertest, @types/supertest, @prisma/adapter-pg, pg, @types/pg
- shared/package.json (MODIFIED) — Added "type": "module" and "exports" for ESM compatibility
