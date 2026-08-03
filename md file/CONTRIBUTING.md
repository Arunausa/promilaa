# CONTRIBUTING.md — Promilaa

How humans and AI assistants should work in this repository.

## 1. Before You Write Code
- Read `MASTER_CONTEXT.md` first — it is the tie-breaker for every
  other doc.
- Check `DEVELOPMENT_ORDER.md` — confirm the module you're about to
  build is unblocked (its dependencies are already built/approved).
- Check `DATABASE_SCHEMA.md` and `API_SPEC.md` for anything your
  change touches — don't improvise a shape that isn't documented;
  update the doc in the same change if the shape needs to evolve.

## 2. Locked Decisions Are Locked
Per `MASTER_CONTEXT.md` §3: stack choices, manual-only payments, and
the "no code before doc approval" gate are not to be silently changed
by any contributor (human or AI). If a locked decision genuinely needs
to change, raise it explicitly with the user/team and update
`MASTER_CONTEXT.md` as part of that change — don't let the docs and
the code drift apart.

## 3. Code Style
- TypeScript strict mode across frontend and backend.
- Components typed with explicit props interfaces (see
  `COMPONENT_LIBRARY.md` §Conventions).
- Server-side validation on every write endpoint — never trust
  client input, especially for pricing/totals (`SECURITY.md` §3,
  `ORDER_FLOW.md` §3).
- Follow `DESIGN_SYSTEM.md` tokens — no hardcoded hex colors or
  arbitrary spacing values in components.

## 4. Commits & PRs
- Small, reviewable PRs scoped to one module where possible (matches
  `DEVELOPMENT_ORDER.md` sequencing).
- PR description references which doc(s) the change implements
  (e.g. "Implements Payment Verification Queue per ADMIN_PANEL.md §6
  and COD_PAYMENT_FLOW.md §6").
- Every PR touching schema includes the migration.
- Every PR touching a documented flow/endpoint includes the doc
  update in the same PR — docs and code should never merge out of
  sync.

## 5. Testing Expectations
- New endpoints: at minimum, happy-path + one failure-path test.
- New UI flows touching money (checkout, payment verification):
  covered in `TESTING_CHECKLIST.md` before considered done — add a
  checklist item there if one doesn't already exist for it.

## 6. Design Review
- Any new storefront-facing component should be checked against
  `UI_UX_GUIDELINES.md` and `DESIGN_SYSTEM.md` before merge —
  specifically: does it look like it belongs to a premium
  international fashion brand, or does it look like a generic
  template default? If in doubt, it doesn't ship as-is.

## 7. AI-Assistant-Specific Notes
- Do not introduce new libraries/services outside what's specified in
  `MASTER_CONTEXT.md` §3 without asking first.
- Do not implement SSLCommerz/SurjoPay/AmarPay — that's `ROADMAP.md`,
  not this repo's current scope.
- If a request would violate `DEVELOPMENT_ORDER.md` sequencing (e.g.
  "build the admin payment queue" before the payment-proof submission
  API exists), flag the dependency rather than building an
  unconnected mock.
- If a source doc is ambiguous or silent on something (e.g. shipping
  fee model, returns policy — see `PRD.md` §8), don't invent a
  business decision silently; state the assumption being made and
  flag it for confirmation.

## 8. Getting Unstuck
If two docs in this set appear to conflict, `MASTER_CONTEXT.md` wins.
If `MASTER_CONTEXT.md` doesn't resolve it either, that's a genuine
open question — surface it rather than guessing, per §7 above.
