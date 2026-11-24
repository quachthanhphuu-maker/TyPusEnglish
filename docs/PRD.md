# TyPusEnglish — Product Requirements Document

Version 1.0 · Draft for approval

## 1. Product Overview

TyPusEnglish is a bilingual, multi-subject toolkit for independent
tutors. The first release helps tutors manage students, lessons,
attendance, homework, tuition records, and parent updates in one place.

The product also supports two expansion paths: school classrooms and
independent English learning. English self-study remains available
without class membership once released. The interface supports
Vietnamese and English.

## 2. Roles and Access

| Role | Access |
| --- | --- |
| Tutor | Manages assigned classes and student profiles, logs lessons and tuition, publishes grades and reports, and links parents. |
| Student without an account | Exists as a tutor-managed profile. The tutor can record attendance, work completion, and grades for this student. |
| Student with an account | Can join an authorized class, view assigned work, submit it, and see their own published results. |
| Parent | Can link multiple children. Each link grants read access only to published records for that child within the authorized class. |
| Independent learner | Manages their own vocabulary, review sessions, and study history. This space requires no class membership. |

An account can hold multiple roles. A class code grants no parent access.
Removing a student ends their class access immediately and revokes parent
access for that student in that class. Other valid links remain active.
Revoking one parent link does not affect another parent or child.

### Account onboarding and workspaces

Tutors and independent learners may create accounts through public
self-registration using a username and password, Google, or Zalo. Password
registration requires a verified email; Zalo may create an account without
one. Email magic-link sign-in is not supported.
Google and Zalo can be linked later from Account Security after signing in;
matching email addresses never merge accounts. New users choose Tutor or
Independent Learner during onboarding. A Tutor role grants no access to
existing classes, students, or other users' resources. Student and Parent
roles are granted only after the account redeems a valid, recipient-matched,
scoped, unexpired, unrevoked, single-use invitation. Account linking preserves
the existing student profile and its relationships.

An account with no roles goes to onboarding. An account with one role opens
that portal. An account with multiple roles can select and switch workspaces
without signing in again. The last authorized workspace may be remembered as
a UI preference; it never grants permission. Every workspace and resource
access is checked on the server.

## 3. Core User Flows

1. **Set up tutoring.** Create a one-to-one or group class, choose a
   subject and grade level, and add student profiles. Invite individual
   students to activate accounts when they need online access.
2. **Record a lesson.** Schedule or reschedule it, attach an optional
   meeting link, mark attendance, and record what was taught and what
   to review next. Publish selected notes to the parent report.
3. **Track tuition.** Create a charge, record full or partial payment,
   and view the remaining balance and transaction history.
4. **Assign and grade work.** Create a standalone assignment or select
   a saved manual exam. Account holders submit online. For students
   without accounts, the tutor records completion and scores.
5. **Report to parents.** Issue a child-specific invitation. The parent
   signs in, confirms the link, and views published records. The tutor
   previews each report and its recipients before publishing.
6. **Expand to schools and self-study.** Teachers onboard a roster
   through CSV/Excel or class codes. Independent learners sign up,
   create vocabulary sets, and review flashcards without joining a class.

## 4. Functional Requirements

### P0 — Independent Tutoring

| ID | Requirement and acceptance criteria |
| --- | --- |
| CLS-01 | Create one-to-one and small-group classes. Select a subject and grade level. Add a student profile without requiring an email or account. Linking an account to an existing profile preserves its records and does not create a duplicate. |
| CLS-02 | Invite individual students, issue separate child-specific parent invitations, and revoke access. Expired, redeemed, or revoked parent invitations cannot be redeemed again. One parent can follow multiple children independently. |
| LES-01 | Schedule or reschedule lessons and attach an external meeting link. Record attendance as Present, Absent, Late, or Excused. For groups, mark attendance in bulk and adjust individual exceptions. |
| LES-02 | Record lesson topics, progress, difficulties, and next steps. Private tutor notes stay private. Publish parent-facing notes separately. |
| HW-01 | Draft and publish assignments with deadlines and optional attachments. Allow the tutor to accept or reject late submissions. Track submission status as Not submitted, On time, or Late, and grading status separately as Ungraded or Graded. Show grades only after publication. |
| EXM-01 | Create, edit, archive, and reuse manual exams in a question bank. Support multiple-choice and written questions with answer keys, explanations, and point values. Publishing an assignment fixes its question content and scoring rules. Later edits to the source exam apply only to future assignments. |
| FEE-01 | Record a charge by lesson or billing period and record full or partial payments. Show amount due, amount paid, and outstanding balance. Distinguish Unpaid, Partially paid, Paid, and Overdue. Keep tuition records private to the tutor in P0. |
| RPT-01 | Prepare an individual parent report for a selected period with attendance, homework, published grades, and tutor feedback. Preview recipients before publishing. Linked parents can see only the reports for their own children. |

