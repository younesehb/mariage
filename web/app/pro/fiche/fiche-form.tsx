"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Image, Plus, Save, Eye, AlertCircle } from "lucide-react";
import type { Venue } from "@/lib/types";
import { cn } from "@/lib/utils";

export function FicheForm({ venue }: { venue: Venue }) {
  const [draft, setDraft] = useState(venue);
  const [dirty, setDirty] = useState(false);

  function set<K extends keyof Venue>(key: K, value: Venue[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
    setDirty(true);
  }

  function save() {
    setDirty(false);
    toast.success("Fiche enregistrée — visible sur votre page publique sous 5 min");
  }

  return (
    <div className="max-w-4xl space-y-8">
      {/* Unsaved banner */}
      {dirty && (
        <div className="sticky top-[72px] z-10 rounded-lg border border-garnet/30 bg-garnet-soft px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-ink">
            <AlertCircle className="h-4 w-4 text-garnet" strokeWidth={1.75} />
            Modifications non enregistrées
          </div>
          <button
            type="button"
            onClick={save}
            className="inline-flex items-center gap-1.5 rounded-lg bg-garnet text-white px-4 py-2 text-sm font-semibold hover:bg-garnet-hover"
          >
            <Save className="h-4 w-4" />
            Enregistrer
          </button>
        </div>
      )}

      {/* Photos */}
      <Section title="Photos" hint="La première photo sert d'image principale dans les résultats de recherche">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {draft.photos.map((p, i) => (
            <div
              key={i}
              className={cn(
                "relative aspect-[4/3] rounded-lg overflow-hidden group",
                p.fallback,
              )}
            >
              {i === 0 && (
                <span className="absolute top-2 left-2 inline-flex items-center rounded-pill bg-surface/95 px-2 py-0.5 text-[10px] font-semibold text-ink">
                  Principale
                </span>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </div>
          ))}
          <button
            type="button"
            className="aspect-[4/3] rounded-lg border-2 border-dashed border-hairline bg-surface-muted hover:border-ink-muted transition-colors flex flex-col items-center justify-center gap-1 text-ink-muted"
          >
            <Plus className="h-5 w-5" strokeWidth={1.5} />
            <span className="text-xs font-medium">Ajouter</span>
          </button>
        </div>
        <p className="text-xs text-ink-muted flex items-center gap-1 mt-1">
          <Image className="h-3 w-3" strokeWidth={1.5} aria-hidden /> Formats acceptés : JPG, PNG, WebP · Max 5 Mo par photo
        </p>
      </Section>

      {/* Nom et description */}
      <Section title="Nom et description">
        <Field label="Nom de la salle" required>
          <input
            value={draft.name}
            onChange={(e) => set("name", e.target.value)}
            className="w-full rounded-lg border border-hairline bg-card px-3 py-2.5 text-sm outline-none focus:border-ink"
          />
        </Field>
        <Field label="Description (français)" required>
          <textarea
            value={draft.description.fr}
            onChange={(e) => set("description", { ...draft.description, fr: e.target.value })}
            rows={4}
            className="w-full rounded-lg border border-hairline bg-card px-3 py-2.5 text-sm outline-none focus:border-ink resize-none"
          />
        </Field>
        <Field label="Description (néerlandais)">
          <textarea
            value={draft.description.nl}
            onChange={(e) => set("description", { ...draft.description, nl: e.target.value })}
            rows={4}
            className="w-full rounded-lg border border-hairline bg-card px-3 py-2.5 text-sm outline-none focus:border-ink resize-none"
            placeholder="Optionnel — double votre visibilité en Flandre"
          />
        </Field>
      </Section>

      {/* Capacité et prix */}
      <Section title="Capacité et tarif">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Capacité min (invités)">
            <input
              type="number"
              value={draft.capacityMin}
              onChange={(e) => set("capacityMin", Number(e.target.value))}
              className="w-full rounded-lg border border-hairline bg-card px-3 py-2.5 text-sm outline-none focus:border-ink"
            />
          </Field>
          <Field label="Capacité max (invités)">
            <input
              type="number"
              value={draft.capacityMax}
              onChange={(e) => set("capacityMax", Number(e.target.value))}
              className="w-full rounded-lg border border-hairline bg-card px-3 py-2.5 text-sm outline-none focus:border-ink"
            />
          </Field>
          <Field label="Tarif — tier">
            <select
              value={draft.priceTier}
              onChange={(e) => set("priceTier", e.target.value as "€" | "€€" | "€€€")}
              className="w-full rounded-lg border border-hairline bg-card px-3 py-2.5 text-sm outline-none focus:border-ink"
            >
              <option value="€">€ — économique</option>
              <option value="€€">€€ — milieu de gamme</option>
              <option value="€€€">€€€ — premium</option>
            </select>
          </Field>
          <Field label="Fourchette (€, optionnel)">
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={draft.priceRangeMin ?? ""}
                onChange={(e) => set("priceRangeMin", Number(e.target.value) || undefined)}
                placeholder="Min"
                className="w-full rounded-lg border border-hairline bg-card px-3 py-2.5 text-sm outline-none focus:border-ink"
              />
              <span className="text-ink-muted">—</span>
              <input
                type="number"
                value={draft.priceRangeMax ?? ""}
                onChange={(e) => set("priceRangeMax", Number(e.target.value) || undefined)}
                placeholder="Max"
                className="w-full rounded-lg border border-hairline bg-card px-3 py-2.5 text-sm outline-none focus:border-ink"
              />
            </div>
          </Field>
        </div>
      </Section>

      {/* Politiques */}
      <Section title="Politiques et équipements">
        <div className="grid md:grid-cols-2 gap-4">
          <SelectField
            label="Alcool"
            value={draft.alcoholPolicy}
            onChange={(v) => set("alcoholPolicy", v as Venue["alcoholPolicy"])}
            options={[
              { value: "forbidden", label: "Interdit" },
              { value: "byo", label: "BYO autorisé" },
              { value: "allowed", label: "Autorisé" },
            ]}
          />
          <SelectField
            label="Séparation H/F"
            value={draft.genderSeparation}
            onChange={(v) => set("genderSeparation", v as Venue["genderSeparation"])}
            options={[
              { value: "mixed", label: "Mixte" },
              { value: "separable", label: "Séparable" },
              { value: "strict", label: "Stricte" },
            ]}
          />
          <SelectField
            label="Choix du traiteur"
            value={draft.traiteurPolicy}
            onChange={(v) => set("traiteurPolicy", v as Venue["traiteurPolicy"])}
            options={[
              { value: "free_choice", label: "Libre" },
              { value: "imposed_list", label: "Liste imposée" },
              { value: "in_house", label: "Traiteur interne" },
            ]}
          />
          <Field label="Places de parking">
            <input
              type="number"
              value={draft.parkingSpaces ?? ""}
              onChange={(e) =>
                set("parkingSpaces", e.target.value === "" ? null : Number(e.target.value))
              }
              placeholder="Laisser vide si inconnu"
              className="w-full rounded-lg border border-hairline bg-card px-3 py-2.5 text-sm outline-none focus:border-ink"
            />
          </Field>
          <Field label="Couvre-feu semaine">
            <input
              type="time"
              value={draft.noiseCurfewWeekday ?? ""}
              onChange={(e) =>
                set("noiseCurfewWeekday", e.target.value === "" ? null : e.target.value)
              }
              className="w-full rounded-lg border border-hairline bg-card px-3 py-2.5 text-sm outline-none focus:border-ink"
            />
          </Field>
          <Field label="Couvre-feu weekend">
            <input
              type="time"
              value={draft.noiseCurfewWeekend ?? ""}
              onChange={(e) =>
                set("noiseCurfewWeekend", e.target.value === "" ? null : e.target.value)
              }
              placeholder="Vide = pas de limite"
              className="w-full rounded-lg border border-hairline bg-card px-3 py-2.5 text-sm outline-none focus:border-ink"
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
          <CheckboxTile
            label="Salle de prière"
            checked={draft.prayerArea}
            onChange={(v) => set("prayerArea", v)}
          />
          <CheckboxTile
            label="Ablutions (wudu)"
            checked={draft.wuduFacilities}
            onChange={(v) => set("wuduFacilities", v)}
          />
          <CheckboxTile
            label="Scène disponible"
            checked={draft.stageAvailable}
            onChange={(v) => set("stageAvailable", v)}
          />
          <CheckboxTile
            label="Traiteur halal uniquement"
            checked={draft.halalOnlyTraiteur}
            onChange={(v) => set("halalOnlyTraiteur", v)}
          />
          <CheckboxTile
            label="Personnel féminin"
            checked={draft.femaleStaffAvailable}
            onChange={(v) => set("femaleStaffAvailable", v)}
          />
        </div>
      </Section>

      {/* Bottom actions */}
      <div className="sticky bottom-0 -mx-8 px-8 py-4 border-t border-hairline bg-card flex items-center justify-between">
        <a
          href="/salles/salle-al-andalous"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-ink-muted hover:text-ink"
        >
          <Eye className="h-4 w-4" />
          Aperçu public
        </a>
        <button
          type="button"
          onClick={save}
          disabled={!dirty}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors",
            dirty
              ? "bg-garnet text-white hover:bg-garnet-hover"
              : "bg-surface-muted text-ink-muted cursor-not-allowed",
          )}
        >
          <Save className="h-4 w-4" />
          Enregistrer
        </button>
      </div>
    </div>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-hairline bg-card p-6 space-y-4">
      <header>
        <h2 className="font-serif text-lg text-ink">{title}</h2>
        {hint && <p className="text-xs text-ink-muted mt-0.5">{hint}</p>}
      </header>
      <div className="space-y-4">{children}</div>
    </section>
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

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <Field label={label}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-hairline bg-card px-3 py-2.5 text-sm outline-none focus:border-ink"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

function CheckboxTile({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      className={cn(
        "rounded-lg border px-3 py-2.5 text-sm font-medium text-left transition-colors",
        checked ? "border-garnet bg-garnet-soft text-garnet" : "border-hairline bg-card text-ink hover:border-hairline-strong",
      )}
    >
      {label}
    </button>
  );
}
