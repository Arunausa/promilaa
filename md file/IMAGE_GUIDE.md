# IMAGE_GUIDE.md — Promilaa

Asset pipeline and conventions for product, banner, and video assets.
Storage: **Cloudflare R2 + Images** per `03_BACKEND_SETUP.md`.

## 1. Product Photography Conventions
- Consistent aspect ratio across the whole catalog: **3:4 portrait**
  for primary/listing images (matches fashion-retail convention and
  keeps grids visually consistent — see `DESIGN_SYSTEM.md` §6).
- Consistent background/lighting treatment (e.g. neutral studio
  background) across all products — visual consistency reads as
  "premium" more than any single photo's quality.
- Minimum of 2 images per product (front + back or detail), 4+
  recommended (front, back, detail, worn/lifestyle).
- One image per variant color at minimum, so color-switching on the
  PDP updates the gallery.

## 2. Upload & Storage
- All images uploaded to Cloudflare R2 under a structured folder
  convention:
  - `promilaa/products/{productSlug}/`
  - `promilaa/banners/`
  - `promilaa/payments/{orderNumber}/` (private — see
    `COD_PAYMENT_FLOW.md` §4, never public)
- Store only the Cloudflare Images `url` (and `publicId` if needed for
  deletion) in the database — never store raw binary in Postgres.

## 3. Delivery & Optimization
- Use Cloudflare Images automatic format (`f_auto`) and quality (`q_auto`)
  transformations on every delivered URL — serve WebP/AVIF to
  supporting browsers automatically.
- Responsive images via Next.js `<Image>` with Cloudflare Images loader (or
  Cloudflare Images own responsive breakpoints) — never ship a single
  oversized image to all viewports.
- Lazy-load all below-the-fold images; eager-load only the LCP
  candidate (hero video poster or first product image on PDP).

## 4. Alt Text
- Required on every meaningful image, generated from product data
  (name + color/attribute), editable by admin per image. See
  `SEO_GUIDE.md` §6.

## 5. Video (Homepage Hero)
- Source video hosted/delivered via Cloudflare R2 (video support) or a
  CDN-backed static asset — compressed, muted (no audio track
  required), looping, with a lightweight poster image shown before
  playback starts and as fallback on very slow connections/data-saver
  mode.
- Multiple resolution/bitrate variants if feasible so mobile doesn't
  download a desktop-weight file — flag as a build task, not a v1
  blocker if only one encode is available initially.
- Must not autoplay with sound (accessibility + platform policy) and
  must include a keyboard-reachable pause control per
  `UI_UX_GUIDELINES.md` §9.

## 6. Payment Screenshot Uploads
- Customer-uploaded, not admin-curated — different rules: no alt-text
  requirement (not publicly displayed), but strict validation on
  type/size (see `COD_PAYMENT_FLOW.md` §4) and access-restricted
  delivery URLs.

## 7. Dummy Data (Development)
- Development/dummy product images can be sourced from a placeholder
  fashion image set for local dev, but must be swappable in one place
  (seed script / CMS-like config) — never hardcoded per-component, so
  swapping to real Promilaa photography at launch touches only the
  data layer. See `PRODUCT_DATA_STRUCTURE.md`.
