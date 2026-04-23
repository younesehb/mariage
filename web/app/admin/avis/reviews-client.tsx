"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, Trash2, Flag, Eye } from "lucide-react";
import { StarRating } from "@/components/ui/star-rating";
import { StatusPill } from "../admin-table";
import type { FlaggedReview } from "@/lib/fixtures/admin-data";
import { cn } from "@/lib/utils";

export function FlaggedReviewsClient({ initial }: { initial: FlaggedReview[] }) {
  const [list, setList] = useState<FlaggedReview[]>(initial);

  function approve(id: string) {
    setList((prev) => prev.filter((r) => r.id !== id));
    toast.success("Avis republié");
  }

  function remove(id: string) {
    setList((prev) => prev.filter((r) => r.id !== id));
    toast.success("Avis supprimé");
  }

  if (list.length === 0) {
    return (
      <div className="rounded-xl border border-hairline bg-card p-12 text-center">
        <Check className="mx-auto h-8 w-8 text-success" strokeWidth={1.5} />
        <h2 className="mt-3 font-serif text-xl text-ink">Aucun avis en attente</h2>
        <p className="text-sm text-ink-muted mt-1">La file est vide.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {list.map((r) => (
        <article
          key={r.id}
          className="rounded-xl border border-hairline bg-card p-5 space-y-4"
        >
          <header className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="font-medium text-ink">{r.userDisplayName}</h3>
                <StatusPill tone="error">
                  <Flag className="h-3 w-3" strokeWidth={2} />
                  {r.flagCount} signalements
                </StatusPill>
                <StatusPill tone="muted">Masqué</StatusPill>
              </div>
              <p className="mt-0.5 text-xs text-ink-muted">
                Avis sur <span className="font-medium text-ink">{r.subjectName}</span> · visité en {r.visitMonth}
              </p>
            </div>
            <StarRating value={r.rating} size="sm" />
          </header>

          <div className="rounded-lg bg-surface-muted p-4 text-sm text-ink leading-relaxed">
            <Eye className="inline h-3.5 w-3.5 text-ink-muted mr-1.5 align-[-0.125em]" strokeWidth={1.5} />
            <span className="whitespace-pre-wrap">{r.text}</span>
          </div>

          {r.flagReasons.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted mb-1.5">
                Motifs de signalement
              </div>
              <div className="flex flex-wrap gap-1.5">
                {r.flagReasons.map((reason) => (
                  <span
                    key={reason}
                    className={cn(
                      "inline-flex items-center rounded-pill border border-hairline bg-card px-2 py-0.5 text-xs font-medium text-ink-muted",
                    )}
                  >
                    {reason}
                  </span>
                ))}
              </div>
            </div>
          )}

          <footer className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => approve(r.id)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-success text-success px-3 py-2 text-sm font-semibold hover:bg-success/5"
            >
              <Check className="h-4 w-4" strokeWidth={2} />
              Republier
            </button>
            <button
              type="button"
              onClick={() => remove(r.id)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-error text-white px-3 py-2 text-sm font-semibold hover:opacity-90"
            >
              <Trash2 className="h-4 w-4" strokeWidth={2} />
              Supprimer définitivement
            </button>
          </footer>
        </article>
      ))}
    </div>
  );
}
