# DESIGN_SYSTEM.md — Promilaa

Executable design tokens for a Zara/COS-inspired aesthetic, built on
Tailwind CSS + shadcn/ui. Pair with `UI_UX_GUIDELINES.md` (principles)
and `COMPONENT_LIBRARY.md` (component inventory).

---

## 1. Color

Restrained, editorial palette — color is used sparingly so photography
and typography lead.

| Token | Hex (suggested) | Use |
|---|---|---|
| `background` | `#FFFFFF` | Primary surface |
| `foreground` | `#111111` | Primary text |
| `muted` | `#F5F4F2` | Section backgrounds, cards |
| `muted-foreground` | `#6B6B6B` | Secondary text |
| `border` | `#E5E3E0` | Dividers, input borders |
| `accent` | `#1A1A1A` | Buttons, CTAs (near-black, not a "brand color") |
| `accent-foreground` | `#FFFFFF` | Text on accent |
| `destructive` | `#B3261E` | Errors, out-of-stock, reject actions |
| `success` | `#2E6B4F` | Confirmations, verified payment |
| `warning` | `#B8860B` | Pending verification states |

No bright brand color is mandated by the source specs — this palette
assumes near-monochrome with functional color reserved for status
(error/success/warning), consistent with the Zara/COS reference.
Confirm with brand guidelines if Promilaa has an official accent color.

## 2. Typography

- **Display/Headline font**: a high-contrast serif or clean
  grotesque sans (e.g. a pairing like "Söhne"/"General Sans" style
  grotesque for headlines) — large, confident, generous letter-
  spacing on uppercase treatments (e.g. nav logo, section eyebrows).
- **Body font**: a neutral sans (e.g. Inter/Helvetica Neue style) for
  readability at small sizes.
- Scale (Tailwind-friendly, rem-based):

| Token | Size | Use |
|---|---|---|
| `text-display` | 3.5rem–5rem, clamp() responsive | Hero headline |
| `text-h1` | 2.25rem | Page titles |
| `text-h2` | 1.5rem | Section titles |
| `text-h3` | 1.125rem | Card/product titles |
| `text-body` | 1rem | Body copy |
| `text-sm` | 0.875rem | Meta, labels |
| `text-xs` | 0.75rem | Legal, fine print |

- Line height generous (1.4–1.6 body, 1.1–1.2 display).
- Uppercase + letterspacing used sparingly for labels/eyebrows only,
  never for long-form body text (accessibility + readability).

## 3. Spacing

8px base unit, Tailwind default scale used as-is. Section vertical
rhythm on desktop: `py-24` to `py-32` between major homepage sections
to reinforce the "whitespace is a feature" principle from
`06_AI_BUILD_GUIDELINES.md`. Mobile compresses to `py-12`–`py-16`.

## 4. Grid & Layout

- Max content width: `1440px`, with `1280px` typical reading/content
  container.
- 12-column grid on desktop, 4-column on mobile.
- Product grids: 4-up desktop, 2-up mobile, 3-up tablet, consistent
  aspect ratio (e.g. 3:4 portrait) across all product imagery.

## 5. Motion (Framer Motion)

- **Page transitions**: subtle fade/slide (200–350ms, ease-out).
- **Scroll reveals**: staggered fade-up on section entry (once, not
  repeating on scroll-back, to avoid distraction).
- **Hover states**: image scale (1.0 → 1.03–1.05) on product cards,
  underline/opacity shifts on links — 150–250ms.
- **Micro-interactions**: add-to-cart confirmation, wishlist heart
  toggle, cart drawer slide-in.
- All motion must respect `prefers-reduced-motion: reduce` — fall
  back to instant/no animation. See `UI_UX_GUIDELINES.md` §Accessibility.
- No motion should block interaction or delay perceived load — content
  is visible/usable before animation completes wherever possible.

## 6. Imagery

- Full detail in `IMAGE_GUIDE.md`. Design-relevant rule: consistent
  aspect ratios and consistent background/lighting treatment across
  all product photography is what makes a catalog feel premium —
  more than any individual photo's quality.

## 7. Buttons & Interactive States

| Variant | Use |
|---|---|
| Primary (solid `accent`) | Add to cart, checkout, primary CTA |
| Secondary (outline) | Secondary actions (wishlist, filter) |
| Ghost/text | Tertiary nav-level actions |
| Destructive | Remove item, reject payment (admin) |

All interactive elements: visible focus ring (accessibility),
disabled state with reduced opacity + `cursor-not-allowed`, loading
state with spinner/skeleton — never a silently frozen button.

## 8. Iconography

Single icon set throughout (e.g. Lucide, which pairs natively with
shadcn/ui) — no mixing icon libraries. Line-style icons, consistent
stroke width, sized to type scale.

## 9. Tailwind/shadcn Implementation Notes

- Define all tokens above as CSS variables in `globals.css` and map
  through `tailwind.config.ts` `theme.extend.colors` — never hardcode
  hex values in components.
- Use shadcn/ui primitives (Button, Sheet, Dialog, Dropdown, Tabs,
  Toast, Skeleton) as the base layer; theme them to match tokens
  rather than building bespoke primitives from scratch.