### P1 — Classroom Operations, Pro Authoring, and English Self-Study

| ID | Requirement and acceptance criteria |
| --- | --- |
| SCH-01 | Onboard a school class of at least 50 students using CSV/Excel import or a shared class code. Preview errors and duplicates before importing. Reimporting the same student identifier in a class must not create a duplicate. |
| SCH-02 | Auto-grade multiple-choice questions against the assigned version. Grade written responses manually. The gradebook distinguishes missing work, ungraded work, and zero. Broadcasts show the intended audience and recipient count before publishing. |
| AI-01 | Pro educators can generate draft exams for Math, Physics, Chemistry, and English with answers and explanations. Require educator review before saving to the question bank or assigning. Educators can edit, regenerate, or discard drafts. |
| ENG-01 | Provide free personal vocabulary sets, spaced-repetition flashcards, daily goals, and streaks. Calculate progress using the learner’s local day. Tutors can share class vocabulary sets that learners may accept as private copies. |
| TOOL-01 | Let educators adjust and share preset teaching models with their class. |

### P2 — Advanced Learning Tools

| ID | Requirement |
| --- | --- |
| TOOL-02 | Add interactive 3D geometry and supported physics and chemistry simulations. Explain when inputs are missing or a case is unsupported. |
| ENG-02 | Add vocabulary CSV import/export, practice quizzes, score history, and progress charts. |

## 5. Plans and Scope Boundaries

Basic includes tutoring workflows and the manual question bank.
Pro adds AI exam generation and regeneration. When Pro expires,
saved exams, assigned work, and manual editing remain available.

P0 tracks tuition balances and payments manually. Payment processing,
parent access to tuition records, and live chat remain open decisions.

<a id="non-functional-requirements"></a>
## 6. Non-Functional Requirements and Risks

| Area | Requirement and verification |
| --- | --- |
| Minor data and privacy | Collect only data needed for tutoring. Keep child records private by default. Use fictional records for testing. Review collection, notices, and deletion procedures before a pilot with real student data. |
| Retention | Proposed default: retain archived class records for 12 months after removal, available only to authorized educators. At expiry, delete or anonymize records according to the approved policy. Confirm the period before the pilot. |
| Authorization | Verify class access, record ownership, and active parent links on the server. Test both permitted and denied access, including after removal, revocation, and unpublished grades. |
| Uploads | Proposed P0 limits: PDF, JPEG, and PNG, up to 10 MB each and five files per submission. Reject unsupported or oversized files with a clear message. Require authorization for every download. |
| Invitation abuse | Limit repeated failed code attempts, allow rotation or revocation, and avoid exposing class or student details on invalid attempts. Parent invitations are single-use, expiring, and separate from class codes. |
| AI accuracy | Treat output as a draft. Require human review of questions, answer keys, and explanations. Measure factual and scoring errors in a sample of generated drafts before expanding Pro access. |
| Reliability and usability | Retrying tuition, submission, or linking operations must not create duplicate records. Support mobile and desktop workflows in Vietnamese and English. |

## 7. Release Gates and Pilot Signals

- **P0 gate:** A tutor manages a student without an account, logs a lesson,
  assigns a manual exam, records a partial tuition payment, and publishes
  a report that only the linked parent can access.
- **P1 gate:** Import a 50-student roster without duplicates, verify
  auto-grading against the assigned answer key, and complete both the AI
  review flow and an independent flashcard session.
- **P2 gate:** Educators validate and share supported simulations.
  Learners finish a practice quiz and retrieve their saved results.

Track time to set up a tutoring class, tutor return within seven days,
and the share of published reports opened by linked parents. Set
numerical targets after observing the first pilot.
