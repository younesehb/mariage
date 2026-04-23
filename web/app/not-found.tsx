import Link from "next/link";
import { ArrowRight, Compass, Heart, MapPin } from "lucide-react";

export const metadata = { title: "Page introuvable · zaffa" };

const suggestions = [
  {
    href: "/salles",
    label: "Voir les salles",
    desc: "Le cœur de zaffa : salles à Bruxelles, Antwerpen, Liège…",
    icon: MapPin,
  },
  {
    href: "/prestataires",
    label: "Trouver un prestataire",
    desc: "Traiteurs, ziana, photographes, nachid et plus.",
    icon: Compass,
  },
  {
    href: "/planifier",
    label: "Ouvrir mon plan",
    desc: "Reprendre là où vous vous êtes arrêté·e.",
    icon: Heart,
  },
];

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1100px] flex-col items-center justify-center px-4 py-16 md:px-8">
      <div className="relative mb-8">
        <span className="block font-serif text-[120px] md:text-[180px] leading-none tracking-tight text-ink">
          404
        </span>
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 rounded-pill bg-garnet/10 px-3 py-1 text-xs font-semibold text-garnet whitespace-nowrap">
          <Compass className="h-3.5 w-3.5" strokeWidth={2} />
          Cette page s'est égarée
        </span>
      </div>

      <div className="max-w-xl text-center">
        <h1 className="font-serif text-3xl md:text-4xl text-ink">
          On ne trouve plus cette salle.
        </h1>
        <p className="mt-3 text-ink-muted leading-relaxed">
          Le lien a peut-être été déplacé, supprimé, ou mal écrit. Mais vous n'êtes pas perdu·e —
          voici par où reprendre.
        </p>
      </div>

      <div className="mt-10 grid w-full max-w-2xl gap-3 md:grid-cols-3">
        {suggestions.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.href}
              href={s.href}
              className="group rounded-xl border border-hairline bg-card p-4 transition-all hover:border-ink-muted hover:shadow-e1"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-garnet/10 text-garnet">
                <Icon className="h-4 w-4" strokeWidth={1.75} />
              </span>
              <h2 className="mt-3 text-sm font-semibold text-ink">{s.label}</h2>
              <p className="mt-1 text-xs text-ink-muted leading-snug">{s.desc}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-garnet">
                Y aller
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
