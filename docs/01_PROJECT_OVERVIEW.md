# 01_PROJECT_OVERVIEW.md

# Promilaa — Project Overview

Version: 1.0

Status: Production

---

# 1. Executive Summary

Promilaa is a Bangladesh-based premium women's fashion eCommerce brand.

The company specializes in carefully curated women's ethnic fashion with a strong emphasis on quality, trust, simplicity, and customer experience.

Unlike a marketplace, Promilaa owns and manages every product sold through its platform.

Version 1 focuses exclusively on women's fashion and aims to deliver a premium online shopping experience optimized for Bangladeshi customers.

---

# 2. Mission

To make premium-quality women's fashion easily accessible across Bangladesh through a trusted, elegant, and technology-driven shopping experience.

---

# 3. Vision

To become one of Bangladesh's most trusted and recognizable premium women's fashion brands.

Promilaa should not compete by offering thousands of products.

Instead, it should compete through:

- Better quality
- Better presentation
- Better customer experience
- Better trust
- Better after-sales service

---

# 4. Business Model

Business Type

B2C (Business to Consumer)

Brand Model

Single Brand

Inventory Model

Inventory Managed

Sales Channel

Direct-to-Customer

Not Supported

- Marketplace
- Multi Vendor
- Dropshipping
- Wholesale Marketplace

---

# 5. Target Market

Primary Market

Bangladesh

Primary Audience

Women

Age

16–45 Years

Shopping Behaviour

- Mobile-first
- Facebook & Instagram users
- Cash on Delivery preferred
- Value trust over low prices
- Frequently shop during festivals and seasonal campaigns

---

# 6. Product Categories (Version 1)

Core Categories

- Kurti
- One Piece
- Two Piece
- Three Piece

Homepage Collections

- New Arrival
- Best Seller
- Trending
- Premium Collection
- Eid Collection
- Festive Collection
- Summer Collection
- Winter Collection
- Casual Collection

Future Categories (Not Included in V1)

- Men's Fashion
- Accessories
- Footwear
- Cosmetics
- Perfume

---

# 7. Business Objectives

The platform should enable customers to:

- Browse collections easily
- Discover new arrivals
- Search products quickly
- Filter products efficiently
- View detailed product information
- Place secure orders
- Complete checkout with minimal friction
- Track orders
- Create optional customer accounts

The platform should enable administrators to:

- Manage products
- Manage categories
- Manage collections
- Manage inventory
- Process orders
- Verify manual payments
- Review fraud status
- Manage customers
- Publish promotional banners
- Generate reports

---

# 8. Customer Journey

Typical Customer Flow

Homepage

↓

Browse Collection

↓

Open Product

↓

Select Size

↓

Add to Cart

↓

Checkout

↓

Choose Payment Method

↓

Order Confirmation

↓

Admin Processing

↓

Shipping

↓

Delivery

---

# 9. Core Business Principles

Promilaa prioritizes:

1. Customer Trust
2. Product Quality
3. Clean Shopping Experience
4. Fast Website Performance
5. Accurate Product Information
6. Reliable Delivery
7. Secure Transactions

---

# 10. Unique Selling Points

Compared to many local fashion stores, Promilaa emphasizes:

- Premium branding
- Minimal and elegant UI
- Fast shopping experience
- Detailed product information
- Secure checkout
- Fraud prevention
- Professional product photography
- Curated collections instead of overwhelming catalogs

---

# 11. Competitive Positioning

Promilaa is positioned between:

Traditional Facebook clothing sellers

and

Large international fashion brands.

The goal is to combine:

- Local fashion understanding
- Modern technology
- Premium presentation
- Trustworthy service

---

# 12. Technology Overview

Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion

Backend

- Node.js
- Express
- TypeScript

Database

- PostgreSQL
- Prisma ORM

Storage

- Cloudflare R2

Authentication

- JWT

Deployment

Frontend

- Vercel

Backend

- Node.js compatible hosting (including cPanel environments with Node.js support)

Database

- Managed PostgreSQL

---

# 13. Payments

Version 1

- Cash on Delivery
- Manual bKash
- Manual Nagad
- Manual Rocket

Future

- SSLCommerz
- SurjoPay
- AmarPay

Payment architecture must remain modular for future gateway integrations.

---

# 14. Fraud Prevention

Every order should pass through the FraudService.

The fraud engine will use merchant-authorized courier integrations such as:

- Pathao
- Steadfast
- RedX
- Paperfly
- CarryBee

Orders will be classified into:

- Low Risk
- Medium Risk
- High Risk
- Unknown

This information assists administrators in reviewing potentially fraudulent orders.

---

# 15. Success Metrics

Version 1 will be considered successful if:

Business Metrics

- Increased customer trust
- High order completion rate
- Reduced fake orders
- Increased repeat customers

Technical Metrics

- Fast page load
- Mobile responsiveness
- Stable backend
- Secure APIs
- High Lighthouse scores
- SEO-friendly pages

Operational Metrics

- Easy inventory management
- Faster order processing
- Reliable payment verification
- Efficient admin workflow

---

# 16. Project Scope

Included

- Customer Website
- Admin Dashboard
- Product Management
- Order Management
- Manual Payment Verification
- Fraud Detection
- Customer Accounts
- Guest Checkout
- Coupons
- SEO
- Analytics Foundation

Not Included

- Multi Vendor
- Mobile Apps
- Affiliate Program
- Loyalty Points
- AI Recommendations
- International Shipping
- Subscription Products

---

# 17. Long-Term Roadmap

Future versions may include:

- Mobile Applications
- AI Product Recommendations
- Personalized Search
- Loyalty Program
- Gift Cards
- Affiliate System
- Men's Fashion
- Accessories
- International Shipping
- Multiple Warehouses
- ERP Integration

These features are intentionally excluded from Version 1.

---

# 18. Conclusion

Promilaa is not just an online store.

It is the digital foundation of a premium Bangladeshi women's fashion brand.

Every engineering, design, and product decision should reinforce:

- Trust
- Simplicity
- Premium experience
- Performance
- Scalability
- Long-term maintainability

When making implementation decisions, always prioritize the customer experience while preserving clean architecture and future extensibility.