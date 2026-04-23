import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Users, Clock, Music, Car, ShieldCheck, HeartHandshake, AlignJustify } from "lucide-react";
import {
  findVenueBySlug,
  reviewsFor,
  avgRating,
  venueToListing,
  venues,
  venueBadges,
  socialsFor,
  recentPostsFor,
} from "@/lib/fixtures";
import { PhotoMosaic } from "@/components/photo-mosaic";
import { ReviewCard } from "@/components/review-card";
import { InquiryCard } from "@/components/inquiry-card";
import { ListingCard } from "@/components/listing-card";
import { SocialLinks } from "@/components/social-links";
import { RecentPosts } from "@/components/recent-posts";
import { StarRating } from "@/components/ui/star-rating";

export default async function VenueDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const venue = findVenueBySlug(slug);
  if (!venue) notFound();

  const rs = reviewsFor("venue", venue.id);
  const rating = avgRating(rs);
  const social = socialsFor(venue.id);
  const posts = recentPostsFor(venue.id);
  const similar = venues
    .filter((v) => v.id !== venue.id && v.city === venue.city)
    .slice(0, 4)
    .map(venueToListing);

  return (
    <>
      <div className="mx-auto max-w-[1280px] px-4 md:px-8 pt-4">
        <Link
          href="/salles"
          className="inline-flex items-center gap-1 text-sm text-ink-muted hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux résultats
        </Link>
      </div>

      <section className="mx-auto max-w-[1280px] px-4 md:px-8 mt-4">
        <PhotoMosaic photos={venue.photos} />
      </section>

      <section className="mx-auto max-w-[1280px] px-4 md:px-8 py-8 md:py-12 grid md:grid-cols-[1fr_360px] gap-10">
        <div className="space-y-10">
          {/* Title block */}
          <header className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-ink-muted">
              <MapPin className="h-4 w-4" strokeWidth={1.5} />
              {venue.neighborhood} · {venue.city}
            </div>
            <h1 className="font-serif text-4xl md:text-5xl leading-tight text-ink">{venue.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-ink">
              {rs.length > 0 && (
                <div className="inline-flex items-center gap-2">
                  <StarRating value={rating} size="sm" />
                  <span className="font-medium">{rating.toFixed(1)}</span>
                  <span className="text-ink-muted">· {rs.length} avis</span>
                </div>
              )}
              <span className="text-ink-muted">·</span>
              <span className="font-medium">{venue.capacityMin}–{venue.capacityMax} invités</span>
              <span className="text-ink-muted">·</span>
              <span className="font-medium">{venue.priceTier}</span>
            </div>
            {social && <SocialLinks links={social} size="sm" className="pt-1" />}
          </header>

          <div className="hairline-divider" />

          {/* Facts — exhaustive per spec §6 */}
          <section>
            <h2 className="font-serif text-2xl text-ink mb-4">Ce qu&apos;il faut savoir</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Fact icon={Users} title="Capacité" value={`${venue.capacityMin}–${venue.capacityMax} invités`} />
              <Fact
                icon={HeartHandshake}
                title="Séparation H/F"
                value={
                  venue.genderSeparation === "strict"
                    ? "Stricte (espaces dédiés)"
                    : venue.genderSeparation === "separable"
                      ? "Séparable à la demande"
                      : "Mixte"
                }
              />
              <Fact
                icon={ShieldCheck}
                title="Traiteur"
                value={
                  venue.traiteurPolicy === "in_house"
                    ? "Traiteur interne"
                    : venue.traiteurPolicy === "imposed_list"
                      ? "Liste imposée"
                      : "Libre choix"
                }
              />
              <Fact
                icon={AlignJustify}
                title="Espaces spirituels"
                value={
                  venue.prayerArea && venue.wuduFacilities
                    ? "Salle de prière + ablutions"
                    : venue.prayerArea
                      ? "Salle de prière"
                      : "Non équipé"
                }
              />
              <Fact
                icon={Car}
                title="Parking"
                value={
                  venue.parkingSpaces
                    ? `${venue.parkingSpaces} places`
                    : "Non précisé"
                }
              />
              <Fact
                icon={Clock}
                title="Couvre-feu musique"
                value={`Sem. ${venue.noiseCurfewWeekday ?? "—"} · WE ${venue.noiseCurfewWeekend ?? "pas de limite"}`}
              />
              <Fact
                icon={Music}
                title="Scène / équipements"
                value={venue.stageAvailable ? "Scène disponible" : "Pas de scène"}
                sub={venue.femaleStaffAvailable ? "Personnel féminin disponible" : undefined}
              />
            </div>
          </section>

          <div className="hairline-divider" />

          {/* Description */}
          <section>
            <h2 className="font-serif text-2xl text-ink mb-4">À propos</h2>
            <p className="text-base text-ink leading-relaxed max-w-[65ch]">{venue.description.fr}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {venueBadges(venue).map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center rounded-pill border border-hairline bg-card px-3 py-1 text-xs font-medium text-ink"
                >
                  {b}
                </span>
              ))}
            </div>
          </section>

          <div className="hairline-divider" />

          {/* Location */}
          <section>
            <h2 className="font-serif text-2xl text-ink mb-2">Où se trouve la salle</h2>
            <p className="text-sm text-ink-muted mb-4">{venue.address}</p>
            <div
              className="h-48 md:h-64 rounded-xl border border-hairline overflow-hidden relative bg-surface-muted"
              aria-label="Carte de localisation"
            >
              <iframe
                title={`Carte de ${venue.name}`}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${venue.lng - 0.02}%2C${venue.lat - 0.01}%2C${venue.lng + 0.02}%2C${venue.lat + 0.01}&layer=mapnik&marker=${venue.lat}%2C${venue.lng}`}
                className="absolute inset-0 h-full w-full"
                loading="lazy"
              />
            </div>
          </section>

          {posts.length > 0 && (
            <>
              <div className="hairline-divider" />
              <RecentPosts posts={posts} social={social} subjectName={venue.name} />
            </>
          )}

          <div className="hairline-divider" />

          {/* Reviews */}
          <section>
            <div className="flex items-end justify-between mb-6 gap-4">
              <h2 className="font-serif text-2xl text-ink">
                Avis
                {rs.length > 0 && (
                  <span className="ml-3 inline-flex items-center gap-2 text-base text-ink-muted">
                    <StarRating value={rating} size="sm" /> {rating.toFixed(1)} · {rs.length}
                  </span>
                )}
              </h2>
              <button
                type="button"
                className="text-sm font-medium text-garnet underline underline-offset-4 hover:text-garnet-hover"
              >
                Écrire un avis
              </button>
            </div>
            {rs.length === 0 ? (
              <p className="text-sm text-ink-muted">
                Soyez le premier à partager votre expérience dans cette salle.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {rs.slice(0, 4).map((r) => (
                  <ReviewCard key={r.id} review={r} />
                ))}
              </div>
            )}
          </section>

          <div className="hairline-divider" />

          {/* Claim listing */}
          <section className="rounded-xl bg-surface-muted p-6">
            <h3 className="font-serif text-lg text-ink">C&apos;est votre salle ?</h3>
            <p className="mt-1 text-sm text-ink-muted">
              Revendiquez-la pour éditer les informations, gérer votre calendrier et répondre aux demandes.
            </p>
            <Link
              href={`/reclamer?venue=${venue.slug}`}
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-ink underline underline-offset-4"
            >
              Réclamer cette salle →
            </Link>
          </section>
        </div>

        {/* Sidebar — inquiry card (sticky on desktop) */}
        <div className="hidden md:block">
          <div className="sticky top-24">
            <InquiryCard venue={venue} placement="sidebar" />
          </div>
        </div>
      </section>

      {/* Mobile inquiry card */}
      <InquiryCard venue={venue} placement="sticky-bottom" />

      {/* Similar venues */}
      {similar.length > 0 && (
        <section className="border-t border-hairline mx-auto max-w-[1280px] px-4 md:px-8 py-12">
          <h2 className="font-serif text-2xl text-ink mb-6">Salles similaires à {venue.city}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {similar.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

import type { LucideIcon } from "lucide-react";
function Fact({
  icon: Icon,
  title,
  value,
  sub,
}: {
  icon: LucideIcon;
  title: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-5 w-5 text-garnet mt-0.5 shrink-0" strokeWidth={1.5} />
      <div>
        <div className="text-xs uppercase tracking-wider text-ink-muted">{title}</div>
        <div className="text-sm font-medium text-ink">{value}</div>
        {sub && <div className="text-xs text-ink-muted mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}
