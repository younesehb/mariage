"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, Check, ExternalLink, MapPin, Users, Star, Clock, Utensils, Truck } from "lucide-react";
import { CATEGORIES } from "@/lib/category-meta";
import { reviewsFor, avgRating, socialsFor, recentPostsFor, venueBadges } from "@/lib/fixtures";
import { SocialLinks } from "@/components/social-links";
import { StarRating } from "@/components/ui/star-rating";
import type { Venue, Vendor } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PeekProps {
  open: boolean;
  onClose: () => void;
  onPick: () => void;
  alreadyPicked: boolean;
}

type Subject =
  | { kind: "venue"; venue: Venue }
  | { kind: "vendor"; vendor: Vendor };

export function PeekDrawer({
  open,
  onClose,
  onPick,
  alreadyPicked,
  subject,
}: PeekProps & { subject: Subject | null }) {
  // Close on ESC
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || !subject) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40 animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <aside
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-surface h-full overflow-y-auto shadow-e3 animate-in slide-in-from-right-6 duration-300"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="sticky top-4 left-[calc(100%-3rem)] z-10 grid h-9 w-9 place-items-center rounded-full bg-surface/95 backdrop-blur-sm border border-hairline text-ink-muted hover:text-ink hover:border-ink transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {subject.kind === "venue" ? (
          <VenuePeek venue={subject.venue} />
        ) : (
          <VendorPeek vendor={subject.vendor} />
        )}

        {/* Sticky CTA footer */}
        <footer className="sticky bottom-0 border-t border-hairline bg-surface/95 backdrop-blur-md px-6 py-4 flex items-center gap-3">
          <Link
            href={
              subject.kind === "venue"
                ? `/salles/${subject.venue.slug}`
                : `/prestataires/${subject.vendor.slug}`
            }
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-lg border border-hairline bg-card px-4 py-2.5 text-sm font-medium text-ink hover:border-ink"
          >
            Fiche complète
            <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.5} />
          </Link>
          <button
            type="button"
            onClick={() => {
              onPick();
              onClose();
            }}
            className={cn(
              "flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-colors",
              alreadyPicked
                ? "bg-surface-muted text-ink border border-hairline"
                : "bg-garnet text-white hover:bg-garnet-hover",
            )}
          >
            {alreadyPicked ? (
              <>
                <Check className="h-4 w-4" strokeWidth={2.5} />
                Déjà choisi
              </>
            ) : (
              <>
                Choisir
                <Check className="h-4 w-4" strokeWidth={2.5} />
              </>
            )}
          </button>
        </footer>
      </aside>
    </div>
  );
}

function VenuePeek({ venue }: { venue: Venue }) {
  const rs = reviewsFor("venue", venue.id);
  const rating = avgRating(rs);
  const social = socialsFor(venue.id);
  const posts = recentPostsFor(venue.id);

  return (
    <>
      {/* Photo mosaic */}
      <div className="h-56 md:h-72 grid grid-cols-4 grid-rows-2 gap-1">
        {venue.photos.slice(0, 5).map((p, i) => (
          <div
            key={i}
            className={cn(
              "relative",
              p.fallback,
              i === 0 ? "col-span-2 row-span-2" : "",
            )}
          />
        ))}
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Header */}
        <header className="space-y-2">
          <div className="inline-flex items-center gap-1 text-xs text-ink-muted">
            <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} />
            {venue.neighborhood} · {venue.city}
          </div>
          <h2 className="font-serif text-3xl leading-tight text-ink">{venue.name}</h2>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {rs.length > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <StarRating value={rating} size="sm" />
                <span className="font-medium">{rating.toFixed(1)}</span>
                <span className="text-ink-muted">· {rs.length} avis</span>
              </span>
            )}
            <span className="text-ink-muted">·</span>
            <span className="font-medium">{venue.priceTier}</span>
            {venue.priceRangeMin && (
              <span className="text-ink-muted">
                €{venue.priceRangeMin.toLocaleString()}–{venue.priceRangeMax?.toLocaleString()}
              </span>
            )}
          </div>
          {social && <SocialLinks links={social} size="sm" />}
        </header>

        {/* Quick facts */}
        <section className="grid grid-cols-2 gap-3">
          <Fact icon={Users} label="Capacité" value={`${venue.capacityMin}–${venue.capacityMax}`} />
          <Fact
            icon={Clock}
            label="Couvre-feu WE"
            value={venue.noiseCurfewWeekend ?? "Pas de limite"}
          />
          <Fact
            icon={Users}
            label="Séparation H/F"
            value={
              venue.genderSeparation === "strict"
                ? "Stricte"
                : venue.genderSeparation === "separable"
                  ? "Séparable"
                  : "Mixte"
            }
          />
          <Fact
            icon={Users}
            label="Parking"
            value={venue.parkingSpaces ? `${venue.parkingSpaces} places` : "Non précisé"}
          />
        </section>

        {/* Description */}
        <section>
          <p className="text-sm text-ink leading-relaxed">{venue.description.fr}</p>
        </section>

        {/* Badges */}
        <section className="flex flex-wrap gap-1.5">
          {venueBadges(venue).map((b) => (
            <span
              key={b}
              className="inline-flex items-center rounded-pill border border-hairline bg-card px-2.5 py-0.5 text-[11px] font-medium text-ink"
            >
              {b}
            </span>
          ))}
        </section>

        {/* Recent IG snippet */}
        {posts.length > 0 && (
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-2.5">
              Sur Instagram
            </h3>
            <div className="grid grid-cols-4 gap-1.5">
              {posts.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  className={cn("aspect-square rounded-md", p.fallback)}
                  aria-label={p.caption}
                />
              ))}
            </div>
          </section>
        )}

        {/* Top review */}
        {rs[0] && (
          <section className="rounded-xl bg-surface-muted p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <StarRating value={rs[0].rating} size="xs" />
              <span className="text-xs font-medium text-ink">{rs[0].userDisplayName}</span>
            </div>
            <p className="text-sm text-ink leading-relaxed italic">
              « {rs[0].text} »
            </p>
          </section>
        )}
      </div>
    </>
  );
}

