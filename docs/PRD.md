# Product Requirements Document (PRD)

## English Learning Hub — Version 1.1

**Status:** Approved scope proposal, pending product-owner confirmation  
**Product type:** Responsive web application  
**Architecture:** Modular monolith  
**Primary stack:** Next.js, TypeScript, PostgreSQL, Prisma

## 1. Product Vision

Build a bilingual English-learning platform that helps independent learners organize vocabulary, practice recall, complete quizzes, and review measurable learning progress.

A later release will extend the same platform with tutor-side student management. The first release must remain independently useful without tutoring features.

## 2. Target Users

### Primary user — Independent English learner
- Creates and organizes personal vocabulary.
- Reviews words on a schedule.
- Practices vocabulary with quizzes.
- Tracks learning activity and accuracy.

### Future user — Tutor
- Manages student profiles.
- Records tutoring sessions.
- Assigns homework.
- Records assessments and progress.

One account may eventually use both learning and tutoring functionality.

## 3. Release Scope

### v0.1 — English Learning MVP

Included:
1. Authentication and account settings.
2. Vietnamese and English UI.
3. Vocabulary CRUD, search, filtering, and topic labels.
4. Manual vocabulary status labels.
5. Flashcards and SM-2 spaced repetition.
6. CSV import and export.
7. Basic vocabulary quizzes and score history.
8. Learning dashboard and minimum viable analytics.
9. Account data export and account deletion workflow.
10. Automated tests for core functionality and ownership isolation.

Excluded:
- Student and tutor management.
- AI-generated stories or conversations.
- Speech recognition and pronunciation scoring.
- Student accounts and public social features.
- Push notifications and offline synchronization.
- Paid plans and payment processing.

### v0.2 — Tutoring Management

Planned:
- Student profiles and archival.
- Tutoring session records and attendance.
- Homework, completion status, and grading.
- Assessments, feedback, and student progress reports.
- Optional student account linkage.

Recurring scheduling, file uploads, and student self-service access require separate acceptance criteria before implementation.

## 4. Functional Requirements

### FR-01: Authentication
- Register and log in securely.
- Verify email addresses.
- Support password reset through a verified email workflow.
- Rate-limit authentication attempts.
- Provide logout and account settings.
- Protect all private learning data with server-side authorization.

### FR-02: Bilingual UI
- Support Vietnamese (`vi`) and English (`en`).
- Allow locale switching without losing the current page when possible.
- Store UI translation messages by feature namespace.
- Return validation error keys rather than hard-coded user-facing strings.
- Persist the preferred locale in the user profile.

### FR-03: Vocabulary Management
Each vocabulary entry supports:
- Word or phrase.
- Pronunciation (optional).
- Part of speech (optional).
- English definition.
- Vietnamese meaning.
- Example sentence.
- Topic label.
- User-managed status: `LEARNING`, `FAMILIAR`, or `MASTERED`.
- Created and updated timestamps.

Users can create, edit, archive, search, and filter vocabulary entries.

Vocabulary status is a manual organizational label. It is independent of the SM-2 scheduling state.

### FR-04: Spaced Repetition
- Implement SM-2 as a pure, independently tested function.
- Show vocabulary due for review.
- Collect a recall rating after each card.
- Persist review history and the next scheduled review.
- Use the user's configured IANA timezone to determine local-day statistics.
- Keep review scheduling state separate from the manual vocabulary status.

### FR-05: CSV Import and Export
- Support UTF-8 CSV, including UTF-8 BOM files exported by spreadsheet applications.
- Define a documented header format.
- Validate rows before writing data.
- Provide duplicate handling based on normalized word/phrase matching within the user's vocabulary.
- Enforce a configurable row limit.
- Report imported, skipped, and invalid rows, including row numbers and localized error keys.
- Never allow imports to modify another user's data.

### FR-06: Quizzes
- Support multiple-choice and fill-in-the-blank questions.
- Generate questions from the user's own vocabulary.
- Use other eligible vocabulary entries as distractors.
- Require at least four eligible distinct entries for a four-option multiple-choice question.
- When insufficient distractors exist, use a supported alternative question type or explain that more vocabulary is needed.
- Save attempts, answers, score, and completion time.
- Provide answer feedback without AI dependencies.

