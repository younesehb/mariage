# Wedding Planner for the Moroccan Diaspora — MVP Design Spec

**Date:** 2026-04-22
**Status:** Draft (awaiting review)
**Scope:** Figma MVP (user-facing + minimal admin wireframes). Implementation plan follows this spec.

## 1. Overview

A bilingual (FR + NL) web application that helps the Moroccan diaspora in Belgium plan Muslim weddings end-to-end. MVP positions **venue discovery** as the hero experience (map, filters, detail, reviews, inquiry-with-availability) with a lighter **vendor directory** (traiteur, ziana, tayyaba, hennaya, nasheed groups, photographer, négafa, videographer) as a secondary browse surface. No online payments. France is a post-MVP expansion.

**Primary value proposition:** "Find, compare, and contact the right wedding venue and vendors for a Muslim wedding in Belgium — in one place, in your language, with filters that actually matter to you."

## 2. Users & Context

- **Audience**: Muslim community in Belgium (primarily Brussels, Antwerp, Liège, Ghent, Charleroi), organizing a wedding. No forced persona — any organizer (bride, groom, family member) uses the same user-facing product.
- **Cultural facts baked into the design**:
  - Muslim-only audience → halal is default context; alcohol policy surfaced as info rather than a promoting feature.
  - **Two-day event pattern**: weddings are often split across two events (men's day + women's day), on the same date or different dates. This is a first-class constraint for date pickers, availability, and inquiry flows.
  - Hotels are not a typical customer need — excluded from venue filters.

## 3. Scope & Constraints

### In scope (MVP)
- Venue discovery (hero): map + list, filters, detail page, reviews, inquiry-with-availability.
- Vendor directory (secondary): 8 categories. Traiteurs have **full parity** with venues (structured detail + availability + inquiry). The other 7 categories use a **lighter template** (photos + reviews + contact-on-WhatsApp button; no availability, no structured inquiry).
- Reviews: registered-users-only, stars + text + photo uploads, auto-publish + flag-for-moderation.
- Shortlist + compare (desktop: up to 3 side-by-side; mobile: swipeable).
- Auth: email/password + Google via **BetterAuth**.
- Supply: admin-seeded listings + "Claim this listing" form on every detail page (no self-serve vendor portal in MVP).
- Languages: French + Dutch (all UI strings translatable; long-form fields stored per-language on the entity).
- Geography: all Belgium (5 seed cities above). France later.
- Platform: responsive web, both desktop and mobile treated as first-class Figma artboards.

### Out of scope (MVP)
- Online payments / deposits / contracts.
- Self-serve vendor portal (onboarding, dashboard, availability management by venue owners).
- Full admin panel (beyond wireframes for listings + review moderation).
- Arabic / RTL support.
- Push notifications, SMS, in-app messaging threads with lighter vendors.
- Planning tools (checklist, budget, guest list) — explicitly deferred.

## 4. Information Architecture

### Public
- Landing / home (hero search, editorial rows)
- Venue search results (map + list)
- Vendor search results (category grid)
- Venue detail
- Traiteur detail (full parity)
- Vendor detail (shared lighter template for 7 categories)
- Reviews read + write
- Auth: sign up, log in, forgot password

### Authenticated user
- My shortlist (+ compare on desktop)
- My inquiries (list + status)
- Inquiry detail (thread + venue response)
- My reviews
- Account settings (profile, language, notifications)
- Claim-listing form

### Admin (wireframe-only in Figma)
- Listings moderation queue
- Claim-request moderation queue
- Review moderation queue (flagged reviews)

### Transactional / utility
- Inquiry-sent confirmation
- Review-flagged confirmation
- Claim-submitted confirmation
- Password-reset (request + completion)
- 404 / not-found
- Generic error (500-class)

**Total**: ~24 core screens × (mobile + desktop) = ~48 artboards. Once empty / loading / error variants and modal variants are added (section 4a), expect ~70+ artboards in the final Figma file.

### 4a. Empty / loading / error catalog
Every screen that fetches or renders a list has at least an empty + loading variant. Errors are covered by a shared generic-error pattern plus one map-load fallback.

