# 17_PERFORMANCE.md

# Performance Guidelines

Project: Promilaa

Version: 1.0

Status: Production

Priority: High

---

# Overview

Performance is a core feature of Promilaa.

Every page should load quickly on both high-speed and slow mobile networks common in Bangladesh.

Performance should never be sacrificed for unnecessary animations or heavy libraries.

---

# Performance Goals

Homepage

< 2 Seconds

Product Pages

< 2 Seconds

Checkout

< 2 Seconds

API Response

< 300ms Average

Search

< 200ms

Image Loading

Progressive

Lighthouse Performance

90+

Core Web Vitals

Pass

---

# Core Web Vitals

LCP

< 2.5s

INP

< 200ms

CLS

< 0.1

---

# Frontend Performance

Use

Next.js App Router

React Server Components

Streaming

Dynamic Imports

Lazy Loading

Image Optimization

Code Splitting

Tree Shaking

---

# Images

Use

Next/Image

Preferred Format

WebP

AVIF (If Supported)

Responsive Images

Blur Placeholder

Lazy Loading

Never upload images larger than necessary.

---

# Video

Lazy Load

Autoplay only when muted

Pause when not visible

Compress before upload

---

# Fonts

Self-host fonts where possible.

Preload primary fonts.

Limit font weights.

Avoid loading multiple font families.

---

# CSS

Use Tailwind CSS.

Remove unused CSS.

Avoid global overrides.

Keep CSS modular.

---

# JavaScript

Split bundles.

Avoid unnecessary libraries.

Use dynamic imports.

Debounce expensive operations.

Throttle scroll events.

---

# React Best Practices

Memoize expensive components.

Use

React.memo

useMemo

useCallback

Only where beneficial.

Avoid unnecessary re-renders.

---

# Routing

Use Next.js prefetch.

Lazy load non-critical routes.

Keep layouts reusable.

---

# Data Fetching

Server Components where appropriate.

Use caching.

Use pagination.

Use incremental loading.

Avoid duplicate API calls.

---

# API Performance

Average Response

<300ms

Use compression.

Enable keep-alive.

Validate early.

Return only required fields.

Paginate large datasets.

---

# Database

Use Prisma.

Create indexes.

Optimize queries.

Avoid N+1 queries.

Use transactions.

Use connection pooling.

---

# Caching

Browser Cache

API Cache

Image Cache

CDN Cache

Fraud Cache

Product Cache

Collection Cache

Settings Cache

---

# CDN

Use Cloudflare CDN.

Serve

Images

Static Assets

Fonts

Public Files

---

# Storage

Cloudflare R2

Do not store binary files inside PostgreSQL.

Store URLs only.

---

# Search

Debounce

300ms

Server-side search

Indexed columns

Pagination

---

# Pagination

Default

20 Items

Maximum

100 Items

Avoid loading entire datasets.

---

# Infinite Scroll

Optional

Use Intersection Observer.

Load data incrementally.

---

# Animations

Use Framer Motion.

Duration

150–300ms

Respect prefers-reduced-motion.

Avoid layout-shifting animations.

---

# Loading UX

Skeleton Loaders

Image Placeholders

Optimistic Updates

Button Loading States

Progress Indicators

---

# Error Recovery

Retry failed requests.

Show cached data when available.

Gracefully handle network failures.

---

# Mobile Performance

Mobile First

Touch Optimized

Reduce JavaScript

Optimize Images

Minimize Requests

Fast Initial Render

---

# Admin Panel

Server-side pagination.

Virtualized tables for large datasets.

Lazy-loaded charts.

Debounced search.

---

# Background Jobs

Email

Notifications

Analytics

Cleanup

Future SMS

Run asynchronously.

---

# Monitoring

Track

LCP

INP

CLS

API Latency

Database Queries

Memory Usage

CPU Usage

Error Rate

---

# Lighthouse Targets

Performance

90+

Accessibility

95+

Best Practices

95+

SEO

95+

---

# Build Optimization

Production Build

Minification

Compression

Tree Shaking

Dead Code Elimination

Source Maps Disabled in Production

---

# Logging

Log slow queries.

Log slow API requests.

Log failed jobs.

Monitor memory leaks.

---

# Future Optimization

Redis Cache

Edge Functions

Image CDN Optimization

Queue System

ElasticSearch

AI Search

---

# AI Agent Rules

Optimize before adding complexity.

Prefer Server Components where appropriate.

Never fetch unnecessary data.

Use pagination for large datasets.

Optimize every image.

Avoid unnecessary client-side JavaScript.

Keep bundle size as small as possible.

Ensure excellent performance on low-end Android devices and slow mobile networks.

Every new feature must be reviewed for performance impact before merging.