### FR-07: Dashboard and Analytics
- Show due reviews, reviews completed today, and recent quiz results.
- Show vocabulary growth and review accuracy over time.
- Track meaningful learning activity without introducing passive study-time tracking.
- Calculate local-day metrics using the configured timezone.
- Derive dashboard summaries from public interfaces of the learning domain.

Daily stories and daily conversation prompts are excluded from v0.1.

## 5. Non-Functional Requirements

### Security
- Authenticate every private operation.
- Enforce ownership checks in server-side query functions.
- Never expose secrets or server-only modules to client bundles.
- Rate-limit login and password-reset requests.
- Validate and normalize all untrusted input.
- Test cross-user access with a real PostgreSQL test database.

### Privacy
- Collect only information necessary for the product.
- Provide a documented account export and deletion process.
- Define retention and deletion behavior for learning records.
- Do not add real student personal data to development fixtures.
- Before launching tutoring features, review applicable Vietnamese personal-data protection requirements, especially where minors may be involved.

### Reliability
- Persist all user-generated learning data in PostgreSQL.
- Use reviewed database migrations.
- Document backup and restore procedures.
- Record server errors without logging passwords, authentication tokens, or unnecessary personal data.
- Test core user journeys in CI.

### Internationalization
- Use `vi` and `en` message namespaces.
- No hard-coded user-facing strings in application flows.
- Validation errors and empty/error states must be localizable.
- Store timestamps consistently and display dates in the user's configured timezone.

### Performance and scale assumptions
Initial planning target:
- One individual user, with a small pilot of up to 10 accounts.
- Up to 10,000 vocabulary entries per user.
- Pagination or bounded queries for lists and history.
- No requirement for real-time collaboration.

These are design assumptions for the MVP, not measured capacity guarantees.

## 6. Product Success Metrics

Initial pilot targets:
- Users can complete a review session without losing saved progress.
- At least 90% of pilot test cases for core learning flows pass.
- Review accuracy and vocabulary growth match the underlying persisted data.
- At least one pilot user returns on a separate day within the first seven days.
- Collect qualitative feedback on vocabulary review usability and whether quiz results are useful.

The seven-day return metric is a pilot observation, not a guaranteed outcome or a statistical claim.

## 7. Critical Acceptance Criteria

1. Registration, email verification, login, logout, and password reset work.
2. User A cannot read or modify User B's vocabulary, review history, or quiz records.
3. Vocabulary changes persist across refresh and re-login.
4. SM-2 produces deterministic expected results for documented test cases.
5. Review history remains available after subsequent reviews.
6. CSV import handles Vietnamese text, BOM, duplicates, invalid rows, and row limits.
7. Quiz results are persisted and calculated correctly.
8. Dashboard figures match database records and respect the user's timezone.
9. All user-facing flows work in Vietnamese and English.
10. Critical-path integration tests run against PostgreSQL, not mocked Prisma operations.
11. Account export and deletion follow documented data-retention rules.
12. Lint, typecheck, unit tests, integration tests, and production build pass.

## 8. Definition of Done

A feature is complete only when:
- Business behavior and acceptance criteria are documented.
- UI, server-side validation, authorization, and persistence are implemented where required.
- Relevant translations exist in both locales.
- Unit tests and critical integration tests pass.
- Loading, empty, and error states are handled.
- Documentation and migrations reflect the implementation.
- No secrets or real user data are committed.
- The change passes CI and code review.

## 9. Roadmap

- **S0:** Repository, database infrastructure, CI, i18n, architecture rules.
- **S1:** Authentication and route protection.
- **S2:** Vocabulary CRUD and ownership tests.
- **S3:** SM-2 scheduling and flashcards.
- **S4:** CSV import/export.
- **S5:** Quiz and score history.
- **S6:** Dashboard and analytics; release v0.1.
- **S7:** Student profiles.
- **S8:** Tutoring session records.
- **S9:** Assignments, assessments, and progress reports; release v0.2.