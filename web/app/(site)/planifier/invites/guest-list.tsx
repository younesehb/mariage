"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Users,
  Plus,
  Search,
  Trash2,
  Check,
  X as XIcon,
  HelpCircle,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  emptyPlan,
  guestTotals,
  loadPlan,
  savePlan,
  type Guest,
  type GuestMeal,
  type GuestSide,
  type RsvpStatus,
  type WeddingPlan,
} from "@/lib/planner";
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog";
import { HelpCallout } from "@/components/help-callout";

type FilterSide = "all" | GuestSide;
type FilterStatus = "all" | RsvpStatus;

const RSVP_LABEL: Record<RsvpStatus, string> = {
  yes: "Confirmé",
  no: "Décliné",
  maybe: "Peut-être",
  pending: "En attente",
};

const RSVP_TONE: Record<RsvpStatus, string> = {
  yes: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  no: "bg-garnet/10 text-garnet border-garnet/20",
  maybe: "bg-amber-500/10 text-amber-700 border-amber-500/20",
  pending: "bg-surface-muted text-ink-muted border-hairline",
};

const SIDE_LABEL: Record<GuestSide, string> = {
  bride: "Mariée",
  groom: "Marié",
  shared: "Partagé",
};

const MEAL_LABEL: Record<GuestMeal, string> = {
  standard: "Standard",
  vegetarian: "Végétarien",
  child: "Enfant",
};

function genId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `g-${crypto.randomUUID()}`;
  }
  return `g-${Math.random().toString(36).slice(2, 10)}`;
}

