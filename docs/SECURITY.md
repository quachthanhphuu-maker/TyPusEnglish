# TyPusEnglish — Security

Use [PRD.md](PRD.md) for product permissions and
[ARCHITECTURE.md](ARCHITECTURE.md) for server boundaries.

## Authentication

Use single-use email magic links through Auth.js. Proposed defaults:
15 minutes for links, seven days of session inactivity, and 30 days
of absolute session age. Use revocable server-side sessions with
Secure, HttpOnly, and SameSite=Lax cookies. Rotate sessions on sign-in
and revoke affected sessions after account security changes.

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