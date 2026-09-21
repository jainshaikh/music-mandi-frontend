# Project Status

```text
Project Stage: Frontend Bootstrap

Implemented:
- Next.js App Router + TypeScript + Tailwind CSS project foundation
- shadcn/ui initialized
- Core libraries installed (React Hook Form, Zod, @hookform/resolvers,
  Lucide React, Sonner, date-fns)
- Testing tooling configured (Vitest, React Testing Library, Playwright)
- Route-group skeleton for public/auth/artist/advertiser/admin
- Feature/component/service folder skeleton
- public/legacy and public/modern areas prepared
- Reference documentation set (this file plus ARCHITECTURE.md, AGENTS.md,
  CLAUDE.md, and everything under docs/)
- Home page (`/`) migrated from music_mandi-website: HeroCarousel,
  PartnerRunway, DashboardMock, SystemsCarousel, DspMarquee, FaqAccordion,
  Reveal, plus site chrome (SiteChrome nav/loader/mobile-menu, Footer, Toast,
  SmoothScroll). CSS split into co-located CSS Modules per component instead
  of one global stylesheet — see docs/LEGACY_MIGRATION.md. Forms are UI-only
  (no backend wiring) by design for this pass. (HeroCarousel has since moved
  to Tailwind utility classes — see DEC-019 below.)
- `/tele-ads` and `/tele-ads/login` migrated from music_mandi-website:
  TeleAdsContext/TeleHeroActions/SampleAdInline/TargetingSection (interactive
  audience-estimate demo, verified working end to end), PageShell, LoginForm
  (UI-only demo auth — the "successful login" redirect points at
  `/tele-ads/dashboard`, which isn't migrated yet and will 404 until it is).
  `page-shell` and `route-kicker` were promoted to shared.css, since they're
  now used by 2+ migrated pages, not just one.
- `/about` migrated from music_mandi-website: RouteArt (spinning-disc hero
  decoration). `brand-gradient` promoted to shared.css for the same reason
  (used by both about and tele-ads).
- `/contact` migrated from music_mandi-website: ContactForm. Submission now
  POSTs to `/api/integrations/contact`, an interim frontend-hosted SendGrid
  route (see DEC-017) — real email, not simulated.
- `/artists/submit` migrated from music_mandi-website: MarketingHero, Field,
  MultiSelectField, ArtistNameSearchField, ConfirmCard, ArtistSubmitForm.
  Submission now POSTs to `/api/integrations/artist-submit` (interim
  SendGrid route, DEC-017), including any uploaded audio as an email
  attachment. The Spotify artist-name autocomplete is now wired up too,
  against `/api/integrations/spotify-search` (interim route, DEC-018) —
  selecting a result auto-fills the Spotify URL field; typing without
  selecting is still a valid submission (source's own documented fallback,
  "Can't find yourself? Just type your name"). Full interactive flow
  (multi-select, validation, submit → success) verified working.
  A large round of shared-class promotion happened here: `route-hero2`,
  `route-actions`, `content-section`, `page-wrap`, `field`/`full`/`helper`/
  `error`/`invalid`, and `form-card` all moved into shared.css, since
  MarketingHero/Field/PageShell are now used by 3+ pages each — updated
  about/contact/tele-ads/LoginForm accordingly (see DEC-013).
- `/tele-ads/create` migrated from music_mandi-website: CampaignBuilder (the
  5-step campaign wizard — setup, budget, audience, creative, review),
  DatePickerField, CityPickerField, AdPreviewModal, SellerContactModal,
  CampaignConfirmation, plus `lib/pakistanCities.ts`. Outside the original
  13-page scope but explicitly requested and confirmed. `SellerAccountModal`
  (password-based account creation) was intentionally not ported — matches
  the source's own active code path, which already uses SellerContactModal
  instead pending real advertiser auth. `onAccountSubmit` now POSTs to
  `/api/integrations/campaign-submit` (interim SendGrid route, DEC-017),
  including the audio ad as an email attachment; the local-only
  `writeAdvertiser`/`writeCampaign`/localStorage effects still run on
  success. `flow-modal`/
  `flow-modal-card`/`modal-x` (previously SiteChrome-only) and the new
  `seller-field`/`seller-review-card` were promoted to shared.css, since
  they're now each used by 2+ files. Full 5-step wizard flow verified
  working end to end (date picker, city picker, budget slider/mode toggle,
  dual age range, audio-upload placeholder, live estimate math, ad preview
  modal, contact modal, submit → confirmation → create-another).
- Interim SendGrid email integration added for the three forms above
  (`/contact`, `/artists/submit`, `/tele-ads/create`) — see DEC-017. Three
  Next.js Route Handlers under `src/app/api/integrations/` (`contact`,
  `artist-submit`, `campaign-submit`), ported near-verbatim from
  music_mandi-website's own working SendGrid routes: each validates its
  required fields, sends an internal notification email (with file
  attachments where relevant) to a per-form recipient env var
  (`CONTACT_TO_EMAIL`/`ARTIST_TO_EMAIL`/`ADS_TO_EMAIL`), and best-effort
  sends the submitter a branded HTML confirmation email. Config is
  server-only env vars (`SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL`, plus the
  three `*_TO_EMAIL` vars — see `.env.example`); `.env.local` is created
  locally but intentionally left blank pending the user's own SendGrid
  credentials. Verified end to end: each route is reachable, validates
  correctly, and fails clearly (500 + toast) when SendGrid isn't configured
  — full send-a-real-email path still needs to be checked once real
  credentials are added.
- Interim Spotify artist-name autocomplete restored on `/artists/submit`
  (see DEC-018, supersedes DEC-014 for this feature) —
  `src/app/api/integrations/spotify-search/route.ts`, ported near-verbatim
  from music_mandi-website's own working route (Client Credentials OAuth
  flow, in-memory token cache). `ArtistNameSearchField` debounces the query,
  shows a type-ahead dropdown with artist thumbnail/genres, and auto-fills
  the Spotify URL field on selection. Config is server-only
  `SPOTIFY_CLIENT_ID`/`SPOTIFY_CLIENT_SECRET` (see `.env.example`);
  `.env.local` left blank pending the user's own Spotify app credentials.
- `HeroCarousel` (home page hero/video carousel) converted from a CSS
  Module to Tailwind utility classes (see DEC-019, first of a planned
  series of video-heavy components). `HeroCarousel.module.css` deleted.
  Two real, source-inherited performance bugs found and fixed along the
  way: slide 1's video (`TamashaMusicHeader.mp4`) was hardcoded
  `autoPlay`/`preload="auto"` and never registered for pause control, so
  it played continuously in the background regardless of visibility —
  now behaves like slides 0/2 (pause when inactive, only eager-load when
  active); `AUTOPLAY_MS` was `6500000` (~108 min, effectively never
  advancing) instead of `6500` (6.5s). `TeleAddCalling.mp4`
  (`src/app/(public)/page.tsx`, outside HeroCarousel) has the same
  always-autoplaying pattern — flagged as a likely next target, not
  fixed in this pass.

In Progress:
- Migrating the remaining public pages from music_mandi-website (labels,
  tamasha (+pitch), 4 legal pages, login) — not started yet
- More video-heavy components to convert from CSS Modules to Tailwind
  (see DEC-019) — HeroCarousel done; others not yet identified/started

Backend:
- Owned by backend team
- Database implementation intentionally excluded from frontend scope
- Two explicit, temporary exceptions: the SendGrid email routes (DEC-017)
  and the Spotify search route (DEC-018) described above. No
  database/auth/persistence involved in either — remove once the real
  backend ships these four endpoints

Legacy:
- No raw legacy HTML/CSS/JS pages have been imported yet; public/legacy/ is
  prepared and empty aside from placeholders
- A second, different migration is underway: music_mandi-website (an
  existing Next.js/React/TypeScript site, not raw HTML) — home, tele-ads
  (+login, +create), about, contact, and artists/submit are migrated; 7 more
  public pages remain. See docs/LEGACY_MIGRATION.md.

Dashboards:
- Artist: planned (route skeleton only, no pages designed)
- Advertiser: planned (route skeleton only, no pages designed)
- Admin: planned (route skeleton only, no pages designed)
```

