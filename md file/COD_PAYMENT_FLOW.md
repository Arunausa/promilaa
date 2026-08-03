# COD_PAYMENT_FLOW.md — Promilaa Bangladesh Payment System

Scope per locked decision (`MASTER_CONTEXT.md` §3): **manual methods
only** — Cash on Delivery + bKash/Nagad/Rocket/Upay via customer-
submitted proof and admin verification. No SSLCommerz/SurjoPay/
AmarPay integration code in this phase; schema reserves room for it
(see `DATABASE_SCHEMA.md` notes, `ROADMAP.md`).

---

## 1. Payment Methods Offered

| Method | Type | Verification needed? |
|---|---|---|
| Cash on Delivery (COD) | Default | No — pay courier on delivery |
| bKash | Mobile wallet, manual | Yes |
| Nagad | Mobile wallet, manual | Yes |
| Rocket | Mobile wallet, manual | Yes |
| Upay | Mobile wallet, manual | Yes |

## 2. Cash on Delivery Flow

1. Customer selects COD at checkout.
2. Order created, `Payment.method = COD`, `Payment.status = PENDING`.
3. Order auto-advances to `CONFIRMED` (per `ORDER_FLOW.md` §4) —
   optionally subject to a manual admin glance for high-value or
   suspicious orders (configurable threshold, e.g. flag orders over a
   set amount for admin review before dispatch).
4. Courier collects cash on delivery; admin marks order `DELIVERED`.
   `Payment.status` moves to `VERIFIED` upon delivery confirmation
   (cash collection is the verification event for COD).

## 3. Mobile Wallet Flow (bKash / Nagad / Rocket / Upay)

1. Customer selects a wallet method at checkout and places the order.
2. Checkout confirmation screen displays the **Promilaa merchant
   number** for that wallet (static, admin-configurable — not
   hardcoded in the UI) and instructs the customer to send the exact
   order total via that wallet's "Send Money"/"Payment" option.
3. Customer returns to the confirmation screen (or account order
   view) and submits:
   - **Transaction ID** (the ID the wallet app gives after sending money)
   - **Screenshot** of the payment confirmation (uploaded to
     Cloudflare R2 via `POST /orders/:orderNumber/payment-proof`)
4. `Payment.status` becomes `PENDING_VERIFICATION`; `Order.status`
   stays `PENDING`.
5. Order appears in the Admin Panel's **Payment Verification Queue**
   (`GET /admin/payments/pending`) showing screenshot, transaction ID,
   order total, and customer info side by side.
6. Admin either:
   - **Approves**: `PATCH /admin/payments/:id/verify` →
     `Payment.status = VERIFIED`, `verifiedById`, `verifiedAt` set,
     `Order.status` auto-advances to `CONFIRMED`.
   - **Rejects**: `PATCH /admin/payments/:id/reject` with
     `rejectionReason` → `Payment.status = REJECTED`; customer is
     shown the rejection reason on their order status page and
     prompted to resubmit proof or contact support.
7. If no proof is submitted within a configurable window (e.g. 24–48
   hours), the order can be auto-flagged as abandoned/cancelled
   (admin-configurable, not hard-coded).

## 4. Screenshot Upload Rules

- Accepted formats: JPG, PNG, WEBP. Max size: 5MB (adjustable).
- Uploaded to Cloudflare R2 under a per-order folder path (e.g.
  `promilaa/payments/{orderNumber}/`), not publicly listable.
- Screenshot URL only ever exposed to the order's owner and to
  Admin/Staff — never in public API responses.
- Basic server-side validation (file type/size) before accepting
  upload; no OCR/auto-verification in v1 (human review only).

## 5. Fraud & Abuse Considerations (see also `SECURITY.md`)

- Rate-limit `payment-proof` submission endpoint per order/IP to
  prevent spam uploads.
- Duplicate transaction ID detection: warn admin if a submitted
  transaction ID has already been used/verified on a different order
  (possible reuse/fraud attempt).
- Admin rejection always requires a reason (audit trail,
  `Payment.rejectionReason`), visible to customer.

## 6. Admin Panel Requirements for This Flow

Covered fully in `ADMIN_PANEL.md`, summarized here:
- Verification queue sorted by oldest-first (SLA visibility).
- One-click approve/reject with reason field.
- Filter by method (bKash/Nagad/Rocket/Upay) and by date.
- Report: payment method breakdown (`GET /admin/reports/payment-methods`).

## 7. Explicitly Out of Scope (this phase)

- Automated payment gateway callbacks/webhooks (SSLCommerz, SurjoPay,
  AmarPay).
- Automatic transaction verification via wallet APIs.
- Card payments.
- Refund automation (manual process only, tracked via
  `Payment.status = REFUNDED`, no payout API integration).

These remain schema-compatible additions for `ROADMAP.md`, not work
items now.
