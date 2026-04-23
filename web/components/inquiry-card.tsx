"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Calendar, Users, ArrowRight, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Venue } from "@/lib/types";

function addMonths(date: Date, n: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + n);
  return d;
}

function formatDateFR(iso: string | null): string {
  if (!iso) return "— sélectionner —";
  const d = new Date(iso);
  return d.toLocaleDateString("fr-BE", { weekday: "short", day: "numeric", month: "long", year: "numeric" });
}

function useDateRange() {
  // Freeze at component mount so server and client renders agree on min/max
  // even if the render crosses midnight or server/client clocks differ slightly.
  const [range] = useState(() => {
    const now = new Date();
    return {
      min: now.toISOString().slice(0, 10),
      max: addMonths(now, 24).toISOString().slice(0, 10),
    };
  });
  return range;
}

export function InquiryCard({
  venue,
  placement,
}: {
  venue: Venue;
  placement: "sidebar" | "sticky-bottom";
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {placement === "sidebar" ? (
        <aside className="rounded-xl border border-hairline bg-card shadow-e1 p-5">
          <div className="flex items-baseline justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-widest text-ink-muted">À partir de</div>
              <div className="font-serif text-2xl text-ink">
                {venue.priceRangeMin ? `€${venue.priceRangeMin.toLocaleString()}` : venue.priceTier}
                <span className="text-sm font-sans text-ink-muted font-normal"> · tout compris</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-5 w-full rounded-lg bg-garnet text-white font-semibold py-3.5 hover:bg-garnet-hover transition-colors"
          >
            Demander des dates
          </button>
          <div className="mt-4 rounded-lg border border-hairline bg-surface-muted p-3 text-xs text-ink-muted leading-relaxed">
            Envoyez une demande — la salle vous confirme la disponibilité et le tarif définitif. Aucun paiement à ce stade.
          </div>
          <Mini label={`${venue.capacityMin}–${venue.capacityMax} invités`} />
          <Mini
            label={
              venue.genderSeparation === "strict"
                ? "Séparation H/F stricte"
                : venue.genderSeparation === "separable"
                  ? "Espaces séparables"
                  : "Salle mixte"
            }
          />
        </aside>
      ) : (
        <div className="md:hidden fixed inset-x-0 bottom-16 z-30 border-t border-hairline bg-card p-3 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="font-serif text-lg text-ink leading-none">
              {venue.priceRangeMin ? `€${venue.priceRangeMin.toLocaleString()}+` : venue.priceTier}
            </div>
            <div className="text-xs text-ink-muted">tout compris</div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-pill bg-garnet px-5 py-3 text-sm font-semibold text-white"
          >
            Demander
          </button>
        </div>
      )}
      <InquiryDialog venue={venue} open={open} onOpenChange={setOpen} />
    </>
  );
}

function Mini({ label }: { label: string }) {
  return (
    <div className="mt-3 flex items-center gap-2 text-xs text-ink-muted">
      <ChevronRight className="h-3 w-3 text-garnet" strokeWidth={2} />
      {label}
    </div>
  );
}

