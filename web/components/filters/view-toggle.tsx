"use client";

import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";

export type ListingView = "grid" | "list";

export function ViewToggle({
  value,
  onChange,
  className,
}: {
  value: ListingView;
  onChange: (v: ListingView) => void;
  className?: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Affichage des résultats"
      className={cn(
        "inline-flex rounded-pill border border-hairline bg-card p-0.5",
        className,
      )}
    >
      {(
        [
          { v: "grid" as const, icon: LayoutGrid, label: "Grille" },
          { v: "list" as const, icon: List, label: "Liste" },
        ]
      ).map(({ v, icon: Icon, label }) => {
        const active = value === v;
        return (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(v)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-xs font-medium transition-colors",
              active
                ? "bg-ink text-surface"
                : "text-ink-muted hover:text-ink",
            )}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

const STORAGE_KEY = "zaffa.view.pref";

export function readViewPref(): ListingView {
  if (typeof window === "undefined") return "grid";
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === "list" ? "list" : "grid";
  } catch {
    return "grid";
  }
}

export function writeViewPref(v: ListingView) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, v);
  } catch {
    // ignore
  }
}
