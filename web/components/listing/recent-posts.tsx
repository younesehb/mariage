import { Heart } from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}
import type { SocialPost, SocialLinks } from "@/lib/types";
import { cn } from "@/lib/utils";

function relativeDate(iso: string): string {
  const now = new Date("2026-04-23T12:00:00Z").getTime();
  const t = new Date(iso).getTime();
  const days = Math.floor((now - t) / 86400000);
  if (days <= 0) return "aujourd'hui";
  if (days === 1) return "hier";
  if (days < 7) return `il y a ${days} j`;
  if (days < 30) return `il y a ${Math.floor(days / 7)} sem.`;
  return `il y a ${Math.floor(days / 30)} mois`;
}

export function RecentPosts({
  posts,
  social,
  subjectName,
}: {
  posts: SocialPost[];
  social: SocialLinks | undefined;
  subjectName: string;
}) {
  if (posts.length === 0) return null;
  const igHandle = social?.instagram;
  const profileUrl = igHandle ? `https://instagram.com/${igHandle}` : undefined;

  return (
    <section className="space-y-5">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-ink flex items-center gap-2">
            <InstagramIcon className="h-5 w-5 text-garnet" />
            Sur Instagram
          </h2>
          {igHandle && (
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-ink-muted hover:text-ink transition-colors"
            >
              @{igHandle}
            </a>
          )}
        </div>
        {profileUrl && (
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-garnet underline underline-offset-4 hover:text-garnet-hover"
          >
            Voir le profil complet
          </a>
        )}
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
        {posts.slice(0, 6).map((p) => (
          <a
            key={p.id}
            href={p.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block aspect-square overflow-hidden rounded-lg"
            aria-label={`Publication : ${p.caption}`}
          >
            <div className={cn("absolute inset-0", p.fallback)} aria-hidden />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-3 text-surface opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-xs leading-snug line-clamp-2">{p.caption}</p>
              <div className="mt-1.5 flex items-center justify-between text-[10px] opacity-90">
                <span className="inline-flex items-center gap-1">
                  <Heart className="h-3 w-3 fill-current" strokeWidth={1.5} />
                  {p.likes.toLocaleString("fr-BE")}
                </span>
                <span>{relativeDate(p.postedAt)}</span>
              </div>
            </div>
            {/* Always-visible small IG badge */}
            <span className="absolute top-2 right-2 grid h-6 w-6 place-items-center rounded-full bg-surface/90 backdrop-blur-sm">
              <InstagramIcon className="h-3 w-3 text-ink" />
            </span>
          </a>
        ))}
      </div>

      <p className="text-xs text-ink-muted">
        Les publications récentes de {subjectName} — mises à jour depuis Instagram.
      </p>
    </section>
  );
}
