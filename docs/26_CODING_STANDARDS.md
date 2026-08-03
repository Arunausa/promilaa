# 26_CODING_STANDARDS.md

# Coding Standards

Project: Promilaa

Version: 1.0

Status: Production

Priority: Critical

---

# Overview

This document defines the mandatory coding standards for the Promilaa project.

Every developer and AI Agent must follow these standards.

Consistency is more important than personal preference.

All code must be readable, maintainable, secure, scalable and production-ready. General best practices should be enforced consistently across the codebase. :contentReference[oaicite:0]{index=0}

---

# General Principles

Write Clean Code

Write Readable Code

Keep Code Simple

Avoid Premature Optimization

Prefer Composition

Avoid Duplication

Single Responsibility

Security First

Performance Matters

Documentation Matters

---

# Tech Stack

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

Prisma ORM

PostgreSQL

Storage

Cloudflare R2

---

# Language Rules

Use TypeScript everywhere.

Do not use JavaScript.

Do not use the `any` type.

Prefer strict typing.

Enable TypeScript Strict Mode.

---

# Formatting

Indentation

2 Spaces

Maximum Line Length

100 Characters

UTF-8 Encoding

LF Line Endings

One Final New Line

---

# Linting

ESLint Required

Prettier Required

No lint warnings.

No formatting errors.

Never disable lint rules without justification.

---

# Naming Convention

Folders

kebab-case

Files

kebab-case

React Components

PascalCase

Pages

kebab-case

Functions

camelCase

Variables

camelCase

Constants

UPPER_SNAKE_CASE

Enums

PascalCase

Interfaces

PascalCase

Types

PascalCase

Hooks

useSomething

Database Tables

snake_case

Database Columns

snake_case

API Routes

kebab-case

Environment Variables

UPPER_SNAKE_CASE

---

# Folder Rules

Group by feature.

Avoid deeply nested folders.

Maximum nesting

4 Levels

Keep related files together.

---

# Component Rules

One Component

One Responsibility

Reusable

Typed Props

Small Components

Composable

No duplicated UI

---

# React Rules

Prefer Functional Components.

No Class Components.

Use Server Components when appropriate.

Use Client Components only when necessary.

Keep state local.

Avoid unnecessary Context.

Memoize only when beneficial.

---

# Hooks

Custom Hooks

Reusable

Single Responsibility

Prefix with

use

Never call hooks conditionally.

---

# Props

Always type props.

Avoid large prop objects.

Prefer explicit props.

Avoid prop drilling when practical.

---

# State Management

Local State

React State

Server State

API

Global State

Only when required

Never store server data unnecessarily.

---

# API Rules

REST API

JSON Only

Versionable

Consistent Response Format

Proper HTTP Status Codes

Server-side Validation Required

Never trust client input.

---

# Error Handling

Always handle errors.

Never swallow exceptions.

Return meaningful error messages.

Never expose internal stack traces.

Log server errors.

---

# Database Rules

Use Prisma only.

No raw SQL unless necessary.

Use transactions.

Use indexes.

Use foreign keys.

Never bypass validation.

---

# Security Rules

Validate all inputs.

Sanitize user data.

Escape output.

Protect admin routes.

Hash passwords.

Secure JWT handling.

Never expose secrets.

---

# Authentication

JWT

Refresh Tokens

RBAC

Protected Routes

Secure Cookies

Session Validation

---

# File Upload

Validate MIME Type.

Validate Size.

Rename Files.

Random Object Keys.

Store in Cloudflare R2.

Never trust filenames.

---

# Logging

Log

Authentication

Orders

Payments

Fraud Detection

Admin Actions

Errors

Never log

Passwords

Secrets

JWT Tokens

Private Keys

---

# Comments

Comment

Why

Not

What

Avoid unnecessary comments.

Code should be self-explanatory.

Document complex business logic only.

---

# Functions

One Responsibility

Short

Predictable

Pure where possible

Return early

Avoid deep nesting.

---

# Classes

Use only when necessary.

Prefer services over large utility classes.

Keep constructors simple.

---

# Services

Authentication Service

Order Service

Payment Service

Fraud Service

Inventory Service

Notification Service

Each service owns one business domain.

---

# Validation

Validate

Frontend

Backend

Database

Backend validation is mandatory.

---

# Async Code

Use

async/await

Avoid nested promises.

Handle rejections.

---

# Imports

Standard Library

↓

Third-party Packages

↓

Internal Packages

↓

Relative Imports

Sort alphabetically.

Remove unused imports.

---

# Environment Variables

Never hardcode credentials.

Use environment variables.

Validate required variables during startup.

---

# Performance Rules

Lazy Load

Pagination

Caching

Image Optimization

Code Splitting

Avoid unnecessary re-renders.

---

# Accessibility

Semantic HTML

Keyboard Navigation

ARIA Labels

Accessible Forms

Focus States

---

# Git Rules

Feature Branches

Small Commits

Meaningful Commit Messages

Pull Requests Required

No direct commits to main.

---

# Commit Message Format

feat:

fix:

refactor:

perf:

style:

docs:

test:

build:

chore:

Examples

feat: add guest checkout

fix: resolve payment validation bug

refactor: simplify order service

---

# Testing Rules

Unit Tests

Integration Tests

Critical Business Logic Tests

Regression Tests

Never merge failing tests.

---

# Documentation

Every major module requires documentation.

Update documentation when architecture changes.

Keep README current.

---

# Code Review Checklist

Readable

Typed

Secure

Tested

Responsive

Accessible

Reusable

No Duplication

No Dead Code

No Console Logs

No Secrets

---

# Forbidden Practices

No any

No console.log in production

No duplicated code

No hardcoded credentials

No inline styles

No SQL string concatenation

No disabled lint rules without reason

No commented-out dead code

No magic numbers

No business logic inside React components

---

# AI Agent Rules

Always generate production-quality code.

Prefer readability over cleverness.

Reuse existing components before creating new ones.

Follow the existing folder structure.

Keep business logic inside services.

Keep controllers thin.

Use TypeScript strict typing everywhere.

Never ignore lint or type errors.

Never bypass validation.

Never hardcode secrets or configuration.

Every feature must include proper error handling.

Every new code change must follow the Design System, Security Guidelines, Performance Guidelines and Testing Strategy documents.

When multiple implementation approaches are valid, choose the one that maximizes maintainability, scalability and consistency with the existing architecture.