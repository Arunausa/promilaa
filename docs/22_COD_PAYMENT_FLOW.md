# 22_COD_PAYMENT_FLOW.md

# Cash on Delivery & Manual Payment Flow

Project: Promilaa

Version: 1.0

Status: Production

Priority: Critical

---

# Overview

Promilaa is a Bangladesh-first fashion eCommerce platform.

The primary payment method is Cash on Delivery (COD).

Customers may also prepay using bKash, Nagad or Rocket through a manual verification process.

All payment flows must be secure, auditable and scalable.

---

# Supported Payment Methods

Cash on Delivery (Default)

Manual bKash

Manual Nagad

Manual Rocket

Future

SSLCommerz

SurjoPay

AmarPay

---

# Order Placement Flow

Customer

↓

Shopping Cart

↓

Checkout

↓

Shipping Address

↓

Shipping Fee Calculation

↓

Coupon Validation

↓

Payment Method Selection

↓

Fraud Detection

↓

Create Order

↓

Confirmation

---

# Cash on Delivery Flow

Customer selects

Cash on Delivery

↓

Backend validates

Cart

Stock

Shipping

Coupon

↓

Fraud Detection

↓

Create Order

↓

Status

PENDING

↓

Admin Review

↓

CONFIRMED

↓

Inventory Reserved

↓

Packing

↓

Courier Assigned

↓

Shipped

↓

Delivered

↓

Payment Collected

↓

Order Completed

---

# Manual Payment Flow

Customer selects

bKash

or

Nagad

or

Rocket

↓

Display Merchant Information

↓

Customer Completes Transfer

↓

Enter Transaction ID

↓

Enter Sender Phone Number

↓

Upload Payment Screenshot

↓

Submit

↓

Backend Validation

↓

Fraud Detection

↓

Create Order

↓

Payment Status

UNDER_REVIEW

↓

Admin Verification

↓

Verified

↓

Order Confirmed

↓

Packing

↓

Courier

↓

Delivered

---

# Merchant Information

Display

Merchant Name

Merchant Number

QR Code

Payment Instructions

Notes

Merchant information is managed only by Super Admin.

---

# Customer Input

Required

Transaction ID

Sender Phone Number

Screenshot

Optional

Customer Note

---

# Screenshot Upload Rules

Storage

Cloudflare R2

Allowed Formats

JPG

JPEG

PNG

WEBP

Maximum Size

5 MB

Rename every uploaded file.

Generate unique object keys.

Never expose storage credentials.

---

# Backend Validation

Validate

Order Exists

Payment Method

Transaction ID

Phone Number

Screenshot

Duplicate Submission

Inventory

Fraud Result

Shipping Fee

Coupon

Never trust frontend values.

---

# Fraud Detection

Runs before final order acceptance.

LOW

Proceed

MEDIUM

Flag

HIGH

Reject or Hold

Decision configurable by admin.

---

# Payment Status

PENDING

UNDER_REVIEW

VERIFIED

PAID

FAILED

REJECTED

---

# Order Status Mapping

Cash on Delivery

PENDING

↓

CONFIRMED

↓

PACKING

↓

READY_FOR_PICKUP

↓

SHIPPED

↓

OUT_FOR_DELIVERY

↓

DELIVERED

↓

COMPLETED

---

Manual Payment

PENDING

↓

UNDER_REVIEW

↓

VERIFIED

↓

CONFIRMED

↓

PACKING

↓

READY_FOR_PICKUP

↓

SHIPPED

↓

DELIVERED

↓

COMPLETED

---

# Inventory Flow

Before Order

Check Stock

↓

Reserve Stock

↓

Create Order

↓

Payment Verification

↓

Dispatch

↓

Deduct Final Inventory

Cancelled Orders

↓

Restore Reserved Stock

---

# Admin Verification

Admin Dashboard

↓

Pending Payments

↓

Open Order

↓

View Screenshot

↓

Compare Transaction

↓

Approve

or

Reject

↓

Audit Log

---

# Reject Flow

Payment Rejected

↓

Customer Notification

↓

Allow Resubmission

↓

Keep Order Pending Until Deadline

↓

Auto Cancel if Not Resubmitted

---

# Customer Notifications

Order Placed

Payment Received

Payment Verified

Payment Rejected

Order Confirmed

Packed

Shipped

Delivered

Cancelled

Future

SMS

Email

Push Notification

---

# Courier Flow

Admin Assigns

Courier

↓

Tracking Number

↓

Pickup

↓

Shipment

↓

Delivery

↓

Customer Tracking

Supported Couriers

Steadfast

Pathao

RedX

Paperfly

CarryBee

---

# Refund Policy

Out of Scope

Version 1

Database remains extensible.

---

# Audit Logging

Log

Payment Submitted

Screenshot Uploaded

Payment Verified

Payment Rejected

Order Confirmed

Courier Assigned

Order Delivered

Store

Admin

Timestamp

IP Address

Action

Reason

---

# Security

Server-side Validation

Secure Uploads

JWT Protected Admin APIs

RBAC

Audit Logs

Rate Limiting

HTTPS Only

No Sensitive Data Exposure

---

# Future Gateway Architecture

Use Payment Provider Interface

Implement

Gateway Adapter

Webhook Handler

Transaction Verification

Refund Service

Future Providers

SSLCommerz

SurjoPay

AmarPay

No redesign should be required.

---

# Error Handling

Invalid Transaction ID

Missing Screenshot

Duplicate Transaction

Invalid Payment Method

Fraud Block

Insufficient Stock

Validation Failure

Return user-friendly error messages.

---

# AI Agent Rules

Cash on Delivery is the default payment method.

Manual mobile banking payments require transaction ID and payment screenshot.

No manual payment should be automatically marked as paid.

All payment verification must occur through the admin panel.

Every payment action must be logged.

Fraud detection runs before order acceptance.

Never trust payment-related data from the frontend.

Design the payment workflow so future gateway integrations can be added without changing the existing business logic.