# 07_USER_FLOW.md

# User Flow

Project: Promilaa

Version: 1.0

Status: Production

---

# Overview

This document defines how users interact with the Promilaa platform.

Every flow should be simple, fast, and require the minimum number of steps.

The platform supports both guest users and registered customers.

---

# User Roles

Guest

Customer

Admin

Super Admin

---

# Primary Customer Journey

Homepage

↓

Browse Collections

↓

Open Product

↓

Select Size

↓

Add to Cart

↓

Checkout

↓

Payment

↓

Fraud Check

↓

Order Created

↓

Admin Processing

↓

Shipping

↓

Delivered

---

# Guest User Flow

Visit Website

↓

Browse Products

↓

Add to Cart

↓

Checkout

↓

Enter Shipping Details

↓

Choose Payment

↓

Submit Order

↓

Fraud Check

↓

Order Created

↓

Success Page

Guest users can later track orders using Order ID + Phone Number.

---

# Customer Registration Flow

Signup

↓

Verify Information (Future)

↓

Login

↓

Dashboard

↓

Browse Products

↓

Checkout

↓

Order History Available

---

# Login Flow

Open Login

↓

Enter Phone or Email

↓

Password

↓

JWT Authentication

↓

Dashboard

---

# Forgot Password Flow

Forgot Password

↓

Enter Phone or Email

↓

OTP / Reset Link (Future)

↓

New Password

↓

Login

---

# Product Browsing Flow

Homepage

↓

Category

↓

Filters

↓

Sorting

↓

Product Listing

↓

Product Details

---

# Search Flow

Search

↓

Suggestions

↓

Results

↓

Open Product

---

# Wishlist Flow

Guest

↓

Temporary Storage

↓

Login

↓

Merge Wishlist

↓

Permanent Wishlist

---

# Cart Flow

Product

↓

Add to Cart

↓

Update Quantity

↓

Apply Coupon

↓

Checkout

---

# Checkout Flow

Cart

↓

Shipping Address

↓

Shipping Fee Calculation

↓

Payment Method

↓

Order Review

↓

Place Order

↓

Fraud Check

↓

Order Created

↓

Confirmation

---

# COD Flow

Checkout

↓

Cash on Delivery

↓

Order Submitted

↓

Fraud Check

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

COD Collected

---

# Manual Payment Flow

Checkout

↓

Choose bKash

↓

Pay

↓

Enter Transaction ID

↓

Enter Sender Number

↓

Upload Screenshot

↓

Submit Order

↓

Fraud Check

↓

Pending Verification

↓

Admin Verifies

↓

Payment Approved

↓

Order Confirmed

---

# Fraud Detection Flow

Order Submitted

↓

Backend Validation

↓

FraudService

↓

Courier Providers

↓

Risk Analysis

↓

LOW

↓

Order Accepted

---

MEDIUM

↓

Order Flagged

↓

Admin Warning

↓

Continue Review

---

HIGH

↓

Reject or Hold

↓

Show Friendly Error

---

# Order Processing Flow

Pending

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

---

# Order Cancellation Flow

Pending

↓

Customer Request

↓

Admin Approval

↓

Cancelled

Only Pending orders can be cancelled by customers.

---

# Product Review Flow

Delivered

↓

Customer Writes Review

↓

Admin Moderation

↓

Published

Only verified purchases can review products.

---

# Customer Dashboard Flow

Login

↓

Dashboard

↓

Orders

↓

Wishlist

↓

Addresses

↓

Profile

↓

Logout

---

# Address Management Flow

Dashboard

↓

Addresses

↓

Add

↓

Edit

↓

Delete

↓

Select Default

---

# Coupon Flow

Enter Coupon

↓

Backend Validation

↓

Valid

↓

Discount Applied

↓

Checkout

---

Invalid

↓

Show Error

---

# Payment Verification Flow

Customer Uploads Proof

↓

Admin Reviews

↓

Approve

↓

Payment Status = Paid

↓

Order Confirmed

---

Reject

↓

Notify Customer

↓

Await New Submission

---

# Admin Login Flow

Login

↓

Dashboard

↓

JWT Validation

↓

Access Granted

---

# Product Management Flow

Create

↓

Draft

↓

Review

↓

Publish

↓

Edit

↓

Archive

↓

Delete

---

# Inventory Flow

Stock Updated

↓

Available

↓

Low Stock

↓

Out of Stock

↓

Notify Admin

---

# Banner Management Flow

Create Banner

↓

Upload Image

↓

Assign Collection

↓

Schedule (Optional)

↓

Publish

---

# Notification Flow

Order Placed

↓

SMS Ready

↓

Email Ready

↓

Future Push Notification

---

# Error Handling Flow

Validation Error

↓

Show Friendly Message

↓

Retry

---

Server Error

↓

Log

↓

Show Error Page

↓

Retry

---

# Security Flow

Client Request

↓

Authentication

↓

Authorization

↓

Validation

↓

Business Logic

↓

Database

↓

Response

Never trust client input.

---

# AI Agent Rules

All flows must be implemented exactly as defined.

Business rules always take precedence over implementation convenience.

Guest checkout is mandatory.

Fraud detection must occur before final order creation.

Shipping fee is calculated server-side.

Every user flow should minimize clicks while maintaining trust and security.

Future features should extend these flows without breaking backward compatibility.