# Music Mandi Frontend

Frontend application for Music Mandi — one Next.js app serving three isolated dashboards (Artist, Advertiser, Admin) plus a temporary legacy site area.

This repository owns the frontend only: UI, routing, forms, client-side validation, frontend auth experience, and API integration. It does not own the database, backend framework, or business logic — see [`ARCHITECTURE.md`](ARCHITECTURE.md).

## Requirements

- Node.js 20+
- pnpm (the only supported package manager — do not use npm/yarn/bun)

## Install

```bash
pnpm install
```

## Development

```bash
pnpm dev
```

## Build

```bash
pnpm build
```

## Test

```bash
pnpm lint
pnpm typecheck
pnpm test        # Vitest + React Testing Library
pnpm test:e2e     # Playwright
```

## Environment setup

Copy `.env.example` to `.env.local` and fill in values. See [`ARCHITECTURE.md` §12](ARCHITECTURE.md#12-environment-strategy) for the environment strategy. Never commit `.env.local` or put backend secrets in `NEXT_PUBLIC_*` variables.

## Documentation

- [`SETUP.md`](SETUP.md) — full setup and run instructions (install, env vars, dev/build/test commands, troubleshooting)
- [`ARCHITECTURE.md`](ARCHITECTURE.md) — architecture source of truth, read this first
- [`AGENTS.md`](AGENTS.md) — instructions for coding agents
- [`CLAUDE.md`](CLAUDE.md) — Claude-specific pointers
- [`/docs`](docs/) — standards, routing, dependencies, auth scope, API integration, design system, legacy migration, testing, project status, and the decision log
