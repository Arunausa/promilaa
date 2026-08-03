# 16_SECURITY.md

# Security Guidelines

Project: Promilaa

Version: 1.0

Status: Production

Priority: Critical

---

# Overview

Security is a core requirement of Promilaa.

Every feature must be designed with a security-first mindset.

Never trust the client.

Every request must be validated, authenticated and authorized where required.

Security is the responsibility of every layer of the application.

---

# Security Principles

Defense in Depth

Least Privilege

Secure by Default

Fail Securely

Never Trust Client Input

Validate Everything

Log Important Events

Protect Sensitive Data

---

# Authentication Security

JWT Authentication

Access Token

15 Minutes

Refresh Token

30 Days

Passwords

bcrypt

Minimum Cost Factor

12

Never store plaintext passwords.

Never expose password hashes.

---

# Authorization

Role Based Access Control (RBAC)

Roles

Guest

Customer

Support

Inventory Manager

Admin

Super Admin

Every protected route must verify permissions on the backend.

Frontend authorization is for UI only.

---

# HTTPS

Force HTTPS

Enable HSTS

Reject insecure requests in production.

Never transmit sensitive information over HTTP.

---

# Input Validation

Validate

Phone

Email

Password

Coupon

Transaction ID

Product IDs

UUID

Quantity

Price

Address

Every API endpoint must validate incoming data.

---

# Output Encoding

Escape user-generated content.

Prevent HTML injection.

Prevent JavaScript injection.

Sanitize rich text before rendering.

---

# SQL Injection

Use Prisma ORM.

Never concatenate SQL strings.

Always use parameterized queries.

---

# XSS Protection

Escape HTML

Sanitize User Input

Validate Rich Text

Use CSP

Never use dangerouslySetInnerHTML unless absolutely required.

---

# CSRF Protection

Use SameSite Cookies

CSRF Tokens where applicable

Secure Cookies

HttpOnly Cookies

---

# CORS

Whitelist trusted origins only.

Never allow *

Separate development and production origins.

---

# Headers

Use Helmet.

Enable

Content Security Policy

HSTS

Frameguard

NoSniff

Referrer Policy

Permissions Policy

---

# File Upload Security

Allowed Types

JPG

JPEG

PNG

WEBP

Maximum Size

5 MB

Rename uploaded files.

Generate random object keys.

Store uploads in Cloudflare R2.

Validate MIME type.

Validate extension.

Reject executable files.

---

# Payment Security

Transaction IDs validated.

Payment screenshots verified.

No automatic approval.

Manual admin verification required.

Every payment action logged.

---

# Fraud Detection Security

Provider credentials stored in environment variables.

Never expose credentials.

Validate every provider response.

Log provider failures.

---

# Password Policy

Minimum

8 Characters

Maximum

128 Characters

Require

Uppercase

Lowercase

Number

Special Character

Hash using bcrypt.

Never reuse hashes.

---

# Rate Limiting

Login

5 Requests

10 Minutes

Forgot Password

3 Requests

30 Minutes

Checkout

20 Requests

10 Minutes

Payment Upload

10 Requests

10 Minutes

Fraud Check

20 Requests

10 Minutes

Admin Login

5 Requests

15 Minutes

---

# Session Security

Track

IP Address

Browser

Device

Login Time

Last Activity

Allow session revocation.

Invalidate sessions after password change.

---

# JWT Rules

Short-lived Access Token

Refresh Token Rotation

Verify Signature

Verify Expiry

Verify User Status

Reject invalid tokens.

---

# Secrets Management

Never hardcode secrets.

Store in

Environment Variables

Examples

DATABASE_URL

JWT_SECRET

JWT_REFRESH_SECRET

CLOUDFLARE_ACCESS_KEY

CLOUDFLARE_SECRET_KEY

FRAUD_API_KEYS

Never commit .env files.

---

# Logging

Log

Authentication

Orders

Payments

Fraud

Admin Actions

Permission Changes

Errors

Do not log

Passwords

JWT Tokens

Card Data

Secrets

---

# Audit Logs

Record

Who

What

When

Where

Result

Store

User ID

Admin ID

IP Address

Timestamp

Action

Reason

---

# Error Handling

Never expose

Stack Trace

SQL Errors

Environment Variables

Internal Paths

Return generic error messages to users.

Log detailed errors internally.

---

# API Security

Validate every request.

Authenticate protected routes.

Authorize permissions.

Sanitize input.

Validate output.

Return proper HTTP status codes.

---

# Admin Security

Separate Admin Login

Separate Admin Routes

Role Validation

Session Timeout

Audit Logging

IP Tracking

Future

Two-Factor Authentication

---

# Database Security

Least Privilege Database User

Backups

Foreign Keys

Constraints

Transactions

Encrypted Connections

Never expose database publicly.

---

# Infrastructure Security

Frontend

Vercel

Backend

Node.js Host / cPanel Compatible

Database

Managed PostgreSQL

Storage

Cloudflare R2

Enable firewall where available.

Restrict database access.

---

# Backup Strategy

Daily Database Backup

Weekly Full Backup

Monthly Archive

Test restore process regularly.

---

# Dependency Security

Keep dependencies updated.

Remove unused packages.

Monitor security advisories.

Run dependency audits regularly.

---

# Monitoring

Application Logs

Error Logs

Security Logs

Fraud Logs

Performance Metrics

Admin Activity

Future

Alerting

Intrusion Detection

---

# Future Security

OTP Login

2FA

WebAuthn

Device Trust

IP Reputation

Behavior Analysis

WAF

Bot Detection

---

# AI Agent Rules

Security is not optional.

Never trust frontend data.

Validate all inputs on the backend.

Use Prisma to prevent SQL Injection.

Escape and sanitize all user-generated content.

Protect uploads with validation.

Use secure cookies for refresh tokens.

Keep secrets outside source code.

Log every critical action.

Follow the principle of least privilege.

Every new feature must be reviewed for security implications before implementation.