| Screen | Empty | Loading | Error |
| --- | --- | --- | --- |
| Venue search results | "No venues match your filters" + clear-filters | skeleton cards + skeleton map | map fails → list-only fallback |
| Vendor search results | "No vendors match" | skeleton card grid | generic-error toast |
| Venue detail | n/a | full-page skeleton | generic-error page |
| Availability calendar | "No dates set" (claimed venues only) | skeleton grid | generic-error toast |
| Reviews block | "Be the first to review" | skeleton list | generic-error toast |
| My shortlist | "Nothing saved yet" + CTA to browse | skeleton grid | generic-error toast |
| My inquiries | "No inquiries yet" + CTA | skeleton rows | generic-error toast |
| My reviews | "No reviews written" | skeleton rows | generic-error toast |
| Inquiry detail | n/a | skeleton thread | generic-error page |
| Home editorial rows | "Check back soon" | skeleton carousel | generic-error toast |
| Write-review flow | n/a | submit-pending spinner | inline validation + toast on submit-fail |
| Claim-listing form | n/a | submit-pending spinner | inline validation + toast on submit-fail |
| Account settings | n/a | skeleton form | generic-error toast |

### 4b. Canonical filter catalog (venues)

**Chips (sticky pill row, always visible)**: date · guests · city · price tier · halal traiteur (toggle).

**Drawer ("More filters")**:
- Capacity (range slider 50–1500)
- Alcohol policy (any / forbidden / allowed / BYO)
- Gender separation (any / mixed / separable / strict)
- Prayer area (any / yes)
- Wudu facilities (any / yes)
- Parking (any / yes, min N spaces) — venues with `parking_spaces = null` are excluded from "min N" results (treated as unknown)
- Noise curfew (any / ≥ 2am / ≥ 4am / no limit) — weekday / weekend toggle
- Stage available (any / yes)
- Traiteur policy (any / in-house / imposed list / free choice)
- Female-staff-available (any / yes) — inherited by relevant vendors
- Sort (relevance / distance / rating / price asc / price desc)

**Vendor filters** are lighter: category · city · female-staff-available · rating sort.

## 5. Key Screens

### Home / landing
Full-width hero photo. Centered search bar (`city · date · guests`). Filter chips below: "Halal traiteur allowed", "300+ guests", "Parking", "Prayer area". Editorial carousels: *Popular in Brussels · New in Antwerp · Traiteurs halal · Featured photographers*. FR/NL switcher in footer.

### Venue search results
- **Desktop**: left scrollable card list, right Mapbox map with synced pins. Sticky filter pill row on top; "More" opens a right-side filter drawer.
- **Mobile**: list by default, floating "Map" button toggles full-screen map with bottom-sheet card on pin tap.

### Venue detail
Photo gallery mosaic (hero + 4 thumbs + "Show all"). Sticky right rail inquiry card (date picker with **single-day / two-day** toggle, guest count, "Send request"). Full description, badge row (capacity, halal traiteur policy, alcohol policy, gender-separation, prayer area, noise curfew, stage, parking, price tier), mini-map, availability calendar, reviews, similar venues. Mobile: photo hero + sticky bottom "Request dates" button, stacked sections.

### Inquiry flow (2-step modal / full-screen mobile)
1. **Dates**: segmented control "One day" | "Two days". When "Two days" is chosen, a secondary toggle appears: "Label as **Men's / Women's**" (default on) vs "Neutral (Day 1 / Day 2)". Two-day then exposes two independent date + guest fields (dates may be identical or different).
2. **Message** (auth-gated): name, phone, note → confirmation.

Note: traiteur two-day coverage is modeled as **two independent traiteur inquiries**, not one combined inquiry — avoid wiring a merged traiteur+venue two-day flow.

### My shortlist
Card grid of saved items. **Desktop**: multi-select → "Compare" opens up to 3 columns with aligned row-wise facts. **Mobile**: compare = swipeable cards.

### Write review
Photo uploader (up to 5), star rating, free text, visit month picker. Auto-publishes. Register-gated.

### Traiteur detail (near-parity template)
Same skeleton as venue. Swaps venue-specific badges for: cuisine tags, halal certification, price-per-guest range, delivery radius. Same availability calendar + inquiry. **Exception vs venues**: no two-day toggle — traiteur inquiry is a single date + head count. A traiteur can still be inquired for each of the two days separately from the venue flow; that's modeled as two independent inquiries, not a single two-day inquiry.

