"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MapPin, Calendar, Users, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const cities = ["Bruxelles", "Antwerpen", "Gent", "Liège", "Charleroi"];

export function SearchBar({
  variant = "hero",
  className,
}: {
  variant?: "hero" | "inline";
  className?: string;
}) {
  const router = useRouter();
  const [city, setCity] = useState("Bruxelles");
  const [dateType, setDateType] = useState<"single" | "two-day">("single");
  const [guests, setGuests] = useState<number>(300);

  function submit() {
    const params = new URLSearchParams({
      ville: city,
      invites: String(guests),
      jours: dateType === "single" ? "1" : "2",
    });
    router.push(`/salles?${params.toString()}`);
  }

  if (variant === "hero") {
    return (
      <form
        role="search"
        className={cn(
          "relative w-full max-w-3xl rounded-full bg-card shadow-e2 border border-hairline",
          "hidden md:flex items-stretch divide-x divide-hairline",
          className,
        )}
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <Field icon={<MapPin className="h-4 w-4" strokeWidth={1.75} />} label="Où" className="pl-6 pr-6 flex-1">
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="bg-transparent text-sm font-medium text-ink outline-none w-full"
            aria-label="Ville"
          >
            {cities.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field icon={<Calendar className="h-4 w-4" strokeWidth={1.75} />} label="Quand" className="px-6 flex-1">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setDateType("single")}
              className={cn(
                "rounded-pill px-2 py-0.5 text-xs font-medium",
                dateType === "single"
                  ? "bg-ink text-surface"
                  : "text-ink-muted hover:text-ink",
              )}
            >
              1 jour
            </button>
            <button
              type="button"
              onClick={() => setDateType("two-day")}
              className={cn(
                "rounded-pill px-2 py-0.5 text-xs font-medium",
                dateType === "two-day"
                  ? "bg-ink text-surface"
                  : "text-ink-muted hover:text-ink",
              )}
            >
              2 jours
            </button>
          </div>
        </Field>
        <Field icon={<Users className="h-4 w-4" strokeWidth={1.75} />} label="Invités" className="px-6 flex-1">
          <input
            type="number"
            min={1}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="bg-transparent text-sm font-medium text-ink outline-none w-20"
            aria-label="Nombre d'invités"
          />
        </Field>
        <button
          type="submit"
          aria-label="Rechercher"
          className="m-1.5 inline-flex items-center justify-center gap-2 rounded-full bg-garnet px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-garnet-hover"
        >
          <Search className="h-4 w-4" strokeWidth={2} />
          <span>Rechercher</span>
        </button>
      </form>
    );
  }

  // Mobile / inline variant: single-row compact
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className={cn(
        "flex w-full items-center gap-2 rounded-full border border-hairline bg-card px-4 py-3 shadow-e1",
        className,
      )}
    >
      <Search className="h-4 w-4 text-ink-muted" strokeWidth={1.75} />
      <div className="flex-1 text-left">
        <div className="text-xs font-semibold text-ink">Chercher une salle</div>
        <div className="text-[11px] text-ink-muted">{city} · {guests} invités · {dateType === "single" ? "1 jour" : "2 jours"}</div>
      </div>
      <button
        type="submit"
        className="rounded-full bg-garnet p-2 text-white"
        aria-label="Rechercher"
      >
        <Search className="h-4 w-4" strokeWidth={2} />
      </button>
    </form>
  );
}

function Field({
  icon,
  label,
  children,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("flex flex-col justify-center py-2.5", className)}>
      <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted inline-flex items-center gap-1.5">
        {icon}
        {label}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
