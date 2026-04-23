import Link from "next/link";
import { ArrowUpRight, Check, MapPin, Star, Sparkles } from "lucide-react";
import { SearchBar } from "@/components/filters/search-bar";
import { ListingCard } from "@/components/listing/listing-card";
import {
  venues,
  venueToListing,
  vendorToListing,
  vendorsByCategory,
  CATEGORY_LABELS_FR,
} from "@/lib/fixtures";

export default function Home() {
  const popularBrussels = venues
    .filter((v) => v.city === "Bruxelles")
    .slice(0, 4)
    .map(venueToListing);
  const newAntwerpen = venues.slice(4, 8).map(venueToListing);
  const traiteurs = vendorsByCategory("traiteur").map(vendorToListing);
  const featuredPhotographers = vendorsByCategory("photographer").map(vendorToListing);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 photo-fallback opacity-90" aria-hidden />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-transparent to-surface" aria-hidden />

        <div className="mx-auto flex min-h-[560px] md:min-h-[640px] max-w-[1280px] flex-col justify-end px-6 md:px-10 pb-12 md:pb-16 pt-24">
          <p className="mb-4 inline-flex w-fit items-center gap-2 rounded-pill bg-surface/90 px-3 py-1 text-xs font-medium uppercase tracking-wider text-ink backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-garnet" strokeWidth={2} />
            Bruxelles · Anvers · Gand · Liège · Charleroi
          </p>
          <h1 className="font-serif text-5xl leading-[1.05] text-ink md:text-7xl md:leading-[1.02] max-w-[16ch]">
            Votre mariage,
            <br />
            <span className="italic text-garnet">sans le parcours du combattant</span>.
          </h1>
          <p className="mt-5 max-w-lg text-base md:text-lg text-ink/80 leading-relaxed">
            Salles de réception, traiteurs, ziana, photographes, nachid. Tout ce qu'il faut pour un mariage marocain en Belgique — filtrable par ce qui compte vraiment.
          </p>

          <div className="mt-10 hidden md:block">
            <SearchBar variant="hero" />
          </div>
          <div className="mt-8 md:hidden">
            <SearchBar variant="inline" />
          </div>

          <Link
            href="/planifier"
            className="mt-6 inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink transition-colors group w-fit"
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-garnet/10 text-garnet group-hover:bg-garnet group-hover:text-white transition-colors">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={1.75} />
            </span>
            Pas encore de salle ? Planifier tout étape par étape
            <ArrowUpRight className="h-4 w-4 opacity-60 group-hover:opacity-100 group-hover:rotate-12 transition-all" strokeWidth={1.5} />
          </Link>
        </div>
      </section>

      {/* VALUE STRIP */}
      <section className="border-y border-hairline bg-card">
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 md:grid-cols-4 gap-6 px-6 md:px-10 py-8">
          {[
            { icon: Check, title: "Filtres qui comptent", sub: "Séparation H/F, salle de prière, personnel féminin, parking — dès la page de résultats." },
            { icon: MapPin, title: "Bruxelles d'abord", sub: "Les salles qu'on connaît déjà, avec leurs vraies contraintes de couvre-feu." },
            { icon: Star, title: "Avis de vrais mariés", sub: "Pas d'avis anonymes. Votre compte, vos photos, votre expérience." },
            { icon: ArrowUpRight, title: "Demande en 2 clics", sub: "Pas de WhatsApp à chercher. Envoyez une demande, recevez une réponse." },
          ].map((v) => {
            const Icon = v.icon;
            return (
              <div key={v.title} className="space-y-2">
                <Icon className="h-5 w-5 text-garnet" strokeWidth={1.75} />
                <div className="font-serif text-lg leading-tight text-ink">{v.title}</div>
                <p className="text-sm text-ink-muted leading-relaxed">{v.sub}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* EDITORIAL ROWS */}
      <Row
        eyebrow="Populaires"
        title="Salles à Bruxelles"
        href="/salles?ville=Bruxelles"
        listings={popularBrussels}
      />

      <Row
        eyebrow="Nouveau"
        title="Découvertes à Anvers & alentours"
        href="/salles?ville=Antwerpen"
        listings={newAntwerpen}
      />

      <Row
        eyebrow="Traiteurs"
        title="Pour 100, 500 ou 800 invités"
        href="/prestataires?cat=traiteur"
        listings={traiteurs}
      />

      <Row
        eyebrow="Photographes"
        title="Ceux que la communauté recommande"
        href="/prestataires?cat=photographer"
        listings={featuredPhotographers}
      />

      {/* CATEGORY NAV */}
      <section className="mx-auto max-w-[1280px] px-6 md:px-10 py-16">
        <div className="flex items-end justify-between gap-6 mb-8">
          <h2 className="font-serif text-3xl md:text-4xl text-ink">Trouver un prestataire</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(Object.keys(CATEGORY_LABELS_FR) as Array<keyof typeof CATEGORY_LABELS_FR>).map((cat, i) => (
            <Link
              key={cat}
              href={`/prestataires?cat=${cat}`}
              className="group flex items-center justify-between rounded-lg border border-hairline bg-card p-4 hover:border-ink transition-colors"
            >
              <div>
                <div className="text-[10px] uppercase tracking-widest text-ink-muted">0{i + 1}</div>
                <div className="font-serif text-lg text-ink mt-0.5">{CATEGORY_LABELS_FR[cat]}</div>
              </div>
              <ArrowUpRight className="h-5 w-5 text-ink-muted group-hover:text-garnet group-hover:rotate-12 transition-all" strokeWidth={1.5} />
            </Link>
          ))}
        </div>
      </section>

      {/* STORY / TRUST SECTION */}
      <section className="border-t border-hairline bg-surface-muted/50">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10 py-20">
          <div className="grid md:grid-cols-[2fr_3fr] gap-12 items-start">
            <div>
              <div className="text-xs uppercase tracking-widest text-garnet font-semibold mb-3">Pourquoi zaffa</div>
              <h2 className="font-serif text-3xl md:text-4xl leading-tight text-ink">
                Conçu par et pour la communauté marocaine de Belgique.
              </h2>
            </div>
            <div className="space-y-5 text-base text-ink/85 leading-relaxed">
              <p>
                Organiser un mariage marocain ici est un métier : trouver une salle qui accepte une séparation hommes/femmes, un traiteur capable de servir 500 invités, une ziana qui livre le jour J — le tout sans se noyer dans des discussions WhatsApp interminables.
              </p>
              <p>
                On connaît chaque salle parce qu'on y a été. Les filtres ne sont pas génériques — ils viennent de votre cahier des charges réel.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {["Mariage en deux jours", "Couvre-feu tardif", "Parking 100+", "Salle de prière", "Personnel féminin", "Ablutions"].map((chip) => (
                  <span
                    key={chip}
                    className="inline-flex items-center rounded-pill border border-hairline bg-card px-3 py-1 text-xs font-medium text-ink"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Row({
  eyebrow,
  title,
  href,
  listings,
}: {
  eyebrow: string;
  title: string;
  href: string;
  listings: ReturnType<typeof venueToListing>[];
}) {
  if (!listings.length) return null;
  return (
    <section className="mx-auto max-w-[1280px] px-6 md:px-10 py-14 md:py-16">
      <div className="mb-8 flex items-end justify-between gap-6">
        <div>
          <div className="text-xs uppercase tracking-widest text-garnet font-semibold">{eyebrow}</div>
          <h2 className="mt-1 font-serif text-3xl md:text-4xl text-ink">{title}</h2>
        </div>
        <Link
          href={href}
          className="hidden md:inline-flex items-center gap-1.5 rounded-pill border border-hairline bg-card px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-ink"
        >
          Tout voir
          <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {listings.map((l) => (
          <ListingCard key={l.id} listing={l} />
        ))}
      </div>
    </section>
  );
}
