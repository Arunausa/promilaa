# PERFORMANCE.md — Promilaa

Performance is treated as a feature, not an afterthought, given both
the brand's "premium" requirement and Bangladesh's mixed-quality
mobile networks (`06_AI_BUILD_GUIDELINES.md`, `PRD.md` §6).

## 1. Targets (mobile, representative pages: home / collection / PDP)

| Metric | Target |
|---|---|
| Lighthouse Performance | ≥ 90 |
| Largest Contentful Paint (LCP) | < 2.5s |
| Interaction to Next Paint (INP) | < 200ms |
| Cumulative Layout Shift (CLS) | < 0.1 |
| Time to First Byte (TTFB) | < 600ms |

## 2. Rendering Strategy
- Homepage/collection/PDP: SSR/SSG + ISR (Next.js) per `SEO_GUIDE.md`
  §1 — fast first paint, low client JS needed for initial content.
- Client-side interactivity (cart, filters, wishlist) hydrates
  progressively — avoid large client bundles blocking first
  interaction.

## 3. Hero Video (Homepage)
- Never the LCP-blocking element — poster image serves as the LCP
  candidate, video swaps in after.
- Compressed, appropriately bitrated, served via CDN (Cloudflare R2/Images or
  equivalent) — see `IMAGE_GUIDE.md` §5.
- Respect `prefers-reduced-data`/save-data hints where feasible: skip
  autoplay video, show poster + play button on constrained
  connections.

## 4. Images
- Responsive `srcset`/Cloudflare Images auto-format+quality on every image
  (`IMAGE_GUIDE.md` §3).
- Explicit width/height (or aspect-ratio CSS) on every image to
  prevent CLS.
- Lazy-load below-the-fold images; eager-load only the first
  above-the-fold image per page.

## 5. JavaScript
- Code-split by route; admin bundle fully separate from storefront
  bundle (`ADMIN_PANEL.md` §13, `SECURITY.md` §8).
- Framer Motion animations should not block main-thread interaction —
  prefer transform/opacity animations (GPU-accelerated) over
  layout-triggering properties.
- Avoid shipping unused shadcn/ui components — import only what's
  used per page/component.
- Third-party scripts (analytics, etc.) loaded async/deferred, never
  render-blocking.

## 6. Fonts
- Self-hosted or `next/font`-optimized web fonts (avoids extra DNS/
  connection overhead and layout shift from FOUT/FOIT), subset to
  required character sets.

## 7. API / Backend
- Paginate all list endpoints (`API_SPEC.md` conventions) — never
  return unbounded result sets.
- Index database columns used in filtering/sorting (category, price,
  status, createdAt) — see `DATABASE_SCHEMA.md` notes.
- Cache category/banner data (short TTL) where it changes
  infrequently relative to request volume.

## 8. Monitoring
- Track Core Web Vitals in production (e.g. via Vercel Analytics or
  a RUM tool) — not just lab-tested Lighthouse scores, since real BD
  mobile network conditions vary from lab conditions.
- Set up alerting if TTFB/LCP regress beyond target on key pages
  after a deploy.

## 9. Budget Discipline
- Any new dependency added to the storefront bundle should be
  justified against its bundle-size cost — prefer lighter
  alternatives or lazy-loading heavy libraries (e.g. chart libraries
  belong in the admin bundle only, never the storefront).
