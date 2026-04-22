"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { StarRating } from "@/components/ui/star-rating";
import { cn } from "@/lib/utils";
import type { ListingSummary } from "@/lib/types";
import { useState } from "react";

interface Props {
  listing: ListingSummary;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ListingCard({ listing, size = "md", className }: Props) {
  const [saved, setSaved] = useState(false);
  const href =
    listing.kind === "venue" ? `/salles/${listing.slug}` : `/prestataires/${listing.slug}`;
  const imgH =
    size === "sm" ? "h-40 md:h-48" : size === "md" ? "h-56 md:h-60" : "h-72 md:h-80";

  return (
    <article
      className={cn(
        "group relative flex flex-col gap-3",
        className,
      )}
    >
      <Link href={href} className="relative block overflow-hidden rounded-lg">
        <div className={cn("w-full relative", imgH, listing.photos[0]?.fallback)}>
          {listing.photos.length > 1 && (
            <>
              <span className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500", listing.photos[1].fallback)} />
            </>
          )}
          {/* subtle vignette */}
          <span className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent" />
          {listing.priceTier && (
            <span className="absolute top-3 left-3 inline-flex items-center rounded-pill bg-surface/95 px-2 py-1 text-[11px] font-semibold tracking-wide text-ink">
              {listing.priceTier}
            </span>
          )}
        </div>
      </Link>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setSaved((s) => !s);
        }}
        aria-label={saved ? "Retirer des favoris" : "Ajouter aux favoris"}
        aria-pressed={saved}
        className={cn(
          "absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-surface/95 backdrop-blur-sm transition-transform hover:scale-105",
          saved && "text-garnet",
        )}
      >
        <Heart
          strokeWidth={1.75}
          className={cn("h-4 w-4", saved && "fill-current text-garnet")}
        />
      </button>

      <div className="min-w-0">
        <Link href={href} className="group/link">
          <h3 className="font-serif text-lg leading-tight text-ink truncate group-hover/link:underline underline-offset-4">
            {listing.name}
          </h3>
        </Link>
        <p className="text-sm text-ink-muted truncate">
          {listing.neighborhood ? `${listing.neighborhood} · ${listing.city}` : listing.city}
        </p>
        {listing.badges.length > 0 && (
          <p className="mt-2 text-xs text-ink-muted line-clamp-1">
            {listing.badges.join(" · ")}
          </p>
        )}
        {listing.reviewCount > 0 && (
          <div className="mt-2 flex items-center gap-2 text-xs text-ink">
            <StarRating value={listing.rating} size="xs" />
            <span className="font-medium">{listing.rating.toFixed(1)}</span>
            <span className="text-ink-muted">({listing.reviewCount})</span>
          </div>
        )}
        {listing.priceHint && (
          <p className="mt-1 text-sm text-ink">
            <span className="font-medium">{listing.priceHint}</span>
            <span className="text-ink-muted"> · tout compris</span>
          </p>
        )}
      </div>
    </article>
  );
}
