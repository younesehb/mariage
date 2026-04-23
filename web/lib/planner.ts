import type { VendorCategory } from "@/lib/types";

export type PickKey = "venue" | VendorCategory;

export type PickValue =
  | { kind: "picked"; id: string; slug: string; name: string; category?: string }
  | { kind: "skipped" }
  | null;

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
  picks: Partial<Record<PickKey, PickValue>>;
  startedAt: string;
  lastUpdated: string;
  completedSteps: number[];
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
  picks: {},
  startedAt: new Date().toISOString(),
  lastUpdated: new Date().toISOString(),
  completedSteps: [],
});

export const PLAN_STORAGE_KEY = "zaffa.plan.v1";

export function loadPlan(): WeddingPlan | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PLAN_STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as WeddingPlan;
    return { ...emptyPlan(), ...p };
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
