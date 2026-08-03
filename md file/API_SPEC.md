# API_SPEC.md — Promilaa REST API

Base URL: `/api/v1`
Auth: JWT Bearer token (`Authorization: Bearer <accessToken>`) unless
marked **Public**. Admin-only routes marked **Admin**.
Full flow context: `AUTH_FLOW.md`, `ORDER_FLOW.md`, `COD_PAYMENT_FLOW.md`.

---

## Auth

| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Create account (email, password, name) |
| POST | `/auth/login` | Public | Returns access + refresh token |
| POST | `/auth/refresh` | Public (refresh token) | Rotate access token |
| POST | `/auth/logout` | Auth | Invalidate refresh token |
| POST | `/auth/forgot-password` | Public | Send reset email |
| POST | `/auth/reset-password` | Public (reset token) | Set new password |
| GET | `/auth/me` | Auth | Current user profile |

## Users / Account

| Method | Path | Access | Description |
|---|---|---|---|
| PATCH | `/users/me` | Auth | Update name/phone |
| GET | `/users/me/addresses` | Auth | List saved addresses |
| POST | `/users/me/addresses` | Auth | Add address |
| PATCH | `/users/me/addresses/:id` | Auth | Update address |
| DELETE | `/users/me/addresses/:id` | Auth | Delete address |
| GET | `/users` | Admin | List/search customers |
| PATCH | `/users/:id/block` | Admin | Block/unblock customer |

## Categories

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/categories` | Public | List categories (tree) |
| POST | `/categories` | Admin | Create category |
| PATCH | `/categories/:id` | Admin | Update category |
| DELETE | `/categories/:id` | Admin | Delete category |

## Products

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/products` | Public | List with filters: `?category=&gender=&size=&color=&minPrice=&maxPrice=&sort=&page=` |
| GET | `/products/:slug` | Public | Product detail incl. variants, images, reviews |
| POST | `/products` | Admin | Create product |
| PATCH | `/products/:id` | Admin | Update product |
| DELETE | `/products/:id` | Admin | Archive/delete product |
| POST | `/products/:id/images` | Admin | Upload image (Cloudflare R2 + Images) |
| DELETE | `/products/:id/images/:imageId` | Admin | Remove image |
| POST | `/products/:id/variants` | Admin | Add variant (size/color/sku/stock) |
| PATCH | `/products/:id/variants/:variantId` | Admin | Update variant/stock |

## Reviews

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/products/:slug/reviews` | Public | List approved reviews |
| POST | `/products/:slug/reviews` | Auth | Submit review (verified purchase optional check) |
| DELETE | `/reviews/:id` | Admin | Remove/moderate review |

## Wishlist

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/wishlist` | Auth | List wishlisted products |
| POST | `/wishlist/:productId` | Auth | Add to wishlist |
| DELETE | `/wishlist/:productId` | Auth | Remove from wishlist |

## Cart

Cart is client-side (local state / cookie) until checkout in v1 — no
persistent server cart table required. Checkout submits the full cart
payload directly to `POST /orders`. (If persistent multi-device cart
is wanted later, add a `Cart`/`CartItem` model — flagged in
`ROADMAP.md`.)

## Coupons

| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/coupons/validate` | Public | `{code, subtotal}` → discount preview |
| GET | `/coupons` | Admin | List coupons |
| POST | `/coupons` | Admin | Create coupon |
| PATCH | `/coupons/:id` | Admin | Update/deactivate coupon |
| DELETE | `/coupons/:id` | Admin | Delete coupon |

## Orders

| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/orders` | Public/Auth | Place order (guest or logged-in); see `ORDER_FLOW.md` for payload shape |
| GET | `/orders/:orderNumber` | Public (+ email/phone check) or Auth | Order status lookup |
| GET | `/orders` | Auth | Current user's order history |
| GET | `/admin/orders` | Admin | List/filter all orders |
| GET | `/admin/orders/:id` | Admin | Full order detail |
| PATCH | `/admin/orders/:id/status` | Admin | Update fulfillment status |
| PATCH | `/admin/orders/:id/cancel` | Admin | Cancel order (restocks inventory) |

## Payments (Bangladesh)

| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/orders/:orderNumber/payment-proof` | Public/Auth | Submit `{transactionId, screenshot}` for wallet payment |
| GET | `/admin/payments/pending` | Admin | Verification queue |
| PATCH | `/admin/payments/:id/verify` | Admin | Approve payment |
| PATCH | `/admin/payments/:id/reject` | Admin | Reject with reason |

## Banners

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/banners?placement=` | Public | Active banners for a placement |
| POST | `/banners` | Admin | Create banner |
| PATCH | `/banners/:id` | Admin | Update/activate/deactivate |
| DELETE | `/banners/:id` | Admin | Delete banner |

## Admin Analytics & Reports

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/admin/analytics/overview` | Admin | Sales, order count, AOV summary for a date range |
| GET | `/admin/analytics/top-products` | Admin | Best sellers |
| GET | `/admin/analytics/low-stock` | Admin | Variants below threshold |
| GET | `/admin/reports/sales?from=&to=` | Admin | Time-series sales report |
| GET | `/admin/reports/payment-methods` | Admin | Breakdown by COD/bKash/Nagad/Rocket/Upay |

## Conventions

- All list endpoints support `?page=&limit=` pagination and return
  `{ data, meta: { page, limit, total } }`.
- All error responses: `{ error: { code, message, fields? } }` with
  appropriate HTTP status (400/401/403/404/409/422/500).
- All admin routes require `role IN (ADMIN, STAFF)` per route
  sensitivity — full mapping in `SECURITY.md`.
- Rate limiting applied to `/auth/*` and `/orders/:orderNumber/payment-proof`
  per `SECURITY.md`.
