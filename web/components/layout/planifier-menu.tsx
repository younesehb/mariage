"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { ChevronDown, ClipboardList, Wallet, Users, CheckSquare } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Item = {
  href: string;
  label: string;
  desc: string;
  icon: LucideIcon;
  soon?: boolean;
};

const items: Item[] = [
  {
    href: "/planifier",
    label: "Mon plan",
    desc: "Assistant étape par étape",
    icon: ClipboardList,
  },
  {
    href: "/planifier/budget",
    label: "Budget",
    desc: "Enveloppe et répartition par poste",
    icon: Wallet,
  },
  {
    href: "/planifier/invites",
    label: "Invités & RSVP",
    desc: "Liste, jour 1 / jour 2, repas",
    icon: Users,
  },
  {
    href: "/planifier/checklist",
    label: "Checklist",
    desc: "De la khotba à la walima",
    icon: CheckSquare,
  },
];

export function PlanifierMenu() {
  const pathname = usePathname();
  const active = pathname.startsWith("/planifier");

  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger
        openOnHover
        delay={80}
        closeDelay={180}
        className={cn(
          "inline-flex items-center gap-1 rounded-pill px-4 py-2 text-sm transition-colors",
          active ? "bg-surface-muted text-ink" : "text-ink-muted hover:bg-surface-muted hover:text-ink",
          "data-[popup-open]:bg-surface-muted data-[popup-open]:text-ink",
        )}
      >
        Planifier
        <ChevronDown
          className="h-3.5 w-3.5 transition-transform data-[popup-open]:rotate-180"
          strokeWidth={1.75}
        />
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Positioner
          sideOffset={6}
          align="start"
          className="z-[60]"
        >
          <PopoverPrimitive.Popup
            className={cn(
              "w-80 rounded-2xl border border-hairline bg-card/95 p-2 shadow-e2 backdrop-blur-xl outline-none",
              "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
              "data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
              "origin-top-left",
            )}
          >
            <ul className="space-y-0.5">
              {items.map((it) => {
                const Icon = it.icon;
                const isActive = pathname === it.href && !it.soon;
                return (
                  <li key={`${it.href}-${it.label}`}>
                    <PopoverPrimitive.Close
                      render={
                        <Link
                          href={it.soon ? "#" : it.href}
                          aria-disabled={it.soon}
                          onClick={(e) => it.soon && e.preventDefault()}
                          className={cn(
                            "group flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors",
                            it.soon
                              ? "cursor-not-allowed opacity-60"
                              : isActive
                                ? "bg-surface-muted"
                                : "hover:bg-surface-muted",
                          )}
                        />
                      }
                    >
                      <span
                        className={cn(
                          "mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                          isActive ? "bg-garnet/10 text-garnet" : "bg-surface text-ink-muted",
                        )}
                      >
                        <Icon className="h-4 w-4" strokeWidth={1.75} />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="flex items-center gap-2">
                          <span className="text-sm font-medium text-ink">{it.label}</span>
                          {it.soon && (
                            <span className="inline-flex items-center rounded-pill bg-surface-muted px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-ink-muted">
                              Bientôt
                            </span>
                          )}
                        </span>
                        <span className="mt-0.5 block text-[11px] text-ink-muted leading-snug">
                          {it.desc}
                        </span>
                      </span>
                    </PopoverPrimitive.Close>
                  </li>
                );
              })}
            </ul>
          </PopoverPrimitive.Popup>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
