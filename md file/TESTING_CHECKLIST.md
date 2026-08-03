# TESTING_CHECKLIST.md — Promilaa

QA coverage required before launch. Pair with `DEVELOPMENT_ORDER.md`
for when each area becomes testable.

## Storefront — Functional
- [ ] Homepage hero video autoplays muted, loops, has working poster
      fallback on slow connection
- [ ] Shop Men / Shop Women CTAs route correctly
- [ ] Testimonial section renders all 5 reviews, trust badges, counters
- [ ] Collection filters (category, size, color, price) work in
      combination, are shareable via URL, reset correctly
- [ ] Sort options change order correctly
- [ ] PDP: gallery navigation, variant selection, out-of-stock
      variants disabled not hidden, add-to-cart requires variant
      selection
- [ ] Wishlist add/remove works logged-in; prompts login when logged
      out (per `AUTH_FLOW.md`)
- [ ] Cart: quantity update, remove item, promo code apply/invalid
      handling
- [ ] Checkout: all 3 steps (Address/Payment/Review), validation on
      each, back-navigation preserves entered data
- [ ] Guest checkout completes without account creation
- [ ] Order placed with each of the 5 payment methods end-to-end
      (COD confirms immediately; wallet methods enter
      `PENDING_VERIFICATION`)
- [ ] Payment proof upload (transaction ID + screenshot) succeeds and
      shows correct pending state to customer
- [ ] Order confirmation screen shown for every payment method with
      correct next-step messaging

## Storefront — Auth
- [ ] Signup, login, logout
- [ ] Forgot/reset password end to end, old sessions invalidated
- [ ] Blocked user cannot log in (generic message)
- [ ] Route protection redirects unauthenticated users from `/account/*`

## Admin Panel
- [ ] Admin/staff login and role-based access enforced (customer
      cannot reach `/admin`)
- [ ] Product CRUD incl. variants, images, publish toggle
- [ ] Category CRUD incl. nesting
- [ ] Order list filters/search work; status transitions enforced
      correctly per `ORDER_FLOW.md`
- [ ] Payment verification queue: approve flow advances order to
      CONFIRMED; reject flow requires reason and notifies customer
      state
- [ ] Coupon CRUD, validation logic (min order, expiry, usage limit)
      matches storefront behavior
- [ ] Banner CRUD, scheduling (start/end dates) respected on storefront
- [ ] Inventory adjustment updates stock and writes InventoryLog
- [ ] Low-stock alerts trigger at correct threshold
- [ ] Reports return correct data for a known seeded date range

## Cross-Cutting
- [ ] Responsive across common breakpoints (mobile/tablet/desktop),
      real-device spot check on at least one Android + one iOS device
- [ ] Keyboard-only navigation through checkout and admin core flows
- [ ] Screen reader spot-check on homepage, PDP, checkout
- [ ] `prefers-reduced-motion` disables non-essential animation
- [ ] All forms show clear validation errors, no silent failures
- [ ] 404 page, empty states, and error states designed and correct
      (not default framework error pages)
- [ ] SEO: metadata, structured data, sitemap present and correct on
      a sample of pages (`SEO_GUIDE.md`)
- [ ] Lighthouse scores meet targets in `PERFORMANCE.md` on
      representative pages (home, collection, PDP)

## Security
- [ ] Auth endpoints rate-limited, tested against brute force
- [ ] Payment-proof endpoint rate-limited
- [ ] JWT expiry/refresh rotation verified
- [ ] Role checks verified server-side (not just hidden UI) on every
      admin endpoint
- [ ] File upload validation (type/size) enforced server-side, not
      just client-side
- [ ] SQL injection / XSS spot checks on all user-input fields
      (reviews, addresses, admin forms)

## Payment-Specific (Bangladesh)
- [ ] Duplicate transaction ID flagged to admin
- [ ] Rejected payment allows resubmission
- [ ] Merchant wallet numbers shown at checkout are pulled from admin
      settings, not hardcoded
- [ ] Order total shown to customer matches amount admin sees in
      verification queue exactly (no rounding drift)

## Data Integrity
- [ ] Stock decrements correctly on order placement, restocks on
      cancellation
- [ ] Order totals always calculated server-side, tamper-tested
      (attempt to submit a manipulated total from client)
- [ ] Coupon usage count increments/decrements correctly

## Pre-Launch Sign-off
- [ ] Full checkout smoke test on staging with real (non-dummy) product
      data
- [ ] Admin team walkthrough of payment verification + order
      fulfillment workflow
- [ ] Backup/restore process verified at least once on staging
