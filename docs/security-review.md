# Security Review — Todo Application

**Date:** 2026-04-28
**Scope:** Full-stack todo app (React SPA + Express API + PostgreSQL)

## OWASP Top 10 Assessment

### 1. Injection (A03:2021)

**SQL Injection:** MITIGATED
- Prisma ORM generates parameterized queries — no raw SQL
- All user input passes through Zod validation before reaching Prisma
- No string concatenation in queries

**NoSQL Injection:** N/A — PostgreSQL relational database only

**Command Injection:** N/A — no shell commands or exec calls

### 2. Broken Authentication (A07:2021)

**Status:** NOT APPLICABLE (V1)
- No user authentication — single-user model
- No sessions, tokens, or credentials
- API is open by design (documented in architecture)
- **Future consideration:** Add auth before multi-user or public deployment

### 3. Sensitive Data Exposure (A02:2021)

**Status:** LOW RISK
- No sensitive user data beyond task text
- No PII, no passwords, no financial data
- Database credentials in `.env` (gitignored), `.env.example` has placeholders
- Error responses do not expose stack traces or internal details (NFR12)
- `helmet` middleware sets security headers (X-Content-Type-Options, X-Frame-Options, etc.)

### 4. XML External Entities (A05:2021)

**Status:** NOT APPLICABLE
- No XML processing — JSON-only API

### 5. Broken Access Control (A01:2021)

**Status:** BY DESIGN (V1)
- All API endpoints are open (no auth)
- All todos are accessible to any client
- CORS restricts origin to frontend URL in production
- **Future consideration:** Add user-scoped access control with auth

### 6. Security Misconfiguration (A05:2021)

**Status:** ADDRESSED
- `helmet` middleware enabled with defaults (CSP, X-Frame-Options, etc.)
- CORS configured for specific origin (not wildcard in production)
- Production Docker containers: backend runs as `node` user, frontend runs as `nginx` user
- `.env` excluded from git, `.env.example` uses placeholder credentials
- Database port not exposed in production compose (internal Docker network)

### 7. Cross-Site Scripting (XSS) (A03:2021)

**Status:** MITIGATED
- React 19 auto-escapes all rendered content via JSX
- No `dangerouslySetInnerHTML` usage anywhere in the codebase
- No raw HTML injection points
- User-submitted task text is rendered as text nodes only
- Content-Security-Policy via helmet further restricts inline scripts

### 8. Insecure Deserialization (A08:2021)

**Status:** LOW RISK
- Express `json()` middleware parses JSON bodies only
- Zod schemas validate and strip unexpected fields
- No object serialization/deserialization beyond JSON

### 9. Using Components with Known Vulnerabilities (A06:2021)

**Status:** MONITORED
- All dependencies are latest stable versions (April 2026)
- `npm audit` should be run regularly
- No known critical vulnerabilities at time of deployment

### 10. Insufficient Logging & Monitoring (A09:2021)

**Status:** BASIC
- Console-based structured logging with timestamps
- Error handler logs full error objects server-side
- No external logging service (acceptable for V1 single-user)
- **Future consideration:** Add structured logging service for production

## Input Validation Summary

| Endpoint | Validation | Method |
|----------|-----------|--------|
| POST /api/todos | `{ text: string (min 1) }` | Zod CreateTodoSchema |
| PATCH /api/todos/:id | `{ text?: string (min 1), completed?: boolean }` + refine(at least one field) | Zod UpdateTodoSchema |
| DELETE /api/todos/:id | UUID path param only | Prisma where clause |
| PATCH /api/todos/:id/restore | UUID path param only | Prisma where clause |
| DELETE /api/todos | No body (batch delete) | Blocked in production via NODE_ENV check |

## Security Headers (via helmet)

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 0` (modern standard)
- `Strict-Transport-Security` (when HTTPS)
- `Content-Security-Policy` (defaults)

## Recommendations for Future Versions

1. Add authentication (JWT or session-based) before multi-user deployment
2. Add rate limiting (express-rate-limit) before public exposure
3. Add HTTPS enforcement in production nginx config
4. Add `express.json({ limit: '10kb' })` body size limit
5. Add database connection pooling limits
6. Set up automated dependency scanning (Dependabot/Snyk)