export function GuestList() {
  const [plan, setPlan] = useState<WeddingPlan | null>(null);
  const [query, setQuery] = useState("");
  const [filterSide, setFilterSide] = useState<FilterSide>("all");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [removeId, setRemoveId] = useState<string | null>(null);

  useEffect(() => {
    setPlan(loadPlan() ?? emptyPlan());
  }, []);

  function update(next: WeddingPlan) {
    setPlan(next);
    savePlan(next);
  }

  function addGuest() {
    if (!plan) return;
    const g: Guest = {
      id: genId(),
      fullName: "",
      side: "shared",
      rsvp: "pending",
      days: { day1: true, day2: plan.days === 2 },
      meal: "standard",
      plusOne: 0,
    };
    update({ ...plan, guests: [g, ...plan.guests] });
  }

  function patchGuest(id: string, patch: Partial<Guest>) {
    if (!plan) return;
    update({
      ...plan,
      guests: plan.guests.map((g) => (g.id === id ? { ...g, ...patch } : g)),
    });
  }

  function removeGuest(id: string) {
    if (!plan) return;
    update({ ...plan, guests: plan.guests.filter((g) => g.id !== id) });
  }

  const totals = useMemo(() => (plan ? guestTotals(plan) : null), [plan]);

  const filtered = useMemo(() => {
    if (!plan) return [];
    const q = query.trim().toLowerCase();
    return plan.guests.filter((g) => {
      if (filterSide !== "all" && g.side !== filterSide) return false;
      if (filterStatus !== "all" && g.rsvp !== filterStatus) return false;
      if (q && !(g.fullName.toLowerCase().includes(q) || (g.group ?? "").toLowerCase().includes(q))) return false;
      return true;
    });
  }, [plan, query, filterSide, filterStatus]);

  if (!plan || !totals) {
    return (
      <div className="mx-auto max-w-[1100px] px-4 md:px-8 py-12">
        <div className="h-8 w-40 bg-surface-muted animate-pulse rounded" />
      </div>
    );
  }

  const twoDays = plan.days === 2;

  return (
    <div className="mx-auto max-w-[1100px] px-4 md:px-8 py-8 md:py-12">
      <Link
        href="/planifier"
        className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink mb-6"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
        Retour au plan
      </Link>

      <header className="mb-6">
        <div className="inline-flex items-center gap-2 rounded-pill bg-garnet/10 px-3 py-1 text-xs font-semibold text-garnet mb-3">
          <Users className="h-3.5 w-3.5" strokeWidth={2} />
          Invités & RSVP
        </div>
        <h1 className="font-serif text-3xl md:text-4xl text-ink">Liste d'invités</h1>
        <p className="mt-2 max-w-2xl text-ink-muted">
          Ajoutez vos invités, suivez les réponses, et confirmez les jours de présence. Les
          totaux sont comparés automatiquement à votre capacité prévue.
        </p>
      </header>

      <HelpCallout
        storageKey="invites"
        intro="Une ligne = une personne ou un foyer."
        steps={[
          {
            title: "Ajoutez chaque invité",
            body: "Nom + groupe (famille, amis Anvers…). Utilisez « +1 » pour les accompagnants qui n'ont pas besoin d'une ligne à part.",
          },
          {
            title: "RSVP en un clic",
            body: "✓ = confirmé, ? = peut-être, ✗ = décliné. Un second clic revient à « En attente ».",
          },
          {
            title: "Jour 1 / Jour 2",
            body: "Si votre mariage est sur 2 jours, indiquez qui vient quand. Les labels suivent vos paramètres (Hommes/Femmes ou neutres).",
          },
          {
            title: "Repas",
            body: "Standard / Végétarien / Enfant. Le récap du bas vous aide à briefer votre traiteur.",
          },
        ]}
        className="mb-6"
      />

      {/* Stats */}
      <section aria-label="Statistiques" className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total invités" value={totals.invited} sub={`${plan.guests.length} entrées`} />
        <StatCard
          label={twoDays ? "Confirmés jour 1" : "Confirmés"}
          value={totals.day1}
          sub={`/${plan.guestsPrimary} prévu`}
          over={totals.day1 > plan.guestsPrimary}
        />
        {twoDays && (
          <StatCard
            label="Confirmés jour 2"
            value={totals.day2}
            sub={`/${plan.guestsSecondary} prévu`}
            over={totals.day2 > plan.guestsSecondary}
          />
        )}
        <StatCard label="En attente" value={totals.pending} tone="muted" />
        {!twoDays && <StatCard label="Peut-être" value={totals.maybe} tone="muted" />}
      </section>

      {/* Meal breakdown — only if there are any confirmed */}
      {totals.yes > 0 && (
        <section
          aria-label="Répartition repas"
          className="mb-6 rounded-xl border border-hairline bg-card p-4"
        >
          <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted mb-2">
            Répartition des repas (confirmés)
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            <MealChip label="Standard" count={totals.meals.standard} />
            <MealChip label="Végétarien" count={totals.meals.vegetarian} />
            <MealChip label="Enfant" count={totals.meals.child} />
          </div>
        </section>
      )}

      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-hairline bg-card p-3">
        <label className="flex items-center gap-2 rounded-lg border border-hairline bg-surface-muted/40 px-3 py-1.5 flex-1 min-w-[200px]">
          <Search className="h-4 w-4 text-ink-muted" strokeWidth={1.75} />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un invité"
            className="flex-1 bg-transparent text-sm outline-none"
            aria-label="Rechercher un invité"
          />
        </label>
        <SelectPill
          icon={<Filter className="h-3.5 w-3.5" strokeWidth={1.75} />}
          value={filterSide}
          onChange={(v) => setFilterSide(v as FilterSide)}
          options={[
            { value: "all", label: "Tous" },
            { value: "bride", label: "Côté mariée" },
            { value: "groom", label: "Côté marié" },
            { value: "shared", label: "Partagé" },
          ]}
          aria-label="Filtrer par côté"
        />
        <SelectPill
          value={filterStatus}
          onChange={(v) => setFilterStatus(v as FilterStatus)}
          options={[
            { value: "all", label: "Tous statuts" },
            { value: "yes", label: "Confirmés" },
            { value: "maybe", label: "Peut-être" },
            { value: "no", label: "Déclinés" },
            { value: "pending", label: "En attente" },
          ]}
          aria-label="Filtrer par statut"
        />
        <button
          type="button"
          onClick={addGuest}
          className="ml-auto inline-flex items-center gap-1.5 rounded-pill bg-garnet px-4 py-2 text-sm font-semibold text-white hover:bg-garnet-hover"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Ajouter
        </button>
      </div>

      {/* List */}
      {plan.guests.length === 0 ? (
        <EmptyState onAdd={addGuest} />
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-sm text-ink-muted">
          Aucun invité ne correspond aux filtres.
        </div>
      ) : (
        <ul className="space-y-2">
          {filtered.map((g) => (
            <li key={g.id}>
              <GuestRow
                guest={g}
                twoDays={twoDays}
                dayLabeling={plan.dayLabeling}
                onChange={(patch) => patchGuest(g.id, patch)}
                onRemove={() => setRemoveId(g.id)}
              />
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={removeId != null}
        onOpenChange={(v) => !v && setRemoveId(null)}
        title="Retirer cet invité ?"
        description="L'invité et ses informations de RSVP seront supprimés de votre liste."
        confirmLabel="Retirer"
        tone="destructive"
        icon={<Trash2 className="h-4 w-4" strokeWidth={1.75} />}
        onConfirm={() => removeId && removeGuest(removeId)}
      />

      <p className="mt-6 text-xs text-ink-muted">
        Enregistré localement dans votre navigateur. Créez un{" "}
        <Link href="/inscription" className="underline underline-offset-4 text-ink">
          compte
        </Link>{" "}
        pour synchroniser et envoyer les invitations.
      </p>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  tone = "default",
  over = false,
}: {
  label: string;
  value: number;
  sub?: string;
  tone?: "default" | "muted";
  over?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        over ? "border-garnet/40 bg-garnet/5" : "border-hairline bg-card",
      )}
    >
      <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">{label}</div>
      <div className={cn("mt-1 font-serif text-3xl", tone === "muted" ? "text-ink-muted" : "text-ink", over && "text-garnet")}>
        {value}
      </div>
      {sub && <div className="text-xs text-ink-muted">{sub}</div>}
    </div>
  );
}

function MealChip({ label, count }: { label: string; count: number }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-pill border border-hairline bg-surface-muted/40 px-3 py-1 text-sm">
      <span className="font-medium text-ink">{count}</span>
      <span className="text-ink-muted">{label}</span>
    </span>
  );
}

function SelectPill<T extends string>({
  value,
  onChange,
  options,
  icon,
  ...rest
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  icon?: React.ReactNode;
} & React.AriaAttributes) {
  return (
    <label className="inline-flex items-center gap-1.5 rounded-lg border border-hairline bg-card px-3 py-1.5 text-sm">
      {icon}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="bg-transparent text-sm outline-none pr-2"
        {...rest}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function GuestRow({
  guest,
  twoDays,
  dayLabeling,
  onChange,
  onRemove,
}: {
  guest: Guest;
  twoDays: boolean;
  dayLabeling: "neutral" | "men_women";
  onChange: (patch: Partial<Guest>) => void;
  onRemove: () => void;
}) {
  const day1Label = dayLabeling === "men_women" ? "Hommes" : "Jour 1";
  const day2Label = dayLabeling === "men_women" ? "Femmes" : "Jour 2";

  return (
    <div className="rounded-xl border border-hairline bg-card p-3 md:p-4">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_auto_auto] md:items-center">
        <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_140px]">
          <input
            type="text"
            value={guest.fullName}
            onChange={(e) => onChange({ fullName: e.target.value })}
            placeholder="Prénom Nom"
            className="rounded-lg border border-hairline bg-surface-muted/30 px-3 py-2 text-sm text-ink outline-none focus:border-ink"
            aria-label="Nom complet"
          />
          <input
            type="text"
            value={guest.group ?? ""}
            onChange={(e) => onChange({ group: e.target.value || undefined })}
            placeholder="Groupe (famille, amis…)"
            className="rounded-lg border border-hairline bg-surface-muted/30 px-3 py-2 text-sm text-ink-muted outline-none focus:border-ink"
            aria-label="Groupe"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <RsvpPicker value={guest.rsvp} onChange={(rsvp) => onChange({ rsvp })} />
          <select
            value={guest.side}
            onChange={(e) => onChange({ side: e.target.value as GuestSide })}
            className="rounded-lg border border-hairline bg-card px-2.5 py-1.5 text-xs text-ink outline-none"
            aria-label="Côté"
          >
            <option value="bride">{SIDE_LABEL.bride}</option>
            <option value="groom">{SIDE_LABEL.groom}</option>
            <option value="shared">{SIDE_LABEL.shared}</option>
          </select>
          <select
            value={guest.meal}
            onChange={(e) => onChange({ meal: e.target.value as GuestMeal })}
            className="rounded-lg border border-hairline bg-card px-2.5 py-1.5 text-xs text-ink outline-none"
            aria-label="Repas"
          >
            <option value="standard">{MEAL_LABEL.standard}</option>
            <option value="vegetarian">{MEAL_LABEL.vegetarian}</option>
            <option value="child">{MEAL_LABEL.child}</option>
          </select>
          <label className="inline-flex items-center gap-1 rounded-lg border border-hairline bg-card px-2 py-1 text-xs text-ink-muted">
            <span>+1</span>
            <input
              type="number"
              min={0}
              max={10}
              value={guest.plusOne}
              onChange={(e) => onChange({ plusOne: Math.max(0, Number(e.target.value) || 0) })}
              className="w-10 bg-transparent text-right text-xs font-medium text-ink outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              aria-label="Accompagnants"
            />
          </label>
        </div>

        <div className="flex items-center gap-1.5">
          <DayToggle
            label={day1Label}
            active={guest.days.day1}
            onChange={(v) => onChange({ days: { ...guest.days, day1: v } })}
          />
          {twoDays && (
            <DayToggle
              label={day2Label}
              active={guest.days.day2}
              onChange={(v) => onChange({ days: { ...guest.days, day2: v } })}
            />
          )}
        </div>

        <button
          type="button"
          onClick={onRemove}
          aria-label="Supprimer l'invité"
          className="justify-self-end rounded-lg p-2 text-ink-muted hover:bg-surface-muted hover:text-garnet"
        >
          <Trash2 className="h-4 w-4" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}

function RsvpPicker({ value, onChange }: { value: RsvpStatus; onChange: (v: RsvpStatus) => void }) {
  const options: { v: RsvpStatus; icon: React.ReactNode }[] = [
    { v: "yes", icon: <Check className="h-3.5 w-3.5" strokeWidth={2} /> },
    { v: "maybe", icon: <HelpCircle className="h-3.5 w-3.5" strokeWidth={2} /> },
    { v: "no", icon: <XIcon className="h-3.5 w-3.5" strokeWidth={2} /> },
  ];
  return (
    <div
      role="radiogroup"
      aria-label="Statut RSVP"
      className="inline-flex rounded-pill border border-hairline bg-card p-0.5"
    >
      {options.map((o) => (
        <button
          key={o.v}
          type="button"
          role="radio"
          aria-checked={value === o.v}
          onClick={() => onChange(value === o.v ? "pending" : o.v)}
          title={RSVP_LABEL[o.v]}
          className={cn(
            "inline-flex items-center gap-1 rounded-pill px-2.5 py-1 text-xs font-medium transition-colors border",
            value === o.v ? RSVP_TONE[o.v] : "border-transparent text-ink-muted hover:text-ink",
          )}
        >
          {o.icon}
          <span className="hidden lg:inline">{RSVP_LABEL[o.v]}</span>
        </button>
      ))}
    </div>
  );
}

function DayToggle({
  label,
  active,
  onChange,
}: {
  label: string;
  active: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      onClick={() => onChange(!active)}
      className={cn(
        "rounded-pill border px-2.5 py-1 text-xs font-medium transition-colors",
        active
          ? "border-ink bg-ink text-surface"
          : "border-hairline bg-card text-ink-muted hover:border-ink-muted",
      )}
    >
      {label}
    </button>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-hairline bg-surface-muted/30 p-10 text-center">
      <Users className="mx-auto h-8 w-8 text-ink-muted" strokeWidth={1.25} />
      <h2 className="mt-3 font-serif text-xl text-ink">Commencez votre liste</h2>
      <p className="mt-1 text-sm text-ink-muted max-w-md mx-auto">
        Ajoutez vos proches un par un ou importez-les depuis une feuille Excel (bientôt).
      </p>
      <button
        type="button"
        onClick={onAdd}
        className="mt-4 inline-flex items-center gap-1.5 rounded-pill bg-garnet px-5 py-2.5 text-sm font-semibold text-white hover:bg-garnet-hover"
      >
        <Plus className="h-4 w-4" strokeWidth={2} />
        Ajouter mon premier invité
      </button>
    </div>
  );
}
