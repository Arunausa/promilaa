# 15_FRAUD_DETECTION.md

# Fraud Detection System

Project: Promilaa

Version: 1.0

Status: Production

Priority: High

---

# Overview

Promilaa uses a Bangladesh-focused fraud detection system to reduce fake Cash on Delivery (COD) orders.

The system checks customer phone numbers against courier history before accepting an order.

The fraud detection module is mandatory for every order, including Guest Checkout and Registered Customers.

This module is designed to be provider-independent.

---

# Objectives

Reduce Fake Orders

Reduce Courier Loss

Reduce Return-to-Origin (RTO)

Protect Business

Assist Admin Decisions

Improve Order Quality

---

# Supported Providers

Pathao

Steadfast

RedX

Paperfly

CarryBee

Future

Other Bangladeshi Couriers

---

# Provider Architecture

Every provider implements the same interface.

Fraud Provider

↓

Login

↓

Check Phone

↓

Normalize Response

↓

Return Standard Result

Business logic never depends on provider-specific responses.

---

# Standard Response

Every provider returns:

Risk Score

Risk Level

Reason

Provider Name

Raw Response

Example

Risk Score

0-100

Risk Level

LOW

MEDIUM

HIGH

UNKNOWN

---

# Risk Score

0-30

LOW

31-70

MEDIUM

71-100

HIGH

Unknown

UNKNOWN

---

# Order Decision

LOW

Create Order

MEDIUM

Create Order

Flag for Admin Review

HIGH

Reject

or

Hold for Manual Review

Decision should be configurable.

---

# Fraud Check Flow

Customer

↓

Checkout

↓

Backend Validation

↓

Inventory Validation

↓

Fraud Engine

↓

Provider

↓

Normalize Result

↓

Decision Engine

↓

Create Order

or

Reject Order

---

# Fraud Engine

Responsibilities

Load Provider

Authenticate

Execute Check

Normalize Response

Calculate Final Risk

Log Result

Return Standard Object

---

# Provider Priority

Primary

Steadfast

Fallback

Pathao

Fallback

RedX

Fallback

Paperfly

Fallback

CarryBee

If one provider fails, automatically try the next.

---

# Provider Authentication

Merchant Credentials

Stored in

Environment Variables

Never expose credentials to frontend.

Never store passwords in database.

---

# Environment Variables

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

# Caching

Cache successful fraud results.

Recommended

24 Hours

Cache Key

Phone Number

Purpose

Reduce API Requests

Improve Speed

---

# Retry Policy

Temporary Failure

Retry

Maximum

2 Attempts

After retries fail

Return UNKNOWN

Never block checkout because a provider is temporarily unavailable.

---

# Circuit Breaker

If provider continuously fails

Temporarily disable

Use next provider

Log failure

Notify admin

---

# Timeout

Maximum Provider Response Time

5 Seconds

If timeout

Try next provider

---

# Logging

Store

Phone

Provider

Risk Score

Risk Level

Raw Response

Execution Time

Timestamp

---

# Fraud Report Table

Store

Order ID

Phone

Risk Score

Risk Level

Provider

Reason

Admin Note

Reviewed By

Reviewed At

---

# Admin Panel

Show

Risk Badge

Risk Score

Provider Used

Reason

Raw Response

Manual Override

Recheck Button

History

---

# Manual Override

Super Admin

Can Force Approve

Can Force Reject

Every override must be logged.

---

# Fraud Analytics

Daily Checks

Weekly Checks

High Risk %

Rejected Orders

Provider Success Rate

Provider Response Time

False Positives

---

# Security

Backend Only

Never expose provider credentials

Encrypt sensitive configuration

Validate provider responses

Log failures

Protect endpoints with authentication

---

# Error Handling

Provider Offline

Authentication Failed

Timeout

Rate Limited

Unexpected Response

Unknown Risk

Return safe fallback response.

---

# Performance

Run asynchronously where possible.

Avoid duplicate provider requests.

Use connection pooling.

Reuse authenticated sessions when supported.

---

# Future Roadmap

Machine Learning Risk Engine

Multiple Provider Scoring

Behavior Analysis

IP Reputation

Device Fingerprinting

Velocity Checks

Blacklist

Whitelist

Repeat Customer Trust Score

---

# AI Agent Rules

Implement Fraud Detection as an isolated service module.

Never couple business logic to a specific courier provider.

Use an adapter/provider pattern for all courier integrations.

Every order must pass backend fraud validation before being accepted.

Never expose courier credentials or raw provider APIs to the frontend.

Support adding new providers without modifying existing business logic.

If every provider fails, return UNKNOWN instead of blocking checkout.

Every fraud decision and admin override must be permanently logged.

Design the system to work with the existing Fraud-Checker-BD-Courier approach while remaining independent of Laravel and fully compatible with the Promilaa stack (Next.js, React, TypeScript, Node.js, Express, PostgreSQL, Prisma, Cloudflare R2).