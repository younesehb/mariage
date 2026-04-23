"use client";

import Link from "next/link";
import { Heart, Star, MapPin, Users, ExternalLink } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ListingSummary } from "@/lib/types";

export function ListingRow({ listing }: { listing: ListingSummary }) {
  const [saved, setSaved] = useState(false);
  const href =
    listing.kind === "venue" ? `/salles/${listing.slug}` : `/prestataires/${listing.slug}`;

  return (
    <article className="group relative flex gap-4 md:gap-5 rounded-xl border border-hairline bg-card p-3 md:p-4 hover:border-ink-muted hover:shadow-e1 transition-all">
      <Link
        href={href}
        className={cn(
          "relative block shrink-0 overflow-hidden rounded-lg",
          "h-28 w-28 md:h-40 md:w-56",
          listing.photos[0]?.fallback,
        )}
        aria-label={listing.name}
      >
        {listing.photos.length > 1 && (
          <span
            className={cn(
              "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
              listing.photos[1].fallback,
            )}
          />
        )}
        <span className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent" />
        {listing.priceTier && (
          <span className="absolute top-2 left-2 inline-flex items-center rounded-pill bg-surface/95 px-1.5 py-0.5 text-[10px] font-semibold text-ink">
            {listing.priceTier}
          </span>
        )}
      </Link>

      <div className="min-w-0 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={href}>
              <h3 className="font-serif text-lg md:text-xl leading-tight text-ink truncate group-hover:underline underline-offset-4">
                {listing.name}
              </h3>
            </Link>
            <p className="mt-0.5 text-sm text-ink-muted truncate inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" strokeWidth={1.5} />
              {listing.neighborhood ? `${listing.neighborhood} · ${listing.city}` : listing.city}
            </p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setSaved((s) => !s);
            }}
            aria-label={saved ? "Retirer des favoris" : "Ajouter aux favoris"}
            aria-pressed={saved}
            className="p-1.5 text-ink-muted hover:text-garnet transition-colors"
          >
            <Heart
              strokeWidth={1.75}
              className={cn("h-4 w-4 md:h-5 md:w-5", saved && "fill-current text-garnet")}
            />
          </button>
        </div>

        {listing.badges.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5 md:gap-2">
            {listing.badges.slice(0, 4).map((b) => (
              <span
                key={b}
                className="inline-flex items-center rounded-pill border border-hairline bg-surface-muted/60 px-2 py-0.5 text-[11px] font-medium text-ink-muted"
              >
                {b}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-3 flex items-end justify-between gap-3">
          <div className="min-w-0">
            {listing.reviewCount > 0 ? (
              <div className="flex items-center gap-1.5 text-sm text-ink">
                <Star className="h-3.5 w-3.5 fill-garnet stroke-garnet" strokeWidth={1.5} />
                <span className="font-medium">{listing.rating.toFixed(1)}</span>
                <span className="text-ink-muted">({listing.reviewCount} avis)</span>
              </div>
            ) : (
              <span className="text-xs text-ink-muted">Nouveau</span>
            )}
            {listing.priceHint && (
              <p className="mt-0.5 text-sm text-ink">
                <span className="font-medium">{listing.priceHint}</span>{" "}
                <span className="text-ink-muted text-xs">tout compris</span>
              </p>
            )}
          </div>
          <Link
            href={href}
            className="hidden md:inline-flex items-center gap-1.5 rounded-pill border border-hairline bg-card px-3 py-1.5 text-xs font-medium text-ink hover:border-ink shrink-0"
          >
            Voir la fiche
            <ExternalLink className="h-3 w-3" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </article>
  );
}
