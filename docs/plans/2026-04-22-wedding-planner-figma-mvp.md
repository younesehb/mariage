# Wedding Planner — Figma MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce the complete Figma MVP design file for the Belgian-Moroccan wedding planner web app, matching the approved spec at `docs/superpowers/specs/2026-04-22-wedding-planner-mvp-design.md`.

**Architecture:** Token-first design system in Figma. Build atoms → composites → screens → prototype. All components use variants and Auto Layout so they're swappable and dev-handoff-ready. Mobile and desktop artboards are first-class and built in parallel per screen.

**Tech Stack:** Figma (design tool), Figma MCP server (for component creation + screenshots), Airbnb Community UI Kit as style reference, Mapbox static tiles as map placeholder.

**Spec reference:** `docs/superpowers/specs/2026-04-22-wedding-planner-mvp-design.md`
**Style reference:** `https://www.figma.com/design/gprST43K9LTPJe2Xnt68eJ/Airbnb-UI-Kit--Community-`

---

## Plan Notes — Figma-Specific Adaptations

**MCP-driven tasks vs manual:** Figma MCP offers `create_new_file`, `generate_diagram`, `get_design_context`, and `get_screenshot` — but not a general "write a frame / component" primitive. Tasks that will be MCP-driven: 0.1 (file creation), 9.1 (flow diagrams). All component and screen building (Phases 1–8, 11.2) is **manual Figma work**. MCP `get_design_context` is useful as a reference-lookup tool against the Airbnb Community UI Kit.

This plan targets a Figma file, not a code repo. "TDD" is adapted as follows:

- **Failing test →** Define the component/screen's contract (variants, states, constraints from the spec) before building it.
- **Implementation →** Build the component/screen in Figma via MCP tools where possible, manual design where not.
- **Passing test →** Visual + spec check: all variants present, all states reachable, responsive behavior verified, token usage audited (no raw hex).
- **Commit →** Named version in Figma (`File → Show version history → Add to version history`). Use the exact milestone names listed per task.

Git is not required for the Figma file itself, but commit **this markdown plan** and the spec to git so progress is trackable in the repo. Each task's final step commits the plan-progress checkboxes.

---

## Phase 0 — Figma File Setup

### Task 0.1: Create the Figma file and page structure

**Files:**
- Create: new Figma file `Wedding Planner MVP`
- Create: pages 1–10 per spec §8

- [ ] **Step 1: Create a new Figma file** via MCP `create_new_file` with title "Wedding Planner MVP - Belgium".
- [ ] **Step 2: Rename the default page to `01 · Cover`. Then add these pages in order:**
    - `02 · Design System`
    - `03 · Flows`
    - `04 · Desktop — Public`
    - `05 · Desktop — Authed`
    - `06 · Mobile — Public`
    - `07 · Mobile — Authed`
    - `08 · Admin (wireframes)`
    - `09 · Empty / Loading / Error States`
    - `10 · Archive`
- [ ] **Step 3: Verify** — all 10 pages exist and are ordered; page names match exactly.
- [ ] **Step 4: Version milestone** — "v0.1 — File scaffold".

### Task 0.2: Build the Cover page

**Files:**
- Modify: `01 · Cover`

- [ ] **Step 1: Create a single 1440×900 frame** titled `Cover`.
- [ ] **Step 2: Add title** "Wedding Planner — Belgian Moroccan Diaspora MVP".
- [ ] **Step 3: Add a status block** with: Spec link, Plan link, Last-updated date, Status = "In progress".
- [ ] **Step 4: Add a TOC** listing each page with a short description matching §8 of the spec.
- [ ] **Step 5: Commit the plan update** — tick the boxes for 0.1 and 0.2 in this file and `git add … && git commit -m "figma: page structure + cover"` (requires `git init` — do that now if not done).

---

## Phase 1 — Design Tokens

Build the design system foundation before any component. Spec §9.

### Task 1.1: Color tokens

**Files:**
- Modify: `02 · Design System` → frame `Tokens / Color`

- [ ] **Step 1: Define Figma color styles** (exact hex values):
    - `color/bg/default` `#FAFAF7`
    - `color/bg/muted` `#F1EFEA`
    - `color/text/ink` `#222222`
    - `color/text/muted` `#6B6B6B`
    - `color/text/inverse` `#FFFFFF`
    - `color/border/default` `#E4E2DD`
    - `color/border/strong` `#C9C5BD`
    - `color/accent/default` `#7A1E2D` (deep garnet)
    - `color/accent/hover` `#5E1622`
    - `color/accent/soft` `#F6ECEE`
    - `color/success` `#2F7A4D`
    - `color/warning` `#C97A1E`
    - `color/error` `#B3261E`
    - `color/map/pin` = `color/accent/default`
    - `color/map/pin-active` `#222222`
- [ ] **Step 2: Create a swatch frame** showing every token with its name and hex.
- [ ] **Step 3: Verify** — contrast ratios audited with Stark (or manually): `text/ink` on `bg/default` ≥ 4.5:1; `text/inverse` on `accent/default` ≥ 4.5:1. If garnet fails contrast on text, note the fallback.
- [ ] **Step 4: Version milestone** — "v0.2 — Color tokens".

### Task 1.2: Typography tokens

