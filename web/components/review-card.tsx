import { Flag } from "lucide-react";
import { StarRating } from "@/components/ui/star-rating";
import { cn } from "@/lib/utils";
import type { Review } from "@/lib/types";

const avatarTones = [
  "bg-[oklch(0.78_0.03_30)]",
  "bg-[oklch(0.76_0.04_200)]",
  "bg-[oklch(0.75_0.05_100)]",
  "bg-[oklch(0.74_0.06_340)]",
  "bg-[oklch(0.72_0.07_55)]",
  "bg-[oklch(0.78_0.04_160)]",
];

function formatVisitMonth(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  const months = [
    "janvier", "février", "mars", "avril", "mai", "juin",
    "juillet", "août", "septembre", "octobre", "novembre", "décembre",
  ];
  return `${months[(m ?? 1) - 1]} ${y ?? ""}`.trim();
}

export function ReviewCard({ review }: { review: Review }) {
  const initials = review.userDisplayName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <article className="space-y-3">
      <header className="flex items-center gap-3">
        <div
          className={cn(
            "grid h-10 w-10 place-items-center rounded-full text-sm font-semibold text-ink",
            avatarTones[review.userAvatarTone % avatarTones.length],
          )}
          aria-hidden
        >
          {initials}
        </div>
        <div>
          <div className="font-medium text-sm text-ink">{review.userDisplayName}</div>
          <div className="text-xs text-ink-muted">Visité en {formatVisitMonth(review.visitMonth)}</div>
        </div>
      </header>
      <div className="flex items-center gap-2">
        <StarRating value={review.rating} size="sm" />
        <span className="text-sm font-medium text-ink">{review.rating}/5</span>
      </div>
      <p className="text-sm text-ink leading-relaxed">{review.text}</p>
      {review.photos.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {review.photos.map((p, i) => (
            <div key={i} className={cn("h-20 w-20 rounded-md", p.fallback)} aria-label={p.alt_fr} />
          ))}
        </div>
      )}
      <button
        type="button"
        className="inline-flex items-center gap-1 text-xs text-ink-muted hover:text-ink transition-colors"
      >
        <Flag className="h-3.5 w-3.5" strokeWidth={1.5} />
        Signaler
      </button>
    </article>
  );
}
