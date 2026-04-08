import { upsertOrderFromStripeSession } from "lib/checkout/sync-order";
import {
  createServiceClient,
  isSupabaseServiceConfigured,
} from "lib/supabase/service";
import { getStripe } from "lib/stripe/server";
import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();

  if (!stripe || !whSecret) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured" },
      { status: 503 },
    );
  }

  const raw = await request.text();
  const sig = request.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, whSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const sessionRef = event.data.object as Stripe.Checkout.Session;
    if (!isSupabaseServiceConfigured()) {
      console.error(
        "[stripe webhook] Supabase service not configured — set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY",
      );
    }
    const supabase = createServiceClient();
    if (supabase) {
      try {
        const full = await stripe.checkout.sessions.retrieve(sessionRef.id, {
          expand: ["line_items"],
        });
        const { error } = await upsertOrderFromStripeSession(supabase, full);
        if (error) {
          console.error("[stripe webhook] order upsert:", error);
        }
      } catch (e) {
        console.error("[stripe webhook] retrieve session:", e);
      }
    }
  }

  return NextResponse.json({ received: true });
}
