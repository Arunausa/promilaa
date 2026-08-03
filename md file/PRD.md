# PRD.md — Promilaa Product Requirements Document

Status: **Approved**.
See `MASTER_CONTEXT.md` for locked decisions this PRD must not contradict.

---

## 1. Overview

Promilaa is a direct-to-consumer fashion eCommerce platform targeting
the Bangladesh market with an international, editorial brand feel.
The product is a public storefront plus an internal admin panel,
backed by a REST API and PostgreSQL database.

## 2. Goals

- Launch a storefront that looks and feels like a premium global
  fashion brand, not a generic template store.
- Support the payment realities of the BD market from day one (COD +
  local mobile wallets), with a clean upgrade path to gateway
  integrations later.
- Give the Promilaa team a capable admin panel so they can run the
  store (catalog, orders, payments, marketing) without engineering
  help for routine operations.
- Ship a codebase that is reusable, typed, componentized, and fast —
  suitable for scaling catalog size and traffic without a rewrite.

## 3. Non-Goals (v1)

- No native mobile app.
- No automated payment gateway integration (SSLCommerz / SurjoPay /
  AmarPay) — manual verification only, per locked decision.
- No multi-currency / multi-country checkout.
- No marketplace/multi-vendor support.
- No live chat / support widget (can be added post-v1).
- No subscription or loyalty-points system in v1.

## 4. Target Users

- **Shoppers** in Bangladesh (primary), browsing on mobile-first
  devices, price- and trust-sensitive, often preferring COD.
- **Store Admins/Staff** managing catalog, orders, and payment
  verification day to day.

## 5. Functional Requirements

### 5.1 Storefront
- Homepage: full-width autoplay/muted/looping hero video with overlay
  headline ("PROMILAA — Timeless Style. Designed for Everyday
  Confidence.") and Shop Men / Shop Women CTAs.
- Testimonial section with 5 curated reviews, trust badges (e.g.
  secure checkout, easy returns, COD available), and animated
  counters (e.g. "10,000+ happy customers").
- Men's and Women's collection pages with filtering (category, size,
  color, price) and sorting (newest, price, popularity).
- Product Detail Page (PDP): gallery, size/color selection, price,
  description, size guide, related products, reviews.
- Cart: add/update/remove line items, quantity, subtotal, promo code
  entry.
- Checkout: shipping address, payment method selection
  (COD/bKash/Nagad/Rocket/Upay), order review, order confirmation.
- Authentication UI: signup, login, forgot/reset password, account
  dashboard (orders, wishlist, saved addresses, profile).
- Wishlist: add/remove products, persists for logged-in users.
- Fully responsive (mobile-first) across all pages.
- SEO-friendly markup and metadata on every public page.

### 5.2 Backend / API
- JWT-based authentication (access + refresh token pattern).
- CRUD APIs for products, categories, orders, users, reviews,
  wishlist, coupons, banners.
- Inventory tracking with stock decrement on order confirmation.
- Cloudflare R2-backed image upload for products and payment
  screenshots.
- Admin-only endpoints protected by role-based middleware.

### 5.3 Payments (Bangladesh)
- Default method: **Cash on Delivery**.
- Manual mobile wallet methods: **bKash, Nagad, Rocket, Upay** — each
  requires customer-submitted transaction ID + payment screenshot,
  reviewed and approved/rejected by an admin.
- Order cannot move to fulfillment for wallet payments until admin
  verification is complete (COD orders can proceed to fulfillment
  immediately, subject to admin cancellation for fraud).
- Payment method architecture is modular so gateway integrations can
  be added later (see `ROADMAP.md`) without schema changes.

### 5.4 Admin Panel
- Dashboard analytics (sales, orders, top products, low stock).
- Product management (create/edit/archive, variants, images,
  categories, inventory).
- Order management (status pipeline, payment verification queue).
- Customer management (view profile, order history, block/unblock).
- Coupon management (percentage/flat, expiry, usage limits).
- Banner management (homepage/collection promotional banners).
- Reports (sales over time, best sellers, payment method breakdown).

## 6. Non-Functional Requirements

- **Performance**: see `PERFORMANCE.md` budgets — target good Core
  Web Vitals on 3G/4G mobile, since BD mobile networks vary widely.
- **Accessibility**: WCAG 2.1 AA baseline — keyboard nav, contrast,
  alt text, reduced-motion support.
- **SEO**: server-rendered/SSG product & collection pages, structured
  data (Product, BreadcrumbList), sitemap, robots.txt, OpenGraph.
- **Security**: see `SECURITY.md` — password hashing, JWT rotation,
  input validation, rate limiting on auth and payment-submission
  endpoints, screenshot upload validation.
- **Scalability**: schema and API designed to support catalog growth
  and traffic growth without structural rewrites.

## 7. Success Metrics (v1 launch)

- Storefront Lighthouse scores: Performance ≥ 90 (mobile), SEO ≥ 95,
  Accessibility ≥ 95.
- Checkout completion works end-to-end for all 5 payment methods in
  QA (see `TESTING_CHECKLIST.md`).
- Admin can fully process an order (from placement to payment
  verification to fulfillment) without engineering involvement.

## 8. Open Questions — RESOLVED

- **Guest checkout**: allowed. Account creation is optional, not
  required at checkout. See `AUTH_FLOW.md` §6.
- **Returns/refunds**: not built at launch. Deferred to post-launch
  per `ROADMAP.md`. Schema keeps a `RETURNED` status placeholder only.
- **Shipping fee model**: flat rate, confirmed —
  **৳60 within Dhaka, ৳100 outside Dhaka**. See `ORDER_FLOW.md` §2.
- **Hosting**: confirmed — use the `DEPLOYMENT.md` §2 recommendation
  (Vercel for frontend, managed Node host for backend, managed
  PostgreSQL).

## 9. Approval

This PRD, along with the rest of the planning doc set, requires
explicit user sign-off before any application code is written, per
`MASTER_CONTEXT.md` §3.
