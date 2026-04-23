"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, X, FileText, Shield, Mail, UserCircle2 } from "lucide-react";
import { StatusPill } from "../admin-table";
import type { ClaimRequest } from "@/lib/fixtures/claims";

type Enriched = ClaimRequest & { subjectName: string };

export function ClaimsClient({ initial }: { initial: Enriched[] }) {
  const [list, setList] = useState<Enriched[]>(initial);

  function decide(id: string, decision: "approved" | "rejected") {
    setList((prev) => prev.map((c) => (c.id === id ? { ...c, status: decision } : c)));
    toast.success(decision === "approved" ? "Revendication approuvée" : "Revendication rejetée");
  }

  const pending = list.filter((c) => c.status === "pending");
  const processed = list.filter((c) => c.status !== "pending");

  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-serif text-lg mb-3">En attente ({pending.length})</h2>
        {pending.length === 0 ? (
          <div className="rounded-xl border border-hairline bg-card p-10 text-center">
            <Check className="mx-auto h-7 w-7 text-success" />
            <p className="mt-2 text-sm text-ink">Toutes les revendications sont traitées.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {pending.map((c) => (
              <ClaimCard key={c.id} claim={c} onDecide={decide} />
            ))}
          </div>
        )}
      </section>

      {processed.length > 0 && (
        <section>
          <h2 className="font-serif text-lg mb-3">Traitées ({processed.length})</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {processed.map((c) => (
              <ClaimCard key={c.id} claim={c} onDecide={decide} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ClaimCard({
  claim,
  onDecide,
}: {
  claim: Enriched;
  onDecide: (id: string, decision: "approved" | "rejected") => void;
}) {
  const statusMeta =
    claim.status === "approved"
      ? { label: "Approuvée", tone: "success" as const }
      : claim.status === "rejected"
        ? { label: "Rejetée", tone: "error" as const }
        : { label: "En attente", tone: "warning" as const };

  return (
    <article className="rounded-xl border border-hairline bg-card p-5 space-y-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-pill border border-hairline bg-surface-muted px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
            {claim.subjectType === "venue" ? "Salle" : "Prestataire"}
          </div>
          <h3 className="mt-1.5 font-serif text-lg text-ink">{claim.subjectName}</h3>
        </div>
        <StatusPill tone={statusMeta.tone}>{statusMeta.label}</StatusPill>
      </header>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <InfoBit icon={UserCircle2} label="Demandeur" value={claim.claimantName} />
        <InfoBit icon={Shield} label="Rôle" value={claim.claimantRole} />
        <InfoBit icon={Mail} label="Email" value={claim.claimantEmail} />
      </div>

      <p className="text-sm text-ink leading-relaxed rounded-lg bg-surface-muted p-3">
        {claim.proofText}
      </p>

      <div className="inline-flex items-center gap-2 text-xs text-ink">
        <FileText className="h-3.5 w-3.5 text-garnet" strokeWidth={1.75} />
        <a href="#" className="font-medium underline underline-offset-4">
          {claim.proofFileName}
        </a>
      </div>

      {claim.status === "pending" && (
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => onDecide(claim.id, "approved")}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-success text-white py-2.5 text-sm font-semibold hover:opacity-90"
          >
            <Check className="h-4 w-4" strokeWidth={2} />
            Approuver
          </button>
          <button
            type="button"
            onClick={() => onDecide(claim.id, "rejected")}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-error text-error py-2.5 text-sm font-semibold hover:bg-error/5"
          >
            <X className="h-4 w-4" strokeWidth={2} />
            Rejeter
          </button>
        </div>
      )}
    </article>
  );
}

import type { LucideIcon } from "lucide-react";
function InfoBit({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-ink-muted">
        <Icon className="h-3 w-3" strokeWidth={1.5} />
        {label}
      </div>
      <div className="mt-0.5 text-sm font-medium text-ink truncate">{value}</div>
    </div>
  );
}