**Files:**
- Modify: `02 · Design System` → frame `Tokens / Typography`

- [ ] **Step 1: Install/select fonts** — Fraunces (display/serif) and Inter (body/sans).
- [ ] **Step 2: Create text styles** per spec §9 (desktop sizes first, mobile variants second):
    - `text/display` 48/56 Fraunces Semibold
    - `text/h1` 32/40 Fraunces Semibold
    - `text/h2` 24/32 Fraunces Medium
    - `text/h3` 20/28 Inter Semibold
    - `text/body` 16/24 Inter Regular
    - `text/body-strong` 16/24 Inter Semibold
    - `text/small` 14/20 Inter Regular
    - `text/caption` 12/16 Inter Medium
    - `text/button` 14/20 Inter Semibold
    - Mobile variants: `text/display-mobile` 36/44, `text/h1-mobile` 28/36, `text/h2-mobile` 22/30, `text/h3-mobile` 18/26.
- [ ] **Step 3: Verify** — specimens frame shows every style with a lorem example; all use token-linked families.
- [ ] **Step 4: Version milestone** — "v0.3 — Typography tokens".

### Task 1.3: Spacing, radius, elevation tokens

**Files:**
- Modify: `02 · Design System` → frames `Tokens / Spacing`, `Tokens / Radius`, `Tokens / Elevation`

- [ ] **Step 1: Document spacing scale** (4-base): 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64. Create a visual ruler.
- [ ] **Step 2: Document radius scale**: `radius/sm` 4px, `radius/md` 8px (cards), `radius/lg` 12px (modals), `radius/pill` 999px (chips).
- [ ] **Step 3: Define elevation (Figma effect styles)**:
    - `elevation/1` — `0 1 2 rgba(0,0,0,.06)` subtle card hover
    - `elevation/2` — `0 8 24 rgba(0,0,0,.12)` modals, bottom sheets
- [ ] **Step 4: Verify** — all three token frames rendered with visible examples.
- [ ] **Step 5: Version milestone** — "v0.4 — Spacing / radius / elevation".

---

## Phase 2 — Atomic Components

Each component: build all variants listed in spec §10, with Auto Layout, using tokens only (no raw hex or px spacing).

### Task 2.1: `Button`

**Files:**
- Modify: `02 · Design System` → frame `Components / Button`

- [ ] **Step 1: Define variants** (component properties):
    - `size`: sm / md / lg
    - `variant`: primary / secondary / ghost / danger
    - `state`: default / hover / pressed / disabled / loading
    - `iconLeft`: bool · `iconRight`: bool
- [ ] **Step 2: Build** the component with all combinations via Figma variants. Primary uses `color/accent/default`; ghost uses transparent bg + ink text.
- [ ] **Step 3: Verify** — tab through every variant/state; focus ring visible; touch target ≥ 44×44 at `md`.
- [ ] **Step 4: Version milestone** — "v0.5 — Button".

### Task 2.2: Form primitives — `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`

**Files:**
- Modify: `02 · Design System` → frame `Components / Forms`

- [ ] **Step 1: For each, define** states: default / focus / filled / error / disabled, plus `label`, `helpText`, `errorText` slots.
- [ ] **Step 2: Build** each with Auto Layout so labels sit above inputs (a11y from spec §7a). Error text links visually to the input via the red border.
- [ ] **Step 3: Verify** — all five primitives share the same vertical rhythm and radius; error states use `color/error`.
- [ ] **Step 4: Version milestone** — "v0.6 — Form primitives".

### Task 2.3: `Badge` and `BadgeRow`

**Files:**
- Modify: `02 · Design System` → frame `Components / Badge`

- [ ] **Step 1: Define Badge variants**: `tone` (neutral / positive / warning / info / tier-€ / tier-€€ / tier-€€€), `size` (sm / md), `icon` (bool).
- [ ] **Step 2: Build Badge**. Tier badges show 1–3 Euro glyphs.
- [ ] **Step 3: Build BadgeRow** as an Auto-Layout wrap container with a `maxVisible` prop implemented by hiding overflow instances.
- [ ] **Step 4: Verify** — preview row with 8 badges (matches venue filter set §4b).
- [ ] **Step 5: Version milestone** — "v0.7 — Badges".

### Task 2.4: `FilterPill`

**Files:**
- Modify: `02 · Design System` → frame `Components / FilterPill`

- [ ] **Step 1: Variants**: `state` (default / active / with-count), `size` (sm / md).
- [ ] **Step 2: Build** — pill radius, icon-left for "More" variant, trailing numeric count for with-count variant.
- [ ] **Step 3: Verify** — in a test frame at mobile width 390, chips are ≥ 44 tall (spec §7a) and scroll horizontally rather than shrinking.
- [ ] **Step 4: Version milestone** — "v0.8 — FilterPill".

### Task 2.5: `StarRating`

**Files:**
- Modify: `02 · Design System` → frame `Components / StarRating`

