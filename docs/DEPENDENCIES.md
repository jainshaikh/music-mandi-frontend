# Frontend Dependency Policy

Any newly introduced dependency must be added to this file with: **Package, Purpose, Date added, Feature requiring it, Reason existing stack could not solve the requirement.**

---

## Installed Foundation

| Package                                                                        | Purpose                                                                                                 |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| next                                                                           | Application framework (App Router)                                                                      |
| react / react-dom                                                              | UI runtime                                                                                              |
| typescript                                                                     | Static typing                                                                                           |
| tailwindcss                                                                    | Styling                                                                                                 |
| eslint / eslint-config-next                                                    | Linting                                                                                                 |
| eslint-config-prettier                                                         | Disables ESLint stylistic rules that conflict with Prettier                                             |
| prettier                                                                       | Formatting                                                                                              |
| prettier-plugin-tailwindcss                                                    | Sorts Tailwind classes on format                                                                        |
| shadcn (devDependency, CLI)                                                    | Component foundation CLI — installs primitives into `src/components/ui`                                 |
| @base-ui/react, class-variance-authority, cn, tw-animate-css                   | Installed automatically by `shadcn init` (base-nova preset) — underpin shadcn/ui primitives and theming |
| lucide-react                                                                   | Icon system                                                                                             |
| sonner                                                                         | Toast notifications                                                                                     |
| react-hook-form                                                                | Form state                                                                                              |
| zod                                                                            | Schema validation                                                                                       |
| @hookform/resolvers                                                            | Connects React Hook Form + Zod                                                                          |
| date-fns                                                                       | Date utilities                                                                                          |
| vitest / @vitejs/plugin-react / jsdom                                          | Unit test runner + React support + DOM environment                                                      |
| @testing-library/react, @testing-library/jest-dom, @testing-library/user-event | Component testing                                                                                       |
| @playwright/test                                                               | End-to-end testing                                                                                      |

## Approved Later (add only when a real feature needs it)

| Package               | Use case                                              |
| --------------------- | ----------------------------------------------------- |
| @tanstack/react-table | Complex data tables                                   |
| @tanstack/react-query | Client-side API caching/refetching                    |
| zustand               | Global client state (e.g. music player, upload queue) |
| recharts              | Dashboard charts                                      |
| next-themes           | Dark/light/system theme                               |
| wavesurfer.js         | Audio waveform                                        |

## Do Not Add Without Approval

- Redux
- Formik
- Yup / Joi (frontend validation — Zod is the approved choice)
- Axios (native `fetch` is the default; only add with a real justification)
- Material UI
- Bootstrap (for new/modern pages — legacy pages may keep it)
- Moment.js
- A second icon library, toast library, table library, or chart library
- Any database package (Prisma, Mongoose, MongoDB driver, etc.)
- Backend authentication frameworks

## Newly Introduced Dependencies

Dependencies added during bootstrap beyond the reference doc's explicit foundation list.

| Package                                                      | Purpose                               | Date added | Feature requiring it                                                    | Reason existing stack could not solve it                                                                                                       |
| ------------------------------------------------------------ | ------------------------------------- | ---------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| eslint-config-prettier                                       | Avoid ESLint/Prettier rule conflicts  | 2026-09-20 | Bootstrap tooling                                                       | ESLint and Prettier are both approved but need this connector to not fight each other on formatting rules                                      |
| prettier-plugin-tailwindcss                                  | Deterministic Tailwind class ordering | 2026-09-20 | Bootstrap tooling                                                       | Standard companion for Tailwind + Prettier; avoids inconsistent class order across the team                                                    |
| @vitejs/plugin-react, jsdom                                  | Vitest React/DOM support              | 2026-09-20 | Bootstrap tooling                                                       | Required by Vitest to render React components in tests                                                                                         |
| @testing-library/user-event                                  | User-interaction simulation for tests | 2026-09-20 | Bootstrap tooling                                                       | Companion to React Testing Library, approved stack                                                                                             |
| @base-ui/react, class-variance-authority, cn, tw-animate-css | shadcn/ui internals                   | 2026-09-20 | shadcn/ui initialization                                                | Installed automatically by `shadcn init`'s default (base-nova) preset; not chosen independently                                                |
| @sendgrid/mail                                               | Send transactional email              | 2026-09-21 | Interim email integration (contact/artist-submit/campaign-submit forms) | No existing package sends email; this is the same package music_mandi-website's own backend routes already use — see docs/DECISIONS.md DEC-017 |
