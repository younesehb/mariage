import Link from "next/link";
import {
  MessageSquare,
  Star,
  Calendar,
  Eye,
  TrendingUp,
  Clock,
  Check,
  X,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AdminHeader } from "../admin/admin-header";
import { StatusPill } from "../admin/admin-table";
import { StarRating } from "@/components/ui/star-rating";
import { currentVenue, currentInquiries, currentReviews } from "@/lib/fixtures/pro-context";
import { avgRating } from "@/lib/fixtures";
import { cn } from "@/lib/utils";

export default function ProDashboardPage() {
  const venue = currentVenue();
  const inquiries = currentInquiries();
  const pending = inquiries.filter((i) => i.status === "pending");
  const accepted = inquiries.filter((i) => i.status === "accepted");
  const reviews = currentReviews();
  const rating = avgRating(reviews);

  // Demo conversion funnel
  const views = 512;
  const conversionRate = Math.round((inquiries.length / views) * 1000) / 10;

  return (
    <>
      <AdminHeader
        title={`Bonjour, Mohamed`}
        subtitle="Votre activité des 30 derniers jours"
        actions={
          <Link
            href="/salles/salle-al-andalous"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-lg border border-hairline bg-card px-3 py-2 text-sm font-medium hover:border-ink"
          >
            <Eye className="h-4 w-4" strokeWidth={1.75} />
            Voir ma fiche publique
          </Link>
        }
      />

      <div className="p-6 md:p-8 space-y-8">
        {/* Stats */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat
            icon={Eye}
            label="Vues de la fiche"
            value={views.toString()}
            sub="+34% vs mois dernier"
            subTone="success"
          />
          <Stat
            icon={MessageSquare}
            label="Demandes reçues"
            value={String(inquiries.length)}
            sub={`${pending.length} en attente`}
            subTone={pending.length > 0 ? "warning" : "muted"}
            urgent={pending.length > 0}
          />
          <Stat
            icon={Star}
            label="Note moyenne"
            value={rating ? rating.toFixed(1) : "—"}
            sub={`${reviews.length} avis`}
            subTone="muted"
          />
          <Stat
            icon={TrendingUp}
            label="Conversion"
            value={`${conversionRate}%`}
            sub="vues → demandes"
            subTone="muted"
          />
        </section>

        {/* Main grid */}
        <section className="grid lg:grid-cols-[2fr_1fr] gap-6">
          {/* Inquiries snapshot */}
          <div className="rounded-xl border border-hairline bg-card">
            <header className="flex items-center justify-between px-5 py-4 border-b border-hairline">
              <div>
                <h2 className="font-serif text-lg">Demandes à traiter</h2>
                <p className="text-xs text-ink-muted mt-0.5">
                  Réponses attendues sous 48h pour garder votre badge « Répond vite »
                </p>
              </div>
              <Link
                href="/pro/demandes"
                className="inline-flex items-center gap-1 text-sm font-medium text-garnet"
              >
                Toutes les demandes
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
              </Link>
            </header>
            {pending.length === 0 ? (
              <div className="p-10 text-center">
                <Check className="mx-auto h-8 w-8 text-success" strokeWidth={1.5} />
                <p className="mt-2 text-sm text-ink">Tout est traité.</p>
              </div>
            ) : (
              <ul className="divide-y divide-hairline">
                {pending.map((i) => (
                  <li key={i.id}>
                    <Link
                      href="/pro/demandes"
                      className="flex items-start gap-3 px-5 py-4 hover:bg-surface-muted/50 transition-colors"
                    >
                      <Clock className="h-4 w-4 text-warning mt-0.5 shrink-0" strokeWidth={1.5} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-3">
                          <div className="font-medium text-ink truncate">{i.userName}</div>
                          <div className="text-xs text-ink-muted shrink-0">
                            {new Date(i.createdAt).toLocaleDateString("fr-BE", {
                              day: "numeric",
                              month: "short",
                            })}
                          </div>
                        </div>
                        <div className="mt-0.5 text-xs text-ink-muted flex flex-wrap gap-x-3 gap-y-0.5">
                          <span>
                            <Calendar className="inline h-3 w-3 mr-0.5 align-[-0.125em]" strokeWidth={1.5} />
                            {new Date(i.datePrimary).toLocaleDateString("fr-BE", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                            {i.dateSecondary && ` / ${new Date(i.dateSecondary).toLocaleDateString("fr-BE", { day: "numeric", month: "long" })}`}
                          </span>
                          <span>
                            {i.guestsPrimary}
                            {i.guestsSecondary != null && ` + ${i.guestsSecondary}`} invités
                          </span>
                          {i.inquiryType === "two_day" && (
                            <span className="text-[11px]">
                              {i.dayLabeling === "men_women" ? "2 jours (H + F)" : "2 jours"}
                            </span>
                          )}
                        </div>
                        {i.message && (
                          <p className="mt-1.5 text-xs text-ink/70 line-clamp-2">{i.message}</p>
                        )}
                      </div>
                      <ArrowRight className="h-4 w-4 text-ink-muted mt-1 shrink-0" strokeWidth={1.5} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="space-y-4">
            {/* Profile completeness */}
            <div className="rounded-xl border border-hairline bg-card p-5">
              <h3 className="font-serif text-lg">Complétude de la fiche</h3>
              <div className="mt-3">
                <div className="h-2 rounded-full bg-surface-muted overflow-hidden">
                  <div className="h-full bg-garnet" style={{ width: "85%" }} />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="font-medium text-ink">85%</span>
                  <span className="text-ink-muted">Très bien</span>
                </div>
              </div>
              <ul className="mt-4 space-y-2 text-sm">
                <Completion done>Photos (5+)</Completion>
                <Completion done>Description FR</Completion>
                <Completion done>Capacités et politiques</Completion>
                <Completion done>Calendrier à jour</Completion>
                <Completion done={false}>Description NL</Completion>
                <Completion done={false}>Réseaux sociaux connectés</Completion>
              </ul>
              <Link
                href="/pro/fiche"
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-garnet"
              >
                Compléter ma fiche
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Quick stats */}
            <div className="rounded-xl border border-hairline bg-card p-5 space-y-2.5 text-sm">
              <h3 className="font-serif text-lg mb-1">Récapitulatif</h3>
              <KV label="Demandes acceptées" value={accepted.length} />
              <KV label="Taux d'acceptation" value={`${Math.round((accepted.length / (inquiries.length || 1)) * 100)}%`} />
              <KV label="Date la plus demandée" value="Août 2026" />
              <KV label="Capacité moyenne demandée" value="387" />
            </div>

            {/* Tip */}
            <div className="rounded-xl border border-garnet/30 bg-garnet-soft p-5">
              <div className="flex items-start gap-2.5">
                <Sparkles className="h-5 w-5 text-garnet shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <h3 className="font-serif text-lg text-garnet leading-tight">Conseil</h3>
                  <p className="text-sm text-ink mt-1 leading-relaxed">
                    Ajoutez une description en néerlandais pour apparaître dans les recherches des organisateurs flamands. Vous pourriez capter +20% de demandes supplémentaires.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recent reviews */}
        <section>
          <header className="flex items-end justify-between gap-4 mb-4">
            <div>
              <h2 className="font-serif text-xl text-ink">Derniers avis</h2>
              {reviews.length > 0 && (
                <div className="mt-1 inline-flex items-center gap-2 text-sm">
                  <StarRating value={rating} size="sm" />
                  <span className="font-medium">{rating.toFixed(1)}</span>
                  <span className="text-ink-muted">· {reviews.length} avis</span>
                </div>
              )}
            </div>
            <Link href="/pro/avis" className="inline-flex items-center gap-1 text-sm font-medium text-garnet">
              Tous les avis
              <ArrowRight className="h-4 w-4" />
            </Link>
          </header>
          <div className="grid md:grid-cols-2 gap-4">
            {reviews.slice(0, 2).map((r) => (
              <article key={r.id} className="rounded-xl border border-hairline bg-card p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-ink">{r.userDisplayName}</div>
                  <StarRating value={r.rating} size="sm" />
                </div>
                <p className="text-sm text-ink leading-relaxed line-clamp-4">{r.text}</p>
                <div className="mt-3 text-xs text-ink-muted">
                  Visité en {r.visitMonth.split("-")[0] === "2025" ? "2025" : r.visitMonth}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  sub,
  subTone,
  urgent,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  sub?: string;
  subTone: "success" | "warning" | "muted";
  urgent?: boolean;
}) {
  return (
    <div className={cn("rounded-xl border bg-card p-5", urgent ? "border-garnet/30" : "border-hairline")}>
      <div className="flex items-center justify-between mb-3">
        <Icon className={cn("h-5 w-5", urgent ? "text-garnet" : "text-ink-muted")} strokeWidth={1.75} />
        {urgent && <span className="h-2 w-2 rounded-full bg-garnet animate-pulse" aria-hidden />}
      </div>
      <div className="font-serif text-3xl text-ink">{value}</div>
      <div className="text-xs text-ink-muted mt-0.5">{label}</div>
      {sub && (
        <div
          className={cn(
            "mt-2 text-[11px] font-medium",
            subTone === "success" && "text-success",
            subTone === "warning" && "text-warning",
            subTone === "muted" && "text-ink-muted",
          )}
        >
          {sub}
        </div>
      )}
    </div>
  );
}

function Completion({ done, children }: { done: boolean; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2 text-sm">
      {done ? (
        <Check className="h-4 w-4 text-success shrink-0" strokeWidth={2} />
      ) : (
        <X className="h-4 w-4 text-ink-muted shrink-0" strokeWidth={1.5} />
      )}
      <span className={done ? "text-ink" : "text-ink-muted"}>{children}</span>
    </li>
  );
}

function KV({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-muted">{label}</span>
      <span className="font-medium text-ink">{value}</span>
    </div>
  );
}
