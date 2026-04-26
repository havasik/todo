---
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-02b-vision
  - step-02c-executive-summary
  - step-03-success
  - step-04-journeys
  - step-05-domain
  - step-06-innovation
  - step-07-project-type
  - step-08-scoping
  - step-09-functional
  - step-10-nonfunctional
  - step-11-polish
  - step-12-complete
releaseMode: phased
inputDocuments:
  - product-brief-todo.md
  - product-brief-todo-distillate.md
workflowType: 'prd'
documentCounts:
  briefs: 2
  research: 0
  brainstorming: 0
  projectDocs: 0
classification:
  projectType: web_app
  domain: general
  complexity: low
  projectContext: greenfield
---

# Product Requirements Document - Todo

**Author:** kris
**Date:** 2026-04-26

## Executive Summary

Todo is a full-stack web application that provides a single-screen personal task manager with five core actions: create, view, edit, complete, and delete tasks. It targets adults who currently track tasks with sticky notes, phone memos, text messages to themselves, or nothing at all — the 82% of people who lack a structured task management system, not because they don't need one, but because existing tools demand more effort to organize than the tasks themselves.

The core problem: the task management market has overshot. Todoist, Microsoft To Do, Notion, and Apple Reminders compete on features — labels, priorities, smart lists, AI scheduling — while the majority of potential users just need to write something down and check it off. Todo solves this by treating every feature as friction and every removal as an improvement. There is no signup, no onboarding, no settings, and no learning curve. Users open the app, see their tasks, type a new one, and hit enter. Tasks persist server-side across sessions without requiring an account.

### What Makes This Special

The product's differentiator is the complete absence of friction. The "aha" moment is the realization: "that's it? that's all I need?" — a reaction that proves the value is self-evident rather than something requiring explanation. The one-sentence pitch: **"A task list that does exactly what you need and nothing you don't."**

The core insight is that the best task manager is the one you don't have to think about using. In a market sprinting toward AI auto-scheduling and smart categorization, Todo wins by removing rather than adding. The gap between "I need to remember this" and "it's saved" is measured in seconds, not minutes. The tool disappears into the act of using it.

## Project Classification

- **Project Type:** Web application (SPA with backend API)
- **Domain:** General / personal productivity
- **Complexity:** Low — deliberate simplicity; straightforward CRUD with minimal feature surface
- **Project Context:** Greenfield — new product, no existing codebase
- **Quality Bar:** Production-grade — built to real-product standards as a portfolio/learning project

## Success Criteria

### User Success

- A first-time user can perform all five core actions (create, view, edit, complete, delete) without any guidance or documentation — target: 9 out of 10 users succeed within 60 seconds
- The "aha" moment — "that's it? that's all I need?" — occurs on first visit, not after configuration or exploration
- A returning user finds all tasks exactly as they left them, every time. One data loss incident is a permanent trust break
- A typical daily session (scan list, add 2-3 items, check off completed ones) takes under 30 seconds

### Business Success

- Demonstrates production-quality full-stack engineering: clean API design, solid test coverage, containerized deployment (Docker), and polished UI
- The application is reliable enough that a real user could depend on it daily as their primary task tracker
- Codebase is clean, well-structured, and easy for other developers to read, understand, and extend
- Portfolio-ready: the project stands on its own as evidence of senior-level full-stack capability

### Technical Success

- Page loads in under 1 second; all interactions respond in under 100ms under normal conditions
- WCAG 2.1 AA compliance: keyboard navigable, screen-reader compatible, sufficient color contrast
- Server-side persistence: tasks survive browser restarts, cache clears, and device reboots
- Graceful error handling on both client and server — failures surface clear feedback, never silently swallow data
- No broken states, dead ends, or visual inconsistencies across supported browsers and viewports
- Meaningful automated test coverage across frontend and backend

### Measurable Outcomes

| Metric | Target |
|--------|--------|
| Time to first task creation (new user) | < 10 seconds |
| All five core actions completed (unguided) | 9/10 users within 60 seconds |
| Page load time | < 1 second |
| Interaction response time | < 100ms |
| Data persistence reliability | 100% across sessions |
| Accessibility compliance | WCAG 2.1 AA |
| Test coverage | Meaningful coverage of all API endpoints and core UI flows |

## Product Scope & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Problem-solving MVP — prove that radical simplicity works for daily task management. The minimum product that lets a user track tasks without friction, delivered at production quality.

**Resource Model:** Solo developer. Codebase structured for team readability — clean separation of concerns, consistent naming conventions, documented API. The code should be as simple and clear as the product itself.

