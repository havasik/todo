# Story 1.1: Project Scaffolding & Database Setup

Status: done

## Story

As a **developer**,
I want a working monorepo with Docker, PostgreSQL, and basic Express + React apps,
so that I have a foundation to build features on.

## Acceptance Criteria

1. **Given** a fresh clone of the repository, **When** I run `npm install` at the root, **Then** all workspace dependencies are installed for frontend/, backend/, and shared/.

2. **Given** the monorepo is set up, **When** I run `docker compose up`, **Then** PostgreSQL starts and is accessible, Express server starts and responds to a health check, Vite dev server starts and serves the React app.

3. **Given** Docker is running, **When** I run `npx prisma migrate dev` in the backend directory, **Then** the Todo table is created with columns: id (uuid), text (string), completed (boolean, default false), createdAt (datetime), updatedAt (datetime), deletedAt (datetime, nullable).

4. **Given** the development environment is ready, **When** I run `npm run dev` at the root, **Then** frontend (Vite HMR) and backend (tsx watch) start concurrently, and the frontend proxies /api requests to the backend.

## Tasks / Subtasks

- [x] Task 1: Initialize npm workspaces monorepo (AC: #1)
  - [x] Create root package.json with workspaces: ["frontend", "backend", "shared"]
  - [x] Create shared/ workspace package (@todo/shared) with package.json and tsconfig.json
  - [x] Create shared/src/types.ts with Todo type and API response types
  - [x] Create shared/src/validation.ts with Zod schemas (CreateTodoSchema, UpdateTodoSchema)
- [x] Task 2: Scaffold frontend workspace (AC: #1, #4)
  - [x] Run `npm create vite@latest frontend -- --template react-ts`
  - [x] Install Tailwind CSS 4.2: `npm install tailwindcss @tailwindcss/vite`
  - [x] Configure vite.config.ts with @tailwindcss/vite plugin and API proxy (server.proxy: { '/api': 'http://localhost:3001' })
  - [x] Add @todo/shared as workspace dependency
  - [x] Set up index.css with `@import "tailwindcss"`
- [x] Task 3: Scaffold backend workspace (AC: #1, #2)
  - [x] Create backend/ with package.json, tsconfig.json
  - [x] Install: express, helmet, cors, zod
  - [x] Install dev: typescript, @types/express, @types/node, tsx, vitest
  - [x] Add @todo/shared as workspace dependency
  - [x] Create src/index.ts: Express app with helmet, cors, JSON parser, health check endpoint (GET /api/health → { status: "ok" })
  - [x] Create src/lib/prisma.ts: Prisma client singleton
- [x] Task 4: Set up Prisma and database schema (AC: #3)
  - [x] Create prisma.config.ts with Prisma 7 datasource configuration (loads .env from project root)
  - [x] Define Todo model in prisma/schema.prisma (id uuid, text String, completed Boolean default false, createdAt DateTime default now(), updatedAt DateTime @updatedAt, deletedAt DateTime?)
  - [x] Run initial migration: `npx prisma migrate dev --name init`
- [x] Task 5: Set up Docker Compose (AC: #2)
  - [x] Create docker-compose.yml with services: db (postgres:18, port 5432, volume at /var/lib/postgresql for PG18 compatibility)
  - [x] Create .env with DATABASE_URL, PORT=3001, NODE_ENV=development, CORS_ORIGIN=http://localhost:5173
  - [x] Create .env.example with placeholder values (tracked in git)
  - [x] Add .env to .gitignore
- [x] Task 6: Set up concurrent dev script (AC: #4)
  - [x] Install concurrently at root: `npm install -D concurrently`
  - [x] Add root scripts: "dev": "concurrently \"npm run dev -w frontend\" \"npm run dev -w backend\""
  - [x] Add backend dev script: "dev": "tsx watch src/index.ts"
  - [x] Verify: `npm run dev` starts both frontend and backend
- [x] Task 7: Verify end-to-end setup
  - [x] docker compose up → PostgreSQL accessible
  - [x] npx prisma migrate dev → Todo table created (migration 20260428150432_init)
  - [x] npm run dev → frontend at localhost:5173, backend at localhost:3001
  - [x] GET localhost:3001/api/health → { status: "ok" }
  - [x] Frontend proxies /api/health request through to backend

### Review Findings

- [x] [Review][Decision] PG volume path: `/var/lib/postgresql` — kept as-is, intentional for PG18 compatibility
- [x] [Review][Patch] Backend never loads `.env` at runtime — added `import 'dotenv/config'` to `backend/src/index.ts`
- [x] [Review][Patch] Separated `app.listen()` into `backend/src/server.ts`, export `app` from `backend/src/index.ts` for testability
- [x] [Review][Patch] Parse PORT to number: `const port = Number(process.env.PORT) || 3001` in `server.ts`
- [x] [Review][Patch] Use placeholder values in `.env.example` (`POSTGRES_PASSWORD=changeme`)
- [x] [Review][Defer] No graceful shutdown handling (SIGTERM/SIGINT) — deferred, add in later story
- [x] [Review][Defer] `text` column has no DB-level length constraint — deferred, Zod validation handles this at app layer
- [x] [Review][Defer] No `express.json()` size limit — deferred, add with API route hardening
- [x] [Review][Defer] No `.env.test` or test-specific DB config — deferred, add when test infrastructure story is built
- [x] [Review][Defer] No Dockerfiles (no HEALTHCHECK, no non-root USER) — deferred, Dockerfiles are Story 4.4 scope

## Dev Notes

### Architecture Compliance

**Monorepo structure** (from architecture.md):
```
todo/
├── package.json            # Root workspace config
├── .env / .env.example
├── .gitignore
├── docker-compose.yml
├── frontend/               # Vite + React + TypeScript
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
├── backend/                # Express + Prisma
│   ├── package.json
│   ├── tsconfig.json
│   ├── prisma/schema.prisma
│   └── src/
│       ├── index.ts
│       └── lib/prisma.ts
└── shared/                 # @todo/shared types + validation
    ├── package.json
    └── src/
        ├── types.ts
        └── validation.ts
```

### Technology Versions (Verified)

| Technology | Version | Install Command |
|-----------|---------|----------------|
| Vite | 8.0.8 | `npm create vite@latest frontend -- --template react-ts` |
| TypeScript | 6.0.3 | Included via Vite template + manual install for backend |
| Express | 5.2.1 | `npm install express` |
| Prisma | 7.7.0 | `npx prisma init --datasource-provider postgresql` |
| PostgreSQL | 18.3 | Docker image `postgres:18` |
| Tailwind CSS | 4.2.4 | `npm install tailwindcss @tailwindcss/vite` |
| Node.js | 22 LTS | For Docker images (not needed locally if using tsx) |
| Zod | latest | `npm install zod` (in shared/ and backend/) |

### Naming Conventions (from architecture.md)

- Prisma model: PascalCase singular (`Todo`)
- Prisma columns: camelCase (`createdAt`, `deletedAt`)
- TypeScript interfaces: PascalCase (`Todo`, `CreateTodoRequest`)
- Files: camelCase for utilities, PascalCase for React components
- npm workspace package: `@todo/shared`

### Prisma Schema

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

### Shared Package Types (shared/src/types.ts)

```typescript
export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface ApiResponse<T> {
  data: T
}

export interface ApiError {
  error: string
}
```

### Shared Package Validation (shared/src/validation.ts)

```typescript
import { z } from 'zod'

export const CreateTodoSchema = z.object({
  text: z.string().min(1)
})

export const UpdateTodoSchema = z.object({
  text: z.string().min(1).optional(),
  completed: z.boolean().optional()
})

export type CreateTodoInput = z.infer<typeof CreateTodoSchema>
export type UpdateTodoInput = z.infer<typeof UpdateTodoSchema>
```

### Docker Compose Configuration

```yaml
services:
  db:
    image: postgres:18
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-todo}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-todo}
      POSTGRES_DB: ${POSTGRES_DB:-todo}
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

Note: Frontend and backend Docker services (Dockerfile.frontend, Dockerfile.backend) are NOT created in this story. They are for production deployment in Story 4.4. Development uses `npm run dev` directly.

### Environment Variables (.env)

```
DATABASE_URL=postgresql://todo:todo@localhost:5432/todo
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### TypeScript Configuration

- `strict: true` in all tsconfig files
- No `any` types
- Explicit return types on exported functions
- Backend tsconfig targets Node.js 22 (ES2023+)
- Frontend tsconfig from Vite template defaults

### Critical Warnings

- Do NOT create Dockerfile.frontend or Dockerfile.backend yet — those are Story 4.4
- Do NOT create API route handlers (POST/GET /api/todos) — those are Story 1.2
- Do NOT install TanStack Query — that is Story 1.3
- Do NOT configure Tailwind design tokens (colors, spacing) — that is Story 1.3
- The health check endpoint (GET /api/health) is the ONLY route in this story
- PostgreSQL runs in Docker even during development — do NOT install PostgreSQL locally
- The Vite proxy forwards /api/* requests to the backend — this is how frontend talks to backend in dev

### Project Structure Notes

- Root package.json uses npm workspaces — `npm install` at root installs everything
- shared/ package is consumed by both frontend/ and backend/ via workspace dependency
- Prisma schema lives in backend/prisma/ — Prisma client is generated in backend/
- Frontend and backend have independent tsconfig.json files
- .env at root, read by docker-compose.yml and backend's Prisma configuration

### References

- [Source: architecture.md#Starter Template Evaluation] — Technology versions and scaffold approach
- [Source: architecture.md#Data Architecture] — Prisma schema and model decisions
- [Source: architecture.md#Implementation Patterns] — Naming conventions, TypeScript strictness
- [Source: architecture.md#Infrastructure & Deployment] — Docker Compose, env configuration
- [Source: architecture.md#Project Structure & Boundaries] — Complete directory structure
- [Source: epics.md#Story 1.1] — Acceptance criteria

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

- Prisma 7 breaking change: `url` no longer supported in schema.prisma datasource block. Fixed by creating `prisma.config.ts` with `datasource.url` property.
- PostgreSQL 18 breaking change: default PGDATA moved to `/var/lib/postgresql/18/docker`. Fixed by mounting volume at `/var/lib/postgresql` instead of `/var/lib/postgresql/data`.
- Prisma config requires dotenv to load .env from project root (since Prisma runs from backend/ directory). Added explicit dotenv path configuration.

### Completion Notes List

- All 7 tasks and all subtasks completed successfully
- Monorepo with npm workspaces: frontend/, backend/, shared/
- PostgreSQL 18 running in Docker, Todo table created via Prisma migration
- Express 5.2 backend with health check endpoint verified
- Vite 8 React frontend with Tailwind CSS 4.2 configured
- API proxy working: frontend at :5173 proxies /api/* to backend at :3001
- Shared @todo/shared package with Todo types and Zod validation schemas
- All acceptance criteria verified end-to-end

### Change Log

- 2026-04-28: Story 1.1 implemented — full project scaffolding with Docker, Prisma, Express, React, Tailwind

### File List

- package.json (NEW) — Root workspace config with concurrently dev script
- .gitignore (NEW) — Git ignore rules for node_modules, dist, .env
- .env (NEW) — Environment variables (gitignored)
- .env.example (NEW) — Placeholder env vars (tracked)
- docker-compose.yml (NEW) — PostgreSQL 18 service
- shared/package.json (NEW) — @todo/shared workspace package
- shared/tsconfig.json (NEW) — TypeScript config for shared
- shared/src/index.ts (NEW) — Barrel export for shared package
- shared/src/types.ts (NEW) — Todo, ApiResponse, ApiError types
- shared/src/validation.ts (NEW) — Zod schemas (CreateTodo, UpdateTodo)
- frontend/package.json (MODIFIED) — Added @todo/shared, tailwindcss, @tailwindcss/vite
- frontend/vite.config.ts (MODIFIED) — Added Tailwind plugin and /api proxy
- frontend/src/index.css (MODIFIED) — Replaced Vite boilerplate with Tailwind import
- frontend/src/App.tsx (MODIFIED) — Replaced Vite boilerplate with minimal placeholder
- backend/package.json (NEW) — Express, Prisma, helmet, cors, zod, tsx, vitest
- backend/tsconfig.json (NEW) — TypeScript config targeting ES2023
- backend/src/index.ts (NEW) — Express app with helmet, cors, health check
- backend/src/lib/prisma.ts (NEW) — Prisma client singleton with datasourceUrl
- backend/prisma/schema.prisma (NEW) — Todo model definition
- backend/prisma.config.ts (NEW) — Prisma 7 config with datasource URL from .env
- backend/prisma/migrations/20260428150432_init/migration.sql (NEW) — Initial migration
