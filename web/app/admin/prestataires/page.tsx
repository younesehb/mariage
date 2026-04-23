import Link from "next/link";
import { ExternalLink, Pencil, Plus, Search } from "lucide-react";
import { AdminHeader } from "../admin-header";
import { AdminTable, TH, TR, TD, StatusPill } from "../admin-table";
import { vendors, reviewsFor, CATEGORY_LABELS_FR } from "@/lib/fixtures";

export default function AdminVendorsPage() {
  const rows = vendors.map((v) => ({
    ...v,
    reviewCount: reviewsFor("vendor", v.id).length,
  }));
  return (
    <>
      <AdminHeader
        title="Prestataires"
        subtitle={`${vendors.length} prestataires dans le catalogue`}
        actions={
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg bg-ink text-surface px-4 py-2 text-sm font-semibold"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            Nouveau prestataire
          </button>
        }
      />

      <div className="p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <label className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
            <input
              type="search"
              placeholder="Rechercher un prestataire…"
              className="w-full rounded-lg border border-hairline bg-card pl-10 pr-3 py-2.5 text-sm outline-none focus:border-ink"
            />
          </label>
          <select className="rounded-lg border border-hairline bg-card px-3 py-2.5 text-sm font-medium outline-none">
            <option>Toutes catégories</option>
            {Object.entries(CATEGORY_LABELS_FR).map(([k, l]) => (
              <option key={k}>{l}</option>
            ))}
          </select>
          <select className="rounded-lg border border-hairline bg-card px-3 py-2.5 text-sm font-medium outline-none">
            <option>Tous les statuts</option>
            <option>Publiés</option>
            <option>Brouillons</option>
          </select>
        </div>

        <AdminTable>
          <thead>
            <tr>
              <TH>Nom</TH>
              <TH>Catégorie</TH>
              <TH>Zones</TH>
              <TH>Tarif</TH>
              <TH>Personnel féminin</TH>
              <TH>Revendication</TH>
              <TH>Avis</TH>
              <TH className="text-right">Actions</TH>
            </tr>
          </thead>
          <tbody>
            {rows.map((v) => (
              <TR key={v.id}>
                <TD className="font-medium text-ink">
                  <div className="flex items-center gap-3">
                    <span className={`h-9 w-9 shrink-0 rounded-md ${v.photos[0]?.fallback}`} aria-hidden />
                    <span className="min-w-0 truncate">{v.name}</span>
                  </div>
                </TD>
                <TD>
                  <StatusPill tone="muted">{CATEGORY_LABELS_FR[v.category]}</StatusPill>
                </TD>
                <TD className="text-ink-muted">{v.serviceCities.join(", ")}</TD>
                <TD>
                  {v.pricePerGuestMin && v.pricePerGuestMax ? (
                    <span>€{v.pricePerGuestMin}–{v.pricePerGuestMax}<span className="text-ink-muted text-xs"> / pers.</span></span>
                  ) : (
                    <span className="text-ink-muted">—</span>
                  )}
                </TD>
                <TD>
                  {v.femaleStaffAvailable ? (
                    <StatusPill tone="info">Oui</StatusPill>
                  ) : (
                    <span className="text-ink-muted text-xs">—</span>
                  )}
                </TD>
                <TD>
                  <StatusPill
                    tone={
                      v.claimStatus === "claimed" ? "info" : v.claimStatus === "pending" ? "warning" : "muted"
                    }
                  >
                    {v.claimStatus === "claimed" ? "Revendiqué" : v.claimStatus === "pending" ? "En cours" : "Non"}
                  </StatusPill>
                </TD>
                <TD className="text-ink-muted">{v.reviewCount}</TD>
                <TD>
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/prestataires/${v.slug}`}
                      target="_blank"
                      aria-label="Voir la fiche publique"
                      className="p-1.5 text-ink-muted hover:text-ink"
                    >
                      <ExternalLink className="h-4 w-4" strokeWidth={1.5} />
                    </Link>
                    <button type="button" aria-label="Éditer" className="p-1.5 text-ink-muted hover:text-ink">
                      <Pencil className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                  </div>
                </TD>
              </TR>
            ))}
          </tbody>
        </AdminTable>
      </div>
    </>
  );
}
