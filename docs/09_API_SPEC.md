# 09_API_SPEC.md

# API Specification

Project: Promilaa

Version: 1.0

API Style

REST API

Base URL

/api/v1

Content Type

application/json

Authentication

JWT

Versioning

URI Versioning

/api/v1

---

# API Principles

RESTful

Stateless

Secure

Fast

Predictable

Consistent Response Format

---

# Standard Response

Success

{
  success: true,
  message: "",
  data: {}
}

Error

{
  success: false,
  message: "",
  errors: []
}

---

# Authentication APIs

POST

/auth/register

POST

/auth/login

POST

/auth/logout

POST

/auth/refresh

POST

/auth/forgot-password

POST

/auth/reset-password

GET

/auth/me

PUT

/auth/profile

PUT

/auth/change-password

---

# Customer APIs

GET

/customers/profile

PUT

/customers/profile

GET

/customers/orders

GET

/customers/wishlist

GET

/customers/addresses

POST

/customers/address

PUT

/customers/address/:id

DELETE

/customers/address/:id

---

# Category APIs

GET

/categories

GET

/categories/:slug

Admin

POST

/categories

PUT

/categories/:id

DELETE

/categories/:id

---

# Collection APIs

GET

/collections

GET

/collections/:slug

Admin

POST

/collections

PUT

/collections/:id

DELETE

/collections/:id

---

# Product APIs

GET

/products

GET

/products/:slug

GET

/products/featured

GET

/products/new-arrival

GET

/products/best-seller

GET

/products/search

GET

/products/recommended

Admin

POST

/products

PUT

/products/:id

DELETE

/products/:id

---

# Product Variant APIs

GET

/products/:id/variants

POST

/products/:id/variants

PUT

/products/variants/:id

DELETE

/products/variants/:id

---

# Product Image APIs

POST

/products/:id/images

DELETE

/products/images/:id

PUT

/products/images/sort

---

# Inventory APIs

GET

/inventory

GET

/inventory/:productId

PUT

/inventory/:variantId

GET

/inventory/low-stock

---

# Wishlist APIs

GET

/wishlist

POST

/wishlist

DELETE

/wishlist/:productId

---

# Cart APIs

GET

/cart

POST

/cart

PUT

/cart/item/:id

DELETE

/cart/item/:id

DELETE

/cart/clear

---

# Coupon APIs

POST

/coupons/apply

GET

/coupons

Admin

POST

/coupons

PUT

/coupons/:id

DELETE

/coupons/:id

---

# Checkout APIs

POST

/checkout

GET

/checkout/shipping

POST

/checkout/validate

---

# Order APIs

POST

/orders

GET

/orders

GET

/orders/:id

GET

/orders/track

PUT

/orders/cancel

Admin

PUT

/orders/status

PUT

/orders/assign-courier

---

# Payment APIs

POST

/payments

POST

/payments/upload-proof

GET

/payments/:orderId

Admin

PUT

/payments/verify

PUT

/payments/reject

---

# Fraud APIs

POST

/fraud/check

GET

/fraud/report/:orderId

GET

/fraud/history

Admin

POST

/fraud/recheck

---

# Review APIs

GET

/reviews/:productId

POST

/reviews

PUT

/reviews/:id

DELETE

/reviews/:id

Admin

PUT

/reviews/approve

PUT

/reviews/reject

---

# Banner APIs

GET

/banners

Admin

POST

/banners

PUT

/banners/:id

DELETE

/banners/:id

---

# Newsletter APIs

POST

/newsletter/subscribe

DELETE

/newsletter/unsubscribe

---

# Notification APIs

GET

/notifications

PUT

/notifications/read

DELETE

/notifications/:id

---

# Admin Dashboard APIs

GET

/admin/dashboard

GET

/admin/statistics

GET

/admin/recent-orders

GET

/admin/revenue

GET

/admin/top-products

GET

/admin/customers

---

# Settings APIs

GET

/settings

PUT

/settings

---

# Upload APIs

POST

/upload/image

POST

/upload/payment-proof

POST

/upload/banner

Storage

Cloudflare R2

---

# Search APIs

GET

/search

Supports

Products

Categories

Collections

---

# Filter APIs

GET

/products

Supported Query Params

category

collection

size

color

priceMin

priceMax

availability

discount

sort

page

limit

---

# Pagination

?page=1

&limit=20

---

# Sorting

Newest

Oldest

Price Low to High

Price High to Low

Best Seller

Popularity

Highest Rated

Discount

---

# Authentication Rules

Guest Access

Homepage

Collections

Products

Search

Wishlist (Temporary)

Cart

Checkout

Track Order

Login Required

Profile

Addresses

Wishlist Sync

Order History

Reviews

---

# Admin Authorization

Super Admin

Full Access

Admin

Product

Order

Payment

Customer

Support

View Orders

Inventory

Inventory Only

---

# Validation Rules

Validate every request.

Validate

Phone

Email

Price

Stock

UUID

Slug

Coupon

Transaction ID

Uploads

Never trust frontend.

---

# Error Codes

200

OK

201

Created

400

Bad Request

401

Unauthorized

403

Forbidden

404

Not Found

409

Conflict

422

Validation Failed

429

Rate Limited

500

Server Error

---

# Rate Limiting

Login

Password Reset

Fraud Check

Checkout

Payment Upload

Admin Login

---

# Security

JWT

Password Hashing

Helmet

CORS

Rate Limit

Input Sanitization

XSS Protection

SQL Injection Protection

Upload Validation

Server-side Validation

---

# Logging

Log

Login

Orders

Payments

Fraud

Admin Actions

API Errors

---

# API Documentation

Generate

OpenAPI

Swagger

Keep documentation synchronized with implementation.

---

# Future APIs

SSLCommerz

SurjoPay

AmarPay

Mobile App

ERP

Affiliate

Loyalty

AI Search

AI Recommendation

These APIs are not implemented in Version 1.

---

# AI Agent Rules

Use REST conventions.

Return consistent JSON.

Never expose sensitive data.

Validate every request.

Keep controllers thin.

Business logic belongs in services.

Database access belongs in repositories/Prisma layer.

Use proper HTTP status codes.

Write production-ready APIs only.