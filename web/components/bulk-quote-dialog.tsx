"use client";

import { useEffect, useState } from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { toast } from "sonner";
import { Send, CheckCircle2, Users, Calendar, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Venue } from "@/lib/types";
import { loadPlan } from "@/lib/planner";

export function BulkQuoteDialog({
  open,
  onOpenChange,
  venues,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  venues: Venue[];
  onSuccess?: () => void;
}) {
  const [date, setDate] = useState("");
  const [days, setDays] = useState<1 | 2>(1);
  const [guests, setGuests] = useState<number>(300);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  // Pre-fill from stored plan when the dialog opens
  useEffect(() => {
    if (!open) return;
    const plan = loadPlan();
    if (plan) {
      if (plan.weddingDate) setDate(plan.weddingDate.slice(0, 10));
      setDays(plan.days);
      setGuests(plan.guestsPrimary || 300);
    }
    setSucceeded(false);
  }, [open]);

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (venues.length === 0) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    setSucceeded(true);
    toast.success(`Demande envoyée à ${venues.length} salle${venues.length > 1 ? "s" : ""}`);
    // Auto-close after showing the success panel
    window.setTimeout(() => onSuccess?.(), 1500);
  }

  const defaultMessage =
    "Salam, nous préparons notre mariage et aimerions connaître votre disponibilité, votre politique traiteur, et recevoir un devis estimatif. Merci.";

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop
          className={cn(
            "fixed inset-0 z-50 bg-ink/30 backdrop-blur-md",
            "data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
          )}
        />
        <DialogPrimitive.Popup
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2",
            "max-h-[calc(100vh-2rem)] overflow-auto",
            "rounded-2xl border border-hairline bg-card/95 shadow-e2 backdrop-blur-xl",
            "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
            "data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            "outline-none",
          )}
        >
          {succeeded ? (
            <SuccessPanel count={venues.length} />
          ) : (
            <form onSubmit={submit} className="flex flex-col">
              <header className="flex items-start gap-3 px-6 pt-6 pb-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-garnet/10 text-garnet">
                  <Copy className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <div className="flex-1">
                  <DialogPrimitive.Title className="font-serif text-xl text-ink">
                    Demande groupée à {venues.length} salle{venues.length > 1 ? "s" : ""}
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Description className="mt-1 text-sm text-ink-muted">
                    Même message, envoyé individuellement à chacune. Vous recevrez les
                    réponses séparément dans{" "}
                    <span className="text-ink font-medium">Mes demandes</span>.
                  </DialogPrimitive.Description>
                </div>
              </header>

              <div className="px-6 pb-3">
                <div className="flex flex-wrap gap-1.5">
                  {venues.slice(0, 6).map((v) => (
                    <span
                      key={v.id}
                      className="inline-flex items-center rounded-pill border border-hairline bg-surface-muted/50 px-2.5 py-1 text-[11px] font-medium text-ink"
                    >
                      {v.name}
                    </span>
                  ))}
                  {venues.length > 6 && (
                    <span className="inline-flex items-center rounded-pill border border-hairline bg-surface-muted/50 px-2.5 py-1 text-[11px] font-medium text-ink-muted">
                      +{venues.length - 6} autres
                    </span>
                  )}
                </div>
              </div>

              <div className="grid gap-3 px-6 pt-2 md:grid-cols-3">
                <FieldLabel icon={<Calendar className="h-3.5 w-3.5" strokeWidth={1.75} />} label="Date">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-transparent text-sm text-ink outline-none"
                    required
                  />
                </FieldLabel>
                <FieldLabel icon={<Calendar className="h-3.5 w-3.5" strokeWidth={1.75} />} label="Jours">
                  <select
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value) === 2 ? 2 : 1)}
                    className="w-full bg-transparent text-sm text-ink outline-none"
                  >
                    <option value={1}>1 jour</option>
                    <option value={2}>2 jours</option>
                  </select>
                </FieldLabel>
                <FieldLabel icon={<Users className="h-3.5 w-3.5" strokeWidth={1.75} />} label="Invités">
                  <input
                    type="number"
                    min={1}
                    max={2000}
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value) || 0)}
                    className="w-full bg-transparent text-sm text-ink outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </FieldLabel>
              </div>

              <div className="px-6 pt-4">
                <label className="block">
                  <span className="mb-1.5 flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                      Message
                    </span>
                    {!message && (
                      <button
                        type="button"
                        onClick={() => setMessage(defaultMessage)}
                        className="text-[11px] font-medium text-garnet hover:underline"
                      >
                        Utiliser un modèle
                      </button>
                    )}
                  </span>
                  <textarea
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={defaultMessage}
                    className="w-full resize-none rounded-lg border border-hairline bg-card px-3 py-2.5 text-sm text-ink outline-none focus:border-ink"
                    required
                  />
                </label>
                <p className="mt-2 text-xs text-ink-muted">
                  Vos coordonnées (email, téléphone) seront transmises automatiquement à
                  chaque salle pour qu'elles puissent vous recontacter.
                </p>
              </div>

              <footer className="mt-4 flex items-center justify-between gap-2 border-t border-hairline bg-surface-muted/30 px-6 py-3 rounded-b-2xl">
                <DialogPrimitive.Close className="rounded-pill border border-hairline bg-card px-4 py-2 text-sm font-medium text-ink hover:border-ink-muted">
                  Annuler
                </DialogPrimitive.Close>
                <button
                  type="submit"
                  disabled={submitting || venues.length === 0}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-pill bg-garnet px-4 py-2 text-sm font-semibold text-white hover:bg-garnet-hover",
                    (submitting || venues.length === 0) && "opacity-60",
                  )}
                >
                  <Send className="h-4 w-4" strokeWidth={1.75} />
                  {submitting ? "Envoi…" : `Envoyer à ${venues.length}`}
                </button>
              </footer>
            </form>
          )}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function FieldLabel({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col rounded-lg border border-hairline bg-card px-3 py-2">
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
        {icon}
        {label}
      </span>
      <span className="mt-1">{children}</span>
    </label>
  );
}

function SuccessPanel({ count }: { count: number }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
        <CheckCircle2 className="h-7 w-7" strokeWidth={1.75} />
      </span>
      <DialogPrimitive.Title className="font-serif text-xl text-ink">
        {count} demande{count > 1 ? "s" : ""} envoyée{count > 1 ? "s" : ""}
      </DialogPrimitive.Title>
      <p className="max-w-sm text-sm text-ink-muted">
        Retrouvez les réponses dans <span className="font-medium text-ink">Mes demandes</span>.
        La plupart des salles répondent sous 48 h.
      </p>
    </div>
  );
}