- [ ] **Step 1: Variants**: `mode` (read / write), `value` (0 / 0.5 / 1 / … / 5), `size` (sm / md / lg).
- [ ] **Step 2: Build** with 5 star slots. Write mode shows hover-preview state.
- [ ] **Step 3: A11y annotation**: place a Figma sticky note on the component describing dev requirements — "Render as `<fieldset role='radiogroup' aria-label='Rating'>` with 5 `<input type='radio'>` — keyboard Left/Right changes value, screen-reader announces 'N out of 5'".
- [ ] **Step 4: Verify** — SR label annotation present.
- [ ] **Step 5: Version milestone** — "v0.9 — StarRating".

### Task 2.6: `Toast`, `InquiryStatusChip`

**Files:**
- Modify: `02 · Design System` → frames `Components / Toast`, `Components / StatusChip`

- [ ] **Step 1: Toast variants**: `tone` (success / warning / error / info), with icon + message + optional action.
- [ ] **Step 2: InquiryStatusChip variants**: `status` (pending / accepted / declined / expired). Color mapping: pending=neutral, accepted=success, declined=error, expired=muted.
- [ ] **Step 3: Verify** — colors pulled from tokens only.
- [ ] **Step 4: Version milestone** — "v0.10 — Toast + StatusChip".

---

## Phase 3 — Composite Components

### Task 3.1: `SearchBar`

**Files:**
- Modify: `02 · Design System` → frame `Components / SearchBar`

- [ ] **Step 1: Variants**: `context` (hero / inline), `platform` (desktop / mobile), `state` (default / expanded).
- [ ] **Step 2: Build** — three-segment control (City · Dates · Guests). Expanded state shows the picker panel for the active segment.
- [ ] **Step 3: Verify** — desktop hero width = 720, mobile width = 358.
- [ ] **Step 4: Version milestone** — "v0.11 — SearchBar".

### Task 3.2: `DatePicker` (single-day / two-day)

**Files:**
- Modify: `02 · Design System` → frames `Components / DatePicker`, `Components / DayLabelingToggle`

- [ ] **Step 1: Variants**: `mode` (single / two-day), `two-day-labeling` (neutral / men-women), month view with prev/next, selected date highlight in accent.
- [ ] **Step 2: Build DatePicker** — two-day variant shows two calendar columns on desktop, stacked on mobile. Include availability dot legend: `available` (green), `held` (amber), `booked` (red), applied to date cells.
- [ ] **Step 3: Build `DayLabelingToggle`** as a standalone segmented-control component (variants: `neutral` / `men-women`) used by DatePicker, InquiryCard (3.9), InquiryModal (4.8a), and MyInquiries (5.2). Neutral = "Day 1 / Day 2"; Men-women = "Men's day / Women's day".
- [ ] **Step 4: Verify** — when labeled men-women, column headers swap accordingly.
- [ ] **Step 5: A11y sticky note** — "Render date grid as `<table role='grid'>` with each cell as `role='gridcell' aria-selected`; prev/next month buttons carry SR labels. DayLabelingToggle = `role='radiogroup'`."
- [ ] **Step 6: Version milestone** — "v0.12 — DatePicker + DayLabelingToggle".

### Task 3.3: `GuestCounter`

**Files:**
- Modify: `02 · Design System` → frame `Components / GuestCounter`

- [ ] **Step 1: Variants**: single (one count) / paired (guests for day-1 + day-2), default/hover/disabled buttons.
- [ ] **Step 2: Build** — decrement / count / increment with caption "guests".
- [ ] **Step 3: A11y sticky note** — "Use `role='spinbutton' aria-valuemin/max/now`; increment/decrement buttons carry SR labels 'Increase guests' / 'Decrease guests'."
- [ ] **Step 4: Verify** — buttons ≥ 44×44; numeric value up to 9999.
- [ ] **Step 5: Version milestone** — "v0.13 — GuestCounter".

### Task 3.4: `MapPin`

**Files:**
- Modify: `02 · Design System` → frame `Components / MapPin`

- [ ] **Step 1: Variants**: `type` (single / cluster), `state` (default / hover / active / saved). Cluster shows count.
- [ ] **Step 2: Build** — uses `color/map/*` tokens, accent-default bubble with price tier label inside for single pins.
- [ ] **Step 3: A11y sticky note** — "Map is non-essential: announce via `aria-label='Map showing N venues, list available on the left'`. Each pin has a matching keyboard-focusable list item; pin click ↔ list hover are linked."
- [ ] **Step 4: Verify** — hover state lifts with `elevation/1`.
- [ ] **Step 5: Version milestone** — "v0.14 — MapPin".

### Task 3.5: `PhotoGallery`

**Files:**
- Modify: `02 · Design System` → frame `Components / PhotoGallery`

- [ ] **Step 1: Variants**: `layout` (mosaic / grid / carousel), `platform` (desktop / mobile).
- [ ] **Step 2: Build** — mosaic = 1 hero + 4 thumbs with "Show all photos" button; grid = 3-col desktop, 2-col mobile; carousel = mobile swipe with dots.
- [ ] **Step 3: Verify** — alt-text placeholder is visible on hover for reviewer note.
- [ ] **Step 4: Version milestone** — "v0.15 — PhotoGallery".

### Task 3.6: `ListingCard`

**Files:**
- Modify: `02 · Design System` → frame `Components / ListingCard`

- [ ] **Step 1: Variants**:
    - `kind`: venue / traiteur / vendor-lighter
    - `size`: sm (list item 160h) / md (card 280h) / lg (featured 360h)
    - `state`: default / saved / hover
    - `platform`: desktop / mobile
