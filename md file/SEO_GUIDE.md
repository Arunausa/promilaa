# SEO_GUIDE.md — Promilaa

## 1. Rendering Strategy
- Homepage, collection pages, and product pages should be
  server-rendered or statically generated (Next.js App Router: RSC /
  ISR for products & collections) — not purely client-rendered — so
  crawlers and social previews see full content.
- Revalidate product/collection pages on a short interval (ISR) or on
  admin content change (on-demand revalidation) so catalog updates
  reflect without a full rebuild.

## 2. Metadata
- Unique `<title>` and `<meta name="description">` per page:
  - Homepage: brand tagline + core value prop.
  - Collection: "{Category} — {Gender} | Promilaa".
  - Product: "{Product Name} | Promilaa".
- OpenGraph + Twitter Card tags on every public page, product pages
  using the primary product image.
- Canonical URLs on all pages, especially filtered/sorted collection
  URLs (canonical points to the unfiltered collection URL to avoid
  duplicate-content dilution).

## 3. Structured Data (schema.org JSON-LD)
- `Product` schema on PDPs: name, image, description, price,
  availability, aggregateRating (from reviews).
- `BreadcrumbList` on collection and product pages.
- `Organization` schema on homepage (name, logo, social links).
- `WebSite` schema with `SearchAction` if on-site search exists.

## 4. URLs
- Clean, human-readable slugs: `/men/jackets`, `/products/{slug}`.
- No query-string-only product URLs; filters use query params on
  collection URLs but the canonical collection page itself is clean.

## 5. Sitemap & Robots
- Auto-generated `sitemap.xml` covering all published products,
  categories, and static pages — regenerated on content change.
- `robots.txt` disallows `/admin`, `/account`, `/api`, cart/checkout
  routes; allows everything public.

## 6. Images
- All product images have descriptive `alt` text (product name + key
  attribute, e.g. "Promilaa Oversized Wool Coat — Charcoal, front
  view") — never empty alt on meaningful images. See `IMAGE_GUIDE.md`.

## 7. Performance as SEO
- Core Web Vitals directly affect ranking — see `PERFORMANCE.md`
  budgets. Hero video must not delay LCP; use a poster image as the
  LCP element where possible.

## 8. Content
- Category and product descriptions should be genuinely descriptive
  (not keyword-stuffed) — unique per product, not templated
  boilerplate repeated across variants.
- Internal linking: related products, breadcrumbs, category cross-
  links reinforce site structure for crawlers.

## 9. Internationalization Readiness
- Per `MASTER_CONTEXT.md` §4, don't hardcode English-only assumptions
  into URL structure or metadata generation — even if only English
  ships in v1, keep the metadata generation function locale-aware so
  a future `bn` locale doesn't require a rewrite.
