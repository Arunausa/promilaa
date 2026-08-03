# 19_DEPLOYMENT.md

# Deployment Guide

Project: Promilaa

Version: 1.0

Status: Production

Priority: High

---

# Overview

Promilaa must be deployed using a modern, secure and scalable architecture.

The deployment process should support both production and local development while remaining cPanel-friendly for the backend.

The application should be easy to maintain, monitor and scale.

---

# Deployment Architecture

Client

↓

Cloudflare DNS

↓

Frontend

↓

Backend API

↓

PostgreSQL

↓

Cloudflare R2

---

# Production Stack

Frontend

Next.js

Hosting

Vercel

Backend

Node.js

Express

Hosting

Node.js Compatible VPS / cPanel Node.js Application

Database

Managed PostgreSQL

Storage

Cloudflare R2

CDN

Cloudflare

---

# Development Environment

Frontend

localhost:3000

Backend

localhost:5000

Database

Local PostgreSQL

Storage

Cloudflare R2

---

# Environment Variables

Frontend

NEXT_PUBLIC_API_URL

NEXT_PUBLIC_SITE_URL

NEXT_PUBLIC_CLOUDINARY_URL (Future)

Backend

DATABASE_URL

JWT_SECRET

JWT_REFRESH_SECRET

NODE_ENV

PORT

APP_URL

FRONTEND_URL

CLOUDFLARE_ACCOUNT_ID

CLOUDFLARE_ACCESS_KEY

CLOUDFLARE_SECRET_KEY

CLOUDFLARE_BUCKET

CLOUDFLARE_PUBLIC_URL

STEADFAST_USER

STEADFAST_PASSWORD

PATHAO_USER

PATHAO_PASSWORD

REDX_PHONE

REDX_PASSWORD

PAPERFLY_USER

PAPERFLY_PASSWORD

CARRYBEE_PHONE

CARRYBEE_PASSWORD

---

# Build Commands

Frontend

npm install

npm run build

npm run start

Backend

npm install

npm run build

npm run start

Development

npm run dev

---

# Database

PostgreSQL

Use Prisma

Run

Prisma Generate

Prisma Migrate

Prisma Seed

Never manually modify production schema.

---

# File Storage

Cloudflare R2

Store

Product Images

Banner Images

Payment Screenshots

Customer Uploads

Database stores only object keys and URLs.

---

# Domain Structure

www.promilaa.com

Customer Website

api.promilaa.com

Backend API

admin.promilaa.com (Optional Future)

Dedicated Admin Panel

---

# SSL

HTTPS Required

Enable HSTS

Redirect HTTP → HTTPS

Use secure cookies.

---

# Reverse Proxy

Recommended

Nginx

Responsibilities

SSL

Compression

Caching

Static Assets

Security Headers

---

# Compression

Enable

Gzip

Brotli

Compress

HTML

CSS

JavaScript

JSON

SVG

---

# CDN

Cloudflare

Cache

Images

Fonts

Static Assets

Public Files

---

# Caching

Static Pages

Images

API Responses

Settings

Collections

Products

---

# Logging

Application Logs

API Logs

Fraud Logs

Payment Logs

Error Logs

Security Logs

Audit Logs

---

# Monitoring

Monitor

Server Health

CPU

Memory

Disk

API Latency

Database

Error Rate

Uptime

Future

Grafana

Prometheus

Sentry

---

# Backup Strategy

Database

Daily

Storage Metadata

Daily

Configuration

Weekly

Retention

30 Days

Test restore regularly.

---

# Deployment Workflow

Developer

↓

GitHub

↓

Automatic Build

↓

Deploy

↓

Health Check

↓

Production

---

# Health Checks

API

Database

Storage

Fraud Providers

Background Jobs

Return HTTP 200 if healthy.

---

# CI/CD

GitHub Actions (Recommended)

Steps

Install

Lint

Type Check

Unit Test

Build

Deploy

Run Post-Deployment Health Checks

---

# Security During Deployment

Never expose .env files.

Never commit secrets.

Rotate JWT secrets when necessary.

Restrict database access.

Enable firewall.

Use least-privilege credentials.

---

# Rollback

Keep previous deployment available.

If deployment fails

↓

Rollback

↓

Investigate

↓

Redeploy

---

# Maintenance Mode

Support

Temporary Maintenance Page

Disable Checkout

Admin Access Allowed

Automatic Recovery

---

# Scaling

Future

Load Balancer

Redis

Queue System

Multiple Backend Instances

Horizontal Scaling

---

# cPanel Compatibility

Backend must support

Node.js Application

Environment Variables

PM2 (if available)

Persistent Uploads via Cloudflare R2

No dependency on Docker.

---

# Production Checklist

HTTPS Enabled

Environment Variables Configured

Database Connected

Prisma Migrated

Storage Connected

Fraud Providers Configured

JWT Configured

Rate Limiting Enabled

Security Headers Enabled

Backups Configured

Logging Enabled

Monitoring Enabled

---

# AI Agent Rules

Deployment must remain reproducible.

Keep frontend and backend deployments independent.

Never hardcode environment-specific values.

All secrets must come from environment variables.

Assume Cloudflare R2 for object storage.

Ensure backend remains compatible with Node.js hosting and cPanel environments.

Deployment should require minimal manual intervention.

Every production deployment must pass health checks before being considered successful.