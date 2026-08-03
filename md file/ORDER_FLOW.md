# ORDER_FLOW.md — Promilaa

Full lifecycle from cart to fulfillment. Payment specifics live in
`COD_PAYMENT_FLOW.md`; this doc covers the order object lifecycle.

---

## 1. Cart (client-side)

- Cart state held client-side (local storage or client state,
  persisted per device) until checkout — no server cart in v1 (see
  `API_SPEC.md` note).
- Cart line item: `{variantId, quantity}` resolved against live
  product/variant data at render time so price/stock is always
  current, not stale.
- Stock check happens again at checkout submission (race-condition
  safe) — see §3.

## 2. Checkout Steps

1. **Address** — shipping address form (or select saved address if
   logged in); guest users enter name/phone/email/address inline.
2. **Payment Method** — COD / bKash / Nagad / Rocket / Upay (see
   `COD_PAYMENT_FLOW.md` for what each entails).
3. **Review** — line items, subtotal, shipping fee, discount (if
   coupon applied), total, editable before final submit.
4. **Place Order** — `POST /orders` submitted.

Shipping fee model: **flat rate, confirmed** —
- **৳60** for delivery addresses within Dhaka
- **৳100** for delivery addresses outside Dhaka

Determined from the shipping address's `city`/`district` field at
checkout (see `AddressForm` in `COMPONENT_LIBRARY.md`); fee shown
updates live as the address is entered, calculated server-side at
order placement (never trust a client-submitted shipping fee — same
rule as totals, §3 below). Zone-based/free-threshold shipping beyond
this two-tier model is a `ROADMAP.md` candidate if needed later.

## 3. Order Placement (server)

1. Validate cart items against live stock (`ProductVariant.stock`);
   reject/adjust if insufficient stock, return clear error to client.
2. Validate coupon (if applied): active, not expired, min order met,
   usage limit not exceeded.
3. Calculate subtotal, discount, shipping, total server-side —
   **never trust client-submitted totals**.
4. Create `Order` (status `PENDING`), `OrderItem`s, and `Payment`
   record (method selected, status per `COD_PAYMENT_FLOW.md`).
5. Decrement `ProductVariant.stock`, write `InventoryLog` entry
   (`reason: "order_placed"`).
6. Increment `Coupon.usedCount` if applied.
7. Return order confirmation payload (`orderNumber`, totals, next
   steps depending on payment method).

## 4. Order Status Pipeline

```
PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED
                 ↘ CANCELLED
                 ↘ RETURNED (post-delivery)
```

- **COD orders**: move `PENDING → CONFIRMED` automatically (or after
  a lightweight admin glance for fraud patterns — configurable),
  since no payment verification step is needed.
- **Wallet orders (bKash/Nagad/Rocket/Upay)**: stay `PENDING` until
  `Payment.status` becomes `VERIFIED` by an admin, at which point the
  order auto-advances to `CONFIRMED`. If `Payment.status` is
  `REJECTED`, order can be cancelled or the customer prompted to
  resubmit proof — admin decides case by case from the Admin Panel.
- Admin manually advances `CONFIRMED → PROCESSING → SHIPPED →
  DELIVERED` as fulfillment progresses (no courier API integration
  in v1 — manual status updates only).

## 5. Cancellation

- Customer-initiated cancellation allowed only while status is
  `PENDING` (before confirmation) — self-serve from account order
  view.
- Admin-initiated cancellation allowed at `PENDING`/`CONFIRMED`
  (e.g. fraud, out-of-stock discovered, customer phone
  unreachable for COD confirmation call).
- Cancelling an order restocks inventory (`InventoryLog` entry,
  `reason: "order_cancelled"`) and, if a coupon was used, optionally
  decrements `Coupon.usedCount` (business decision — default: do not
  refund usage, to prevent coupon abuse via cancel-and-reorder).

## 6. Returns (flagged, not built in v1)

Return/refund workflow was not specified in the source specs. Default
assumption: **not built in v1** (`RETURNED` status exists in the
schema as a placeholder for a post-v1 returns flow). Confirm scope
before launch — see `PRD.md` §8 and `ROADMAP.md`.

## 7. Notifications

- Order confirmation shown on-screen always; email/SMS notification
  on status changes is desirable but requires an email/SMS provider
  decision not specified in source docs — flag as a build
  prerequisite if required for v1, otherwise `ROADMAP.md` item.

## 8. Order Number Format

- Human-readable, sequential-looking but not guessable in bulk:
  e.g. `PRM-<year><zero-padded-sequence>` (e.g. `PRM-2026-004821`).
  Used in URLs, admin search, and customer order lookup.
