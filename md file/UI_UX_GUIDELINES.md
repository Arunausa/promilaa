# UI_UX_GUIDELINES.md — Promilaa

Principles that govern how the design system (`DESIGN_SYSTEM.md`) and
components (`COMPONENT_LIBRARY.md`) get used in practice.

---

## 1. Brand Feel

Every screen should look like it belongs to an international fashion
retailer. Concretely, that means:
- Product photography and negative space carry the page — UI chrome
  (borders, shadows, buttons) stays quiet.
- No stock "eCommerce template" tells: no rainbow sale badges, no
  cluttered mega-menus, no auto-playing carousels stacked three deep.
- Copy is short, confident, editorial — not exclamation-mark sales
  copy.

## 2. Navigation

- Sticky, minimal header: logo center or left, Men/Women/New/Sale
  nav, search, account, wishlist, cart icons.
- Mobile: slide-in drawer nav, large tap targets, search prioritized.
- Breadcrumbs on collection and product pages (also feeds
  `SEO_GUIDE.md` structured data).

## 3. Homepage

- Hero: full-width video (autoplay, muted, loop, no controls visible
  by default) with overlay headline and Shop Men/Shop Women CTAs —
  video must have a static poster/fallback image for slow connections
  and must never block Largest Contentful Paint (see
  `PERFORMANCE.md`).
- Below the fold: featured collections, testimonials (5 reviews),
  trust badges, animated counters, editorial/lookbook section.
- Every section should earn its scroll — no filler blocks.

## 4. Collection (Listing) Pages

- Filter/sort accessible without a full page reload (client-side
  state + URL query params, so filtered views are shareable/linkable
  and SEO-indexable where sensible).
- Persistent filter bar on desktop (sidebar or sticky top bar);
  bottom-sheet filter drawer on mobile.
- Product cards: image (hover = secondary image or subtle zoom),
  name, price, compare-at price if discounted, quick-add to wishlist.
- Empty state (no results after filtering) must be designed, not a
  blank page.

## 5. Product Detail Page (PDP)

- Gallery: large primary image, thumbnail or dot navigation, pinch-
  zoom on mobile.
- Size/color selection required before "Add to Cart" enables; out-of-
  stock variants visibly disabled, not hidden.
- Size guide accessible inline (modal), not a dead-end link.
- Reviews visible with rating distribution, not just a raw list.
- Related/complete-the-look products below the fold.
- Sticky add-to-cart bar on mobile once user scrolls past the initial
  price/CTA block.

## 6. Cart & Checkout

- Cart: editable quantities, clear subtotal, promo code field with
  inline validation feedback, clear path back to shopping.
- Checkout is a single flow with clear steps (Address → Payment →
  Review), not a maze — see `ORDER_FLOW.md` for the full sequence.
- Payment method selection must clearly explain what happens next for
  each method (e.g. "You'll enter your bKash transaction ID after
  placing the order" for wallet methods; "Pay when your order
  arrives" for COD) — this is a trust-building moment, not just a
  radio button list. See `COD_PAYMENT_FLOW.md`.
- Order confirmation page/screen always shown regardless of payment
  method, with clear next steps.

## 7. Authentication

- Login/signup should not force a full-page redirect where a modal/
  slide-over would keep context (e.g. "sign in to check out" from
  cart) — but a dedicated route must also exist for direct links/SEO.
- Password fields: show/hide toggle, clear validation messaging,
  never silently fail.
- See `AUTH_FLOW.md` for full flow logic including guest checkout.

## 8. Admin Panel UX

- Function over flourish: dense data tables, fast filters, bulk
  actions where useful (e.g. bulk status update).
- Payment verification queue should be the fastest path in the whole
  admin panel — image (screenshot) + transaction ID + approve/reject
  should be viewable and actionable without extra clicks.
- See `ADMIN_PANEL.md` for full feature spec.

## 9. Accessibility (WCAG 2.1 AA baseline)

- Color contrast meets AA at all text sizes used.
- All interactive elements keyboard-reachable and operable, visible
  focus states.
- All images have meaningful `alt` text (product name + key attribute
  minimum); decorative images `alt=""`.
- Respect `prefers-reduced-motion` — see `DESIGN_SYSTEM.md` §5.
- Form errors announced to screen readers (`aria-live`), not color-
  only indicators.
- Video hero must not autoplay audio and must have a pause control
  reachable by keyboard even if visually minimal.

## 10. Responsive Rules

- Mobile-first build order for every component.
- Breakpoints follow Tailwind defaults (`sm/md/lg/xl/2xl`) unless a
  component genuinely needs a custom breakpoint — documented inline
  if so.
- Touch targets minimum 44×44px on mobile.

## 11. Error & Empty States

Every list/grid/data view needs three designed states, not just the
happy path: **loading** (skeleton, not spinner-only, for anything
above the fold), **empty** (helpful, on-brand copy + a next action),
**error** (retry action, no raw error text/stack shown to users).