**Persistence Strategy:** Single-user model with server-side database as the sole source of truth. No anonymous tokens, no session management, no identity layer. The app talks directly to one database. If authentication is added in the future, user IDs are added to the data model at that point. Do not over-engineer this.

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**
- Journey 1 (First Visit): Full support — empty state, instant task creation, zero onboarding
- Journey 2 (Daily Use): Full support — persistence, completion toggle, inline editing, deletion
- Journey 3 (Error/Edge Cases): Full support — error feedback, distinct empty vs. error states, long-term persistence

**Must-Have Capabilities:**
- **Task creation** — text input, press enter to save. Single input field, always visible.
- **Task viewing** — full task list displayed immediately on app open, ordered by creation time (newest first)
- **Task inline editing** — click task text to edit, press enter or blur to save
- **Task completion** — toggle completion status; completed tasks stay inline but visually muted (opacity, color, or similar treatment)
- **Task deletion** — remove individual tasks permanently
- **Server-side persistence** — tasks stored via backend API, survive browser restarts and cache clears without requiring an account
- **Responsive design** — identical experience on desktop and mobile viewports
- **Accessibility** — WCAG 2.1 AA: keyboard navigation, screen reader support, sufficient color contrast
- **Error handling** — clean empty, loading, and error states; network failures surface clear feedback
- **Containerized deployment** — Docker-based for reproducible, portable deployment
- **Automated tests** — meaningful coverage across API endpoints and core UI interactions

**Nice-to-Have:**
- PWA installability (service worker, manifest, add-to-home-screen — zero UI complexity added)

### Post-MVP Features

**Phase 2 (Growth):**
- Bulk actions (clear completed tasks)
- Manual task reordering
- User accounts and authentication (enabling cross-device sync)
- Visible task metadata (creation date, last-edited timestamp)

**Phase 3 (Vision):**
- Cross-device sync via authenticated accounts
- Lightweight public API for third-party integrations
- Architectural readiness exists from V1, but none of these are planned or promised. Expansion only happens if it passes the test: "does this make the core experience simpler or more complex?"

**Permanent exclusions (not future features — deliberate absences):**
- AI features of any kind
- Plugin ecosystem or Zapier integrations
- Task prioritization, categories, or tags
- Due dates, deadlines, or reminders
- Notifications
- Search or filtering
- Recurring tasks
- Collaboration or multi-user editing

### Risk Mitigation Strategy

**Technical Risks:**
- *Single-user database model limits future scalability* — Mitigated by clean data model design; adding a user_id column later is a straightforward migration. Don't solve this until it's a real problem.
- *Performance with growing task lists* — Mitigated by simplicity of the data model (flat list, no relations); a single-user task list is unlikely to exceed hundreds of items. Monitor but don't optimize prematurely.

**Market Risks:**
- *Discoverability in a saturated space* — This is a portfolio project first; market validation is a secondary concern. The product proves the concept; distribution is a future problem.
- *"Too simple" perception* — The brief's positioning handles this: simplicity is the feature, not a limitation. The product is complete at V1, not incomplete.

**Resource Risks:**
- *Solo developer bandwidth* — Mitigated by deliberately minimal scope. The MVP is small enough to be built and polished by one person. Resist scope creep; the exclusion list is the most important feature list.

## User Journeys

**User profile:** A busy adult who wants to track daily tasks without friction. They may have tried and abandoned more complex tools, or never used a dedicated task app because the overhead wasn't worth it. They currently rely on sticky notes, phone memos, or memory.

### Journey 1: First Visit — "That's it?"

The user hears about Todo or stumbles on it via a link. They open the URL in their browser. There's no landing page, no signup form, no feature tour — they're immediately looking at an empty task list with a text input field.

They type "Buy groceries" and press enter. The task appears in the list instantly. They add two more: "Call dentist" and "Reply to landlord." Three tasks, captured in under 15 seconds. There's nothing else to figure out — no projects to create, no categories to assign, no priority levels to agonize over.

They think: "That's it? That's all I need." They close the tab.

**What this reveals:** The empty state must clearly invite action (visible input field, clear affordance). Task creation must be instant — no loading spinners, no confirmation dialogs. The interface must be self-explanatory with zero onboarding.

### Journey 2: Daily Use — The 30-Second Session

The next morning, the user opens Todo. Their three tasks from yesterday are exactly where they left them. They check off "Buy groceries" — it visually mutes but stays in the list. They add "Pick up dry cleaning" and "Submit timesheet." They scan the list, see what's done and what's left, and close the app. Total time: under 30 seconds.