- [ ] **Step 2: Build** — card has photo, title, neighborhood, 3 key badges + price tier badge, rating (stars + count), save-heart icon top-right.
- [ ] **Step 3: Verify** — all three `kind` variants render from the same base with correct badge row differences.
- [ ] **Step 4: Version milestone** — "v0.16 — ListingCard".

### Task 3.7: `FilterDrawer` + `FilterDrawerRow`

**Files:**
- Modify: `02 · Design System` → frame `Components / FilterDrawer`

- [ ] **Step 1: Variants**: `platform` (desktop-side / mobile-full), `state` (closed / open).
- [ ] **Step 2: Build** — filter rows for every filter in spec §4b drawer. Include the weekday/weekend noise-curfew toggle.
- [ ] **Step 3: Verify** — row heights ≥ 48 for tap; sticky apply/reset footer.
- [ ] **Step 4: Version milestone** — "v0.17 — FilterDrawer".

### Task 3.8: `ReviewCard` + `ReviewForm`

**Files:**
- Modify: `02 · Design System` → frames `Components / ReviewCard`, `Components / ReviewForm`

- [ ] **Step 1: ReviewCard variants**: with-photos / text-only, with-flag-count ≥ 3 (shows `hidden` state).
- [ ] **Step 2: ReviewForm**: stars + text (10–2000 char counter) + photo-uploader (max 5 thumbs + add-button) + visit-month picker (YYYY-MM).
- [ ] **Step 3: A11y annotations**: required fields show `*` plus Figma sticky note "SR label must include 'required'"; inline error text is linked via `aria-describedby`; photo gallery opened from ReviewCard supports ESC-to-close + arrow-key navigation (note on PhotoGallery component).
- [ ] **Step 4: Verify** — both pull StarRating component; ReviewForm shows inline validation text using token color `color/error`.
- [ ] **Step 5: Version milestone** — "v0.18 — Review components".

### Task 3.9: `InquiryCard`

**Files:**
- Modify: `02 · Design System` → frame `Components / InquiryCard`

- [ ] **Step 1: Variants**: `placement` (sidebar-desktop / sticky-bottom-mobile).
- [ ] **Step 2: Build** — slot for DatePicker entry + GuestCounter + CTA "Request dates" + price-tier caption. Sticky-bottom mobile variant is 72h with collapsed summary that expands to a bottom-sheet.
- [ ] **Step 3: Verify** — sidebar version width 360; sticky mobile full-width.
- [ ] **Step 4: Version milestone** — "v0.19 — InquiryCard".

### Task 3.10a: `AuthModal`

**Files:**
- Modify: `02 · Design System` → frame `Components / Auth`

- [ ] **Step 1: Variants**: `mode` (sign-up / log-in / forgot-password). Buttons: "Continue with Google", divider, email + password.
- [ ] **Step 2: Build** with clear error slots and "Forgot password?" link.
- [ ] **Step 3: Version milestone** — "v0.20a — AuthModal".

### Task 3.10b: `LanguageSwitcher`

**Files:**
- Modify: `02 · Design System` → frame `Components / Language`

- [ ] **Step 1: Variants**: `placement` (footer / settings / first-login). Options FR / NL.
- [ ] **Step 2: Build** — footer variant is a compact text-link pair; settings is a radio group; first-login is a two-card selector.
- [ ] **Step 3: Version milestone** — "v0.20b — LanguageSwitcher".

### Task 3.10c: `AppBar` + `BottomNav`

**Files:**
- Modify: `02 · Design System` → frame `Components / Navigation`

- [ ] **Step 1: AppBar (desktop)**: logo + search-compact + nav (Venues / Vendors / Saved / Inquiries) + auth-button-or-avatar. Variants: `auth` (signed-out / signed-in).
- [ ] **Step 2: BottomNav (mobile)**: 4 tabs (Search / Saved / Inquiries / Profile). State variants: default / active per tab.
- [ ] **Step 3: Version milestone** — "v0.20c — Navigation".

### Task 3.10d: `EmptyState`

**Files:**
- Modify: `02 · Design System` → frame `Components / Empty`

- [ ] **Step 1: Variants**: no-results / nothing-saved / no-inquiries / no-reviews, each with a minimal line-illustration placeholder + copy slot + CTA button.
- [ ] **Step 2: Version milestone** — "v0.20d — EmptyState".

---

## Phase 4 — Desktop Public Screens

Each screen: build desktop first (1440 frame, content max 1280), at the end of phase 6 repeat for mobile (390).

### Task 4.1: `Home – Desktop`

**Files:**
- Modify: `04 · Desktop — Public` → frame `Home – Desktop`

- [ ] **Step 1: Lay out hero** — full-width photo (placeholder), centered SearchBar-hero, filter chip row ("Halal traiteur allowed", "300+ guests", "Parking", "Prayer area").
- [ ] **Step 2: Editorial rows** — 4 carousels: Popular in Brussels, New in Antwerp, Traiteurs halal, Featured photographers. Each = 4 ListingCards at `md`.
- [ ] **Step 3: Value-prop strip** (3 columns with icons).
- [ ] **Step 4: Footer** — LanguageSwitcher + links.
- [ ] **Step 5: Verify** — all components are instances; no raw text/hex.
- [ ] **Step 6: Version milestone** — "v1.0 — Home desktop".

