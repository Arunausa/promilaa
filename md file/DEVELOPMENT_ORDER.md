# DEVELOPMENT_ORDER.md — Promilaa

The strict build sequence, and *why* each step must come before the
next. Any AI or developer picking up this project should build in
this order — skipping ahead (e.g. building UI against an unstable
schema) is the most common cause of rework in projects like this.

---

## 1. Repo & Tooling
Nothing else can start without a working repo, linting, and a
database connection. **Blocks everything.**

## 2. Database Schema (`DATABASE_SCHEMA.md`)
The schema is the contract every API and every frontend data-fetch
depends on. Lock it (with migrations run) before writing a single
API route. Changing the schema after APIs/UI are built against it is
the single most expensive kind of rework on this project — get review
on `DATABASE_SCHEMA.md` before touching code.

## 3. Auth (backend)
Nearly every other endpoint needs role/identity checks. Build and
test auth in isolation before building anything that depends on
`req.user`.

## 4. Catalog APIs (categories, products, variants, images)
The storefront cannot render anything real without these. Cloudflare R2 + Images
upload integration belongs here too, since product images depend on
it.

## 5. Design System & Shared Components (frontend)
Build the Tailwind/shadcn theme and shared components (Button, Badge,
Skeleton, layout shell) **before** building homepage/collection/PDP —
every page consumes these; building pages first leads to inconsistent
one-off styling that gets ripped out later.

## 6. Homepage + Catalog Pages (frontend, against real catalog API)
Homepage, collection pages, PDP — built against the Phase 4 catalog
APIs and seeded dummy data (`PRODUCT_DATA_STRUCTURE.md`). This is the
first point where the "Zara/COS feel" becomes visible and reviewable.

## 7. Orders & Payments API (backend)
Only build this once catalog + auth exist, since order placement
depends on validating products/variants/stock and (optionally) an
authenticated user. This includes the COD/wallet payment-proof flow
end to end on the backend before any checkout UI is built against it.

## 8. Cart & Checkout (frontend)
Built against the Phase 7 orders/payments API. Cart itself (client-
side state) can start earlier in parallel if useful, but checkout
submission cannot be finished until the orders API exists.

## 9. Account Area (frontend)
Order history, wishlist, addresses — depends on orders existing
(step 7) and auth existing (step 3). Natural to build alongside or
just after checkout.

## 10. Admin Panel (backend + frontend together, module by module)
Admin panel depends on **real data existing to manage** — build this
after catalog, orders, and payments exist, in this internal order:
1. Admin auth/role gating + layout shell
2. Product/category/inventory management (manages what step 4 created)
3. Order management + **payment verification queue** (manages what
   step 7/8 created — this is the highest-value screen operationally,
   prioritize it within this module)
4. Coupons, banners
5. Dashboard analytics + reports (needs real order/product data to
   be meaningful to build/test against — do this last within admin)

## 11. SEO / Performance / Accessibility Pass
Applied across all storefront surfaces built in steps 6, 8, 9 — do
this after those surfaces are functionally complete, not
incrementally per-page, so the pass is consistent and audit-driven
(Lighthouse, structured data validation) rather than piecemeal.

## 12. Testing (`TESTING_CHECKLIST.md`)
Full pass only possible once every module above exists. Run on
staging, not local, so it reflects real deployment conditions
(`DEPLOYMENT.md`).

## 13. Security Review (`SECURITY.md`)
Final pass across the whole system — auth, payment flow, file
uploads, headers — before production deploy.

## 14. Deployment & Launch
Final step. Requires steps 1–13 complete and the approval gate in
`PROJECT_PLAN.md` §4 satisfied.

---

## Parallelization Notes

Where team size allows, these can run in parallel without violating
the dependency order above:
- Design System (step 5) can start as soon as step 1 is done, in
  parallel with steps 2–4 (backend), since it doesn't depend on the
  API.
- Admin Panel's UI shell (step 10.1) can be scaffolded in parallel
  with step 6–9 storefront work, since it only needs auth (step 3),
  not the full storefront.
- SEO/Performance work on *already-finished* individual pages can
  begin incrementally rather than strictly waiting for all of steps
  6/8/9 — the "do it as one pass" guidance in step 11 is about
  consistency, not a hard blocker if a single AI/developer is doing
  sequential work anyway.

## What Must Never Happen Out of Order

- **UI built against a schema/API that isn't finalized** — always
  confirm `DATABASE_SCHEMA.md`/`API_SPEC.md` alignment before
  starting frontend data-fetching for a module.
- **Checkout UI built before the orders/payment API exists** — there
  is nothing to submit to.
- **Admin payment verification UI built before the payment-proof
  submission flow exists on the backend** — nothing to verify.
- **Code written before the doc set (this file included) is
  approved** — per `MASTER_CONTEXT.md` §3.
