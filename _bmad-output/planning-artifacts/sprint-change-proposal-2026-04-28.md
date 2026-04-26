# Sprint Change Proposal — Post-Implementation Hardening

**Date:** 2026-04-28
**Triggered by:** Post-implementation review
**Scope:** Minor — direct implementation by developer

## Issue Summary

Post-implementation review identified 5 gaps in testing, security, and compliance that need to be addressed before the project can be considered production-ready. All 12 stories are functionally complete but lack:
1. Frontend component test coverage
2. Coverage measurement and reporting
3. Dockerfile security (non-root user)
4. Automated accessibility verification
5. Security review documentation

## Impact Analysis

**Epic Impact:** No existing epics affected. New Epic 5 proposed.
**Story Impact:** No existing stories modified. 2 new stories proposed.
**Artifact Conflicts:** None — additive changes only.
**Technical Impact:** New dev dependencies (React Testing Library, @vitest/coverage-v8, @axe-core/playwright). No production code changes except Dockerfile.frontend.

## Recommended Approach

**Direct Adjustment** — Add a new Epic 5 with 2 stories:
- **Story 5.1:** Frontend component tests + coverage configuration
- **Story 5.2:** Dockerfile fix + accessibility audit + security review document

## Detailed Change Proposals

### Sprint Status Addition

```yaml
# Epic 5: Post-Implementation Hardening
epic-5: backlog
5-1-frontend-component-tests-and-coverage: backlog
5-2-security-and-accessibility-hardening: backlog
epic-5-retrospective: optional
```

### Story 5.1: Frontend Component Tests & Coverage

**Scope:** Gaps #1 and #2
- Install `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`, `@vitest/coverage-v8` in frontend
- Configure Vitest for React component testing (vitest.config.ts with jsdom environment)
- Create test files: TaskInput.test.tsx, TaskItem.test.tsx, TaskList.test.tsx, EmptyState.test.tsx, ErrorState.test.tsx, UndoToast.test.tsx
- Add coverage script and verify 70% threshold

### Story 5.2: Security & Accessibility Hardening

**Scope:** Gaps #3, #4, and #5
- Fix Dockerfile.frontend: add non-root nginx user
- Install `@axe-core/playwright` and add accessibility checks to E2E tests
- Create security review document covering XSS, injection, OWASP top 10

## Implementation Handoff

**Scope Classification:** Minor
**Route to:** Developer agent (direct implementation)
**Success Criteria:** All component tests pass, coverage ≥70%, Dockerfile runs non-root, axe-core reports zero critical violations, security document exists
