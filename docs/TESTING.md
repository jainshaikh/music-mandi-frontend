# Testing

## Vitest

Responsible for:

- Utilities
- Frontend validation (Zod schemas)
- Permission/role helpers
- Pure functions
- Appropriate components (logic-heavy, non-visual)

Config: `vitest.config.ts`. Test files live under `src/tests/` or colocated as `*.test.ts(x)` next to the code they cover.

## React Testing Library

Responsible for:

- Forms
- Interactive components
- Dialogs
- Navigation UI

Used together with Vitest (`@testing-library/react`, `@testing-library/jest-dom`).

## Playwright

Responsible for:

- Login / signup / logout
- Cross-dashboard access (an artist can't reach `/advertiser/*` or `/admin/*`, etc.)
- Navigation
- Critical workflows
- Legacy page regression checks

Config: `playwright.config.ts`. E2E specs live under `src/tests/e2e/` (created when the first real E2E test is written).

## Required checks before merge

```text
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Required checks before production

All of the above, plus a passing Playwright run against a staging-equivalent environment for critical workflows.

## Bootstrap note

No large fake test suite is required during bootstrap. A minimal tooling-verification test is acceptable to confirm Vitest/RTL/Playwright are wired up correctly.
