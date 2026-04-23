"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, Send, Check } from "lucide-react";
import { ListingCard } from "@/components/listing/listing-card";
import { BulkQuoteDialog } from "./bulk-quote-dialog";
import { HelpCallout } from "@/components/help-callout";
import { venueToListing } from "@/lib/fixtures";
import type { Venue } from "@/lib/types";
import { cn } from "@/lib/utils";

export function FavorisClient({ venues }: { venues: Venue[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);

  function toggle(id: string) {
    setSelected((s) => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function selectAll() {
    setSelected(new Set(venues.map((v) => v.id)));
  }

  function clearSelection() {
    setSelected(new Set());
  }

  const selectedVenues = venues.filter((v) => selected.has(v.id));

  return (
    <div className="mx-auto max-w-[1280px] px-4 md:px-8 py-8 md:py-12">
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-garnet font-semibold">
            Vos sélections
          </div>
          <h1 className="mt-1 font-serif text-3xl md:text-4xl text-ink">Favoris</h1>
          <p className="mt-2 text-sm text-ink-muted">
            {venues.length} salle{venues.length > 1 ? "s" : ""} enregistrée
            {venues.length > 1 ? "s" : ""}
          </p>
        </div>
      </header>

      <HelpCallout
        storageKey="favoris"
        intro="L'atout de zaffa : demander un devis à plusieurs salles en une fois."
        steps={[
          {
            title: "Sélectionnez",
            body: "Cochez les salles qui vous intéressent (2 à 10, typiquement).",
          },
          {
            title: "Envoyez une demande groupée",
            body: "« Demander à N salles » ouvre un formulaire unique : date, nombre d'invités, message. Chaque salle reçoit votre demande séparément.",
          },
          {
            title: "Suivez les réponses",
            body: "Les retours apparaissent dans « Mes demandes ». La plupart des salles répondent sous 48 h.",
          },
        ]}
        className="mb-6"
      />

      {/* Selection toolbar */}
      {venues.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2 rounded-xl border border-hairline bg-card p-3">
          <div className="text-sm text-ink">
            {selected.size === 0 ? (
              <span className="text-ink-muted">
                Sélectionnez plusieurs salles pour envoyer une demande groupée.
              </span>
            ) : (
              <span>
                <span className="font-semibold">{selected.size}</span> sélectionnée
                {selected.size > 1 ? "s" : ""}
              </span>
            )}
          </div>
          <div className="ml-auto flex items-center gap-2">
            {selected.size > 0 ? (
              <>
                <button
                  type="button"
                  onClick={clearSelection}
                  className="text-xs font-medium text-ink-muted underline-offset-4 hover:underline"
                >
                  Tout désélectionner
                </button>
                <button
                  type="button"
                  onClick={() => setDialogOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-pill bg-garnet px-4 py-2 text-sm font-semibold text-white hover:bg-garnet-hover"
                >
                  <Send className="h-4 w-4" strokeWidth={1.75} />
                  Demander à {selected.size} salle{selected.size > 1 ? "s" : ""}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={selectAll}
                className="rounded-pill border border-hairline bg-card px-3 py-1.5 text-xs font-medium text-ink hover:border-ink-muted"
              >
                Tout sélectionner
              </button>
            )}
          </div>
        </div>
      )}

      {venues.length === 0 ? (
        <div className="py-24 text-center space-y-4">
          <Heart className="mx-auto h-10 w-10 text-ink-muted" strokeWidth={1.25} />
          <div className="space-y-1">
            <h2 className="font-serif text-xl text-ink">Vous n&apos;avez encore rien enregistré</h2>
            <p className="text-sm text-ink-muted max-w-md mx-auto">
              Cliquez sur le ♡ d&apos;une salle ou d&apos;un prestataire pour le retrouver ici.
            </p>
          </div>
          <Link
            href="/salles"
            className="inline-flex items-center rounded-pill bg-garnet px-5 py-2.5 text-sm font-semibold text-white"
          >
            Voir les salles
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {venues.map((v) => {
            const listing = venueToListing(v);
            const isSelected = selected.has(v.id);
            return (
              <div key={v.id} className="relative">
                <button
                  type="button"
                  onClick={() => toggle(v.id)}
                  aria-pressed={isSelected}
                  aria-label={isSelected ? `Désélectionner ${v.name}` : `Sélectionner ${v.name}`}
                  className={cn(
                    "absolute left-3 top-3 z-10 grid h-6 w-6 place-items-center rounded-md border transition-all",
                    isSelected
                      ? "border-ink bg-ink text-surface"
                      : "border-white bg-white/90 text-transparent hover:border-ink",
                  )}
                >
                  <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                </button>
                <div
                  className={cn(
                    "rounded-xl transition-all",
                    isSelected && "ring-2 ring-ink ring-offset-2 ring-offset-surface",
                  )}
                >
                  <ListingCard listing={listing} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <BulkQuoteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        venues={selectedVenues}
        onSuccess={() => {
          setDialogOpen(false);
          clearSelection();
        }}
      />
    </div>
  );
}
