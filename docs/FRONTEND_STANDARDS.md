# Frontend Standards

## TypeScript

- Strict mode is on (`tsconfig.json`).
- No `any` as a default escape hatch.
- Prefer explicit domain types once backend contracts are known.
- Do not create fake domain types merely to fill folders — leave `src/types/` empty until a real contract exists.

## Components

- `src/components/ui/` — shadcn/ui primitives only (Button, Input, Dialog, etc.). Prefer shadcn primitives before creating custom ones; extend rather than duplicate.
- `src/components/shared/` — reusable Music Mandi components used by more than one dashboard.
- `src/components/{artist,advertiser,admin}/` — components scoped to a single dashboard.
- Business logic lives in `src/features/<domain>/`, not in `src/app` route files and not in `src/components`.

## Naming conventions

- Components: `PascalCase.tsx`.
- Hooks: `useThing.ts`, in `src/hooks/` (shared) or a feature's own `hooks/` (feature-scoped).
- Route segments: lowercase, kebab-case where multi-word (matches the route tables in `docs/ROUTING.md`).
- Non-component modules (services, utils, lib): `camelCase.ts`.

## Import conventions

- Use the `@/*` path alias (maps to `src/*`) instead of deep relative imports.
- Import order: external packages, then `@/` absolute imports, then relative imports.

## React / Next.js conventions

- App Router only; no Pages Router.
- Default to Server Components; add `"use client"` only where interactivity/state/browser APIs require it.
- Route files (`page.tsx`, `layout.tsx`) stay thin — composition only, no embedded business logic.

## Tailwind conventions

- All new modern styling uses Tailwind and shared design tokens (`docs/UI_DESIGN_SYSTEM.md`).
- No large standalone CSS systems for modern pages, no random hex colors, no copying legacy CSS into global modern styles.

## shadcn conventions

- Add components via the shadcn CLI into `src/components/ui/`.
- Extend shadcn components rather than forking/duplicating them.
- No Material UI or Bootstrap in modern pages.

## Form conventions

- React Hook Form + Zod + `@hookform/resolvers` + shadcn form components.
- Schemas live alongside the feature that owns the form (`src/features/<domain>/types` or a feature-local `schemas` file), created only when that feature is actually implemented — not during bootstrap.

## Loading / error / empty state expectations

Every real data-driven feature considers: Loading, Success, Empty, Error, Unauthorized, Forbidden. Skeletons for content loading; spinners for action progress (save/submit/upload/login/delete).

## Accessibility expectations

Keyboard navigation, visible focus states, proper labels, semantic HTML, appropriate ARIA usage, readable contrast, accessible dialog/interactive-control behavior. Use shadcn components as designed rather than overriding their accessibility behavior.

## Responsive requirements

Every new modern page supports desktop, laptop, tablet, and mobile from the start — not as a later cleanup phase.

## Comments / documentation expectations

- No comment blocks explaining _what_ code does — names should do that.
- A comment is justified only for a non-obvious _why_ (a constraint, an invariant, a workaround).
- Update the relevant `/docs` file when architecture, routes, dependencies, or migration status changes — don't let code and docs drift.
