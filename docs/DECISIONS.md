# Architectural Decision Log

Lightweight decision log. Do not create speculative decisions for requirements not yet discussed.

---

**DEC-001: Use Next.js App Router**

- Date: 2026-09-20
- Decision: Use Next.js with the App Router (not Pages Router).
- Reason: Approved stack; supports the route-group architecture needed for isolated Artist/Advertiser/Admin dashboards.
- Status: Accepted
- Consequence: All routing uses `src/app` route groups; no `pages/` directory.

**DEC-002: Use TypeScript**

- Date: 2026-09-20
- Decision: Use TypeScript in strict mode for all frontend code.
- Reason: Approved stack; type safety across a multi-dashboard app.
- Status: Accepted
- Consequence: No `any` as a default escape hatch; domain types added once backend contracts are known.

**DEC-003: Use Tailwind CSS**

- Date: 2026-09-20
- Decision: Use Tailwind CSS for all new modern styling.
- Reason: Approved stack; pairs with shadcn/ui.
- Status: Accepted
- Consequence: No large standalone CSS systems for modern pages; legacy CSS stays isolated.

**DEC-004: Use shadcn/ui**

- Date: 2026-09-20
- Decision: Use shadcn/ui as the component foundation for modern pages.
- Reason: Approved stack; avoids a heavier component library like Material UI.
- Status: Accepted
- Consequence: New UI primitives are added via the shadcn CLI into `src/components/ui/`.

**DEC-005: Use pnpm**

- Date: 2026-09-20
- Decision: Use pnpm as the single package manager.
- Reason: Approved stack; avoids mixed lockfiles.
- Status: Accepted
- Consequence: Only `pnpm-lock.yaml` is committed; npm/yarn/bun lockfiles are not generated.

**DEC-006: Keep backend/database outside frontend scope**

- Date: 2026-09-20
- Decision: The frontend repository never contains database packages, schemas, or backend framework code.
- Reason: A separate backend team owns data and business logic; the frontend must remain independent of their implementation choice.
- Status: Accepted
- Consequence: No MongoDB/Prisma/Mongoose packages; API contracts are integrated, not invented.

**DEC-007: Isolate legacy code under public/legacy**

- Date: 2026-09-20
- Decision: All existing HTML/CSS/JS pages from the client's current site live under `public/legacy/`, isolated from modern styling/JS.
- Reason: Allows incremental migration without risking the working legacy site.
- Status: Accepted
- Consequence: See `docs/LEGACY_MIGRATION.md` for isolation rules.

**DEC-008: Use feature-based frontend organization**

- Date: 2026-09-20
- Decision: Organize business logic under `src/features/<domain>/` rather than one global `components` directory.
- Reason: Keeps three dashboards and shared code maintainable as the app grows.
- Status: Accepted
- Consequence: `src/app` stays limited to routes/layouts/composition.

**DEC-009: Do not install state/query libraries until required**

- Date: 2026-09-20
- Decision: Zustand and TanStack Query are approved but not installed during bootstrap.
- Reason: Avoid unused dependencies and premature architecture; native `fetch` and React state cover bootstrap needs.
- Status: Accepted
- Consequence: These are added only when a real feature (e.g. global music player, complex caching) requires them, and logged as a new entry in `docs/DEPENDENCIES.md`.

**DEC-010: Migrate music_mandi-website pages with per-component CSS Modules, not one global stylesheet**

- Date: 2026-09-20
- Decision: Public pages migrated from `music_mandi-website` get a co-located `Component.module.css` per component. Genuinely cross-component utility classes (`.btn`, `.eyebrow`, `.serif`) live in one plain `shared.css` scoped under `.mm-public`, rather than as CSS Modules — compound selectors like `.tone .btn` need `.btn` to resolve to the same global class everywhere, which per-file CSS Module hashing breaks.
- Reason: The source `globals.css` (~9,300 lines) was organized chronologically by patch/hotfix session, not by page, and was the exact "really big CSS that's mostly unused per page" problem being solved. A naive line-range split would have duplicated or dropped rules.
- Status: Accepted
- Consequence: Legacy design tokens/resets from the source's `:root`/`body` rules live in `src/app/(public)/public-base.css`, rescoped to `body.mm-public-body` (toggled only while a public route is mounted via `PublicScope.tsx`) so they can't leak into artist/advertiser/admin pages sharing the same `<body>`. See `docs/LEGACY_MIGRATION.md`.

