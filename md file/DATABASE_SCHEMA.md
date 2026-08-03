# DATABASE_SCHEMA.md — Promilaa

PostgreSQL via Prisma ORM, per locked decision in `MASTER_CONTEXT.md`.
This is the reference schema — the actual `schema.prisma` file should
match this document; if they drift, update both together.

---

## Entity Overview

```
User ─┬─< Order >─┬─< OrderItem >── ProductVariant ── Product ── Category
      │            ├─< Payment
      │            └─< ShippingAddress (snapshot)
      ├─< Address (saved)
      ├─< Wishlist >── Product
      └─< Review >── Product

Product ─┬─< ProductVariant (size, color, sku, stock)
         ├─< ProductImage
         └─< Category (many-to-one, or many-to-many if sub-categories needed)

Coupon ── (standalone, referenced by Order)
Banner ── (standalone, admin-managed)
InventoryLog ── ProductVariant (audit trail of stock changes)
```

## Prisma Schema (reference)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  CUSTOMER
  ADMIN
  STAFF
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  RETURNED
}

enum PaymentMethod {
  COD
  BKASH
  NAGAD
  ROCKET
  UPAY
}

enum PaymentStatus {
  PENDING              // COD, awaiting delivery
  PENDING_VERIFICATION // wallet payment, awaiting admin review
  VERIFIED
  REJECTED
  REFUNDED
}

enum CouponType {
  PERCENTAGE
  FLAT
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  name          String
  phone         String?
  role          Role      @default(CUSTOMER)
  isBlocked     Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  orders        Order[]
  addresses     Address[]
  wishlist      Wishlist[]
  reviews       Review[]
}

model Address {
  id         String   @id @default(cuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  label      String?  // "Home", "Office"
  fullName   String
  phone      String
  line1      String
  line2      String?
  city       String
  district   String
  postalCode String?
  isDefault  Boolean  @default(false)
  createdAt  DateTime @default(now())
}

model Category {
  id       String    @id @default(cuid())
  name     String
  slug     String    @unique
  parentId String?
  parent   Category? @relation("CategoryToCategory", fields: [parentId], references: [id])
  children Category[] @relation("CategoryToCategory")
  gender   String?   // "men" | "women" | "unisex"
  products Product[]
}

model Product {
  id           String   @id @default(cuid())
  name         String
  slug         String   @unique
  description  String
  basePrice    Decimal  @db.Decimal(10, 2)
  compareAtPrice Decimal? @db.Decimal(10, 2)
  categoryId   String
  category     Category @relation(fields: [categoryId], references: [id])
  isPublished  Boolean  @default(true)
  isFeatured   Boolean  @default(false)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  variants     ProductVariant[]
  images       ProductImage[]
  reviews      Review[]
  wishlistedBy Wishlist[]
}

model ProductVariant {
  id        String   @id @default(cuid())
  productId String
  product   Product  @relation(fields: [productId], references: [id])
  sku       String   @unique
  size      String
  color     String
  price     Decimal? @db.Decimal(10, 2) // overrides basePrice if set
  stock     Int      @default(0)

  orderItems    OrderItem[]
  inventoryLogs InventoryLog[]
}

model ProductImage {
  id        String  @id @default(cuid())
  productId String
  product   Product @relation(fields: [productId], references: [id])
  url       String  // Cloudflare Images URL
  altText   String
  position  Int     @default(0)
}

model Order {
  id              String        @id @default(cuid())
  orderNumber     String        @unique // human-readable, e.g. PRM-100234
  userId          String?
  user            User?         @relation(fields: [userId], references: [id])
  guestEmail      String?       // for guest checkout
  guestPhone      String?
  status          OrderStatus   @default(PENDING)
  subtotal        Decimal       @db.Decimal(10, 2)
  shippingFee     Decimal       @db.Decimal(10, 2)
  discountAmount  Decimal       @default(0) @db.Decimal(10, 2)
  total           Decimal       @db.Decimal(10, 2)
  couponId        String?
  coupon          Coupon?       @relation(fields: [couponId], references: [id])
  shippingAddress Json          // snapshot at time of order
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  items    OrderItem[]
  payment  Payment?
}

model OrderItem {
  id        String         @id @default(cuid())
  orderId   String
  order     Order          @relation(fields: [orderId], references: [id])
  variantId String
  variant   ProductVariant @relation(fields: [variantId], references: [id])
  quantity  Int
  unitPrice Decimal        @db.Decimal(10, 2)
}

model Payment {
  id              String        @id @default(cuid())
  orderId         String        @unique
  order           Order         @relation(fields: [orderId], references: [id])
  method          PaymentMethod
  status          PaymentStatus @default(PENDING)
  transactionId   String?       // customer-submitted, for wallet methods
  screenshotUrl   String?       // Cloudflare Images URL
  verifiedById    String?       // admin User.id who verified
  verifiedAt      DateTime?
  rejectionReason String?
  createdAt       DateTime      @default(now())
}

model Wishlist {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  productId String
  product   Product  @relation(fields: [productId], references: [id])
  createdAt DateTime @default(now())

  @@unique([userId, productId])
}

model Review {
  id        String   @id @default(cuid())
  productId String
  product   Product  @relation(fields: [productId], references: [id])
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  rating    Int      // 1-5
  title     String?
  body      String
  isApproved Boolean @default(true)
  createdAt DateTime @default(now())
}

model Coupon {
  id           String     @id @default(cuid())
  code         String     @unique
  type         CouponType
  value        Decimal    @db.Decimal(10, 2)
  minOrderAmount Decimal? @db.Decimal(10, 2)
  maxUses      Int?
  usedCount    Int        @default(0)
  startsAt     DateTime?
  expiresAt    DateTime?
  isActive     Boolean    @default(true)

  orders Order[]
}

model Banner {
  id        String   @id @default(cuid())
  title     String
  imageUrl  String
  linkUrl   String?
  placement String   // "homepage_hero" | "collection_top" | ...
  position  Int      @default(0)
  isActive  Boolean  @default(true)
  startsAt  DateTime?
  endsAt    DateTime?
}

model InventoryLog {
  id        String         @id @default(cuid())
  variantId String
  variant   ProductVariant @relation(fields: [variantId], references: [id])
  change    Int            // +/- delta
  reason    String         // "order_placed" | "restock" | "manual_adjustment" | "order_cancelled"
  createdAt DateTime       @default(now())
}
```

## Notes & Conventions

- Money fields use `Decimal(10,2)` — never `Float`, to avoid rounding
  errors on prices/totals.
- `Order.shippingAddress` is a JSON **snapshot**, not a live FK to
  `Address`, so historical orders remain accurate if a user edits or
  deletes a saved address later.
- `Payment` is 1:1 with `Order` in v1 (single payment attempt per
  order). If partial/split payments are ever needed, this becomes
  1:many — flagged in `ROADMAP.md`, not built now.
- `PaymentMethod` enum intentionally excludes gateway-specific values
  (SSLCommerz etc.) per the locked "manual only" decision — extending
  the enum later is a additive, non-breaking migration.
- `InventoryLog` gives the admin panel's inventory reports an audit
  trail without recomputing history from orders each time.
- Indexes to add in the real Prisma file (omitted above for
  readability): `Product.slug`, `Order.orderNumber`,
  `Order.userId`, `Payment.status`, `ProductVariant.productId`.
