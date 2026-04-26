---
title: "Product Brief Distillate: Todo"
type: llm-distillate
source: "product-brief-todo.md"
created: "2026-04-26"
purpose: "Token-efficient context for downstream PRD creation"
---

# Product Brief Distillate: Todo

## Requirements Hints

- Backend exposes a small, well-defined CRUD API for todo persistence — not client-side storage
- Each todo: short text description, completion status (boolean), creation timestamp metadata
- Task list displayed immediately on app open — no splash screen, no loading gate for empty states
- Updates reflected instantly on user action (optimistic UI or equivalent); no manual refresh
- Completed tasks visually distinguishable from active tasks at a glance (not just strikethrough — consider opacity, color, spatial separation)
- Graceful error handling both client-side and server-side — failures must not disrupt user flow or lose unsaved input
- Architecture must not prevent future addition of auth and multi-user without restructuring (e.g., data model should accommodate a user/owner concept even if unused in V1)
- PWA installability as V1 nice-to-have: service worker, manifest, add-to-home-screen support — zero UI complexity added

## Technical Context

- Full-stack application: frontend + backend + persistent database
- Hosted web app — server serves both static assets and API
- No authentication in V1; single-user model (but schema should be extensible)
- Performance targets: page load <1s, interaction response <100ms
- WCAG 2.1 AA compliance required: keyboard navigation, screen reader support, sufficient color contrast
- Responsive design required: desktop and mobile viewports, no separate mobile app
- Must handle empty state (no tasks), loading state, and error state cleanly
- Data durability: tasks survive browser restarts, cache clears, and device reboots (server-side storage)

## Detailed User Scenarios

- **First visit:** User arrives at URL, sees empty state with clear affordance to add first task. No signup, no tutorial, no modal. Time to first task creation: seconds, not minutes.
- **Daily use:** User opens app, scans list, adds 2-3 items, checks off completed ones. Total interaction time: under 30 seconds for a typical session.
- **Return visit:** User returns hours or days later. All tasks are exactly as left. Completed tasks still visible (not auto-deleted). Trust in persistence is critical — one data loss incident permanently breaks the relationship.
- **Mobile use:** Same experience on phone browser. Tap targets large enough for thumb interaction. No horizontal scrolling. No features hidden behind hamburger menus.
- **Error scenario:** Network drops mid-action. User sees clear feedback that the action didn't persist. App does not silently swallow the failure or show a stale state.

## Competitive Intelligence

- **Todoist:** Market leader, $5/mo Pro tier. Recent price increases driving active migration searches on Reddit/ProductHunt. Labels, filters, priorities, projects, recurring tasks, AI integration. Documented completion rate: 49% in A/B comparison with minimal alternative.
- **Microsoft To Do:** Free, bundled with M365. Syncing issues reported. Accumulating features: My Day, planned lists, integrations. Requires Microsoft account.
- **Things 3:** Premium ($50+), Apple-only, no web version. Design-forward but GTD-heavy category structure.
- **MinimaList:** Gesture-driven mobile-only. Includes Pomodoro timer — creeping beyond pure minimalism.
- **todoMini.app:** Open-source, self-hosted, small community. Lacks polish.
- **Google Tasks / Apple Reminders / Samsung Reminders:** Pre-installed OS defaults. "Simple enough" but ecosystem-locked and gradually gaining feature bloat.
- **Plain text files:** The real incumbent for the target audience. Zero features, zero friction, zero persistence guarantees.
- **Key gap in market:** No production-quality, web-first, radically simple todo app exists. Minimalist options are mobile-only, CLI-only, or unpolished.

## Market Data

- Task management software market: $5.71B (2025), projected $6.56B (2026), 19.84% CAGR
- Personal productivity tools segment: $2.4B, growing to $5.1B by 2030
- 82% of people lack a structured task management system — potential market is the unserved majority
- AI integration is the dominant industry trend but adds complexity counter to Todo's positioning
- Market consolidation: vendors bundling task management into larger suites (Notion, ClickUp), creating opening for focused standalone tools
- Growing open-source/self-hosted segment (Vikunja, Taskwarrior, Super Productivity) signals demand for user-controlled tools

## Rejected Ideas & Explicit Exclusions

- **User accounts / authentication** — excluded from V1; architecture should not prevent later addition
- **Multi-user / collaboration** — excluded; single-user model is a deliberate constraint, not a gap
- **Task prioritization / categories / tags** — excluded; organizational overhead is the problem being solved, not a feature to add
- **Due dates / deadlines / reminders** — excluded; introduces time-management complexity antithetical to the product thesis
- **Notifications** — excluded; the app is passive, not interruptive
- **Search / filtering** — excluded; if the list is short enough, you don't need search. If it's too long, the problem is elsewhere
- **Recurring tasks** — excluded; adds scheduling logic and temporal complexity
- **AI features of any kind** — counter-positioned against the AI-everywhere trend; deliberate absence is the differentiator
- **Plugin ecosystem / integrations / Zapier** — excluded; the product is self-contained
- **Revenue model / monetization** — not addressed in V1; this is a portfolio/learning project built to production quality standards

## Open Questions

- **Persistence mechanism without auth:** How does the server identify "this user's tasks" without an account? Options: anonymous token in cookie/localStorage mapping to server-side data, device fingerprint, or URL-based instance. Each has trade-offs around cross-device access and data recovery. Needs architectural decision before implementation.
- **Data retention policy:** How long do tasks persist on the server? Indefinitely? Is there a cleanup policy for abandoned instances? Server storage costs scale with user count if no cleanup exists.
- **Task ordering:** The PRD doesn't specify whether tasks are ordered by creation time, or if manual reordering is supported. Manual reordering adds significant UI and API complexity — recommend creation-time ordering for V1.
- **Task editing:** The four core actions are create/view/complete/delete. Editing task text after creation is not listed. Is this intentional? If a user makes a typo, they must delete and recreate. Consider whether inline text editing is in or out of scope.
- **Completed task behavior:** Are completed tasks shown indefinitely? Can they be bulk-cleared? Do they stay inline or move to a separate section? These UX decisions affect daily usability significantly.

## Scope Signals

- **Hard V1 requirements:** Create, view, complete, delete. Server-side persistence. Responsive. Accessible. Fast.
- **V1 nice-to-have:** PWA installability
- **Future-maybe (architectural readiness only):** Auth, multi-user, cross-device sync, API for integrations
- **Permanent exclusions:** AI features, plugin ecosystem, productivity system features (priorities, deadlines, recurring)
- **Quality bar:** Production-grade. This is treated as a real product despite being a portfolio/learning project. No shortcuts on polish, error handling, or accessibility.