function InquiryDialog({
  venue,
  open,
  onOpenChange,
}: {
  venue: Venue;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [step, setStep] = useState<"dates" | "message" | "sent">("dates");
  const [mode, setMode] = useState<"single" | "two-day">("single");
  const [labeling, setLabeling] = useState<"men_women" | "neutral">("men_women");
  const [date1, setDate1] = useState<string>("");
  const [date2, setDate2] = useState<string>("");
  const [guests1, setGuests1] = useState<number>(300);
  const [guests2, setGuests2] = useState<number>(300);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  function resetAndClose() {
    onOpenChange(false);
    setTimeout(() => {
      setStep("dates");
      setDate1("");
      setDate2("");
      setName("");
      setPhone("");
      setMessage("");
    }, 200);
  }

  function nextFromDates() {
    if (!date1) return toast.error("Choisissez une date");
    if (mode === "two-day" && !date2) return toast.error("Choisissez la seconde date");
    setStep("message");
  }

  function submit() {
    if (!name.trim()) return toast.error("Votre nom est requis");
    if (!phone.trim()) return toast.error("Votre téléphone est requis");
    setStep("sent");
  }

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? onOpenChange(true) : resetAndClose())}>
      <DialogContent className="sm:max-w-[560px] max-h-[92vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="font-serif text-2xl">
            {step === "sent" ? "Demande envoyée" : `Demande · ${venue.name}`}
          </DialogTitle>
        </DialogHeader>

        {step === "dates" && (
          <div className="px-6 pb-6 pt-2 space-y-6">
            <Segmented
              options={[
                { value: "single", label: "1 jour" },
                { value: "two-day", label: "2 jours (H + F)" },
              ]}
              value={mode}
              onChange={(v) => setMode(v as "single" | "two-day")}
            />

            {mode === "two-day" && (
              <Segmented
                options={[
                  { value: "men_women", label: "Jour hommes / femmes" },
                  { value: "neutral", label: "Jour 1 / Jour 2" },
                ]}
                value={labeling}
                onChange={(v) => setLabeling(v as "men_women" | "neutral")}
                small
              />
            )}

            <DateField
              label={
                mode === "single"
                  ? "Date du mariage"
                  : labeling === "men_women"
                    ? "Jour hommes"
                    : "Jour 1"
              }
              value={date1}
              onChange={setDate1}
            />
            <GuestField
              label={mode === "single" ? "Invités" : labeling === "men_women" ? "Invités (côté hommes)" : "Invités jour 1"}
              value={guests1}
              onChange={setGuests1}
              capacityMax={venue.capacityMax}
            />

            {mode === "two-day" && (
              <>
                <DateField
                  label={labeling === "men_women" ? "Jour femmes" : "Jour 2"}
                  value={date2}
                  onChange={setDate2}
                />
                <GuestField
                  label={
                    labeling === "men_women" ? "Invités (côté femmes)" : "Invités jour 2"
                  }
                  value={guests2}
                  onChange={setGuests2}
                  capacityMax={venue.capacityMax}
                />
              </>
            )}

            <button
              type="button"
              onClick={nextFromDates}
              className="w-full rounded-lg bg-garnet py-3.5 font-semibold text-white hover:bg-garnet-hover"
            >
              Continuer
            </button>
          </div>
        )}

        {step === "message" && (
          <form
            className="px-6 pb-6 pt-2 space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <Field label="Nom complet" required>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                className="w-full rounded-lg border border-hairline bg-card px-3 py-3 text-sm outline-none focus:border-ink"
                placeholder="Hajar Bennani"
                required
              />
            </Field>
            <Field label="Téléphone" required>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                inputMode="tel"
                className="w-full rounded-lg border border-hairline bg-card px-3 py-3 text-sm outline-none focus:border-ink"
                placeholder="+32 470 12 34 56"
                required
              />
            </Field>
            <Field label="Message (optionnel)">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                maxLength={1000}
                className="w-full rounded-lg border border-hairline bg-card px-3 py-3 text-sm outline-none focus:border-ink resize-none"
                placeholder="Précisions sur l'organisation : groupes nachid, traiteurs envisagés, besoins particuliers…"
              />
              <div className="text-right text-xs text-ink-muted mt-1">{message.length}/1000</div>
            </Field>
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep("dates")}
                className="text-sm font-medium underline underline-offset-4 text-ink"
              >
                Retour
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-garnet px-5 py-3 text-sm font-semibold text-white hover:bg-garnet-hover"
              >
                Envoyer la demande
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        )}

        {step === "sent" && (
          <div className="px-6 pb-6 pt-2 text-center space-y-4">
            <div
              className="mx-auto h-16 w-16 rounded-full bg-garnet-soft grid place-items-center"
              aria-hidden
            >
              <div className="h-8 w-8 rounded-full bg-garnet grid place-items-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>
            <p className="text-base text-ink leading-relaxed">
              Votre demande est partie chez <span className="font-medium">{venue.name}</span>.
              <br />
              Vous recevrez une réponse par email sous 48h.
            </p>
            <button
              type="button"
              onClick={resetAndClose}
              className="rounded-lg bg-ink text-surface font-semibold px-5 py-2.5"
            >
              Voir mes demandes
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Segmented<T extends string>({
  options,
  value,
  onChange,
  small,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  small?: boolean;
}) {
  return (
    <div role="radiogroup" className={cn("inline-flex w-full rounded-lg border border-hairline bg-surface-muted p-1", small && "text-xs")}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "flex-1 rounded-md px-3 font-medium transition-colors",
            small ? "py-1.5 text-xs" : "py-2.5 text-sm",
            value === o.value ? "bg-card shadow-e1 text-ink" : "text-ink-muted hover:text-ink",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const { min, max } = useDateRange();
  return (
    <Field label={label}>
      <label className="flex items-center gap-2 rounded-lg border border-hairline bg-card px-3 py-3 focus-within:border-ink">
        <Calendar className="h-4 w-4 text-ink-muted" strokeWidth={1.75} />
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
          className="flex-1 bg-transparent text-sm outline-none"
        />
      </label>
      {value && (
        <div className="text-xs text-ink-muted mt-1.5">{formatDateFR(value)}</div>
      )}
    </Field>
  );
}

function GuestField({
  label,
  value,
  onChange,
  capacityMax,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  capacityMax: number;
}) {
  const over = value > capacityMax;
  return (
    <Field label={label}>
      <div
        role="spinbutton"
        aria-valuemin={1}
        aria-valuemax={9999}
        aria-valuenow={value}
        className="flex items-center gap-2 rounded-lg border border-hairline bg-card px-3 py-2 focus-within:border-ink"
      >
        <Users className="h-4 w-4 text-ink-muted" strokeWidth={1.75} />
        <button
          type="button"
          onClick={() => onChange(Math.max(1, value - 10))}
          className="h-9 w-9 rounded-md border border-hairline text-ink hover:border-ink-muted"
          aria-label="Diminuer"
        >
          −
        </button>
        <input
          type="number"
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(Math.max(1, Number(e.target.value) || 1))}
          className="w-16 text-center bg-transparent text-sm font-medium outline-none"
          aria-label={label}
        />
        <button
          type="button"
          onClick={() => onChange(value + 10)}
          className="h-9 w-9 rounded-md border border-hairline text-ink hover:border-ink-muted"
          aria-label="Augmenter"
        >
          +
        </button>
      </div>
      {over && (
        <div className="text-xs text-warning mt-1.5">
          Capacité max de la salle : {capacityMax}. La salle devra confirmer.
        </div>
      )}
    </Field>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-ink mb-1.5">
        {label}
        {required && <span className="text-garnet ml-0.5" aria-label="requis">*</span>}
      </span>
      {children}
    </label>
  );
}
