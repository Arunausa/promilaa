# 14_ADMIN_PANEL.md

# Admin Panel

Project: Promilaa

Version: 1.0

Status: Production

---

# Overview

The Admin Panel is the central management system of Promilaa.

Only authorized administrators can access it.

The Admin Panel must be completely separated from the customer website.

Admin URL

/admin

Never expose admin functionality on public pages.

---

# Goals

Manage Products

Manage Orders

Manage Inventory

Verify Payments

Review Fraud

Manage Customers

Manage Coupons

Manage Banners

Manage Collections

Manage Categories

Manage Reports

Manage Settings

Manage Admin Accounts

---

# Admin Roles

Super Admin

Admin

Support

Inventory Manager

Content Manager

---

# Dashboard

Display KPI Cards

Today's Orders

Today's Revenue

Pending Orders

Pending Payments

Low Stock Products

Fraud Alerts

New Customers

Total Products

Monthly Sales

Conversion Rate

---

# Dashboard Widgets

Revenue Chart

Sales Trend

Recent Orders

Top Selling Products

Recent Customers

Inventory Alerts

Payment Queue

Fraud Queue

Quick Actions

---

# Sidebar

Dashboard

Orders

Products

Categories

Collections

Inventory

Customers

Payments

Coupons

Banners

Reviews

Fraud Detection

Reports

Settings

Admins

Audit Logs

Logout

---

# Product Management

Create Product

Edit Product

Delete Product

Archive Product

Duplicate Product

Publish Product

Bulk Actions

Import CSV (Future)

Export CSV

---

# Category Management

Create

Edit

Delete

Sort

Enable

Disable

---

# Collection Management

Create

Edit

Delete

Schedule

Feature Collection

---

# Inventory Management

View Stock

Update Stock

Low Stock Alerts

Out of Stock

Inventory History

Bulk Stock Update

---

# Order Management

Search Orders

View Details

Update Status

Assign Courier

Print Invoice

Cancel Order

Internal Notes

Export Orders

---

# Payment Management

Pending Payments

Payment Proof

Transaction ID

Verify Payment

Reject Payment

Request Resubmission

Payment History

---

# Fraud Detection Panel

Show

Risk Level

Risk Score

Courier Results

Provider Used

Reason

Flagged Orders

Admin Notes

Manual Recheck

---

# Customer Management

Customer List

Profile

Order History

Addresses

Status

Block Customer

Unblock Customer

View Activity

---

# Review Management

Approve Review

Reject Review

Reply to Review

Delete Review

Filter Reviews

---

# Coupon Management

Create Coupon

Edit Coupon

Delete Coupon

Usage Report

Expiry Report

Enable

Disable

---

# Banner Management

Homepage Banner

Category Banner

Campaign Banner

Upload Image

Schedule Banner

Enable

Disable

---

# Report Center

Revenue

Orders

Products

Inventory

Customers

Payments

Fraud

Coupons

Sales by Category

Sales by Collection

Download CSV

---

# Settings

Store Name

Logo

Contact Info

Business Address

Social Links

Shipping Fees

Payment Numbers

SEO Settings

Email Settings

SMS Settings (Future)

---

# Admin Management

Super Admin Only

Create Admin

Assign Role

Reset Password

Deactivate Admin

Delete Admin

View Login History

---

# Audit Logs

Record

Admin Login

Admin Logout

Product Changes

Order Updates

Payment Verification

Fraud Review

Inventory Changes

Settings Changes

Role Changes

Store

Admin Name

Action

Timestamp

IP Address

---

# Search

Global Search

Support

Orders

Products

Customers

Coupons

Payments

Transaction ID

Phone

SKU

---

# Filters

Date

Status

Payment

Fraud

Category

Collection

Admin

Courier

---

# Notifications

Payment Waiting

Low Stock

New Order

Fraud Alert

System Error

Admin Mention (Future)

---

# Security

RBAC Required

JWT Authentication

Secure Routes

Rate Limiting

Audit Logging

Session Tracking

Permission Validation

No Public Access

---

# UI Guidelines

Desktop First

Responsive

Dark Sidebar

Clean Tables

Fast Search

Pagination

Sticky Header

Confirmation Dialogs

Keyboard Friendly

---

# Performance

Server-side Pagination

Lazy Loading

Optimized Tables

Caching

Fast Search

Debounced Filters

---

# Accessibility

Keyboard Navigation

Focus Indicators

Readable Tables

Accessible Forms

High Contrast

---

# Future Features

Role Builder

Advanced Analytics

Bulk Import

Bulk Export

Multi-language

Warehouse Management

Courier Dashboard

ERP Integration

---

# AI Agent Rules

Admin Panel must remain completely separate from the customer-facing website.

Every admin action must respect role-based permissions.

Critical actions (delete, payment verification, order cancellation, admin creation) must require confirmation.

All sensitive operations must be recorded in Audit Logs.

Design the admin interface for speed, clarity and efficiency rather than visual effects.

Never expose admin APIs to unauthorized users.

All admin business logic must be enforced on the backend, not only in the frontend.