# AGENTS.md — Music Mandi Frontend

Vendor-neutral instructions for **all coding agents** working in this repository (Claude, GPT-based agents, Copilot, or any future agent).

## 1. Read before writing code

1. Read [`ARCHITECTURE.md`](ARCHITECTURE.md) first.
2. Read all task-relevant documents in [`/docs`](docs/).
3. Do not redesign architecture without explicit approval.
4. Do not install packages without checking [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md).

## 2. Ownership boundaries

5. Do not add backend/database code.
6. Do not create MongoDB/Prisma/Mongoose code.
7. Do not invent APIs or response payloads.

## 3. Scope discipline

8. Do not create feature functionality beyond the current task's explicit scope.
9. Use TypeScript strict conventions.
10. Use Tailwind + shadcn/ui for modern UI.
11. Keep legacy assets isolated (`public/legacy/`).
12. Never globally import legacy CSS/JS into the modern app.
13. Add new code to the correct feature/domain folder (`src/features/<domain>`), not a catch-all components folder.

## 4. Before declaring work complete

14. Run lint, TypeScript checks, relevant tests, and a production build.
15. Update documentation when architecture, routes, dependencies, or migration status changes.
16. Confirm no unrelated files were changed.
17. Summarize exactly what changed.

## 5. Full workflow

See [Section 43 "Agent Workflow"](#) style checklist below, or the canonical version this project was bootstrapped from.

### Before changing code

1. Read `ARCHITECTURE.md`.
2. Read `AGENTS.md` (this file).
3. Read `docs/PROJECT_STATUS.md`.
4. Read the docs relevant to the task.
5. Inspect the existing implementation.
6. Determine whether the task affects modern or legacy code.
7. Check `docs/DEPENDENCIES.md` before installing anything.

### During work

1. Stay within task scope.
2. Do not redesign architecture unnecessarily.
3. Do not invent backend contracts.
4. Do not add database code.
5. Do not silently install libraries.
6. Keep legacy changes isolated.
7. Reuse existing patterns/components.
8. Keep TypeScript strict.
9. Update relevant documentation when architecture/status changes.

### Before completion

1. Run lint.
2. Run TypeScript checks.
3. Run relevant tests.
4. Run production build.
5. Confirm no unrelated files were changed.
6. Update `docs/PROJECT_STATUS.md`.
7. Update the migration tracker if legacy status changed.
8. Update dependencies documentation if packages changed.
9. Summarize exactly what changed.

This file is critical because future agents working on this repo may not be Claude.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
