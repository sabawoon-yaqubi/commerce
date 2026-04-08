import { LuxuryProductCard } from "components/product/luxury-product-card";
import type { Product } from "lib/types";
import Link from "next/link";

export default function CheckoutRecommendations({
  products,
}: {
  products: Product[];
}) {
  if (!products.length) return null;

  return (
    <section
      className="mt-14 rounded-none border border-black/[0.07] bg-[#faf9f7]/80 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-sm sm:mt-16 sm:p-8 lg:mt-20"
      aria-labelledby="checkout-recs-heading"
    >
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#8a8580]">
            Add to this order
          </p>
          <h2
            id="checkout-recs-heading"
            className="font-display mt-2 text-xl font-normal tracking-tight text-[#0c0c0c] sm:text-2xl"
          >
            Complete the look
          </h2>
          <p className="mt-1 max-w-md text-sm text-[#737373]">
            Tap add to bag—the order summary on this page updates right away
            before you continue to payment.
          </p>
        </div>
        <Link
          href="/search"
          className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#6b635a] underline-offset-4 transition-colors hover:text-[#0c0c0c] hover:underline"
        >
          Browse shop
        </Link>
      </div>
      <ul className="flex w-full gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-8 sm:pb-4">
        {products.map((product) => (
          <li
            key={product.handle}
            className="w-[72vw] max-w-[260px] shrink-0 sm:w-[38vw] md:w-[28vw] lg:w-[240px]"
          >
            <LuxuryProductCard
              product={product}
              captionAlign="left"
              quickAddVariant="checkout"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
