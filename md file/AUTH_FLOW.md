# AUTH_FLOW.md — Promilaa

Default assumption (flag in `PRD.md` §8 as open question, confirm
before build): **guest checkout is allowed**; account creation is
optional but encouraged post-purchase.

---

## 1. Signup

1. User submits name, email, password (client + server validation:
   email format, password ≥ 8 chars).
2. Server hashes password (bcrypt/argon2 — see `SECURITY.md`), creates
   `User` with `role=CUSTOMER`.
3. Server issues access token (short-lived, e.g. 15 min) + refresh
   token (long-lived, e.g. 30 days, httpOnly cookie).
4. Optional: welcome email (out of scope for v1 unless email service
   is confirmed — flag if needed).

## 2. Login

1. Email + password submitted.
2. Server verifies hash, checks `isBlocked` (reject if true, generic
   message — do not reveal block reason to avoid enumeration).
3. Issue new access + refresh token pair.

## 3. Token Refresh

- Access token expiry triggers silent refresh via `/auth/refresh`
  using the httpOnly refresh token cookie.
- Refresh token rotation: each refresh issues a new refresh token and
  invalidates the old one (mitigates replay).

## 4. Logout

- Clears refresh token cookie, invalidates it server-side (blacklist
  or DB-tracked token record).

## 5. Forgot / Reset Password

1. User submits email → server issues time-limited reset token
   (e.g. 1 hour), emailed as a link (email delivery mechanism to be
   confirmed — flag if no email provider selected yet).
2. Reset page validates token, accepts new password, invalidates the
   reset token after use, invalidates all existing refresh tokens for
   that user (force re-login everywhere).

## 6. Guest Checkout

- Guests can complete checkout with just email + phone (stored on
  `Order.guestEmail` / `Order.guestPhone`), no account required.
- Post-order confirmation screen offers "Create an account to track
  this order" — pre-fills email, only requires setting a password;
  on submit, associate the just-placed order(s) matching that email
  to the new account.
- Order status lookup for guests: `GET /orders/:orderNumber` requires
  matching email or phone as a lightweight verification (not a full
  login) to prevent order-number enumeration.

## 7. Session Model

- Access token: JWT, short-lived, sent as Bearer header, holds
  `{userId, role}`.
- Refresh token: opaque or JWT, httpOnly + secure + sameSite cookie,
  longer-lived, rotated on use.
- Admin/Staff sessions use the identical mechanism — role is embedded
  in the token and checked by middleware per route (see
  `API_SPEC.md`, `SECURITY.md`).

## 8. Route Protection (frontend)

- `middleware.ts` (Next.js) or route-level guards redirect
  unauthenticated users away from `/account/*` to `/login?redirect=`.
- Admin routes (`/admin/*`) require `role IN (ADMIN, STAFF)` — plain
  customers redirected to storefront home, not shown a 403 page.

## 9. Edge Cases to Handle

- Expired reset token → clear error + re-request link CTA.
- Blocked user attempting login → generic "account unavailable,
  contact support" message.
- Concurrent login on multiple devices → allowed by default (multiple
  active refresh tokens per user), unless "single session" is
  requested later.
- Guest checkout email that matches an existing account → prompt to
  log in instead of silently creating order under a mismatched
  identity; still allow guest order to complete, but surface the
  "you have an account" nudge post-purchase.
