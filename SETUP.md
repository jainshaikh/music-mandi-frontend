# Setup & Run Guide — Music Mandi Frontend

Everything needed to get this project running on a new machine, plus the day-to-day commands you'll use while working on it.

For architecture and scope rules, read [`ARCHITECTURE.md`](ARCHITECTURE.md) and [`AGENTS.md`](AGENTS.md) first — this file is only about running the project, not about what you're allowed to build.

---

## 1. Prerequisites

| Tool    | Version            | Notes                                                                             |
| ------- | ------------------ | --------------------------------------------------------------------------------- |
| Node.js | 20+                | Check with `node -v`                                                              |
| pnpm    | 11+                | This is the **only** supported package manager — never use npm, yarn, or bun here |
| Git     | any recent version |                                                                                   |

If you don't have pnpm installed:

```bash
npm install -g pnpm
```

---

## 2. First-time setup

From the project root (`C:\dev\music-mandi-frontend`):

```bash
pnpm install
```

This installs everything listed in `package.json` using `pnpm-lock.yaml`. Do not run `npm install` or `yarn install` — that would create a second lockfile, which this project forbids (see [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)).

### Environment variables

Copy the example env file and fill in real values as they become available:

```bash
cp .env.example .env.local
```

`.env.local` is git-ignored and never committed. Never put backend secrets in a `NEXT_PUBLIC_*` variable — those are shipped to the browser.

| Variable                   | Purpose                                                                       |
| -------------------------- | ----------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL` | Base URL of the backend API this frontend talks to                            |
| `NEXT_PUBLIC_APP_URL`      | Public URL this frontend is served from (defaults to `http://localhost:3000`) |

---

## 3. Running the app

### Development server

```bash
pnpm dev
```

Opens at [http://localhost:3000](http://localhost:3000) with hot reload.

### Production build

```bash
pnpm build
pnpm start
```

`pnpm build` compiles an optimized production build; `pnpm start` serves that build (run `pnpm build` first — `start` doesn't build for you).

---

## 4. Quality checks

Run these before pushing anything, and always before declaring a task complete (see [`AGENTS.md`](AGENTS.md)):

```bash
pnpm lint          # ESLint
pnpm typecheck     # TypeScript, no emit
pnpm test          # Vitest + React Testing Library (unit/component tests)
pnpm test:e2e      # Playwright end-to-end tests
pnpm build          # Production build must succeed
```

Formatting:

```bash
pnpm format         # auto-format everything with Prettier
pnpm format:check   # check formatting without changing files (used in CI)
```

### Important: TypeScript route types

Next.js 15+ generates global helper types (`LayoutProps`, `PageProps`, etc.) into `.next/types` the first time you run `pnpm dev`, `pnpm build`, or:

```bash
pnpm exec next typegen
```

If you run `pnpm typecheck` on a completely fresh checkout **before ever running dev/build**, it may fail with `Cannot find name 'LayoutProps'`. Run `pnpm exec next typegen` once (or just `pnpm dev`) to fix it — this is a one-time step per fresh checkout, not something you need to repeat every time.

### Playwright browsers

The e2e tests need Chromium installed once per machine:

```bash
pnpm exec playwright install chromium
```

(Already installed on this machine as part of bootstrap — you only need this on a new machine or CI runner.)

---

## 5. Working with shadcn/ui

Add a new shadcn/ui primitive into `src/components/ui/`:

```bash
pnpm exec shadcn add <component-name>
```

Example:

```bash
pnpm exec shadcn add dialog
```

Do not run `pnpm dlx shadcn@latest ...` in this project — the CLI is installed as a project devDependency and must be run via `pnpm exec shadcn ...` so it resolves its own dependencies (like `zod`) correctly. (`pnpm dlx` hit a real dependency-resolution issue on this machine during bootstrap — see [Troubleshooting](#7-troubleshooting) below.)

---

## 6. Project structure at a glance

```text
music-mandi-frontend/
├── docs/                     # reference docs — read before major changes
├── public/
│   ├── legacy/                # isolated legacy HTML/CSS/JS (see docs/LEGACY_MIGRATION.md)
│   └── modern/                # modern static assets
├── src/
│   ├── app/                   # routes only — (public)/(auth)/(artist)/(advertiser)/(admin)
│   ├── components/            # ui/ (shadcn), shared/, artist/, advertiser/, admin/
│   ├── features/              # business logic per domain
│   ├── services/               # API client + domain service wrappers
│   ├── hooks/ lib/ config/ types/ styles/
│   └── tests/                 # setup.ts, unit tests, e2e/ (Playwright)
├── ARCHITECTURE.md            # read this first
├── AGENTS.md                  # rules for coding agents
├── CLAUDE.md
└── README.md
```

Full route table: [`docs/ROUTING.md`](docs/ROUTING.md). Dependency policy: [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md).

---

## 7. Troubleshooting

**`pnpm install` times out / fails downloading `next` or `@next/swc-*`**
The default pnpm fetch timeout is too short for a slow connection. Raise it once, globally:

```bash
pnpm config set fetch-timeout 300000
pnpm config set fetch-retries 5
pnpm config set fetch-retry-mintimeout 20000
pnpm config set fetch-retry-maxtimeout 120000
```

Then retry `pnpm install`.

**`pnpm dlx shadcn@latest ...` fails with `Cannot find package 'zod'`**
This is a Windows/pnpm store resolution quirk with `pnpm dlx`, not a real missing dependency. Don't use `pnpm dlx` for shadcn in this repo — use `pnpm exec shadcn ...` instead (shadcn is already a devDependency, see Section 5 above).

**`pnpm typecheck` fails with `Cannot find name 'LayoutProps'`**
See [Important: TypeScript route types](#important-typescript-route-types) above — run `pnpm exec next typegen` (or `pnpm dev` once).

**Port 3000 already in use**
Another `next dev`/`next start` is likely still running. Stop it, or run `next dev -p <other-port>`.