**DEC-011: CSS Modules scopes ID selectors too — every ID-based rule needs `:global()`**

- Date: 2026-09-21
- Decision: Any migrated CSS Module rule targeting a literal HTML `id` (e.g. `#cursor`, `#ring`) must be wrapped as `:global(#id)`.
- Reason: Discovered as a real bug (custom cursor invisible in production) — Next.js's CSS Modules processor (Lightning CSS, via Turbopack) scopes/hashes ID selectors the same way it scopes class selectors, unlike the older webpack `css-loader`. An un-wrapped `#cursor { ... }` in a `.module.css` file compiles to `#SiteChrome-module__xyz__cursor`, which never matches a literal `id="cursor"` set in JSX.
- Status: Accepted
- Consequence: When migrating a new page/component, grep its `.module.css` for `#` selectors before wiring it up, not just `.class` ones.

**DEC-012: A component's raw DOM class/id hooks (closest(), querySelector) must use literal, non-module markers**

- Date: 2026-09-21
- Decision: When a migrated component's JS reads DOM structure via `closest()`/`querySelector()` with a literal class/id string (not through the `styles` object), the target element must carry a matching **literal, non-CSS-Module** class (e.g. `cursor-hover-target`) or id, added specifically for that purpose.
- Reason: Discovered as a real bug — `SiteChrome`'s custom-cursor grow effect matched `.feature`/`.dashboard` via `closest('a,button,.feature,.dashboard')`, a plain DOM string check entirely outside the CSS Modules system. Once `DashboardMock`/`SystemsCarousel` were converted to CSS Modules, those literal class names stopped existing in the DOM, and the check silently stopped matching — cursor tracking kept working, but the "grow near interactive things" feedback broke with no error anywhere.
- Status: Accepted
- Consequence: Before converting a component to CSS Modules, grep the rest of the migrated tree (and the component itself) for `closest(`/`querySelector(` calls referencing its class names, and add a literal marker class/id if any are found.

**DEC-013: Promote a bare utility class to shared.css reactively, the moment a 2nd migrated page uses it**

- Date: 2026-09-21
- Decision: A bare (non-compound) class used by only one migrated page/component stays in that file's own CSS Module. The moment a second migrated page/component also uses it as a bare class, move it into `shared.css` (scoped under `.mm-public`) and update every consumer to reference the plain string instead of `styles[...]`.
- Reason: `route-kicker` and `page-shell` (home → tele-ads) and `brand-gradient` (tele-ads → about) all hit this exact pattern: left as CSS Modules, the same conceptual class gets a different hash per file, so it renders fine standing alone but silently fails to apply wherever a compound selector in another file's source CSS overrides it (e.g. `.rights .eyebrow`). Promoting eagerly for every plausible-sounding name would be speculative; promoting reactively, only once a real second usage appears, keeps `shared.css` exactly as large as it needs to be.
- Status: Accepted
- Consequence: When migrating a new page, check each of its bare utility classes against `shared.css` and every already-migrated page's own CSS Module before deciding where it belongs.

**DEC-014: Disable convenience third-party-API features rather than leave them half-wired**

- Date: 2026-09-21
- Decision: When a migrated component's only purpose for a feature is a _convenience_ on top of an otherwise-complete flow (e.g. `ArtistNameSearchField`'s Spotify autocomplete, whose own helper text already says "just type your name — that's fine too"), and that feature depends on a backend route not in this frontend's scope, remove the dependent code path entirely rather than leaving a dead `fetch()` or an unreachable branch.
- Reason: A half-wired feature (event handlers and state for a search that can never return results) is harder to reason about than either a fully working feature or its clean absence, and risks looking like a bug rather than a scope boundary.
- Status: Superseded for this specific feature by DEC-018 — the general principle (don't half-wire a convenience feature against a route that doesn't exist) still holds for anything not explicitly requested.
- Consequence: `ArtistNameSearchField` is a plain required text input with no dropdown; `SpotifySearchArtist`-shaped state (`onSelectArtist`, auto-filling the Spotify URL field) was removed from `ArtistSubmitForm` rather than kept as unused plumbing. Contrast with `LoginForm`/`ContactForm`/`ArtistSubmitForm`'s own submission, where the flow _is_ the point of the page — those keep the full flow and simulate the network call instead (DEC applies differently: simulate the core action, drop the optional enhancement).

