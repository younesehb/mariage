import { AdminHeader } from "../admin-header";
import { FlaggedReviewsClient } from "./reviews-client";
import { flaggedReviews } from "@/lib/fixtures/admin-data";

export default function AdminReviewsPage() {
  return (
    <>
      <AdminHeader
        title="Avis signalés"
        subtitle={`${flaggedReviews.length} avis masqués automatiquement (≥ 3 signalements), en attente de décision`}
      />
      <div className="p-6 md:p-8">
        <FlaggedReviewsClient initial={flaggedReviews} />
      </div>
    </>
  );
}
