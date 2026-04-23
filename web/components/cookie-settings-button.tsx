"use client";

import { Settings2 } from "lucide-react";
import { OPEN_COOKIE_SETTINGS } from "@/lib/consent";

export function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS))}
      className="not-prose inline-flex items-center gap-2 rounded-pill border border-hairline bg-card px-4 py-2 text-sm font-medium text-ink hover:border-ink-muted my-4"
    >
      <Settings2 className="h-4 w-4" strokeWidth={1.75} />
      Gérer mes préférences cookies
    </button>
  );
}
