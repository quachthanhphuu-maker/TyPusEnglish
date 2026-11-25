# Authentication Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement verified username/password, Google OAuth, and Zalo OAuth with role-aware onboarding, revocable PostgreSQL-backed session lifecycle controls, and a public Auth Contract while preserving the existing frontend and mock business services.

**Architecture:** Keep all identity and session domain code in `frontend/src/modules/accounts/`. Auth.js v4 uses its Prisma adapter and encrypted JWE cookie (Credentials requires JWT sessions); a random server-only session ID maps to a PostgreSQL record enforcing inactivity, absolute expiry, and revocation. Role grants, rate-limit buckets, and workspace preference are persisted in PostgreSQL. Invitation records remain Classes-owned. Existing locale routing and UI are integrated in place.

**Tech Stack:** Next.js 14, React 18, stable Auth.js/NextAuth `next-auth@4.24.15`, `@next-auth/prisma-adapter@1.0.7`, Prisma 6.19, PostgreSQL, Zod, Nodemailer, Vitest.

**Spec:** Approved decisions in the user's implementation request; existing sources `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/DATABASE.md`, `docs/SECURITY.md`, `docs/FRONTEND.md`, and `docs/I18N.md`.

## Global Constraints

- Work only in `D:\Tutor\TyPusEnglish-auth` on `feat/auth-database`.
- Public self-registration grants Tutor or Independent Learner only through onboarding; Student and Parent roles require a valid invitation.
- A Tutor registration grants no access to existing classes, students, or other users' resources.
- Keep all authorization server-side and deny by default; active workspace is a UI preference only.
- Email verification and reset links expire after 15 minutes; email magic-link sign-in is removed. Sessions expire after seven days inactive and 30 days absolute.
- One account can have password, Google, and Zalo methods. Link/unlink providers only while signed in; never merge on matching email. Zalo accounts may have no email.
- Cookies are HttpOnly and SameSite=Lax; Secure in production over HTTPS.
- Keep Prisma, session tokens, email credentials, and database fields out of client components.
- Preserve locale routing, existing auth UI, portals, shared components, landing UI, and mock business services.
- Do not run destructive database commands or commit secrets.

## Review Focus

- Expired, replayed, wrong-recipient, revoked, or malformed invitation tokens cannot grant Student/Parent roles; test each lifecycle boundary.
- Session reads enforce both seven-day inactivity and 30-day absolute expiry; test just before and at each expiry.
- Concurrent invitation redemption can grant a role only once; test competing transactions against PostgreSQL when available.
- Client-provided roles and unsafe/cross-locale redirects never influence authorization or destination; test tampered role and return paths.
- Rate limits remain effective across app instances and do not store raw email/IP; test database-backed fixed-window behavior.

---

### Task 1: Accounts schema and database foundation

**Files:**
- Create `frontend/prisma/schema.prisma`
- Create reviewed migration under `frontend/prisma/migrations/`
- Create `frontend/src/lib/db/prisma.ts`
- Modify `frontend/package.json`, `frontend/pnpm-lock.yaml`
- Create focused schema/database tests or verification scripts under `frontend/tests/`

**Interfaces:**
- Produces Auth.js adapter models plus `UserRole`, `UserPreference`, and `RateLimitBucket` records.
- `Session` includes `createdAt`, `lastActivityAt`, and `absoluteExpiresAt` in addition to Auth.js fields.

- [ ] Add tests/checks for role uniqueness, one-use invitation state, session timestamps, and rate-limit uniqueness.
- [ ] Run the new checks and confirm they fail before schema exists.
- [ ] Add Prisma 6 and Auth.js adapter dependencies, schema, and singleton database client.
- [ ] Create/review a forward-only migration; never reset the database.
- [ ] Run Prisma validation and client generation, then run focused checks.

### Task 2: Public Auth Contract and security primitives

**Files:**
- Create `frontend/src/modules/accounts/contracts/auth-contract.ts`
- Create `frontend/src/modules/accounts/lib/email.ts`
- Create `frontend/src/modules/accounts/lib/redirect.ts`
- Create `frontend/src/modules/accounts/lib/rate-limit.ts`
- Modify compatible auth types in `frontend/src/types/index.ts`
- Create unit tests under `frontend/tests/accounts/`

**Interfaces:**
- `UserDTO` exposes only `id`, `email`, `name`, `roles`, `onboardingStatus`, and `activeWorkspace`.
- `SessionDTO` exposes `user` and ISO `expiresAt`; it never exposes the session token.
- `AuthStatus` is authenticated or unauthenticated and supports zero/one/multiple roles.
- Error codes are a closed safe union; authorization APIs remain server-only.

- [ ] Test email normalization/validation, safe locale-preserving redirects, role DTO mapping, and fixed-window limits.
- [ ] Run tests and verify the expected failures.
- [ ] Implement the DTOs and pure security helpers; hash rate-limit identifiers before storage.
- [ ] Re-run focused tests and typecheck.

### Task 3: Auth.js, email transport, and session lifecycle

