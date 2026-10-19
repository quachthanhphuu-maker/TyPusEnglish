# Architecture — English Learning Hub

## 1. Architecture Style

Use a modular monolith with a single Next.js application and PostgreSQL database.

Modules:
- `auth`
- `learning`
- `dashboard`
- `tutoring` (introduced in v0.2)

The learning and tutoring domains own their own business rules and database access.

## 2. Dependency Rules

Allowed:
- `app` → public feature interfaces
- `dashboard` → public read interfaces from learning and, in v0.2, tutoring
- `features/learning` → learning internals and shared infrastructure
- `features/tutoring` → tutoring internals and shared infrastructure
- `server` → infrastructure and explicitly defined application services

Forbidden:
- Learning importing tutoring internals.
- Tutoring importing learning internals.
- App routes importing Prisma models or database clients directly.
- Client components importing server-only modules.
- Cross-domain access through direct imports of another domain's private query or service files.

Use each domain's `index.ts` only for intentional public interfaces. Do not export every internal function.

## 3. Directory Structure

```text
english-learning-hub/
├── .ai/
│   ├── rules/
│   └── skills/
├── .claude/
│   └── skills -> ../.ai/skills
├── .github/
│   └── workflows/
│       └── ci.yml
├── docs/
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   └── SECURITY.md
├── messages/
│   ├── en/
│   │   ├── common.json
│   │   ├── auth.json
│   │   ├── vocabulary.json
│   │   ├── review.json
│   │   ├── quiz.json
│   │   └── dashboard.json
│   └── vi/
│       ├── common.json
│       ├── auth.json
│       ├── vocabulary.json
│       ├── review.json
│       ├── quiz.json
│       └── dashboard.json
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── (auth)/
│   │   │   └── (dashboard)/
│   │   └── api/
│   ├── features/
│   │   ├── auth/
│   │   ├── learning/
│   │   │   ├── vocabulary/
│   │   │   ├── review/
│   │   │   ├── quizzes/
│   │   │   └── analytics/
│   │   ├── dashboard/
│   │   └── tutoring/          # v0.2
│   ├── components/
│   │   ├── ui/
│   │   └── shared/
│   ├── i18n/
│   │   ├── routing.ts
│   │   └── request.ts
│   ├── lib/
│   │   ├── auth/
│   │   ├── db/
│   │   └── utils/
│   ├── server/
│   │   └── shared/
│   └── types/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docker-compose.yml
├── .env.example
├── README.md
├── CLAUDE.md
└── package.json
```

Do not create tutoring implementation files before v0.2 unless needed for a reviewed architectural contract.

## 4. Feature Module Responsibilities

Each feature may contain:
- `components/`
- `schemas.ts`
- `actions.ts`
- `queries.ts`
- `service.ts` where meaningful business rules exist
- `index.ts` for deliberate public exports
- `__tests__/`

Responsibilities:
- `actions.ts`: authenticate, validate input, invoke business logic, and revalidate paths.
- `queries.ts`: read persisted data using authenticated, owner-scoped queries.
- `service.ts`: implement meaningful business rules, such as SM-2 scheduling and CSV processing.
- `schemas.ts`: define input schemas and stable validation error keys.
- `index.ts`: expose only interfaces other modules are allowed to call.

Simple CRUD may omit `service.ts` if there is no independent business rule to encapsulate.

Every server-only query, service, and action module must import `server-only` where appropriate. Client components must not import these modules.

## 5. Ownership and Authorization

Provide a central `requireUser()` helper that returns the authenticated user or rejects the operation.

All private learning queries must be scoped to the authenticated owner. Never rely on a client-supplied user ID as proof of ownership.

Use query helpers that require an owner ID and include ownership conditions in database operations.

For tutoring in v0.2, a student is owned by a tutor. All session, assignment, and assessment reads and writes must verify the chain of ownership.

A nullable `Student.userId` may be added when student accounts are implemented. Linking a student to a user must be explicit and verified; matching by name or email alone is insufficient.

PostgreSQL row-level security may be evaluated later. It is not a substitute for application authorization tests.

## 6. Authentication and Identity

Use a reviewed authentication implementation with:
- Secure password hashing.
- Verified email before sensitive account recovery.
- Password-reset tokens with expiration and single-use semantics.
- Login and reset-request rate limiting.
- Secure cookie and session settings.

If Auth.js Credentials is selected, use JWT session strategy as required for that provider configuration. Define and validate the token/session claims explicitly.

A user may use learning functionality and later gain tutor capabilities. Do not encode a single mutually exclusive role into the data model.

Keep role authorization separate from domain ownership. A tutor role does not grant access to another tutor's students.

## 7. Vocabulary and SRS Model

Separate:
- Manual vocabulary status: `LEARNING`, `FAMILIAR`, `MASTERED`.
- Scheduling state: repetition count, ease factor, interval, due timestamp, and last review timestamp.
- Immutable review history: rating, review time, and resulting schedule information.

SM-2 must be a pure function with explicit inputs and outputs. Persistence and authorization belong in the service/action layer, not inside the algorithm.

Use a consistent date/time policy:
- Store timestamps as UTC instants.
- Store the user's IANA timezone, defaulting to `Asia/Ho_Chi_Minh`.
- Calculate local-day statistics using that timezone.
- Test day-boundary behavior explicitly.

## 8. Internationalization

Use `next-intl` with route-based locales and namespaced message files.

Locale-aware routing and authentication protection must be composed according to the installed Next.js version. Use `middleware.ts` or `proxy.ts` as appropriate for that version; do not create both without a documented need.

Validation schemas return stable error keys and parameters. UI components translate those keys through the active locale.

CI must detect missing translation keys or provide a test that compares message keys across `en` and `vi`.

## 9. Database and Infrastructure

- PostgreSQL is the source of truth.
- Prisma migrations are committed to Git.
- Local development and integration tests use separate databases.
- `docker-compose.yml` provisions development and test PostgreSQL services or documented profiles.
- Test fixtures contain synthetic data only.
- Backup and restore procedures must be documented before deployment.
- Environment secrets are never committed.

Use real PostgreSQL for ownership and authorization integration tests. Do not mock Prisma in these tests.

## 10. Automated Architecture Enforcement

Configure ESLint boundaries to prevent:
- Cross-domain imports into private implementation files.
- Imports of Prisma/database clients from app and client UI layers.
- Server-only modules being imported by client components.

The exact lint configuration must match the installed ESLint version and project module aliases. CI must fail when a forbidden import is introduced.

## 11. Testing Strategy

Unit:
- SM-2 calculation and edge cases.
- CSV parsing, normalization, and validation.
- Pure score calculation and analytics functions.

Integration with PostgreSQL:
- User ownership isolation.
- Query and mutation authorization.
- Vocabulary persistence.
- Review-state transitions.
- CSV import transaction behavior.

End-to-end:
- Registration and login.
- Create, edit, search, and archive vocabulary.
- Complete a review and inspect the next due date.
- Import vocabulary and inspect row-level errors.
- Complete a quiz and inspect the saved result.
- Switch between Vietnamese and English.

## 12. Deployment and Operations

Before public release:
- Configure production environment variables.
- Apply reviewed migrations.
- Verify backup and restore.
- Configure error tracking without sensitive payloads.
- Configure rate limits and secure cookies.
- Test account export and deletion.
- Verify critical user flows on the deployed environment.