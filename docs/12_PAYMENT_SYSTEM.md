# 12_PAYMENT_SYSTEM.md

# Payment System

Project: Promilaa

Version: 1.0

Status: Production

---

# Overview

Promilaa uses Bangladesh-friendly payment methods.

Version 1 supports:

- Cash on Delivery (Default)
- bKash (Manual)
- Nagad (Manual)
- Rocket (Manual)

Future Versions

- SSLCommerz
- SurjoPay
- AmarPay

Architecture must support future payment gateways without redesign.

---

# Payment Methods

Cash on Delivery

Default

No advance payment required.

---

Manual bKash

Customer transfers payment.

Submits:

Transaction ID

Sender Number

Screenshot

---

Manual Nagad

Customer transfers payment.

Submits:

Transaction ID

Sender Number

Screenshot

---

Manual Rocket

Customer transfers payment.

Submits:

Transaction ID

Sender Number

Screenshot

---

# Checkout Flow

Cart

↓

Shipping Address

↓

Shipping Fee

↓

Coupon

↓

Payment Method

↓

Review

↓

Place Order

---

# Cash on Delivery Flow

Customer

↓

Select COD

↓

Fraud Check

↓

Order Created

↓

Pending

↓

Admin Review

↓

Confirmed

↓

Courier

↓

Delivered

↓

Payment Collected

---

# Manual Payment Flow

Customer

↓

Select Payment Method

↓

Show Merchant Number

↓

Complete Payment

↓

Enter Transaction ID

↓

Enter Sender Number

↓

Upload Screenshot

↓

Submit

↓

Fraud Check

↓

Pending Verification

↓

Admin Review

↓

Approved

↓

Paid

↓

Confirmed

---

Rejected

↓

Notify Customer

↓

Allow Resubmission

---

# Merchant Information

Store from Settings.

Fields

bKash Number

Nagad Number

Rocket Number

Account Name

QR Image

Instructions

Admins can update anytime.

---

# Payment Proof

Required for manual payments.

Fields

Transaction ID

Sender Number

Amount

Screenshot

Payment Time (Optional)

---

# Screenshot Upload

Storage

Cloudflare R2

Allowed Types

JPG

PNG

WEBP

Maximum Size

5 MB

Validate:

File Type

File Size

Image Integrity

---

# Payment Status

PENDING

UNDER_REVIEW

VERIFIED

PAID

REJECTED

FAILED

REFUNDED (Future)

---

# Order Status Relation

COD

Pending

↓

Confirmed

↓

Delivered

↓

Paid

---

Manual Payment

Pending

↓

Payment Review

↓

Verified

↓

Confirmed

↓

Delivered

---

# Payment Validation

Backend validates:

Transaction ID exists

Screenshot uploaded

Amount > 0

Order exists

Payment belongs to order

Never trust frontend values.

---

# Duplicate Detection

Prevent:

Duplicate Transaction ID

Duplicate Payment Proof

Duplicate Payment Submission

Warn admin if duplicate found.

---

# Admin Payment Panel

View Pending Payments

View Screenshot

Verify Payment

Reject Payment

Request Resubmission

Search by

Order Number

Transaction ID

Phone Number

---

# Fraud Detection

Fraud check runs before order confirmation.

Risk Levels

LOW

MEDIUM

HIGH

HIGH risk orders require manual review.

---

# Shipping Rules

Dhaka

৳60

Outside Dhaka

৳100

Calculated by backend.

Cannot be overridden from frontend.

---

# Payment Notifications

Customer

Payment Received

Payment Verified

Payment Rejected

Order Confirmed

Future

SMS

Email

Push Notification

---

# Security

Validate every payment.

Validate uploads.

Sanitize filenames.

Generate random object keys.

Never expose Cloudflare credentials.

Store only object URLs in database.

---

# Future Gateway Support

Architecture must support:

SSLCommerz

SurjoPay

AmarPay

Requirements

Provider Interface

Gateway Service

Webhook Handler

Transaction Verification

Refund Support

These must be plug-in modules.

Do NOT hardcode gateway logic.

---

# Database Relation

Orders

↓

Payments

↓

Payment Proof

↓

Admin Verification

↓

Audit Log

---

# Admin Permissions

Support

View Payments

Admin

Verify Payments

Super Admin

Full Access

---

# Audit Log

Record:

Payment Created

Screenshot Uploaded

Payment Verified

Payment Rejected

Admin Name

Timestamp

IP Address

Reason

---

# Error Handling

Invalid Transaction ID

Missing Screenshot

Unsupported File

Duplicate Submission

Verification Failed

Gateway Unavailable (Future)

Always return user-friendly messages.

---

# AI Agent Rules

Cash on Delivery must be the default payment method.

Manual mobile banking payments must require transaction ID and screenshot.

All payment verification must happen through the admin panel.

Never automatically mark manual payments as paid.

Design payment architecture so new gateways can be added without modifying existing payment logic.

Never trust payment information received from the client.

Follow secure upload and validation practices throughout the payment flow.