import Link from "next/link";
import {
  Building2,
  Sparkles,
  MessageSquare,
  Star,
  Shield,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AdminHeader } from "./admin-header";
import { venues, vendors, reviews } from "@/lib/fixtures";
import { adminInquiries, flaggedReviews } from "@/lib/fixtures/admin-data";
import { claimRequests } from "@/lib/fixtures/claims";
import { cn } from "@/lib/utils";

export default function AdminDashboardPage() {
  const pendingInquiries = adminInquiries.filter((i) => i.status === "pending").length;
  const recentActivity = [
    ...adminInquiries.slice(0, 4).map((i) => ({
      kind: "inquiry" as const,
      at: i.createdAt,
      text: `${i.userName} a envoyé une demande pour ${venueName(i.venueSlug)}`,
      href: "/admin/demandes",
    })),
    ...claimRequests.slice(0, 2).map((c) => ({
      kind: "claim" as const,
      at: c.submittedAt,
      text: `${c.claimantName} demande à revendiquer ${subjectName(c)}`,
      href: "/admin/reclamations",
    })),
    ...flaggedReviews.slice(0, 2).map((r) => ({
      kind: "review" as const,
      at: r.createdAt,
      text: `Avis signalé (${r.flagCount}×) sur ${r.subjectName}`,
      href: "/admin/avis",
    })),
  ].sort((a, b) => b.at.localeCompare(a.at));

  return (
    <>
      <AdminHeader
        title="Tableau de bord"
        subtitle="Vue d'ensemble du catalogue et des files d'attente"
      />

      <div className="p-6 md:p-8 space-y-8">
        {/* Stat grid */}
        <section className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard icon={Building2} label="Salles" value={venues.length} href="/admin/salles" accent="ink" />
          <StatCard
            icon={Sparkles}
            label="Prestataires"
            value={vendors.length}
            href="/admin/prestataires"
            accent="ink"
          />
          <StatCard
            icon={MessageSquare}
            label="Demandes en attente"
            value={pendingInquiries}
            href="/admin/demandes"
            accent="garnet"
            urgent={pendingInquiries > 0}
          />
          <StatCard
            icon={Star}
            label="Avis signalés"
            value={flaggedReviews.length}
            href="/admin/avis"
            accent="garnet"
            urgent
          />
          <StatCard
            icon={Shield}
            label="Revendications"
            value={claimRequests.filter((c) => c.status === "pending").length}
            href="/admin/reclamations"
            accent="garnet"
            urgent
          />
        </section>

        {/* Recent activity + quick access */}
        <section className="grid lg:grid-cols-[2fr_1fr] gap-6">
          <div className="rounded-xl border border-hairline bg-card">
            <div className="flex items-center justify-between px-5 py-4 border-b border-hairline">
              <h2 className="font-serif text-lg">Activité récente</h2>
              <TrendingUp className="h-4 w-4 text-ink-muted" strokeWidth={1.5} />
            </div>
            <ul className="divide-y divide-hairline">
              {recentActivity.map((a, i) => (
                <li key={i}>
                  <Link
                    href={a.href}
                    className="flex items-start gap-3 px-5 py-3.5 hover:bg-surface-muted transition-colors"
                  >
                    <ActivityDot kind={a.kind} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-ink">{a.text}</p>
                      <p className="text-xs text-ink-muted mt-0.5">{formatRelative(a.at)}</p>
                    </div>
                    <ArrowRight
                      className="h-4 w-4 text-ink-muted shrink-0 mt-1"
                      strokeWidth={1.5}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-hairline bg-card p-5">
              <h2 className="font-serif text-lg mb-3">Chiffres clés</h2>
              <ul className="space-y-2.5 text-sm">
                <KV label="Salles publiées" value={venues.filter((v) => v.status === "published").length} />
                <KV label="Salles revendiquées" value={venues.filter((v) => v.claimStatus === "claimed").length} />
                <KV label="Traiteurs" value={vendors.filter((v) => v.category === "traiteur").length} />
                <KV label="Avis publiés" value={reviews.length} />
                <KV label="Demandes acceptées" value={adminInquiries.filter((i) => i.status === "accepted").length} />
              </ul>
            </div>

            <div className="rounded-xl border border-garnet/30 bg-garnet-soft p-5">
              <h2 className="font-serif text-lg text-garnet">À faire</h2>
              <ul className="mt-2 space-y-2 text-sm">
                {pendingInquiries > 0 && (
                  <li>
                    <Link href="/admin/demandes" className="underline underline-offset-4">
                      Répondre à {pendingInquiries} demande{pendingInquiries > 1 ? "s" : ""}
                    </Link>
                  </li>
                )}
                {flaggedReviews.length > 0 && (
                  <li>
                    <Link href="/admin/avis" className="underline underline-offset-4">
                      Modérer {flaggedReviews.length} avis signalé{flaggedReviews.length > 1 ? "s" : ""}
                    </Link>
                  </li>
                )}
                {claimRequests.filter((c) => c.status === "pending").length > 0 && (
                  <li>
                    <Link href="/admin/reclamations" className="underline underline-offset-4">
                      Traiter {claimRequests.filter((c) => c.status === "pending").length} revendication{claimRequests.filter((c) => c.status === "pending").length > 1 ? "s" : ""}
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

function venueName(slug: string): string {
  return venues.find((v) => v.slug === slug)?.name ?? slug;
}

function subjectName(c: (typeof claimRequests)[number]): string {
  if (c.subjectType === "venue") return venues.find((v) => v.id === c.subjectId)?.name ?? c.subjectId;
  return vendors.find((v) => v.id === c.subjectId)?.name ?? c.subjectId;
}

function formatRelative(iso: string): string {
  const now = new Date("2026-04-23T12:00:00Z").getTime();
  const t = new Date(iso).getTime();
  const diff = Math.round((now - t) / 1000);
  if (diff < 60) return "à l'instant";
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)}h`;
  const days = Math.floor(diff / 86400);
  if (days < 7) return `il y a ${days}j`;
  return new Date(iso).toLocaleDateString("fr-BE", { day: "numeric", month: "short" });
}

function StatCard({
  icon: Icon,
  label,
  value,
  href,
  accent,
  urgent,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  href: string;
  accent: "ink" | "garnet";
  urgent?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative block rounded-xl border bg-card p-5 transition-colors hover:border-ink",
        urgent && value > 0 ? "border-garnet/30" : "border-hairline",
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <Icon
          className={cn("h-5 w-5", accent === "garnet" ? "text-garnet" : "text-ink-muted")}
          strokeWidth={1.75}
        />
        {urgent && value > 0 && (
          <span className="h-2 w-2 rounded-full bg-garnet animate-pulse" aria-hidden />
        )}
      </div>
      <div className="font-serif text-3xl text-ink">{value}</div>
      <div className="text-xs text-ink-muted mt-0.5">{label}</div>
    </Link>
  );
}

function ActivityDot({ kind }: { kind: "inquiry" | "claim" | "review" }) {
  const colors: Record<typeof kind, string> = {
    inquiry: "bg-garnet",
    claim: "bg-warning",
    review: "bg-error",
  };
  return (
    <span
      className={cn(
        "mt-1.5 h-2 w-2 shrink-0 rounded-full",
        colors[kind],
      )}
      aria-hidden
    />
  );
}

function KV({ label, value }: { label: string; value: number }) {
  return (
    <li className="flex items-center justify-between">
      <span className="text-ink-muted">{label}</span>
      <span className="font-medium text-ink">{value}</span>
    </li>
  );
}