### Task 4.2: `SearchResults-Venues – Desktop`

**Files:**
- Modify: `04 · Desktop — Public` → frame `SearchResults-Venues – Desktop`

- [ ] **Step 0: Prep Mapbox placeholder** — grab a static tile PNG of Brussels from Mapbox (or annotate a grey rectangle with a "map placeholder" note). Import into the frame as a background image for the map area.
- [ ] **Step 1: Top bar** — compact SearchBar + sticky FilterPill row (§4b chips) + "More filters" button that opens FilterDrawer.
- [ ] **Step 2: Layout** — left 640px scrollable list of ListingCards `sm`, right Mapbox placeholder with MapPins. Sync: hovering a card highlights its pin (annotation).
- [ ] **Step 3: Sort selector** top-right of list.
- [ ] **Step 4: Verify** — 8 venue cards placed; 8 matching pins positioned; weekday-noise filter visible in chip row.
- [ ] **Step 5: Version milestone** — "v1.1 — Venue results desktop".

### Task 4.3: `SearchResults-Vendors – Desktop`

**Files:**
- Modify: `04 · Desktop — Public` → frame `SearchResults-Vendors – Desktop`

- [ ] **Step 1: Category tabs** at top: Traiteur / Ziana / Tayyaba / Hennaya / Nasheed / Photographer / Négafa / Videographer.
- [ ] **Step 2: Lighter filters** — city · female-staff-available · rating sort.
- [ ] **Step 3: Card grid** — 3 columns of ListingCard `kind=vendor-lighter`.
- [ ] **Step 4: Verify** — no map in this variant; traiteur tab active shows traiteur-specific ListingCard.
- [ ] **Step 5: Version milestone** — "v1.2 — Vendor results desktop".

### Task 4.4: `VenueDetail – Desktop`

**Files:**
- Modify: `04 · Desktop — Public` → frame `VenueDetail – Desktop`

- [ ] **Step 1: Photo mosaic** (PhotoGallery layout=mosaic) across full content width.
- [ ] **Step 2: Two-column layout below**:
    - Left: title, neighborhood, rating, BadgeRow, full description, location mini-map, availability calendar (DatePicker read-mode), reviews section (ReviewCard list + "See all" + Write-review CTA), similar venues strip, footer link "Is this your venue? Claim it."
    - Right sticky: InquiryCard (sidebar variant) with DatePicker two-day-capable + GuestCounter + CTA "Request dates".
- [ ] **Step 3: BadgeRow — exhaustive checklist against spec §6 `Venue` fields**. Confirm a badge/facts-row entry for each:
    - `price_tier` (€/€€/€€€)
    - `price_range_min`–`max` (if claimed)
    - `capacity_min`–`max`
    - `alcohol_policy` (allowed/forbidden/byo)
    - `gender_separation` (mixed/separable/strict)
    - `prayer_area` (bool → shown if true)
    - `wudu_facilities` (bool → shown if true)
    - `parking_spaces` (integer shown, "unknown" if null)
    - `noise_curfew_weekday` + `noise_curfew_weekend` (both shown as "M–Th: 2am · F–Sun: 4am")
    - `stage_available` (bool → shown if true)
    - `traiteur_policy` (in-house / imposed list / free choice)
    - `halal_only_traiteur` (bool → shown if true)
    - `female_staff_available` (bool → shown if true)
- [ ] **Step 4: Verify** — every item above is visually represented.
- [ ] **Step 5: Version milestone** — "v1.3 — VenueDetail desktop".

### Task 4.5: `TraiteurDetail – Desktop`

**Files:**
- Modify: `04 · Desktop — Public` → frame `TraiteurDetail – Desktop`

- [ ] **Step 1: Same skeleton as venue detail** but badge row swapped: cuisine tags / halal-certified / price-per-guest range / delivery radius.
- [ ] **Step 2: InquiryCard sidebar** — single-date only (no two-day toggle). Call-out note: "Need coverage for two days? Submit a request per day."
- [ ] **Step 3: Verify** — no two-day control anywhere on this screen.
- [ ] **Step 4: Version milestone** — "v1.4 — TraiteurDetail desktop".

### Task 4.6: `VendorDetail – Desktop` (shared lighter template)

**Files:**
- Modify: `04 · Desktop — Public` → frame `VendorDetail – Desktop`

- [ ] **Step 1: Layout** — portfolio PhotoGallery `grid` 3-col, title / category badge / city / rating, description, reviews, single CTA "Contact on WhatsApp" (with Email fallback link).
- [ ] **Step 2: Component-property** for `category` (ziana / tayyaba / hennaya / nasheed / photographer / négafa / videographer) to swap badge text.
- [ ] **Step 3: Verify** — no calendar, no structured inquiry; CTA deep-links `wa.me/...` in annotation.
- [ ] **Step 4: Version milestone** — "v1.5 — VendorDetail desktop".

### Task 4.7: `ReviewWrite – Desktop` (modal overlay)

**Files:**
- Modify: `04 · Desktop — Public` → frame `ReviewWrite – Desktop`

