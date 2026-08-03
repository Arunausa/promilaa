# 00_MASTER_CONTEXT.md

# Promilaa — Master Context

Version: 1.0

Status: Production

This document is the SINGLE SOURCE OF TRUTH for the Promilaa project.

Every AI Agent, Developer, Designer, Product Manager and Contributor MUST read this document before reading any other documentation.

If any document conflicts with this one, THIS DOCUMENT ALWAYS WINS.

---

# 1. Project Overview

Promilaa is a Bangladesh-based premium women's fashion eCommerce brand.

Promilaa is NOT a marketplace.

Promilaa is NOT a multi-vendor platform.

Promilaa sells only products owned and managed by the Promilaa brand.

The goal is to build a trusted premium women's fashion brand for Bangladesh.

The website should feel elegant, modern, premium and fast.

Customers should immediately feel that Promilaa is a professionally built fashion brand, not a typical Facebook clothing shop.

---

# 2. Business Vision

Promilaa focuses on high-quality women's ethnic and modest fashion.

The brand prioritizes:

• Premium quality

• Beautiful presentation

• Trust

• Fast delivery

• Simple shopping experience

• Excellent customer support

The long-term goal is to become one of Bangladesh's most trusted online fashion brands.

---

# 3. Product Scope (Version 1)

Version 1 focuses ONLY on women's fashion.

Primary Categories:

• Kurti

• One Piece

• Two Piece

• Three Piece

Collections:

• New Arrival

• Best Seller

• Eid Collection

• Festive Collection

• Summer Collection

• Winter Collection

• Casual Collection

• Premium Collection

Future products such as men's fashion, perfumes, accessories or cosmetics are OUT OF SCOPE for Version 1.

Do not build features specifically for those future products.

---

# 4. Target Audience

Primary Audience

Women

Age:

16–45

Location:

Bangladesh

Shopping Behaviour:

• Mobile-first

• Facebook & Instagram users

• COD preferred

• Trust is more important than discounts

---

# 5. Brand Personality

Promilaa should always feel:

Elegant

Minimal

Premium

Modern

Friendly

Trustworthy

Clean

Never feel:

Cheap

Flashy

Overcrowded

Marketplace-like

Spammy

---

# 6. Design Inspiration

The overall shopping experience should be inspired by premium global brands while respecting Bangladeshi fashion.

Examples:

Zara

COS

Massimo Dutti

Mango

However,

the products, collections and marketing should reflect Bangladeshi women's fashion.

---

# 7. Business Model

Business Type:

B2C

Single Brand

Inventory Managed

No Vendors

No Marketplace

No Dropshipping

---

# 8. Core Business Goals

Increase customer trust.

Increase repeat purchases.

Reduce fake orders.

Improve order management.

Provide a premium shopping experience.

Scale safely.

---

# 9. Technology Stack

Frontend

Next.js

React

TypeScript

Tailwind CSS

shadcn/ui

Framer Motion

Backend

Node.js

Express

TypeScript

Database

PostgreSQL

Prisma ORM

Authentication

JWT

Storage

Cloudflare R2

Image Optimization

Next.js Image

Deployment

Frontend:

Vercel

Backend:

Node.js compatible hosting (must also be deployable on cPanel environments that support Node.js)

Database:

Managed PostgreSQL

---

# 10. Payment Strategy

Version 1

Cash on Delivery

Manual bKash

Manual Nagad

Manual Rocket

Customer submits:

Transaction ID

Sender Number

Payment Screenshot

Admin verifies payment manually.

Future:

SSLCommerz

SurjoPay

AmarPay

Architecture must support future gateways without redesign.

---

# 11. Delivery

Bangladesh only.

Shipping

Dhaka

৳60

Outside Dhaka

৳100

Shipping charge is always calculated by the backend.

Never trust client-side totals.

---

# 12. Fraud Prevention

Every order must go through FraudService before final confirmation.

FraudService uses merchant-owned courier credentials.

Supported Providers:

Pathao

Steadfast

RedX

Paperfly

CarryBee

The Laravel implementation referenced by the project is ONLY a business-logic reference.

The production implementation MUST be written natively in:

Node.js

Express

TypeScript

Each courier provider must be isolated behind a common provider interface.

If one provider fails,

the system must continue using the remaining providers.

Fraud checking must never become a single point of failure.

---

# 13. Authentication

Guest checkout is allowed.

Login is optional.

Customers may:

Create account

Checkout as guest

Track orders

Manage addresses

View order history

---

# 14. Product Philosophy

Quality over quantity.

Curated collections.

Professional photography.

Clear product information.

Accurate sizing.

Detailed descriptions.

Multiple images.

Trust before sales.

---

# 15. Non-Functional Requirements

Fast.

Secure.

Responsive.

Accessible.

SEO friendly.

Scalable.

Maintainable.

Production ready.

---

# 16. AI Agent Rules

Before writing code:

Read every document inside /docs.

Understand all documentation.

Cross-reference every document.

Never skip documentation.

Never assume business rules.

If a business rule is missing,

ask the user.

Never invent pricing.

Never invent policies.

Never invent legal content.

Engineering decisions may be made only when documentation is silent.

---

# 17. Code Quality Rules

Production-quality code only.

No placeholder implementations.

No fake APIs.

No demo code.

No duplicated logic.

Reusable components.

Strong typing.

Proper validation.

Proper error handling.

Clean architecture.

Meaningful file structure.

---

# 18. Security Rules

Validate everything on the server.

Never trust the client.

Never expose secrets.

Hash passwords.

Protect JWT secrets.

Rate-limit sensitive endpoints.

Validate uploads.

Sanitize user input.

---

# 19. Documentation Rules

Documentation is part of the product.

Whenever implementation changes architecture,

the related documentation must also be updated.

Documentation and implementation must never diverge.

---

# 20. Out of Scope (Version 1)

Marketplace

Multi-vendor

International shipping

Subscription products

Affiliate system

Loyalty program

Mobile app

AI recommendations

Virtual try-on

Men's fashion

These belong to future roadmap documents.

---

# 21. Definition of Success

A successful Version 1 launch means:

- Customers can easily browse women's collections.
- Customers can place orders with confidence.
- Admin can efficiently manage products and orders.
- Fake orders are reduced using courier-based fraud detection.
- The website performs well on desktop and mobile.
- The platform is secure, maintainable and ready for future expansion.

---

# Final Rule

When in doubt:

Prioritize:

1. Customer trust
2. Business simplicity
3. Code quality
4. Long-term maintainability
5. Scalability

Never sacrifice these principles for short-term convenience.