import { AdminHeader } from "../../admin/admin-header";
import { FicheForm } from "./fiche-form";
import { currentVenue } from "@/lib/fixtures/pro-context";

export default function ProFichePage() {
  return (
    <>
      <AdminHeader
        title="Ma fiche"
        subtitle="Modifiez les informations affichées sur votre fiche publique"
      />
      <div className="p-6 md:p-8">
        <FicheForm venue={currentVenue()} />
      </div>
    </>
  );
}