- [ ] **Step 1: Modal** 560 wide, centered, with ReviewForm inside. Dim background.
- [ ] **Step 2: Character counter** and disabled submit until stars > 0 and text ≥ 10 chars.
- [ ] **Step 3: Disclosure** beneath: "Reviews are published immediately. Flagged reviews are checked within 48h."
- [ ] **Step 4: Version milestone** — "v1.6 — ReviewWrite desktop".

### Task 4.8: `Auth – Desktop` + `FirstLogin – Desktop`

**Files:**
- Modify: `04 · Desktop — Public` → frames `SignUp – Desktop`, `LogIn – Desktop`, `ForgotPassword – Desktop`, `PasswordReset-Complete – Desktop`, `FirstLogin – Desktop`

- [ ] **Step 1: Build SignUp / LogIn** as split-screen 50/50: hero photo left, AuthModal right.
- [ ] **Step 2: Build ForgotPassword** — email input, "Send reset link" CTA, success state.
- [ ] **Step 3: Build PasswordReset-Complete** — "You're in" screen with CTA back to home.
- [ ] **Step 4: Build FirstLogin** — after-signup onboarding: LanguageSwitcher (first-login variant), full-name input, optional phone input, "Continue" CTA. Redirects back to the triggering screen. **A11y sticky note** — "On mount, dispatch `POST /shortlist/merge` with any `localStorage.shortlist_pending` entries, then clear localStorage (spec §6 `Shortlist`)."
- [ ] **Step 5: Version milestone** — "v1.7 — Auth desktop".

### Task 4.8a: `InquiryModal-Dates` + `InquiryModal-Message` (desktop)

**Files:**
- Modify: `04 · Desktop — Public` → frames `InquiryModal-Dates – Desktop`, `InquiryModal-Message – Desktop`, `InquiryModal-DateConflict – Desktop`

- [ ] **Step 1: InquiryModal-Dates** — 560-wide modal: segmented control "One day" / "Two days", DayLabelingToggle (only when Two days is active), DatePicker (single or two-day mode), per-day GuestCounter.
- [ ] **Step 2: InquiryModal-Message** — auth-gated (shows AuthModal overlay first for unauth users), name, phone, note textarea (0–1000), Submit + Back.
- [ ] **Step 3: InquiryModal-DateConflict** — warning banner "This date shows as held — send request anyway?" (matches spec §7 flow B step 6). Primary: Send anyway. Secondary: Change dates.
- [ ] **Step 4: Version milestone** — "v1.8 — Inquiry modal desktop".

---

## Phase 5 — Desktop Authed & Utility Screens

### Task 5.1: `Shortlist – Desktop` + `Compare – Desktop`

**Files:**
- Modify: `05 · Desktop — Authed` → frames `Shortlist – Desktop`, `Compare – Desktop`

- [ ] **Step 1: Shortlist** — grid of saved ListingCards `md` with multi-select checkboxes in corner; top bar with "Compare selected (N)" button enabled when 2–3 selected.
- [ ] **Step 2: Compare** — up to 3 columns side-by-side: photo + title + badges + price + rating + address, each fact aligned row-wise with labels on the far-left rail.
- [ ] **Step 3: Verify** — 3-column fits at 1280 content width.
- [ ] **Step 4: Version milestone** — "v2.0 — Shortlist + Compare".

### Task 5.2: `MyInquiries – Desktop` + `InquiryDetail – Desktop`

**Files:**
- Modify: `05 · Desktop — Authed` → frames `MyInquiries – Desktop`, `InquiryDetail – Desktop`

- [ ] **Step 1: MyInquiries** — table-ish list: venue/traiteur name · date(s) · guests · InquiryStatusChip · actions (view / cancel if pending).
- [ ] **Step 2: InquiryDetail** — left: request summary with dates/guests/message; right: response thread (venue reply shown once arrived) + status history.
- [ ] **Step 3: Verify** — two-day inquiries display both dates clearly with labels.
- [ ] **Step 4: Version milestone** — "v2.1 — Inquiries".

### Task 5.3: `MyReviews – Desktop` + `AccountSettings – Desktop` + `ClaimListing – Desktop`

**Files:**
- Modify: `05 · Desktop — Authed` → frames `MyReviews – Desktop`, `AccountSettings – Desktop`, `ClaimListing – Desktop`

- [ ] **Step 1: MyReviews** — list of ReviewCards with edit / delete.
- [ ] **Step 2: AccountSettings** — tabs: Profile / Language / Password / Notifications.
- [ ] **Step 3: ClaimListing** — form: proof text + file uploads, submit.
- [ ] **Step 4: Version milestone** — "v2.2 — Account + Claim".

### Task 5.4: Transactional & utility screens — Desktop

**Files:**
- Modify: `05 · Desktop — Authed` and `09 · Empty / Loading / Error States`

- [ ] **Step 1: Build** in order:
    - `InquirySent – Desktop` (confirmation screen with CTA "See in My Inquiries")
    - `ReviewFlagged – Desktop` (toast + modal explaining flag received)
    - `ClaimSubmitted – Desktop` (confirmation with "We'll respond within 5 business days")
    - `404 – Desktop`
    - `GenericError – Desktop`
