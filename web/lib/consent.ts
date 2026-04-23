export type ConsentState = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  decidedAt: string; // ISO
};

export const CONSENT_KEY = "zaffa.consent";
export const CONSENT_EVENT = "zaffa:consent-change";

export function readConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentState;
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeConsent(next: Omit<ConsentState, "essential" | "decidedAt">) {
  if (typeof window === "undefined") return;
  const value: ConsentState = {
    essential: true,
    analytics: !!next.analytics,
    marketing: !!next.marketing,
    decidedAt: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
  } catch {
    // ignore
  }
}

export function clearConsent() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CONSENT_KEY);
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: null }));
  } catch {
    // ignore
  }
}

export const OPEN_COOKIE_SETTINGS = "zaffa:open-cookie-settings";
