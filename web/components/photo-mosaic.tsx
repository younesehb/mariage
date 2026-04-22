import { cn } from "@/lib/utils";
import type { Photo } from "@/lib/types";

export function PhotoMosaic({ photos }: { photos: Photo[] }) {
  const filled = [...photos];
  while (filled.length < 5) filled.push(photos[filled.length % photos.length] ?? photos[0]);
  const [hero, p2, p3, p4, p5] = filled;
  return (
    <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[280px] md:h-[420px] rounded-xl overflow-hidden">
      <div className={cn("col-span-2 row-span-2 relative", hero.fallback)}>
        <span className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent" />
      </div>
      <div className={cn("relative", p2.fallback)} />
      <div className={cn("relative", p3.fallback)} />
      <div className={cn("relative", p4.fallback)} />
      <div className={cn("relative", p5.fallback)}>
        <button
          type="button"
          className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-pill bg-surface/95 px-3 py-1.5 text-xs font-semibold text-ink shadow-e1 hover:bg-surface"
        >
          Toutes les photos
        </button>
      </div>
    </div>
  );
}
