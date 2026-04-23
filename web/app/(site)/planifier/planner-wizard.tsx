"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  Heart,
  Users,
  Sparkles,
  Download,
  ExternalLink,
  ChevronRight,
  Trash2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  emptyPlan,
  loadPlan,
  savePlan,
  daysUntil,
  planCompleteness,
  type WeddingPlan,
  type PickKey,
  type PickValue,
} from "@/lib/planner";
import { venues, vendors, venueToListing, vendorToListing } from "@/lib/fixtures";
import { CATEGORIES } from "@/lib/category-meta";
import type { VendorCategory, Venue, Vendor } from "@/lib/types";

interface StepDef {
  id: number;
  key: string;
  label: string;
  tagline: string;
  icon: LucideIcon;
}

const STEPS: StepDef[] = [
  { id: 0, key: "vous", label: "Vous", tagline: "Vos noms et la date du grand jour", icon: Heart },
  { id: 1, key: "cadre", label: "Le cadre", tagline: "Un jour ou deux, combien d'invités, quel style", icon: Users },
  { id: 2, key: "salle", label: "La salle", tagline: "Où se déroulera votre célébration", icon: CATEGORIES.traiteur.icon },
  { id: 3, key: "traiteur", label: "Le traiteur", tagline: "Couscous, tajine, pastilla — tout ce qui ravira", icon: CATEGORIES.traiteur.icon },
  { id: 4, key: "ambiance", label: "Décor & ambiance", tagline: "Ziana et nachid pour l'atmosphère", icon: CATEGORIES.ziana.icon },
  { id: 5, key: "mariee", label: "La mariée", tagline: "Tayyaba, hennaya, négafa", icon: CATEGORIES.tayyaba.icon },
  { id: 6, key: "memoires", label: "Immortaliser", tagline: "Photographe et vidéaste", icon: CATEGORIES.photographer.icon },
  { id: 7, key: "recap", label: "Récapitulatif", tagline: "Tout est prêt ?", icon: Sparkles },
];

