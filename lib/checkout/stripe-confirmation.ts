import type { OrderConfirmation } from "lib/checkout/types";
import type Stripe from "stripe";

function num2(amount: number | null | undefined): string {
  if (amount == null) return "0.00";
  return (amount / 100).toFixed(2);
}

export function orderConfirmationFromStripeSession(
  session: Stripe.Checkout.Session,
): OrderConfirmation | null {
  if (session.payment_status !== "paid") return null;
  const meta = session.metadata ?? {};
  const orderId = meta.order_ref?.trim();
  if (!orderId) return null;

  let parsed: Partial<OrderConfirmation> = {};
  try {
    parsed = JSON.parse(meta.shipping ?? "{}") as Partial<OrderConfirmation>;
  } catch {
    /* use Stripe fields below */
  }

  const email =
    session.customer_email?.trim() ||
    (typeof parsed.email === "string" ? parsed.email : "") ||
    "";
  if (!email) return null;

  const itemCount =
    session.line_items?.data?.reduce((s, li) => s + (li.quantity ?? 0), 0) ??
    0;

  const totalAmount = num2(session.amount_total);
  const currencyCode = (session.currency ?? "usd").toUpperCase();

  return {
    orderId,
    email,
    phone:
      typeof parsed.phone === "string" && parsed.phone
        ? parsed.phone
        : undefined,
    firstName: String(parsed.firstName ?? "").trim() || "Customer",
    lastName: String(parsed.lastName ?? "").trim() || "",
    company:
      typeof parsed.company === "string" && parsed.company
        ? parsed.company
        : undefined,
    address1: String(parsed.address1 ?? "").trim() || "—",
    address2:
      typeof parsed.address2 === "string" && parsed.address2
        ? parsed.address2
        : undefined,
    city: String(parsed.city ?? "").trim() || "—",
    state: String(parsed.state ?? "").trim() || "—",
    postalCode: String(parsed.postalCode ?? "").trim() || "—",
    country: String(parsed.country ?? "").trim() || "US",
    notes:
      (meta.notes?.trim() ||
        (typeof parsed.notes === "string" ? parsed.notes : "")) ||
      undefined,
    totalAmount,
    currencyCode,
    itemCount,
  };
}
