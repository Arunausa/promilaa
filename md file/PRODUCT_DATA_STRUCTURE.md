# PRODUCT_DATA_STRUCTURE.md — Promilaa

Shape of product data for both the dummy/seed dataset (`01_...` spec
requirement) and the real catalog, matching `DATABASE_SCHEMA.md`.

## 1. Product JSON Shape (API response / seed shape)

```json
{
  "id": "prod_01",
  "name": "Oversized Wool Coat",
  "slug": "oversized-wool-coat",
  "description": "A relaxed, oversized silhouette in brushed wool...",
  "category": { "id": "cat_women_outerwear", "name": "Outerwear", "gender": "women" },
  "basePrice": 6500.00,
  "compareAtPrice": 7800.00,
  "isFeatured": true,
  "images": [
    { "url": "https://res.cloudflare.com/.../front.jpg", "altText": "Oversized Wool Coat — Charcoal, front view", "position": 0 },
    { "url": "https://res.cloudflare.com/.../back.jpg", "altText": "Oversized Wool Coat — Charcoal, back view", "position": 1 }
  ],
  "variants": [
    { "sku": "OWC-CHR-S", "size": "S", "color": "Charcoal", "stock": 12, "price": null },
    { "sku": "OWC-CHR-M", "size": "M", "color": "Charcoal", "stock": 8, "price": null },
    { "sku": "OWC-CAM-M", "size": "M", "color": "Camel", "stock": 5, "price": null }
  ],
  "reviews": {
    "average": 4.6,
    "count": 23
  }
}
```

## 2. Seed / Dummy Data Requirements

- Minimum for a convincing demo: **2 categories × men/women (4 total
  top-level), 6–10 products per category**, each with 2–4 variants
  and 2–4 images.
- Prices in **BDT** (Bangladeshi Taka), realistic for the fashion
  segment (e.g. ৳1,200–৳8,000 range), not placeholder `$9.99`-style
  values — reinforces the BD-market context throughout dev/QA.
- Include a mix of: in-stock, low-stock (near threshold, to test
  low-stock admin alerts), and out-of-stock variants.
- Include at least one product with `compareAtPrice` set (discounted)
  to test sale-badge UI.
- Seed 5 testimonial-worthy reviews (matching `02_...` spec's
  homepage testimonial requirement) distinct from general product
  reviews, or flag reviews used for the homepage testimonial section
  with a `isFeaturedTestimonial` convenience flag if not reusing
  `Review` records directly (implementation detail, decide at build
  time).

## 3. Category Taxonomy (starting point)

```
Men
 ├─ T-Shirts & Tops
 ├─ Shirts
 ├─ Outerwear
 ├─ Trousers & Denim
 └─ Accessories
Women
 ├─ Dresses
 ├─ Tops & Blouses
 ├─ Outerwear
 ├─ Trousers & Denim
 └─ Accessories
```

Expandable via the admin panel's category management
(`ADMIN_PANEL.md` §4) — this is a starting taxonomy, not a hard limit.

## 4. Variant Attributes

- v1 supports **size** and **color** as the two variant dimensions
  (matches source spec + typical fashion eCommerce). If a third
  dimension (e.g. length/fit) is needed later, extend
  `ProductVariant` with an additional attribute field — flagged in
  `ROADMAP.md`, not built speculatively now.
- Size values should follow a consistent, category-appropriate set
  (e.g. XS–XXL for apparel; numeric or one-size for accessories) —
  defined per category, not free text, to keep filtering reliable.

## 5. Data Ownership

- Seed data lives in a dedicated seed script (Prisma seed), not
  scattered mock JSON per component — one source of truth for local
  dev, matching `IMAGE_GUIDE.md` §7's "swappable in one place"
  principle.