Over the following days, this becomes routine. Open, scan, add, check off, close. Some days they delete completed tasks to tidy up. The app never asks them to do anything they didn't initiate. It never sends a notification, suggests a feature, or prompts an upgrade. It's just there when they need it.

**What this reveals:** Persistence must be bulletproof — every return visit must show exactly the state they left. The completed/active distinction must be glanceable (not just a subtle strikethrough). The task list must load instantly, not progressively. The interaction loop (open → scan → act → close) must remain fast as the list grows to 10, 20, 50 items.

### Journey 3: Edge Case — When Things Go Wrong

The user is on the subway, phone in hand, adding a task. The network drops mid-request. Instead of the task silently vanishing, they see clear feedback that the action didn't save. When connectivity returns, they re-add it.

A week later, they open Todo on their laptop for the first time. Their tasks aren't there — they were stored against a different browser/device context. This is expected for V1 (no accounts, no cross-device sync), but the user sees a clean empty state, not a confusing error.

Another scenario: the user hasn't opened Todo in two weeks. They return and all their tasks are intact, exactly as left. Server-side persistence means there's no expiry, no "your session timed out" message, no data loss from inactivity.

**What this reveals:** Network errors must produce visible, understandable feedback — never silent failures. The app must distinguish between "no tasks" (empty state) and "failed to load" (error state). Long-term data persistence is non-negotiable. The architecture must handle the single-device limitation of V1 gracefully without confusing users.

### Journey Requirements Summary

| Capability | Revealed By |
|-----------|-------------|
| Self-explanatory empty state with visible input | Journey 1 |
| Instant task creation (no loading, no confirmation) | Journey 1 |
| Zero-onboarding interface | Journey 1 |
| Bulletproof server-side persistence | Journey 2, 3 |
| Glanceable completed/active visual distinction | Journey 2 |
| Instant page load, even with growing list | Journey 2 |
| Inline task editing (typo correction) | Journey 2 |
| Individual task deletion | Journey 2 |
| Clear network error feedback | Journey 3 |
| Distinct empty state vs. error state | Journey 3 |
| Long-term data durability (no session expiry) | Journey 3 |
| Graceful single-device limitation in V1 | Journey 3 |

## Web Application Specific Requirements

### Project-Type Overview

Todo is a single-page application (SPA) with a backend API. The entire user experience lives on a single screen — no client-side routing, no page transitions, no navigation. The frontend communicates with the backend exclusively through REST API calls for CRUD operations on tasks.

### Technical Architecture Considerations

**Application Architecture:**
- Single-page application — one screen, no routing
- Frontend serves as a thin client over a REST API
- Server-side persistence via backend API; no client-side storage as primary data store
- Stateless API design; single-user model talks directly to one database with no identity layer

**Browser Support:**
- Modern evergreen browsers only: Chrome, Firefox, Safari, Edge (latest versions)
- No legacy browser support, no polyfills for older engines
- This enables use of modern CSS (flexbox, grid, custom properties) and modern JS APIs without compatibility concerns

**SEO Strategy:**
- Not applicable — no public content to index
- No SSR, meta tags, or sitemap required
- App can be fully client-rendered without SEO penalty

**Real-Time Requirements:**
- None — standard request/response via REST API
- No WebSocket, SSE, or polling needed
- Single-user model eliminates cross-client synchronization concerns

### Responsive Design

- Desktop and mobile viewports supported via responsive CSS
- Single layout adapts to screen width — not separate mobile/desktop designs
- Touch targets sized for thumb interaction on mobile (minimum 44x44px per WCAG)
- No horizontal scrolling at any viewport width

### Performance Targets

- Initial page load: < 1 second
- API response time: < 100ms under normal conditions
- Interaction feedback: immediate (optimistic UI or sub-100ms server response)
- Minimal JavaScript bundle — the app is small by design, keep it that way

### Accessibility

- WCAG 2.1 AA compliance
- Full keyboard navigation for all actions (create, edit, complete, delete)
- Screen reader compatible (proper ARIA labels, semantic HTML, live regions for dynamic updates)
- Sufficient color contrast for all text and interactive elements
- Focus management: visible focus indicators, logical tab order

### Implementation Considerations

- No client-side routing library needed — reduces bundle size and complexity
- No SSR framework needed — pure client-side SPA is sufficient
- API should be designed RESTful with consistent error response format
- Docker containerization for deployment (established in scope)
- Test infrastructure should cover both API endpoints (integration tests) and UI interactions (component/e2e tests)

