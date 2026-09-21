# UI Design System

Final branding is not known yet. This document establishes the structure; unknown values are marked `TBD` rather than invented.

## Design tokens

TBD — to be defined as CSS variables / Tailwind theme tokens once brand direction is confirmed.

## Typography

TBD — font family, scale, and weights.

## Colors

TBD — no brand colors are invented during bootstrap. Use Tailwind's neutral defaults and shadcn's default theme until real tokens are supplied.

## Spacing

Use Tailwind's default spacing scale unless/until a custom scale is approved.

## Border radius

Use shadcn/ui defaults until a brand-specific radius is approved.

## Shadows

Use shadcn/ui defaults until a brand-specific elevation system is approved.

## Icon system

Lucide React is the single approved icon library. Do not add a second icon library.

## shadcn usage

shadcn/ui is the approved component foundation for all new modern pages. See [`docs/FRONTEND_STANDARDS.md`](FRONTEND_STANDARDS.md#shadcn-conventions).

## Component reuse rules

Prefer an existing `src/components/ui/` or `src/components/shared/` component over creating a new one. Extend, don't duplicate.

## Loading UI

Skeletons for content loading; spinners for action progress.

## Empty state

Reusable `EmptyState` component (planned in `src/components/shared/`, not yet implemented).

## Error state

Reusable `ErrorState` component (planned in `src/components/shared/`, not yet implemented).

## Responsive behavior

Mobile-first Tailwind breakpoints; every new modern page must work at desktop, laptop, tablet, and mobile widths.

## Accessibility

See [`docs/FRONTEND_STANDARDS.md`](FRONTEND_STANDARDS.md#accessibility-expectations).
