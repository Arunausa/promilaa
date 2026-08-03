# SECURITY.md — Promilaa

## 1. Authentication
- Passwords hashed with bcrypt or argon2 (never reversible encryption,
  never plaintext).
- JWT access tokens short-lived (~15 min); refresh tokens httpOnly +
  secure + sameSite cookies, rotated on each use (see `AUTH_FLOW.md`).
- Rate limit `/auth/login`, `/auth/register`, `/auth/forgot-password`
  per IP + per account to blunt brute force / credential stuffing.
- Generic error messages on login failure (don't reveal whether email
  exists).

## 2. Authorization
- Every admin-scoped API route verifies `role IN (ADMIN, STAFF)`
  **server-side**, independent of any frontend route guard — frontend
  guards are UX, not security.
- Object-level checks: a customer can only fetch/modify their own
  orders/addresses/wishlist, verified against the authenticated
  `userId`, not just presence of a valid token.

## 3. Input Validation & Sanitization
- Server-side validation on every write endpoint (schema validation
  library, e.g. Zod) — never trust client-side validation alone.
- Sanitize/escape user-generated content (reviews, addresses) before
  storage/render to prevent stored XSS.
- Parameterized queries throughout (Prisma handles this by default —
  never drop to raw SQL string concatenation).

## 4. Payment-Specific Security (BD manual flow)

See `COD_PAYMENT_FLOW.md` for full flow. Security-relevant points:
- Payment screenshots stored in access-restricted Cloudflare R2 paths,
  URLs never exposed in any public API response — only to the order
  owner and Admin/Staff.
- Order totals always computed server-side at checkout — client-
  submitted totals are never trusted (see `ORDER_FLOW.md` §3).
- Transaction ID reuse detection to catch duplicate-submission fraud.
- Rate-limit the payment-proof submission endpoint per order to
  prevent spam/abuse.
- Every payment rejection requires a stored reason — audit trail for
  disputes.

## 5. File Uploads
- Validate file type (allowlist: JPG/PNG/WEBP) and size server-side
  for both product images (admin) and payment screenshots (customer)
  — never rely on client-side `accept` attributes alone.
- Uploads go directly to Cloudflare R2 (signed upload) rather than
  passing through app server storage where avoidable, reducing attack
  surface.

## 6. Transport & Headers
- HTTPS enforced everywhere (no mixed content).
- Standard security headers: `Content-Security-Policy`,
  `X-Content-Type-Options: nosniff`, `Referrer-Policy`,
  `Strict-Transport-Security`.
- CORS restricted to known frontend origin(s) — not wildcard, on any
  authenticated route.

## 7. Secrets Management
- All secrets (DB URL, JWT secrets, Cloudflare R2 API keys) via environment
  variables, never committed to the repo (`.env.example` only, with
  placeholders). See `DEPLOYMENT.md` §3.
- Separate secrets per environment (staging ≠ production).

## 8. Dependency & Platform Hygiene
- Keep dependencies patched (automated dependency update checks,
  e.g. Dependabot).
- Admin panel JS bundle isolated from storefront bundle (also a
  performance win, see `PERFORMANCE.md`), reducing exposed surface
  in the customer-facing bundle.

## 9. Data Privacy
- Customer PII (name, phone, address) accessible only to the
  customer themselves and Admin/Staff — never exposed in public
  endpoints (e.g. reviews show display name only, not email/phone).
- Order lookup for guests requires matching email/phone as a
  lightweight verification, preventing order-number enumeration
  (see `AUTH_FLOW.md` §6).

## 10. Incident Basics
- Error tracking (Sentry or equivalent) on both frontend and backend,
  configured to scrub sensitive fields (passwords, tokens, payment
  screenshots) from logs.
- Database backups per `DEPLOYMENT.md` §6 as the baseline recovery
  mechanism.

## 11. Explicitly Deferred (flag for `ROADMAP.md`)
- Two-factor authentication for admin accounts (recommended addition
  once team size grows).
- Formal penetration test before a major traffic scale-up.
- Automated fraud scoring beyond duplicate-transaction-ID detection.
