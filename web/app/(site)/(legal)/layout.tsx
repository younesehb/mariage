import Link from "next/link";
import { cn } from "@/lib/utils";

const pages = [
  { href: "/cgu", label: "Conditions d'utilisation" },
  { href: "/confidentialite", label: "Politique de confidentialité" },
  { href: "/cookies", label: "Cookies" },
  { href: "/mentions-legales", label: "Mentions légales" },
];

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[1280px] px-4 md:px-8 py-10 md:py-14">
      <div className="grid gap-10 md:grid-cols-[220px_1fr]">
        <aside className="md:sticky md:top-24 md:self-start">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
            Légal
          </div>
          <nav>
            <ul className="space-y-1">
              {pages.map((p) => (
                <li key={p.href}>
                  <LegalNavLink href={p.href} label={p.label} />
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <article className="prose-zaffa max-w-2xl">
          {children}
        </article>
      </div>
    </div>
  );
}

function LegalNavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "block rounded-lg px-3 py-2 text-sm text-ink-muted transition-colors",
        "hover:bg-surface-muted hover:text-ink",
        "aria-[current=page]:bg-surface-muted aria-[current=page]:text-ink aria-[current=page]:font-medium",
      )}
    >
      {label}
    </Link>
  );
}
