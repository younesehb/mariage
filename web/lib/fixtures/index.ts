import { venues, findVenueBySlug } from "./venues";
import { vendors, findVendorBySlug, vendorsByCategory } from "./vendors";
import { reviews, reviewsFor, avgRating } from "./reviews";
import type { ListingSummary, Vendor, Venue, Review } from "@/lib/types";

export { venues, findVenueBySlug };
export { vendors, findVendorBySlug, vendorsByCategory };
export { reviews, reviewsFor, avgRating };

// Human-readable badges per spec §6 venue fields
export function venueBadges(v: Venue): string[] {
  const out: string[] = [`${v.capacityMin}–${v.capacityMax} invités`];
  if (v.genderSeparation === "strict") out.push("Séparation stricte");
  if (v.genderSeparation === "separable") out.push("Séparable");
  if (v.prayerArea) out.push("Salle de prière");
  if (v.wuduFacilities) out.push("Ablutions");
  if (v.femaleStaffAvailable) out.push("Personnel féminin");
  if (v.stageAvailable) out.push("Scène");
  if (v.parkingSpaces) out.push(`${v.parkingSpaces} places parking`);
  if (v.noiseCurfewWeekend === null) out.push("Pas de couvre-feu WE");
  return out;
}

export function venueToListing(v: Venue): ListingSummary {
  const rs = reviewsFor("venue", v.id);
  const photos = v.photos.slice(0, 3);
  return {
    id: v.id,
    slug: v.slug,
    kind: "venue",
    name: v.name,
    city: v.city,
    neighborhood: v.neighborhood,
    photos,
    priceTier: v.priceTier,
    priceHint:
      v.priceRangeMin && v.priceRangeMax
        ? `€${v.priceRangeMin.toLocaleString()}–${v.priceRangeMax.toLocaleString()}`
        : undefined,
    rating: avgRating(rs),
    reviewCount: rs.length,
    badges: venueBadges(v).slice(0, 3),
    lat: v.lat,
    lng: v.lng,
  };
}

export function vendorToListing(v: Vendor): ListingSummary {
  const rs = reviewsFor("vendor", v.id);
  const photos = v.photos.slice(0, 3);
  const kind: ListingSummary["kind"] = v.category === "traiteur" ? "traiteur" : "vendor-lighter";
  const badges: string[] = [];
  if (v.femaleStaffAvailable) badges.push("Personnel féminin");
  if (v.pricePerGuestMin && v.pricePerGuestMax) {
    badges.push(`€${v.pricePerGuestMin}–${v.pricePerGuestMax}/pers.`);
  }
  return {
    id: v.id,
    slug: v.slug,
    kind,
    name: v.name,
    city: v.serviceCities[0],
    photos,
    rating: avgRating(rs),
    reviewCount: rs.length,
    badges,
    category: v.category,
  };
}

/**
 * UI copy for vendor categories (FR).
 */
export const CATEGORY_LABELS_FR: Record<Vendor["category"], string> = {
  traiteur: "Traiteur",
  ziana: "Ziana",
  tayyaba: "Tayyaba",
  hennaya: "Hennaya",
  nasheed: "Groupe nachid",
  photographer: "Photographe",
  negafa: "Négafa",
  videographer: "Vidéaste",
};

export const CATEGORY_LABELS_NL: Record<Vendor["category"], string> = {
  traiteur: "Traiteur",
  ziana: "Ziana",
  tayyaba: "Tayyaba",
  hennaya: "Hennaya",
  nasheed: "Nachid-groep",
  photographer: "Fotograaf",
  negafa: "Negafa",
  videographer: "Videograaf",
};
