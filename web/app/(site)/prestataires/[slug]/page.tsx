import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageCircle, Mail, Truck, Utensils, Users, MapPin } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  findVendorBySlug,
  reviewsFor,
  avgRating,
  vendors,
  vendorToListing,
  CATEGORY_LABELS_FR,
  socialsFor,
  recentPostsFor,
} from "@/lib/fixtures";
import { PhotoMosaic } from "@/components/photo-mosaic";
import { ReviewCard } from "@/components/review-card";
import { ListingCard } from "@/components/listing-card";
import { SocialLinks } from "@/components/social-links";
import { RecentPosts } from "@/components/recent-posts";
import { StarRating } from "@/components/ui/star-rating";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const v = findVendorBySlug(slug);
  if (!v) return { title: "Prestataire introuvable · zaffa" };
  const categoryLabel = CATEGORY_LABELS_FR[v.category] ?? "Prestataire";
  const title = `${v.name} — ${categoryLabel} · zaffa`;
  const cities = v.serviceCities.slice(0, 2).join(", ");
  const description = `${categoryLabel} pour mariage${cities ? ` (${cities})` : ""}. Voir la fiche, les avis et contacter directement.`;
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function VendorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const v = findVendorBySlug(slug);
  if (!v) notFound();

  const rs = reviewsFor("vendor", v.id);
  const rating = avgRating(rs);
  const social = socialsFor(v.id);
  const posts = recentPostsFor(v.id);
  const isTraiteur = v.category === "traiteur";

  const similar = vendors
    .filter((x) => x.id !== v.id && x.category === v.category)
    .slice(0, 4)
    .map(vendorToListing);

  const waMessage = encodeURIComponent(
    `Bonjour ${v.name}, je vous contacte via zaffa pour un mariage en Belgique.`,
  );
  const waLink = `https://wa.me/${v.contactWhatsapp.replace(/[^0-9]/g, "")}?text=${waMessage}`;

  return (
    <>
      <div className="mx-auto max-w-[1280px] px-4 md:px-8 pt-4">
        <Link
          href={`/prestataires?cat=${v.category}`}
          className="inline-flex items-center gap-1 text-sm text-ink-muted hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          {CATEGORY_LABELS_FR[v.category]}s
        </Link>
      </div>

      <section className="mx-auto max-w-[1280px] px-4 md:px-8 mt-4">
        {isTraiteur ? <PhotoMosaic photos={v.photos} /> : <PortfolioGrid photos={v.photos} />}
      </section>

      <section className="mx-auto max-w-[1280px] px-4 md:px-8 py-8 md:py-12 grid md:grid-cols-[1fr_360px] gap-10">
        <div className="space-y-10">
          <header className="space-y-3">
            <div className="inline-flex items-center rounded-pill border border-hairline bg-card px-2.5 py-0.5 text-xs font-medium text-ink">
              {CATEGORY_LABELS_FR[v.category]}
            </div>
            <h1 className="font-serif text-4xl md:text-5xl leading-tight text-ink">{v.name}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-ink">
              {rs.length > 0 && (
                <div className="inline-flex items-center gap-2">
                  <StarRating value={rating} size="sm" />
                  <span className="font-medium">{rating.toFixed(1)}</span>
                  <span className="text-ink-muted">· {rs.length} avis</span>
                </div>
              )}
              <span className="text-ink-muted">·</span>
              <span className="inline-flex items-center gap-1 text-ink-muted">
                <MapPin className="h-3.5 w-3.5" />
                {v.serviceCities.join(", ")}
              </span>
            </div>
            {social && <SocialLinks links={social} size="sm" className="pt-1" />}
          </header>

          <div className="hairline-divider" />

          {/* Facts — different per category */}
          {isTraiteur ? (
            <section>
              <h2 className="font-serif text-2xl text-ink mb-4">Au menu</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Fact
                  icon={Utensils}
                  title="Cuisine"
                  value={v.cuisineTags?.join(", ") ?? "—"}
                />
                <Fact
                  icon={Users}
                  title="Prix par invité"
                  value={
                    v.pricePerGuestMin && v.pricePerGuestMax
                      ? `€${v.pricePerGuestMin}–${v.pricePerGuestMax}`
                      : "Sur demande"
                  }
                />
                <Fact
                  icon={Truck}
                  title="Rayon de livraison"
                  value={v.deliveryRadiusKm ? `${v.deliveryRadiusKm} km` : "À confirmer"}
                />
              </div>
            </section>
          ) : (
            <section>
              <h2 className="font-serif text-2xl text-ink mb-4">Ce qu&apos;il faut savoir</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Fact icon={MapPin} title="Zones couvertes" value={v.serviceCities.join(", ")} />
                <Fact
                  icon={Users}
                  title="Personnel"
                  value={v.femaleStaffAvailable ? "Équipe avec personnel féminin" : "Équipe mixte"}
                />
              </div>
            </section>
          )}

          <div className="hairline-divider" />

          <section>
            <h2 className="font-serif text-2xl text-ink mb-4">À propos</h2>
            <p className="text-base text-ink leading-relaxed max-w-[65ch]">{v.description.fr}</p>
          </section>

          {posts.length > 0 && (
            <>
              <div className="hairline-divider" />
              <RecentPosts posts={posts} social={social} subjectName={v.name} />
            </>
          )}

          <div className="hairline-divider" />

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
                Soyez le premier à partager votre expérience.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {rs.map((r) => (
                  <ReviewCard key={r.id} review={r} />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar — contact card */}
        <div className="hidden md:block">
          <div className="sticky top-24">
            <aside className="rounded-xl border border-hairline bg-card shadow-e1 p-5">
              {isTraiteur && v.pricePerGuestMin && v.pricePerGuestMax && (
                <div className="mb-4">
                  <div className="text-xs uppercase tracking-widest text-ink-muted">À partir de</div>
                  <div className="font-serif text-2xl text-ink">
                    €{v.pricePerGuestMin}
                    <span className="text-sm font-sans text-ink-muted font-normal"> / invité</span>
                  </div>
                </div>
              )}
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-garnet py-3.5 font-semibold text-white hover:bg-garnet-hover transition-colors"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={2} />
                Contacter par WhatsApp
              </a>
              <a
                href={`mailto:${v.contactEmail}?subject=Contact%20via%20zaffa`}
                className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-lg border border-hairline bg-card py-3 font-medium text-ink hover:border-ink transition-colors"
              >
                <Mail className="h-4 w-4" strokeWidth={1.75} />
                Email
              </a>
              <p className="mt-4 text-xs text-ink-muted leading-relaxed">
                Votre premier contact passe par WhatsApp. Les tarifs et disponibilités sont à confirmer directement avec le prestataire.
              </p>
            </aside>
          </div>
        </div>
      </section>

      {/* Mobile contact CTA */}
      <div className="md:hidden fixed inset-x-0 bottom-16 z-30 border-t border-hairline bg-card p-3 flex items-center gap-3">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-pill bg-garnet px-5 py-3 text-sm font-semibold text-white"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
        <a
          href={`mailto:${v.contactEmail}`}
          className="inline-flex items-center gap-2 rounded-pill border border-hairline px-4 py-3 text-sm font-medium"
        >
          <Mail className="h-4 w-4" />
        </a>
      </div>

      {/* Similar */}
      {similar.length > 0 && (
        <section className="border-t border-hairline mx-auto max-w-[1280px] px-4 md:px-8 py-12">
          <h2 className="font-serif text-2xl text-ink mb-6">
            Autres {CATEGORY_LABELS_FR[v.category].toLowerCase()}s
          </h2>
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

function PortfolioGrid({ photos }: { photos: { fallback: string; alt_fr: string; alt_nl: string }[] }) {
  // Fill to at least 6 slots for a grid look
  const items = photos.length >= 6 ? photos.slice(0, 6) : [...photos, ...photos, ...photos].slice(0, 6);
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 h-[280px] md:h-[420px]">
      {items.map((p, i) => (
        <div key={i} className={`relative ${p.fallback} rounded-lg overflow-hidden`} aria-label={p.alt_fr}>
          <span className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      ))}
    </div>
  );
}

function Fact({
  icon: Icon,
  title,
  value,
}: {
  icon: LucideIcon;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-5 w-5 text-garnet mt-0.5 shrink-0" strokeWidth={1.5} />
      <div>
        <div className="text-xs uppercase tracking-wider text-ink-muted">{title}</div>
        <div className="text-sm font-medium text-ink">{value}</div>
      </div>
    </div>
  );
}
