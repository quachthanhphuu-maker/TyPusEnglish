# TyPusEnglish — Database

Use PostgreSQL and Prisma. [PRD.md](PRD.md) defines product scope.
[ARCHITECTURE.md](ARCHITECTURE.md) defines module ownership.

## P0 Data Model

| Area | Records and invariants |
| --- | --- |
| Accounts | Auth.js `User`, `Account`, `VerificationToken`, and revocable database `Session` belong to Accounts. `UserRole` supports multiple roles and is unique per `(userId, role)`. `UserPreference` stores the optional active workspace. `RateLimitBucket` stores hashed identifiers in persistent fixed windows. `Entitlement` belongs to Entitlements. |
| Classes | `Class` stores owner, subject, grade level, and class type. `StudentProfile` has `ownerTutorId` and optional `userId`. Enforce unique `(ownerTutorId, userId)` when linked. `Enrollment` is unique per class and student profile. |
| Invitations | `ClassInvitation` and `ParentInvitation` store token digests and lifecycle state. Redeem parent invitations atomically. Enforce one active `ParentLink` per parent and enrollment. |
| Lessons | `Lesson`, `Attendance`, `PrivateLessonNote`, and `ParentLessonFeedback`. Attendance is unique per lesson and enrollment. Parent-facing queries cannot read private notes. |
| Question bank | Tutor-owned `Exam` stores title and archive state. `ExamQuestion` stores exam, position, type, prompt, points, explanation, and optional written-answer rubric. `QuestionOption` stores question, position, text, and correctness. Enforce unique positions per exam or question. |
| Assignments | `AssignmentVersion` captures instructions, attachments, questions, and scoring at publication. Standalone homework may have no exam. `Submission` stores enrollment, version, source (`STUDENT` or `TUTOR`), and entering actor. `SubmissionAnswer` ties an answer and optional score to a question from the submitted version. |
| Tuition | One append-only payment applies to one charge. Correct errors with a linked reversal. Reject duplicate or mismatched reversals. Store integer minor units with a currency code and controlled exponent. VND uses exponent `0`. Store due dates as dates. Derive overdue status from due date and balance. |
| Reports | `Report` is unique per enrollment and reporting period. `ReportVersion` stores immutable content, version number, publication time, and `snapshotSchemaVersion`. `ReportRecipient` is unique per version and user. Set `firstOpenedAt` once after an authorized human open. |
| Files | `Attachment` uses explicit foreign keys and a CHECK requiring exactly one owner. Store a unique object key, filename, detected MIME type, size, checksum, and `PENDING`, `VERIFIED`, or `REJECTED` status. |
| Operations | `IdempotencyRecord`, `OutboxEvent`, `Notification`, `RateLimitBucket`, and append-only `AuditEvent`. Deduplicate notifications by event and recipient. |

Reactivate the existing enrollment when a student returns. Keep history
and require new parent invitations. Account linking preserves the original
profile. Resolve ownership conflicts before merging records.

Keep submission timing, grading, and publication separate. A missing
score differs from zero. Store event instants in UTC and retain the
relevant IANA timezone for lessons, billing, and learner-local dates.

Accounts sessions store `createdAt`, `lastActivityAt`, and
`absoluteExpiresAt`. Enforce seven days of inactivity and a 30-day absolute
lifetime in the Accounts adapter; Auth.js's rolling `expires` value alone
does not enforce the absolute cap. Email verification tokens are single-use
and expire after 15 minutes. Store rate-limit identifiers as HMAC digests.

`ClassInvitation` and `ParentInvitation` remain owned by Classes. Classes
validates recipient, class/profile scope, expiration, revocation, and
single-use redemption and links the existing profile/relationship in one
transaction. After that validation, it calls the server-only Accounts
`grantVerifiedInvitationRole` API in the same transaction. Accounts does not
create a parallel invitation table or grant Student/Parent roles from a
client-selected value.

## P1 and P2 Model Sketches

| Phase | Records |
| --- | --- |
| P1 English study | `VocabularySet` belongs to the learner. `Flashcard` stores vocabulary and current review state. `ReviewEvent` stores recall and scheduling history. `StudyDay` is unique per learner and local date. Derive streaks from consecutive qualifying days. |
| P1 simulations | `SimulationPreset` stores subject, model, and parameter schema version. `ClassSimulationShare` stores the class, actor, preset version, and validated parameter snapshot. |
| P2 expansion | Add subject-specific simulation presets and private `PracticeAttempt` and `PracticeAnswer` records. |

## Integrity and Migrations

Use composite foreign keys to enforce tutor and class consistency.
Use reviewed SQL migrations for partial unique indexes and CHECK
constraints. Verify them against PostgreSQL. Backfill existing data
before making fields required.

Scope idempotency keys by actor and operation. Store a request
fingerprint and result reference atomically with the write. Reject a
key reused with a different payload. Apply to payments, submissions,
and parent linking.

## Retention and Maintenance

Apply academic, financial, and audit policy from the
[PRD](PRD.md#non-functional-requirements). Accounts coordinates cleanup
with record owners. Include associated snapshots and stored objects.

Proposed operational retention is seven days after completion for
idempotency records, 30 days after successful processing for outbox
events, and 90 days for notifications. Rate-limit counters expire at
the end of their window. Retain unresolved outbox failures for review.
