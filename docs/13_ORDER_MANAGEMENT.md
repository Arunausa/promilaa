# 13_ORDER_MANAGEMENT.md

# Order Management

Project: Promilaa

Version: 1.0

Status: Production

---

# Overview

The Order Management System is the core business module of Promilaa.

Every order must be traceable from placement to delivery.

The system must support both Guest Checkout and Registered Customers.

Every order must pass validation, fraud detection and inventory checks before processing.

---

# Order Lifecycle

Cart

↓

Checkout

↓

Validation

↓

Fraud Check

↓

Order Created

↓

Payment

↓

Admin Review

↓

Confirmed

↓

Packed

↓

Ready for Pickup

↓

Courier Assigned

↓

Shipped

↓

Delivered

↓

Completed

---

# Supported Customers

Guest

Registered Customer

Both follow the same order workflow.

---

# Order Number

Generate automatically.

Example

PROM25000001

PROM25000002

PROM25000003

Order numbers must be unique.

Never reuse order numbers.

---

# Order Status

PENDING

PAYMENT_PENDING

PAYMENT_REVIEW

CONFIRMED

PROCESSING

PACKING

READY_FOR_PICKUP

COURIER_ASSIGNED

SHIPPED

OUT_FOR_DELIVERY

DELIVERED

COMPLETED

CANCELLED

FAILED

---

# Payment Status

PENDING

UNDER_REVIEW

VERIFIED

PAID

FAILED

REJECTED

---

# Fraud Status

LOW

MEDIUM

HIGH

UNKNOWN

---

# Order Creation Flow

Customer submits checkout

↓

Backend validates request

↓

Shipping calculated

↓

Coupon validated

↓

Inventory checked

↓

Fraud Detection

↓

Payment validation

↓

Order created

↓

Inventory reserved

↓

Confirmation returned

---

# Inventory Rules

Before creating order

Check stock.

Reserve stock.

After delivery

Reduce reserved stock.

If cancelled

Restore inventory.

Never allow negative stock.

---

# Shipping Fee

Dhaka

৳60

Outside Dhaka

৳100

Calculated only by backend.

Never accept shipping fee from frontend.

---

# Coupon Rules

Validate

Status

Expiry

Usage Limit

Minimum Order

Maximum Discount

Apply before payment calculation.

---

# Customer Order Tracking

Guest

Track using

Phone Number

Order Number

Customer

Track from dashboard.

Show complete order timeline.

---

# Order Timeline

Order Placed

↓

Payment

↓

Confirmed

↓

Packed

↓

Courier Pickup

↓

In Transit

↓

Delivered

Timeline should be visible to customers.

---

# Cancellation Rules

Allowed

Pending

Payment Pending

Payment Review

Not Allowed

Packed

Shipped

Delivered

Completed

Cancelled orders restore inventory.

---

# Admin Order Dashboard

View Orders

Search

Filters

Bulk Update

Assign Courier

Print Invoice

Verify Payment

Fraud Review

Export Orders

---

# Search

Support

Order Number

Phone

Customer

Product

Transaction ID

Courier

Status

---

# Filters

Date

Status

Payment

Fraud

Courier

District

Category

---

# Courier Assignment

Version 1

Manual

Supported Couriers

Steadfast

Pathao

RedX

Paperfly

CarryBee

Store

Courier Name

Tracking Number

Pickup Date

Delivery Date

Future

Automatic Courier API

---

# Fraud Detection

Runs automatically before order creation.

LOW

Continue

MEDIUM

Flag for Admin

HIGH

Reject or Hold

Every fraud result stored in FraudReports table.

---

# Notifications

Customer

Order Placed

Order Confirmed

Payment Verified

Packed

Shipped

Delivered

Cancelled

Future

SMS

Email

Push Notification

---

# Invoice

Generate PDF

Include

Order Number

Customer

Address

Items

Quantity

Price

Discount

Shipping

Total

Payment Method

Status

Company Information

---

# Return Policy

Not included in Version 1.

Database remains extensible.

---

# Admin Actions

Approve Order

Reject Order

Cancel Order

Verify Payment

Assign Courier

Update Status

Add Internal Notes

Print Invoice

Export Data

---

# Customer Dashboard

Order List

Order Details

Tracking

Invoice Download

Cancel Eligible Orders

Reorder (Future)

---

# Security

Every update requires authorization.

Every status change logged.

Every payment verification logged.

Never allow unauthorized status changes.

---

# Audit Logs

Record

Order Created

Status Changed

Payment Verified

Courier Assigned

Order Cancelled

Admin User

Timestamp

IP Address

Reason

---

# Reports

Daily Orders

Monthly Orders

Revenue

Pending Orders

Cancelled Orders

Fraud Orders

Top Products

Top Customers

---

# Error Handling

Insufficient Stock

Invalid Coupon

Invalid Payment

Fraud Detection Failure

Duplicate Order

Order Not Found

Unauthorized Update

Return user-friendly messages.

---

# AI Agent Rules

All business logic must be handled by backend services.

Controllers should remain thin.

Order creation must be transactional.

Never create an order without inventory validation.

Never reduce stock before successful order creation.

All status transitions must be validated.

Every important action must be logged.

The Order Management module should remain scalable enough to support future courier API integrations, returns and exchanges without redesign.