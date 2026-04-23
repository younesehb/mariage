"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Map, {
  Marker,
  NavigationControl,
  Popup,
  type MapRef,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { Heart, Star, X as XIcon, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ListingSummary } from "@/lib/types";

// OSM tile style — no token needed.
const OSM_STYLE = {
  version: 8 as const,
  sources: {
    osm: {
      type: "raster" as const,
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors",
    },
  },
  layers: [{ id: "osm", type: "raster" as const, source: "osm" }],
};

interface Props {
  listings: ListingSummary[];
  activeId?: string | null;
  onSelectListing?: (id: string | null) => void;
  className?: string;
}

export function VenueMap({ listings, activeId, onSelectListing, className }: Props) {
  const mapRef = useRef<MapRef | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [popupId, setPopupId] = useState<string | null>(null);
  const [saved, setSaved] = useState<Set<string>>(() => new Set());

  const withCoords = useMemo(
    () => listings.filter((l) => l.lat != null && l.lng != null),
    [listings],
  );

  const initialCenter = useMemo(() => {
    if (!withCoords.length) return { lat: 50.8503, lng: 4.3517 }; // Brussels
    const lat = withCoords.reduce((s, l) => s + (l.lat ?? 0), 0) / withCoords.length;
    const lng = withCoords.reduce((s, l) => s + (l.lng ?? 0), 0) / withCoords.length;
    return { lat, lng };
  }, [withCoords]);

  // Fit bounds whenever the result set changes (like Airbnb refitting on filter).
  useEffect(() => {
    const map = mapRef.current;
    if (!map || withCoords.length === 0) return;
    if (withCoords.length === 1) {
      const only = withCoords[0];
      map.easeTo({ center: [only.lng!, only.lat!], zoom: 13, duration: 450 });
      return;
    }
    const lats = withCoords.map((l) => l.lat!);
    const lngs = withCoords.map((l) => l.lng!);
    map.fitBounds(
      [
        [Math.min(...lngs), Math.min(...lats)],
        [Math.max(...lngs), Math.max(...lats)],
      ],
      { padding: 56, duration: 450, maxZoom: 13 },
    );
  }, [withCoords]);

  // When an external selection comes in (hovering a card), fly to it gently.
  useEffect(() => {
    if (!activeId) return;
    const l = withCoords.find((x) => x.id === activeId);
    if (!l) return;
    const map = mapRef.current;
    if (!map) return;
    map.easeTo({ center: [l.lng!, l.lat!], duration: 350 });
  }, [activeId, withCoords]);

  const handleMarkerClick = useCallback(
    (id: string) => {
      setPopupId((curr) => (curr === id ? null : id));
      onSelectListing?.(id);

      // Nudge the marker into the lower third of the viewport so the mini-card,
      // which opens upward, has headroom and doesn't get clipped.
      const map = mapRef.current;
      const l = withCoords.find((x) => x.id === id);
      if (map && l) {
        map.easeTo({
          center: [l.lng!, l.lat!],
          offset: [0, 100],
          duration: 400,
        });
      }
    },
    [onSelectListing, withCoords],
  );

  const closePopup = useCallback(() => {
    setPopupId(null);
    onSelectListing?.(null);
  }, [onSelectListing]);

  const popupListing = popupId ? withCoords.find((l) => l.id === popupId) : null;

  return (
    <div className={cn("relative isolate h-full w-full overflow-hidden", className)}>
      <Map
        ref={mapRef}
        initialViewState={{ latitude: initialCenter.lat, longitude: initialCenter.lng, zoom: 11 }}
        mapStyle={OSM_STYLE}
        attributionControl={false}
        onClick={() => setPopupId(null)}
      >
        <NavigationControl position="bottom-right" showCompass={false} />

        {withCoords.map((l) => {
          const isActive = activeId === l.id || popupId === l.id;
          const isHovered = hoverId === l.id;
          return (
            <Marker
              key={l.id}
              latitude={l.lat!}
              longitude={l.lng!}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                handleMarkerClick(l.id);
              }}
              style={{ zIndex: isActive ? 3 : isHovered ? 2 : 1 }}
            >
              <PriceMarker
                listing={l}
                active={isActive}
                onMouseEnter={() => {
                  setHoverId(l.id);
                  onSelectListing?.(l.id);
                }}
                onMouseLeave={() => {
                  setHoverId(null);
                }}
              />
            </Marker>
          );
        })}

        {popupListing && (
          <Popup
            latitude={popupListing.lat!}
            longitude={popupListing.lng!}
            offset={20}
            closeButton={false}
            closeOnClick={false}
            maxWidth="none"
            className="zaffa-map-popup"
          >
            <ListingMiniCard
              listing={popupListing}
              saved={saved.has(popupListing.id)}
              onToggleSave={() =>
                setSaved((s) => {
                  const next = new Set(s);
                  if (next.has(popupListing.id)) next.delete(popupListing.id);
                  else next.add(popupListing.id);
                  return next;
                })
              }
              onClose={closePopup}
            />
          </Popup>
        )}
      </Map>
      <div className="pointer-events-none absolute bottom-1 left-2 text-[10px] text-ink/60">
        © OpenStreetMap
      </div>

      {/* Popup styling overrides for maplibre's default container */}
      <style jsx global>{`
        .zaffa-map-popup {
          z-index: 50 !important;
        }
        .zaffa-map-popup .maplibregl-popup-content {
          padding: 0 !important;
          background: transparent !important;
          box-shadow: none !important;
          border-radius: 16px !important;
        }
        .zaffa-map-popup .maplibregl-popup-tip {
          display: none !important;
        }
      `}</style>
    </div>
  );
}

