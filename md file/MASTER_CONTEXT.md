# MASTER_CONTEXT.md
### Promilaa — Single Source of Truth for AI & Human Contributors

> Read this file first. Every other doc in this set expands on something
> summarized here. If any other doc contradicts this one, this one wins
> unless the user explicitly overrides it in writing.

---

## 1. What Promilaa Is

Promilaa is a premium fashion eCommerce brand and website, positioned
with a **Zara / COS-inspired aesthetic**: minimal, editorial, whitespace-
heavy, confident typography, restrained color, real product photography
doing the talking. The brand line is:

> "PROMILAA — Timeless Style. Designed for Everyday Confidence."

The site sells men's and women's apparel to customers primarily in
**Bangladesh**, so the payment experience (Cash on Delivery + local
mobile wallets) is a first-class feature, not an afterthought bolted
onto a generic Stripe-first template.

## 2. Source Specs (what was provided, condensed)

| Source file | Core ask |
|---|---|
| `01_PROMILAA_WEBSITE.md` | Full storefront: homepage, men/women collections, PDP, cart, checkout, auth UI, responsive, Framer Motion, Next.js/React/Tailwind/TS/shadcn, SEO, reusable components, dummy data |
| `02_HOMEPAGE_VIDEO_TESTIMONIALS.md` | Full-width autoplay muted loop hero video, overlay headline + CTAs, 5-review testimonial section, trust badges, counters |
| `03_BACKEND_SETUP.md` | Node.js + Express + PostgreSQL + Prisma, JWT auth, users/products/categories/orders/wishlist/reviews/inventory, Cloudflare R2 + Images, admin APIs |
| `04_PAYMENT_SYSTEM_BD.md` | COD default + bKash/Nagad/Rocket/Upay manual flow (screenshot + transaction ID + admin verification), modular slot for future gateways |
| `05_ADMIN_PANEL.md` | Analytics, products, categories, orders, customers, coupons, inventory, banners, payment verification, reports |
| `06_AI_BUILD_GUIDELINES.md` | Luxury international-brand bar: whitespace, typography, animation, accessibility, SEO, scalability, reusable code, performance, production quality |

## 3. Non-Negotiable Decisions (locked)

These were confirmed with the user and should not be re-litigated by
any future AI session without explicit new instruction:

1. **Stack is fixed**: Next.js + React + TypeScript + Tailwind CSS +
   shadcn/ui + Framer Motion on the frontend; Node.js + Express +
   PostgreSQL + Prisma + JWT on the backend; Cloudflare R2 + Images for media.
   No swapping to another meta-framework, ORM, or CSS system.
2. **Payments phase 1 = manual only**: Cash on Delivery, bKash, Nagad,
   Rocket, Upay — all via screenshot + transaction ID + admin
   verification. **No SSLCommerz / SurjoPay / AmarPay integration
   code is written in this phase.** The schema and payment module are
   built modularly so those gateways can be added later without a
   redesign, but no integration work happens now.
3. **No code until PROJECT_PLAN.md, TASK_LIST.md, and
   DEVELOPMENT_ORDER.md (plus the rest of this doc set) are reviewed
   and explicitly approved by the user.**

## 4. Design North Star

- Aesthetic reference points: Zara, COS, Arket, Massimo Dutti online
  stores — not a generic Shopify template.
- Whitespace is a feature. Typography carries the brand more than
  color does.
- Motion (Framer Motion) is used to add polish and perceived quality
  — page transitions, staggered reveals, hover micro-interactions —
  never gratuitously, never at the cost of performance or a11y
  (respect `prefers-reduced-motion`).
- Full bilingual-readiness is not required in v1, but copy and layout
  should not assume English-only forever (BD market).
- See `DESIGN_SYSTEM.md` and `UI_UX_GUIDELINES.md` for the executable
  version of this.

## 5. Domain Model Summary

Full detail lives in `DATABASE_SCHEMA.md`. At a glance:

