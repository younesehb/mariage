# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

This is a monorepo-style layout with a single app. **All code lives in `web/`.** Run commands from there.

- `web/` — Next.js 16 + React 19 app (the product)
- `design.md` — canonical design-system reference (tokens, motion, components, patterns, routing)
- `docs/specs/2026-04-22-wedding-planner-mvp-design.md` — the MVP spec (entities, flows, features)
- `web/AGENTS.md` / `web/CLAUDE.md` — Next.js 16 warning (see below)

## Critical: this is Next.js 16, not the one you know

`web/AGENTS.md` says it plainly — APIs, conventions, and file layout have breaking changes from your training data. Before writing any Next.js-specific code (route handlers, metadata, `cookies()`, `headers()`, dynamic segments, caching), **read the relevant guide in `web/node_modules/next/dist/docs/`**. Start from `01-app/03-api-reference/` for APIs and `01-app/02-guides/` for patterns. Heed deprecation notices.

React is 19.2. Ban `framer-motion` — motion is CSS-only via `tw-animate-css` (see design.md §3).

## Commands (run from `web/`)

**Package manager: bun.** The lockfile is `bun.lock`. Don't reintroduce `pnpm-lock.yaml` or `package-lock.json`.

```bash
bun install     # installs deps; migrates old lockfiles automatically
bun dev         # next dev
bun run build   # next build — use this to verify type + compile errors
bun run lint    # eslint (eslint-config-next flat config)
bun start       # next start (after build)
```

There is no test runner configured. "Verification" = `bun run build` passes cleanly.

## High-level architecture

### Three-surface app, one design system

The app ships three distinct surfaces sharing the same tokens, split by route group:

1. **Public site** (`app/(site)/*`) — has `AppBar`, `BottomNav`, `Footer`, `CookieBanner` via `(site)/layout.tsx`.
2. **Pro / lister dashboard** (`app/pro/*`) — own sidebar + fiche-context card, no site chrome.
3. **Admin** (`app/admin/*`) — own sidebar, no site chrome.

`app/layout.tsx` is the root layout and loads fonts (Fraunces + Inter via `next/font`) + global Toaster. Route groups `admin/` and `pro/` are outside `(site)` specifically so they don't inherit the public chrome. A single `app/not-found.tsx` serves 404 for all surfaces.

### Data is fixture-only

There's no backend. All "data" comes from TypeScript fixtures in `web/lib/fixtures/`:

- `venues.ts`, `vendors.ts`, `reviews.ts`, `social.ts` — the catalog
- `index.ts` exposes helpers: `venueToListing(v)`, `vendorToListing(v)`, `venueBadges(v)`, `reviewsFor(kind, id)`, `avgRating(rs)`, `socialsFor(id)`, `recentPostsFor(id)`

**Always go through these helpers** — don't re-derive listing summaries inline. `ListingSummary` (`lib/types.ts`) is the normalized shape every card, row, and map marker consumes.

User state (planner, favorites, saved guests, checklist) is persisted in `localStorage`:
- `zaffa.plan.v1` — the `WeddingPlan` (see `lib/planner.ts`)
- other keys are prefixed `zaffa.*`

When adding state, use `loadPlan()` / `savePlan()` — `loadPlan` performs forward-migration of older stored shapes (see `WeddingPlan` migrations for `guests`, `tasks`).

### The planner (`/planifier`) is the product spine

`lib/planner.ts` is the single source of truth for:
- `WeddingPlan` shape (names, date, days 1|2, budget, guests, tasks, picks per category)
- `BudgetCategory` + `DEFAULT_BUDGET_CATEGORIES` + `SUGGESTED_ALLOCATION` (ratios tuned for Moroccan-BE weddings — 30% traiteur, 25% salle, etc.)
- `Guest` + `guestTotals()` (respects day1/day2 + plusOne)
- `ChecklistTask` + `PHASE_META` + `DEFAULT_CHECKLIST` (6 phases: khotba → preparation → henne → nikah → walima → post)
- `emptyPlan()`, `buildDefaultTasks()`, `loadPlan()`, `savePlan()`, `budgetTotals()`, `daysUntil()`, `planCompleteness()`

Each planner sub-tool (`/planifier/budget`, `/planifier/invites`, `/planifier/checklist`) is a client component that reads/writes via these helpers. The wizard at `/planifier` shows all three as sidebar tool-cards.

### Vendor category system

8 categories, all metadata in `lib/category-meta.ts` keyed by `VendorCategory`. Each has `icon`, `tint`, `accentFg`, `labelFr`, `labelNl`, `taglineFr`, `descriptionFr`. **Never inline category labels or tints** — always pull `CATEGORIES[key]`.

### Two-day weddings are first-class

