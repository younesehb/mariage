import Link from "next/link";
import { MessageSquare, Clock, Check, X as XIcon, CalendarDays } from "lucide-react";
import { findVenueBySlug } from "@/lib/fixtures";
import { cn } from "@/lib/utils";
import { HelpCallout } from "@/components/help-callout";

type DemoStatus = "pending" | "accepted" | "declined";

const demoInquiries: {
  id: string;
  venueSlug: string;
  status: DemoStatus;
  inquiryType: "single_day" | "two_day";
  datePrimary: string;
  dateSecondary?: string;
  guestsPrimary: number;
  guestsSecondary?: number;
  sentAt: string;
  response?: string;
}[] = [
  {
    id: "inq-1",
    venueSlug: "salle-al-andalous",
    status: "accepted",
    inquiryType: "two_day",
    datePrimary: "2026-06-13",
    dateSecondary: "2026-06-14",
    guestsPrimary: 250,
    guestsSecondary: 450,
    sentAt: "2026-04-18",
    response:
      "Bonjour ! Les deux dates sont disponibles. Nous vous proposons un RDV de visite samedi prochain à 14h.",
  },
  {
    id: "inq-2",
    venueSlug: "laeken-palace",
    status: "pending",
    inquiryType: "single_day",
    datePrimary: "2026-07-25",
    guestsPrimary: 520,
    sentAt: "2026-04-22",
  },
  {
    id: "inq-3",
    venueSlug: "zellige-hall",
    status: "declined",
    inquiryType: "single_day",
    datePrimary: "2026-05-30",
    guestsPrimary: 700,
    sentAt: "2026-04-10",
    response:
      "Malheureusement, cette date est déjà réservée. Nous pouvons vous proposer le 6 juin si cela convient.",
  },
];

function statusMeta(s: DemoStatus) {
  if (s === "accepted") return { label: "Acceptée", tone: "success", Icon: Check };
  if (s === "declined") return { label: "Refusée", tone: "error", Icon: XIcon };
  return { label: "En attente", tone: "muted", Icon: Clock };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-BE", { day: "numeric", month: "long", year: "numeric" });
}

export default function DemandesPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 md:px-8 py-8 md:py-12">
      <header className="mb-6">
        <div className="text-xs uppercase tracking-widest text-garnet font-semibold">Vos échanges</div>
        <h1 className="mt-1 font-serif text-3xl md:text-4xl text-ink">Demandes</h1>
      </header>

      <HelpCallout
        storageKey="demandes"
        intro="Toutes les demandes de devis envoyées aux salles et prestataires, au même endroit."
        steps={[
          {
            title: "Statuts",
            body: "« En attente » : la salle n'a pas encore répondu. « Acceptée » : elle est disponible — vous pouvez planifier une visite. « Déclinée » : indisponible, choisissez-en une autre.",
          },
          {
            title: "Délai de réponse",
            body: "La plupart des salles répondent sous 48 h. Au-delà, une relance automatique leur est envoyée.",
          },
          {
            title: "Comparez",
            body: "Les réponses apparaissent en clair sous chaque demande. Gardez-les pour comparer traiteurs imposés, prix, créneaux.",
          },
        ]}
        className="mb-6"
      />

      {demoInquiries.length === 0 ? (
        <div className="py-24 text-center space-y-4">
          <MessageSquare className="mx-auto h-10 w-10 text-ink-muted" strokeWidth={1.25} />
          <div className="space-y-1">
            <h2 className="font-serif text-xl text-ink">Aucune demande envoyée</h2>
            <p className="text-sm text-ink-muted max-w-md mx-auto">
              Envoyez une demande de disponibilité à une salle et retrouvez ici les réponses.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {demoInquiries.map((inq) => {
            const v = findVenueBySlug(inq.venueSlug);
            if (!v) return null;
            const { label, tone, Icon } = statusMeta(inq.status);
            return (
              <article
                key={inq.id}
                className="group rounded-xl border border-hairline bg-card p-4 md:p-6 hover:border-ink-muted transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className={cn("h-32 md:h-24 md:w-40 rounded-lg shrink-0", v.photos[0]?.fallback)} />
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <Link
                        href={`/salles/${v.slug}`}
                        className="font-serif text-xl text-ink hover:underline underline-offset-4 truncate"
                      >
                        {v.name}
                      </Link>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-pill border px-2.5 py-0.5 text-xs font-semibold",
                          tone === "success" && "border-success/30 bg-success/10 text-success",
                          tone === "error" && "border-error/30 bg-error/10 text-error",
                          tone === "muted" && "border-hairline bg-surface-muted text-ink-muted",
                        )}
                      >
                        <Icon className="h-3 w-3" strokeWidth={2} />
                        {label}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-ink-muted">
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="h-4 w-4" strokeWidth={1.5} />
                        {formatDate(inq.datePrimary)}
                        {inq.dateSecondary && (
                          <>
                            <span className="text-ink-muted/60"> / </span>
                            {formatDate(inq.dateSecondary)}
                          </>
                        )}
                      </span>
                      <span>
                        {inq.guestsPrimary} invités
                        {inq.guestsSecondary && ` + ${inq.guestsSecondary}`}
                        {inq.inquiryType === "two_day" && (
                          <span className="ml-1 text-[11px] text-ink-muted/70">· 2 jours (H + F)</span>
                        )}
                      </span>
                      <span className="text-[11px] text-ink-muted/70">Envoyée le {formatDate(inq.sentAt)}</span>
                    </div>
                    {inq.response && (
                      <div className="mt-3 rounded-lg bg-surface-muted p-3 text-sm text-ink leading-relaxed">
                        <span className="text-xs uppercase tracking-wider text-ink-muted font-semibold">
                          Réponse de la salle
                        </span>
                        <p className="mt-1">{inq.response}</p>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
