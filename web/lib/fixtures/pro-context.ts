import { findVenueBySlug, reviewsFor } from "@/lib/fixtures";
import { adminInquiries } from "@/lib/fixtures/admin-data";

// Demo: the logged-in "pro" is the owner of Salle Al-Andalous.
// In production, this comes from BetterAuth session → venue owned by the user.

export const CURRENT_OWNER = {
  userId: "u-mohamed",
  name: "Mohamed El-Idrissi",
  email: "contact@al-andalous.be",
  role: "Propriétaire",
  subjectType: "venue" as const,
  subjectSlug: "salle-al-andalous",
};

export function currentVenue() {
  const v = findVenueBySlug(CURRENT_OWNER.subjectSlug);
  if (!v) throw new Error("Demo owner's venue not found in fixtures");
  return v;
}

export function currentReviews() {
  const v = currentVenue();
  return reviewsFor("venue", v.id);
}

export function currentInquiries() {
  const v = currentVenue();
  return adminInquiries.filter((i) => i.venueSlug === v.slug);
}
