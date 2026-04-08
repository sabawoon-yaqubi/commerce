import { LuxuryProductCard } from "components/product/luxury-product-card";
import { getCollectionProducts, getProducts } from "lib/store";
import Link from "next/link";

export async function Carousel() {
  const [carouselCollection, allProducts] = await Promise.all([
    getCollectionProducts({
      collection: "hidden-homepage-carousel",
    }),
    getProducts({}),
  ]);

  if (!carouselCollection?.length && !allProducts.length) return null;

  const seen = new Set<string>();
  const carouselProducts = [...carouselCollection, ...allProducts].filter((product) => {
    if (seen.has(product.id)) return false;
    seen.add(product.id);
    return true;
  }).slice(0, 4);

  if (carouselProducts.length < 3) return null;

  return (
    <section className="border-y border-black/[0.06] bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-screen-2xl px-5 sm:px-8 lg:px-10">
        <div className="mb-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-[clamp(1.75rem,3vw,2.35rem)] font-normal tracking-tight text-[#0c0c0c]">
              In rotation
            </h2>
          </div>
          <Link
            href="/search"
            className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#6b635a] underline-offset-4 transition-colors hover:text-[#0c0c0c] hover:underline"
          >
            View all
          </Link>
        </div>
      </div>
      <div className="w-full overflow-x-auto overflow-y-hidden pb-6 [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden">
        <div className="mx-auto max-w-screen-2xl px-5 sm:px-8 lg:px-10">
          <ul className="grid w-full min-w-[700px] grid-cols-2 gap-5 pb-2 sm:min-w-[920px] sm:grid-cols-3 sm:gap-8 lg:min-w-0 lg:grid-cols-4 lg:gap-10">
          {carouselProducts.map((product, i) => (
            <li
              key={`${product.handle}-${i}`}
              className="min-w-0"
            >
              <LuxuryProductCard product={product} captionAlign="left" />
            </li>
          ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
