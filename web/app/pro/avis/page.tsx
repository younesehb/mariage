import { AdminHeader } from "../../admin/admin-header";
import { ProReviewsClient } from "./reviews-client";
import { currentReviews } from "@/lib/fixtures/pro-context";
import { avgRating } from "@/lib/fixtures";

export default function ProReviewsPage() {
  const reviews = currentReviews();
  const rating = avgRating(reviews);
  return (
    <>
      <AdminHeader
        title="Avis sur ma fiche"
        subtitle={
          reviews.length > 0
            ? `${rating.toFixed(1)} / 5 sur ${reviews.length} avis`
            : "Aucun avis pour l'instant"
        }
      />
      <div className="p-6 md:p-8">
        <ProReviewsClient reviews={reviews} />
      </div>
    </>
  );
}
