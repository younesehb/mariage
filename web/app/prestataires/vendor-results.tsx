"use client";

import { useMemo, useState } from "react";
import { ListingCard } from "@/components/listing-card";
import { FilterPill } from "@/components/filter-pill";
import { vendorToListing, CATEGORY_LABELS_FR } from "@/lib/fixtures";
import type { Vendor } from "@/lib/types";

const cities = ["Toutes", "Bruxelles", "Antwerpen", "Gent", "Liège", "Charleroi"];
const categories: Array<Vendor["category"] | "all"> = [
  "all",
  "traiteur",
  "ziana",
  "tayyaba",
  "hennaya",
  "nasheed",
  "photographer",
  "negafa",
  "videographer",
];

export function VendorResults({
  vendors,
  initialCategory,
  initialCity,
}: {
  vendors: Vendor[];
  initialCategory?: Vendor["category"];
  initialCity?: string;
}) {
  const [category, setCategory] = useState<Vendor["category"] | "all">(initialCategory ?? "all");
  const [city, setCity] = useState<string>(initialCity ?? "Toutes");
  const [femaleStaff, setFemaleStaff] = useState(false);

  const filtered = useMemo(() => {
    return vendors.filter((v) => {
      if (v.status !== "published") return false;
      if (category !== "all" && v.category !== category) return false;
      if (city !== "Toutes" && !v.serviceCities.includes(city)) return false;
      if (femaleStaff && !v.femaleStaffAvailable) return false;
      return true;
    });
  }, [vendors, category, city, femaleStaff]);

  return (
    <>
      <div className="sticky top-0 md:top-16 z-30 bg-surface/95 backdrop-blur-md border-b border-hairline">
        <div className="mx-auto max-w-[1280px] px-4 md:px-8 py-4 space-y-3">
          {/* Categories scroller */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none -mx-1 px-1">
            {categories.map((cat) => {
              const active = category === cat;
              const label = cat === "all" ? "Tout" : CATEGORY_LABELS_FR[cat];
              return (
                <FilterPill key={cat} active={active} onClick={() => setCategory(cat)}>
                  {label}
                </FilterPill>
              );
            })}
          </div>
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
            <FilterPill active={femaleStaff} onClick={() => setFemaleStaff(!femaleStaff)}>
              Personnel féminin
            </FilterPill>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 md:px-8 py-6">
        <h1 className="font-serif text-2xl md:text-3xl mb-6">
          <span className="text-ink">{filtered.length}</span>{" "}
          <span className="text-ink-muted">
            {category === "all" ? "prestataires" : CATEGORY_LABELS_FR[category].toLowerCase() + "s"}
            {city !== "Toutes" ? ` à ${city}` : " en Belgique"}
          </span>
        </h1>
        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-serif text-xl text-ink">Aucun prestataire ne correspond</p>
            <p className="text-sm text-ink-muted mt-2">Essayez une autre catégorie ou ville.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((v) => (
              <ListingCard key={v.id} listing={vendorToListing(v)} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
