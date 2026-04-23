"use client";

import { useState } from "react";
import { HelpCircle, Lightbulb, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HelpStep {
  title: string;
  body: string;
}

/**
 * Contextual help panel. Collapsed by default — shows a small "Aide" pill
 * that users can expand when they need guidance.
 */
export function HelpCallout({
  title = "Comment ça marche ?",
  intro,
  steps,
  className,
}: {
  /** Retained for backward compatibility with existing call sites; no longer used. */
  storageKey?: string;
  title?: string;
  intro?: string;
  steps: HelpStep[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <div className={cn("flex justify-end", className)}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Afficher l'aide de cette page"
          className="inline-flex items-center gap-1.5 rounded-pill border border-hairline bg-card px-3 py-1.5 text-xs font-medium text-ink-muted hover:text-ink hover:border-ink-muted transition-colors"
        >
          <HelpCircle className="h-3.5 w-3.5" strokeWidth={1.75} />
          Aide
        </button>
      </div>
    );
  }

  return (
    <aside
      role="note"
      className={cn(
        "relative rounded-2xl border border-hairline bg-gradient-to-br from-garnet/5 via-card to-card p-4 md:p-5",
        "animate-in fade-in-0 slide-in-from-top-2 duration-300",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-garnet/10 text-garnet">
          <Lightbulb className="h-4 w-4" strokeWidth={1.75} />
        </span>
        <div className="flex-1 min-w-0 pr-6">
          <h2 className="font-serif text-lg text-ink">{title}</h2>
          {intro && <p className="mt-1 text-sm text-ink-muted leading-relaxed">{intro}</p>}
          <ol className="mt-3 space-y-2.5">
            {steps.map((s, i) => (
              <li key={s.title} className="flex gap-3 text-sm">
                <span
                  aria-hidden
                  className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-ink text-[11px] font-semibold text-surface tabular-nums"
                >
                  {i + 1}
                </span>
                <span className="min-w-0">
                  <span className="block font-medium text-ink">{s.title}</span>
                  <span className="block text-ink-muted leading-relaxed">{s.body}</span>
                </span>
              </li>
            ))}
          </ol>
          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-pill bg-ink px-4 py-1.5 text-xs font-semibold text-surface hover:bg-ink/90"
            >
              J'ai compris
            </button>
            <span className="text-[11px] text-ink-muted">
              Vous pourrez rouvrir l'aide à tout moment.
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Fermer l'aide"
          className="absolute top-3 right-3 rounded-full p-1.5 text-ink-muted hover:bg-surface-muted hover:text-ink"
        >
          <X className="h-4 w-4" strokeWidth={1.75} />
        </button>
      </div>
    </aside>
  );
}
