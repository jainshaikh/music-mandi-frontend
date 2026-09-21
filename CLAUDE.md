# CLAUDE.md — Music Mandi Frontend

Claude-specific project instructions. This summarizes the important rules from [`AGENTS.md`](AGENTS.md) and points to canonical documentation rather than duplicating it.

## Before coding

1. Read [`ARCHITECTURE.md`](docs/ARCHITECTURE.md).
2. Read [`AGENTS.md`](AGENTS.md).
3. Read [`docs/PROJECT_STATUS.md`](docs/PROJECT_STATUS.md).
4. Read task-specific docs in [`/docs`](docs/).
5. Inspect existing code before changing architecture.

## Rules specific to Claude in this repo

- Claude must not assume missing product requirements — mark unknowns as `TBD` and ask rather than invent.
- Claude must not silently install packages — check [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md) and update it when a new dependency is added.
- Claude must not modify legacy code under `public/legacy/` unless the task specifically requires it.
- Claude must not add backend, database, or authentication-persistence code — that is owned by a separate backend team (see `docs/ARCHITECTURE.md` §1, §7).
- Claude must not build out dashboard screens, forms, or business logic beyond the current task's explicit scope.

## Where to look

- Architecture: `docs/ARCHITECTURE.md`
- Routing: `docs/ROUTING.md`
- Dependencies: `docs/DEPENDENCIES.md`
- Frontend coding standards: `docs/FRONTEND_STANDARDS.md`
- Auth (frontend-only scope): `docs/AUTH_FRONTEND.md`
- API integration pattern: `docs/API_INTEGRATION.md`
- Design tokens: `docs/UI_DESIGN_SYSTEM.md`
- Legacy strategy: `docs/LEGACY_MIGRATION.md` and `docs/LEGACY_MIGRATION_TRACKER.md`
- Testing approach: `docs/TESTING.md`
- Current project state: `docs/PROJECT_STATUS.md`
- Decision log: `docs/DECISIONS.md`

Full agent workflow (read → scope → complete checklist) lives in [`AGENTS.md`](AGENTS.md); this file does not repeat it.
