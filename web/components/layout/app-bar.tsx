import Link from "next/link";
import { Heart, MessageSquare, User } from "lucide-react";
import { Wordmark } from "./wordmark";
import { LanguageSwitcher } from "./language-switcher";
import { PlanifierMenu } from "./planifier-menu";

const navItems = [
  { href: "/salles", label: "Salles" },
  { href: "/prestataires", label: "Prestataires" },
];

export function AppBar() {
  return (
    <header className="sticky top-0 z-40 hidden md:block border-b border-hairline bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-8 px-8">
        <Link href="/" className="flex items-center gap-2 font-serif text-xl tracking-tight text-ink">
          <Wordmark />
        </Link>

        <nav aria-label="Navigation principale" className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-pill px-4 py-2 text-sm text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
          <PlanifierMenu />
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher variant="header" />
          <Link
            href="/favoris"
            aria-label="Mes favoris"
            className="rounded-pill p-2 text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
          >
            <Heart className="h-5 w-5" strokeWidth={1.5} />
          </Link>
          <Link
            href="/demandes"
            aria-label="Mes demandes"
            className="rounded-pill p-2 text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
          >
            <MessageSquare className="h-5 w-5" strokeWidth={1.5} />
          </Link>
          <Link
            href="/connexion"
            className="rounded-pill px-3 py-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
          >
            Se connecter
          </Link>
          <Link
            href="/inscription"
            aria-label="Créer un compte"
            className="inline-flex items-center gap-2 rounded-pill border border-hairline bg-card px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:border-hairline-strong"
          >
            <User className="h-4 w-4" strokeWidth={1.75} />
            <span>S'inscrire</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
