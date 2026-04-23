import { AdminHeader } from "../../admin/admin-header";
import { InquiriesClient } from "../../admin/demandes/inquiries-client";
import { currentInquiries } from "@/lib/fixtures/pro-context";

export default function ProInquiriesPage() {
  const mine = currentInquiries();
  const pending = mine.filter((i) => i.status === "pending").length;
  return (
    <>
      <AdminHeader
        title="Mes demandes"
        subtitle={`${pending} en attente de réponse sur votre salle`}
      />
      <div className="p-6 md:p-8">
        <InquiriesClient initial={mine} />
      </div>
    </>
  );
}