Moroccan weddings often split across two days (men's / women's). The data model carries this everywhere:
- `WeddingPlan.days: 1 | 2`, `secondaryDate`, `guestsSecondary`, `dayLabeling: "neutral" | "men_women"`
- `Inquiry.inquiryType: "single_day" | "two_day"` + `datePrimary` / `dateSecondary`
- `Guest.days: { day1: boolean; day2: boolean }`
- UI labels respect `dayLabeling` — "Hommes/Femmes" when `men_women`, "Jour 1/Jour 2" when `neutral`

When building anything that shows or captures day info, read `plan.dayLabeling` and adapt the label.

### Map (`components/venue-map.tsx`)

MapLibre via `react-map-gl/maplibre` + OpenStreetMap tiles (no token needed). Pattern:
- Price-hint pill markers (fall back to tier, then `·`) with rating chip
- Hover sync with the result list (bidirectional via `activeId` + `onSelectListing`)
- `fitBounds` re-runs on every `withCoords` change (Airbnb-style snap-to-results)
- Click-a-marker opens a `Popup` mini-card and eases the map with `offset: [0, 100]` so the card has headroom
- Scoped global CSS overrides strip default maplibre popup chrome; popup is promoted to `z-index: 50` so active markers (3) never cover it

### Base UI for primitives, not Radix

Primitives come from `@base-ui/react` (v1.4). `PlanifierMenu` uses `Popover` with **native** `openOnHover` / `delay` / `closeDelay` on the Trigger — don't re-implement hover with `useState` + timeouts.

Toasts are `sonner`. Icons are `lucide-react` v1.8 (which is **pre-major** — it doesn't export Instagram/TikTok/Facebook; those are hand-rolled in `components/social-links.tsx`).

## Design system guardrails (from `design.md`)

Read `design.md` before non-trivial UI work — it is canonical. Short version:

- **One accent color: garnet.** Greens, ambers, reds are *only* semantic.
- **Two fonts: Fraunces (serif, all headlines), Inter (sans, body).** Never Inter for `h1`.
- **Radii.** `rounded-xl` for cards, `rounded-pill` for chips/badges.
- **Elevation.** `shadow-e1` (card hover), `shadow-e2` (modals), `shadow-e3` (drawers). Never add new shadow tokens.
- **Motion.** `animate-in fade-in slide-in-from-bottom-6 duration-500` for entering sections; `hover:-translate-y-0.5` + `shadow-e1` for card lifts.
- **Photo fallbacks.** Use CSS classes `photo-fallback`..`photo-fallback-5` from `globals.css` — there are no real photos in the fixture data.
- **Never write raw hex.** Use tokens (`text-ink`, `bg-surface-muted`, `border-hairline`, `text-garnet`, etc.).

## Domain conventions that surprise newcomers

- **Halal is implicit, never a toggle.** Alcohol / halal-certification are intentionally not surfaced in UI. Don't add them.
- **Instagram first, WhatsApp second, email third** — the order on vendor contact cards is load-bearing (Moroccan wedding vendors in BE operate on IG).
- **FR is source-of-truth, NL is a peer** (not machine-translated). Long-form entity fields are stored per-language (`description.fr`, `description.nl`). Arabic / RTL is out of scope for v1.
- **Fixtures are rich.** Don't add "demo data" unless the fixtures don't cover it — check `lib/fixtures/` first.
- **Contextual help pattern.** Pages use `<HelpCallout>` (`components/help-callout.tsx`), collapsed by default, showing a right-aligned "Aide" pill users expand on demand. Don't auto-open.

## Route map

The full contract is in `design.md` §7. At a glance:

```
app/(site)/
├── page.tsx                     home
├── salles/, salles/[slug]/      venue search + detail (map + list)
├── prestataires/, .../[slug]/   vendor directory + detail
├── planifier/                   wizard + tools
│   ├── budget/, invites/, checklist/
├── favoris/, demandes/, profil/
├── connexion/, inscription/, reclamer/
└── (legal)/                     cgu, confidentialité, cookies, mentions

app/pro/                         dashboard, demandes, fiche, calendrier, avis
app/admin/                       dashboard, salles, prestataires, demandes, avis, réclamations
```

## When writing code

1. If it's a client component (state, effects, event handlers), mark `"use client"`.
2. Prefer `Edit` over `Write` for existing files.
3. Default to **no comments**. Only add a `// Why:` when a non-obvious invariant is at stake.
4. **No emojis in code** (only if the user explicitly asks).
5. Listing summaries → `venueToListing` / `vendorToListing`. Category metadata → `CATEGORIES[key]`. Plan state → `loadPlan` / `savePlan`. Never duplicate.
6. Verify with `bun run build` before claiming done.
