# DEPLOYMENT.md — Promilaa

## 1. Environments

| Env | Purpose |
|---|---|
| `local` | Developer machines, local Postgres (Docker) |
| `staging` | Pre-production, mirrors prod config, used for QA (`TESTING_CHECKLIST.md`) |
| `production` | Live site |

## 2. Hosting — CONFIRMED

- **Frontend (Next.js)**: Vercel (native Next.js support, ISR, image
  optimization) — or any Node-capable host if Vercel isn't preferred.
- **Backend (Express + Prisma)**: any Node host with a persistent
  process (Railway, Render, Fly.io, or a VPS) — note this needs to be
  a long-running server, not a serverless function, given
  Express/Prisma's connection-pooling assumptions, unless refactored
  for a serverless-friendly Prisma setup (e.g. Prisma Accelerate)
  later.
- **Database**: managed PostgreSQL (Neon, Supabase, Railway, or
  equivalent) with automated backups.
- **Media**: Cloudinary (already specified).

This choice is confirmed — proceed with CI/CD configuration against it.

## 3. Environment Variables (baseline)

```
DATABASE_URL=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_API_BASE_URL=
NODE_ENV=
```
Extend as needed (email provider, etc.) — never commit secrets;
`.env.example` in repo with placeholder values only.

## 4. CI/CD (baseline pipeline)

1. On PR: lint, type-check, unit tests, build check.
2. On merge to `main`: deploy to `staging` automatically.
3. Manual promotion (or tag-based release) from `staging` to
   `production` — no direct-to-prod auto-deploy for this project size,
   given payment-verification data sensitivity.
4. Run Prisma migrations as an explicit, reviewed pipeline step —
   never auto-`migrate reset` against production.

## 5. Database Migrations

- `prisma migrate dev` locally, `prisma migrate deploy` in CI for
  staging/production.
- Migrations are additive-first where possible (avoid destructive
  column drops in the same release as the code that stops using
  them) to allow safe rollback.

## 6. Backups & Recovery

- Automated daily database backups (managed provider feature or
  cron'd `pg_dump`), retained at least 14–30 days.
- Cloudinary assets are inherently durable (no separate backup
  process needed) but folder-deletion actions in the admin panel
  should be soft-delete where feasible for product images.

## 7. Domain & SSL

- Custom domain pointed at hosting provider, automatic SSL
  (Let's Encrypt via host, or Vercel's built-in cert management).

## 8. Monitoring (baseline)

- Uptime monitoring on the API and storefront.
- Error tracking (e.g. Sentry) on both frontend and backend —
  especially around checkout and payment-proof submission, the
  highest-cost-of-failure flows.
- See `PERFORMANCE.md` for Core Web Vitals monitoring.

## 9. Rollback Plan

- Frontend: redeploy previous build (platform-native rollback, e.g.
  Vercel instant rollback).
- Backend: redeploy previous image/build; only roll back database
  migrations if the migration itself is the cause and a safe down-
  migration exists — otherwise fix-forward.