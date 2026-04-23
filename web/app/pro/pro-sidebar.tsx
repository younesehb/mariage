"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, MessageSquare, Pencil, Calendar, Star, ExternalLink, LogOut } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Wordmark } from "@/components/layout/wordmark";
import { cn } from "@/lib/utils";

const items: { href: string; label: string; icon: LucideIcon; count?: number }[] = [
  { href: "/pro", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/pro/demandes", label: "Demandes", icon: MessageSquare, count: 2 },
  { href: "/pro/fiche", label: "Ma fiche", icon: Pencil },
  { href: "/pro/calendrier", label: "Calendrier", icon: Calendar },
  { href: "/pro/avis", label: "Avis", icon: Star },
];

export function ProSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-hairline bg-card sticky top-0 self-start h-screen">
      <div className="px-5 py-4 border-b border-hairline">
        <Wordmark />
        <div className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-garnet">Espace pro</div>
      </div>

      <div className="px-5 py-3 border-b border-hairline">
        <div className="text-[11px] uppercase tracking-wider text-ink-muted">Fiche gérée</div>
        <div className="mt-0.5 font-serif text-sm text-ink leading-tight">Salle Al-Andalous</div>
        <div className="text-[11px] text-ink-muted">Molenbeek-Saint-Jean · Revendiquée</div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {items.map((item) => {
          const active = item.href === "/pro" ? pathname === "/pro" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                active ? "bg-ink text-surface" : "text-ink-muted hover:bg-surface-muted hover:text-ink",
              )}
            >
              <span className="flex items-center gap-2.5">
                <Icon className="h-4 w-4" strokeWidth={1.75} />
                {item.label}
              </span>
              {item.count != null && item.count > 0 && (
                <span
                  className={cn(
                    "inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-semibold",
                    active ? "bg-surface text-ink" : "bg-garnet text-white",
                  )}
                >
                  {item.count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-hairline p-3 space-y-0.5">
        <Link
          href="/salles/salle-al-andalous"
          target="_blank"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink-muted hover:bg-surface-muted hover:text-ink"
        >
          <ExternalLink className="h-4 w-4" strokeWidth={1.75} />
          Voir ma fiche publique
        </Link>
        <button
          type="button"
          className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink-muted hover:bg-surface-muted hover:text-ink"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.75} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
