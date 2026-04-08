import { ORDER_CONFIRMATION_COOKIE } from "lib/checkout/constants";
import { orderConfirmationFromStripeSession } from "lib/checkout/stripe-confirmation";
import { upsertOrderFromStripeSession } from "lib/checkout/sync-order";
import {
  createServiceClient,
  isSupabaseServiceConfigured,
} from "lib/supabase/service";
import { getStripe } from "lib/stripe/server";
import { CART_COOKIE } from "lib/store";
import { TAGS } from "lib/constants";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");
  const origin = request.nextUrl.origin;
  const successUrl = new URL("/checkout/success", origin);

  if (!sessionId) {
    return NextResponse.redirect(successUrl);
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.redirect(successUrl);
  }

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });
  } catch {
    return NextResponse.redirect(successUrl);
  }

  if (session.payment_status !== "paid") {
    return NextResponse.redirect(new URL("/checkout?canceled=1", origin));
  }

  const order = orderConfirmationFromStripeSession(session);
  if (!order) {
    return NextResponse.redirect(successUrl);
  }

  if (!isSupabaseServiceConfigured()) {
    console.error(
      "[checkout/complete] Supabase service not configured — set NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY (or SERVICE_ROLE_KEY) so orders persist.",
    );
  }
  const supabase = createServiceClient();
  if (supabase) {
    const { error } = await upsertOrderFromStripeSession(supabase, session);
    if (error) {
      console.error("[checkout/complete] order sync failed:", error);
    }
  }

  const res = NextResponse.redirect(successUrl);
  res.cookies.set(ORDER_CONFIRMATION_COOKIE, JSON.stringify(order), {
    path: "/",
    maxAge: 600,
    httpOnly: true,
    sameSite: "lax",
  });
  res.cookies.set(CART_COOKIE, JSON.stringify({ lines: [] }), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
  });

  // updateTag() throws in Route Handlers; revalidateTag is supported here (Next.js).
  revalidateTag(TAGS.cart, "max");

  return res;
}
