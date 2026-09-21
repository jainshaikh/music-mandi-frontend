# Legacy Migration Strategy

## Why legacy pages exist

The client's existing website is built with plain HTML, CSS, and JavaScript. It must keep working while the modern Next.js/TypeScript/Tailwind/shadcn application is built incrementally. Migration must not become one risky full rewrite.

## A second source: music_mandi-website

Separately from the raw-HTML scenario above, the client also has an existing **Next.js/React/TypeScript** site at `C:\dev\music-mandi\music_mandi-website` with its own public marketing pages (home, about, contact, labels, tamasha, tele-ads, legal, etc.). Because that source is already React/TypeScript — not raw HTML/CSS/JS — its pages are migrated directly into `src/app/(public)/` and `src/components/public/` as real components, not hosted under `public/legacy/`. The isolation goal is the same (migrated styling/JS must not leak into the rest of the app), but the mechanism differs:

- Each migrated page/component gets its own co-located CSS Module (`Component.module.css`) instead of one global stylesheet — `music_mandi-website`'s `globals.css` was a single ~9,300-line file accumulated over many chronological patches, not organized by page.
- Genuinely cross-component utility classes (`.btn`, `.eyebrow`, `.serif`) stay in one plain stylesheet, `src/components/public/shared.css`, scoped under a `.mm-public` wrapper class — see the note in that file for why these specifically can't be CSS Modules (compound selectors like `.tone .btn` need `.btn` to resolve to the _same_ global class everywhere it's referenced, not a per-file hash).
- Legacy design tokens/resets (`:root` custom properties, `body` background/cursor/font) live in `src/app/(public)/public-base.css`, rescoped to `body.mm-public-body` (toggled by `src/components/public/PublicScope.tsx` only while a public route is mounted) so they never affect artist/advertiser/admin pages sharing the same `<body>`.
- Before trusting any extraction like this, verify visually against the running source site — a static-text read of the CSS is not enough to catch effective-cascade issues (e.g. a stylesheet with two conflicting `:root`/`body` blocks where only the later one is actually in effect) or subtle DOM details (e.g. a `&nbsp;` where a plain space would silently collapse to zero width). See `docs/PROJECT_STATUS.md` for what has been migrated and verified so far.

## Where they live

```text
public/legacy/
├── pages/
├── css/
├── js/
├── images/
├── fonts/
├── assets/
└── plugins/
```

If the old site already has a working directory structure, it should be preserved under `public/legacy/` with minimal changes rather than reorganized.

## Isolation rules

- Legacy assets must never pollute modern application styling or JavaScript.
- Do not import the entire legacy stylesheet into the root application layout or `globals.css`.
- Do not globally load legacy JavaScript, and do not load jQuery (or any legacy-only dependency) globally into the modern app just because one legacy page needs it.

## CSS rules

Legacy CSS stays under `public/legacy/css/` and is scoped to legacy pages only. It is never merged into the modern Tailwind design system.

## JavaScript rules

Legacy JS stays under `public/legacy/js/` (and `public/legacy/plugins/` for third-party legacy scripts) and is only loaded by legacy pages.

## Asset rules

Legacy images/fonts/assets stay under `public/legacy/`. Do not move individual legacy files into `public/modern/` until the page that uses them is actually migrated — this keeps migration progress measurable.

## Route mapping rules

Legacy pages may initially be served directly, e.g. `/legacy/index.html`, and later mapped to clean public routes (e.g. `/`, `/about`, `/contact`) without exposing `/legacy` to users. Do not implement complex rewrite rules during bootstrap unless real legacy pages are being integrated at the same time. Every route mapping must be documented in [`docs/LEGACY_MIGRATION_TRACKER.md`](LEGACY_MIGRATION_TRACKER.md).

## Migration stages

```text
LEGACY
   |
NEXT.JS SHELL
   |
REACT + TYPESCRIPT
   |
TAILWIND
   |
SHADCN STANDARDIZATION
   |
MODERN / COMPLETE
```

Do not combine all stages into one risky rewrite unless specifically approved.

## Completion criteria

A page is "modern/complete" only when it has moved through every stage above, is built with Next.js + TypeScript + Tailwind + shadcn, and has been tested.

## Safe deletion policy

> Never delete a working legacy page or asset until the replacement page is verified and its dependencies are confirmed unused.
