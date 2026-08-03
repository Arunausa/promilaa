# 25_ENVIRONMENT_VARIABLES.md

# Environment Variables

Project: Promilaa

Version: 1.0

Status: Production

Priority: Critical

---

# Overview

All sensitive configuration must be stored in environment variables.

Never hardcode secrets, credentials, API keys or URLs inside the source code.

Every environment (Development, Staging, Production) should have its own environment configuration.

Never commit any `.env` file to Git.

---

# Environment Files

Frontend

.env.local

Backend

.env

Example

.env.example

---

# Environment Types

Development

Staging

Production

Local

Each environment should have different secrets.

---

# Backend Variables

## Application

NODE_ENV=

PORT=

APP_NAME=Promilaa

APP_URL=

FRONTEND_URL=

BACKEND_URL=

---

## Database

DATABASE_URL=

DATABASE_HOST=

DATABASE_PORT=

DATABASE_NAME=

DATABASE_USER=

DATABASE_PASSWORD=

DATABASE_SSL=

---

## JWT

JWT_SECRET=

JWT_REFRESH_SECRET=

JWT_ACCESS_EXPIRES=15m

JWT_REFRESH_EXPIRES=30d

---

## Authentication

BCRYPT_ROUNDS=12

COOKIE_SECRET=

SESSION_SECRET=

---

## Cloudflare R2

R2_ACCOUNT_ID=

R2_ACCESS_KEY_ID=

R2_SECRET_ACCESS_KEY=

R2_BUCKET_NAME=

R2_PUBLIC_URL=

R2_ENDPOINT=

---

## Fraud Detection

STEADFAST_USER=

STEADFAST_PASSWORD=

PATHAO_USER=

PATHAO_PASSWORD=

REDX_PHONE=

REDX_PASSWORD=

PAPERFLY_USER=

PAPERFLY_PASSWORD=

CARRYBEE_PHONE=

CARRYBEE_PASSWORD=

FRAUD_CACHE_DURATION=86400

---

## Payment

BKASH_NUMBER=

BKASH_ACCOUNT_NAME=

BKASH_QR_IMAGE=

NAGAD_NUMBER=

NAGAD_ACCOUNT_NAME=

NAGAD_QR_IMAGE=

ROCKET_NUMBER=

ROCKET_ACCOUNT_NAME=

ROCKET_QR_IMAGE=

---

## Shipping

DHAKA_SHIPPING_FEE=60

OUTSIDE_DHAKA_SHIPPING_FEE=100

FREE_SHIPPING_MINIMUM=

---

## Security

CORS_ORIGIN=

ALLOWED_ORIGINS=

RATE_LIMIT_WINDOW=

RATE_LIMIT_MAX=

TRUST_PROXY=

---

## Email (Future)

SMTP_HOST=

SMTP_PORT=

SMTP_USER=

SMTP_PASSWORD=

SMTP_FROM=

---

## SMS (Future)

SMS_PROVIDER=

SMS_API_KEY=

SMS_SECRET=

---

## Analytics (Future)

GA_MEASUREMENT_ID=

CLARITY_PROJECT_ID=

---

## Logging

LOG_LEVEL=

ENABLE_REQUEST_LOGGING=true

ENABLE_ERROR_LOGGING=true

---

# Frontend Variables

NEXT_PUBLIC_APP_NAME=Promilaa

NEXT_PUBLIC_SITE_URL=

NEXT_PUBLIC_API_URL=

NEXT_PUBLIC_IMAGE_BASE_URL=

NEXT_PUBLIC_CURRENCY=BDT

NEXT_PUBLIC_COUNTRY=BD

NEXT_PUBLIC_DEFAULT_LANGUAGE=en

NEXT_PUBLIC_SUPPORT_PHONE=

NEXT_PUBLIC_SUPPORT_EMAIL=

NEXT_PUBLIC_FACEBOOK=

NEXT_PUBLIC_INSTAGRAM=

NEXT_PUBLIC_TIKTOK=

---

# Feature Flags

ENABLE_GUEST_CHECKOUT=true

ENABLE_WISHLIST=true

ENABLE_REVIEWS=false

ENABLE_NEWSLETTER=false

ENABLE_FLASH_SALE=false

ENABLE_DARK_MODE=false

ENABLE_ANALYTICS=true

ENABLE_FRAUD_DETECTION=true

---

# Development Variables

ENABLE_SWAGGER=true

ENABLE_DEBUG_LOGS=true

ENABLE_SQL_LOGS=false

ENABLE_PRISMA_STUDIO=true

---

# Production Variables

ENABLE_SWAGGER=false

ENABLE_DEBUG_LOGS=false

ENABLE_SQL_LOGS=false

ENABLE_PRISMA_STUDIO=false

---

# Required Variables

Application cannot start without

DATABASE_URL

JWT_SECRET

JWT_REFRESH_SECRET

R2_ACCOUNT_ID

R2_ACCESS_KEY_ID

R2_SECRET_ACCESS_KEY

R2_BUCKET_NAME

APP_URL

FRONTEND_URL

---

# Optional Variables

SMTP

SMS

Analytics

Social Links

Future Payment Gateway Keys

---

# Validation

Validate all required variables during application startup.

If any required variable is missing

↓

Fail Startup

↓

Display Meaningful Error

Never continue with missing critical configuration.

---

# Secret Management

Never expose secrets to frontend.

Only variables prefixed with

NEXT_PUBLIC_

may be accessible in the frontend.

Everything else remains backend-only.

---

# Git Rules

Commit

.env.example

Do NOT Commit

.env

.env.local

.env.production

.env.development

---

# Environment Loading

Development

↓

.env

↓

.env.local

Production

↓

Hosting Environment Variables

Never depend on local files in production.

---

# Rotation Policy

Rotate

JWT Secrets

API Keys

Storage Keys

Database Passwords

Immediately after suspected compromise.

---

# Security Rules

Never log secrets.

Never expose secrets in API responses.

Never include secrets in client bundles.

Never hardcode credentials.

Encrypt backups containing sensitive configuration.

---

# AI Agent Rules

All configuration must come from environment variables.

Never hardcode URLs, credentials or API keys.

Validate required variables at application startup.

Separate frontend and backend variables.

Only expose variables prefixed with NEXT_PUBLIC_ to the frontend.

Always include an updated `.env.example` whenever a new environment variable is introduced.

Treat environment configuration as part of the application's public documentation while keeping actual values secret.