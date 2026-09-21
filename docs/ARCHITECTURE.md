# Music Mandi Frontend Architecture

**Status:** Bootstrap foundation. This is the primary architecture source of truth for the Music Mandi frontend. Every agent or developer must read this before major architectural work.

---

## 1. Frontend-Only Responsibility

This repository owns the **frontend only**. It does not own, define, or persist:

- Databases (MongoDB or otherwise)
- Backend frameworks
- Authentication/session persistence
- Refresh-token implementation
- Backend authorization/permissions
- API implementation or business rules

The backend team owns all of the above, in a separate service. The frontend integrates with backend APIs through a dedicated client layer (see [Section 6](#6-api-integration-boundary)) and never assumes a specific backend implementation.

---

## 2. Three-Dashboard Architecture

Music Mandi is one Next.js application serving three isolated dashboard experiences plus a public/auth area:

```text
                         MUSIC MANDI
                              |
                     Next.js Frontend
                              |
        +---------------------+----------------------+
        |                     |                      |
     Artist              Advertiser                Admin
   /artist/*           /advertiser/*             /admin/*
        |                     |                      |
        +---------------------+----------------------+
                              |
                    Shared Frontend Layer
                              |
                 API Integration / Auth Client
                              |
                         Backend APIs
```

Legacy pages temporarily coexist under `public/legacy` (see [Section 8](#8-legacy-coexistence-strategy)).

## 3. Public / Auth / Dashboard Route Boundaries

| Area                 | Path prefix     | Notes                                    |
| -------------------- | --------------- | ---------------------------------------- |
| Public               | `/`             | Marketing/public pages                   |
| Auth                 | `/auth/*`       | Login, signup, password flows            |
| Artist dashboard     | `/artist/*`     | Never mixed with advertiser/admin routes |
| Advertiser dashboard | `/advertiser/*` | Never mixed with artist/admin routes     |
| Admin dashboard      | `/admin/*`      | No public signup route                   |

A single generic `/dashboard/*` route shared across account types is explicitly disallowed. See [docs/ROUTING.md](docs/ROUTING.md) for the full route table.

## 4. Feature-Based Organization

Code is organized by feature/domain, not dumped into one global `components` directory:

```text
src/features/<feature-name>/
├── components/
├── hooks/
├── services/
├── types/
├── utils/
└── tests/
```

`src/app` is for routes, layouts, and route-level composition only. Business logic belongs in `src/features`.

## 5. Component Organization

```text
src/components/
├── ui/        # shadcn/ui primitives only
├── shared/    # reusable Music Mandi components (PageHeader, EmptyState, ...)
├── public/    # public marketing site chrome/components (migrated from music_mandi-website)
├── artist/    # artist-dashboard-only components
├── advertiser/# advertiser-dashboard-only components
└── admin/     # admin-dashboard-only components
```

`components/public/` is scoped to the `(public)` route group the same way `artist/`/`advertiser/`/`admin/` are scoped to their dashboards — it holds the site chrome (nav, footer, toast, smooth-scroll) and page-specific components migrated from `music_mandi-website`. See [docs/LEGACY_MIGRATION.md](LEGACY_MIGRATION.md) for how that migration is scoped and isolated.

## 6. API Integration Boundary

```text
UI Component -> Feature -> Frontend Service -> Shared API Client -> Backend API
```

Raw API calls must not be scattered across UI components. See [docs/API_INTEGRATION.md](docs/API_INTEGRATION.md).

## 7. Frontend/Backend Ownership

See the ownership table in [AGENTS.md](AGENTS.md) and [docs/DEPENDENCIES.md](docs/DEPENDENCIES.md). In short: frontend owns UI/UX, routing, forms, client validation, and API integration; backend owns data, persistence, and business rules.

## 8. Legacy Coexistence Strategy

The client's existing HTML/CSS/JS pages live under `public/legacy/` and stay isolated from modern Tailwind/shadcn styling and modern JavaScript. See [docs/LEGACY_MIGRATION.md](docs/LEGACY_MIGRATION.md) for isolation rules and the migration lifecycle.

## 9. State-Management Principles

```text
Server/backend state -> API / Next.js data patterns
URL state            -> searchParams
Form state           -> React Hook Form
Local UI state       -> React useState/useReducer
Shared client state  -> Zustand only when justified
```

No Redux. No global store for everything.

## 10. Dependency Policy

See [docs/DEPENDENCIES.md](docs/DEPENDENCIES.md) for the full installed/approved-later/do-not-add lists. Any new dependency must be added to that file with purpose, date, and reasoning.

## 11. Testing Architecture

- **Vitest** — utilities, validation, pure functions, appropriate components
- **React Testing Library** — forms, interactive components, dialogs, navigation UI
- **Playwright** — login/signup/logout, cross-dashboard access, navigation, critical workflows, legacy regression

See [docs/TESTING.md](docs/TESTING.md).

## 12. Environment Strategy

Three environments are planned: Development, Staging, Production. Frontend config (API base URL, app URL, public IDs, feature flags) is environment-based. Backend secrets never live in the frontend; private keys are never exposed via `NEXT_PUBLIC_*`.

## 13. Long-Term Migration Approach

```text
Legacy 100% -> 75% -> 50% -> 25% -> 0%
Modern   0% -> 25% -> 50% -> 75% -> 100%
```

Legacy pages migrate incrementally, only when a page needs meaningful modification, blocks new functionality, has an approved redesign, or is scheduled intentionally. See [docs/LEGACY_MIGRATION.md](docs/LEGACY_MIGRATION.md) and [docs/LEGACY_MIGRATION_TRACKER.md](docs/LEGACY_MIGRATION_TRACKER.md).
