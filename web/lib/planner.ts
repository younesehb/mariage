import type { VendorCategory } from "@/lib/types";

export type PickKey = "venue" | VendorCategory;

export type PickValue =
  | { kind: "picked"; id: string; slug: string; name: string; category?: string }
  | { kind: "skipped" }
  | null;

export type BudgetCategoryKey =
  | "salle"
  | "traiteur"
  | "ziana"
  | "hennaya"
  | "photographer"
  | "nasheed"
  | "decor"
  | "tenues"
  | "autres";

export interface BudgetCategory {
  key: BudgetCategoryKey;
  label: string;
  planned: number; // euros
  spent: number; // euros
  note?: string;
}

export const DEFAULT_BUDGET_CATEGORIES: Omit<BudgetCategory, "planned" | "spent">[] = [
  { key: "salle", label: "Salle de réception" },
  { key: "traiteur", label: "Traiteur" },
  { key: "ziana", label: "Ziana / décor" },
  { key: "tenues", label: "Tenues (takchita, costume)" },
  { key: "hennaya", label: "Hennaya" },
  { key: "photographer", label: "Photo / vidéo" },
  { key: "nasheed", label: "Groupe nachid / DJ" },
  { key: "decor", label: "Fleurs & décoration" },
  { key: "autres", label: "Divers (transport, cadeaux…)" },
];

// Suggested allocation percentages by total-budget tier.
// Informed by typical Moroccan diaspora weddings (BE) — venue+traiteur dominant.
export const SUGGESTED_ALLOCATION: Record<BudgetCategoryKey, number> = {
  salle: 0.25,
  traiteur: 0.30,
  ziana: 0.08,
  tenues: 0.10,
  hennaya: 0.03,
  photographer: 0.08,
  nasheed: 0.05,
  decor: 0.06,
  autres: 0.05,
};

export interface WeddingPlan {
  userName: string;
  partnerName: string;
  weddingDate: string | null;
  days: 1 | 2;
  secondaryDate: string | null;
  guestsPrimary: number;
  guestsSecondary: number;
  dayLabeling: "neutral" | "men_women";
  style: "traditionnel" | "moderne" | "mixte" | null;
  budget: "€" | "€€" | "€€€" | null;
  budgetTotal: number; // euros; 0 means unset
  budgetCategories: BudgetCategory[];
  guests: Guest[];
  tasks: ChecklistTask[];
  picks: Partial<Record<PickKey, PickValue>>;
  startedAt: string;
  lastUpdated: string;
  completedSteps: number[];
}

export type RsvpStatus = "pending" | "yes" | "no" | "maybe";
export type GuestSide = "bride" | "groom" | "shared";
export type GuestMeal = "standard" | "vegetarian" | "child";
export type GuestDays = { day1: boolean; day2: boolean };

export interface Guest {
  id: string;
  fullName: string;
  side: GuestSide;
  group?: string; // e.g. "Famille proche", "Amis Anvers"
  rsvp: RsvpStatus;
  days: GuestDays;
  meal: GuestMeal;
  plusOne: number; // number of additional attendees
  note?: string;
}

export type TaskPhase =
  | "khotba"
  | "preparation"
  | "henne"
  | "nikah"
  | "walima"
  | "post";

export interface ChecklistTask {
  id: string;
  phase: TaskPhase;
  label: string;
  dueOffsetDays: number; // days relative to weddingDate (negative = before)
  done: boolean;
  custom?: boolean;
}

export const PHASE_META: Record<TaskPhase, { label: string; description: string; order: number }> = {
  khotba: {
    label: "Khotba & fiançailles",
    description: "Officialisation de l'engagement entre les deux familles.",
    order: 0,
  },
  preparation: {
    label: "Préparation",
    description: "Salle, traiteur, tenues, photo — les grandes briques.",
    order: 1,
  },
  henne: {
    label: "Soirée du henné",
    description: "La veille : henné, nachid, tenues traditionnelles.",
    order: 2,
  },
  nikah: {
    label: "Nikah (côté religieux)",
    description: "Cérémonie religieuse, témoins, contrat.",
    order: 3,
  },
  walima: {
    label: "Walima (célébration)",
    description: "La réception — jour(s) J.",
    order: 4,
  },
  post: {
    label: "Après le mariage",
    description: "Remerciements, photos, démarches administratives.",
    order: 5,
  },
};

