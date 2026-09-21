# API Integration Standards

## Flow

```text
UI Component
      |
Feature
      |
Frontend Service
      |
Shared API Client
      |
Backend API
```

- No raw API calls in UI components.
- Each domain gets a service wrapper under `src/services/<domain>/` (`api`, `auth`, `artists`, `advertisers`, `campaigns`, `music`, `analytics`). These directories exist as empty placeholders during bootstrap.

## Client

- Use native `fetch` first. Do not add Axios unless a real requirement justifies it (see [`docs/DEPENDENCIES.md`](DEPENDENCIES.md)).
- The shared API client (`src/services/api/`) will be responsible for:
  - Backend base URL (from environment config)
  - Request headers
  - Authentication headers/cookies
  - Standardized errors
  - Unauthorized handling
  - Timeout behavior where appropriate
  - Request cancellation where appropriate
  - Common response parsing

## Environment

- API base URL is environment-based (Development / Staging / Production). See [`ARCHITECTURE.md` §12](../ARCHITECTURE.md#12-environment-strategy).
- Backend secrets never live in the frontend. Never expose private keys with `NEXT_PUBLIC_*`.

## Rules

- Do not invent backend endpoints.
- Do not invent response payloads.
- Do not write imaginary endpoint payloads or fixtures — leave `src/services/*` empty until real API contracts are supplied.
- The backend team owns API behavior; the frontend owns how it is consumed, its loading/error/empty states, and its integration boundary.

## Exception: interim SendGrid routes

`src/app/api/integrations/{contact,artist-submit,campaign-submit}/route.ts` are a scoped, temporary exception to the rules above — see [docs/DECISIONS.md DEC-017](DECISIONS.md). They exist only because the real backend project doesn't exist yet and the user explicitly asked for these three forms to send real email in the meantime. They hold no database/auth/persistence, and are meant to be deleted once the real backend ships the same endpoints. Do not treat this as precedent for adding more frontend-hosted API routes without an equally explicit ask.
