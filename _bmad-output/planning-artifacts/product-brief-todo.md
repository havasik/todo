---
title: "Product Brief: Todo"
status: "complete"
created: "2026-04-26"
updated: "2026-04-26"
inputs:
  - "User brain dump and PRD"
  - "Web research: competitive landscape, market trends, user sentiment"
---

# Product Brief: Todo

## Executive Summary

Most people don't need a project management system to buy groceries or remember to call the dentist. Yet the task management market — valued at over $5.7 billion — is dominated by tools that treat every checkbox like a deliverable, burying simple needs under layers of labels, filters, priorities, and AI-powered scheduling.

Todo is a hosted web application that does exactly four things: create tasks, view them, complete them, and delete them. Nothing else. In a market where the leading apps actively reduce task completion rates through feature overload, Todo bets that the most productive tool is the one that gets out of your way. It's built for the 82% of people who don't use a structured task system — not because they don't need one, but because every option they've tried demanded more effort to organize than the tasks themselves.

## The Problem

People forget things. They need a place to write them down and check them off. This is a solved problem — in theory. In practice, opening Todoist means navigating projects, labels, priorities, and recurring schedules before you can capture a thought. Microsoft To Do wants you to plan "My Day." Notion wants you to build a database. Even Apple Reminders now has smart lists, tags, and location-based triggers.

The result is a documented paradox: users of feature-rich task apps spend more time organizing tasks than completing them. One A/B study found task completion dropped to 49% with a full-featured app versus 84% with a minimal alternative over identical time periods. Meanwhile, developers on Hacker News and Reddit regularly confess to abandoning every todo app in favor of a plain text file — the ultimate signal that existing products have overshot.

The people underserved by this market aren't power users. They're everyone else: the person who needs to remember five things today and wants to check them off without learning a system first. Todo doesn't compete with Todoist — it competes with the sticky note on the monitor, the text message to yourself, the browser tab left open as a reminder. It's for the people who never wanted a "productivity system" in the first place.

## The Solution

Todo is a hosted web app with a single screen and four actions. You open it, you see your tasks, you add new ones, you check them off or delete them. There is no onboarding, no tutorial, no settings page, no account creation.

Tasks are stored server-side and retrieved through a clean API, ensuring data survives browser restarts and cache clears without requiring the user to create an account. The interface is fast enough that interactions feel instantaneous — the goal is sub-second load times and sub-100ms response to every user action. Completed tasks are visually distinct at a glance. The experience works identically on desktop and mobile. Empty states, loading states, and error states are handled cleanly — the app always feels finished, never broken.

That's the entire product. The constraint is the feature.

## What Makes This Different

Todo's differentiation is disciplined restraint. In a market sprinting toward AI auto-scheduling and smart categorization, Todo deliberately does less.

This is not a competitive weakness — it's a positioning choice backed by user behavior data. When every competitor adds features to justify subscription pricing, a tool that respects the user's time by staying simple occupies a genuinely vacant niche. No major player owns "radically simple full-stack web todo." Existing minimalist alternatives are either mobile-only, CLI-only, or lack the polish of a production-grade web application.

The moat is not technical — it's philosophical. The ongoing discipline to say "no" to feature requests is harder than building the features, and it's what keeps the product honest.

## Who This Serves

**Primary audience:** Adults who currently use sticky notes, phone notes, text messages to themselves, or nothing at all to track daily tasks. They aren't looking for a productivity system — they just need a list that works. They may have tried and abandoned more complex tools, or they may have never used a dedicated task app because the overhead never seemed worth it.

**What success looks like for them:** They open the app, add what they need to remember, and come back later to check things off. The app never asks them to learn something, configure something, or upgrade something. It just works.

## Success Criteria

- A first-time user can perform all four core actions (create, view, complete, delete) without any guidance — target: 9 out of 10 users succeed within 60 seconds
- Task data persists reliably across sessions, browser restarts, and cache clears via server-side storage
- Page loads in under 1 second; all interactions respond in under 100ms under normal conditions
- The interface is immediately understandable on both desktop and mobile viewports
- The application meets WCAG 2.1 AA accessibility standards — keyboard navigable, screen-reader compatible, sufficient color contrast
- The application feels complete and polished — no broken states, no dead ends, no visual inconsistencies across supported browsers

## Scope

**Version 1 includes:**
- Task creation with short text descriptions
- Task list view (immediate on app open)
- Task completion toggle with clear visual distinction
- Task deletion
- Server-side persistent storage across sessions
- Responsive design (desktop and mobile)
- Clean handling of empty, loading, and error states

**Nice-to-have for V1:**
- PWA installability (add-to-home-screen support for mobile and desktop — zero UI complexity, meaningful retention benefit)

**Explicitly excluded from Version 1:**
- User accounts and authentication
- Multi-user support or collaboration
- Task prioritization, categories, or tags
- Due dates, deadlines, or reminders
- Notifications
- Search or filtering
- Recurring tasks

## Vision

V1 success is measured purely on the minimal feature set — not on what comes next. The architecture is designed so that future capabilities like authentication, cross-device sync, or a lightweight API are not precluded, but none of these are planned or promised. Architectural readiness is not a product roadmap.

The north star remains: every feature must pass the question "does this make the core experience simpler or more complex?" If the answer is "more complex," it doesn't ship. The best version of Todo still loads in under a second and still has no tutorial.
