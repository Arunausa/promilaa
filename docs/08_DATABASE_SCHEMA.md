# 08_DATABASE_SCHEMA.md

# Database Schema

Project: Promilaa

Database

PostgreSQL

ORM

Prisma

Version

1.0

---

# Overview

The database must be normalized.

Avoid duplicate data.

Use UUID as the primary key for every table.

Use timestamps on every table.

Every table should include:

id

createdAt

updatedAt

Soft delete support where necessary.

---

# Core Tables

Users

Addresses

Products

Categories

Collections

ProductVariants

ProductImages

Inventory

Coupons

Cart

CartItems

Orders

OrderItems

Payments

PaymentProofs

Reviews

Wishlists

NewsletterSubscribers

Banners

Notifications

FraudReports

AuditLogs

Settings

Admins

Roles

Permissions

Sessions

---

# Users

Stores customer information.

Fields

id

fullName

phone

email

passwordHash

avatar

isVerified

status

lastLogin

createdAt

updatedAt

---

# Addresses

Linked to Users.

Fields

id

userId

receiverName

phone

district

area

postalCode

addressLine

landmark

isDefault

---

# Categories

Examples

Kurti

One Piece

Two Piece

Three Piece

Fields

id

name

slug

description

image

status

sortOrder

---

# Collections

Examples

New Arrival

Best Seller

Eid Collection

Summer Collection

Fields

id

name

slug

banner

description

status

---

# Products

Fields

id

categoryId

name

slug

shortDescription

description

fabric

pattern

neckType

sleeveType

occasion

careInstructions

sku

brand

regularPrice

salePrice

costPrice

seoTitle

seoDescription

status

featured

publishedAt

---

# Product Variants

Fields

id

productId

size

color

stock

priceOverride

sku

barcode

weight

---

# Product Images

Fields

id

productId

variantId

imageUrl

altText

sortOrder

---

# Inventory

Fields

id

variantId

currentStock

reservedStock

availableStock

lowStockThreshold

lastUpdated

---

# Coupons

Fields

id

code

type

value

minimumOrder

maximumDiscount

usageLimit

usedCount

startsAt

expiresAt

status

---

# Cart

Fields

id

userId

guestToken

subtotal

discount

shippingFee

total

---

# Cart Items

Fields

id

cartId

productId

variantId

quantity

price

subtotal

---

# Orders

Fields

id

orderNumber

userId

guestPhone

guestName

addressId

subtotal

discount

shippingFee

total

paymentMethod

paymentStatus

orderStatus

fraudStatus

notes

---

# Order Items

Fields

id

orderId

productId

variantId

quantity

price

subtotal

---

# Payments

Fields

id

orderId

method

amount

status

transactionId

senderNumber

verifiedBy

verifiedAt

---

# Payment Proof

Fields

id

paymentId

imageUrl

cloudflareKey

uploadedAt

---

# Reviews

Fields

id

userId

productId

rating

comment

status

adminReply

---

# Wishlist

Fields

id

userId

productId

createdAt

---

# Newsletter

Fields

id

email

status

subscribedAt

---

# Banner

Fields

id

title

imageUrl

link

position

status

startDate

endDate

---

# Notifications

Fields

id

userId

title

message

type

isRead

---

# Fraud Reports

Fields

id

orderId

phone

riskLevel

riskScore

providerResults

reason

checkedAt

---

# Admin

Fields

id

name

email

passwordHash

roleId

status

lastLogin

---

# Roles

Super Admin

Admin

Manager

Support

Inventory

---

# Permissions

Each role stores multiple permissions.

Permission examples

Manage Products

Manage Orders

Manage Payments

Manage Customers

Manage Coupons

Manage Admins

View Reports

Manage Settings

---

# Sessions

JWT Session

Refresh Token

Expiry

IP

User Agent

---

# Audit Logs

Stores:

Login

Logout

Create

Update

Delete

Payment Approval

Coupon Changes

Admin Actions

---

# Settings

Store

Store Name

Logo

Contact

Social Links

Shipping Fee

Payment Numbers

Business Hours

SEO Defaults

---

# Relationships

User

↓

Addresses

↓

Orders

↓

Payments

↓

Payment Proof

---

Category

↓

Products

↓

Variants

↓

Images

↓

Inventory

---

User

↓

Wishlist

↓

Reviews

↓

Orders

---

Orders

↓

Order Items

↓

Fraud Report

↓

Payment

---

# Enums

User Status

ACTIVE

INACTIVE

BLOCKED

---

Product Status

DRAFT

PUBLISHED

ARCHIVED

OUT_OF_STOCK

---

Order Status

PENDING

CONFIRMED

PACKED

READY_TO_SHIP

SHIPPED

DELIVERED

CANCELLED

---

Payment Status

PENDING

VERIFIED

PAID

FAILED

REJECTED

---

Fraud Status

LOW

MEDIUM

HIGH

UNKNOWN

---

Coupon Type

PERCENTAGE

FIXED

---

Banner Position

HOME_TOP

HOME_MIDDLE

HOME_BOTTOM

CATEGORY

---

Indexes

Unique

email

phone

slug

sku

orderNumber

couponCode

transactionId

Composite

productId + variantId

categoryId + status

orderStatus + paymentStatus

fraudStatus + createdAt

---

Constraints

Phone must be unique.

SKU must be unique.

Slug must be unique.

Stock cannot be negative.

Sale price cannot exceed regular price.

Shipping fee calculated only by backend.

---

Storage

Images

Cloudflare R2

Database stores only URLs and object keys.

---

Migration Rules

Use Prisma Migrations.

Never modify production tables manually.

Always create migration files.

Never delete production data through migrations.

---

AI Agent Rules

Use UUIDs.

Use foreign keys.

Enable cascading only where appropriate.

Never duplicate product data across tables.

Always normalize relationships.

Keep schema extensible for future features without breaking Version 1.