# Frontend Authentication Scope

This document covers **frontend auth responsibilities only**. It does not document or assume any backend implementation.

> The backend team defines token/session persistence and security implementation.

## Frontend responsibilities

- Login UI
- Signup UI
- Logout UX
- Forgot-password UI
- Reset-password UI
- Email-verification UI
- Current-user state (consumed via the frontend auth service/adapter, not implemented against a specific backend yet)
- Frontend route-access UX (redirect unauthenticated users away from protected routes)
- Unauthorized handling (401-equivalent UX)
- Forbidden handling (403-equivalent UX)
- API authentication integration through a dedicated frontend auth service/adapter — components never call backend auth endpoints directly

## Routes

| Route                     | Purpose                                    |
| ------------------------- | ------------------------------------------ |
| `/auth/artist/login`      | Artist login                               |
| `/auth/artist/signup`     | Artist signup                              |
| `/auth/advertiser/login`  | Advertiser login                           |
| `/auth/advertiser/signup` | Advertiser signup                          |
| `/admin/login`            | Admin login (no public admin signup route) |
| `/auth/forgot-password`   | Forgot password                            |
| `/auth/reset-password`    | Reset password                             |
| `/auth/verify-email`      | Verify email                               |

## Current-user contract concept

The frontend will consume a "current user" concept (identity + role + permissions) through `src/services/auth/`. The exact shape of this contract is **TBD** until the backend team defines it — it must not be invented during bootstrap.

## API abstraction boundary

Components and features must never call backend auth endpoints directly. All auth requests go through `src/services/auth/`, which itself uses the shared API client in `src/services/api/`. See [`docs/API_INTEGRATION.md`](API_INTEGRATION.md).

## Explicitly out of scope here

- Credential verification
- JWT/session implementation
- Refresh-token implementation
- Persistence
- Backend route authorization
- Backend permissions
- Security policy
