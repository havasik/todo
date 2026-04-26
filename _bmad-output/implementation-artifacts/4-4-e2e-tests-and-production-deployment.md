# Story 4.4: E2E Tests & Production Deployment

Status: done

## Story

As a **developer**, I want automated E2E tests and production-ready Docker builds, so that the app is verifiably correct and deployable.

## Tasks / Subtasks

- [x] Task 1: Install Playwright and create E2E tests
  - [x] Install @playwright/test + Chromium browser
  - [x] Create playwright.config.ts
  - [x] 7 E2E tests: empty state, create, complete, edit, delete+toast, undo, error state
  - [x] Batch DELETE /api/todos endpoint for test cleanup
- [x] Task 2: Create production Docker builds
  - [x] Dockerfile.frontend: multi-stage (Vite build → nginx)
  - [x] Dockerfile.backend: multi-stage (TS compile → Node.js 22)
  - [x] nginx.conf with API proxy and SPA fallback
  - [x] docker-compose.prod.yml with all three services + healthcheck
- [x] Task 3: Create README
  - [x] Quick start, production deployment, testing, API docs, tech stack, env vars
- [x] Task 4: Add prefers-reduced-motion support (combined from 4.3)

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6 (1M context)

### Completion Notes List
- 7 Playwright E2E tests all passing (empty state, CRUD, undo, error)
- Production Docker: multi-stage frontend (nginx), backend (Node 22), PostgreSQL
- README with full documentation
- prefers-reduced-motion CSS rule suppresses all animations
- 20/20 backend integration tests + 7/7 E2E tests

### Change Log
- 2026-04-28: Story 4.4 — E2E tests, Docker production builds, README

### File List
- playwright.config.ts (NEW) — Playwright config with webServer
- e2e/todo-crud.spec.ts (NEW) — 7 E2E test cases
- Dockerfile.frontend (NEW) — Multi-stage Vite → nginx
- Dockerfile.backend (NEW) — Multi-stage TS → Node.js 22
- nginx.conf (NEW) — API proxy + SPA fallback
- docker-compose.prod.yml (NEW) — Production compose with 3 services
- README.md (MODIFIED) — Full project documentation
- backend/src/routes/todos.ts (MODIFIED) — Added batch DELETE for test cleanup
- frontend/src/index.css (MODIFIED) — prefers-reduced-motion support