function VendorPeek({ vendor }: { vendor: Vendor }) {
  const rs = reviewsFor("vendor", vendor.id);
  const rating = avgRating(rs);
  const social = socialsFor(vendor.id);
  const posts = recentPostsFor(vendor.id);
  const meta = CATEGORIES[vendor.category];
  const Icon = meta.icon;

  return (
    <>
      {/* Portfolio grid */}
      <div className="h-56 md:h-72 grid grid-cols-3 gap-1">
        {Array.from({ length: 3 }).map((_, i) => {
          const p = vendor.photos[i % vendor.photos.length];
          return <div key={i} className={cn("relative", p?.fallback)} />;
        })}
      </div>

      <div className="px-6 py-6 space-y-6">
        <header className="space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-pill border border-hairline bg-card px-2.5 py-0.5 text-[11px] font-semibold text-ink">
            <Icon className={cn("h-3.5 w-3.5", meta.accentFg)} strokeWidth={1.75} />
            {meta.labelFr}
          </div>
          <h2 className="font-serif text-3xl leading-tight text-ink">{vendor.name}</h2>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {rs.length > 0 ? (
              <span className="inline-flex items-center gap-1.5">
                <StarRating value={rating} size="sm" />
                <span className="font-medium">{rating.toFixed(1)}</span>
                <span className="text-ink-muted">· {rs.length} avis</span>
              </span>
            ) : (
              <span className="text-ink-muted">Nouveau · pas encore d&apos;avis</span>
            )}
            <span className="text-ink-muted">·</span>
            <span className="inline-flex items-center gap-1 text-ink-muted">
              <MapPin className="h-3.5 w-3.5" />
              {vendor.serviceCities.join(", ")}
            </span>
          </div>
          {social && <SocialLinks links={social} size="sm" />}
        </header>

        {/* Traiteur-specific facts */}
        {vendor.category === "traiteur" && (
          <section className="grid grid-cols-2 gap-3">
            <Fact icon={Utensils} label="Cuisine" value={vendor.cuisineTags?.join(", ") ?? "—"} />
            <Fact
              icon={Users}
              label="€ / invité"
              value={
                vendor.pricePerGuestMin && vendor.pricePerGuestMax
                  ? `€${vendor.pricePerGuestMin}–${vendor.pricePerGuestMax}`
                  : "Sur demande"
              }
            />
            <Fact
              icon={Truck}
              label="Livraison"
              value={vendor.deliveryRadiusKm ? `${vendor.deliveryRadiusKm} km` : "À confirmer"}
            />
            <Fact
              icon={Star}
              label="Personnel"
              value={vendor.femaleStaffAvailable ? "Féminin dispo" : "Équipe mixte"}
            />
          </section>
        )}

        <section>
          <p className="text-sm text-ink leading-relaxed">{vendor.description.fr}</p>
        </section>

        {/* Recent IG */}
        {posts.length > 0 && (
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-2.5">
              Sur Instagram
            </h3>
            <div className="grid grid-cols-4 gap-1.5">
              {posts.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  className={cn("aspect-square rounded-md", p.fallback)}
                  aria-label={p.caption}
                />
              ))}
            </div>
          </section>
        )}

        {rs[0] && (
          <section className="rounded-xl bg-surface-muted p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <StarRating value={rs[0].rating} size="xs" />
              <span className="text-xs font-medium text-ink">{rs[0].userDisplayName}</span>
            </div>
            <p className="text-sm text-ink leading-relaxed italic">« {rs[0].text} »</p>
          </section>
        )}
      </div>
    </>
  );
}

import type { LucideIcon } from "lucide-react";
function Fact({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="h-4 w-4 text-garnet mt-0.5 shrink-0" strokeWidth={1.5} />
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-wider text-ink-muted">{label}</div>
        <div className="text-sm font-medium text-ink truncate">{value}</div>
      </div>
    </div>
  );
}
