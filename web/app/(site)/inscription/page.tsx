import type { Metadata } from "next";
import { InscriptionForm } from "./inscription-form";

export const metadata: Metadata = {
  title: "Créer un compte · zaffa",
  description: "Rejoignez zaffa pour organiser votre mariage : favoris, demandes, devis centralisés.",
};

export default function InscriptionPage() {
  return (
    <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-4 py-12 md:grid-cols-2 md:gap-16 md:px-8 md:py-16">
      <aside className="photo-fallback-1 relative hidden h-[520px] overflow-hidden rounded-xl md:block">
        <span className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
        <div className="absolute inset-x-8 top-8 inline-flex items-center gap-2 rounded-pill bg-white/90 px-3 py-1.5 text-xs font-semibold text-ink shadow-e1">
          <span className="h-1.5 w-1.5 rounded-full bg-garnet" />
          Gratuit · sans engagement
        </div>
        <blockquote className="absolute inset-x-8 bottom-10 font-serif text-2xl leading-snug text-white">
          « En une soirée, on avait shortlisté 5 salles et envoyé les demandes. Un vrai soulagement. »
          <footer className="mt-3 text-sm font-sans not-italic opacity-85">— Salma & Yassine, Antwerpen</footer>
        </blockquote>
      </aside>

      <InscriptionForm />
    </div>
  );
}
