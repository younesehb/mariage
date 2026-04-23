import { Globe } from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
import type { SocialLinks as SocialLinksType } from "@/lib/types";
import { cn } from "@/lib/utils";

// Lucide doesn't ship a TikTok glyph; inline a minimal one to match icon weight.
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M15 3v11.5a3.5 3.5 0 1 1-3.5-3.5H12V8" />
      <path d="M15 3c0 2.8 2.2 5 5 5" />
    </svg>
  );
}

function handleUrl(platform: "instagram" | "tiktok" | "facebook", handle: string): string {
  if (platform === "instagram") return `https://instagram.com/${handle.replace(/^@/, "")}`;
  if (platform === "tiktok") return `https://tiktok.com/@${handle.replace(/^@/, "")}`;
  return `https://facebook.com/${handle}`;
}

export function SocialLinks({
  links,
  variant = "row",
  size = "md",
  className,
}: {
  links: SocialLinksType | undefined;
  variant?: "row" | "stacked";
  size?: "sm" | "md";
  className?: string;
}) {
  if (!links) return null;
  const entries: { key: string; href: string; label: string; icon: React.ReactNode; handle?: string }[] = [];

  if (links.instagram) {
    entries.push({
      key: "instagram",
      href: handleUrl("instagram", links.instagram),
      label: `@${links.instagram}`,
      handle: links.instagram,
      icon: <InstagramIcon className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} />,
    });
  }
  if (links.tiktok) {
    entries.push({
      key: "tiktok",
      href: handleUrl("tiktok", links.tiktok),
      label: `@${links.tiktok}`,
      handle: links.tiktok,
      icon: <TikTokIcon className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} />,
    });
  }
  if (links.facebook) {
    entries.push({
      key: "facebook",
      href: handleUrl("facebook", links.facebook),
      label: links.facebook,
      handle: links.facebook,
      icon: <FacebookIcon className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} />,
    });
  }
  if (links.website) {
    entries.push({
      key: "website",
      href: links.website,
      label: links.website.replace(/^https?:\/\//, "").replace(/\/$/, ""),
      icon: <Globe className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} strokeWidth={1.75} />,
    });
  }

  if (entries.length === 0) return null;

  if (variant === "stacked") {
    return (
      <ul className={cn("space-y-2", className)}>
        {entries.map((e) => (
          <li key={e.key}>
            <a
              href={e.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-ink hover:text-garnet transition-colors"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-hairline bg-card text-ink-muted">
                {e.icon}
              </span>
              <span className="font-medium">{e.label}</span>
            </a>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {entries.map((e) => (
        <a
          key={e.key}
          href={e.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={e.label}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-pill border border-hairline bg-card px-3 text-ink hover:border-ink transition-colors",
            size === "sm" ? "h-8 text-xs font-medium" : "h-9 text-sm font-medium",
          )}
        >
          {e.icon}
          <span>{e.label}</span>
        </a>
      ))}
    </div>
  );
}