## Functional Requirements

### Task Creation

- **FR1:** User can create a new task by typing text into an input field and pressing enter
- **FR2:** User can see the input field immediately upon opening the application, without any prerequisite actions
- **FR3:** User can create a task with a short text description (the only required field)
- **FR4:** System assigns a creation timestamp to each new task automatically

### Task Viewing

- **FR5:** User can view all tasks immediately upon opening the application
- **FR6:** User can see tasks ordered by creation time, newest first
- **FR7:** User can visually distinguish completed tasks from active tasks at a glance
- **FR8:** User can see a clear empty state when no tasks exist, with an obvious affordance to create the first task

### Task Editing

- **FR9:** User can edit the text of an existing task inline by clicking on the task text
- **FR10:** User can save an edited task by pressing enter or clicking/tapping away (blur)
- **FR11:** User can cancel an edit without saving changes

### Task Completion

- **FR12:** User can toggle a task between active and completed states
- **FR13:** User can see completed tasks visually muted but remaining inline with active tasks
- **FR14:** User can un-complete a previously completed task (toggle back to active)

### Task Deletion

- **FR15:** User can permanently delete an individual task
- **FR16:** System removes deleted tasks from the list immediately

### Data Persistence

- **FR17:** System persists all task data server-side via a backend API
- **FR18:** System preserves all tasks across browser restarts, cache clears, and device reboots
- **FR19:** System stores task data indefinitely with no session expiry or automatic cleanup
- **FR20:** System supports all task operations (create, read, update, delete) through a RESTful API

### Error Handling & Feedback

- **FR21:** System displays clear feedback when a task operation fails due to network or server error
- **FR22:** System distinguishes between an empty task list (no tasks created) and a failed data load (error state)
- **FR23:** System displays a loading state while fetching task data
- **FR24:** System never silently loses user data — all failures are surfaced visibly

### Responsive Experience

- **FR25:** User can perform all task operations on both desktop and mobile viewports
- **FR26:** System adapts its layout to the current viewport width without horizontal scrolling
- **FR27:** User can interact with all touch targets at a size appropriate for thumb interaction on mobile

### Accessibility

- **FR28:** User can perform all task operations (create, edit, complete, delete) using only a keyboard
- **FR29:** User can navigate all interactive elements in a logical tab order with visible focus indicators
- **FR30:** Screen reader users can understand the state and content of all tasks and controls via proper semantic markup and ARIA attributes
- **FR31:** System provides sufficient color contrast for all text and interactive elements per WCAG 2.1 AA

## Non-Functional Requirements

### Performance

- **NFR1:** Initial page load completes in under 1 second on a standard broadband connection
- **NFR2:** All user-initiated actions (create, edit, complete, delete) reflect in the UI in under 100ms
- **NFR3:** API response times remain under 100ms for all CRUD operations under normal conditions
- **NFR4:** JavaScript bundle size stays minimal — no unnecessary dependencies or frameworks beyond what the app requires
- **NFR5:** Performance does not degrade noticeably as the task list grows to 100+ items

### Reliability

- **NFR6:** Task data persists with zero data loss across browser restarts, cache clears, and server restarts
- **NFR7:** The application handles server unavailability gracefully — users see clear error states, never corrupted or partial data
- **NFR8:** Database operations are atomic — a failed write does not leave data in an inconsistent state
- **NFR9:** The application recovers cleanly from network interruptions without requiring a manual page refresh

### Security

- **NFR10:** All client-server communication uses HTTPS in production
- **NFR11:** API inputs are validated and sanitized server-side to prevent injection attacks
- **NFR12:** Error responses do not leak internal implementation details (stack traces, database structure)

### Maintainability

- **NFR13:** Codebase follows consistent formatting and naming conventions across frontend and backend
- **NFR14:** Frontend and backend are cleanly separated with a well-defined API contract between them
- **NFR15:** API endpoints are documented sufficiently for another developer to understand and extend
- **NFR16:** Automated tests cover all API endpoints and core UI interaction flows
- **NFR17:** A new developer can set up the local development environment and run the application within 15 minutes using documented steps

### Deployment

- **NFR18:** The complete application (frontend, backend, database) runs in Docker containers via a single `docker compose up` command
- **NFR19:** The deployment configuration is reproducible — same containers produce the same behavior across environments
- **NFR20:** Environment-specific configuration (ports, database connection) is externalized via environment variables, not hardcoded