### Vendor detail (lighter template — 7 categories)
Portfolio photo grid (3 cols desktop / 2 mobile). Name, city served, description, rating, reviews. Primary CTA: "Contact on WhatsApp" (email fallback). No calendar. No structured inquiry.

## 6. Data Model

Entity shapes the UI must render. Not a final DB schema.

### `User`
`id · email · password_hash · auth_provider (email|google) · full_name · phone · preferred_language (fr|nl) · avatar_url · created_at`

### Convention: `subject_type`
All polymorphic entities use the same enum: `subject_type ∈ (venue | vendor)`. Traiteurs are vendors with `category = traiteur`; the UI treats them specially because of their extended fields and availability, but the data model treats them uniformly.

### `Venue`
`id · name · slug · description_fr · description_nl · city · address · lat · lng · photos[] (ordered, each with alt_text_fr/nl) · price_tier (€|€€|€€€) · price_range_min · price_range_max · capacity_min · capacity_max · alcohol_policy (allowed|forbidden|byo) · gender_separation (mixed|separable|strict) · prayer_area (bool) · wudu_facilities (bool) · parking_spaces (int|null) · noise_curfew_weekday (time|"none") · noise_curfew_weekend (time|"none") · stage_available (bool) · traiteur_policy (in_house|imposed_list|free_choice) · halal_only_traiteur (bool) · female_staff_available (bool) · claim_status (unclaimed|pending|claimed) · owner_user_id · status (draft|published|hidden) · created_at`

Price range shown only on claimed listings; tier is always shown. Alcohol policy is kept as a field (not assumed-forbidden) because some halls permit alcohol by external traiteurs — users want to actively see "forbidden" as a positive signal.

### `Vendor`
`id · category (traiteur|ziana|tayyaba|hennaya|nasheed|photographer|negafa|videographer) · name · slug · description_fr · description_nl · service_cities[] · photos[] (ordered, each with alt_text_fr/nl) · contact_whatsapp · contact_email · female_staff_available (bool, relevant for tayyaba/hennaya/photographer/videographer) · claim_status · owner_user_id · status`

Traiteur-only extensions: `cuisine_tags[] · price_per_guest_min · price_per_guest_max · halal_certified (bool) · delivery_radius_km`.

### `Availability` (venues + traiteurs only)
`id · subject_type (venue|vendor) · subject_id · date · status (available|held|booked) · updated_by · updated_at`

### `Inquiry`
`id · user_id · subject_type (venue|vendor) · subject_id · inquiry_type (single_day|two_day) · date_primary · date_secondary (nullable) · guests_primary · guests_secondary (nullable) · day_labeling (neutral|men_women) · message · status (pending|accepted|declined|expired) · venue_response · created_at · responded_at`

Two-day UX labels: the user picks labeling at submission time. `neutral` → "Day 1" / "Day 2" (some couples book one celebration across two days). `men_women` → "Men's day" / "Women's day" and `date_primary` = men's, `date_secondary` = women's. The labeling is purely presentational; the venue responds once for the whole inquiry.

### `Review`
`id · user_id (NOT NULL) · subject_type (venue|vendor) · subject_id · rating (1–5) · text · photos[] (ordered, with alt_text) · visit_month (YYYY-MM) · flag_count · status (published|hidden) · created_at`

### `Shortlist`
`id · user_id · subject_type (venue|vendor) · subject_id · added_at`

Anonymous pre-auth saves live in `localStorage` under `shortlist_pending`. On first login, the client POSTs them to the server which idempotently upserts them into `Shortlist` for the user, then clears `localStorage`.

### `ClaimRequest`
`id · subject_type (venue|vendor) · subject_id · claimant_user_id · proof_text · proof_files[] · status (pending|approved|rejected) · created_at`

### Notes
- No payments, contracts, or booking artifacts in MVP.
- i18n: long-form text fields are per-language; photo `alt_text` is per-language; UI strings live in a translation file.
- Photo storage: object store (R2/S3) — flagged for implementation.
- Reviews require an authenticated user (enforced at write time).
- When `Review.flag_count >= 3`, status auto-flips to `hidden` pending admin review.
- Noise curfew is stored separately for weekday vs weekend because Belgian municipalities commonly differ.

