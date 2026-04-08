import type { SupabaseClient } from "@supabase/supabase-js";
import type Stripe from "stripe";

function lineItemsFromSession(session: Stripe.Checkout.Session): unknown {
  const items = session.line_items?.data;
  if (!items?.length) return [];
  return items.map((li) => ({
    description: li.description ?? "Item",
    quantity: li.quantity,
    amount: li.amount_total != null ? li.amount_total / 100 : null,
    currency: li.currency,
  }));
}

/** JSON-serialize then parse so jsonb columns never get non-JSON values. */
function jsonb<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function metadataForDb(meta: Stripe.Metadata | null | undefined): Record<
  string,
  string
> | null {
  if (!meta || typeof meta !== "object") return null;
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(meta)) {
    if (v != null && typeof v === "string") out[k] = v;
  }
  return Object.keys(out).length ? out : null;
}

/**
 * Upserts a row in `public.orders` after a successful Checkout Session.
 * Safe to call from the Stripe webhook; uses `stripe_checkout_session_id` as idempotency key.
 */
export async function upsertOrderFromStripeSession(
  supabase: SupabaseClient,
  session: Stripe.Checkout.Session,
): Promise<{ error: string | null }> {
  const meta = session.metadata ?? {};
  const orderRef = meta.order_ref?.trim();
  if (!orderRef) {
    return { error: "Missing order_ref in session metadata" };
  }

  let shipping: unknown = null;
  const rawShip = meta.shipping?.trim();
  if (rawShip) {
    try {
      shipping = jsonb(JSON.parse(rawShip) as unknown);
    } catch {
      shipping = { raw: rawShip };
    }
  }

  const email =
    session.customer_email ??
    session.customer_details?.email ??
    (shipping as { email?: string } | null)?.email ??
    null;

  const total =
    session.amount_total != null ? session.amount_total / 100 : null;
  const subtotal =
    session.amount_subtotal != null ? session.amount_subtotal / 100 : null;

  const row = {
    order_ref: orderRef,
    stripe_checkout_session_id: session.id,
    email,
    shipping: shipping != null ? jsonb(shipping) : null,
    line_items: jsonb(lineItemsFromSession(session)),
    subtotal,
    total,
    currency: (session.currency ?? "usd").toUpperCase(),
    status: session.payment_status === "paid" ? "paid" : "pending",
    notes: meta.notes?.trim() || null,
    metadata: metadataForDb(meta),
  };

  const { error } = await supabase.from("orders").upsert(row, {
    onConflict: "stripe_checkout_session_id",
  });

  if (error) {
    return {
      error: [error.message, error.hint, error.details].filter(Boolean).join(" — "),
    };
  }

  return { error: null };
}