function PriceMarker({
  listing,
  active,
  onMouseEnter,
  onMouseLeave,
}: {
  listing: ListingSummary;
  active: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  // Prefer concrete priceHint ("12 000 €") — fall back to tier, then rating.
  const primary = listing.priceHint ?? listing.priceTier ?? "·";
  return (
    <button
      type="button"
      aria-label={`Voir ${listing.name}`}
      aria-pressed={active}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onMouseEnter}
      onBlur={onMouseLeave}
      className={cn(
        "relative inline-flex items-center gap-1 rounded-pill border px-3 py-1 text-xs font-semibold shadow-e1 transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-e2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2",
        active
          ? "bg-ink text-surface border-ink scale-[1.15] shadow-e2"
          : "bg-surface text-ink border-hairline hover:border-ink",
      )}
    >
      <span className="whitespace-nowrap tabular-nums">{primary}</span>
      {listing.rating > 0 && (
        <span
          className={cn(
            "ml-0.5 inline-flex items-center gap-0.5 text-[10px] font-medium",
            active ? "text-surface/80" : "text-ink-muted",
          )}
        >
          <Star
            className={cn("h-2.5 w-2.5", active ? "fill-surface stroke-surface" : "fill-garnet stroke-garnet")}
            strokeWidth={1.5}
          />
          {listing.rating.toFixed(1)}
        </span>
      )}
    </button>
  );
}

function ListingMiniCard({
  listing,
  saved,
  onToggleSave,
  onClose,
}: {
  listing: ListingSummary;
  saved: boolean;
  onToggleSave: () => void;
  onClose: () => void;
}) {
  const href =
    listing.kind === "venue" ? `/salles/${listing.slug}` : `/prestataires/${listing.slug}`;
  const thumb = listing.photos[0]?.fallback ?? "photo-fallback";
  return (
    <article
      className={cn(
        "w-64 overflow-hidden rounded-2xl border border-hairline bg-card shadow-e2",
        "animate-in fade-in-0 zoom-in-95 duration-200",
      )}
    >
      <Link href={href} className="relative block">
        <span className={cn("block h-32 w-full", thumb)} />
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
        {listing.priceTier && (
          <span className="absolute top-2 left-2 inline-flex items-center rounded-pill bg-white/95 px-2 py-0.5 text-[11px] font-semibold text-ink">
            {listing.priceTier}
          </span>
        )}
      </Link>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleSave();
        }}
        aria-label={saved ? "Retirer des favoris" : "Ajouter aux favoris"}
        aria-pressed={saved}
        className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/95 text-ink shadow-e1 hover:bg-white"
      >
        <Heart
          strokeWidth={1.75}
          className={cn("h-4 w-4", saved && "fill-garnet stroke-garnet")}
        />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }}
        aria-label="Fermer"
        className="absolute left-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/55 text-white backdrop-blur hover:bg-black/70"
      >
        <XIcon className="h-3.5 w-3.5" strokeWidth={2} />
      </button>

      <Link href={href} className="block p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="min-w-0 truncate font-serif text-[15px] leading-tight text-ink">
            {listing.name}
          </h3>
          {listing.rating > 0 && (
            <span className="shrink-0 inline-flex items-center gap-1 text-xs text-ink">
              <Star className="h-3 w-3 fill-garnet stroke-garnet" strokeWidth={1.5} />
              <span className="font-medium">{listing.rating.toFixed(1)}</span>
              <span className="text-ink-muted">({listing.reviewCount})</span>
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs text-ink-muted truncate">
          {listing.neighborhood ? `${listing.neighborhood} · ${listing.city}` : listing.city}
        </p>

        {listing.badges.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {listing.badges.slice(0, 3).map((b) => (
              <span
                key={b}
                className="inline-flex items-center rounded-pill border border-hairline bg-surface-muted/60 px-1.5 py-0.5 text-[10px] font-medium text-ink-muted"
              >
                {b}
              </span>
            ))}
          </div>
        )}

        <div className="mt-2.5 flex items-center justify-between">
          <span className="text-sm text-ink">
            {listing.priceHint ? (
              <>
                <span className="font-semibold">{listing.priceHint}</span>{" "}
                <span className="text-[11px] text-ink-muted">tout compris</span>
              </>
            ) : (
              <span className="text-xs text-ink-muted">Sur demande</span>
            )}
          </span>
          <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-garnet">
            Voir la fiche
            <ArrowRight className="h-3 w-3" strokeWidth={2} />
          </span>
        </div>
      </Link>
    </article>
  );
}

export type { MapRef };
