import Link from "next/link";
import { Heart } from "lucide-react";
import { venues, venueToListing } from "@/lib/fixtures";
import { ListingCard } from "@/components/listing-card";

// Demo: show 3 venues as "saved"
const DEMO_IDS = ["v-salle-andalous", "v-laeken-palace", "v-zellige-hall"];

export default function FavorisPage() {
  const saved = venues.filter((v) => DEMO_IDS.includes(v.id)).map(venueToListing);
  return (
    <div className="mx-auto max-w-[1280px] px-4 md:px-8 py-8 md:py-12">
      <header className="mb-8 flex items-end justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-garnet font-semibold">Vos sélections</div>
          <h1 className="mt-1 font-serif text-3xl md:text-4xl text-ink">Favoris</h1>
          <p className="mt-2 text-sm text-ink-muted">
            {saved.length} salle{saved.length > 1 ? "s" : ""} enregistrée{saved.length > 1 ? "s" : ""}
          </p>
        </div>
        <button
          type="button"
          className="hidden md:inline-flex items-center gap-1.5 rounded-pill bg-ink text-surface px-4 py-2 text-sm font-medium"
        >
          Comparer les sélectionnées
        </button>
      </header>

      {saved.length === 0 ? (
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {saved.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      )}
    </div>
  );
}