export const DEFAULT_CHECKLIST: Omit<ChecklistTask, "id" | "done">[] = [
  // Khotba
  { phase: "khotba", label: "Fixer la date de la khotba avec les familles", dueOffsetDays: -270 },
  { phase: "khotba", label: "Préparer la liste des invités (khotba)", dueOffsetDays: -240 },
  { phase: "khotba", label: "Commander les pâtisseries orientales", dueOffsetDays: -210 },
  // Préparation
  { phase: "preparation", label: "Définir le budget global", dueOffsetDays: -365 },
  { phase: "preparation", label: "Réserver la salle", dueOffsetDays: -300 },
  { phase: "preparation", label: "Choisir le traiteur", dueOffsetDays: -240 },
  { phase: "preparation", label: "Réserver la ziana / négafa", dueOffsetDays: -180 },
  { phase: "preparation", label: "Choisir le photographe / vidéaste", dueOffsetDays: -180 },
  { phase: "preparation", label: "Commander la takchita et le caftan", dueOffsetDays: -150 },
  { phase: "preparation", label: "Réserver le groupe nachid / DJ", dueOffsetDays: -120 },
  { phase: "preparation", label: "Envoyer les faire-parts", dueOffsetDays: -90 },
  { phase: "preparation", label: "Confirmer le nombre d'invités au traiteur", dueOffsetDays: -30 },
  // Henné
  { phase: "henne", label: "Réserver la hennaya", dueOffsetDays: -90 },
  { phase: "henne", label: "Commander les plateaux de henné", dueOffsetDays: -30 },
  { phase: "henne", label: "Préparer la tenue traditionnelle du henné", dueOffsetDays: -14 },
  // Nikah
  { phase: "nikah", label: "Prendre RDV à la mosquée / avec l'imam", dueOffsetDays: -60 },
  { phase: "nikah", label: "Préparer les documents (passeports, actes)", dueOffsetDays: -45 },
  { phase: "nikah", label: "Choisir les deux témoins", dueOffsetDays: -30 },
  // Walima
  { phase: "walima", label: "Répétition avec la ziana", dueOffsetDays: -7 },
  { phase: "walima", label: "Confirmer avec tous les prestataires", dueOffsetDays: -3 },
  { phase: "walima", label: "Préparer les cadeaux d'invités", dueOffsetDays: -2 },
  { phase: "walima", label: "Se reposer la veille", dueOffsetDays: -1 },
  // Post
  { phase: "post", label: "Envoyer les remerciements aux invités", dueOffsetDays: 14 },
  { phase: "post", label: "Récupérer les photos / vidéos finales", dueOffsetDays: 45 },
  { phase: "post", label: "Démarches administratives (changement de nom)", dueOffsetDays: 30 },
];

export function buildDefaultTasks(): ChecklistTask[] {
  return DEFAULT_CHECKLIST.map((t, i) => ({
    id: `t-${i}-${t.phase}`,
    done: false,
    ...t,
  }));
}

export function guestTotals(plan: WeddingPlan) {
  const counted = plan.guests.filter((g) => g.rsvp === "yes");
  const day1 = counted.filter((g) => g.days.day1).reduce((s, g) => s + 1 + g.plusOne, 0);
  const day2 = counted.filter((g) => g.days.day2).reduce((s, g) => s + 1 + g.plusOne, 0);
  const invited = plan.guests.reduce((s, g) => s + 1 + g.plusOne, 0);
  const yes = plan.guests.filter((g) => g.rsvp === "yes").length;
  const no = plan.guests.filter((g) => g.rsvp === "no").length;
  const maybe = plan.guests.filter((g) => g.rsvp === "maybe").length;
  const pending = plan.guests.filter((g) => g.rsvp === "pending").length;
  const meals = {
    standard: counted.filter((g) => g.meal === "standard").reduce((s, g) => s + 1 + g.plusOne, 0),
    vegetarian: counted.filter((g) => g.meal === "vegetarian").reduce((s, g) => s + 1 + g.plusOne, 0),
    child: counted.filter((g) => g.meal === "child").reduce((s, g) => s + 1 + g.plusOne, 0),
  };
  return { day1, day2, invited, yes, no, maybe, pending, meals };
}