## Validation status

| Check                            | Status                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dev server starts                | ✅ Verified (`pnpm dev`, responded HTTP 200 on `/`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Production build succeeds        | ✅ Verified (`pnpm build`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| TypeScript succeeds              | ✅ Verified (`pnpm typecheck`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ESLint succeeds                  | ✅ Verified (`pnpm lint`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Unit/component tests pass        | ✅ Verified (`pnpm test` — Vitest + React Testing Library, 2/2 passing)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Playwright configured            | ✅ Config + smoke spec in place, chromium browser installed, `pnpm test:e2e` passing (1/1)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Git repository initialized       | ✅ `git init` run; no commits made yet                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Home page visual parity          | ✅ Verified against `music_mandi-website` running side-by-side (hero, loader, nav, footer, FAQ interactivity, DOM structure of every section)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| HeroCarousel Tailwind conversion | ✅ Verified computed styles (height/min-height/padding/align-items/font-size) at 3 breakpoints (desktop ~1280px, ~800px, mobile 375px) against a pre-change baseline — all match exactly after fixing one missed `min-height: 720px` override at ≤620px, caught by this same diffing. Slide switching (auto-advance, dots, prev/next), gradient text, video shade, and controls all verified visually and via computed style in-browser. No console errors. Confirmed via direct video-element inspection that slide 1's video no longer autoplays/eager-loads in the background when inactive (the bug fix from DEC-019).                                                                                                                                        |
| Tele-ads pages parity            | ✅ Verified in-browser: hero video, precision/targeting/FAQ/CTA sections render correctly, no console errors; targeting chip interactivity and cross-file FAQ border-radius override both confirmed working                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| About page parity                | ✅ Verified in-browser: hero + RouteArt disc, all content sections, `brand-gradient` shared-class promotion confirmed rendering correctly, no console errors                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Contact page parity              | ✅ Verified in-browser: all sections render, no console errors; form now POSTs to the real `/api/integrations/contact` SendGrid route instead of simulating success (DEC-017)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Artist submit page parity        | ✅ Verified in-browser: MarketingHero/RouteArt, all form fields, no console errors; multi-select genre toggle works; submit now POSTs to the real `/api/integrations/artist-submit` SendGrid route (DEC-017). Fixed a real bug caught here: `ArtistNameSearchField` was missing the base `.field` class, breaking its layout. No regressions on about/contact/tele-ads after the shared-class refactor (re-verified all four).                                                                                                                                                                                                                                                                                                                                    |
| Campaign builder parity          | ✅ Verified in-browser end to end: all 5 steps (setup, budget, audience, creative, review), stepper nav, date picker (open/select/close), city picker (search/select/badge), budget total↔daily toggle + slider, dual age range slider, SMS live-preview binding, ad preview modal (3 cards, correct SMS text), policy-gated submit button, contact modal. `onAccountSubmit` now POSTs to the real `/api/integrations/campaign-submit` SendGrid route (DEC-017); localStorage write (`submitted: true`) → confirmation screen → create-another reset still verified. Mobile viewport (375px) responsive collapse confirmed. No console errors.                                                                                                                    |
| SendGrid email integration       | ✅ Verified in-browser and via direct fetch: all 3 routes (`contact`, `artist-submit`, `campaign-submit`) are reachable, parse their payload (JSON/FormData) correctly, and fail cleanly with a scoped 500 + user-facing toast when their own `*_TO_EMAIL` env var isn't set — confirms per-form config separation works. `pnpm build` compiles all 3 as dynamic (ƒ) routes. **Not yet verified**: an actual SendGrid send succeeding, since `.env.local` intentionally has no real API key/addresses yet — pending the user adding their own credentials.                                                                                                                                                                                                        |
| Spotify autocomplete             | ✅ Verified in-browser: with no `SPOTIFY_CLIENT_ID`/`SECRET` set, a search fails silently into no dropdown (matches source's own fallback design), no console exceptions. With a mocked successful response, the dropdown renders both results with correct genre capitalization, and selecting one auto-fills the Spotify URL field with the artist's `externalUrl` and closes the dropdown — including a source-faithful quirk where the debounce effect re-fires on the post-selection value change and briefly reopens the dropdown ~300ms later (present in the original source too, not introduced here). `pnpm build` compiles the route as dynamic (ƒ). **Not yet verified**: a real Spotify API call succeeding, pending the user's own app credentials. |

Note: `next typegen` must be run once (or `pnpm dev`/`pnpm build` run once) before `pnpm typecheck` works standalone, since Next.js 15+ generates global route types (`LayoutProps`, etc.) into `.next/types` on first build/dev/typegen.

This file must be updated by every major task that changes architecture, routes, dependencies, or migration status.