**Files:**
- Create `frontend/src/modules/accounts/auth.ts`
- Create `frontend/src/modules/accounts/lib/auth-adapter.ts`
- Create `frontend/src/app/api/auth/[...nextauth]/route.ts`
- Create `frontend/.env.example`
- Modify `frontend/package.json`, `frontend/pnpm-lock.yaml`, and auth environment docs
- Create adapter/session tests under `frontend/tests/accounts/`

**Interfaces:**
- `auth()` returns an Auth.js session with only the public user fields required by server rendering.
- `getAuthStatus()` returns the approved `AuthStatus` contract.
- `revokeUserSessions(userId)` revokes all database sessions for that user.

- [ ] Test the adapter wrapper’s max inactivity, absolute expiry, activity touch, expiry cap, and revocation behavior.
- [ ] Confirm tests fail against the absent adapter wrapper.
- [ ] Configure Credentials, Google, and Zalo providers with 900-second single-use verification/reset tokens and encrypted JWT cookies backed by the PostgreSQL session registry.
- [ ] Configure persistent email/identifier/IP rate limiting, safe generic responses, secure cookies, and Nodemailer SMTP from environment variables.
- [ ] Re-run tests, Prisma validation, and typecheck.

### Task 4: Onboarding, role grants, invitation redemption, and authorization

**Files:**
- Create `frontend/src/modules/accounts/services/account-service.ts`
- Create `frontend/src/modules/accounts/services/invitation-service.ts`
- Create `frontend/src/modules/accounts/lib/authorization.ts`
- Create `frontend/src/app/[locale]/(auth)/register/page.tsx`
- Create `frontend/src/app/[locale]/(auth)/onboarding/page.tsx`
- Create `frontend/src/app/[locale]/(auth)/workspace/page.tsx`
- Create invitation acceptance route/pages under the existing auth route group
- Create service and authorization tests under `frontend/tests/accounts/`

**Interfaces:**
- Public onboarding can add only Tutor or Independent Learner roles.
- Student/Parent role grants accept only a Classes-owned invitation redeemer contract that validates recipient, scope, expiry, revocation, and single-use state and runs in the caller's transaction.
- Workspace selection only stores a preference and verifies that the user already holds the selected role.
- `requireUser`, `requireRole`, and `can(actor, action, resource)` are server-only and deny by default.

- [ ] Test role acquisition restrictions, invitation recipient/scope/expiry/replay cases, workspace preference authorization, and cross-role denial.
- [ ] Confirm tests fail before service implementation.
- [ ] Implement onboarding and invitation services with transaction-safe role grants, opaque token digests, and safe return routing.
- [ ] Integrate roleless/one-role/multiple-role destination behavior.
- [ ] Re-run focused tests and typecheck.

### Task 5: Existing frontend and localization integration

**Files:**
- Modify `frontend/src/app/[locale]/(auth)/login/page.tsx`
- Modify `frontend/src/middleware.ts` only if needed to compose existing next-intl middleware safely
- Modify `frontend/messages/en.json`, `frontend/messages/vi.json`
- Modify existing portal layouts only where protected server checks can be inserted without rebuilding UI
- Modify `frontend/src/types/index.ts` compatibility contract
- Create UI/action tests under `frontend/tests/accounts/`

- [ ] Test login, register, verify-request, logout, locale retention, roleless onboarding, portal redirects, and selector visibility.
- [ ] Confirm tests fail for missing auth actions/routes.
- [ ] Reuse the current Login UI and components; add localized states/errors and links for Tutor/Learner registration and invitation acceptance.
- [ ] Protect existing portal pages at the server boundary; keep mock business data independent from auth and never activate mock auth in production.
- [ ] Re-run UI/unit tests, typecheck, lint, and build.

## Execution ledger

- Ruling: Keep class and parent invitation records in Classes, not Accounts — `docs/DATABASE.md` assigns invitation ownership to Classes and this branch has no class schema to validate or link scope IDs — the cost if wrong is that the Frontend Agent must integrate the Accounts role-grant contract with Classes before invitation activation is end-to-end.
- Ruling: Use stable NextAuth 4.24.15 and its v4 Prisma adapter for this implementation — v5 remains published under the beta tag while the matching v4 adapter supports the app's Next.js 14/React 18/Prisma 6 stack — the cost if wrong is that v4 is in maintenance mode and needs a reviewed migration after v5 is stable.

### Task 6: Documentation, migration review, and verification

**Files:**
- Modify `docs/PRD.md`, `docs/DATABASE.md`, `docs/SECURITY.md`, `docs/FRONTEND.md`, and `docs/I18N.md`
- Modify `frontend/.env.example`
- Review complete diff

- [ ] Document approved onboarding and workspace decisions in the existing specifications and Auth Contract/integration notes for the Frontend Agent.
- [ ] Verify migration SQL, indexes, and account constraints without applying destructive operations.
- [ ] Run lint, typecheck, automated tests, Prisma validation, and build; report unavailable credential-dependent checks explicitly.
- [ ] Review status/diff and confirm unrelated UI and mock services are preserved.
