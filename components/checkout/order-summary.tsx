"use client";

import Price from "components/price";
import { useCart } from "components/cart/cart-context";
import { DEFAULT_OPTION } from "lib/constants";
import { createUrl } from "lib/utils";
import Image from "next/image";
import Link from "next/link";

type MerchandiseSearchParams = Record<string, string>;

export default function OrderSummary({
  stripeEnabled = false,
}: {
  stripeEnabled?: boolean;
}) {
  const { cart } = useCart();
  if (!cart?.lines?.length) return null;

  return (
    <div className="border border-black/[0.08] bg-gradient-to-b from-[#faf9f7] to-[#f3f1ed] p-6 shadow-[0_1px_0_rgba(12,12,12,0.04)] sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="font-display text-lg font-medium tracking-tight text-[#0c0c0c]">
            Order summary
          </h2>
          <p className="mt-1 text-xs text-[#8a8580]">
            {cart.totalQuantity}{" "}
            {cart.totalQuantity === 1 ? "item" : "items"}
          </p>
        </div>
        <Link
          href="/search"
          className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#8a8580] underline-offset-4 transition-colors hover:text-[#0c0c0c]"
        >
          Edit cart
        </Link>
      </div>
      {stripeEnabled ? (
        <p className="mt-3 text-xs leading-relaxed text-[#737373]">
          Next step: Stripe Checkout—card, Apple Pay, or Google Pay. You can
          enter a promo code there if you have one.
        </p>
      ) : null}

      <ul className="mt-6 space-y-5 border-t border-black/[0.06] pt-6">
        {cart.lines.map((item) => {
          const merchandiseSearchParams = {} as MerchandiseSearchParams;
          item.merchandise.selectedOptions.forEach(({ name, value }) => {
            if (value !== DEFAULT_OPTION) {
              merchandiseSearchParams[name.toLowerCase()] = value;
            }
          });
          const href = createUrl(
            `/product/${item.merchandise.product.handle}`,
            new URLSearchParams(merchandiseSearchParams),
          );

          return (
            <li key={item.id ?? item.merchandise.id} className="flex gap-4">
              <Link
                href={href}
                className="relative h-16 w-16 shrink-0 overflow-hidden rounded-none bg-[#f0f0f0]"
              >
                <Image
                  src={item.merchandise.product.featuredImage.url}
                  alt={
                    item.merchandise.product.featuredImage.altText ||
                    item.merchandise.product.title
                  }
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
                <span className="absolute bottom-1 right-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-none bg-[#0c0c0c] px-1 text-[10px] font-medium text-white">
                  {item.quantity}
                </span>
              </Link>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium leading-snug text-[#0c0c0c]">
                  {item.merchandise.product.title}
                </p>
                {item.merchandise.title !== DEFAULT_OPTION ? (
                  <p className="mt-0.5 text-xs text-[#8a8580]">
                    {item.merchandise.title}
                  </p>
                ) : null}
                <Price
                  className="mt-2 text-sm font-medium text-[#0c0c0c]"
                  amount={item.cost.totalAmount.amount}
                  currencyCode={item.cost.totalAmount.currencyCode}
                />
              </div>
            </li>
          );
        })}
      </ul>

      <dl className="mt-6 space-y-3 border-t border-black/[0.06] pt-6 text-sm">
        <div className="flex justify-between text-[#737373]">
          <dt>Subtotal</dt>
          <dd className="text-[#0c0c0c]">
            <Price
              className="inline font-medium"
              amount={cart.cost.subtotalAmount.amount}
              currencyCode={cart.cost.subtotalAmount.currencyCode}
            />
          </dd>
        </div>
        <div className="flex justify-between text-[#737373]">
          <dt>Shipping</dt>
          <dd className="font-medium text-[#0c0c0c]">
            {stripeEnabled ? "Next step" : "—"}
          </dd>
        </div>
        <div className="flex justify-between text-[#737373]">
          <dt>Estimated tax</dt>
          <dd className="text-[#0c0c0c]">
            <Price
              className="inline font-medium"
              amount={cart.cost.totalTaxAmount.amount}
              currencyCode={cart.cost.totalTaxAmount.currencyCode}
            />
          </dd>
        </div>
        <div className="flex justify-between border-t border-black/[0.06] pt-4 font-display text-base font-medium text-[#0c0c0c]">
          <dt>Total</dt>
          <dd>
            <Price
              className="inline font-semibold"
              amount={cart.cost.totalAmount.amount}
              currencyCode={cart.cost.totalAmount.currencyCode}
            />
          </dd>
        </div>
      </dl>
    </div>
  );
}
