import Link from "next/link";
import { User, Globe, Lock, Bell, LogOut } from "lucide-react";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 md:px-8 py-8 md:py-12 space-y-10">
      <header className="flex items-center gap-4">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-garnet-soft text-xl font-serif text-garnet">
          HB
        </div>
        <div>
          <h1 className="font-serif text-3xl text-ink">Hajar Bennani</h1>
          <p className="text-sm text-ink-muted">hajar.b@exemple.be</p>
        </div>
      </header>

      <section className="space-y-4">
        <SectionTitle icon={User}>Profil</SectionTitle>
        <div className="rounded-xl border border-hairline bg-card divide-y divide-hairline">
          <Row label="Nom complet" value="Hajar Bennani" />
          <Row label="Téléphone" value="+32 470 12 34 56" />
          <Row label="Email" value="hajar.b@exemple.be" />
        </div>
      </section>

      <section className="space-y-4">
        <SectionTitle icon={Globe}>Langue</SectionTitle>
        <LanguageSwitcher variant="settings" />
      </section>

      <section className="space-y-4">
        <SectionTitle icon={Bell}>Notifications</SectionTitle>
        <div className="rounded-xl border border-hairline bg-card p-4 flex items-center justify-between">
          <div>
            <div className="font-medium text-ink">Réponses aux demandes</div>
            <div className="text-sm text-ink-muted">Par email, quand une salle vous répond.</div>
          </div>
          <span className="inline-flex h-6 w-11 items-center rounded-full bg-garnet p-0.5">
            <span className="h-5 w-5 rounded-full bg-white translate-x-5" />
          </span>
        </div>
      </section>

      <section className="space-y-4">
        <SectionTitle icon={Lock}>Sécurité</SectionTitle>
        <Link
          href="/connexion?mode=reset"
          className="inline-flex items-center gap-2 text-sm font-medium text-ink underline underline-offset-4"
        >
          Changer mon mot de passe
        </Link>
      </section>

      <button
        type="button"
        className="inline-flex items-center gap-2 text-sm font-medium text-error hover:underline underline-offset-4"
      >
        <LogOut className="h-4 w-4" />
        Se déconnecter
      </button>
    </div>
  );
}

import type { LucideIcon } from "lucide-react";
function SectionTitle({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-ink-muted">
      <Icon className="h-4 w-4 text-garnet" strokeWidth={1.75} />
      {children}
    </h2>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="text-sm text-ink-muted">{label}</div>
      <div className="text-sm font-medium text-ink">{value}</div>
    </div>
  );
}
