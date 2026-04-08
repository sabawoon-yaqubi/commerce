import Stripe from "stripe";

let stripe: Stripe | null | undefined;

function secretKey(): string | undefined {
  return (
    process.env.STRIPE_SECRET_KEY?.trim() ||
    process.env.STRIPE_SECRET?.trim()
  );
}

export function getStripe(): Stripe | null {
  const key = secretKey();
  if (!key) return null;
  if (stripe === undefined) {
    stripe = new Stripe(key);
  }
  return stripe;
}

export function isStripeCheckoutEnabled(): boolean {
  return Boolean(secretKey());
}
