import { LuxuryProductCard } from "components/product/luxury-product-card";
import { getCollectionProducts, getProducts } from "lib/store";
import type { Product } from "lib/types";
import Link from "next/link";

function fillToCount(primary: Product[], fallback: Product[], count: number) {
  const picked: Product[] = [];
  const used = new Set<string>();

  for (const product of primary) {
    if (used.has(product.id)) continue;
    picked.push(product);
    used.add(product.id);
    if (picked.length === count) return picked;
  }

  for (const product of fallback) {
    if (used.has(product.id)) continue;
    picked.push(product);
    used.add(product.id);
    if (picked.length === count) return picked;
  }

  return picked;
}

export async function DiscoveryShelves() {
  const [newArrivals, bestSellers, allProducts] = await Promise.all([
    getCollectionProducts({ collection: "new-arrivals" }),
    getProducts({ sortKey: "BEST_SELLING", reverse: false }),
    getProducts({}),
  ]);

  const arrivals = fillToCount(newArrivals, allProducts, 4);
  const trending = fillToCount(bestSellers, allProducts, 4);

  if (arrivals.length < 3 && trending.length < 3) return null;

  return (
    <section className="border-t border-[#ebe8e2] bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-screen-2xl px-5 sm:px-8 lg:px-10">
        <div className="mb-10 flex flex-col gap-2 sm:mb-12">
          <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#8a8580]">
            Discover
          </p>
          <h2 className="font-display text-[clamp(1.8rem,3vw,2.4rem)] font-normal tracking-tight text-[#0c0c0c]">
            New arrivals and best sellers
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-10">
          <section>
           
            <ul className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 lg:gap-x-10 lg:gap-y-14">
              {arrivals.map((product, index) => (
                <li key={product.id} className="min-w-0">
                  <LuxuryProductCard
                    product={product}
                    priority={index < 2}
                    captionAlign="left"
                  />
                </li>
              ))}
            </ul>
          </section>

          <section>
          
            <ul className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 lg:gap-x-10 lg:gap-y-14">
              {trending.map((product, index) => (
                <li key={product.id} className="min-w-0">
                  <LuxuryProductCard
                    product={product}
                    priority={index < 2}
                    captionAlign="left"
                  />
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </section>
  );
}