- [ ] **Step 2: Verify** — each reuses components; copy is in FR placeholder with NL variant swap annotated.
- [ ] **Step 3: Version milestone** — "v2.3 — Utility desktop".

---

## Phase 6 — Mobile Variants of All Screens

### Task 6.1a: Home + Search — Mobile

**Files:**
- Modify: `06 · Mobile — Public` → frames `Home – Mobile`, `SearchResults-Venues – Mobile`, `SearchResults-Venues-Map – Mobile`, `SearchResults-Vendors – Mobile`

- [ ] **Step 1: Home – Mobile** — hero stacked, SearchBar full width, horizontal-scroll editorial rows.
- [ ] **Step 2: SearchResults-Venues – Mobile** — full-screen list with floating "Map" button.
- [ ] **Step 3: SearchResults-Venues-Map – Mobile** — full-screen map with bottom-sheet card on pin tap.
- [ ] **Step 4: SearchResults-Vendors – Mobile** — category pills top, 1-col card list.
- [ ] **Step 5: Version milestone** — "v3.0 — Mobile home + search".

### Task 6.1b: Detail pages — Mobile

**Files:**
- Modify: `06 · Mobile — Public` → frames `VenueDetail – Mobile`, `TraiteurDetail – Mobile`, `VendorDetail – Mobile`, `ReviewWrite – Mobile`

- [ ] **Step 1: VenueDetail – Mobile** — photo hero, stacked sections, sticky bottom "Request dates" button.
- [ ] **Step 2: TraiteurDetail – Mobile** — same skeleton minus two-day.
- [ ] **Step 3: VendorDetail – Mobile** — 2-col portfolio grid, WhatsApp CTA fixed at bottom.
- [ ] **Step 4: ReviewWrite – Mobile** — full-screen (not modal).
- [ ] **Step 5: Version milestone** — "v3.1 — Mobile details".

### Task 6.1c: Inquiry modal + Auth + First-login — Mobile

**Files:**
- Modify: `06 · Mobile — Public` → frames `InquiryModal-Dates – Mobile`, `InquiryModal-Message – Mobile`, `InquiryModal-DateConflict – Mobile`, `SignUp – Mobile`, `LogIn – Mobile`, `ForgotPassword – Mobile`, `PasswordReset-Complete – Mobile`, `FirstLogin – Mobile`

- [ ] **Step 1: Build all inquiry modal steps** as full-screen takeovers on mobile (not centered modals).
- [ ] **Step 2: Build auth screens** — full-screen.
- [ ] **Step 3: Build FirstLogin – Mobile** — stacked onboarding.
- [ ] **Step 4: Version milestone** — "v3.2 — Mobile inquiry + auth".

### Task 6.2a: Authed screens — Mobile

**Files:**
- Modify: `07 · Mobile — Authed` → frames `Shortlist – Mobile`, `ShortlistCompare – Mobile`, `MyInquiries – Mobile`, `InquiryDetail – Mobile`, `MyReviews – Mobile`, `AccountSettings – Mobile`, `ClaimListing – Mobile`

- [ ] **Step 1: Shortlist – Mobile** — single-col grid.
- [ ] **Step 2: ShortlistCompare – Mobile** — swipeable cards (no side-by-side on mobile).
- [ ] **Step 3: MyInquiries – Mobile** — row list with StatusChip.
- [ ] **Step 4: InquiryDetail – Mobile**.
- [ ] **Step 5: MyReviews + AccountSettings + ClaimListing – Mobile**.
- [ ] **Step 6: Version milestone** — "v3.3 — Mobile authed".

### Task 6.2b: Utility screens — Mobile

**Files:**
- Modify: `07 · Mobile — Authed` → frames `InquirySent – Mobile`, `ReviewFlagged – Mobile`, `ClaimSubmitted – Mobile`, `404 – Mobile`, `GenericError – Mobile`

- [ ] **Step 1: Build all 5** as mobile-sized confirmation / error screens.
- [ ] **Step 2: Verify** — bottom-nav present on authed screens; touch targets ≥ 44.
- [ ] **Step 3: Version milestone** — "v3.4 — Mobile utility".

---

## Phase 7 — Empty / Loading / Error Catalog

### Task 7.1: Build variants listed in spec §4a

**Files:**
- Modify: `09 · Empty / Loading / Error States`

- [ ] **Step 1: For each row in §4a**, create a desktop + mobile artboard pair showing the empty / loading / error variant.
    - Include: Venue results, Vendor results, Venue detail, Availability calendar, Reviews block, My shortlist, My inquiries, My reviews, Inquiry detail, Home editorial rows, Write-review (submit-pending), Claim-listing (submit-pending), Account settings.
- [ ] **Step 2: Map-load fallback** — venue search results with map area replaced by "Map unavailable — showing list only" banner.
- [ ] **Step 3: Verify** — every row in §4a table has corresponding artboards.
- [ ] **Step 4: Version milestone** — "v4.0 — Empty/Loading/Error catalog".

---

## Phase 8 — Admin Wireframes

Low-fidelity (greyscale, no photos). Spec §4 admin section.

### Task 8.1: Admin wireframes

**Files:**
- Modify: `08 · Admin (wireframes)`

