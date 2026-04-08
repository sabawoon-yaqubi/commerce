"use server";

import { getAppOrigin } from "lib/checkout/app-origin";
import { ORDER_CONFIRMATION_COOKIE } from "lib/checkout/constants";
import { stripeProductImageUrls } from "lib/checkout/stripe-product-image";
import { buildShippingMetadata } from "lib/checkout/stripe-shipping-meta";
import type { CheckoutActionState } from "lib/checkout/types";
import { TAGS } from "lib/constants";
import { getStripe } from "lib/stripe/server";
import { clearCart, getCart } from "lib/store";
import { updateTag } from "next/cache";
import { cookies } from "next/headers";

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

function str(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
}

export async function submitOrder(
  _prev: CheckoutActionState,
  formData: FormData,
): Promise<CheckoutActionState> {
  const email = str(formData, "email");
  const phone = str(formData, "phone");
  const firstName = str(formData, "firstName");
  const lastName = str(formData, "lastName");
  const company = str(formData, "company");
  const address1 = str(formData, "address1");
  const address2 = str(formData, "address2");
  const city = str(formData, "city");
  const state = str(formData, "state");
  const postalCode = str(formData, "postalCode");
  const country = str(formData, "country");
  const notes = str(formData, "notes");

  const fieldErrors: Partial<Record<string, string>> = {};

  if (!email) fieldErrors.email = "Email is required";
  else if (!emailOk(email)) fieldErrors.email = "Enter a valid email";

  if (!firstName) fieldErrors.firstName = "First name is required";
  if (!lastName) fieldErrors.lastName = "Last name is required";
  if (!address1) fieldErrors.address1 = "Street address is required";
  if (!city) fieldErrors.city = "City is required";
  if (!state) fieldErrors.state = "State / region is required";
  if (!postalCode) fieldErrors.postalCode = "Postal code is required";
  if (!country) fieldErrors.country = "Country is required";

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }

  const cart = await getCart();
  if (!cart?.totalQuantity) {
    return {
      ok: false,
      message: "Your bag is empty. Add items before checking out.",
    };
  }

  const orderId = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  const stripe = getStripe();
  if (stripe) {
    const origin = getAppOrigin();
    const shippingMeta = buildShippingMetadata({
      email,
      phone,
      firstName,
      lastName,
      company,
      address1,
      address2,
      city,
      state,
      postalCode,
      country,
      notes,
    });

    try {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: email,
        allow_promotion_codes: true,
        custom_text: {
          submit: {
            message:
              "Secure payment by Stripe. After paying, you’ll return here and we’ll email your confirmation.",
          },
        },
        line_items: cart.lines.map((line) => {
          const qty = line.quantity;
          const unit = Number(line.cost.totalAmount.amount) / qty;
          const images = stripeProductImageUrls(
            line.merchandise.product.featuredImage?.url,
            origin,
          );
          return {
            quantity: qty,
            price_data: {
              currency: line.cost.totalAmount.currencyCode.toLowerCase(),
              unit_amount: Math.round(unit * 100),
              product_data: {
                name: line.merchandise.product.title,
                description:
                  line.merchandise.title !== "Default Title"
                    ? line.merchandise.title
                    : undefined,
                ...(images ? { images } : {}),
              },
            },
          };
        }),
        success_url: `${origin}/api/checkout/complete?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/checkout?canceled=1`,
        metadata: {
          order_ref: orderId,
          shipping: shippingMeta,
          notes: notes.slice(0, 450),
        },
      });

      if (!session.url) {
        return {
          ok: false,
          message:
            "Could not start payment. Check Stripe configuration and try again.",
        };
      }

      // Client navigates with window.location — redirect() from actions used with
      // useActionState does not reliably send the browser to Stripe Checkout.
      return { ok: true, redirectUrl: session.url };
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Payment could not be started.";
      return { ok: false, message: msg };
    }
  }

  const payload = {
    orderId,
    email,
    phone,
    firstName,
    lastName,
    company,
    address1,
    address2,
    city,
    state,
    postalCode,
    country,
    notes,
    totalAmount: cart.cost.totalAmount.amount,
    currencyCode: cart.cost.totalAmount.currencyCode,
    itemCount: cart.totalQuantity,
  };

  (await cookies()).set(ORDER_CONFIRMATION_COOKIE, JSON.stringify(payload), {
    path: "/",
    maxAge: 600,
    httpOnly: true,
    sameSite: "lax",
  });

  await clearCart();
  updateTag(TAGS.cart);

  return { ok: true, redirectUrl: "/checkout/success" };
}
