"use client";

import { useState, useMemo } from "react";
import Map, { Marker, NavigationControl, type MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
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
  layers: [
    { id: "osm", type: "raster" as const, source: "osm" },
  ],
};

interface Props {
  listings: ListingSummary[];
  activeId?: string | null;
  onSelectListing?: (id: string) => void;
  className?: string;
}

export function VenueMap({ listings, activeId, onSelectListing, className }: Props) {
  const center = useMemo(() => {
    const withCoords = listings.filter((l) => l.lat != null && l.lng != null);
    if (!withCoords.length) return { lat: 50.8503, lng: 4.3517 }; // Brussels center
    const lat = withCoords.reduce((s, l) => s + (l.lat ?? 0), 0) / withCoords.length;
    const lng = withCoords.reduce((s, l) => s + (l.lng ?? 0), 0) / withCoords.length;
    return { lat, lng };
  }, [listings]);

  return (
    <div className={cn("relative isolate h-full w-full overflow-hidden", className)}>
      <Map
        initialViewState={{ latitude: center.lat, longitude: center.lng, zoom: 11 }}
        mapStyle={OSM_STYLE}
        attributionControl={false}
      >
        <NavigationControl position="bottom-right" showCompass={false} />
        {listings
          .filter((l) => l.lat != null && l.lng != null)
          .map((l) => {
            const active = activeId === l.id;
            return (
              <Marker
                key={l.id}
                latitude={l.lat!}
                longitude={l.lng!}
                anchor="bottom"
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  onSelectListing?.(l.id);
                }}
              >
                <button
                  type="button"
                  aria-label={`Voir ${l.name}`}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-pill border px-2.5 py-1 text-xs font-semibold shadow-e1 transition-all",
                    active
                      ? "bg-ink text-surface border-ink scale-110 z-10"
                      : "bg-surface text-ink border-hairline hover:scale-105",
                  )}
                >
                  {l.priceTier ?? "·"}
                </button>
              </Marker>
            );
          })}
      </Map>
      <div className="pointer-events-none absolute bottom-1 left-2 text-[10px] text-ink/60">
        © OpenStreetMap
      </div>
    </div>
  );
}

export type { MapRef };