export const emptyPlan = (): WeddingPlan => ({
  userName: "",
  partnerName: "",
  weddingDate: null,
  days: 1,
  secondaryDate: null,
  guestsPrimary: 300,
  guestsSecondary: 300,
  dayLabeling: "men_women",
  style: null,
  budget: null,
  budgetTotal: 0,
  budgetCategories: DEFAULT_BUDGET_CATEGORIES.map((c) => ({ ...c, planned: 0, spent: 0 })),
  guests: [],
  tasks: buildDefaultTasks(),
  picks: {},
  startedAt: new Date().toISOString(),
  lastUpdated: new Date().toISOString(),
  completedSteps: [],
});

export function allocateBudget(total: number): BudgetCategory[] {
  return DEFAULT_BUDGET_CATEGORIES.map((c) => ({
    ...c,
    planned: Math.round(total * SUGGESTED_ALLOCATION[c.key]),
    spent: 0,
  }));
}

export function budgetTotals(plan: WeddingPlan) {
  const planned = plan.budgetCategories.reduce((s, c) => s + (c.planned || 0), 0);
  const spent = plan.budgetCategories.reduce((s, c) => s + (c.spent || 0), 0);
  const remaining = Math.max(0, plan.budgetTotal - spent);
  const overAllocated = Math.max(0, planned - plan.budgetTotal);
  return { planned, spent, remaining, overAllocated };
}

export const PLAN_STORAGE_KEY = "zaffa.plan.v1";

export function loadPlan(): WeddingPlan | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PLAN_STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Partial<WeddingPlan>;
    const base = emptyPlan();
    const merged: WeddingPlan = { ...base, ...p };
    // Migrations for older stored plans
    if (!Array.isArray(merged.guests)) merged.guests = [];
    if (!Array.isArray(merged.tasks) || merged.tasks.length === 0) merged.tasks = buildDefaultTasks();
    return merged;
  } catch {
    return null;
  }
}

export function savePlan(plan: WeddingPlan): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      PLAN_STORAGE_KEY,
      JSON.stringify({ ...plan, lastUpdated: new Date().toISOString() }),
    );
  } catch {
    // ignore quota / privacy-mode errors
  }
}

export function daysUntil(iso: string | null): number | null {
  if (!iso) return null;
  const target = new Date(iso).getTime();
  const now = new Date("2026-04-23T00:00:00").getTime();
  return Math.round((target - now) / 86400000);
}

export function planCompleteness(plan: WeddingPlan): {
  percent: number;
  missing: string[];
} {
  const checks: { label: string; ok: boolean }[] = [
    { label: "Vos noms", ok: Boolean(plan.userName && plan.partnerName) },
    { label: "Date du mariage", ok: Boolean(plan.weddingDate) },
    { label: "Style du mariage", ok: Boolean(plan.style) },
    { label: "Salle de réception", ok: plan.picks.venue?.kind === "picked" },
    { label: "Traiteur", ok: plan.picks.traiteur != null },
    { label: "Ziana (décor)", ok: plan.picks.ziana != null },
    { label: "Tayyaba", ok: plan.picks.tayyaba != null },
    { label: "Hennaya", ok: plan.picks.hennaya != null },
    { label: "Photographe", ok: plan.picks.photographer != null },
    { label: "Groupe nachid", ok: plan.picks.nasheed != null },
  ];
  const done = checks.filter((c) => c.ok).length;
  return {
    percent: Math.round((done / checks.length) * 100),
    missing: checks.filter((c) => !c.ok).map((c) => c.label),
  };
}
