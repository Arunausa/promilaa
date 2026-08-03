# PROJECT_PLAN.md — Promilaa

Status: **Approved (Phase 1)**. Initial document set reviewed. No app code is written until `ARCHITECTURE.md` and milestone list are explicitly approved.

---

## 1. Phases

### Phase 0 — Planning & Foundations (this document set)
Deliverable: the full doc set (`PRD.md` through `CONTRIBUTING.md`),
reviewed and approved. No app code.

### Phase 1 — Backend Foundations
- Repo scaffolding (frontend + backend as separate apps or a
  monorepo — decide in `DEVELOPMENT_ORDER.md`).
- Prisma schema implementation (`DATABASE_SCHEMA.md`) + migrations.
- Auth system (`AUTH_FLOW.md`) — register/login/refresh/reset.
- Core CRUD APIs: categories, products, variants, images.
- Cloudflare R2 + Images integration.

### Phase 2 — Storefront Core
- Design system implementation (Tailwind tokens, shadcn theme,
  typography, motion primitives) per `DESIGN_SYSTEM.md`.
- Shared components (`COMPONENT_LIBRARY.md` — Layout, Shared/Utility).
- Homepage (hero video, testimonials, trust badges, counters) per
  `02_HOMEPAGE_VIDEO_TESTIMONIALS.md`.
- Collection pages (filter/sort/grid).
- Product detail pages (gallery, variants, reviews).
- Seed/dummy product data per `PRODUCT_DATA_STRUCTURE.md`.

### Phase 3 — Cart, Checkout & Orders
- Cart (client-side) + cart drawer.
- Checkout flow (Address → Payment → Review) per `ORDER_FLOW.md`.
- Order placement API, stock/coupon validation, order confirmation.
- Bangladesh payment methods: COD + bKash/Nagad/Rocket/Upay manual
  flow per `COD_PAYMENT_FLOW.md`.
- Guest checkout + account order history.

### Phase 4 — Admin Panel
- Admin auth/role gating, admin layout.
- Product/category/inventory management.
- Order management + **payment verification queue** (highest
  priority screen in this phase).
- Coupon + banner management.
- Dashboard analytics + reports.

### Phase 5 — Polish, SEO, Performance, A11y
- SEO metadata/structured data/sitemap (`SEO_GUIDE.md`).
- Performance pass against budgets (`PERFORMANCE.md`).
- Accessibility audit (`UI_UX_GUIDELINES.md` §9).
- Animation polish (Framer Motion reveals/transitions).
- Responsive QA across breakpoints.

### Phase 6 — Testing & Launch Prep
- Full `TESTING_CHECKLIST.md` execution on staging.
- Security review pass (`SECURITY.md`).
- Deployment pipeline finalized (`DEPLOYMENT.md`).
- Admin team walkthrough / handoff.

### Phase 7 — Launch & Post-Launch
- Production deploy, monitoring live.
- Immediate post-launch bug-fix window.
- Hand off `ROADMAP.md` items for future phases.

## 2. Sequencing Logic

Phases are ordered so nothing is built against a moving foundation:
schema before API, API before storefront data-fetching, storefront
before checkout, checkout before admin order-management (admin needs
real orders to manage), everything before the polish/performance/SEO
pass (which touches finished surfaces), everything before testing
(which needs finished surfaces to test). Full task-level sequencing
in `DEVELOPMENT_ORDER.md`.

## 3. What This Plan Deliberately Excludes

Per locked decisions in `MASTER_CONTEXT.md` and open questions in
`PRD.md` §8: no automated payment gateway integration, no returns
workflow (unless confirmed as required before Phase 3), no native
mobile app, no multi-vendor/marketplace features. See `ROADMAP.md`
for where these live if/when prioritized.

## 4. Approval Gate

Before Phase 1 begins, the user must explicitly approve:
1. This document set (all 23 files).
2. The open questions in `PRD.md` §8 (guest checkout, shipping fee
   model, returns scope) — either confirmed or explicitly deferred.
3. The hosting recommendation in `DEPLOYMENT.md` §2, or an
   alternative.