- [ ] **Step 1: ListingsModeration** — table: listing name / type / status / actions (approve / reject / edit).
- [ ] **Step 2: ClaimRequestsQueue** — table: claimant / subject / submitted-at / proof-files / decision buttons.
- [ ] **Step 3: ReviewsModeration** — flagged reviews queue: review text / flag count / venue / decision buttons.
- [ ] **Step 4: Verify** — all three screens are greyscale, no polished visuals.
- [ ] **Step 5: Version milestone** — "v4.1 — Admin wireframes".

---

## Phase 9 — Flow Diagrams

### Task 9.1: Build flow diagrams on `03 · Flows`

**Files:**
- Modify: `03 · Flows`

- [ ] **Step 1: Using MCP `generate_diagram`** or manual linking, build one diagram per spec §7 flow:
    - A — Discovery → Shortlist
    - B — Inquiry with two-day pattern
    - C — Write review
    - D — Contact lighter vendor
    - E — Claim listing
    - F — Auth
- [ ] **Step 2: Include failure branches** from the spec (empty state, map fail, date conflict, auth redirect).
- [ ] **Step 3: Verify** — each flow references actual artboard names on Desktop pages.
- [ ] **Step 4: Version milestone** — "v5.0 — Flow diagrams".

---

## Phase 10 — Prototype Wiring

### Task 10.1: Wire up prototype links for happy paths

**Files:**
- Modify: all Desktop + Mobile screens (prototype mode)

- [ ] **Step 1: Home → Search** on SearchBar submit → `SearchResults-Venues`.
- [ ] **Step 2: Search card → VenueDetail**; VenueDetail inquiry CTA → `InquiryModal-Dates` → `InquiryModal-Message` (auth-gated, diverts to `SignUp` then `FirstLogin` then back for new users) → `InquirySent`. Include the `InquiryModal-DateConflict` branch off Dates step.
- [ ] **Step 3: VenueDetail "Write a review"** → AuthModal (if not logged in) → `ReviewWrite`.
- [ ] **Step 4: VendorDetail "Contact on WhatsApp"** → external link placeholder.
- [ ] **Step 5: Auth flow** Sign-up / Log-in / Forgot → completion.
- [ ] **Step 6: Claim link** on VenueDetail footer → `ClaimListing` → `ClaimSubmitted`.
- [ ] **Step 7: Bottom-nav (mobile) / AppBar (desktop)** linked to Shortlist, Inquiries, Profile.
- [ ] **Step 8: Verify** — a stakeholder can walk spec §7 flow A, B, C, D, E, F end-to-end by clicking the prototype.
- [ ] **Step 9: Version milestone** — "v6.0 — Prototype wired".

---

## Phase 11 — Polish, Audit, Handoff

### Task 11.1: Token + a11y audit

**Files:**
- Modify: all pages (audit, not creation)

- [ ] **Step 1: Run Stark plugin** (or manual) on every frame. Fail condition: any text < 4.5:1 contrast, any UI control < 3:1.
- [ ] **Step 2: Inspect every color** used in every frame — flag any raw hex (should be 0; all come from tokens).
- [ ] **Step 3: Check every interactive** for a defined focus state.
- [ ] **Step 4: Log issues** on a `Audit Findings` frame in `01 · Cover` page, fix in place, then re-check.
- [ ] **Step 5: Version milestone** — "v7.0 — A11y + token audit passed".

### Task 11.2: Hero exports and final cover

**Files:**
- Modify: `01 · Cover`

- [ ] **Step 1: Export** 1440×900 PNG of each of: `Home – Desktop`, `SearchResults-Venues – Desktop`, `VenueDetail – Desktop`, `VenueDetail – Mobile`, `Shortlist – Desktop`.
- [ ] **Step 2: Place exports** on the Cover page as a hero strip.
- [ ] **Step 3: Update status block** to "Ready for dev handoff".
- [ ] **Step 4: Version milestone** — "v1.0 MVP COMPLETE".

### Task 11.3: Dev handoff notes

**Files:**
- Create: `docs/superpowers/handoff/figma-mvp-handoff.md` in repo

- [ ] **Step 1: Write** a short handoff doc:
    - Figma file URL
    - How to open Dev Mode
    - Design tokens reference
    - Component library overview
    - **Prototype walkthrough URLs per spec §7 flow** (A discovery, B inquiry two-day, C review, D vendor contact, E claim, F auth) — links to the starting frame of each.
    - Known deferred items (Mapbox provider, Arabic, payments)
    - Known open questions (from spec §12) that need resolution before code.
- [ ] **Step 2: Commit** this doc.
- [ ] **Step 3: Version milestone** (Figma + git) — "Handoff ready".

---

## Execution Notes

- Re-read spec §4b filter catalog before Tasks 3.7 and 4.2; it's easy to miss filters.
- Re-read spec §2 "two-day pattern" before Tasks 3.2, 3.9, and 4.4 — this is the product's most differentiating UX.
- MCP `get_design_context` on the Airbnb Community UI Kit link can serve as a reference for button/card proportions — but do not copy styles verbatim; map to our tokens.
- Commit this plan (with checkboxes ticked) to git after every phase completion.
- If Figma components get messy, create new iterations on page `10 · Archive` rather than destroying existing work.