```
User ── Order ── OrderItem ── Product ── Category
  │        │                     │
  │        └── Payment          ├── ProductVariant (size/color)
  │        └── ShippingAddress  ├── ProductImage
  ├── Wishlist ── Product        └── Review ── User
  └── Review
Admin (User with role=ADMIN/STAFF)
Coupon
Banner
InventoryLog
```

## 6. Payment Model Summary (BD-specific)

Full detail lives in `COD_PAYMENT_FLOW.md`. At a glance:

- Every order has a `paymentMethod`: `COD | BKASH | NAGAD | ROCKET | UPAY`.
- COD orders skip verification and go straight to `CONFIRMED` (subject
  to admin fraud checks).
- Mobile-wallet orders require the customer to submit a
  **transaction ID** and **screenshot upload** (Cloudflare R2), and stay
  `PENDING_VERIFICATION` until an admin manually approves or rejects
  them from the Admin Panel.
- `Payment.status`: `PENDING | PENDING_VERIFICATION | VERIFIED | REJECTED | REFUNDED`.

## 7. Roles

- **Guest** — browse, wishlist (local), no checkout without account or guest-checkout flow (decide in `AUTH_FLOW.md`).
- **Customer** — browse, cart, checkout, order history, wishlist, reviews.
- **Admin** — full Admin Panel access (see `ADMIN_PANEL.md`).
- **Staff** (optional, phase 2) — scoped admin access (orders/inventory only, no settings/reports).

## 8. What "Done" Looks Like for v1

A visitor can land on the homepage, watch the hero video, browse
Men/Women collections, filter and sort, open a product page, pick
size/color, add to cart, check out as a guest or logged-in user, pay
via COD or a BD mobile wallet, and receive order confirmation. An
admin can log in, see the order, verify the wallet payment if
applicable, update fulfillment status, and manage the catalog,
coupons, banners, and customers. The whole experience feels like a
premium international fashion brand, not a template.

## 9. Document Map

| Doc | Purpose |
|---|---|
| `PROJECT_PLAN.md` | Phases, milestones, timeline shape |
| `TASK_LIST.md` | Granular checklist per module |
| `DEVELOPMENT_ORDER.md` | Strict build sequence + dependencies |
| `PRD.md` | Full product requirements |
| `DATABASE_SCHEMA.md` | Prisma schema + ERD description |
| `API_SPEC.md` | REST endpoint contract |
| `UI_UX_GUIDELINES.md` | UX principles, interaction rules |
| `DESIGN_SYSTEM.md` | Tokens: color, type, spacing, motion |
| `COMPONENT_LIBRARY.md` | Reusable component inventory |
| `AUTH_FLOW.md` | Signup/login/session/reset flows |
| `ORDER_FLOW.md` | Cart → checkout → fulfillment lifecycle |
| `COD_PAYMENT_FLOW.md` | BD payment methods in detail |
| `ADMIN_PANEL.md` | Admin feature spec |
| `SEO_GUIDE.md` | Metadata, structured data, sitemap rules |
| `IMAGE_GUIDE.md` | Asset pipeline, Cloudflare R2 + Images conventions |
| `PRODUCT_DATA_STRUCTURE.md` | Dummy + real product data shape |
| `DEPLOYMENT.md` | Environments, hosting, CI/CD |
| `TESTING_CHECKLIST.md` | QA coverage before launch |
| `SECURITY.md` | Auth, data, payment-fraud safeguards |
| `PERFORMANCE.md` | Core Web Vitals targets, budgets |
| `ROADMAP.md` | Post-v1 phases |
| `CONTRIBUTING.md` | How humans/AI should work in this repo |

## 10. Rules for Any AI Working on This Project

1. Do not start writing application code until the user has approved
   the planning doc set.
2. Do not introduce new libraries/services outside Section 3 without
   asking first.
3. Do not implement SSLCommerz/SurjoPay/AmarPay — schema may reserve
   space, code may not call them.
4. Always check `DEVELOPMENT_ORDER.md` before starting a task — build
   order matters (schema before API before UI before integration).
5. Keep this file updated if a locked decision changes; it is the
   tie-breaker for every other doc.
