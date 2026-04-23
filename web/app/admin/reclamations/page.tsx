import { AdminHeader } from "../admin-header";
import { ClaimsClient } from "./claims-client";
import { claimRequests } from "@/lib/fixtures/claims";
import { venues, vendors } from "@/lib/fixtures";

export default function AdminClaimsPage() {
  const pending = claimRequests.filter((c) => c.status === "pending").length;
  const enriched = claimRequests.map((c) => ({
    ...c,
    subjectName:
      c.subjectType === "venue"
        ? venues.find((v) => v.id === c.subjectId)?.name ?? c.subjectId
        : vendors.find((v) => v.id === c.subjectId)?.name ?? c.subjectId,
  }));
  return (
    <>
      <AdminHeader
        title="Revendications"
        subtitle={`${pending} revendications en attente de vérification`}
      />
      <div className="p-6 md:p-8">
        <ClaimsClient initial={enriched} />
      </div>
    </>
  );
}
