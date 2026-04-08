/** Parse `orders.shipping` jsonb into readable fields. */
export type ShippingDisplay = {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
};

export function parseShipping(raw: unknown): ShippingDisplay | null {
  if (raw == null) return null;
  if (typeof raw === "object" && !Array.isArray(raw)) {
    const o = raw as Record<string, unknown>;
    const str = (k: string) =>
      typeof o[k] === "string" ? (o[k] as string) : undefined;
    return {
      email: str("email"),
      phone: str("phone"),
      firstName: str("firstName"),
      lastName: str("lastName"),
      company: str("company"),
      address1: str("address1"),
      address2: str("address2"),
      city: str("city"),
      state: str("state"),
      postalCode: str("postalCode"),
      country: str("country"),
    };
  }
  return null;
}

export type LineItemDisplay = {
  description: string;
  quantity: number;
  amount: number | null;
  currency: string | null;
};

export function parseLineItems(raw: unknown): LineItemDisplay[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((row) => {
    const o = row as Record<string, unknown>;
    const qty =
      typeof o.quantity === "number"
        ? o.quantity
        : typeof o.quantity === "string"
          ? Number(o.quantity)
          : 0;
    return {
      description:
        typeof o.description === "string" ? o.description : "Item",
      quantity: Number.isFinite(qty) ? qty : 0,
      amount: typeof o.amount === "number" ? o.amount : null,
      currency: typeof o.currency === "string" ? o.currency : null,
    };
  });
}

/** Stripe Dashboard URL for a Checkout Session (test vs live from id prefix). */
export function stripeCheckoutSessionDashboardUrl(sessionId: string): string {
  const isTest = sessionId.startsWith("cs_test_");
  const prefix = isTest ? "/test" : "";
  return `https://dashboard.stripe.com${prefix}/checkout/sessions/${encodeURIComponent(sessionId)}`;
}
