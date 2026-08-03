# ROADMAP.md — Promilaa (Post-v1)

Items intentionally deferred out of v1, either by explicit locked
decision (`MASTER_CONTEXT.md`) or flagged as open/unspecified in the
source docs (`PRD.md` §8). Nothing here is scheduled — this is a
backlog of well-understood future work, not a commitment.

## Payments
- **Automated gateway integration**: SSLCommerz, SurjoPay, AmarPay —
  schema already reserves room (`PaymentMethod` enum is additive-
  extensible, `DATABASE_SCHEMA.md`). Would replace/supplement the
  manual screenshot-verification flow with automated webhook
  confirmation.
- Card payment support (via one of the above gateways).
- Partial/split payments per order (would change `Payment` from 1:1
  to 1:many with `Order`).
- Automated refund processing (currently manual, tracked via status
  only).

## Fulfillment
- Courier/logistics API integration (currently fully manual status
  updates in admin).
- Formal returns/exchange workflow (schema has a `RETURNED` status
  placeholder only — full flow, including return reason capture,
  restocking rules, and refund linkage, is undesigned).
- Order tracking page with live courier status.

## Customer Experience
- Native mobile app (iOS/Android).
- Multi-currency / multi-country checkout.
- Loyalty points / rewards program.
- Live chat or support widget.
- Bengali (`bn`) locale — groundwork left open per
  `MASTER_CONTEXT.md` §4/`SEO_GUIDE.md` §9, not built in v1.
- Persistent multi-device cart (would require a `Cart`/`CartItem`
  server model, currently client-side only).
- Email/SMS order notifications (requires selecting a provider —
  flagged as a possible v1 prerequisite in `ORDER_FLOW.md` §7 if the
  business decides it's launch-critical).

## Admin & Operations
- Staff role with scoped permissions (schema supports `STAFF` role
  already; UI/permission enforcement not built until needed).
- CSV export on reports.
- Automated fraud scoring beyond duplicate-transaction-ID detection.
- Two-factor authentication for admin accounts.
- Bulk product import/export tooling.

## Platform
- Multi-vendor / marketplace support.
- A/B testing framework for homepage/collection layout.
- Formal penetration test ahead of a major traffic scale-up.
- Prisma Accelerate or equivalent if serverless backend deployment is
  pursued later (see `DEPLOYMENT.md` §2 note on Express/Prisma
  connection pooling).

## Process Note

When any roadmap item is picked up, it should get its own addition to
(or spin-off from) `DATABASE_SCHEMA.md`, `API_SPEC.md`, and the
relevant flow doc — not be implemented ad hoc. Update
`MASTER_CONTEXT.md` §3 if a previously "locked" decision changes as a
result (e.g. moving from manual to automated payments).
