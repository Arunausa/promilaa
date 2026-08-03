# 11_AUTHENTICATION.md

# Authentication & Authorization

Project: Promilaa

Version: 1.0

Status: Production

---

# Overview

Promilaa supports both guest users and registered customers.

Customers should never be forced to create an account before placing an order.

Authentication should be secure, scalable and production-ready.

Authorization must be role-based.

---

# User Types

Guest

Customer

Admin

Super Admin

Support

Inventory Manager

---

# Authentication Method

JWT Authentication

Access Token

Refresh Token

Password Hashing

bcrypt

HTTPS Only

---

# Login Options (Version 1)

Customer

- Phone + Password
- Email + Password

Admin

- Email + Password

Future

- OTP Login
- Social Login
- Google Login
- Facebook Login

---

# Registration

Customer Registration requires:

Full Name

Phone Number

Email (Optional)

Password

Confirm Password

Phone number must be unique.

Email should be unique if provided.

Password must be hashed using bcrypt.

---

# Password Rules

Minimum 8 characters

Maximum 128 characters

Must contain:

Uppercase

Lowercase

Number

Special Character

Passwords are never stored in plain text.

---

# Guest Checkout

Guest checkout is fully supported.

Guest users can:

Browse Products

Add to Cart

Checkout

Pay

Track Orders

Guest users cannot:

View Order History

Save Wishlist

Save Addresses

Leave Reviews

Guest orders are linked using:

Phone Number

Order Number

---

# Customer Authentication Flow

Register

↓

Hash Password

↓

Save User

↓

Generate JWT

↓

Return Tokens

↓

Authenticated

---

# Login Flow

Email / Phone

↓

Password Validation

↓

Generate Access Token

↓

Generate Refresh Token

↓

Login Success

---

# JWT

Access Token

Expiry

15 Minutes

Refresh Token

Expiry

30 Days

Tokens must include:

User ID

Role

Session ID

Issued Time

Expiry Time

---

# Session Management

Every login creates a session.

Store:

User

IP Address

Device

Browser

Last Activity

Refresh Token

Allow multiple devices.

Allow logout from individual sessions.

---

# Logout

Delete Refresh Token

Invalidate Session

Client removes Access Token

---

# Forgot Password

Customer requests reset.

↓

Generate Secure Token

↓

Send Email (Future)

↓

Reset Password

↓

Invalidate Old Sessions

Future:

SMS OTP

---

# Email Verification

Version 1

Optional

Future

Mandatory

---

# Phone Verification

Future

OTP Verification

Architecture should support this without redesign.

---

# Authorization

Role-Based Access Control (RBAC)

Roles

Super Admin

Admin

Support

Inventory

Customer

Guest

---

# Role Permissions

Super Admin

Everything

Admin

Products

Orders

Customers

Payments

Reports

Support

Orders

Customers

Inventory

Products

Stock

Customer

Own Data Only

Guest

Public Resources Only

---

# Middleware

Authenticate

↓

Authorize

↓

Validate

↓

Controller

↓

Service

↓

Repository

---

# Protected Routes

Customer

Profile

Wishlist

Addresses

Order History

Reviews

Admin

Dashboard

Products

Inventory

Orders

Coupons

Reports

Settings

Admins

---

# Public Routes

Homepage

Products

Collections

Search

Categories

Login

Register

Guest Checkout

Track Order

---

# Admin Login

Separate Admin Login Page

Admin Dashboard should never share UI with customer account.

Admin routes

/admin/*

Require Admin JWT.

---

# Token Storage

Frontend

Access Token

Memory / Secure Cookie

Refresh Token

HttpOnly Secure Cookie

Never store JWT in localStorage if avoidable.

---

# Security

HTTPS Only

JWT Signature Verification

Password Hashing

Rate Limiting

Account Lock after repeated failures

Input Validation

CSRF Protection

XSS Protection

SQL Injection Protection

Helmet

CORS

---

# Login Rate Limits

Customer Login

5 attempts

10 minutes

Admin Login

5 attempts

15 minutes

Forgot Password

3 requests

30 minutes

---

# Account Status

ACTIVE

INACTIVE

BLOCKED

SUSPENDED

DELETED

Blocked users cannot login.

---

# Admin Management

Super Admin can:

Create Admin

Update Admin

Delete Admin

Assign Roles

Reset Password

Disable Accounts

Admins cannot modify themselves beyond allowed permissions.

---

# Audit Logging

Log:

Login

Logout

Password Change

Profile Update

Admin Login

Failed Login

Permission Changes

Role Changes

Session Revocation

Store:

User ID

IP

Device

Timestamp

Action

---

# Future Features

OTP Login

Google Login

Facebook Login

Apple Login

Two-Factor Authentication (2FA)

Biometric Login (Mobile)

Single Sign-On (SSO)

---

# AI Agent Rules

Support guest checkout without requiring registration.

Use JWT with refresh tokens.

Hash passwords using bcrypt.

Never expose password hashes.

Protect all private routes.

Implement RBAC for all admin features.

Store refresh tokens securely.

Invalidate sessions after password reset.

Never trust client-side authentication state.

All authorization decisions must be enforced on the backend.

Authentication and authorization must remain modular to support future login methods without major architectural changes.