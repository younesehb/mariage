"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search, SlidersHorizontal, Star, X } from "lucide-react";
import { vendorToListing, reviewsFor, avgRating } from "@/lib/fixtures";
import { CATEGORIES, CATEGORY_ORDER, CUISINE_TAGS } from "@/lib/category-meta";
import type { Vendor, VendorCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

const cities = ["Toutes", "Bruxelles", "Antwerpen", "Gent", "Liège", "Charleroi"];

type Sort = "rating" | "reviews" | "name";

export function VendorResults({
  vendors,
  initialCategory,
  initialCity,
}: {
  vendors: Vendor[];
  initialCategory?: Vendor["category"];
  initialCity?: string;
}) {
  const [category, setCategory] = useState<Vendor["category"] | null>(initialCategory ?? null);
  const [city, setCity] = useState<string>(initialCity ?? "Toutes");
  const [femaleStaff, setFemaleStaff] = useState(false);
  const [halalOnly, setHalalOnly] = useState(false);
  const [cuisineTags, setCuisineTags] = useState<string[]>([]);
  const [priceMax, setPriceMax] = useState<number | null>(null);
  const [minRating, setMinRating] = useState<number>(0);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("rating");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const withMeta = useMemo(
    () =>
      vendors.map((v) => {
        const rs = reviewsFor("vendor", v.id);
        return {
          vendor: v,
          rating: avgRating(rs),
          reviewCount: rs.length,
        };
      }),
    [vendors],
  );

  const filtered = useMemo(() => {
    const result = withMeta.filter(({ vendor: v, rating }) => {
      if (v.status !== "published") return false;
      if (category && v.category !== category) return false;
      if (city !== "Toutes" && !v.serviceCities.includes(city)) return false;
      if (femaleStaff && !v.femaleStaffAvailable) return false;
      if (halalOnly) {
        if (v.category !== "traiteur") return false;
        if (!v.halalCertified) return false;
      }
      if (cuisineTags.length > 0) {
        if (v.category !== "traiteur") return false;
        const tags = v.cuisineTags ?? [];
        if (!cuisineTags.some((t) => tags.includes(t))) return false;
      }
      if (priceMax != null && v.category === "traiteur") {
        if ((v.pricePerGuestMin ?? Infinity) > priceMax) return false;
      }
      if (minRating > 0 && rating < minRating) return false;
      if (q.trim()) {
        const needle = q.toLowerCase();
        const hay =
          v.name.toLowerCase() +
          " " +
          v.description.fr.toLowerCase() +
          " " +
          v.serviceCities.join(" ").toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });

    result.sort((a, b) => {
      if (sort === "rating") {
        if (b.rating !== a.rating) return b.rating - a.rating;
        return b.reviewCount - a.reviewCount;
      }
      if (sort === "reviews") return b.reviewCount - a.reviewCount;
      return a.vendor.name.localeCompare(b.vendor.name);
    });

    return result.map(({ vendor }) => vendor);
  }, [withMeta, category, city, femaleStaff, halalOnly, cuisineTags, priceMax, minRating, q, sort]);

  const activeFilterCount =
    (halalOnly ? 1 : 0) +
    (femaleStaff ? 1 : 0) +
    (cuisineTags.length > 0 ? 1 : 0) +
    (priceMax != null ? 1 : 0) +
    (minRating > 0 ? 1 : 0);

  const catMeta = category ? CATEGORIES[category] : null;
  const countForCategory = (cat: VendorCategory) =>
    vendors.filter((v) => v.category === cat && v.status === "published").length;

  function resetFilters() {
    setFemaleStaff(false);
    setHalalOnly(false);
    setCuisineTags([]);
    setPriceMax(null);
    setMinRating(0);
  }

  return (
    <>
      {/* Category landing (no category picked) */}
      {!category && (
        <section className="mx-auto max-w-[1280px] px-6 md:px-10 pt-10 md:pt-16 pb-6">
          <div className="text-xs uppercase tracking-widest text-garnet font-semibold">Prestataires</div>
          <h1 className="mt-1 font-serif text-4xl md:text-5xl leading-[1.05] text-ink max-w-2xl">
            Tout ce qui fait un <span className="italic text-garnet">mariage marocain</span>.
          </h1>
          <p className="mt-4 text-ink/80 max-w-xl">
            Sélectionnez une catégorie pour découvrir les prestataires disponibles en Belgique.
          </p>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORY_ORDER.map((cat) => {
              const meta = CATEGORIES[cat];
              const Icon = meta.icon;
              const count = countForCategory(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className="group text-left rounded-xl border border-hairline bg-card p-5 transition-all hover:border-ink hover:-translate-y-0.5 hover:shadow-e1"
                >
                  <div
                    className={cn(
                      "h-11 w-11 rounded-lg grid place-items-center mb-4",
                      meta.tint,
                    )}
                    aria-hidden
                  >
                    <Icon className={cn("h-5 w-5", meta.accentFg)} strokeWidth={1.5} />
                  </div>
                  <div className="font-serif text-xl text-ink leading-tight">{meta.labelFr}</div>
                  <p className="mt-1 text-xs text-ink-muted leading-relaxed line-clamp-2">
                    {meta.taglineFr}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                      {count} prestataire{count > 1 ? "s" : ""}
                    </span>
                    <ArrowUpRight
                      className="h-4 w-4 text-ink-muted group-hover:text-garnet group-hover:rotate-12 transition-all"
                      strokeWidth={1.5}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Category hero (category selected) */}
      {catMeta && (
        <section className="border-b border-hairline bg-surface-muted/40">
          <div className="mx-auto max-w-[1280px] px-4 md:px-8 py-8 md:py-10">
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "h-14 w-14 rounded-xl grid place-items-center shrink-0",
                  catMeta.tint,
                )}
                aria-hidden
              >
                <catMeta.icon className={cn("h-7 w-7", catMeta.accentFg)} strokeWidth={1.25} />
              </div>
              <div className="min-w-0">
                <div className="text-xs uppercase tracking-widest text-garnet font-semibold">
                  Prestataires
                </div>
                <h1 className="mt-1 font-serif text-3xl md:text-4xl text-ink leading-tight">
                  {catMeta.labelFr}
                  <span className="text-ink-muted font-normal">s</span>
                </h1>
                <p className="mt-2 text-sm md:text-base text-ink/80 max-w-2xl leading-relaxed">
                  {catMeta.descriptionFr}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Category pill row */}
      <div className="sticky top-0 md:top-16 z-30 bg-surface/95 backdrop-blur-md border-b border-hairline">
        <div className="mx-auto max-w-[1280px] px-4 md:px-8">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-3">
            <button
              type="button"
              onClick={() => setCategory(null)}
              className={cn(
                "inline-flex items-center gap-1.5 whitespace-nowrap rounded-pill border px-3 py-1.5 text-sm font-medium transition-colors min-h-[40px]",
                category === null
                  ? "border-ink bg-ink text-surface"
                  : "border-hairline bg-card text-ink hover:border-ink-muted",
              )}
            >
              Tout
              <span className={cn("text-xs", category === null ? "opacity-70" : "text-ink-muted")}>
                {vendors.length}
              </span>
            </button>
            {CATEGORY_ORDER.map((cat) => {
              const meta = CATEGORIES[cat];
              const Icon = meta.icon;
              const active = category === cat;
              const count = countForCategory(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={cn(
                    "inline-flex items-center gap-1.5 whitespace-nowrap rounded-pill border px-3 py-1.5 text-sm font-medium transition-colors min-h-[40px]",
                    active
                      ? "border-ink bg-ink text-surface"
                      : "border-hairline bg-card text-ink hover:border-ink-muted",
                  )}
                >
                  <Icon
                    className={cn("h-3.5 w-3.5", active ? "opacity-90" : meta.accentFg)}
                    strokeWidth={1.75}
                  />
                  <span>{meta.labelFr}</span>
                  <span className={cn("text-xs", active ? "opacity-70" : "text-ink-muted")}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Secondary filter bar */}
      <div className="border-b border-hairline bg-surface">
        <div className="mx-auto max-w-[1280px] px-4 md:px-8 py-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            <label className="relative flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Rechercher…"
                className="w-56 max-w-full rounded-pill border border-hairline bg-card pl-9 pr-3 py-2 text-sm outline-none focus:border-ink min-h-[40px]"
              />
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="flex-none min-h-[40px] rounded-pill border border-hairline bg-card px-4 text-sm font-medium"
              aria-label="Ville"
            >
              {cities.map((c) => (
                <option key={c}>{c === "Toutes" ? "Toutes villes" : c}</option>
              ))}
            </select>
            <TogglePill
              active={femaleStaff}
              onClick={() => setFemaleStaff(!femaleStaff)}
              label="Personnel féminin"
            />
            {(category === "traiteur" || category === null) && (
              <TogglePill
                active={halalOnly}
                onClick={() => setHalalOnly(!halalOnly)}
                label="Halal certifié"
              />
            )}
            <RatingPill value={minRating} onChange={setMinRating} />
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-pill border px-3 py-2 text-sm font-medium min-h-[40px] whitespace-nowrap",
                activeFilterCount > 0
                  ? "border-ink bg-ink text-surface"
                  : "border-hairline bg-card text-ink hover:border-ink-muted",
              )}
            >
              <SlidersHorizontal className="h-4 w-4" strokeWidth={1.75} />
              Filtres
              {activeFilterCount > 0 && (
                <span className="ml-0.5 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-garnet text-white text-[11px] font-semibold px-1">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <div className="ml-auto">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="min-h-[40px] rounded-pill border border-hairline bg-card px-4 text-sm font-medium"
                aria-label="Trier"
              >
                <option value="rating">Mieux notés</option>
                <option value="reviews">Plus d&apos;avis</option>
                <option value="name">Ordre alphabétique</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto max-w-[1280px] px-4 md:px-8 py-8">
        <div className="mb-5 flex items-baseline justify-between gap-4">
          <p className="text-sm text-ink">
            <span className="font-medium">{filtered.length}</span>{" "}
            <span className="text-ink-muted">
              résultat{filtered.length > 1 ? "s" : ""}
              {city !== "Toutes" ? ` à ${city}` : ""}
            </span>
          </p>
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-medium text-garnet underline underline-offset-4"
            >
              Effacer les filtres
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <p className="font-serif text-xl text-ink">Aucun prestataire ne correspond</p>
            <p className="text-sm text-ink-muted">
              Essayez d&apos;élargir vos critères ou de changer de ville.
            </p>
            <button
              type="button"
              onClick={() => {
                resetFilters();
                setCategory(null);
                setCity("Toutes");
                setQ("");
              }}
              className="inline-flex items-center rounded-pill border border-hairline bg-card px-4 py-2 text-sm font-medium hover:border-ink"
            >
              Tout réinitialiser
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((v) => (
              <VendorCard key={v.id} vendor={v} />
            ))}
          </div>
        )}
      </div>

      {/* Extra filter drawer */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30"
          onClick={() => setDrawerOpen(false)}
          role="dialog"
        >
          <aside
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-surface shadow-e3 overflow-y-auto"
          >
            <header className="sticky top-0 bg-surface/95 backdrop-blur-md border-b border-hairline px-5 py-4 flex items-center justify-between">
              <h2 className="font-serif text-xl">Filtres avancés</h2>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Fermer"
                className="p-1.5 text-ink-muted hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="px-5 py-5 space-y-6">
              {(category === "traiteur" || category === null) && (
                <>
                  <Section title="Cuisine" hint="Sélectionnez un ou plusieurs styles">
                    <div className="flex flex-wrap gap-2">
                      {CUISINE_TAGS.map((t) => {
                        const active = cuisineTags.includes(t);
                        return (
                          <button
                            key={t}
                            type="button"
                            onClick={() =>
                              setCuisineTags((prev) =>
                                active ? prev.filter((x) => x !== t) : [...prev, t],
                              )
                            }
                            aria-pressed={active}
                            className={cn(
                              "rounded-pill border px-3 py-1.5 text-sm font-medium transition-colors min-h-[36px]",
                              active
                                ? "border-garnet bg-garnet-soft text-garnet"
                                : "border-hairline bg-card text-ink hover:border-ink-muted",
                            )}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </Section>

                  <Section title="Budget par invité (max)">
                    <div className="flex flex-wrap gap-2">
                      {[null, 80, 100, 120, 150].map((p) => (
                        <button
                          key={String(p)}
                          type="button"
                          onClick={() => setPriceMax(p)}
                          className={cn(
                            "rounded-pill border px-3 py-1.5 text-sm font-medium min-h-[36px]",
                            priceMax === p
                              ? "border-ink bg-ink text-surface"
                              : "border-hairline bg-card text-ink hover:border-ink-muted",
                          )}
                        >
                          {p === null ? "Tous" : `≤ €${p}`}
                        </button>
                      ))}
                    </div>
                  </Section>
                </>
              )}

              <Section title="Note minimale">
                <div className="flex flex-wrap gap-2">
                  {[0, 3, 4, 4.5].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setMinRating(r)}
                      className={cn(
                        "rounded-pill border px-3 py-1.5 text-sm font-medium min-h-[36px] inline-flex items-center gap-1",
                        minRating === r
                          ? "border-ink bg-ink text-surface"
                          : "border-hairline bg-card text-ink hover:border-ink-muted",
                      )}
                    >
                      {r === 0 ? (
                        "Toutes"
                      ) : (
                        <>
                          <Star
                            className={cn(
                              "h-3 w-3",
                              minRating === r ? "fill-current" : "fill-garnet stroke-garnet",
                            )}
                            strokeWidth={1.5}
                          />
                          {r}+
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </Section>
            </div>

            <footer className="sticky bottom-0 bg-surface border-t border-hairline px-5 py-4 flex items-center justify-between">
              <button
                type="button"
                onClick={resetFilters}
                className="text-sm font-medium underline underline-offset-4 text-ink"
              >
                Réinitialiser
              </button>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="rounded-pill bg-garnet text-white px-6 py-2.5 text-sm font-semibold hover:bg-garnet-hover"
              >
                Appliquer ({filtered.length})
              </button>
            </footer>
          </aside>
        </div>
      )}
    </>
  );
}

function TogglePill({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-pill border px-3 py-2 text-sm font-medium min-h-[40px]",
        active
          ? "border-ink bg-ink text-surface"
          : "border-hairline bg-card text-ink hover:border-ink-muted",
      )}
    >
      {label}
    </button>
  );
}

function RatingPill({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const active = value > 0;
  return (
    <button
      type="button"
      onClick={() => onChange(active ? 0 : 4)}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-pill border px-3 py-2 text-sm font-medium min-h-[40px]",
        active
          ? "border-ink bg-ink text-surface"
          : "border-hairline bg-card text-ink hover:border-ink-muted",
      )}
    >
      <Star
        className={cn("h-3.5 w-3.5", active ? "fill-current" : "fill-garnet stroke-garnet")}
        strokeWidth={1.5}
      />
      {active ? `${value}+` : "Note"}
    </button>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-ink-muted">{title}</div>
        {hint && <div className="text-[11px] text-ink-muted/80 mt-0.5">{hint}</div>}
      </div>
      {children}
    </section>
  );
}

function VendorCard({ vendor: v }: { vendor: Vendor }) {
  const meta = CATEGORIES[v.category];
  const Icon = meta.icon;
  const listing = vendorToListing(v);
  return (
    <article className="group relative flex flex-col gap-3">
      <Link href={`/prestataires/${v.slug}`} className="relative block overflow-hidden rounded-lg">
        <div className={cn("w-full relative h-56 md:h-60", v.photos[0]?.fallback)}>
          <span className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/25 to-transparent" />
          <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-pill bg-surface/95 px-2.5 py-1 text-[11px] font-semibold text-ink">
            <Icon className={cn("h-3.5 w-3.5", meta.accentFg)} strokeWidth={1.75} />
            {meta.labelFr}
          </div>
          {v.claimStatus === "claimed" && (
            <div className="absolute top-3 right-3 inline-flex items-center rounded-pill bg-ink/85 backdrop-blur-sm px-2 py-0.5 text-[10px] font-semibold text-surface">
              Vérifié
            </div>
          )}
        </div>
      </Link>
      <div className="min-w-0">
        <Link href={`/prestataires/${v.slug}`}>
          <h3 className="font-serif text-lg leading-tight text-ink truncate group-hover:underline underline-offset-4">
            {v.name}
          </h3>
        </Link>
        <p className="text-sm text-ink-muted truncate">{v.serviceCities.join(", ")}</p>
        {listing.badges.length > 0 && (
          <p className="mt-1.5 text-xs text-ink-muted line-clamp-1">
            {listing.badges.join(" · ")}
          </p>
        )}
        {listing.reviewCount > 0 ? (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-ink">
            <Star className="h-3 w-3 fill-garnet stroke-garnet" strokeWidth={1.5} />
            <span className="font-medium">{listing.rating.toFixed(1)}</span>
            <span className="text-ink-muted">({listing.reviewCount})</span>
          </div>
        ) : (
          <p className="mt-2 text-xs text-ink-muted">Nouveau · pas encore d&apos;avis</p>
        )}
      </div>
    </article>
  );
}
