# TyPusEnglish — Security

Use [PRD.md](PRD.md) for product permissions and
[ARCHITECTURE.md](ARCHITECTURE.md) for server boundaries.

## Authentication

Use Auth.js v4 Credentials, Google OAuth, and Zalo OAuth. Do not use email
magic-link sign-in. Credential registration requires a verified email;
email verification and password reset links are single-use and expire after
15 minutes. Hash passwords with Argon2id using at least 19 MiB memory, two
iterations, and one lane. Use generic login and registration responses to
limit account enumeration.

Auth.js v4 Credentials requires JWT sessions. Use its encrypted JWE in an
HttpOnly, SameSite=Lax cookie (Secure over HTTPS in production), and store
only a random opaque session ID in PostgreSQL. Check the registry on every
session read; enforce seven days of inactivity and 30 days absolute lifetime.
Create a fresh registry row on sign-in, revoke it on logout, and revoke all
sessions after password reset or account security changes. Never persist
provider access, refresh, or ID tokens because the application has no need for
them after profile retrieval. Never put session values in localStorage.

Google and Zalo identities are linked only while the user is signed in from
Account Security. Never merge accounts because their emails match. Zalo may
provide no email; an authenticated user can add and verify one for recipient
matched Student or Parent invitations. Do not remove the last sign-in method.

Tutors and independent learners self-register only after email verification
and choose their workspace through onboarding. Student and Parent roles are
invitation-only. Classes owns the invitation records and performs recipient,
scope, expiry, revocation, and single-use checks while linking the existing
student profile or parent relationship. It grants the matching account role
through Accounts inside the same transaction. Never accept a Student or
Parent role from a browser value. A public Tutor account does not imply access
to any existing class or student record.

The JWT session registry checks `lastActivityAt` on every session read,
updates it for valid activity, and rejects revoked, inactive, or absolutely
expired sessions. A sign-in creates a fresh registry record. Logout and
account security changes revoke registry records. The browser receives only
the HttpOnly JWE cookie and allowlisted `UserDTO`, never the registry ID or
database model. The client refreshes Auth.js session state hourly and on
window focus. Session values are never stored in localStorage.

Authentication throttling uses PostgreSQL fixed-window counters keyed by
HMAC digests of normalized email addresses and trusted proxy IP addresses.
The email callback gives the same visible result when a link is suppressed
for rate limiting, so throttling does not reveal account existence. Configure
the deployment proxy to set/replace its forwarded-IP headers.

Configure `DATABASE_URL`, `AUTH_SECRET`, `NEXTAUTH_URL`, email transport,
`GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`, and `ZALO_APP_ID`/`ZALO_APP_SECRET`
through environment settings. Use OAuth callback URLs ending in
`/api/auth/callback/google` and `/api/auth/callback/zalo`. Keep provider
credentials server-only. In production, use a trusted HTTPS host and Secure
cookies; never use the example values as credentials.

Return uniform sign-in responses. Rate-limit by address and IP.
Confirm optional tutor MFA and guardian approval before the real-data pilot.

## Authorization

Use a shared server-side `can(actor, action, resource)` policy interface.
Deny by default. Resolve ownership, class membership, publication state,
recipient scope, and active links on every protected request. Return
allowlisted DTOs and keep private responses out of shared caches.

| Resource | Access |
| --- | --- |
| Student profile and class | The owning tutor or assigned educator acts within authorized scope. Students see approved own fields. Parents use linked class views. |
| Invitations | A class code permits an enrollment request. A parent invitation is expiring, single-use, and scoped to one child and class. |
| Lesson notes | Private notes are tutor-only. Published parent feedback is visible to authorized recipients. |
| Question bank and exams | The owning educator manages exams. Student DTOs omit answers, explanations, and correctness flags before grade publication. |
| Submissions and grades | Students submit their own work. Assigned educators can enter offline work and publish grades. Linked parents see published results for their child. |
| Reports | The parent must be an intended recipient of the version and have an active link to the enrollment. |
| Tuition | The responsible tutor alone sees tuition in P0. Exclude it from parent responses and report inputs. |
| Self-study and simulations | Personal study belongs to the learner. Class simulations require authorized class access. |
| AI drafts | Check Pro entitlement after release. Require educator review before saving or assigning. |

Removal and revocation block the next protected request, including
requests from an open session. Recheck access before delivering or
opening report notifications.

## Application and File Controls

- Keep Server Action origin checks enabled. Protect browser Route Handler
  mutations with origin and CSRF checks. Authenticate cron and verify
  webhook signatures.
- Escape user content by default. Allowlist any supported rich text.
  Apply CSP, HSTS on production HTTPS, frame restrictions, and `nosniff`.
- Rate-limit authentication, invitation redemption, file grants, and
  API requests. Return generic errors for invalid codes.
- Apply the [PRD upload policy](PRD.md#non-functional-requirements).
  Proposed operational quotas are 500 MB stored per user and 100 MB
  uploaded per day.
- Verify size, signature, checksum, and malware scan before serving a file.
  Keep files pending if verification cannot complete. Authorize each
  short-lived download grant. Serve downloads as attachments with `nosniff`.
  An issued grant can remain usable until it expires.

## Privacy and Operations

Use synthetic student data. Keep credentials, tokens, and private records
out of logs, commits, and prompts. Encrypt data in transit and at rest.
Obtain legal review before a real-data pilot for minor account approval,
guardian verification, and export or deletion requests.

Audit report publication, link revocation, grade changes, tuition
corrections, and student removal. Audit events are append-only and
exclude secrets and private note text.

Scan dependencies and secrets in CI. Test backup restoration and maintain
an incident procedure for containment, revocation, impact assessment,
and approved notification.

## Verification

Test cross-tutor and cross-class denial, active-session revocation,
answer-key redaction, private note and tuition isolation, report recipient
scope, concurrent invite redemption, rate limits, CSRF, XSS rendering,
and rejection of oversized, unauthorized, or unverified files.
