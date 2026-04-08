/** localStorage keys for first-visit UI (client-only) */
export const SITE_PROMPT_KEYS = {
  cookieConsent: "site-cookie-consent",
  /** Shown once: newsletter welcome dialog */
  welcomeSeen: "site-welcome-seen",
  /** Legacy — migrated to welcomeSeen */
  legacyDiscountSeen: "site-first-discount-seen",
} as const;

export type CookieConsentValue = "accepted" | "essential";

/** Optional — extra POST URL for welcome modal only (e.g. Formspree, Kit), after `/api/newsletter` saves to Supabase. */
export const NEWSLETTER_FORM_ACTION =
  process.env.NEXT_PUBLIC_NEWSLETTER_FORM_ACTION?.trim() || "";
