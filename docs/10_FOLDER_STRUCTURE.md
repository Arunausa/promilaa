# 10_FOLDER_STRUCTURE.md

# Folder Structure

Project: Promilaa

Version: 1.0

Status: Production

---

# Overview

Promilaa follows a modular monorepo architecture.

Frontend and Backend are completely separated but share common types and utilities where appropriate.

Every feature should have a predictable location.

Avoid dumping files into large generic folders.

Prefer feature-based organization over file-type organization.

---

# Project Structure

promilaa/

apps/

frontend/

backend/

packages/

shared/

docs/

scripts/

docker/

.github/

---

# Frontend

apps/frontend/

app/

components/

features/

hooks/

lib/

services/

store/

styles/

types/

utils/

public/

middleware.ts

next.config.ts

tailwind.config.ts

tsconfig.json

---

# App Router

app/

(layout)

(page)

loading.tsx

error.tsx

not-found.tsx

api/

(auth)

(shop)

(admin)

(account)

checkout/

cart/

products/

collections/

search/

wishlist/

orders/

---

# Components

components/

ui/

layout/

common/

forms/

navigation/

buttons/

cards/

dialogs/

modals/

tables/

charts/

icons/

loaders/

---

# Features

features/

auth/

products/

collections/

cart/

checkout/

payment/

wishlist/

reviews/

search/

orders/

notifications/

fraud/

dashboard/

---

# Hooks

hooks/

useAuth

useCart

useWishlist

useDebounce

usePagination

useSearch

useInfiniteScroll

useTheme

---

# Services

services/

api.ts

auth.service.ts

product.service.ts

cart.service.ts

order.service.ts

payment.service.ts

fraud.service.ts

upload.service.ts

---

# Store

store/

auth.store.ts

cart.store.ts

wishlist.store.ts

ui.store.ts

---

# Types

types/

auth.ts

user.ts

product.ts

order.ts

payment.ts

review.ts

coupon.ts

fraud.ts

---

# Utils

utils/

currency.ts

date.ts

validators.ts

helpers.ts

constants.ts

slug.ts

storage.ts

---

# Backend

apps/backend/

src/

config/

controllers/

routes/

middlewares/

services/

repositories/

prisma/

validators/

utils/

types/

interfaces/

constants/

jobs/

events/

uploads/

server.ts

---

# Config

config/

database.ts

jwt.ts

env.ts

cloudflare.ts

cors.ts

helmet.ts

logger.ts

---

# Controllers

controllers/

auth/

products/

categories/

collections/

cart/

checkout/

orders/

payments/

reviews/

wishlist/

dashboard/

admin/

---

# Routes

routes/

auth.routes.ts

product.routes.ts

cart.routes.ts

order.routes.ts

payment.routes.ts

review.routes.ts

admin.routes.ts

---

# Services

services/

auth/

products/

orders/

payments/

fraud/

upload/

email/

sms/

coupon/

inventory/

notification/

analytics/

---

# Fraud Service

services/fraud/

FraudEngine.ts

FraudService.ts

providers/

PathaoProvider.ts

SteadfastProvider.ts

RedXProvider.ts

PaperflyProvider.ts

CarryBeeProvider.ts

interfaces/

FraudProvider.ts

---

# Repositories

repositories/

UserRepository.ts

ProductRepository.ts

OrderRepository.ts

PaymentRepository.ts

ReviewRepository.ts

InventoryRepository.ts

CouponRepository.ts

---

# Validators

validators/

auth.validator.ts

product.validator.ts

checkout.validator.ts

payment.validator.ts

coupon.validator.ts

review.validator.ts

---

# Middlewares

middlewares/

auth.ts

admin.ts

validation.ts

upload.ts

error.ts

rateLimit.ts

logger.ts

---

# Prisma

prisma/

schema.prisma

migrations/

seed.ts

---

# Jobs

jobs/

inventory.job.ts

coupon.job.ts

notification.job.ts

cleanup.job.ts

---

# Events

events/

orderCreated.ts

paymentVerified.ts

stockUpdated.ts

orderDelivered.ts

---

# Shared Package

packages/shared/

types/

constants/

validators/

schemas/

utils/

---

# Documentation

docs/

00_MASTER_CONTEXT.md

01_PROJECT_OVERVIEW.md

02_PRD.md

...

---

# Naming Convention

Folders

lowercase

Files

feature-name.ts

Components

PascalCase

Hooks

useSomething

Types

SomethingType

Interfaces

ISomething

Enums

SomethingEnum

Constants

UPPER_SNAKE_CASE

---

# Import Rules

Prefer absolute imports.

Avoid deep relative imports.

Bad

../../../../

Good

@/components

@/features

@/services

---

# Architecture Rules

UI

↓

Feature

↓

Service

↓

API

↓

Backend

↓

Repository

↓

Database

Never bypass layers.

---

# File Size Rules

Component

<300 lines

Service

<400 lines

Controller

<200 lines

Split large files.

---

# Component Rules

Reusable

Single Responsibility

Typed

Accessible

Responsive

---

# API Rules

Thin Controllers

Business Logic in Services

Database only through Repository/Prisma

---

# Environment Files

Frontend

.env.local

Backend

.env

Never commit secrets.

---

# Public Assets

public/

images/

icons/

logos/

banners/

favicons/

---

# Storage

Cloudflare R2

Database stores only URLs and object keys.

Never store binary files in PostgreSQL.

---

# Testing Structure

tests/

unit/

integration/

e2e/

fixtures/

mocks/

---

# AI Agent Rules

Never create random folders.

Follow this structure strictly.

Reuse existing modules before creating new ones.

Do not duplicate utilities.

Keep business logic inside services.

Keep UI components reusable.

Keep folder names consistent.

Do not mix frontend and backend code.

Always place new files in the correct module.

If a new feature is introduced, integrate it into the existing structure instead of creating parallel architectures.