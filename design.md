# Zaffa — Design System (design.md)

> This file is the canonical design reference for the Zaffa codebase. It follows
> the `design.md` convention popularised by Google Stitch — a structured
> markdown file AI coding tools can ground their output in. Any change to the
> visual language belongs here first.
>
> **Keep in sync with `web/app/globals.css` and `web/lib/category-meta.ts`.**

## 1. Product context

**Zaffa** is a bilingual (FR + NL) web application for the Moroccan diaspora in
Belgium planning Muslim weddings. The primary user is anyone organising a
wedding; secondary audiences are listing owners (salles and vendors) and
platform admins.

**Tone.** Airbnb-sober, editorial, photography-led. Culturally rooted without
costume-y ornament. The product is implicitly halal-first — alcohol and
halal-certification flags are intentionally not surfaced as toggles because
they're either default or not a useful signal (everyone is).

**Voice.** French first, warm and direct, no exclamation marks, no bureaucratic
jargon. Use second-person. Examples:

- Yes: *"Envoyez une demande — la salle vous confirme la disponibilité."*
- No: *"Cliquez ici pour soumettre votre demande !"*

## 2. Design tokens

All tokens live in `web/app/globals.css` under `@theme inline`. When editing,
mirror changes here.

### 2.1 Colour

| Token | Value (oklch) | Hex hint | Usage |
| --- | --- | --- | --- |
| `--ink` | `oklch(0.22 0 0)` | `#222` | Primary text |
| `--ink-muted` | `oklch(0.48 0 0)` | `#6B6B6B` | Secondary text, captions |
| `--surface` | `oklch(0.985 0.002 85)` | `#FAFAF7` | Page background (warm off-white) |
| `--surface-muted` | `oklch(0.95 0.005 85)` | `#F1EFEA` | Inset panels, muted rows |
| `--hairline` | `oklch(0.90 0.003 85)` | `#E4E2DD` | Default borders |
| `--hairline-strong` | `oklch(0.82 0.005 85)` | `#C9C5BD` | Hover/focus borders |
| `--garnet` | `oklch(0.37 0.11 15)` | `#7A1E2D` | Single product accent |
| `--garnet-hover` | `oklch(0.30 0.11 15)` | | Garnet interactive hover |
| `--garnet-soft` | `oklch(0.96 0.015 15)` | `#F6ECEE` | Accent backgrounds, callouts |
| `--success` | `oklch(0.51 0.13 150)` | green | Confirmations, "accepted" |
| `--warning` | `oklch(0.65 0.15 55)` | amber | Pending, soft warnings |
| `--error` | `oklch(0.54 0.19 27)` | red | Declined, destructive |

**Rule.** There is one accent colour — garnet. No second accent. Greens, ambers,
and reds are *only* semantic (success / warning / error). Do not use them for
decoration.

**Contrast target.** WCAG AA. `ink` on `surface` is 4.5+. `text-inverse` on
`garnet` is 4.5+.

### 2.2 Typography

Two families, both Google Fonts, loaded via `next/font`:

- **Display/Serif — Fraunces** (`--font-fraunces`). Used for all `font-serif`
  classes and implicitly for `h1`–`h4` via `globals.css`. Letter-spacing
  `-0.01em`. Optical-size and SOFT axes enabled.
- **Body/Sans — Inter** (`--font-inter`). Used for `font-sans` and body copy.
  Feature-settings `cv11 ss01 ss03` for refined alternates.

Scale (desktop / mobile, line-height):

- Display `48/56` / `36/44` — hero only
- H1 `32/40` / `28/36`
- H2 `24/32` / `22/30`
- H3 `20/28` / `18/26`
- Body `16/24`
- Body-strong `16/24` semibold
- Small `14/20`
- Caption `12/16` medium
- Button `14/20` semibold

**Italics.** Fraunces italic is a feature — use it for emphasis in hero lines
(`<span className="italic text-garnet">sans le parcours du combattant</span>`).

### 2.3 Spacing

4-base grid: `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64`. Prefer Tailwind
`gap-3 / p-4 / mt-6 / px-8` etc. Never inline pixel values.

### 2.4 Radii

| Token | Value | Usage |
| --- | --- | --- |
| `--radius-sm` | 4px | Inner dividers, tiny elements |
| `--radius-md` | 8px | Inputs, list rows |
| `--radius-lg` | 12px | Cards, buttons (default) |
| `--radius-xl` | 16px | Hero cards, modals |
| `--radius-pill` | 999px | Chips, badges, oval CTAs |

### 2.5 Elevation

Two shadow tiers. Never more:

- `--shadow-e1` — `0 1px 2px rgb(0 0 0 / 0.06)` — subtle card hover
- `--shadow-e2` — `0 8px 24px rgb(0 0 0 / 0.10)` — modals, bottom sheets
- `--shadow-e3` — `0 16px 40px rgb(0 0 0 / 0.14)` — full-height drawers

## 3. Motion

- **Entry.** Every modal, drawer, and step transition uses
  `animate-in fade-in slide-in-from-{direction}-{n} duration-{200-500}`
  (via `tw-animate-css`).
- **Progress bars.** `transition-all duration-700 ease-out`.
- **Check badges.** `animate-in zoom-in duration-300` on appearance.
- **Hover lifts.** Cards use `hover:-translate-y-0.5` paired with `shadow-e1`.
- **No framer-motion** in the project. Keep motion CSS-only to preserve bundle
  size and avoid SSR hydration quirks.

## 4. Layout primitives

- Content max-width: **1280px**. Body gutter 32px desktop, 16px mobile.
- Page sections: top/bottom padding `py-10` mobile, `py-14 md:py-16` desktop.
- Card pattern: `rounded-xl border border-hairline bg-card p-5 md:p-6`.
- Forms: labels above inputs. Never placeholder-only. Required fields show `*`
  in garnet.

## 5. Component library

Located in `web/components/`. Named consistently.

### 5.1 Primitive

- `Button` (shadcn/ui) — primary = garnet, ghost for secondary, danger = error
- `Input`, `Textarea`, `Select`, `Checkbox`, `RadioGroup` (shadcn)
- `Badge`, `Toggle`, `Separator`, `Tabs` (shadcn)
- `StarRating` (`components/ui/star-rating.tsx`) — role="img", size sm/md
- `SocialLinks` (`components/social-links.tsx`) — row / stacked variants,
  ships its own Instagram/TikTok/Facebook SVG glyphs because Lucide v1.8
  doesn't export them

### 5.2 Composite

- `ListingCard` — photo-forward card for any listing type. Two visual modes:
  - **Grid** (default) — 16:9 photo + title + badges + rating
  - **List** — horizontal thumb + stacked meta + CTA, used in
    `/salles`, `/prestataires`, `/favoris` when user selects list view
- `SearchBar` — hero variant (three-segment pill) and inline variant (compact)
- `FilterPill` — chips for sticky filter row; min-h 44px per a11y
- `FilterDrawer` — side sheet for drawer filters
- `PhotoMosaic` — 5-tile mosaic used on venue detail heroes
- `ReviewCard`, `ReviewForm` — avatar-tone initials, stars, photo uploader
- `InquiryCard` — sidebar on desktop, sticky-bottom on mobile
- `RecentPosts` — 6-tile Instagram-style grid with hover overlay
- `VenueMap` — MapLibre + OSM, price-tier pills as markers
- `PeekDrawer` (planifier) — rich preview side-drawer for choosing from wizard

### 5.3 Layout

- `AppBar` — desktop sticky top bar
- `BottomNav` — mobile fixed bottom nav with 4 tabs
- `Footer` — desktop-only multi-column footer
- `Wordmark` — `zaffa.` with concentric-dot mark
- `LanguageSwitcher` — header / footer / settings variants

## 6. Patterns

### 6.1 Photo fallbacks

Because the MVP has no real photos, every listing uses CSS gradient classes
`photo-fallback` through `photo-fallback-5` defined in `globals.css`. Each is
a unique warm hue. When real photos arrive, retain these classes as skeleton
backgrounds.

### 6.2 Empty states

Every screen that fetches data has an empty state with:
- A muted Lucide icon (or sparkles)
- Fraunces h2 headline
- Sentence subtext
- One primary CTA

### 6.3 Three-surface model

The app ships three distinct surfaces that share the same tokens:

1. **Public site** — `app/(site)/*` — AppBar + BottomNav + Footer
2. **Admin** — `app/admin/*` — own sidebar, no site chrome
3. **Pro (lister)** — `app/pro/*` — own sidebar with fiche-context card

The chrome is controlled by route groups: `(site)` has a layout; `admin` and
`pro` each have their own.

### 6.4 Category system (vendors)

Defined in `lib/category-meta.ts`. 8 categories, each with:
- `icon` — a Lucide icon
- `tint` — a soft bg class (e.g. `bg-[oklch(0.94_0.04_45)]`)
- `accentFg` — the matching foreground class
- `labelFr`, `labelNl`, `taglineFr`, `descriptionFr`

Always pull category metadata through `CATEGORIES[key]`, never duplicate.

### 6.5 Inquiry & two-day pattern

Moroccan weddings are often split across two days (men's / women's). The
inquiry model has first-class support:

- `inquiryType: "single_day" | "two_day"`
- `dayLabeling: "neutral" | "men_women"` — neutral reads "Day 1 / Day 2",
  men-women reads "Jour hommes / Jour femmes"
