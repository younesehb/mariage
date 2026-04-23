"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, MessageSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/salles", label: "Recherche", icon: Search, match: ["/salles", "/prestataires", "/"] },
  { href: "/favoris", label: "Favoris", icon: Heart, match: ["/favoris"] },
  { href: "/demandes", label: "Demandes", icon: MessageSquare, match: ["/demandes"] },
  { href: "/profil", label: "Profil", icon: User, match: ["/profil", "/connexion", "/inscription"] },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Navigation mobile"
      className="md:hidden fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-surface/95 backdrop-blur-md pb-safe"
    >
      <ul className="grid grid-cols-4">
        {tabs.map((tab) => {
          const active = tab.match.some((m) =>
            m === "/" ? pathname === "/" : pathname.startsWith(m),
          );
          const Icon = tab.icon;
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium",
                  active ? "text-garnet" : "text-ink-muted",
                )}
              >
                <Icon
                  strokeWidth={active ? 2 : 1.5}
                  className={cn(
                    "h-5 w-5 transition-transform",
                    active && "scale-110",
                  )}
                />
                <span>{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
