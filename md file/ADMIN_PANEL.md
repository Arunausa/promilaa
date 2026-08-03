# ADMIN_PANEL.md — Promilaa Admin Panel Spec

Expands `05_ADMIN_PANEL.md`. UX principles in `UI_UX_GUIDELINES.md`
§8; components in `COMPONENT_LIBRARY.md` (Admin-Only section);
endpoints in `API_SPEC.md`.

---

## 1. Access

- Route namespace `/admin/*`, gated to `role IN (ADMIN, STAFF)`.
- Login shares the same auth system as the storefront (`AUTH_FLOW.md`)
  — no separate admin login system.
- **Staff** role (phase 2, optional): scoped to Orders + Payment
  Verification + Inventory only, no Coupons/Banners/Reports/Settings
  access. Build the role check generically so this is a config change,
  not a rewrite, when needed.

## 2. Dashboard / Analytics

- Overview cards: revenue (selectable date range), order count,
  average order value, pending payment verifications count (badge/
  alert — this is the most time-sensitive queue).
- Sales chart over time (daily/weekly/monthly toggle).
- Top-selling products.
- Low-stock alert list (configurable threshold per variant).

## 3. Product Management

- List view: searchable/filterable table (category, published status,
  stock level).
- Create/edit: name, slug (auto-generated, editable), description,
  category, base price, compare-at price, featured toggle, published
  toggle.
- Variant management: add/edit size+color combinations with
  independent SKU, price override, and stock count per variant.
- Image management: upload (Cloudflare R2), reorder, set alt text,
  delete.
- Bulk actions: publish/unpublish, category reassignment.

## 4. Category Management

- Create/edit/delete categories, support parent/child nesting (e.g.
  Women > Dresses > Midi Dresses), assign gender tag (men/women/
  unisex) for storefront nav filtering.

## 5. Order Management

- List view: searchable/filterable by status, payment method, date
  range, customer.
- Detail view: full line items, customer info, shipping address
  snapshot, payment info (method, status, transaction ID, screenshot
  thumbnail), status history.
- Status update control (`OrderStatusStepper`) enforcing valid
  transitions per `ORDER_FLOW.md` §4 (no skipping backward
  illogically without explicit override + reason).
- Cancel action (with reason, triggers restock per `ORDER_FLOW.md` §5).

## 6. Payment Verification Queue

The single most operationally important screen — must be fast:
- List of `PENDING_VERIFICATION` payments, oldest first.
- Each row/card: screenshot (click to enlarge), transaction ID
  (copyable), order total, order number, customer name/phone.
- One-click **Approve** / **Reject** (reject requires a reason,
  free-text or preset reasons like "amount mismatch",
  "transaction ID not found", "duplicate transaction ID").
- Filter by payment method (bKash/Nagad/Rocket/Upay) and date.
- Full detail in `COD_PAYMENT_FLOW.md`.

## 7. Customer Management

- List/search customers, view profile + order history + total spend.
- Block/unblock (prevents login, does not delete data).
- No direct password reset from admin (customer self-serves via
  `AUTH_FLOW.md` reset flow) unless a support-driven exception is
  needed later.

## 8. Coupon Management

- List, create, edit, deactivate coupons.
- Fields: code, type (percentage/flat), value, min order amount, max
  uses, usage count (read-only), start/expiry dates, active toggle.
- Usage report: which coupons drove how many orders/how much
  discount (part of Reports, §11).

## 9. Inventory Management

- Per-variant stock view/edit, tied to `InventoryLog` for audit trail.
- Manual stock adjustment (with reason: restock, correction, damage).
- Low-stock threshold configurable globally or per-product.

## 10. Banner Management

- Create/edit/delete banners: image (Cloudflare R2), title, link,
  placement (homepage hero, collection top, etc.), position/order,
  active toggle, optional scheduling (start/end date).
- Preview before publish.

## 11. Reports

- Sales over time (date range selectable, exportable as CSV —
  nice-to-have, confirm if required for v1).
- Best sellers / worst sellers.
- Payment method breakdown (COD vs. each wallet — informs whether to
  prioritize a given gateway integration in `ROADMAP.md`).
- Coupon performance.

## 12. Settings (minimal v1 scope)

- Store contact info, wallet merchant numbers (bKash/Nagad/Rocket/
  Upay numbers shown to customers at checkout — see
  `COD_PAYMENT_FLOW.md` §3), shipping fee configuration, low-stock
  threshold default.

## 13. Admin Panel Non-Functional Notes

- Admin bundle is code-split from the storefront bundle (performance
  — see `PERFORMANCE.md`; admin users don't need storefront JS and
  vice versa).
- Data tables must handle real-world scale (pagination, server-side
  filtering, not client-side filtering of the entire table).
- Every destructive/irreversible action (delete product, reject
  payment, cancel order) requires a confirmation step.
