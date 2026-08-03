# 02_PRD.md

# Product Requirements Document

Project: Promilaa

Version: 1.0

---

# Overview

Promilaa is a premium Bangladesh-based women's fashion eCommerce platform.

Version 1 focuses only on:

- Kurti
- One Piece
- Two Piece
- Three Piece

The goal is to provide a premium, modern, trustworthy online shopping experience.

This is NOT a marketplace.

Only Promilaa products will be sold.

---

# Goals

Build a production-ready fashion eCommerce platform.

Provide excellent mobile experience.

Reduce fake orders.

Increase repeat customers.

Build scalable architecture.

---

# Target Users

Women

Age:

16-45

Country:

Bangladesh

Shopping Preference:

Mobile First

COD Preferred

Facebook & Instagram users

---

# User Roles

Guest

Customer

Admin

Super Admin

---

# Customer Features

Homepage

Collections

Product Listing

Product Details

Search

Filters

Wishlist

Shopping Cart

Checkout

Guest Checkout

Customer Account

Order History

Order Tracking

Profile

Address Book

Coupon

Newsletter

---

# Homepage

Hero Banner

Featured Collection

New Arrival

Best Seller

Kurti Collection

One Piece

Two Piece

Three Piece

Flash Sale

Promotional Banner

Testimonials

Instagram Gallery

Newsletter

Footer

---

# Navigation

Logo

Search

Categories

Wishlist

Cart

Account

Responsive Mobile Menu

---

# Product Listing

Grid View

Sorting

Filtering

Pagination

Infinite Scroll (optional)

Quick View

Wishlist Button

Sale Badge

Stock Badge

---

# Product Details

Multiple Images

Image Zoom

Size Selection

Color Selection

Price

Discount

SKU

Stock

Fabric

Description

Size Guide

Delivery Information

Related Products

Recently Viewed

Share Product

Add to Cart

Buy Now

---

# Search

Live Search

Suggestions

Popular Search

Search History

---

# Filters

Price

Category

Size

Color

Fabric

Availability

Newest

Best Seller

Discount

---

# Wishlist

Add

Remove

Move to Cart

Guest Support

Customer Sync

---

# Cart

Quantity

Remove Item

Coupon

Shipping

Subtotal

Grand Total

Continue Shopping

Checkout

---

# Checkout

Guest Checkout

Login Optional

Customer Name

Phone

District

Area

Address

Delivery Note

Payment Method

Order Summary

Confirm Order

---

# Payment

Cash on Delivery

Manual bKash

Manual Nagad

Manual Rocket

Customer uploads

Transaction ID

Sender Number

Payment Screenshot

Admin verifies manually

Future Support

SSLCommerz

SurjoPay

AmarPay

---

# Fraud Detection

Every order passes FraudService.

Supported

Pathao

Steadfast

RedX

Paperfly

CarryBee

Use merchant credentials.

Return

LOW

MEDIUM

HIGH

UNKNOWN

High Risk

Flag or Reject according to configuration.

---

# Order Flow

Pending

Confirmed

Packed

Ready to Ship

Shipped

Delivered

Cancelled

Returned (Future)

---

# Customer Dashboard

Profile

Orders

Wishlist

Addresses

Password

Notifications

Logout

---

# Admin Dashboard

Dashboard

Products

Categories

Collections

Inventory

Orders

Customers

Coupons

Payments

Fraud Review

Reports

Settings

Banner Management

---

# Product Management

Create

Update

Delete

Draft

Publish

Archive

Multiple Images

Color

Size

Fabric

Price

Discount

Stock

SEO

Collection

---

# Inventory

Stock

SKU

Low Stock Alert

Out of Stock

Inventory History

---

# Coupon System

Percentage

Fixed

Expiry

Usage Limit

Minimum Order

Maximum Discount

---

# Reviews

Verified Purchase Only

Rating

Comment

Admin Moderation

---

# Notifications

Order Placed

Order Confirmed

Payment Verified

Order Shipped

Order Delivered

SMS Ready

Email Ready

---

# Bangladesh Support

Shipping

Dhaka

৳60

Outside Dhaka

৳100

Backend calculates shipping.

Never trust frontend.

---

# Authentication

JWT

Guest Checkout

Signup

Login

Forgot Password

Reset Password

Email Verification (Future)

---

# Storage

Cloudflare R2

Product Images

Banner Images

Payment Screenshots

---

# Technology

Frontend

Next.js

React

TypeScript

Tailwind CSS

shadcn/ui

Framer Motion

Backend

Node.js

Express

TypeScript

Database

PostgreSQL

Prisma

Storage

Cloudflare R2

Authentication

JWT

---

# Performance

Responsive

Lazy Loading

Image Optimization

Caching

Pagination

SEO Friendly

Accessibility

---

# Security

Server-side Validation

JWT

Password Hashing

Rate Limiting

XSS Protection

CSRF Protection

SQL Injection Protection

Upload Validation

Input Sanitization

HTTPS Only

---

# SEO

Dynamic Meta

Schema.org

Sitemap

Robots.txt

Canonical URL

Open Graph

Twitter Card

Product Schema

Breadcrumb Schema

---

# Analytics

Sales

Orders

Revenue

Top Products

Top Categories

Customers

Conversion Rate

Traffic

---

# Deployment

Frontend

Vercel

Backend

Node.js Compatible Hosting

cPanel Compatible

Database

Managed PostgreSQL

Storage

Cloudflare R2

---

# Version 1 Scope

Included

Customer Website

Admin Panel

Product Management

Order Management

Fraud Detection

Manual Payments

Coupons

Guest Checkout

Customer Accounts

Inventory

SEO

Analytics Foundation

---

# Out of Scope

Marketplace

Multi Vendor

Affiliate

Loyalty

Gift Card

International Shipping

Mobile App

AI Recommendation

Men's Fashion

---

# Success Criteria

Fast

Secure

Responsive

SEO Friendly

Accessible

Production Ready

Maintainable

Scalable

Bangladesh Friendly

Premium User Experience