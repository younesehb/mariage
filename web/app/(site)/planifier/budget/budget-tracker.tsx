"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Wallet, Sparkles, RotateCcw, TrendingUp, TrendingDown, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { HelpCallout } from "@/components/help-callout";
import {
  allocateBudget,
  budgetTotals,
  DEFAULT_BUDGET_CATEGORIES,
  emptyPlan,
  loadPlan,
  savePlan,
  type BudgetCategory,
  type WeddingPlan,
} from "@/lib/planner";

const PRESETS = [15000, 25000, 40000, 60000, 100000];

function fmt(n: number): string {
  return new Intl.NumberFormat("fr-BE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

export function BudgetTracker() {
  const [plan, setPlan] = useState<WeddingPlan | null>(null);

  useEffect(() => {
    const loaded = loadPlan();
    if (loaded) {
      // Migrate: ensure every default category exists.
      const existing = new Map(loaded.budgetCategories.map((c) => [c.key, c]));
      const merged = DEFAULT_BUDGET_CATEGORIES.map((c) => {
        const found = existing.get(c.key);
        return found ? found : { ...c, planned: 0, spent: 0 };
      });
      setPlan({ ...loaded, budgetCategories: merged });
    } else {
      setPlan(emptyPlan());
    }
  }, []);

  const totals = useMemo(() => (plan ? budgetTotals(plan) : null), [plan]);

  function update(next: WeddingPlan) {
    setPlan(next);
    savePlan(next);
  }

  function setTotal(total: number) {
    if (!plan) return;
    update({ ...plan, budgetTotal: Math.max(0, total) });
  }

  function autoAllocate() {
    if (!plan) return;
    if (plan.budgetTotal <= 0) return;
    update({ ...plan, budgetCategories: allocateBudget(plan.budgetTotal) });
  }

  function resetAllocations() {
    if (!plan) return;
    update({
      ...plan,
      budgetCategories: plan.budgetCategories.map((c) => ({ ...c, planned: 0, spent: 0 })),
    });
  }

  function updateCategory(key: string, patch: Partial<BudgetCategory>) {
    if (!plan) return;
    update({
      ...plan,
      budgetCategories: plan.budgetCategories.map((c) => (c.key === key ? { ...c, ...patch } : c)),
    });
  }

  if (!plan || !totals) {
    return (
      <div className="mx-auto max-w-[1100px] px-4 md:px-8 py-12">
        <div className="h-8 w-40 bg-surface-muted animate-pulse rounded" />
      </div>
    );
  }

  const totalSet = plan.budgetTotal > 0;
  const plannedPct = totalSet ? Math.min(100, Math.round((totals.planned / plan.budgetTotal) * 100)) : 0;
  const spentPct = totalSet ? Math.min(100, Math.round((totals.spent / plan.budgetTotal) * 100)) : 0;

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
          <Wallet className="h-3.5 w-3.5" strokeWidth={2} />
          Budget
        </div>
        <h1 className="font-serif text-3xl md:text-4xl text-ink">Votre budget mariage</h1>
        <p className="mt-2 max-w-2xl text-ink-muted">
          Définissez une enveloppe globale, répartissez-la par poste, puis suivez vos
          dépenses réelles. Tout reste dans votre navigateur.
        </p>
      </header>

      <HelpCallout
        storageKey="budget"
        intro="Suivez votre budget en trois gestes."
        steps={[
          {
            title: "Fixez une enveloppe",
            body: "Le total que vous ne voulez pas dépasser. Utilisez les préréglages (15k, 25k…) ou saisissez un montant.",
          },
          {
            title: "Répartition suggérée",
            body: "Un clic allocue l'enveloppe selon les ratios habituels : 30% traiteur, 25% salle, etc. Ajustez librement après.",
          },
          {
            title: "Suivez les dépenses",
            body: "Pour chaque poste, renseignez « Prévu » puis « Dépensé ». Les barres vous alertent si vous dépassez.",
          },
        ]}
        className="mb-6"
      />

      {/* Total + summary */}
      <section
        aria-label="Enveloppe totale"
        className="rounded-2xl border border-hairline bg-card p-5 md:p-6"
      >
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <label className="block">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                Enveloppe totale
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-ink-muted">€</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={500}
                  value={plan.budgetTotal || ""}
                  onChange={(e) => setTotal(Number(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full bg-transparent font-serif text-4xl md:text-5xl text-ink outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  aria-label="Enveloppe totale"
                />
              </div>
            </label>
            <div className="mt-3 flex flex-wrap gap-2">
              {PRESETS.map((p) => {
                const active = plan.budgetTotal === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setTotal(p)}
                    className={cn(
                      "rounded-pill border px-3 py-1 text-xs font-medium transition-colors",
                      active
                        ? "border-ink bg-ink text-surface"
                        : "border-hairline bg-card text-ink hover:border-ink-muted",
                    )}
                  >
                    {fmt(p)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col justify-between gap-4">
            <div className="space-y-3">
              <Gauge
                label="Réparti"
                sub={totalSet ? `${plannedPct}%` : "—"}
                value={totals.planned}
                of={plan.budgetTotal}
                tone="planned"
              />
              <Gauge
                label="Dépensé"
                sub={totalSet ? `${spentPct}%` : "—"}
                value={totals.spent}
                of={plan.budgetTotal}
                tone="spent"
              />
              <div className="flex items-center justify-between pt-2 border-t border-hairline text-sm">
                <span className="text-ink-muted">Reste disponible</span>
                <span className="font-semibold text-ink tabular-nums">
                  {totalSet ? fmt(totals.remaining) : "—"}
                </span>
              </div>
              {totals.overAllocated > 0 && (
                <p className="flex items-center gap-1.5 text-xs text-garnet">
                  <TrendingUp className="h-3.5 w-3.5" strokeWidth={2} />
                  {fmt(totals.overAllocated)} au-delà de l'enveloppe
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={autoAllocate}
                disabled={!totalSet}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-pill bg-garnet px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-garnet-hover",
                  !totalSet && "opacity-50 cursor-not-allowed",
                )}
              >
                <Sparkles className="h-4 w-4" strokeWidth={2} />
                Répartition suggérée
              </button>
              <button
                type="button"
                onClick={resetAllocations}
                className="inline-flex items-center gap-1.5 rounded-pill border border-hairline bg-card px-4 py-2 text-sm font-medium text-ink hover:border-ink-muted"
              >
                <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
                Réinitialiser
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Category rows */}
      <section aria-label="Postes de dépense" className="mt-8 space-y-3">
        {plan.budgetCategories.map((c) => (
          <CategoryRow
            key={c.key}
            category={c}
            onChange={(patch) => updateCategory(c.key, patch)}
            total={plan.budgetTotal}
          />
        ))}
      </section>

      <p className="mt-6 text-xs text-ink-muted">
        Les chiffres sont enregistrés localement dans votre navigateur. Créez un{" "}
        <Link href="/inscription" className="underline underline-offset-4 text-ink">
          compte
        </Link>{" "}
        pour les synchroniser sur tous vos appareils.
      </p>
    </div>
  );
}

function Gauge({
  label,
  sub,
  value,
  of,
  tone,
}: {
  label: string;
  sub: string;
  value: number;
  of: number;
  tone: "planned" | "spent";
}) {
  const pct = of > 0 ? Math.min(100, (value / of) * 100) : 0;
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-ink-muted">{label}</span>
        <span className="text-ink font-medium tabular-nums">
          {fmt(value)} <span className="text-xs text-ink-muted">· {sub}</span>
        </span>
      </div>
      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-surface-muted">
        <div
          className={cn(
            "h-full transition-all",
            tone === "planned" ? "bg-ink" : "bg-garnet",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function CategoryRow({
  category,
  onChange,
  total,
}: {
  category: BudgetCategory;
  onChange: (patch: Partial<BudgetCategory>) => void;
  total: number;
}) {
  const over = category.spent > category.planned && category.planned > 0;
  const plannedPct = total > 0 ? Math.min(100, (category.planned / total) * 100) : 0;
  const spentPct = category.planned > 0 ? Math.min(100, (category.spent / category.planned) * 100) : 0;

  return (
    <div className="rounded-xl border border-hairline bg-card p-4 md:p-5">
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-center">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-ink">{category.label}</h3>
            {over && (
              <span className="inline-flex items-center gap-1 rounded-pill bg-garnet/10 px-2 py-0.5 text-[10px] font-semibold text-garnet">
                <TrendingUp className="h-3 w-3" strokeWidth={2} />
                Dépassé
              </span>
            )}
            {!over && category.spent > 0 && category.spent < category.planned && (
              <span className="inline-flex items-center gap-1 rounded-pill bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                <TrendingDown className="h-3 w-3" strokeWidth={2} />
                Sous budget
              </span>
            )}
          </div>

          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
            <div
              className="h-full bg-ink/80"
              style={{ width: `${plannedPct}%` }}
              aria-label={`Part du budget total : ${Math.round(plannedPct)}%`}
            />
          </div>
          {category.planned > 0 && (
            <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-surface-muted">
              <div
                className={cn("h-full", over ? "bg-garnet" : "bg-emerald-500")}
                style={{ width: `${spentPct}%` }}
                aria-label={`Dépensé : ${Math.round(spentPct)}% du budget alloué`}
              />
            </div>
          )}
        </div>

        <AmountInput
          label="Prévu"
          value={category.planned}
          onChange={(v) => onChange({ planned: Math.max(0, v) })}
        />
        <AmountInput
          label="Dépensé"
          value={category.spent}
          onChange={(v) => onChange({ spent: Math.max(0, v) })}
          tone={over ? "danger" : "neutral"}
        />
      </div>
    </div>
  );
}

function AmountInput({
  label,
  value,
  onChange,
  tone = "neutral",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  tone?: "neutral" | "danger";
}) {
  return (
    <label className="flex flex-col">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
        {label}
      </span>
      <div
        className={cn(
          "mt-1 inline-flex items-center gap-1 rounded-lg border bg-card px-2 py-1.5",
          tone === "danger" ? "border-garnet/50" : "border-hairline",
        )}
      >
        <button
          type="button"
          aria-label={`Diminuer ${label}`}
          onClick={() => onChange(Math.max(0, value - 500))}
          className="p-1 text-ink-muted hover:text-ink"
        >
          <Minus className="h-3.5 w-3.5" strokeWidth={1.75} />
        </button>
        <span className="text-ink-muted text-xs">€</span>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          step={100}
          value={value || ""}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          placeholder="0"
          className="w-20 bg-transparent text-right text-sm font-medium text-ink outline-none tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          aria-label={label}
        />
        <button
          type="button"
          aria-label={`Augmenter ${label}`}
          onClick={() => onChange(value + 500)}
          className="p-1 text-ink-muted hover:text-ink"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={1.75} />
        </button>
      </div>
    </label>
  );
}
