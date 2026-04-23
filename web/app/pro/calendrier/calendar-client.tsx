"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type DateStatus = "available" | "held" | "booked";

const MONTHS_FR = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];
const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];

export function CalendarClient({
  venueName,
  initialBooked,
}: {
  venueName: string;
  initialBooked: string[];
}) {
  const [status, setStatus] = useState<Record<string, DateStatus>>(() => {
    const m: Record<string, DateStatus> = {};
    for (const d of initialBooked) m[d] = "booked";
    return m;
  });
  const today = new Date("2026-04-23T00:00:00");
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [mode, setMode] = useState<DateStatus>("booked");

  function statusOf(iso: string): DateStatus {
    return status[iso] ?? "available";
  }

  function onCellClick(iso: string, past: boolean) {
    if (past) return;
    setStatus((prev) => {
      const current = prev[iso] ?? "available";
      const next = { ...prev };
      if (current === mode) {
        delete next[iso];
      } else {
        next[iso] = mode;
      }
      return next;
    });
  }

  function shift(n: number) {
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + n, 1));
  }

  const grid = useMemo(() => buildMonthGrid(cursor), [cursor]);

  return (
    <div className="max-w-4xl space-y-6">
      <div className="rounded-xl border border-hairline bg-card p-5">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="font-serif text-lg">{venueName}</h2>
          <div className="inline-flex rounded-pill border border-hairline p-0.5 bg-surface-muted text-sm">
            <button
              type="button"
              onClick={() => setMode("booked")}
              className={cn(
                "px-3 py-1 rounded-pill font-medium",
                mode === "booked" ? "bg-ink text-surface" : "text-ink-muted",
              )}
            >
              Réservée
            </button>
            <button
              type="button"
              onClick={() => setMode("held")}
              className={cn(
                "px-3 py-1 rounded-pill font-medium",
                mode === "held" ? "bg-ink text-surface" : "text-ink-muted",
              )}
            >
              Réservée provisoirement
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => shift(-1)}
            aria-label="Mois précédent"
            className="p-2 rounded-md hover:bg-surface-muted"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
          </button>
          <div className="font-serif text-xl text-ink">
            {MONTHS_FR[cursor.getMonth()]} {cursor.getFullYear()}
          </div>
          <button
            type="button"
            onClick={() => shift(1)}
            aria-label="Mois suivant"
            className="p-2 rounded-md hover:bg-surface-muted"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {WEEKDAYS.map((d, i) => (
            <div
              key={i}
              className="text-center text-[11px] font-semibold uppercase tracking-wider text-ink-muted py-2"
            >
              {d}
            </div>
          ))}
          {grid.map((cell, i) => {
            if (!cell) return <div key={i} />;
            const iso = cell.iso;
            const past = new Date(iso) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const s = statusOf(iso);
            return (
              <button
                key={i}
                type="button"
                onClick={() => onCellClick(iso, past)}
                disabled={past}
                aria-pressed={s !== "available"}
                aria-label={`${cell.day} ${MONTHS_FR[cursor.getMonth()]} ${cursor.getFullYear()} — ${statusLabel(s)}`}
                className={cn(
                  "relative aspect-square rounded-md text-sm font-medium transition-colors",
                  past && "text-ink-muted/40 cursor-not-allowed",
                  !past && s === "available" && "bg-card hover:bg-surface-muted text-ink border border-transparent",
                  !past && s === "booked" && "bg-error/10 border border-error/30 text-error",
                  !past && s === "held" && "bg-warning/10 border border-warning/30 text-warning",
                )}
              >
                {cell.day}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-hairline bg-card p-5">
        <h3 className="font-serif text-lg mb-3">Légende</h3>
        <ul className="flex flex-wrap gap-4 text-sm">
          <Legend tone="bg-card border border-hairline" label="Disponible" />
          <Legend tone="bg-warning/10 border border-warning/30" label="Provisoire" />
          <Legend tone="bg-error/10 border border-error/30" label="Réservée" />
        </ul>
        <p className="mt-4 text-xs text-ink-muted leading-relaxed">
          Cliquez sur une date pour la marquer selon le mode sélectionné. Les dates réservées apparaîtront comme indisponibles dans les résultats de recherche, et les demandes pour ces dates afficheront un avertissement au client.
        </p>
        <button
          type="button"
          onClick={() => toast.success("Calendrier enregistré")}
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-ink text-surface px-4 py-2 text-sm font-semibold"
        >
          Enregistrer les changements
        </button>
      </div>
    </div>
  );
}

function statusLabel(s: DateStatus): string {
  return s === "booked" ? "réservée" : s === "held" ? "provisoire" : "disponible";
}

function Legend({ tone, label }: { tone: string; label: string }) {
  return (
    <li className="inline-flex items-center gap-2">
      <span className={cn("inline-block h-5 w-5 rounded-md", tone)} aria-hidden />
      <span className="text-ink">{label}</span>
    </li>
  );
}

function buildMonthGrid(cursor: Date): Array<null | { iso: string; day: number }> {
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  // Monday = 0..Sunday = 6
  const startOffset = (firstDay.getDay() + 6) % 7;
  const days = lastDay.getDate();
  const cells: Array<null | { iso: string; day: number }> = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= days; d++) {
    const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push({ iso, day: d });
  }
  while (cells.length % 7) cells.push(null);
  return cells;
}
