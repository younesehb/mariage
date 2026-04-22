"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface FilterState {
  capacityMin: number;
  alcohol: "any" | "forbidden" | "byo" | "allowed";
  genderSep: "any" | "mixed" | "separable" | "strict";
  prayer: boolean;
  wudu: boolean;
  parking: boolean;
  noise: "any" | "02" | "04" | "none";
  stage: boolean;
  traiteurPolicy: "any" | "in_house" | "imposed_list" | "free_choice";
  femaleStaff: boolean;
  halalOnly: boolean;
}

export const defaultFilters: FilterState = {
  capacityMin: 0,
  alcohol: "any",
  genderSep: "any",
  prayer: false,
  wudu: false,
  parking: false,
  noise: "any",
  stage: false,
  traiteurPolicy: "any",
  femaleStaff: false,
  halalOnly: false,
};

export function activeFilterCount(f: FilterState): number {
  let c = 0;
  if (f.capacityMin > 0) c++;
  if (f.alcohol !== "any") c++;
  if (f.genderSep !== "any") c++;
  if (f.prayer) c++;
  if (f.wudu) c++;
  if (f.parking) c++;
  if (f.noise !== "any") c++;
  if (f.stage) c++;
  if (f.traiteurPolicy !== "any") c++;
  if (f.femaleStaff) c++;
  if (f.halalOnly) c++;
  return c;
}

export function FilterDrawer({
  filters,
  onChange,
  trigger,
}: {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(filters);

  function set<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function apply() {
    onChange(draft);
    setOpen(false);
  }

  function reset() {
    setDraft(defaultFilters);
  }

  const count = activeFilterCount(filters);

  const defaultTriggerClasses =
    "inline-flex items-center gap-2 rounded-pill border border-hairline bg-card px-4 py-2 text-sm font-medium min-h-[44px] hover:border-ink-muted";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {trigger ? (
        <SheetTrigger render={trigger as React.ReactElement} />
      ) : (
        <SheetTrigger
          aria-label={`Plus de filtres${count ? ` (${count} actif${count > 1 ? "s" : ""})` : ""}`}
          className={defaultTriggerClasses}
        >
          <SlidersHorizontal className="h-4 w-4" strokeWidth={1.75} />
          <span>Plus de filtres</span>
          {count > 0 && (
            <span className="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-garnet px-1.5 text-[11px] font-semibold text-white">
              {count}
            </span>
          )}
        </SheetTrigger>
      )}
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="px-6 pt-6">
          <SheetTitle className="font-serif text-2xl">Filtres</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-6 px-6 py-4">
          <Group title="Capacité minimum">
            <div className="flex flex-wrap gap-2">
              {[0, 100, 200, 300, 500, 800].map((n) => (
                <Chip key={n} active={draft.capacityMin === n} onClick={() => set("capacityMin", n)}>
                  {n === 0 ? "Toutes" : `${n}+`}
                </Chip>
              ))}
            </div>
          </Group>

          <Group title="Halal">
            <Toggle
              label="Traiteur halal uniquement"
              active={draft.halalOnly}
              onClick={() => set("halalOnly", !draft.halalOnly)}
            />
          </Group>

          <Group title="Alcool">
            <div className="flex flex-wrap gap-2">
              {([
                ["any", "Indifférent"],
                ["forbidden", "Sans alcool"],
                ["byo", "BYO"],
                ["allowed", "Autorisé"],
              ] as const).map(([v, l]) => (
                <Chip key={v} active={draft.alcohol === v} onClick={() => set("alcohol", v)}>
                  {l}
                </Chip>
              ))}
            </div>
          </Group>

          <Group title="Séparation H/F">
            <div className="flex flex-wrap gap-2">
              {([
                ["any", "Indifférent"],
                ["mixed", "Mixte"],
                ["separable", "Séparable"],
                ["strict", "Stricte"],
              ] as const).map(([v, l]) => (
                <Chip key={v} active={draft.genderSep === v} onClick={() => set("genderSep", v)}>
                  {l}
                </Chip>
              ))}
            </div>
          </Group>

          <Group title="Équipements">
            <div className="grid grid-cols-2 gap-2">
              <Toggle label="Salle de prière" active={draft.prayer} onClick={() => set("prayer", !draft.prayer)} />
              <Toggle label="Ablutions" active={draft.wudu} onClick={() => set("wudu", !draft.wudu)} />
              <Toggle label="Parking" active={draft.parking} onClick={() => set("parking", !draft.parking)} />
              <Toggle label="Scène" active={draft.stage} onClick={() => set("stage", !draft.stage)} />
              <Toggle
                label="Personnel féminin"
                active={draft.femaleStaff}
                onClick={() => set("femaleStaff", !draft.femaleStaff)}
              />
            </div>
          </Group>

          <Group title="Couvre-feu (weekend)">
            <div className="flex flex-wrap gap-2">
              {([
                ["any", "Indifférent"],
                ["02", "≥ 2h"],
                ["04", "≥ 4h"],
                ["none", "Pas de limite"],
              ] as const).map(([v, l]) => (
                <Chip key={v} active={draft.noise === v} onClick={() => set("noise", v)}>
                  {l}
                </Chip>
              ))}
            </div>
          </Group>

          <Group title="Choix du traiteur">
            <div className="flex flex-wrap gap-2">
              {([
                ["any", "Indifférent"],
                ["free_choice", "Libre"],
                ["imposed_list", "Liste imposée"],
                ["in_house", "Interne"],
              ] as const).map(([v, l]) => (
                <Chip key={v} active={draft.traiteurPolicy === v} onClick={() => set("traiteurPolicy", v)}>
                  {l}
                </Chip>
              ))}
            </div>
          </Group>
        </div>

        <SheetFooter className="sticky bottom-0 bg-surface border-t border-hairline">
          <div className="flex w-full items-center justify-between gap-3 px-6 py-4">
            <button type="button" onClick={reset} className="text-sm font-medium underline underline-offset-4 text-ink">
              Réinitialiser
            </button>
            <button
              type="button"
              onClick={apply}
              className="rounded-pill bg-garnet px-6 py-3 text-sm font-semibold text-white hover:bg-garnet-hover"
            >
              Appliquer
            </button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="text-xs font-semibold uppercase tracking-wider text-ink-muted">{title}</div>
      <Separator />
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-pill border px-3 py-1.5 text-sm transition-colors min-h-[36px]",
        active ? "border-ink bg-ink text-surface" : "border-hairline bg-card text-ink hover:border-ink-muted",
      )}
    >
      {children}
    </button>
  );
}

function Toggle({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-lg border p-3 text-left text-sm transition-colors",
        active ? "border-garnet bg-garnet-soft" : "border-hairline bg-card hover:border-hairline-strong",
      )}
    >
      <span className={cn("font-medium", active && "text-garnet")}>{label}</span>
    </button>
  );
}
