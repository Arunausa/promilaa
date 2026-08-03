# COMPONENT_LIBRARY.md — Promilaa

Reusable component inventory. Build every one of these once, in a
shared `components/` directory, and compose pages from them — no
one-off duplicated markup per page. Built on shadcn/ui primitives +
Tailwind + Framer Motion per `DESIGN_SYSTEM.md`.

---

## Layout
- `Header` (sticky nav, search, account/wishlist/cart icons, mobile drawer trigger)
- `MobileNavDrawer`
- `Footer` (links, newsletter signup, payment method icons, social)
- `PageContainer` (max-width wrapper)
- `Breadcrumbs`
- `SectionHeading` (eyebrow + title + optional CTA link)

## Homepage
- `HeroVideo` (autoplay/muted/loop, overlay headline + CTAs, poster fallback)
- `TestimonialCarousel` (5 reviews, avatar/name/rating/quote)
- `TrustBadgeRow`
- `AnimatedCounter`
- `FeaturedCollectionGrid`
- `LookbookBanner` (editorial full-bleed image/text block)
- `NewsletterSignup`

## Product / Catalog
- `ProductCard` (image, hover state, name, price, wishlist quick-add)
- `ProductGrid` (responsive grid wrapper, loading skeleton state)
- `FilterSidebar` / `FilterDrawer` (mobile)
- `SortDropdown`
- `ActiveFilterPills`
- `ProductGallery` (main image + thumbnails, zoom, swipe on mobile)
- `VariantSelector` (size + color, disabled state for out-of-stock)
- `SizeGuideModal`
- `PriceDisplay` (handles compare-at/strikethrough pricing)
- `ReviewList` + `ReviewSummary` (rating distribution) + `ReviewForm`
- `RelatedProducts`
- `StickyAddToCartBar` (mobile)

## Cart / Checkout
- `CartDrawer` (slide-over, editable line items)
- `CartLineItem`
- `CartSummary` (subtotal, discount, shipping, total)
- `PromoCodeInput`
- `CheckoutStepper` (Address → Payment → Review)
- `AddressForm`
- `PaymentMethodSelector` (COD/bKash/Nagad/Rocket/Upay, with inline
  explanation per method — see `COD_PAYMENT_FLOW.md`)
- `PaymentProofUpload` (transaction ID + screenshot, post-order-placement step for wallet methods)
- `OrderReviewSummary`
- `OrderConfirmation`

## Auth / Account
- `AuthModal` (login/signup tabs) + dedicated `/login` `/signup` routes
- `PasswordInput` (show/hide toggle)
- `ForgotPasswordForm` / `ResetPasswordForm`
- `AccountSidebar` (Orders, Wishlist, Addresses, Profile)
- `OrderHistoryTable` / `OrderDetailView`
- `AddressBook` (list + add/edit)
- `WishlistGrid`

## Shared / Utility
- `Button` (primary/secondary/ghost/destructive, loading state)
- `Badge` (sale, new, out-of-stock, status)
- `Skeleton` (loading placeholders per component)
- `EmptyState`
- `ErrorState`
- `Toast` (via shadcn/ui) for confirmations (added to cart, wishlist updated, etc.)
- `Modal` / `Sheet` (shadcn/ui-based, reused for size guide, filters, auth)
- `Pagination`
- `StarRating` (display + interactive input variants)
- `AnimatedSection` (Framer Motion scroll-reveal wrapper, respects reduced-motion)

## Admin-Only
- `AdminSidebar` / `AdminLayout`
- `DataTable` (sortable, filterable, paginated — used for products/orders/customers/coupons)
- `StatCard` (dashboard metric tile)
- `SalesChart`
- `PaymentVerificationCard` (screenshot preview + transaction ID + approve/reject)
- `ProductForm` (create/edit, variant + image management)
- `BannerForm`
- `CouponForm`
- `OrderStatusStepper` (admin-side status update control)
- `LowStockTable`

## Component Conventions

- Every component is typed (TypeScript props interface), documented
  with a one-line JSDoc comment, and has explicit loading/empty/error
  handling where it fetches or displays async data.
- No component reaches directly into global state/APIs it doesn't
  need — pass data via props, keep components testable in isolation.
- Shared components live under `components/ui` (shadcn primitives),
  `components/shared`, `components/storefront`, and
  `components/admin` — do not mix admin-only components into the
  storefront bundle (keeps admin panel JS out of customer-facing
  bundle size).
