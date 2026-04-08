/**
 * Stripe Checkout requires publicly reachable image URLs (HTTPS in production).
 * Relative catalog paths are resolved against the app origin (see NEXT_PUBLIC_SITE_URL).
 */
export function stripeProductImageUrls(
  imageUrl: string | undefined,
  origin: string,
): string[] | undefined {
  if (!imageUrl?.trim()) return undefined;
  const raw = imageUrl.trim();
  if (/^https?:\/\//i.test(raw)) {
    return [raw];
  }
  const base = origin.replace(/\/$/, "");
  const path = raw.startsWith("/") ? raw : `/${raw}`;
  return [`${base}${path}`];
}
