# Todo

A full-stack todo application with React, Express, PostgreSQL, and Docker.

## Prerequisites

- Node.js 22 LTS
- Docker & Docker Compose
- npm 10+

## Quick Start (Development)

```bash
# 1. Clone and install
git clone <repo-url> && cd todo
npm install

# 2. Start PostgreSQL
docker compose up -d

# 3. Copy environment variables
cp .env.example .env

# 4. Run database migration
cd backend && npx prisma migrate dev && cd ..

# 5. Start development servers
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:3001

## Production Deployment

```bash
docker compose -f docker-compose.prod.yml up --build
```

App available at http://localhost (port 80).

## Testing

```bash
# Backend integration tests
cd backend && npx vitest run

# E2E tests (requires dev servers running)
npx playwright test
```

## API Documentation

| Method | Endpoint | Body | Response | Status |
|--------|----------|------|----------|--------|
| GET | /api/todos | — | `{ data: Todo[] }` | 200 |
| POST | /api/todos | `{ text: string }` | `{ data: Todo }` | 201 |
| PATCH | /api/todos/:id | `{ text?, completed? }` | `{ data: Todo }` | 200 |
| DELETE | /api/todos/:id | — | `{ data: Todo }` | 200 |
| PATCH | /api/todos/:id/restore | — | `{ data: Todo }` | 200 |
| GET | /api/health | — | `{ status: "ok" }` | 200 |

## Tech Stack

- **Frontend:** React 19, TypeScript 6, Tailwind CSS 4, TanStack Query 5, Vite 8
- **Backend:** Express 5, Prisma 7, PostgreSQL 18, Zod
- **Testing:** Vitest (integration), Playwright (E2E)
- **Deployment:** Docker multi-stage builds, nginx

## Environment Variables

See `.env.example` for all required variables.

---

## How BMAD Guided the Implementation

This project was built using the [BMAD Method](https://github.com/bmadcode/BMAD-METHOD) (v6.5.0), a spec-driven AI development framework that structures work through four phases with specialized agent personas.

### The Four Phases

**Phase 1 — Analysis:** Mary (Business Analyst) created the product brief through iterative discovery. She ran competitive research autonomously (identifying Todoist pricing shifts, MinimaList gaps, the "better sticky note" positioning) and her review panel (skeptic + opportunity reviewer) challenged assumptions — narrowing "general consumers" to "adults who use sticky notes or nothing at all."

**Phase 2 — Planning:** John (Product Manager) built the PRD through a 12-step guided workflow, producing 31 functional requirements and 20 non-functional requirements. He caught a gap in the original spec — task editing wasn't scoped, but delete-and-recreate for typos was bad UX, so inline editing was added. Sally (UX Designer) designed the interaction model through a 14-step workflow. Her key contributions: the "relief, not delight" emotional framework, the paper-list mental model (write = add, cross out = complete, erase = delete), and the centered hero-input empty state transitioning to top-anchored layout.

**Phase 3 — Solutioning:** Winston (System Architect) defined the technical architecture, evaluated starter templates (rejecting T3/Redwood for being too opinionated), and recommended the composable scaffold approach. He proposed TanStack Query for optimistic UI — its built-in mutation rollback solved the hardest frontend problem. The epics/stories decomposition produced 4 epics and 13 stories, all with BDD acceptance criteria. Implementation readiness check validated 100% FR coverage.

**Phase 4 — Implementation:** Sprint planning created the tracking system, then 13 stories were implemented through the create-story → dev-story → code-review cycle. Each story was prepared with full context extraction from PRD, architecture, and previous stories. Dev-story implemented with TDD. Code review ran three analysis layers: Blind Hunter (logic), Edge Case Hunter (boundaries), and Acceptance Auditor (AC compliance).

**Course Correction:** Post-implementation review revealed gaps — frontend component tests were missing, test coverage wasn't measured, and the frontend Dockerfile lacked a non-root user. These were addressed through BMAD's `correct-course` workflow, which created a formal Sprint Change Proposal, added new stories, and implemented them through the standard cycle.

### What the Methodology Caught Early

- **Missing inline editing** — John flagged that delete-and-recreate for typos was unacceptable UX (Phase 2)
- **Audience too broad** — Mary's skeptic reviewer challenged "general consumers" before it propagated downstream
- **Undo-delete pattern** — Sally identified accidental deletion as the one interaction that could break trust, leading to the UndoToast component
- **Soft delete architecture** — Winston designed `deletedAt` timestamp approach for the undo/restore pattern

### What It Missed

- Frontend component tests were not specified as explicit acceptance criteria in any story — the dev agent wrote backend integration tests and E2E tests but skipped frontend unit tests because no AC required them
- Test coverage measurement was a stated goal (70%) but was never formalized as a story acceptance criterion
- The lesson: BMAD agents follow specs precisely — if it's not in an AC, it won't get built. Spec quality determines output quality.

---

## AI Integration Log

### Agent Usage by Phase

#### Phase 1: Analysis — `bmad-product-brief` (Mary)
- **What worked:** Autonomous competitive research produced genuine insights (Todoist pricing shifts creating switching moment, digital minimalism tailwind). The review panel (skeptic + opportunity reviewer) added real value by challenging broad assumptions.
- **Prompts that worked:** Providing the initial PRD as a file (`input-prd.md`) and letting Mary drive discovery questions rather than front-loading requirements.
- **Human input needed:** Strategic decisions — target audience, distribution model, product vision. Mary couldn't decide these herself.

#### Phase 2: Planning — `bmad-create-prd` (John) + `bmad-create-ux-design` (Sally)
- **What worked:** John's 12-step workflow systematically covered every PRD dimension. Sally's emotional design framework ("relief, not delight") and paper-list mental model emerged from the agent — not prompted by the user.
- **Prompts that worked:** Concise, decisive answers to discovery questions. Saying "correct, let's continue" when the agent's assessment was accurate rather than over-explaining.
- **Human input critical:** Scope decisions (adding inline editing, choosing creation-time ordering, keeping completed tasks inline). These product judgment calls can't be delegated.

#### Phase 3: Solutioning — `bmad-create-architecture` (Winston)
- **What worked:** Winston evaluated starter templates and correctly rejected meta-frameworks. Tech stack recommendations (TanStack Query for optimistic UI, Zod for shared validation) were well-reasoned.
- **Prompts that worked:** Being specific about tech preferences upfront ("TypeScript, React with Vite, Express, PostgreSQL, Prisma") rather than letting the agent explore options.
- **Human input critical:** Naming consistency (`/api/todos` not `/api/tasks`), directory naming (`frontend/backend` not `client/server`), monorepo strategy.

#### Phase 4: Implementation — `bmad-dev-story` (Amelia) + `bmad-code-review`
- **What worked:** TDD cycle produced working code with tests. Story context extraction meant each story had full awareness of architecture decisions and previous implementations.
- **Issues encountered:**
  - Prisma configuration required looking up current docs — the agent's knowledge was slightly outdated
  - Docker Compose required multiple fix cycles after Story 1.1 (started new context after this story)
  - Some test iterations needed before tests passed correctly
  - Code review appeared optional in the flow — had to explicitly invoke it
- **Human input critical:** Verifying that `docker compose up` actually worked, catching that frontend tests were never written.

#### Course Correction — `bmad-correct-course`
- **What worked:** Formal change proposal process correctly identified impact and generated new stories with proper acceptance criteria.
- **Lesson learned:** Course correction exists for a reason — post-implementation gaps are normal in real projects.

### Test Generation

- **Backend integration tests:** Generated during Story 1.2, tested all API endpoints with valid and invalid inputs. Worked well.
- **Frontend component tests:** Initially missed entirely — no story AC required them. Added via course correction. AI generated tests for all 6 components with good coverage (91.52% statements).
- **E2E tests:** 7 CRUD tests + 4 accessibility tests generated. Playwright tests used accessible selectors (roles, labels, placeholders) — good practice that emerged from the UX spec's accessibility work.
- **What AI missed:** Edge cases in test generation required review. The AI tended to test happy paths more thoroughly than error paths.

### Debugging with AI

- **Prisma setup:** Agent needed current documentation lookup for Prisma 7's `prisma.config.ts` format (different from older `prisma/schema.prisma`-only approach).
- **Docker Compose:** Multiple cycles of build-fail-fix after Story 1.1. Starting a fresh context resolved accumulated confusion.
- **Test failures:** Some generated tests made incorrect assumptions about component behavior. Required iteration to match actual implementation.

### Limitations Encountered

1. **Spec gaps propagate:** If acceptance criteria don't mention frontend tests, the dev agent won't write them. The methodology is only as good as the specs.
2. **Same-model review blind spots:** Code review by the same model that wrote the code missed the non-root Docker user gap. Different models for dev vs review would catch more.
3. **Context window management:** After Story 1.1 (project scaffolding + Docker + database), the context was cluttered enough that a fresh session was beneficial.
4. **Documentation currency:** Prisma 7 configuration had changed from what the agent initially attempted. Current docs lookup was required.
5. **Docker debugging:** AI struggled with multi-container orchestration debugging — the feedback loop of build/run/check-logs/fix was slow and required human verification.

### Test & Coverage Summary

| Test Type | Files | Tests | Tool |
|-----------|-------|-------|------|
| Frontend component tests | 6 | Covers all 6 components | Vitest + React Testing Library |
| Backend integration tests | 1 | API endpoint coverage | Vitest |
| E2E CRUD tests | 1 | 7 user journey tests | Playwright |
| E2E accessibility tests | 1 | 4 axe-core audits | Playwright + @axe-core/playwright |

**Frontend coverage:** 91.52% statements, 82.35% branches, 90.9% functions, 92.72% lines (target: 70%)

### QA Reports

- **Test coverage:** See `frontend/coverage/index.html` for full Istanbul report
- **Accessibility:** 4 Playwright + axe-core tests verify zero critical WCAG violations across empty, populated, completed, and error states
- **Security:** See `docs/security-review.md` for full OWASP top 10 assessment
- **Performance:** Sub-100ms API responses, <1s page load with Vite 8 + Rolldown bundler, minimal bundle via Tailwind CSS purging