## 7. Core User Flows

### A. Discovery → shortlist (anonymous then authed)
1. Home → enter city + date(s) + guests (or browse editorial rows).
2. Search results (map + list) → apply filters.
3. Card → venue detail.
4. Save → auth gate (Google / email/password via BetterAuth) → returns to venue.
5. Loop: save 2–5 venues.
6. Empty-state failure: "Clear filters" CTA + "Notify me when new venues match."
7. Map-load failure: fall back to list-only.

### B. Inquiry with two-day pattern
1. Venue detail → "Request dates".
2. Dates step: choose single-day or two-day. Two-day = two dates, each with own guest count.
3. Auth gate (if not logged in) — form state preserved through redirect.
4. Message step (name, phone, note) → submit → confirmation.
5. My inquiries list shows `pending`. Venue's response (manual/admin-driven in MVP) flips status to `accepted` / `declined`. User receives email notification.
6. Conflict branch: if date overlaps `held` availability → warn, allow send anyway.

### C. Write review
1. Detail → "Write a review" (auth-gated).
2. Stars + text + photos (max 5) + visit month → submit → auto-published.
3. Other users can flag; `flag_count >= 3` → auto-hidden + admin review.

### D. Contact lighter vendor
1. Vendor search → filter by category + city → vendor detail.
2. "Contact on WhatsApp" → `wa.me/...` deep-link, pre-filled message referencing vendor + wedding date if provided.

### E. Claim listing
1. Detail page footer link "Is this your venue? Claim it."
2. Form: proof text + uploads (business license, tenancy agreement, ID).
3. Submitted → admin moderation queue. Approved owners get edit access (post-MVP).

### F. Auth
1. Google one-tap OR email + password (BetterAuth).
2. First-login step: pick language (FR/NL), name, optional phone.
3. Redirect back to the triggering screen; form state restored.

### Global UX rules derived from the flows
- **Never block browsing.** Auth gates only at save, inquire, review, claim.
- **Language** chosen at first login, switchable in settings + footer; stored on `User`.
- **Notifications** in MVP: email only. No push, no SMS, no in-app messaging threads.

## 7a. Accessibility & Validation Baseline

**Accessibility target: WCAG 2.2 AA.**
- Color contrast: body text ≥ 4.5:1, large text ≥ 3:1, UI controls ≥ 3:1.
- Every interactive component has a visible focus state and a screen-reader label.
- Map: every pin has a non-visual equivalent in the list. Keyboard users can navigate the list; the map is announced as "non-essential, list available to the left" via `aria-label`.
- Star rating: labelled as a radio group with value announced.
- Photo gallery: alt text per image, keyboard navigation, ESC-to-close.
- Forms: labels above inputs (not placeholder-only), error messages linked via `aria-describedby`, required fields marked with both `*` and "required" in the SR label.
- Touch targets: ≥ 44×44 px on mobile; filter chips in the sticky pill row must meet the same target even in the densest layout (use horizontal scroll rather than shrinking chips).

**Form validation rules (MVP):**
- Email: RFC 5322.
- Phone: E.164 optional; if provided, BE default country code.
- Guest count: positive integer, soft-warn if above venue `capacity_max`.
- Review text: 10–2000 chars.
- Review photos: up to 5, each ≤ 5 MB, JPG/PNG/WEBP.
- Visit month: YYYY-MM, not in the future, not before 2015.
- Message (inquiry): 0–1000 chars (optional field).

## 8. Figma File Structure

### Pages
1. Cover (project description, status, spec link)
2. Design system (tokens, primitives, components)
3. Flows (journey diagrams with arrows)
4. Desktop — Public
5. Desktop — Authed
6. Mobile — Public
7. Mobile — Authed
8. Admin (wireframe-only)
9. Empty / loading / error states
10. Archive (retired explorations)

### Artboard sizes
- Desktop: 1440 width (content max 1280).
- Mobile: 390 width (iPhone 14 baseline).
- Tablet: not a first-class artboard — scales via responsive constraints.

### Naming
- Frames: `PascalCase – Platform` (e.g. `VenueDetail – Desktop`).
- Components: `Category/Name/Variant`.
- Color tokens: `color/role/shade`.
- Text styles: `text/role/size`.

