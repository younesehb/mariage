"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { Map as MapIcon, List as ListIcon, X } from "lucide-react";
import { FilterPill } from "@/components/filters/filter-pill";
import { FilterDrawer, defaultFilters, type FilterState } from "@/components/filters/filter-drawer";
import { ListingCard } from "@/components/listing/listing-card";
import { ListingRow } from "@/components/listing/listing-row";
import { ViewToggle, readViewPref, writeViewPref, type ListingView } from "@/components/filters/view-toggle";
import { GuestsDialog } from "./guests-dialog";
import { HelpCallout } from "@/components/help-callout";
import { venueBadges, venueToListing } from "@/lib/fixtures";
import type { Venue } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

const VenueMap = dynamic(() => import("@/components/map/venue-map").then((m) => m.VenueMap), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-surface-muted grid place-items-center text-sm text-ink-muted">
      Chargement de la carte…
    </div>
  ),
});

const cities = ["Bruxelles", "Antwerpen", "Gent", "Liège", "Charleroi"];

interface Props {
  venues: Venue[];
  initialCity?: string;
  initialGuests?: number;
  initialDays?: number;
}

export function VenueResults({ venues, initialCity, initialGuests, initialDays = 1 }: Props) {
  const [city, setCity] = useState<string>(initialCity ?? "Bruxelles");
  const [guests, setGuests] = useState<number | undefined>(initialGuests);
  const [days] = useState<number>(initialDays);
  const [priceTier, setPriceTier] = useState<"any" | "€" | "€€" | "€€€">("any");
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "map">("list");
  const [view, setView] = useState<ListingView>("grid");
  const [guestsOpen, setGuestsOpen] = useState(false);

  useEffect(() => {
    setView(readViewPref());
  }, []);

  useEffect(() => {
    writeViewPref(view);
  }, [view]);

  const filtered = useMemo(() => {
    return venues.filter((v) => {
      if (v.status !== "published") return false;
      if (city && v.city !== city) return false;
      if (guests && v.capacityMax < guests) return false;
      if (priceTier !== "any" && v.priceTier !== priceTier) return false;
      if (filters.capacityMin > 0 && v.capacityMax < filters.capacityMin) return false;
      if (filters.genderSep !== "any" && v.genderSeparation !== filters.genderSep) return false;
      if (filters.prayer && !v.prayerArea) return false;
      if (filters.wudu && !v.wuduFacilities) return false;
      if (filters.parking && (v.parkingSpaces == null || v.parkingSpaces === 0)) return false;
      if (filters.stage && !v.stageAvailable) return false;
      if (filters.femaleStaff && !v.femaleStaffAvailable) return false;
      if (filters.traiteurPolicy !== "any" && v.traiteurPolicy !== filters.traiteurPolicy) return false;
      if (filters.noise !== "any") {
        if (filters.noise === "none" && v.noiseCurfewWeekend !== null) return false;
        if (filters.noise === "02") {
          if (v.noiseCurfewWeekend === null) return true;
          const h = parseInt(v.noiseCurfewWeekend.split(":")[0], 10);
          if (h < 2) return false;
        }
        if (filters.noise === "04") {
          if (v.noiseCurfewWeekend === null) return true;
          const h = parseInt(v.noiseCurfewWeekend.split(":")[0], 10);
          if (h < 4) return false;
        }
      }
      return true;
    });
  }, [venues, city, guests, priceTier, filters]);

  const listings = useMemo(() => filtered.map(venueToListing), [filtered]);

  return (
    <>
      {/* Sticky header with filter chips */}
      <div className="sticky top-0 md:top-16 z-30 bg-surface/95 backdrop-blur-md border-b border-hairline">
        <div className="mx-auto max-w-[1280px] px-4 md:px-8 py-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none -mx-1 px-1">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="flex-none min-h-[44px] rounded-pill border border-hairline bg-card px-4 text-sm font-medium appearance-none pr-8 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%221.5%22><polyline points=%226 9 12 15 18 9%22/></svg>')] bg-no-repeat bg-[right_0.75rem_center]"
              aria-label="Ville"
            >
              {cities.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <FilterPill
              active={!!guests}
              onClick={() => setGuestsOpen(true)}
            >
              {guests ? `${guests} invités` : "Invités"}
            </FilterPill>
            <FilterPill active={days === 2} onClick={() => {}}>
              {days === 2 ? "2 jours" : "1 jour"}
            </FilterPill>
            {(["any", "€", "€€", "€€€"] as const).map((t) => (
              <FilterPill
                key={t}
                active={priceTier === t}
                onClick={() => setPriceTier(priceTier === t ? "any" : t)}
              >
                {t === "any" ? "Tous les prix" : t}
              </FilterPill>
            ))}
            <FilterDrawer filters={filters} onChange={setFilters} />
          </div>
        </div>
      </div>

      {/* Desktop: two-pane layout */}
      <div className="hidden md:grid md:grid-cols-[1fr_minmax(0,560px)] mx-auto max-w-[1280px] gap-8 px-8 py-6">
        <div>
          <HelpCallout
            storageKey="salles"
            intro="Trouvez la salle qui colle à votre mariage — sans faire 15 WhatsApp."
            steps={[
              {
                title: "Filtrez rapidement",
                body: "Ville, nombre d'invités, jours, gamme de prix. Le bouton « Filtres » ouvre tout : séparation hommes/femmes, espace prière, traiteur imposé ou libre, couvre-feu, etc.",
              },
              {
                title: "Survolez la carte",
                body: "Passer la souris sur une carte met en évidence le pin correspondant sur la carte — et inversement.",
              },
              {
                title: "Ajoutez aux favoris",
                body: "Cliquez sur le ♡ pour enregistrer. Dans Favoris, vous pourrez demander un devis à plusieurs salles en même temps.",
              },
            ]}
            className="mb-4"
          />
          <div className="mb-4 flex items-end justify-between">
            <h1 className="font-serif text-2xl">
              <span className="text-ink">{filtered.length}</span>{" "}
              <span className="text-ink-muted">salles à {city}</span>
            </h1>
            <ViewToggle value={view} onChange={setView} />
          </div>
          {listings.length === 0 ? (
            <EmptyState
              onReset={() => {
                setPriceTier("any");
                setFilters(defaultFilters);
                setGuests(undefined);
              }}
            />
          ) : view === "grid" ? (
            <div className="grid grid-cols-2 gap-5">
              {listings.map((l) => (
                <div
                  key={l.id}
                  onMouseEnter={() => setActiveId(l.id)}
                  onMouseLeave={() => setActiveId(null)}
                >
                  <ListingCard listing={l} size="sm" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {listings.map((l) => (
                <div
                  key={l.id}
                  onMouseEnter={() => setActiveId(l.id)}
                  onMouseLeave={() => setActiveId(null)}
                >
                  <ListingRow listing={l} />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="sticky top-[140px] h-[calc(100vh-160px)] rounded-xl overflow-hidden border border-hairline">
          <VenueMap listings={listings} activeId={activeId} onSelectListing={setActiveId} />
        </div>
      </div>

      {/* Mobile: list or full-screen map */}
      <div className="md:hidden">
        {mobileView === "list" ? (
          <div className="mx-auto max-w-[1280px] px-4 py-4">
            <div className="mb-4 flex items-end justify-between gap-3">
              <h1 className="font-serif text-xl">
                <span className="text-ink">{filtered.length}</span>{" "}
                <span className="text-ink-muted">salles à {city}</span>
              </h1>
              <ViewToggle value={view} onChange={setView} />
            </div>
            {listings.length === 0 ? (
              <EmptyState
                onReset={() => {
                  setPriceTier("any");
                  setFilters(defaultFilters);
                  setGuests(undefined);
                }}
              />
            ) : view === "grid" ? (
              <div className="grid grid-cols-1 gap-5">
                {listings.map((l) => (
                  <ListingCard key={l.id} listing={l} size="md" />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {listings.map((l) => (
                  <ListingRow key={l.id} listing={l} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="fixed inset-0 top-[112px] bottom-16 z-20">
            <VenueMap listings={listings} activeId={activeId} onSelectListing={setActiveId} />
            {activeId && (
              <div className="absolute inset-x-4 bottom-4 bg-card rounded-xl shadow-e2 border border-hairline p-4">
                <button
                  type="button"
                  onClick={() => setActiveId(null)}
                  aria-label="Fermer"
                  className="absolute right-2 top-2 p-1.5 text-ink-muted"
                >
                  <X className="h-4 w-4" />
                </button>
                {(() => {
                  const l = listings.find((x) => x.id === activeId);
                  if (!l) return null;
                  return <ListingCard listing={l} size="sm" />;
                })()}
              </div>
            )}
          </div>
        )}
        <button
          type="button"
          onClick={() => setMobileView(mobileView === "list" ? "map" : "list")}
          className={cn(
            "fixed left-1/2 -translate-x-1/2 z-30 inline-flex items-center gap-2 rounded-pill bg-ink px-5 py-2.5 text-sm font-semibold text-surface shadow-e2",
            // pin above bottom-nav (h-16) with safe margin
            "bottom-[84px]",
          )}
        >
          {mobileView === "list" ? (
            <>
              <MapIcon className="h-4 w-4" strokeWidth={1.75} />
              Carte
            </>
          ) : (
            <>
              <ListIcon className="h-4 w-4" strokeWidth={1.75} />
              Liste
            </>
          )}
        </button>
      </div>

      <GuestsDialog
        open={guestsOpen}
        onOpenChange={setGuestsOpen}
        value={guests}
        onSubmit={(n) => setGuests(n)}
        onClear={() => setGuests(undefined)}
      />
    </>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="col-span-2 flex flex-col items-center justify-center gap-4 py-24 text-center">
      <Sparkles className="h-8 w-8 text-garnet" strokeWidth={1.25} />
      <div className="space-y-1">
        <h2 className="font-serif text-xl text-ink">Aucune salle ne correspond</h2>
        <p className="text-sm text-ink-muted max-w-md">
          Essayez d'élargir vos critères. Vous pouvez aussi nous laisser vos préférences et nous vous alerterons.
        </p>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="rounded-pill border border-hairline bg-card px-4 py-2 text-sm font-medium hover:border-ink"
      >
        Réinitialiser les filtres
      </button>
    </div>
  );
}

// helper used only by badges rendering below if needed later
export const __badges = venueBadges;
