# TyPusEnglish — Architecture

[PRD.md](PRD.md) defines product scope. Use a modular monolith with Next.js,
TypeScript, PostgreSQL, and Prisma. Use Auth.js for identity, Zod for
validation, next-intl for localization, and Tailwind CSS with shadcn/ui
for UI. Test with Vitest, PostgreSQL integration tests, and Playwright.

## Module Boundaries

| Module | Owns | Allowed domain dependencies |
| --- | --- | --- |
| Accounts | Identity and sessions | None |
| Classes | Classes, profiles, enrollment, invitations, and parent links | Accounts |
| Lessons | Scheduling, attendance, and feedback | Classes |
| Assessments | Question bank, versions, submissions, and grades | Classes; Entitlements when AI ships |
| Tuition | Charges and payment ledger | Classes |
| Reports | Published snapshots and recipients | Read-only contracts from Classes, Lessons, and Assessments |
| Entitlements | Basic and Pro capabilities | Accounts |
| English Self-Study | Vocabulary, flashcards, reviews, streaks, and practice | Accounts; Classes through the approved vocabulary-sharing contract |
| Simulations | Presets, parameters, and class shares | Classes; Entitlements only for approved plan restrictions |

Use dependency-cruiser in CI to reject cycles, cross-module internal
imports, and Reports imports of Tuition. Reports must never receive
tuition or private notes through another module.

## Request Flow

Use Server Actions for UI mutations and Route Handlers for file grants,
downloads, cron, and webhooks. Validate inputs and authorize the target
record on the server. Return allowlisted DTOs. Keep Prisma server-only.

Keep related writes in the owning module where possible. For a
cross-module write, the caller owns the transaction and passes a
server-only transaction context through public write interfaces.

## Storage and Background Work

Deploy on Vercel with managed PostgreSQL and private S3 storage. Use
short-lived direct upload grants and apply the
[PRD upload policy](PRD.md#non-functional-requirements).

Write the immutable report snapshot, recipient records, audit event,
and outbox event atomically. Parents see the latest published version
addressed to them while their link is active. A correction creates a
new version with an explicit recipient list.

Run notification and retention jobs through authenticated Vercel Cron
endpoints. Process bounded batches and make retries safe. Accounts
coordinates retention and each module handles its own records. See
[Database maintenance](DATABASE.md#retention-and-maintenance).

## Repository Layout

| Path relative to the application root | Purpose |
| --- | --- |
| `src/app/` | Pages, layouts, and Next.js entry points |
| `src/modules/` | Domain logic and public contracts |
| `src/lib/db/`, `prisma/` | Database access, schema, and migrations |
| `messages/`, `tests/` | Translations and verification |

Confirm the application root from the repository manifests. Keep project
documentation in `docs/` at the repository root. Follow
[AGENTS.md](../AGENTS.md) and [SECURITY.md](SECURITY.md).