**DEC-015: When the source has two alternate implementations, port only the one it actively uses**

- Date: 2026-09-21
- Decision: If a source component has a commented-out alternate (e.g. `CampaignBuilder.tsx` importing `SellerContactModal` with `SellerAccountModal` commented out alongside a note that it's "on hold until real advertiser auth/dashboard services exist"), port only the active import. Do not port the disabled alternate "for completeness."
- Reason: The source author already made this call for a documented reason (a missing backend dependency, matching DEC-006's frontend/backend boundary). Porting the disabled path too would mean maintaining dead code that isn't even reachable in the site we're copying from, and would invite it to silently diverge from a "real" decision no one has actually made yet.
- Status: Accepted
- Consequence: `SellerAccountModal` (password-based advertiser account creation) was not ported as part of the `/tele-ads/create` migration. If real advertiser auth ships later, revisit the source's own commented-out swap-back note rather than inventing a new design.

**DEC-016: A shared-class promotion isn't done until every existing consumer is re-checked, not just the new one**

- Date: 2026-09-21
- Decision: When promoting a bare class to `shared.css` (DEC-013), grep _every_ file that already uses that class name — not just the new migrated page that triggered the promotion — for a stale `styles["x"]` (CSS Module) reference that should now be the plain string.
- Reason: Found as a real, previously-unnoticed bug while extracting `flow-modal`/`flow-modal-card`/`modal-x` out of `SiteChrome.module.css` for the campaign builder's modals: `SiteChrome.tsx`'s role-selection modal's "Log in" span was still written as `styles["route-kicker"]`, left over from _before_ `route-kicker` was promoted to shared.css during the tele-ads pass. It had never broken visibly because the old CSS-Module-hashed rule for it was also never cleaned up — two latent bugs masking each other. Neither would show up just by testing the page that prompted the current promotion.
- Status: Accepted
- Consequence: A promotion's "done" checklist includes: move the rule to `shared.css`, update the triggering file(s), _and_ grep the rest of the already-migrated tree for the same class name before considering it finished.

**DEC-017: Interim, frontend-hosted SendGrid email integration for contact/artist-submit/campaign-submit — a bounded, explicit exception to DEC-006/ARCHITECTURE.md §1**

- Date: 2026-09-21
- Decision: While the real backend doesn't exist yet, `/contact`, `/artists/submit`, and `/tele-ads/create` POST to Next.js Route Handlers living in _this_ frontend repo (`src/app/api/integrations/{contact,artist-submit,campaign-submit}/route.ts`), which call SendGrid directly to (a) notify an internal inbox and (b) send the submitter a confirmation email. Ported near-verbatim from music_mandi-website's own already-working `/api/integrations/*` routes, which already used `@sendgrid/mail` exactly this way — not invented fresh.
- Reason: Explicitly requested by the user so the three forms are "usable like before" during the gap before the backend team's project exists. This is a real, scoped exception to DEC-006 and ARCHITECTURE.md §1 ("frontend never owns API implementation or business rules"), not silent scope-creep — no database, no auth, no persistence; each route is a stateless request → SendGrid call → response.
- Status: Accepted (temporary)
- Consequence: All config is server-only env vars (`SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL`, `CONTACT_TO_EMAIL`, `ARTIST_TO_EMAIL`, `ADS_TO_EMAIL` — see `.env.example`), never `NEXT_PUBLIC_*`. Each route checks its own env vars are set at request time and fails with a clear 500 rather than silently no-opping. `escapeHtml`/SendGrid setup is factored into `src/lib/email.ts` (the one legitimate dedup across 3 otherwise-independent routes — everything else stays route-specific, matching each form's own fields). **When the real backend ships these same endpoints**, delete the three route files and this exception; the frontend components' `fetch()` calls don't need to change if the real backend is reverse-proxied at the same paths, otherwise update each form's fetch URL. Do not extend this pattern to new forms without a fresh, explicit ask — it is not a general "frontend may add backend routes" precedent.

**DEC-018: Restore the Spotify artist-name autocomplete against an interim, frontend-hosted route — supersedes DEC-014 for this one feature**

- Date: 2026-09-21
- Decision: `ArtistNameSearchField`'s Spotify type-ahead (disabled under DEC-014) is restored, backed by `src/app/api/integrations/spotify-search/route.ts` — another interim frontend-hosted route (same shape of exception as DEC-017), ported near-verbatim from music_mandi-website's own working implementation. It uses Spotify's Client Credentials OAuth flow (server-to-server, no end-user login), with the access token cached in a module-level variable for the life of the warm server instance.
- Reason: Explicitly requested by the user ("we have integrated search artist from spotify i want that into new project also"). DEC-014's reasoning (don't half-wire a convenience feature against a nonexistent route) no longer applies now that the route exists and is real — this isn't a reversal of the _principle_, just a consequence of the route now being real.
- Status: Accepted (temporary, same lifecycle as DEC-017)
- Consequence: New server-only env vars `SPOTIFY_CLIENT_ID`/`SPOTIFY_CLIENT_SECRET` (see `.env.example`) — free to create at the Spotify Developer Dashboard, no paid tier needed for Client Credentials search. `ArtistNameSearchField` now takes a required `onSelectArtist` prop again; `ArtistSubmitForm` wires it to auto-fill the Spotify URL field, matching source exactly. A failed/unconfigured search fails silently into an empty dropdown (per the source's own design — see the component's inline comment) rather than surfacing an error, since typing the artist name manually is always a valid fallback. **When the real backend ships this endpoint**, delete `src/app/api/integrations/spotify-search/route.ts` and this exception.

**DEC-019: Migrate video-heavy components from CSS Modules to Tailwind utility classes, one at a time, starting with HeroCarousel**

- Date: 2026-09-21
- Decision: Explicitly requested by the user, starting with `HeroCarousel` (the home page's video hero/carousel): replace its CSS Module (`HeroCarousel.module.css`, ~320 lines with cascade-order duplicate blocks and several `!important` overrides) with Tailwind utility classes directly on JSX elements, using arbitrary-value syntax (`bg-[#070a12]`, `max-[620px]:...`, `[mask-image:...]`) for anything without a clean named utility, and referencing the legacy `--mm-*` design tokens via `var(--mm-brand1)` etc. rather than hardcoding colors. The CSS Module file is deleted once nothing references it.
- Reason: User request, explicitly framed as a performance investigation — "previous website lag them... I think those are issues from videos." Converting hand-authored cascading CSS (with source-order-dependent overrides across `.hero`/`.hero-carousel`/`.hero-slide`/`.hero-slide.video-hero` and 2-3 breakpoints each) to Tailwind is a **pure authoring-syntax change with no performance effect on its own** — Tailwind classes compile to the same CSS. The actual performance win came from two real bugs found and fixed in the same pass (see below), which the Tailwind rewrite surfaced by forcing a full re-read of the component's logic.
- Status: Accepted
- Consequence:
  1. **Real bug fixed**: slide 1's `<video>` (`TamashaMusicHeader.mp4`, ~2.3MB) had a hardcoded `autoPlay` + `preload="auto"` and was never registered in `videoRefs`, so the play/pause `useEffect` could never pause it — it played continuously in the background from page load onward, regardless of which slide was actually visible, unlike slides 0/2 which correctly deferred (`preload="metadata"`) and paused when inactive. This existed in the **source** (`music_mandi-website`) too, not introduced during migration. Fixed by giving slide 1 the same ref + conditional `preload` treatment as slides 0/2.
  2. **Real bug fixed**: `AUTOPLAY_MS = 6500000` (~108 minutes) — almost certainly a typo (extra `000`) for `6500` (6.5s) — meant the carousel never auto-advanced in practice. Also present in source. Fixed to `6500`; flagged explicitly to the user in case the de-facto-static behavior was actually preferred.
  3. Cascade-resolution requires care: several of the legacy `@media` blocks turned out to be **dead code** in the merged `.hero`+`.hero-carousel` cascade (a later, unconditional rule silently overrode them) — confirmed by comparing computed styles before/after at 3 breakpoints (desktop, ~800px, 375px mobile) rather than trusting a visual read of the source CSS alone. One live breakpoint override (`min-height: 720px` at ≤620px) was missed on the first pass and only caught by this same computed-style diffing — **future component conversions in this series must diff computed styles at each breakpoint against a pre-change baseline, not just eyeball a screenshot**, since dead/overridden rules in the legacy CSS are easy to misjudge as live.
  4. `TeleAddCalling.mp4` (another always-autoplaying video, same bug pattern) is used directly in `src/app/(public)/page.tsx`, outside HeroCarousel — flagged for a likely follow-up, not fixed in this pass (out of the requested scope).

**DEC-020: Convert SiteChrome from CSS Modules to real (non-arbitrary) Tailwind classes, split into SplashScreen/AnnouncementBar/Nav/CustomCursor**

- Date: 2026-09-22
- Decision: `SiteChrome.tsx`/`SiteChrome.module.css` (loader, announcement bar, nav, mobile menu, login-role modal, custom cursor all in one file) are replaced by four components — `SplashScreen.tsx`, `AnnouncementBar.tsx`, `Nav.tsx` (nav + mobile menu + login modal), `CustomCursor.tsx` — each mounted independently in `src/app/(public)/layout.tsx`. Unlike DEC-019's HeroCarousel conversion, this one explicitly avoids arbitrary-value syntax (`w-[309px]`, `bg-[#070a12]`, `max-[620px]:...`) per user request ("I want real tailwind classes, not brackets"). Every legacy pixel value, color, breakpoint, easing curve, and compound transition that isn't already a native Tailwind utility is instead registered as a named token or `@utility` class in a new file, `src/components/public/PublicDesignTokens.theme.css` (imported from `globals.css`), using Tailwind v4's own `@theme`/`@utility` extension mechanisms — e.g. `--color-mm-brand-1`, `--spacing-mm-chrome-top`, `--breakpoint-mm-md`, `grid-cols-mm-nav`, `transition-mm-nav`. Values that already land on Tailwind's default scale (e.g. 14px → `py-3.5`) are used directly instead of being re-registered.
- Reason: Explicit user requests, in order: (1) convert SiteChrome's CSS to genuine Tailwind classes, no bracket arbitrary values; (2) split the monolithic component into one simple component per visual phase (splash, banner, nav+menu+modal, cursor), each wired up directly in the layout, "not that typical" do-everything component.
- Status: Accepted
- Consequence:
  1. **Two real bugs found and fixed while building the theme file, both confirmed via computed-style inspection in the browser, not a visual read of the CSS** — the standard this codebase already holds itself to (DEC-019 consequence 3):
     - `@theme` (non-`inline`) mirrors every key to a `:root`-level custom property and resolves that key's own `var(--mm-*)` reference *there*. But `--mm-*` (ink/paper/brand/pad/ease) are defined on `body.mm-public-body`, never at `:root` (see `public-base.css`), so the resolution permanently fails and every descendant inherits the already-broken value — `bg-mm-ink/74` computed to fully transparent, the announcement's 3-stop brand gradient computed to three transparent stops. Fixed by declaring `PublicDesignTokens.theme.css`'s tokens under `@theme inline` instead, which substitutes each value directly into the utility classes that use it (resolved where the class is actually applied, always under `body.mm-public-body`) rather than through the broken `:root` indirection.
     - `--z-*` is **not** an extensible Tailwind v4 theme namespace (unlike `--color-*`/`--spacing-*`/`--text-*`/etc.) — a `--z-mm-*` block inside `@theme` silently generated no utility classes at all (confirmed: `.z-mm-nav` was absent from the compiled stylesheet, computed `z-index` was `auto` everywhere). Fixed by defining z-index as plain `@utility z-mm-nav { z-index: 850; }`-style rules instead.
  2. **A third real, pre-existing bug surfaced and was corrected**: `shared.css`'s ambient `.mm-public a, .mm-public button, .mm-public input { font: inherit; color: inherit; }` is a plain, unlayered rule, so per CSS cascade-layer rules it always wins over a same-property Tailwind utility (which lives in a lower-priority layer) regardless of specificity — it silently resets font-size/weight/line-height back to inherited on every anchor/button that isn't also carrying a higher-specificity unlayered class like `.btn`. This broke the mobile menu's link/login text sizing (`text-mm-mobile-link` computed to the browser default 16px instead of `12vw`, confirmed via `getComputedStyle`), the desktop nav links, the hamburger icon size, and the announcement's close button and "Watch →" link. Fixed by adding Tailwind's `!` important modifier (canonical trailing form, e.g. `text-mm-9!`) to exactly the font-size/weight/line-height utilities on elements where shared.css's ambient rule would otherwise win — same category of issue as the pre-existing `.btn`/`.btn.light` override on the nav's Submit Music button (which already needed the same treatment).
  3. AnnouncementBar and Nav no longer share any JS state for the "nav snaps to top when the announcement is dismissed" behavior — Nav reacts via a plain CSS sibling-selector rule (`.mm-announcement.mm-hide ~ .mm-nav { top: 0; }`) keyed off literal marker classes, requiring AnnouncementBar to render before Nav in `layout.tsx` (documented inline there). A relational selector has no Tailwind equivalent, arbitrary or otherwise, so this stays plain CSS rather than becoming shared state — consistent with keeping each split-out component simple per the second user request above.
  4. **A fourth real, reproducible rendering bug** was found in `SplashScreen`'s entrance effects (the "MUSIC MANDI" letter reveal and the progress-bar fill), both ported as CSS `@keyframes` animations with `animation-fill-mode: forwards` ending at `transform: none`, starting from a Tailwind transform utility (`translate-y-mm-rise rotate-6`, `-translate-x-full`). The Web Animations API and `getComputedStyle` both confirmed these animations reached `playState: "finished"` with a true identity transform — but the browser kept *painting* each element at its pre-animation offset (letters ~30-40px below their box, fully clipped by the row's `overflow-hidden`; the progress fill sitting 150px left of the track, i.e. still at its starting `-100%`). Isolated by toggling one class at a time on a live page (confirmed via `getBoundingClientRect`): removing only the `animate-*` class fixed the position, and rewriting the keyframe with explicit `from`/`to` values (instead of relying on an implicit 0% state) made no difference — the bug is specific to a CSS-animation `fill: forwards` hold following a large-magnitude starting transform, not to keyframe syntax. Fixed by replacing both with a mount-triggered CSS **transition** instead (a `risen` state flipped via `requestAnimationFrame` in a `useEffect`, swapping between the starting-transform classes and `translate-y-0`/`translate-x-0`) — an ordinary style-to-style interpolation, which doesn't hit this bug since there's no fill-mode hold involved. `--animate-mm-rise`/`--animate-mm-load` and their `@keyframes` were removed from `PublicDesignTokens.theme.css` as a result (no remaining consumers).
  5. The desktop nav's dead `nav-login-btn` CSS (styling for a `#loginOpen` button) was not ported — the user's own concurrent edit to `SiteChrome.tsx` (uncommitted at the start of this task) had already deleted the commented-out JSX for that button, confirming it's an intentionally-disabled control, not a bug to fix. Consistently, the mobile menu's `#mobileLogin` button was also commented out (by the user, concurrently, mid-task) and then, on the user's confirmation, removed entirely along with `openRoleModal`/`roleModalOpen` state and the `#roleModal` role-selection modal JSX — with login disabled on both entry points, the modal had no remaining trigger. Login has no UI-only demo entry point anywhere in the nav for now; revisit `/login`/`/tele-ads/login` wiring when real auth is scoped.
  6. Verified in-browser at desktop (1440px), tablet (~930px, 1180px/950px breakpoints), and mobile (375px/390px) widths: splash screen (letters and progress bar both animate in and land fully visible/aligned, confirmed via `getBoundingClientRect`), announcement bar (including dismiss → nav snap-to-top), full desktop nav with the gradient Submit Music button, and hamburger → full-screen mobile menu (links, Submit Music). No console errors. `pnpm lint`, `pnpm build` (typecheck), `pnpm test`, and `pnpm test:e2e` all pass.

**DEC-021: Re-convert HeroCarousel to eliminate arbitrary-value syntax; rename the shared theme file from `PublicChrome.theme.css` to `PublicDesignTokens.theme.css`**

- Date: 2026-09-22
- Decision: `HeroCarousel.tsx` (converted to Tailwind under DEC-019, which explicitly allowed arbitrary-value syntax) is re-converted to use only real Tailwind classes — no `bg-[...]`, `max-[620px]:...`, `text-[...]`, or `bg-(--css-var)` shorthand — following the same standard set for SiteChrome's split in DEC-020. New one-off values (the decorative background grid, the video-readability shade gradients, the hero heading's clamp/tracking/leading/text-shadow, the `4%` slide-shift translate, the copy column's `min()`-based max-widths, the prev/next button color, the inactive-dot color/the active-dot pill radius) are registered as named `@theme`/`@utility` entries. Values already on Tailwind's default dynamic scale (`pt-32.5`, `h-9.5`, `gap-1.75`, etc. — confirmed via the compiled stylesheet to generate correct `calc(var(--spacing) * N)` rules for arbitrary decimals, not just quarter-step presets) are left as-is. Breakpoints/colors HeroCarousel shares with the chrome components (`--breakpoint-mm-sm`/`-md`, `--color-mm-ink`, `--color-mm-brand-1`/`-2`) are reused rather than re-registered. The file housing all these tokens, `src/components/public/PublicChrome.theme.css`, is renamed to `src/components/public/PublicDesignTokens.theme.css` (with a matching `globals.css` import update) since it now serves more than the chrome components — a second component (HeroCarousel) needing the same breakpoint/color tokens makes "chrome" an inaccurate name going forward, matching this codebase's own DEC-013 precedent of promoting/relocating shared values reactively rather than speculatively.
- Reason: Explicit user request to apply the same "real Tailwind classes, not brackets" standard to HeroCarousel next, extending the direction set for SiteChrome in DEC-020.
- Status: Accepted
- Consequence:
  1. HeroCarousel's logic (autoplay timer, video play/pause on active-slide change, prev/next/dot navigation) is untouched; this is a class-authoring pass. Verified pixel-equivalent to the pre-change render at desktop (1440px) and mobile (390px) for all 3 slides (video shade, gradient heading text, dot/arrow controls).
  2. **A real, user-reported bug was fixed while doing this pass**: slide 0's mobile heading used `50vw` (`--text-mm-hero-mobile-lg`) versus slides 1/2's `15vw` (`--text-mm-hero-mobile`) for the identical role — over 3x larger, and confirmed broken (text overflowing past both screen edges, letters cut off) rather than an intentional design choice. Initially ported faithfully as-is (matching this codebase's usual "don't fix what wasn't asked" discipline), but the user directly reported it visually breaking on mobile, which settles it as a genuine pre-existing bug rather than a deliberate characteristic — same category as DEC-019's `AUTOPLAY_MS` typo. Fixed by pointing slide 0 at the same `--text-mm-hero-mobile` (`15vw`) token slides 1/2 already use; `--text-mm-hero-mobile-lg` removed from the theme file (no remaining consumers). Verified in-browser: slide 0's mobile heading now renders at the same well-fitting size as the other two slides.
  3. One coincidental value collision was raised by Tailwind's IDE tooling but not resolved the way suggested: it flagged `mt-6.5`/`h-9.5` as equal to already-registered chrome tokens (`mt-mm-lg` = 26px, `h-mm-chrome-top-sm` = 38px) and offered to rewrite them. The reasoning to decline stands — reusing a token whose *name* describes an unrelated concept (a loader logo's margin, an announcement bar's mobile height) for a hero CTA's margin or a carousel button's size reads as a copy-paste mistake to a future maintainer, even though the numbers match — but the editor's format-on-save applied the rewrite anyway for `mt-6.5` → `mt-mm-lg` before this could be enforced; left as the editor set it, since it's CSS-identical either way and not worth fighting the tooling over on every save.
  4. `pnpm lint`, `pnpm build` (typecheck), `pnpm test`, and `pnpm test:e2e` all pass.

**DEC-022: Fix the Tamasha banner image leaving a black gap in its frame on narrow/short aspect ratios**

- Date: 2026-09-22
- Decision: In `src/app/(public)/page.module.css`, `.tm-banner-photo-frame .tm-banner-image` (the effective, latest-cascade rule for the `<Image>` in the home page's `#tamasha-launch` section) is changed from a normal-flow `display:block; width:100%; height:auto` element to `position:absolute; inset:0; width:100%; height:100%; aspect-ratio:auto`, filling its frame completely instead of sizing itself independently.
- Reason: User-reported bug — the image showed a solid black empty area beneath it on mobile. Root cause: `.tm-banner-frame` carries its own `min-height` (`min(72vh, 760px)` desktop, a flat `360px` at ≤620px — two separate, cascade-order-resolved rules, matching this codebase's recurring "chronological CSS patches" pattern per DEC-010) completely independent of the image. The image itself kept `height:auto` with an `aspect-ratio:16/9` from an earlier-in-file `.tm-banner-image` rule that was never overridden, so its rendered height is purely `width × 9/16` — on a 390px-wide phone that's ~190px, versus the frame's forced 360px minimum, leaving ~170px of the frame's own dark background (`#0b0b0b`) exposed below the image. The frame was already `position:relative; overflow:hidden` — a cropping-viewport pattern with no viewport-filling child — so the fix makes the image (which already had `object-fit:cover` from that same earlier rule, also never overridden) absolutely fill it instead.
- Status: Accepted
- Consequence: Verified in-browser at mobile (390px, where the gap was worst) and desktop (1440px) — the image now fills the frame edge-to-edge at both the mobile fixed 360px and desktop `min(72vh,760px)` heights, cropped via `object-fit:cover`, no visible background gap. `pnpm lint`, `pnpm build`, `pnpm test`, and `pnpm test:e2e` all pass. Scoped narrowly to this one image/frame pair, per the user's ask — no broader pass over `page.module.css`'s other cascade-duplicate blocks (e.g. `.tm-launch h2`/`.product-head p` etc. have the same two-pass-CSS pattern) was requested or made.

**DEC-023: SplashScreen — pack the logo and wordmark as one centered block instead of letting their grid rows stretch apart**

- Date: 2026-09-22
- Decision: `.loader-mark` (the `grid place-items-center` wrapper around the logo `<Image>` and the "MUSIC MANDI" wordmark row in `SplashScreen.tsx`) gains `content-center` (`align-content: center`) alongside its existing `place-items-center`, and the logo's old `mb-mm-lg` (26px) bottom margin is replaced with a `gap-4` on the wrapper.
- Reason: User request — wanted the wordmark to sit close beneath the logo with a small, standard gap. The margin swap alone (`mb-mm-lg` → `gap-4`) measured as a 367px gap in-browser, not 16px: `.loader-mark` sits in the loader's own `1fr` grid row (`grid-rows-mm-loader`) and stretches to nearly the full loader height; with only `place-items-center` and no `align-content` set, its two implicit `auto` grid rows (logo, wordmark) each individually stretch to fill about half of that height (`align-content: normal` resolves to `stretch`-like behavior for `auto`-sized tracks when there's leftover space in a grid) — centering the logo and the text far apart in their own oversized tracks rather than packing them together. `content-center` packs both rows at their natural content size first, then centers that compact pair as a single unit within the tall space.
- Status: Accepted
- Consequence: Verified via `getBoundingClientRect` that the gap between the logo's bottom edge and the wordmark's top edge is exactly 16px (matching `gap-4`), and confirmed visually at mobile (390px) and desktop (1440px) — logo and wordmark now read as one grouped, centered block. `pnpm lint`, `pnpm build`, `pnpm test`, and `pnpm test:e2e` all pass.