- `datePrimary` + optional `dateSecondary`, each with its own guest count
- The inquiry modal shows the labeling toggle only when two-day is active

### 6.6 Social-first listings

Every claimed listing surfaces:
- `SocialLinks` pill row under the title (IG / TikTok / FB / site)
- `RecentPosts` 6-tile grid above the reviews

Because IG is how Moroccan wedding halls in Belgium actually communicate,
**the listing must always feel fresh**, not frozen. Fetching IG is fixture-only
in MVP; production uses Graph API + 1h cache.

### 6.7 Planner (onboarding)

`/planifier` — an 8-step wizard persisted in `localStorage` at `zaffa.plan.v1`.
Key mechanics:
- Sidebar with clickable step timeline and a progress bar
- Each step animates in with `fade + slide-in-from-bottom`
- Picker tiles open a `PeekDrawer` — never auto-commit
- Final step shows a 100%-celebration gradient, J-N countdown, per-choice edit
  shortcuts, and "Prochaines actions" deep-linking to inquiry flows

## 7. Routing contract

```
/                         user home (hero + editorial rows)
/salles                   venue search (map + list)
/salles/[slug]            venue detail
/prestataires             vendor directory (category pills + filter drawer)
/prestataires/[slug]      vendor detail (traiteur parity OR lighter template)
/planifier                wedding planner wizard
/favoris                  saved listings
/demandes                 user's sent inquiries
/profil                   account settings

/pro                      lister dashboard
/pro/demandes             scoped inquiries inbox
/pro/fiche                edit listing form
/pro/calendrier           availability grid
/pro/avis                 reviews + reply

/admin                    admin dashboard
/admin/salles             venues table
/admin/prestataires       vendors table
/admin/demandes           all inquiries
/admin/avis               flagged reviews
/admin/reclamations       claim requests

/connexion                auth (log-in / sign-up / forgot)
/reclamer                 claim-a-listing form
```

Route groups: everything user-facing lives under `app/(site)/`. `/admin` and
`/pro` are outside the group so they don't inherit the site chrome.

## 8. Internationalisation

- FR is the default and the source-of-truth copy
- NL is a peer language (not machine-translated)
- Long-form fields on entities are stored per language: `description.fr` /
  `description.nl`
- UI strings will live in a translation file (not yet wired — `next-intl`
  installed, keys pending)
- Arabic / RTL is explicitly out of scope for v1

## 9. Data model anchors

Matches the spec at `docs/superpowers/specs/2026-04-22-wedding-planner-mvp-design.md`.

Key entities:
- `Venue` — capacity, gender-separation, prayer/wudu, parking, curfews,
  traiteur policy, price tier + optional range
- `Vendor` — 8 categories; traiteurs have menu/price/delivery extensions
- `Review` — per-user, rating + text + photos, visit month, flag count
- `Inquiry` — single or two-day, with optional labeling
- `SocialLinks`, `SocialPost` — handles + feed data
- `WeddingPlan` — localStorage shape used by `/planifier`

## 10. Accessibility baseline

- Target WCAG 2.2 AA
- Every interactive element has a visible focus ring (outline-ring)
- Touch targets ≥ 44×44 px on mobile (including filter chips — scroll rather
  than shrink)
- Forms use label-above-input, `aria-describedby` for errors, `*` + "required"
  for required fields
- StarRating is announced as "Note : N sur 5"
- Map announces "Map showing N venues, list available on the left"; every pin
  has a matching keyboard-focusable list item

## 11. Out of scope (v1)

- Real payments (Stripe, deposits, contracts)
- Arabic / RTL
- Self-serve vendor onboarding (vendors claim existing listings instead)
- SMS / push notifications
- Full analytics in pro dashboard (stub numbers for now)

## 12. Extension guidelines for AI tools

When asked to add a new page or component, an LLM reading this file should:

1. Reuse tokens (`text-ink`, `bg-garnet-soft`, `border-hairline`, etc.) — never
   introduce raw hex values
2. Use Fraunces for headlines, Inter for body — never Inter for `h1`
3. Apply `animate-in fade-in slide-in-from-bottom-6 duration-500` to any
   section that enters after interaction
4. Match card radius (`rounded-xl`) and elevation (`shadow-e1`) unless a
   deliberate deviation is specified
5. Pull category metadata from `CATEGORIES` in `lib/category-meta.ts`
6. Prefer peek-drawer patterns over navigation for "show me more" actions
   inside wizards
7. Surface Instagram first, WhatsApp second, email third for vendor contact —
   never rearrange this order
8. Keep copy in French as the source, with NL optional; never mention alcohol
   or halal flags in UI
