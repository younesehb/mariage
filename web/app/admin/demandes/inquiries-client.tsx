"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Check, X, Send, Calendar, Users, Mail, Phone } from "lucide-react";
import { AdminTable, TH, TR, TD, StatusPill } from "../admin-table";
import { findVenueBySlug } from "@/lib/fixtures";
import type { AdminInquiry } from "@/lib/fixtures/admin-data";
import type { InquiryStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

type Filter = "all" | InquiryStatus;

const tabs: { value: Filter; label: string }[] = [
  { value: "pending", label: "En attente" },
  { value: "accepted", label: "Acceptées" },
  { value: "declined", label: "Refusées" },
  { value: "all", label: "Toutes" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-BE", { day: "numeric", month: "short", year: "numeric" });
}

export function InquiriesClient({ initial }: { initial: AdminInquiry[] }) {
  const [list, setList] = useState<AdminInquiry[]>(initial);
  const [filter, setFilter] = useState<Filter>("pending");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [response, setResponse] = useState<string>("");

  const filtered = useMemo(
    () => (filter === "all" ? list : list.filter((i) => i.status === filter)),
    [list, filter],
  );
  const active = activeId ? list.find((i) => i.id === activeId) : null;

  function respond(status: "accepted" | "declined") {
    if (!active) return;
    if (!response.trim()) {
      toast.error("Ajoutez un message de réponse");
      return;
    }
    setList((prev) =>
      prev.map((i) =>
        i.id === active.id
          ? { ...i, status, venueResponse: response }
          : i,
      ),
    );
    toast.success(status === "accepted" ? "Demande acceptée" : "Demande refusée");
    setActiveId(null);
    setResponse("");
  }

  return (
    <>
      <div className="mb-4 flex items-center gap-2">
        {tabs.map((t) => {
          const count =
            t.value === "all" ? list.length : list.filter((i) => i.status === t.value).length;
          return (
            <button
              key={t.value}
              type="button"
              onClick={() => setFilter(t.value)}
              className={cn(
                "rounded-pill px-4 py-1.5 text-sm font-medium transition-colors",
                filter === t.value
                  ? "bg-ink text-surface"
                  : "border border-hairline bg-card text-ink hover:border-ink-muted",
              )}
            >
              {t.label} <span className="opacity-60 ml-1">{count}</span>
            </button>
          );
        })}
      </div>

      <AdminTable>
        <thead>
          <tr>
            <TH>Demandeur</TH>
            <TH>Salle</TH>
            <TH>Dates</TH>
            <TH>Invités</TH>
            <TH>Statut</TH>
            <TH>Reçue</TH>
            <TH className="text-right">Action</TH>
          </tr>
        </thead>
        <tbody>
          {filtered.map((i) => {
            const venue = findVenueBySlug(i.venueSlug);
            const statusMeta = STATUS_META[i.status];
            return (
              <TR key={i.id}>
                <TD className="font-medium text-ink">
                  <div>{i.userName}</div>
                  <div className="text-xs text-ink-muted">{i.userEmail}</div>
                </TD>
                <TD className="text-ink">{venue?.name ?? i.venueSlug}</TD>
                <TD>
                  {formatDate(i.datePrimary)}
                  {i.dateSecondary && (
                    <>
                      <span className="text-ink-muted"> / </span>
                      {formatDate(i.dateSecondary)}
                      <div className="text-[11px] text-ink-muted">
                        {i.dayLabeling === "men_women" ? "2 jours (H + F)" : "2 jours"}
                      </div>
                    </>
                  )}
                </TD>
                <TD>
                  {i.guestsPrimary}
                  {i.guestsSecondary && ` + ${i.guestsSecondary}`}
                </TD>
                <TD>
                  <StatusPill tone={statusMeta.tone}>{statusMeta.label}</StatusPill>
                </TD>
                <TD className="text-ink-muted text-xs">{formatDate(i.createdAt)}</TD>
                <TD>
                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveId(i.id);
                        setResponse(i.venueResponse ?? "");
                      }}
                      className="rounded-lg border border-hairline px-3 py-1.5 text-xs font-medium hover:border-ink"
                    >
                      Détail
                    </button>
                  </div>
                </TD>
              </TR>
            );
          })}
        </tbody>
      </AdminTable>

      {active && (
        <div
          className="fixed inset-0 z-40 flex justify-end bg-black/30"
          onClick={() => setActiveId(null)}
        >
          <aside
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-card h-full overflow-y-auto shadow-e3 animate-in slide-in-from-right-4 duration-200"
          >
            <div className="sticky top-0 bg-card border-b border-hairline px-5 py-4 flex items-start justify-between">
              <div>
                <h2 className="font-serif text-xl text-ink">{active.userName}</h2>
                <p className="text-xs text-ink-muted">
                  Demande pour {findVenueBySlug(active.venueSlug)?.name ?? active.venueSlug}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveId(null)}
                aria-label="Fermer"
                className="p-1.5 text-ink-muted hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-5 py-4 space-y-5">
              <section className="grid grid-cols-2 gap-3 text-sm">
                <InfoRow icon={Calendar} label="Date" value={formatDate(active.datePrimary)} />
                {active.dateSecondary && (
                  <InfoRow
                    icon={Calendar}
                    label={active.dayLabeling === "men_women" ? "Date femmes" : "Jour 2"}
                    value={formatDate(active.dateSecondary)}
                  />
                )}
                <InfoRow icon={Users} label="Invités" value={String(active.guestsPrimary)} />
                {active.guestsSecondary != null && (
                  <InfoRow icon={Users} label="Invités J2" value={String(active.guestsSecondary)} />
                )}
                <InfoRow icon={Mail} label="Email" value={active.userEmail} />
                <InfoRow icon={Phone} label="Téléphone" value={active.userPhone} />
              </section>

              {active.message && (
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-1.5">
                    Message
                  </h3>
                  <p className="text-sm text-ink leading-relaxed rounded-lg bg-surface-muted p-3">
                    {active.message}
                  </p>
                </section>
              )}

              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-1.5">
                  Réponse à la demandeuse
                </h3>
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  disabled={active.status !== "pending"}
                  rows={5}
                  placeholder="Bonjour, nous confirmons la disponibilité…"
                  className="w-full rounded-lg border border-hairline bg-card px-3 py-2.5 text-sm outline-none focus:border-ink resize-none disabled:bg-surface-muted"
                />
                <p className="text-xs text-ink-muted mt-1.5">
                  Cette réponse sera envoyée par email et visible dans son espace « Demandes ».
                </p>
              </section>

              {active.status === "pending" ? (
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => respond("accepted")}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-success text-white py-2.5 text-sm font-semibold hover:opacity-90"
                  >
                    <Check className="h-4 w-4" />
                    Accepter
                  </button>
                  <button
                    type="button"
                    onClick={() => respond("declined")}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-error text-error py-2.5 text-sm font-semibold hover:bg-error/5"
                  >
                    <X className="h-4 w-4" />
                    Refuser
                  </button>
                </div>
              ) : (
                <div className="pt-2">
                  <StatusPill tone={STATUS_META[active.status].tone}>
                    {STATUS_META[active.status].label}
                  </StatusPill>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

const STATUS_META: Record<InquiryStatus, { label: string; tone: "success" | "error" | "muted" | "warning" }> = {
  pending: { label: "En attente", tone: "muted" },
  accepted: { label: "Acceptée", tone: "success" },
  declined: { label: "Refusée", tone: "error" },
  expired: { label: "Expirée", tone: "warning" },
};

import type { LucideIcon } from "lucide-react";
function InfoRow({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-ink-muted">
        <Icon className="h-3 w-3" strokeWidth={1.5} />
        {label}
      </div>
      <div className="mt-0.5 text-sm font-medium text-ink truncate">{value}</div>
    </div>
  );
}
