import Link from "next/link";
import { Wordmark } from "./wordmark";
import { LanguageSwitcher } from "./language-switcher";

export function Footer() {
  return (
    <footer className="hidden md:block border-t border-hairline bg-surface-muted/40 py-12">
      <div className="mx-auto max-w-[1280px] px-8">
        <div className="grid grid-cols-5 gap-12">
          <div className="col-span-2 space-y-4">
            <Wordmark />
            <p className="text-sm text-ink-muted max-w-xs leading-relaxed">
              Organiser un mariage en Belgique, à la marocaine. Trouvez salles, traiteurs,
              ziana, nachid et plus — sans détour par WhatsApp.
            </p>
            <LanguageSwitcher variant="footer" />
          </div>

          <FooterCol
            title="Découvrir"
            links={[
              { href: "/salles", label: "Salles de réception" },
              { href: "/prestataires?cat=traiteur", label: "Traiteurs" },
              { href: "/prestataires?cat=ziana", label: "Ziana" },
              { href: "/prestataires?cat=photographer", label: "Photographes" },
            ]}
          />
          <FooterCol
            title="Pour les salles"
            links={[
              { href: "/reclamer", label: "Réclamer une salle" },
              { href: "/partenaires", label: "Devenir partenaire" },
            ]}
          />
          <FooterCol
            title="À propos"
            links={[
              { href: "/a-propos", label: "Qui sommes-nous" },
              { href: "/conditions", label: "Conditions" },
              { href: "/confidentialite", label: "Confidentialité" },
              { href: "/contact", label: "Contact" },
            ]}
          />
        </div>
        <div className="mt-10 pt-6 border-t border-hairline/60 flex items-center justify-between text-xs text-ink-muted">
          <span>© 2026 zaffa. Bruxelles.</span>
          <span>Conçu pour la diaspora marocaine de Belgique.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-widest text-ink mb-4">
        {title}
      </div>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm text-ink-muted hover:text-ink transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
