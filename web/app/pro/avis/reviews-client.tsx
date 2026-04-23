"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Flag, MessageSquare, Check } from "lucide-react";
import { StarRating } from "@/components/ui/star-rating";
import type { Review } from "@/lib/types";
import { cn } from "@/lib/utils";

const avatarTones = [
  "bg-[oklch(0.78_0.03_30)]",
  "bg-[oklch(0.76_0.04_200)]",
  "bg-[oklch(0.75_0.05_100)]",
  "bg-[oklch(0.74_0.06_340)]",
  "bg-[oklch(0.72_0.07_55)]",
  "bg-[oklch(0.78_0.04_160)]",
];

export function ProReviewsClient({ reviews }: { reviews: Review[] }) {
  const [replies, setReplies] = useState<Record<string, string>>({});
  const [published, setPublished] = useState<Record<string, string>>({});
  const [openId, setOpenId] = useState<string | null>(null);

  function publish(id: string) {
    const text = replies[id]?.trim();
    if (!text) return toast.error("Ajoutez un message");
    setPublished((p) => ({ ...p, [id]: text }));
    setOpenId(null);
    toast.success("Réponse publiée sous l'avis");
  }

  if (reviews.length === 0) {
    return (
      <div className="rounded-xl border border-hairline bg-card p-12 text-center">
        <MessageSquare className="mx-auto h-8 w-8 text-ink-muted" strokeWidth={1.5} />
        <h2 className="mt-3 font-serif text-xl text-ink">Aucun avis pour l'instant</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Encouragez vos anciens clients à laisser un avis — cela améliore votre visibilité.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-4">
      {reviews.map((r) => {
        const initials = r.userDisplayName
          .split(" ")
          .map((w) => w[0])
          .slice(0, 2)
          .join("")
          .toUpperCase();
        const isOpen = openId === r.id;
        const publishedReply = published[r.id];
        return (
          <article key={r.id} className="rounded-xl border border-hairline bg-card p-5 space-y-4">
            <header className="flex items-start gap-3">
              <div
                className={cn(
                  "grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-semibold text-ink",
                  avatarTones[r.userAvatarTone % avatarTones.length],
                )}
              >
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-3">
                  <div className="font-medium text-ink">{r.userDisplayName}</div>
                  <div className="text-xs text-ink-muted shrink-0">Visité en {r.visitMonth}</div>
                </div>
                <div className="mt-0.5 flex items-center gap-2">
                  <StarRating value={r.rating} size="sm" />
                  <span className="text-sm font-medium text-ink">{r.rating}/5</span>
                </div>
              </div>
            </header>

            <p className="text-sm text-ink leading-relaxed">{r.text}</p>

            {r.photos.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {r.photos.map((p, i) => (
                  <div key={i} className={cn("h-16 w-16 rounded-md", p.fallback)} aria-label={p.alt_fr} />
                ))}
              </div>
            )}

            {publishedReply && (
              <div className="rounded-lg bg-surface-muted border-l-2 border-garnet p-3 text-sm text-ink">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-garnet mb-1">
                  Votre réponse
                </div>
                {publishedReply}
              </div>
            )}

            <footer className="flex items-center gap-4 pt-1">
              {!publishedReply && (
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : r.id)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-garnet hover:text-garnet-hover"
                >
                  <MessageSquare className="h-4 w-4" strokeWidth={1.75} />
                  Répondre publiquement
                </button>
              )}
              <button
                type="button"
                onClick={() => toast.success("Avis signalé — notre équipe va examiner")}
                className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink"
              >
                <Flag className="h-4 w-4" strokeWidth={1.5} />
                Signaler cet avis
              </button>
            </footer>

            {isOpen && (
              <div className="rounded-lg border border-hairline bg-surface-muted/40 p-4 space-y-3">
                <textarea
                  value={replies[r.id] ?? ""}
                  onChange={(e) => setReplies((p) => ({ ...p, [r.id]: e.target.value }))}
                  rows={3}
                  placeholder="Merci pour votre retour. Nous…"
                  className="w-full rounded-lg border border-hairline bg-card px-3 py-2 text-sm outline-none focus:border-ink resize-none"
                />
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-ink-muted">
                    Votre réponse sera visible publiquement sous l'avis.
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setOpenId(null)}
                      className="text-sm font-medium text-ink-muted"
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      onClick={() => publish(r.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-garnet text-white px-3 py-2 text-sm font-semibold hover:bg-garnet-hover"
                    >
                      <Check className="h-4 w-4" />
                      Publier
                    </button>
                  </div>
                </div>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
