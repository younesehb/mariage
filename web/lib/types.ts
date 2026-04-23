// Data model aligned with the spec (docs/superpowers/specs/2026-04-22-*.md §6).
// MVP uses hand-crafted fixtures; these types will map 1:1 to the eventual DB.

export type Lang = "fr" | "nl";

export type PriceTier = "€" | "€€" | "€€€";

export type GenderSeparation = "mixed" | "separable" | "strict";
export type TraiteurPolicy = "in_house" | "imposed_list" | "free_choice";

export type VendorCategory =
  | "traiteur"
  | "ziana"
  | "tayyaba"
  | "hennaya"
  | "nasheed"
  | "photographer"
  | "negafa"
  | "videographer";

export type SubjectType = "venue" | "vendor";

export type Availability = "available" | "held" | "booked";

export type InquiryStatus = "pending" | "accepted" | "declined" | "expired";
export type ClaimStatus = "unclaimed" | "pending" | "claimed";
export type ListingStatus = "draft" | "published" | "hidden";

export interface Photo {
  /** Placeholder CSS fallback class like `photo-fallback` or `photo-fallback-3`. */
  fallback: string;
  alt_fr: string;
  alt_nl: string;
}

export interface I18nText {
  fr: string;
  nl: string;
}

export interface Venue {
  id: string;
  slug: string;
  name: string;
  description: I18nText;
  city: string;
  neighborhood: string;
  address: string;
  lat: number;
  lng: number;
  photos: Photo[];
  priceTier: PriceTier;
  priceRangeMin?: number;
  priceRangeMax?: number;
  capacityMin: number;
  capacityMax: number;
  genderSeparation: GenderSeparation;
  prayerArea: boolean;
  wuduFacilities: boolean;
  parkingSpaces: number | null;
  noiseCurfewWeekday: string | null; // "02:00" | null ("no limit")
  noiseCurfewWeekend: string | null;
  stageAvailable: boolean;
  traiteurPolicy: TraiteurPolicy;
  femaleStaffAvailable: boolean;
  claimStatus: ClaimStatus;
  status: ListingStatus;
}

export interface Vendor {
  id: string;
  slug: string;
  name: string;
  category: VendorCategory;
  description: I18nText;
  serviceCities: string[];
  photos: Photo[];
  contactWhatsapp: string;
  contactEmail: string;
  femaleStaffAvailable: boolean;
  claimStatus: ClaimStatus;
  status: ListingStatus;
  // Traiteur-only:
  cuisineTags?: string[];
  pricePerGuestMin?: number;
  pricePerGuestMax?: number;
  deliveryRadiusKm?: number;
}

export interface Review {
  id: string;
  subjectType: SubjectType;
  subjectId: string;
  userId: string;
  userDisplayName: string;
  userAvatarTone: number; // 0-5, pick a palette
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  photos: Photo[];
  visitMonth: string; // YYYY-MM
  flagCount: number;
  status: "published" | "hidden";
  createdAt: string;
}

export interface Inquiry {
  id: string;
  userId: string;
  subjectType: SubjectType;
  subjectId: string;
  inquiryType: "single_day" | "two_day";
  datePrimary: string; // YYYY-MM-DD
  dateSecondary?: string;
  guestsPrimary: number;
  guestsSecondary?: number;
  dayLabeling: "neutral" | "men_women";
  message: string;
  status: InquiryStatus;
  venueResponse?: string;
  createdAt: string;
  respondedAt?: string;
}

/** UI-level aggregate: a listing-card view onto a venue or vendor. */
export interface ListingSummary {
  id: string;
  slug: string;
  kind: "venue" | "traiteur" | "vendor-lighter";
  name: string;
  city: string;
  neighborhood?: string;
  photos: Photo[];
  priceTier?: PriceTier;
  priceHint?: string;
  rating: number;
  reviewCount: number;
  badges: string[];
  category?: VendorCategory;
  lat?: number;
  lng?: number;
}
