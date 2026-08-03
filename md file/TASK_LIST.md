# TASK_LIST.md — Promilaa

Granular checklist, organized by module, matching the phases in
`PROJECT_PLAN.md`. Use this as the working checklist during build;
`DEVELOPMENT_ORDER.md` governs the sequence in which sections should
actually be started.

## Repo & Tooling
- [x] Initialize repo structure (frontend Next.js app, backend
      Express app)
- [x] Configure TypeScript, ESLint, Prettier across both apps
- [x] Configure Tailwind + shadcn/ui in frontend
- [x] Configure Prisma in backend, connect to Postgres
- [x] `.env.example` files for both apps
- [x] Base CI pipeline (lint/typecheck/build on PR)

## Backend — Data Layer
- [x] Implement Prisma schema (`DATABASE_SCHEMA.md`)
- [x] Initial migration
- [x] Seed script (`PRODUCT_DATA_STRUCTURE.md` dummy data)

## Backend — Auth
- [x] Register endpoint + password hashing
- [x] Login endpoint + JWT issuance
- [x] Refresh token rotation
- [x] Logout / token invalidation
- [ ] Forgot/reset password flow
- [x] Auth middleware (role-based)
- [ ] Rate limiting on auth endpoints

## Backend — Catalog
- [x] Cloudflare R2 integration (`aws-sdk` + image upload endpoint)
- [x] Categories API (CRUD)
- [x] Products API (CRUD + single/list variants)
- [x] Image attachment to products
- [x] Product Search/Filter/Pagination (Advanced query logic)
- [ ] Product Reviews endpoint (Create/Approve)
- [x] Product detail endpoint

## Backend — Orders & Payments API
- [x] Order calculation + stock lock
- [x] Address validation + user relation
- [x] Fraud BD API Integration (Fake order prevention)
- [x] COD Payment setuproof submission endpoint (transaction ID + screenshot)
- [ ] Payment verification queue endpoint
- [ ] Payment approve/reject endpoints
- [ ] Coupon validation + apply logic

## Backend — Reviews, Wishlist, Misc
- [ ] Review CRUD (customer submit, admin moderate)
- [ ] Wishlist add/remove/list
- [ ] Banner CRUD endpoints
- [ ] Admin analytics/reports endpoints

## Frontend — Design System & Shared Components
- [ ] Tailwind theme tokens (`DESIGN_SYSTEM.md`)
- [ ] shadcn/ui components themed
- [ ] Layout components: Header, Footer, MobileNavDrawer, PageContainer
- [ ] Shared utility components (Button, Badge, Skeleton, Toast, Modal, Pagination, StarRating)
- [ ] Motion primitives (AnimatedSection, reduced-motion handling)

## Frontend — Homepage
- [ ] HeroVideo component (autoplay/muted/loop, poster fallback)
- [ ] Overlay headline + Shop Men/Women CTAs
- [ ] TestimonialCarousel (5 reviews)
## Frontend — Storefront
- [x] Homepage (Hero banner, Category grid, Featured products)
- [x] Collection Page (Grid view with filters)
- [x] Product Detail Page (Image gallery, Variant selector, Add to cart)
- [x] Search results page (Optional but recommended)
- [ ] Related products

## Frontend — Cart & Checkout
- [ ] Cart state management (client-side)
- [ ] CartDrawer + CartLineItem + CartSummary
- [ ] PromoCodeInput
- [ ] Checkout stepper (Address/Payment/Review)
- [ ] AddressForm (+ saved address selection for logged-in users)
- [ ] PaymentMethodSelector with per-method explanation
- [ ] PaymentProofUpload flow (post-order)
- [ ] OrderConfirmation screen

## Frontend — Auth & Account
- [ ] Login/Signup pages + AuthModal
- [ ] Forgot/reset password pages
- [ ] Account dashboard: Orders, Wishlist, Addresses, Profile
- [ ] Route protection middleware

## Frontend — Admin Panel
- [ ] AdminLayout + AdminSidebar + role gating
- [ ] Dashboard (StatCards, SalesChart, low-stock list)
- [ ] Product management (list, ProductForm, variant/image mgmt)
- [ ] Category management
- [ ] Order management (list, detail, status stepper)
- [ ] Payment verification queue UI
- [ ] Customer management (list, block/unblock)
- [ ] Coupon management
- [ ] Banner management
- [ ] Reports views

## SEO / Performance / A11y Pass
- [ ] Metadata + OpenGraph on all public pages
- [ ] JSON-LD structured data (Product, BreadcrumbList, Organization)
- [ ] Sitemap.xml + robots.txt
- [ ] Image optimization pass (Cloudflare Images transforms, lazy loading)
- [ ] Lighthouse audit + fixes to hit `PERFORMANCE.md` targets
- [ ] Accessibility audit + fixes to hit WCAG 2.1 AA baseline
- [ ] `prefers-reduced-motion` verified across all animated components

## Testing & Launch
- [ ] Execute full `TESTING_CHECKLIST.md` on staging
- [ ] Security review against `SECURITY.md`
- [ ] Deployment pipeline configured (`DEPLOYMENT.md`)
- [ ] Admin team walkthrough
- [ ] Production deploy
- [ ] Post-launch monitoring confirmed live (errors, Core Web Vitals)