export function PlannerWizard() {
  const [plan, setPlan] = useState<WeddingPlan>(emptyPlan);
  const [step, setStep] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // Hydrate from localStorage once
  useEffect(() => {
    const existing = loadPlan();
    if (existing) setPlan(existing);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) savePlan(plan);
  }, [plan, loaded]);

  const update = <K extends keyof WeddingPlan>(key: K, value: WeddingPlan[K]) => {
    setPlan((p) => ({ ...p, [key]: value }));
  };

  const setPick = (k: PickKey, v: PickValue) => {
    setPlan((p) => ({ ...p, picks: { ...p.picks, [k]: v } }));
  };

  const markComplete = (n: number) => {
    setPlan((p) => ({
      ...p,
      completedSteps: Array.from(new Set([...(p.completedSteps ?? []), n])),
    }));
  };

  const next = () => {
    markComplete(step);
    if (step < STEPS.length - 1) setStep((s) => s + 1);
  };

  const back = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const { percent } = planCompleteness(plan);
  const countdown = daysUntil(plan.weddingDate);

  function resetPlan() {
    if (typeof window === "undefined") return;
    if (!window.confirm("Effacer tout le plan et recommencer ?")) return;
    const fresh = emptyPlan();
    setPlan(fresh);
    setStep(0);
    toast.success("Plan réinitialisé");
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-surface via-surface to-garnet-soft/30">
      <div className="mx-auto max-w-[1280px] px-4 md:px-8 py-6 md:py-10 grid md:grid-cols-[280px_1fr] gap-8 md:gap-12">
        {/* Sidebar progress */}
        <aside className="md:sticky md:top-24 md:self-start space-y-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-garnet font-semibold">
              Assistant
            </div>
            <h1 className="mt-1 font-serif text-3xl text-ink leading-tight">
              Planifier mon mariage
            </h1>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Progression
              </span>
              <span className="font-serif text-lg text-ink">{percent}%</span>
            </div>
            <div className="h-2 rounded-full bg-hairline overflow-hidden">
              <div
                className="h-full bg-garnet transition-all duration-700 ease-out"
                style={{ width: `${percent}%` }}
              />
            </div>
            {countdown != null && (
              <p className="mt-2 text-xs text-ink-muted">
                {countdown > 0
                  ? `J-${countdown} avant le grand jour`
                  : countdown === 0
                    ? "C'est aujourd'hui 🎉"
                    : "Post-mariage"}
              </p>
            )}
          </div>

          {/* Step list */}
          <nav aria-label="Étapes">
            <ul className="space-y-1">
              {STEPS.map((s) => {
                const done = plan.completedSteps.includes(s.id);
                const active = step === s.id;
                const Icon = s.icon;
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => setStep(s.id)}
                      className={cn(
                        "group w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                        active
                          ? "bg-ink text-surface"
                          : "text-ink-muted hover:bg-surface-muted hover:text-ink",
                      )}
                    >
                      <span
                        className={cn(
                          "relative inline-grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-all",
                          active
                            ? "border-surface/40 bg-surface/15"
                            : done
                              ? "border-garnet bg-garnet text-white"
                              : "border-hairline bg-card text-ink-muted",
                        )}
                        aria-hidden
                      >
                        {done ? (
                          <Check className="h-3.5 w-3.5 animate-in zoom-in duration-300" strokeWidth={2.5} />
                        ) : (
                          <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={cn("block font-medium", active ? "text-surface" : "text-ink")}>
                          {s.label}
                        </span>
                        <span
                          className={cn(
                            "block text-[11px] truncate",
                            active ? "text-surface/70" : "text-ink-muted",
                          )}
                        >
                          {s.tagline}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <button
            type="button"
            onClick={resetPlan}
            className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-error transition-colors"
          >
            <Trash2 className="h-3 w-3" strokeWidth={1.5} />
            Recommencer à zéro
          </button>
        </aside>

        {/* Main step area */}
        <main className="min-w-0">
          <div
            key={step}
            className="animate-in fade-in slide-in-from-bottom-6 duration-500"
          >
            {step === 0 && <StepVous plan={plan} update={update} />}
            {step === 1 && <StepCadre plan={plan} update={update} />}
            {step === 2 && <StepVenue plan={plan} setPick={setPick} />}
            {step === 3 && <StepVendorCategory plan={plan} setPick={setPick} category="traiteur" />}
            {step === 4 && <StepAmbiance plan={plan} setPick={setPick} />}
            {step === 5 && <StepMariee plan={plan} setPick={setPick} />}
            {step === 6 && <StepMedia plan={plan} setPick={setPick} />}
            {step === 7 && <StepRecap plan={plan} goToStep={setStep} />}
          </div>

          {/* Nav */}
          {step < STEPS.length - 1 ? (
            <div className="mt-10 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={back}
                disabled={step === 0}
                className={cn(
                  "inline-flex items-center gap-1.5 text-sm font-medium",
                  step === 0 ? "text-ink-muted/40 cursor-not-allowed" : "text-ink hover:text-garnet",
                )}
              >
                <ArrowLeft className="h-4 w-4" />
                Retour
              </button>
              <button
                type="button"
                onClick={next}
                className="inline-flex items-center gap-2 rounded-pill bg-garnet text-white px-6 py-3 text-sm font-semibold hover:bg-garnet-hover transition-all hover:gap-3"
              >
                Continuer
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}

/* ===================== Step components ===================== */

function StepHeader({ eyebrow, title, tagline }: { eyebrow: string; title: string; tagline: string }) {
  return (
    <header className="mb-8">
      <div className="text-xs uppercase tracking-widest text-garnet font-semibold">{eyebrow}</div>
      <h2 className="mt-1 font-serif text-4xl md:text-5xl leading-[1.05] text-ink">
        {title}
      </h2>
      <p className="mt-3 text-base md:text-lg text-ink/80 max-w-xl leading-relaxed">{tagline}</p>
    </header>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-hairline bg-card p-6 md:p-8", className)}>
      {children}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-ink mb-1.5">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink-muted">{hint}</span>}
    </label>
  );
}

function StepVous({
  plan,
  update,
}: {
  plan: WeddingPlan;
  update: <K extends keyof WeddingPlan>(k: K, v: WeddingPlan[K]) => void;
}) {
  return (
    <>
      <StepHeader
        eyebrow="Étape 1 sur 8"
        title="Faisons connaissance."
        tagline="Vos prénoms et la date envisagée pour personnaliser tout le reste — rien n'est définitif, vous pourrez modifier à tout moment."
      />
      <Card>
        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Votre prénom">
            <input
              value={plan.userName}
              onChange={(e) => update("userName", e.target.value)}
              placeholder="Hajar"
              autoFocus
              className="w-full rounded-lg border border-hairline bg-card px-4 py-3 text-base outline-none focus:border-ink"
            />
          </Field>
          <Field label="Son prénom">
            <input
              value={plan.partnerName}
              onChange={(e) => update("partnerName", e.target.value)}
              placeholder="Amine"
              className="w-full rounded-lg border border-hairline bg-card px-4 py-3 text-base outline-none focus:border-ink"
            />
          </Field>
          <Field label="Date envisagée" hint="Approximative — on ajustera plus tard">
            <div className="flex items-center gap-2 rounded-lg border border-hairline bg-card px-3 py-2.5 focus-within:border-ink">
              <Calendar className="h-4 w-4 text-ink-muted" strokeWidth={1.75} />
              <input
                type="date"
                value={plan.weddingDate ?? ""}
                onChange={(e) => update("weddingDate", e.target.value || null)}
                min={new Date().toISOString().slice(0, 10)}
                className="flex-1 bg-transparent text-base outline-none"
              />
            </div>
          </Field>
        </div>

        {plan.userName && plan.partnerName && (
          <div className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="rounded-xl bg-garnet-soft border border-garnet/20 p-5 font-serif">
              <span className="text-xs uppercase tracking-widest text-garnet font-semibold block mb-1">
                Votre mariage
              </span>
              <p className="text-2xl text-ink italic">
                {plan.userName} <span className="text-garnet not-italic">&</span> {plan.partnerName}
              </p>
            </div>
          </div>
        )}
      </Card>
    </>
  );
}

function StepCadre({
  plan,
  update,
}: {
  plan: WeddingPlan;
  update: <K extends keyof WeddingPlan>(k: K, v: WeddingPlan[K]) => void;
}) {
  return (
    <>
      <StepHeader
        eyebrow="Étape 2 sur 8"
        title="Le cadre de la fête."
        tagline="Un jour ou deux ? Combien d'invités ? Quel style ? Ces choix déterminent quelle salle et quel traiteur vous conviendront."
      />

      <div className="space-y-6">
        <Card>
          <div className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-3">
            Nombre de jours
          </div>
          <div className="grid grid-cols-2 gap-3">
            <ChoiceTile
              active={plan.days === 1}
              onClick={() => update("days", 1)}
              title="1 jour"
              sub="Célébration unique, hommes et femmes ensemble ou séparés"
            />
            <ChoiceTile
              active={plan.days === 2}
              onClick={() => update("days", 2)}
              title="2 jours (H + F)"
              sub="Jour des hommes et jour des femmes, distincts"
            />
          </div>
          {plan.days === 2 && (
            <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <Field label="Date du second jour" hint="Même jour (soirée/après-midi) ou autre week-end">
                <div className="flex items-center gap-2 rounded-lg border border-hairline bg-card px-3 py-2.5 focus-within:border-ink">
                  <Calendar className="h-4 w-4 text-ink-muted" strokeWidth={1.75} />
                  <input
                    type="date"
                    value={plan.secondaryDate ?? ""}
                    onChange={(e) => update("secondaryDate", e.target.value || null)}
                    min={plan.weddingDate ?? undefined}
                    className="flex-1 bg-transparent text-base outline-none"
                  />
                </div>
              </Field>
            </div>
          )}
        </Card>

        <Card>
          <div className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-3">
            {plan.days === 2 ? "Invités par jour" : "Nombre d'invités"}
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <GuestStepper
              label={plan.days === 2 ? "Côté hommes" : "Invités"}
              value={plan.guestsPrimary}
              onChange={(v) => update("guestsPrimary", v)}
            />
            {plan.days === 2 && (
              <GuestStepper
                label="Côté femmes"
                value={plan.guestsSecondary}
                onChange={(v) => update("guestsSecondary", v)}
              />
            )}
          </div>
        </Card>

        <Card>
          <div className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-3">
            Style du mariage
          </div>
          <div className="grid grid-cols-3 gap-3">
            {(
              [
                { value: "traditionnel", label: "Traditionnel", sub: "Caftan, nachid, zaffa" },
                { value: "moderne", label: "Moderne", sub: "Épuré, photo-first" },
                { value: "mixte", label: "Mixte", sub: "Le meilleur des deux" },
              ] as const
            ).map((o) => (
              <ChoiceTile
                key={o.value}
                active={plan.style === o.value}
                onClick={() => update("style", o.value)}
                title={o.label}
                sub={o.sub}
              />
            ))}
          </div>
        </Card>

        <Card>
          <div className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-3">
            Budget global indicatif
          </div>
          <div className="grid grid-cols-3 gap-3">
            {(
              [
                { v: "€", label: "Accessible", sub: "Jusqu'à 15 k€" },
                { v: "€€", label: "Confortable", sub: "15 à 30 k€" },
                { v: "€€€", label: "Premium", sub: "30 k€ et +" },
              ] as const
            ).map((o) => (
              <ChoiceTile
                key={o.v}
                active={plan.budget === o.v}
                onClick={() => update("budget", o.v)}
                title={`${o.v} · ${o.label}`}
                sub={o.sub}
              />
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

function StepVenue({
  plan,
  setPick,
}: {
  plan: WeddingPlan;
  setPick: (k: PickKey, v: PickValue) => void;
}) {
  const eligible = useMemo(() => {
    return venues
      .filter((v) => {
        if (plan.guestsPrimary > v.capacityMax) return false;
        if (plan.budget && v.priceTier !== plan.budget) {
          // soft: allow if one tier off
          const tiers = ["€", "€€", "€€€"];
          if (Math.abs(tiers.indexOf(v.priceTier) - tiers.indexOf(plan.budget)) > 1) {
            return false;
          }
        }
        return true;
      })
      .slice(0, 6);
  }, [plan.guestsPrimary, plan.budget]);

  const current = plan.picks.venue;

  return (
    <>
      <StepHeader
        eyebrow="Étape 3 sur 8"
        title="La salle de réception."
        tagline={`On vous a présélectionné les salles compatibles avec ${plan.guestsPrimary} invités${plan.budget ? ` et un budget ${plan.budget}` : ""}. Vous pouvez aussi explorer le catalogue complet.`}
      />

      {current?.kind === "picked" && (
        <SelectedCard
          title={current.name}
          onClear={() => setPick("venue", null)}
          href={`/salles/${current.slug}`}
        />
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {eligible.map((v) => (
          <PickableVenue
            key={v.id}
            venue={v}
            active={current?.kind === "picked" && current.id === v.id}
            onPick={() =>
              setPick("venue", { kind: "picked", id: v.id, slug: v.slug, name: v.name })
            }
          />
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-hairline bg-card p-5">
        <div>
          <div className="font-serif text-lg text-ink">Vous cherchez plus de choix ?</div>
          <p className="text-sm text-ink-muted">Explorez l&apos;ensemble du catalogue avec filtres et carte.</p>
        </div>
        <Link
          href={`/salles?ville=Bruxelles&invites=${plan.guestsPrimary}&jours=${plan.days}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-pill border border-hairline bg-card px-4 py-2 text-sm font-medium hover:border-ink"
        >
          Ouvrir le catalogue
          <ExternalLink className="h-4 w-4" strokeWidth={1.5} />
        </Link>
      </div>
    </>
  );
}

function StepVendorCategory({
  plan,
  setPick,
  category,
}: {
  plan: WeddingPlan;
  setPick: (k: PickKey, v: PickValue) => void;
  category: VendorCategory;
}) {
  const meta = CATEGORIES[category];
  const list = useMemo(
    () => vendors.filter((v) => v.category === category && v.status === "published").slice(0, 4),
    [category],
  );
  const current = plan.picks[category];
  const stepIdx = { traiteur: 4 }[category as "traiteur"] ?? null;

  return (
    <>
      <StepHeader
        eyebrow={stepIdx ? `Étape ${stepIdx} sur 8` : meta.labelFr}
        title={`${meta.labelFr} ?`}
        tagline={meta.descriptionFr}
      />

      {current?.kind === "picked" && (
        <SelectedCard
          title={current.name}
          onClear={() => setPick(category, null)}
          href={`/prestataires/${current.slug}`}
        />
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {list.map((v) => (
          <PickableVendor
            key={v.id}
            vendor={v}
            active={current?.kind === "picked" && current.id === v.id}
            onPick={() =>
              setPick(category, { kind: "picked", id: v.id, slug: v.slug, name: v.name, category })
            }
          />
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setPick(category, { kind: "skipped" })}
          className={cn(
            "rounded-pill border border-hairline bg-card px-4 py-2 text-sm font-medium transition-colors",
            current?.kind === "skipped" && "border-ink-muted bg-surface-muted",
          )}
        >
          {current?.kind === "skipped" ? "Étape ignorée ✓" : "Ignorer cette étape"}
        </button>
        <Link
          href={`/prestataires?cat=${category}`}
          target="_blank"
          className="inline-flex items-center gap-1 text-sm font-medium text-garnet hover:text-garnet-hover"
        >
          Voir tous les {meta.labelFr.toLowerCase()}s
          <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.5} />
        </Link>
      </div>
    </>
  );
}

function StepAmbiance({
  plan,
  setPick,
}: {
  plan: WeddingPlan;
  setPick: (k: PickKey, v: PickValue) => void;
}) {
  return (
    <>
      <StepHeader
        eyebrow="Étape 5 sur 8"
        title="Décor & ambiance."
        tagline="La ziana fait tout le décor (trône, arches, lumières). Le groupe nachid donne l'âme musicale à la cérémonie."
      />
      <div className="space-y-8">
        <MiniCategorySection plan={plan} setPick={setPick} category="ziana" />
        <MiniCategorySection plan={plan} setPick={setPick} category="nasheed" />
      </div>
    </>
  );
}

function StepMariee({
  plan,
  setPick,
}: {
  plan: WeddingPlan;
  setPick: (k: PickKey, v: PickValue) => void;
}) {
  return (
    <>
      <StepHeader
        eyebrow="Étape 6 sur 8"
        title="Autour de la mariée."
        tagline="La tayyaba coiffe et maquille, la hennaya pour la soirée du henné, la négafa pour les changements de tenues."
      />
      <div className="space-y-8">
        <MiniCategorySection plan={plan} setPick={setPick} category="tayyaba" />
        <MiniCategorySection plan={plan} setPick={setPick} category="hennaya" />
        <MiniCategorySection plan={plan} setPick={setPick} category="negafa" />
      </div>
    </>
  );
}

function StepMedia({
  plan,
  setPick,
}: {
  plan: WeddingPlan;
  setPick: (k: PickKey, v: PickValue) => void;
}) {
  return (
    <>
      <StepHeader
        eyebrow="Étape 7 sur 8"
        title="Garder le souvenir."
        tagline="Photographe pour l'album, vidéaste pour revivre le jour — les deux sont complémentaires."
      />
      <div className="space-y-8">
        <MiniCategorySection plan={plan} setPick={setPick} category="photographer" />
        <MiniCategorySection plan={plan} setPick={setPick} category="videographer" />
      </div>
    </>
  );
}

function MiniCategorySection({
  plan,
  setPick,
  category,
}: {
  plan: WeddingPlan;
  setPick: (k: PickKey, v: PickValue) => void;
  category: VendorCategory;
}) {
  const meta = CATEGORIES[category];
  const Icon = meta.icon;
  const list = vendors.filter((v) => v.category === category && v.status === "published").slice(0, 3);
  const current = plan.picks[category];

  return (
    <section className="rounded-2xl border border-hairline bg-card p-5 md:p-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <span className={cn("h-9 w-9 rounded-lg grid place-items-center", meta.tint)} aria-hidden>
            <Icon className={cn("h-4 w-4", meta.accentFg)} strokeWidth={1.75} />
          </span>
          <div>
            <h3 className="font-serif text-xl text-ink leading-tight">{meta.labelFr}</h3>
            <p className="text-xs text-ink-muted">{meta.taglineFr}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() =>
            setPick(category, current?.kind === "skipped" ? null : { kind: "skipped" })
          }
          className={cn(
            "text-xs font-medium text-ink-muted hover:text-ink transition-colors",
            current?.kind === "skipped" && "text-garnet",
          )}
        >
          {current?.kind === "skipped" ? "✓ ignoré" : "Ignorer"}
        </button>
      </div>
      {current?.kind !== "skipped" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {list.map((v) => (
            <MiniVendorTile
              key={v.id}
              vendor={v}
              active={current?.kind === "picked" && current.id === v.id}
              onPick={() =>
                setPick(category, { kind: "picked", id: v.id, slug: v.slug, name: v.name, category })
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}

function StepRecap({
  plan,
  goToStep,
}: {
  plan: WeddingPlan;
  goToStep: (n: number) => void;
}) {
  const { percent, missing } = planCompleteness(plan);
  const countdown = daysUntil(plan.weddingDate);

  return (
    <>
      <StepHeader
        eyebrow="Étape 8 sur 8"
        title={
          percent === 100
            ? "Tout est prêt. Bravo 💫"
            : "Presque là."
        }
        tagline={
          percent === 100
            ? "Il ne reste qu'à envoyer les demandes et profiter."
            : `Il vous reste ${missing.length} choix à faire pour un plan complet. Vous pouvez y revenir à tout moment.`
        }
      />

      {/* Celebration gradient */}
      {percent === 100 && (
        <div className="relative rounded-2xl overflow-hidden mb-6 h-32 animate-in fade-in zoom-in-95 duration-700">
          <div className="absolute inset-0 bg-gradient-to-br from-garnet-soft via-surface-muted to-garnet-soft" />
          <div className="absolute inset-0 grid place-items-center">
            <Sparkles className="h-10 w-10 text-garnet animate-pulse" strokeWidth={1.25} />
          </div>
        </div>
      )}

      <div className="space-y-6">
        <Card>
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Votre mariage
              </div>
              <div className="mt-0.5 font-serif text-2xl text-ink italic">
                {plan.userName || "—"} <span className="text-garnet not-italic">&</span>{" "}
                {plan.partnerName || "—"}
              </div>
            </div>
            {countdown != null && countdown >= 0 && (
              <div className="text-right">
                <div className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  Compte à rebours
                </div>
                <div className="font-serif text-2xl text-garnet">
                  {countdown === 0 ? "Aujourd'hui" : `J-${countdown}`}
                </div>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <KV label="Date" value={plan.weddingDate ? new Date(plan.weddingDate).toLocaleDateString("fr-BE", { day: "numeric", month: "long", year: "numeric" }) : "—"} />
            <KV label="Format" value={plan.days === 2 ? "2 jours (H + F)" : "1 jour"} />
            <KV label="Invités" value={plan.days === 2 ? `${plan.guestsPrimary} + ${plan.guestsSecondary}` : `${plan.guestsPrimary}`} />
            <KV label="Style" value={plan.style ? plan.style[0].toUpperCase() + plan.style.slice(1) : "—"} />
            <KV label="Budget indicatif" value={plan.budget ?? "—"} />
            {plan.secondaryDate && <KV label="Second jour" value={new Date(plan.secondaryDate).toLocaleDateString("fr-BE")} />}
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-baseline justify-between gap-3">
            <h3 className="font-serif text-xl text-ink">Vos choix</h3>
            <span className="text-xs text-ink-muted">{percent}% complet</span>
          </div>
          <ul className="divide-y divide-hairline">
            {(
              [
                { key: "venue" as PickKey, label: "Salle de réception", stepBack: 2 },
                { key: "traiteur" as PickKey, label: "Traiteur", stepBack: 3 },
                { key: "ziana" as PickKey, label: "Ziana (décor)", stepBack: 4 },
                { key: "nasheed" as PickKey, label: "Groupe nachid", stepBack: 4 },
                { key: "tayyaba" as PickKey, label: "Tayyaba", stepBack: 5 },
                { key: "hennaya" as PickKey, label: "Hennaya", stepBack: 5 },
                { key: "negafa" as PickKey, label: "Négafa", stepBack: 5 },
                { key: "photographer" as PickKey, label: "Photographe", stepBack: 6 },
                { key: "videographer" as PickKey, label: "Vidéaste", stepBack: 6 },
              ]
            ).map((row) => {
              const val = plan.picks[row.key];
              return (
                <li key={row.key} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <div className="text-sm font-medium text-ink">{row.label}</div>
                    <div className="text-xs text-ink-muted">
                      {val?.kind === "picked"
                        ? val.name
                        : val?.kind === "skipped"
                          ? "Ignoré"
                          : "À décider"}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => goToStep(row.stepBack)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-garnet hover:text-garnet-hover"
                  >
                    {val?.kind === "picked" ? "Modifier" : "Choisir"}
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card>
          <h3 className="font-serif text-xl text-ink mb-3">Prochaines actions</h3>
          <ul className="space-y-3">
            {plan.picks.venue?.kind === "picked" && (
              <NextAction
                title={`Envoyer une demande à ${plan.picks.venue.name}`}
                href={`/salles/${plan.picks.venue.slug}`}
              />
            )}
            {(["traiteur", "ziana", "photographer"] as const).map((cat) => {
              const p = plan.picks[cat];
              if (p?.kind !== "picked") return null;
              return (
                <NextAction
                  key={cat}
                  title={`Contacter ${p.name} (${CATEGORIES[cat].labelFr.toLowerCase()})`}
                  href={`/prestataires/${p.slug}`}
                />
              );
            })}
            <NextAction
              title="Envoyer par email à la famille"
              onClick={() => toast.success("Un récapitulatif sera envoyé bientôt (démo)")}
              icon={Download}
            />
          </ul>
        </Card>
      </div>
    </>
  );
}

/* ===================== Helpers ===================== */

function ChoiceTile({
  active,
  onClick,
  title,
  sub,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  sub?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "text-left rounded-xl border p-4 transition-all",
        active
          ? "border-garnet bg-garnet-soft shadow-e1"
          : "border-hairline bg-card hover:border-ink-muted",
      )}
    >
      <div className={cn("font-serif text-lg", active ? "text-garnet" : "text-ink")}>{title}</div>
      {sub && <div className="mt-0.5 text-xs text-ink-muted">{sub}</div>}
    </button>
  );
}

function GuestStepper({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="text-sm font-medium text-ink mb-1.5">{label}</div>
      <div className="flex items-center gap-2 rounded-lg border border-hairline bg-card px-3 py-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, value - 25))}
          className="h-10 w-10 rounded-md border border-hairline text-ink hover:border-ink-muted"
          aria-label="Diminuer"
        >
          −
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Math.max(1, Number(e.target.value) || 1))}
          className="flex-1 text-center bg-transparent text-lg font-serif outline-none"
          aria-label={label}
        />
        <button
          type="button"
          onClick={() => onChange(value + 25)}
          className="h-10 w-10 rounded-md border border-hairline text-ink hover:border-ink-muted"
          aria-label="Augmenter"
        >
          +
        </button>
      </div>
    </div>
  );
}

function PickableVenue({
  venue,
  active,
  onPick,
}: {
  venue: Venue;
  active: boolean;
  onPick: () => void;
}) {
  const listing = venueToListing(venue);
  return (
    <button
      type="button"
      onClick={onPick}
      aria-pressed={active}
      className={cn(
        "group text-left rounded-xl border bg-card transition-all overflow-hidden",
        active ? "border-garnet ring-2 ring-garnet/20 shadow-e1" : "border-hairline hover:border-ink-muted hover:-translate-y-0.5",
      )}
    >
      <div className={cn("relative h-40 md:h-44", venue.photos[0]?.fallback)}>
        <span className="absolute top-3 left-3 inline-flex items-center rounded-pill bg-surface/95 px-2 py-0.5 text-[11px] font-semibold text-ink">
          {venue.priceTier}
        </span>
        {active && (
          <span className="absolute top-3 right-3 inline-grid h-7 w-7 place-items-center rounded-full bg-garnet text-white animate-in zoom-in duration-300">
            <Check className="h-4 w-4" strokeWidth={2.5} />
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="font-serif text-lg text-ink">{venue.name}</div>
        <div className="text-sm text-ink-muted">{venue.neighborhood} · {venue.city}</div>
        <div className="mt-1 text-xs text-ink-muted">
          {venue.capacityMin}–{venue.capacityMax} invités
        </div>
        {listing.priceHint && (
          <div className="mt-2 text-sm text-ink">
            <span className="font-medium">{listing.priceHint}</span>
          </div>
        )}
      </div>
    </button>
  );
}

function PickableVendor({
  vendor,
  active,
  onPick,
}: {
  vendor: Vendor;
  active: boolean;
  onPick: () => void;
}) {
  const listing = vendorToListing(vendor);
  const meta = CATEGORIES[vendor.category];
  return (
    <button
      type="button"
      onClick={onPick}
      aria-pressed={active}
      className={cn(
        "group text-left rounded-xl border bg-card transition-all overflow-hidden",
        active ? "border-garnet ring-2 ring-garnet/20 shadow-e1" : "border-hairline hover:border-ink-muted hover:-translate-y-0.5",
      )}
    >
      <div className={cn("relative h-40 md:h-44", vendor.photos[0]?.fallback)}>
        {active && (
          <span className="absolute top-3 right-3 inline-grid h-7 w-7 place-items-center rounded-full bg-garnet text-white animate-in zoom-in duration-300">
            <Check className="h-4 w-4" strokeWidth={2.5} />
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="font-serif text-lg text-ink">{vendor.name}</div>
        <div className="text-sm text-ink-muted">{vendor.serviceCities.join(", ")}</div>
        <div className="mt-1 text-xs text-ink-muted line-clamp-1">
          {listing.badges.join(" · ") || meta.taglineFr}
        </div>
      </div>
    </button>
  );
}

function MiniVendorTile({
  vendor,
  active,
  onPick,
}: {
  vendor: Vendor;
  active: boolean;
  onPick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onPick}
      aria-pressed={active}
      className={cn(
        "group text-left rounded-lg border bg-card transition-all overflow-hidden",
        active ? "border-garnet ring-2 ring-garnet/20" : "border-hairline hover:border-ink-muted",
      )}
    >
      <div className={cn("relative h-24", vendor.photos[0]?.fallback)}>
        {active && (
          <span className="absolute top-2 right-2 inline-grid h-6 w-6 place-items-center rounded-full bg-garnet text-white animate-in zoom-in duration-300">
            <Check className="h-3 w-3" strokeWidth={2.5} />
          </span>
        )}
      </div>
      <div className="p-3">
        <div className="font-medium text-sm text-ink truncate">{vendor.name}</div>
        <div className="text-[11px] text-ink-muted truncate">{vendor.serviceCities[0]}</div>
      </div>
    </button>
  );
}

function SelectedCard({
  title,
  onClear,
  href,
}: {
  title: string;
  onClear: () => void;
  href: string;
}) {
  return (
    <div className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-garnet bg-garnet-soft px-4 py-3 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center gap-2 min-w-0">
        <Check className="h-4 w-4 text-garnet shrink-0" strokeWidth={2.5} />
        <span className="font-serif text-ink truncate">{title}</span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Link href={href} target="_blank" className="text-xs font-medium text-ink hover:text-garnet">
          <ExternalLink className="h-4 w-4" strokeWidth={1.5} />
        </Link>
        <button
          type="button"
          onClick={onClear}
          aria-label="Retirer ce choix"
          className="text-xs font-medium text-ink-muted hover:text-error"
        >
          Changer
        </button>
      </div>
    </div>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-ink-muted">{label}</div>
      <div className="mt-0.5 font-medium text-ink">{value}</div>
    </div>
  );
}

function NextAction({
  title,
  href,
  onClick,
  icon: Icon = ChevronRight,
}: {
  title: string;
  href?: string;
  onClick?: () => void;
  icon?: LucideIcon;
}) {
  const content = (
    <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg border border-hairline bg-surface-muted/50 hover:bg-surface-muted hover:border-ink-muted transition-colors">
      <span className="text-sm font-medium text-ink">{title}</span>
      <Icon className="h-4 w-4 text-ink-muted" strokeWidth={1.5} />
    </div>
  );
  if (href) {
    return (
      <li>
        <Link href={href} target="_blank" className="block">
          {content}
        </Link>
      </li>
    );
  }
  return (
    <li>
      <button type="button" onClick={onClick} className="block w-full text-left">
        {content}
      </button>
    </li>
  );
}
