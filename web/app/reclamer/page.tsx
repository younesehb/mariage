import { ShieldCheck, Upload } from "lucide-react";

export default async function ReclamerPage({
  searchParams,
}: {
  searchParams: Promise<{ venue?: string }>;
}) {
  const { venue } = await searchParams;
  return (
    <div className="mx-auto max-w-2xl px-4 md:px-8 py-8 md:py-16 space-y-8">
      <header className="space-y-3">
        <div className="text-xs uppercase tracking-widest text-garnet font-semibold">
          Pour les gérants
        </div>
        <h1 className="font-serif text-4xl text-ink">Réclamer une fiche</h1>
        <p className="text-ink-muted leading-relaxed">
          Vous gérez une salle ou un service ? Revendiquez sa fiche pour éditer les informations, gérer votre calendrier et répondre aux demandes.
        </p>
      </header>

      <form className="space-y-5 rounded-xl border border-hairline bg-card p-6">
        <label className="block">
          <span className="block text-sm font-medium text-ink mb-1.5">Salle / Service</span>
          <input
            defaultValue={venue ?? ""}
            placeholder="Nom de la salle"
            className="w-full rounded-lg border border-hairline bg-surface-muted px-3 py-3 text-sm outline-none"
          />
        </label>
        <label className="block">
          <span className="block text-sm font-medium text-ink mb-1.5">
            Votre rôle <span className="text-garnet">*</span>
          </span>
          <input
            placeholder="Propriétaire, gérant, responsable commercial…"
            className="w-full rounded-lg border border-hairline bg-card px-3 py-3 text-sm outline-none focus:border-ink"
            required
          />
        </label>
        <label className="block">
          <span className="block text-sm font-medium text-ink mb-1.5">
            Justificatif <span className="text-garnet">*</span>
          </span>
          <div className="rounded-lg border-2 border-dashed border-hairline bg-surface-muted px-4 py-8 text-center cursor-pointer hover:border-ink-muted">
            <Upload className="mx-auto h-6 w-6 text-ink-muted mb-2" strokeWidth={1.5} />
            <div className="text-sm text-ink">Document officiel</div>
            <div className="text-xs text-ink-muted mt-1">
              Licence commerciale, bail ou pièce d&apos;identité avec carte de gérant (PDF, JPG).
            </div>
          </div>
        </label>
        <label className="block">
          <span className="block text-sm font-medium text-ink mb-1.5">Message</span>
          <textarea
            rows={4}
            placeholder="Contexte éventuel, remarques sur la fiche actuelle…"
            className="w-full rounded-lg border border-hairline bg-card px-3 py-3 text-sm outline-none focus:border-ink resize-none"
          />
        </label>
        <div className="rounded-lg border border-garnet/30 bg-garnet-soft px-4 py-3 flex items-start gap-3">
          <ShieldCheck className="h-4 w-4 text-garnet mt-0.5 shrink-0" strokeWidth={1.75} />
          <p className="text-xs text-ink leading-relaxed">
            Toute revendication est vérifiée manuellement par notre équipe sous 5 jours ouvrables. Vos documents restent confidentiels.
          </p>
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-garnet py-3.5 font-semibold text-white hover:bg-garnet-hover"
        >
          Envoyer ma revendication
        </button>
      </form>
    </div>
  );
}
