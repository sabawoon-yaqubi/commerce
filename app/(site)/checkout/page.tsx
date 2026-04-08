import CheckoutForm from "components/checkout/checkout-form";
import CheckoutRecommendations from "components/checkout/checkout-recommendations";
import OrderSummary from "components/checkout/order-summary";
import { Breadcrumbs } from "components/layout/breadcrumbs";
import { getStripe } from "lib/stripe/server";
import { redirect } from "next/navigation";
import { getCart, getCheckoutRecommendations } from "lib/store";

export const metadata = {
  title: "Checkout",
  description: "Shipping and payment details.",
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams?: Promise<{ canceled?: string }>;
}) {
  const cart = await getCart();
  const sp = searchParams ? await searchParams : {};
  const canceled = sp.canceled === "1";
  const stripeEnabled = Boolean(getStripe());

  if (!cart?.totalQuantity) {
    redirect("/search");
  }

  const recommendations = await getCheckoutRecommendations(cart);

  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-24 lg:px-10 lg:pb-32 lg:pt-28">
      <Breadcrumbs
        className="mb-8"
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/search" },
          { label: "Checkout" },
        ]}
      />

      <div className="mb-10 flex flex-wrap items-center gap-3 text-[10px] font-medium uppercase tracking-[0.2em] text-[#8a8580]">
        <span className="rounded-none border border-[#0c0c0c] bg-[#0c0c0c] px-3 py-1 text-white">
          1 · Details
        </span>
        <span className="text-black/[0.25]">→</span>
        <span
          className={
            stripeEnabled
              ? "rounded-none border border-black/[0.12] px-3 py-1"
              : "rounded-none border border-black/[0.12] bg-[#faf9f7] px-3 py-1 text-[#0c0c0c]"
          }
        >
          {stripeEnabled ? "2 · Pay securely" : "2 · Confirm"}
        </span>
      </div>

      <header className="mb-10 max-w-xl">
        <h1 className="font-display text-[clamp(1.65rem,2.8vw,2.1rem)] font-normal tracking-tight text-[#0c0c0c]">
          {stripeEnabled ? "Where should we ship this?" : "Checkout"}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[#737373]">
          {stripeEnabled
            ? "One short form, then Stripe’s secure page to pay with card or wallet. Your bag stays saved if you cancel."
            : "Add STRIPE_SECRET_KEY to enable card payments. Until then, orders confirm on this site only."}
        </p>
      </header>

      {canceled ? (
        <div
          role="status"
          className="mb-8 max-w-xl rounded-none border border-amber-200/90 bg-amber-50/90 px-4 py-3 text-sm text-amber-950"
        >
          Payment was canceled. Nothing was charged—your bag is still here when
          you’re ready.
        </div>
      ) : null}

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_min(380px,100%)] lg:items-start lg:gap-14">
        <div className="order-2 rounded-none border border-black/[0.06] bg-white p-6 shadow-[0_24px_64px_-48px_rgba(12,12,12,0.35)] sm:p-8 lg:order-1">
          <CheckoutForm stripeEnabled={stripeEnabled} />
        </div>
        <aside className="order-1 lg:sticky lg:order-2 lg:top-24">
          <OrderSummary stripeEnabled={stripeEnabled} />
        </aside>
      </div>

      <CheckoutRecommendations products={recommendations} />
    </div>
  );
}
