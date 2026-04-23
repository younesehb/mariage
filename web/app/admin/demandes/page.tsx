import { AdminHeader } from "../admin-header";
import { InquiriesClient } from "./inquiries-client";
import { adminInquiries } from "@/lib/fixtures/admin-data";

export default function AdminInquiriesPage() {
  return (
    <>
      <AdminHeader
        title="Demandes"
        subtitle={`${adminInquiries.filter((i) => i.status === "pending").length} en attente de réponse`}
      />
      <div className="p-6 md:p-8">
        <InquiriesClient initial={adminInquiries} />
      </div>
    </>
  );
}
