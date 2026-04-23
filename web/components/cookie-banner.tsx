"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Cookie, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { readConsent, writeConsent, OPEN_COOKIE_SETTINGS } from "@/lib/consent";

type Prefs = { analytics: boolean; marketing: boolean };

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [customize, setCustomize] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>({ analytics: false, marketing: false });

  useEffect(() => {
    const existing = readConsent();
    if (!existing) {
      const t = window.setTimeout(() => setVisible(true), 400);
      return () => window.clearTimeout(t);
    }
    setPrefs({ analytics: existing.analytics, marketing: existing.marketing });
  }, []);

  useEffect(() => {
    function open() {
      const existing = readConsent();
      if (existing) {
        setPrefs({ analytics: existing.analytics, marketing: existing.marketing });
      }
      setCustomize(true);
      setVisible(true);
    }
    window.addEventListener(OPEN_COOKIE_SETTINGS, open);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS, open);
  }, []);

  function save(next: Prefs) {
    writeConsent(next);
    setVisible(false);
    setCustomize(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-desc"
      className={cn(
        "fixed inset-x-3 bottom-3 z-[60] md:inset-x-auto md:left-4 md:bottom-4 md:max-w-md",
        "mb-[64px] md:mb-0", // avoid bottom-nav collision on mobile
        "rounded-2xl border border-hairline bg-card/95 shadow-e2 backdrop-blur-xl",
        "animate-in fade-in-0 slide-in-from-bottom-4 duration-300",
      )}
    >
      <div className="flex items-start gap-3 p-4 md:p-5">
        <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-garnet/10 text-garnet">
          <Cookie className="h-4 w-4" strokeWidth={1.75} />
        </span>
        <div className="flex-1 min-w-0">
          <h2 id="cookie-title" className="font-serif text-lg text-ink">
            Un petit thé aux cookies ?
          </h2>
          <p id="cookie-desc" className="mt-1 text-sm text-ink-muted leading-relaxed">
            Nous utilisons des cookies essentiels au bon fonctionnement du site. Avec votre
            accord, nous mesurons aussi l'audience pour améliorer zaffa.{" "}
            <Link href="/cookies" className="text-ink font-medium underline underline-offset-4">
              En savoir plus
            </Link>
            .
          </p>

          {customize && (
            <div className="mt-4 space-y-2.5 rounded-lg border border-hairline bg-surface-muted/40 p-3">
              <ToggleRow
                label="Essentiels"
                sublabel="Authentification, préférences, sécurité."
                checked
                disabled
                onChange={() => {}}
              />
              <ToggleRow
                label="Mesure d'audience"
                sublabel="Statistiques anonymisées sur l'usage du site."
                checked={prefs.analytics}
                onChange={(v) => setPrefs((p) => ({ ...p, analytics: v }))}
              />
              <ToggleRow
                label="Marketing"
                sublabel="Personnaliser les contenus hors zaffa."
                checked={prefs.marketing}
                onChange={(v) => setPrefs((p) => ({ ...p, marketing: v }))}
              />
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {customize ? (
              <>
                <button
                  type="button"
                  onClick={() => save(prefs)}
                  className="rounded-pill bg-garnet px-4 py-2 text-sm font-semibold text-white hover:bg-garnet-hover"
                >
                  Enregistrer mes choix
                </button>
                <button
                  type="button"
                  onClick={() => save({ analytics: true, marketing: true })}
                  className="rounded-pill border border-hairline bg-card px-4 py-2 text-sm font-medium text-ink hover:border-ink-muted"
                >
                  Tout accepter
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => save({ analytics: true, marketing: true })}
                  className="inline-flex items-center gap-1.5 rounded-pill bg-garnet px-4 py-2 text-sm font-semibold text-white hover:bg-garnet-hover"
                >
                  <Check className="h-4 w-4" strokeWidth={2} />
                  Tout accepter
                </button>
                <button
                  type="button"
                  onClick={() => save({ analytics: false, marketing: false })}
                  className="rounded-pill border border-hairline bg-card px-4 py-2 text-sm font-medium text-ink hover:border-ink-muted"
                >
                  Refuser
                </button>
                <button
                  type="button"
                  onClick={() => setCustomize(true)}
                  className="text-sm font-medium text-ink underline underline-offset-4 hover:text-garnet"
                >
                  Personnaliser
                </button>
              </>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => save({ analytics: false, marketing: false })}
          aria-label="Fermer et refuser les cookies non essentiels"
          className="shrink-0 rounded-full p-1.5 text-ink-muted hover:bg-surface-muted hover:text-ink"
        >
          <X className="h-4 w-4" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  sublabel,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  sublabel: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className={cn("flex items-start justify-between gap-3", disabled && "opacity-80")}>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-ink">{label}</span>
        <span className="block text-xs text-ink-muted">{sublabel}</span>
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors",
          checked ? "bg-ink" : "bg-hairline",
          disabled && "cursor-not-allowed",
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-card shadow-e1 transition-transform",
            checked ? "translate-x-[18px]" : "translate-x-[2px]",
          )}
        />
      </button>
    </label>
  );
}