## 9. Design Tokens & Visual Direction

**Style**: Airbnb-style sober, derived from the Airbnb Community UI kit. Not costume-y "Moroccan aesthetic" — quiet, photo-led, culturally confident without iconographic cliches.

### Tokens
- **Color**: neutral off-white background, ink `#222` text, single deep accent (proposal: deep garnet `#7A1E2D` — reviewed for cultural fit and accepted; if it reads too close to "wine" in early tests, fall back to a muted teal `#2E5F5C` or terracotta `#A8482F`), muted greys, semantic (success / warning / error).
- **Typography**: serif display + sans body (proposal: Fraunces or DM Serif Display + Inter). Scale (desktop / mobile, line-height):
  - Display `48/56` / `36/44`
  - H1 `32/40` / `28/36`
  - H2 `24/32` / `22/30`
  - H3 `20/28` / `18/26`
  - Body `16/24`
  - Small `14/20`
  - Caption `12/16`
  - Button `14/20` semibold
- **Spacing**: 4px base; 8 / 12 / 16 / 24 / 32 / 48 / 64 scale.
- **Radius**: 8px card, 12px modal, pill for filter chips.
- **Elevation**: 2 shadow tiers.

## 10. Reusable Components

All built as Figma components with variants, named for eventual Code Connect mapping.

- `ListingCard` (venue / traiteur / vendor-lighter × S/M/L × default/saved/hover)
- `Badge` (neutral / positive / warning / tier €/€€/€€€) and `BadgeRow`
- `FilterPill` (default / active / with-count), `FilterDrawer`, `FilterDrawerRow`
- `DatePicker` (single-day / two-day), `GuestCounter`
- `SearchBar` (hero / inline)
- `MapPin` (default / active / cluster), `PhotoGallery` (mosaic / grid / carousel)
- `ReviewCard`, `ReviewForm`, `StarRating` (read / write)
- `InquiryCard` (sidebar / sticky-bottom), `InquiryStatusChip` (pending / accepted / declined / expired)
- `AuthModal` (sign up / log in)
- `LanguageSwitcher` (footer + settings + first-login variants)
- `AppBar` (desktop) + `BottomNav` (mobile)
- `EmptyState` (no-results / nothing-saved / no-inquiries)
- Primitives: `Button`, `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Tabs`, `Modal`, `Sheet` (bottom / side), `Toast`

## 11. Deliverables

At end of the Figma MVP phase:

- All screens above, mobile + desktop.
- Component library ready for Code Connect mapping.
- Flow diagrams on Flows page.
- Exported hero frames (PNG) for a pitch deck.

## 12. Open Questions / Deferred Decisions

- **Map provider**: Figma mocks assume **Mapbox** styling (for concrete pin + style references). The component `MapPin` and the map frame are designed provider-agnostic — Mapbox, MapLibre (OSS tiles), or Google Maps could swap in at implementation time without design changes. Cost and pin-clustering UX to be finalized in the implementation plan.
- **Photo storage** backend: Cloudflare R2 vs S3 vs Supabase Storage — to be decided in implementation plan.
- **Availability edit model** pre-vendor-portal: admin-only for MVP. `Availability.updated_by` is always an admin user in MVP. Flow for claimed-venue owners to manage their calendar is post-MVP.
- **Notification email** templating and transactional provider (Postmark / Resend / Mailgun) — implementation.
- **Review verification badge** (user whose inquiry was `accepted`) was deliberately descoped to keep MVP simple; can be re-added in phase 2.
- **Brand name, domain, legal entity** — outside this spec.

## 13. Success Criteria

MVP Figma file is complete when:

1. All screens in section 4 exist at both mobile + desktop resolutions.
2. Every component in section 10 is a reusable Figma component with documented variants.
3. The 6 user flows in section 7 can each be walked through end-to-end using the Figma prototype links.
4. Design tokens in section 9 are applied consistently (no hex values outside the token sheet).
5. Every screen in the catalog (section 4a) has its listed empty / loading / error variants linked in the prototype.
6. Accessibility baseline in section 7a is applied: focus states on all interactives, alt text on all photo placeholders, color contrast audited with the Figma Stark plugin or equivalent.
7. A non-designer stakeholder can explain the product by clicking through the prototype unaided.
