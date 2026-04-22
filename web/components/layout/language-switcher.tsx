"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Variant = "header" | "footer" | "settings";

export function LanguageSwitcher({ variant = "header" }: { variant?: Variant }) {
  // Prototype: local state only. Future: next-intl + cookie.
  const [lang, setLang] = useState<"fr" | "nl">("fr");

  if (variant === "settings") {
    return (
      <div role="radiogroup" aria-label="Langue" className="grid grid-cols-2 gap-3 max-w-xs">
        {(["fr", "nl"] as const).map((l) => (
          <button
            key={l}
            type="button"
            role="radio"
            aria-checked={lang === l}
            onClick={() => setLang(l)}
            className={cn(
              "rounded-lg border p-4 text-left transition-colors",
              lang === l
                ? "border-garnet bg-garnet-soft"
                : "border-hairline bg-card hover:border-hairline-strong",
            )}
          >
            <div className="font-serif text-lg">{l === "fr" ? "Français" : "Nederlands"}</div>
            <div className="text-xs uppercase tracking-wider text-ink-muted mt-1">
              {l.toUpperCase()}
            </div>
          </button>
        ))}
      </div>
    );
  }

  const base =
    variant === "header"
      ? "rounded-pill border border-hairline bg-card text-xs font-medium"
      : "text-sm text-ink-muted hover:text-ink";

  return (
    <div
      className={cn(
        variant === "header" ? "inline-flex items-center" : "inline-flex items-center gap-3",
        base,
      )}
      role="radiogroup"
      aria-label="Langue"
    >
      {(["fr", "nl"] as const).map((l, i) => (
        <button
          key={l}
          type="button"
          role="radio"
          aria-checked={lang === l}
          onClick={() => setLang(l)}
          className={cn(
            variant === "header"
              ? cn(
                  "px-3 py-1 transition-colors",
                  i === 0 ? "rounded-l-pill" : "rounded-r-pill",
                  lang === l ? "bg-ink text-surface" : "text-ink-muted hover:text-ink",
                )
              : cn(
                  "transition-colors",
                  lang === l ? "text-ink font-medium underline underline-offset-4" : "",
                ),
          )}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
