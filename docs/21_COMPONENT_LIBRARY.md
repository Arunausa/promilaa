# 21_COMPONENT_LIBRARY.md

# Component Library

Project: Promilaa

Version: 1.0

Status: Production

Priority: High

---

# Overview

This document defines every reusable UI component used throughout Promilaa.

The goal is consistency, maintainability, accessibility, and reusability.

Every component should be built once and reused everywhere.

Do not duplicate UI code.

---

# Design Principles

Minimal

Premium

Elegant

Modern

Responsive

Accessible

Reusable

Composable

---

# Design Inspiration

Zara

COS

Massimo Dutti

Mango

Aritzia

Uniqlo

Apple

Avoid template-like ecommerce designs.

---

# Tech Stack

Next.js

React

TypeScript

Tailwind CSS

shadcn/ui

Framer Motion

Lucide Icons

---

# Component Structure

components/

ui/

layout/

forms/

cards/

sections/

navigation/

feedback/

commerce/

admin/

charts/

---

# Layout Components

AppLayout

PageContainer

Section

Grid

Flex

Stack

Divider

Spacer

Container

ResponsiveWrapper

---

# Navigation Components

Navbar

MobileMenu

Sidebar

Breadcrumb

Pagination

Tabs

MegaMenu

CategoryMenu

SearchBar

SearchDropdown

---

# Hero Components

HeroBanner

HeroSlider

VideoHero

CollectionHero

CampaignBanner

AnnouncementBar

---

# Commerce Components

ProductCard

ProductGrid

ProductCarousel

ProductGallery

ProductImage

ProductBadge

PriceDisplay

DiscountBadge

StockBadge

VariantSelector

SizeSelector

QuantitySelector

ColorSelector

WishlistButton

AddToCartButton

BuyNowButton

ShareButton

---

# Cart Components

CartDrawer

CartSidebar

CartItem

CartSummary

CartCoupon

ShippingCalculator

OrderSummary

EmptyCart

---

# Checkout Components

AddressForm

PaymentMethod

ShippingMethod

CouponInput

CheckoutSummary

PaymentProofUpload

TransactionInput

OrderSuccess

---

# Customer Components

LoginForm

RegisterForm

ForgotPasswordForm

ProfileCard

AddressCard

OrderCard

WishlistCard

ReviewCard

NotificationCard

---

# Admin Components

DashboardCard

StatCard

RevenueChart

OrderTable

ProductTable

CustomerTable

PaymentTable

FraudTable

AuditLogTable

InventoryTable

QuickActions

StatusBadge

---

# Form Components

Input

Textarea

Select

Checkbox

Radio

Switch

DatePicker

PhoneInput

OTPInput (Future)

FileUpload

ImageUpload

SearchInput

PasswordInput

---

# Feedback Components

Toast

Alert

SuccessMessage

ErrorMessage

LoadingSpinner

Skeleton

ProgressBar

ConfirmationDialog

EmptyState

---

# Buttons

PrimaryButton

SecondaryButton

OutlineButton

GhostButton

DangerButton

IconButton

LoadingButton

FloatingButton

---

# Cards

ProductCard

CategoryCard

CollectionCard

BlogCard (Future)

ReviewCard

FeatureCard

OfferCard

StatisticCard

---

# Modals

LoginModal

RegisterModal

QuickView

DeleteConfirmation

ImagePreview

PaymentProofPreview

AddressModal

---

# Tables

Orders

Products

Customers

Payments

Coupons

Inventory

Fraud Reports

Audit Logs

---

# Filters

CategoryFilter

PriceFilter

SizeFilter

ColorFilter

AvailabilityFilter

SortDropdown

SearchFilter

---

# Icons

Lucide Icons

Consistent size

16

20

24

32

No mixed icon libraries.

---

# Typography

Primary Font

Modern Sans-serif

Font Scale

12

14

16

18

20

24

30

36

48

Consistent spacing.

---

# Colors

Primary

Black

Secondary

White

Accent

Neutral Gray

Success

Green

Warning

Orange

Danger

Red

Info

Blue

Use design tokens.

---

# Spacing

4px Grid System

4

8

12

16

20

24

32

40

48

64

80

96

---

# Border Radius

Small

6px

Medium

12px

Large

16px

Extra

24px

Rounded Full

Buttons

Badges

Avatars

---

# Shadows

Subtle

Medium

Large

Premium Soft Shadows

Avoid heavy shadows.

---

# Animations

Framer Motion

Hover

Fade

Slide

Scale

Page Transition

Modal Transition

Drawer Animation

Respect prefers-reduced-motion.

---

# Responsive Breakpoints

Mobile

320+

Tablet

768+

Laptop

1024+

Desktop

1280+

Large Desktop

1536+

---

# Accessibility

Keyboard Navigation

ARIA Labels

Focus Ring

Screen Reader Support

Semantic HTML

High Contrast

Accessible Forms

---

# Performance

Memoized Components

Lazy Loading

Dynamic Imports

Image Optimization

Minimal Re-renders

---

# Naming Convention

Component

PascalCase

Hooks

useSomething

Props

SomethingProps

Files

ComponentName.tsx

---

# Component Rules

Single Responsibility

Reusable

Fully Typed

No Inline Styles

No Duplicate Components

Accept Props

Support Dark Theme (Future)

Easy to Test

---

# AI Agent Rules

Create reusable components only.

Never duplicate UI.

Follow atomic and feature-based composition.

Use shadcn/ui as the base where appropriate.

All components must be fully typed.

Every interactive component must be accessible.

Follow the Design System and UI/UX Guidelines before creating new components.

Prefer composition over inheritance.

Every component should be production-ready, responsive, and easily reusable across both customer and admin interfaces.