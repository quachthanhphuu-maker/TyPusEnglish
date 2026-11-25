# TyPusEnglish — Agent Instructions

TyPusEnglish is a bilingual, multi-subject toolkit for independent tutors.
Use the version declared in [PRD.md](docs/PRD.md) as the product source of
truth. Ask the task owner to resolve conflicts before implementing the
affected behavior.

## Mandatory Rules

1. Check the assigned branch or worktree before editing. The task owner
   specifies `Write` and `Frozen` paths. Other paths are read-only.
   `Frozen` overrides `Write`. Ask before editing outside the assigned scope.
2. Place domain code in `src/modules/` relative to the application root.
   Coordinate shared API, schema, and permission changes with their owners.
3. Keep Prisma server-side. Authorize every private read and write.
   Return explicit DTOs with only permitted fields.
4. Translate new user-facing text into Vietnamese and English.
5. Use synthetic student data. Never commit secrets, edit real `.env`
   files, or run `prisma migrate reset`. Get approval before destructive
   Git or database actions, pushing, merging, or deploying.
6. Review the diff and report verification results. Test allowed and
   denied cases when permissions change.

## References

- [Architecture](docs/ARCHITECTURE.md) — Stack, modules, and dependencies.
- [Database](docs/DATABASE.md) — Records, constraints, and maintenance.
- [Security](docs/SECURITY.md) — Authentication, access, and uploads.
- [Frontend](docs/FRONTEND.md) — Sitemap, UI components, mock service layer, and design system.
- [Localization](docs/I18N.md) — next-intl conventions, namespaces, and translation keys.

## Verification

Run `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build`
from the application root if configured. Report each command as passed,
failed, unavailable, or not run. Preserve unrelated changes.