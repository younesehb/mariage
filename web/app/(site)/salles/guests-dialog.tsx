"use client";

import { useEffect, useState } from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Users, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const PRESETS = [150, 250, 400, 600, 800];

export function GuestsDialog({
  open,
  onOpenChange,
  value,
  onSubmit,
  onClear,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  value: number | undefined;
  onSubmit: (n: number) => void;
  onClear: () => void;
}) {
  const [count, setCount] = useState<number>(value ?? 300);

  useEffect(() => {
    if (open) setCount(value ?? 300);
  }, [open, value]);

  function commit(n: number) {
    const safe = Math.max(1, Math.min(2000, Math.round(n) || 0));
    onSubmit(safe);
    onOpenChange(false);
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop
          className={cn(
            "fixed inset-0 z-50 bg-ink/30 backdrop-blur-md",
            "data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
          )}
        />
        <DialogPrimitive.Popup
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2",
            "rounded-2xl border border-hairline bg-card/95 shadow-e2 backdrop-blur-xl",
            "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
            "data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            "outline-none",
          )}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              commit(count);
            }}
            className="flex flex-col"
          >
            <header className="flex items-center gap-3 px-6 pt-6 pb-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-garnet/10 text-garnet">
                <Users className="h-4 w-4" strokeWidth={1.75} />
              </span>
              <div>
                <DialogPrimitive.Title className="font-serif text-lg text-ink">
                  Combien d'invités ?
                </DialogPrimitive.Title>
                <DialogPrimitive.Description className="text-xs text-ink-muted">
                  On filtre les salles dont la capacité convient.
                </DialogPrimitive.Description>
              </div>
            </header>

            <div className="px-6 pt-4">
              <div className="flex items-center justify-between gap-3 rounded-xl border border-hairline bg-surface-muted/40 p-2">
                <button
                  type="button"
                  onClick={() => setCount((c) => Math.max(1, c - 50))}
                  aria-label="Diminuer de 50"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-card text-ink hover:bg-surface"
                >
                  <Minus className="h-4 w-4" strokeWidth={1.75} />
                </button>
                <label className="flex flex-col items-center">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                    Invités
                  </span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={2000}
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                    autoFocus
                    className="w-28 bg-transparent text-center font-serif text-3xl text-ink outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    aria-label="Nombre d'invités"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setCount((c) => Math.min(2000, c + 50))}
                  aria-label="Augmenter de 50"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-card text-ink hover:bg-surface"
                >
                  <Plus className="h-4 w-4" strokeWidth={1.75} />
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {PRESETS.map((p) => {
                  const active = count === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setCount(p)}
                      className={cn(
                        "rounded-pill border px-3 py-1.5 text-xs font-medium transition-colors",
                        active
                          ? "border-ink bg-ink text-surface"
                          : "border-hairline bg-card text-ink hover:border-ink-muted",
                      )}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>

            <footer className="mt-6 flex items-center justify-between gap-2 border-t border-hairline bg-surface-muted/30 px-6 py-3 rounded-b-2xl">
              <button
                type="button"
                onClick={() => {
                  onClear();
                  onOpenChange(false);
                }}
                className="text-xs font-medium text-ink-muted underline-offset-4 hover:underline"
              >
                Effacer
              </button>
              <div className="flex items-center gap-2">
                <DialogPrimitive.Close
                  className="rounded-pill border border-hairline bg-card px-4 py-2 text-sm font-medium text-ink hover:border-ink-muted"
                >
                  Annuler
                </DialogPrimitive.Close>
                <button
                  type="submit"
                  className="rounded-pill bg-garnet px-4 py-2 text-sm font-semibold text-white hover:bg-garnet-hover"
                >
                  Appliquer
                </button>
              </div>
            </footer>
          </form>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
