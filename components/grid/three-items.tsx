import { LuxuryProductCard } from "components/product/luxury-product-card";
import { getCollectionProducts, getProducts } from "lib/store";
import type { Product } from "lib/types";
import Link from "next/link";

function EditTile({
  product,
  index,
  priority,
}: {
  product: Product;
  index: number;
  priority?: boolean;
}) {
  return (
    <article className="flex flex-col">
      <LuxuryProductCard
        product={product}
        priority={priority}
        imageAspectClassName="aspect-[3/4]"
        captionAlign="left"
        density="edit"
        editIndex={index}
      />
    </article>
  );
}

export async function ThreeItemGrid() {
  const [homepageItems, allProducts] = await Promise.all([
    getCollectionProducts({
      collection: "hidden-homepage-featured-items",
    }),
    getProducts({}),
  ]);

  const seen = new Set<string>();
  const editItems = [...homepageItems, ...allProducts]
    .filter((product) => {
      if (seen.has(product.id)) return false;
      seen.add(product.id);
      return true;
    })
    .slice(0, 4);

  if (editItems.length < 4) return null;

  return (
    <section className="relative border-t border-[#e8e4dc] bg-[#f3f1ed] py-20 sm:py-28 md:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9c3b8]/40 to-transparent" />

      <div className="mx-auto max-w-screen-2xl px-5 sm:px-8 lg:px-10">
        <header className="mb-12 flex flex-col gap-6 border-b border-[#dcd7cf]/80 pb-10 sm:mb-14 sm:gap-8 lg:mb-16 lg:flex-row lg:items-end lg:justify-between lg:gap-16 lg:pb-12">
          <div className="max-w-xl lg:max-w-[28rem]">
            <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#8a8580]">
              Selection
            </p>
            <h2 className="font-display mt-3 text-[clamp(1.85rem,4vw,2.65rem)] font-normal leading-[1.1] tracking-tight text-[#0c0c0c] sm:mt-4">
              The edit
            </h2>
          </div>
          <Link
            href="/search"
            className="group inline-flex w-fit items-center gap-2.5 self-start border border-[#c4beb4] bg-white/80 px-6 py-3.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#2a2826] shadow-[0_1px_0_0_rgba(255,255,255,0.9)_inset] transition-[border-color,background-color,color,box-shadow] hover:border-[#0c0c0c]/20 hover:bg-white hover:text-[#0c0c0c] hover:shadow-sm lg:self-auto"
          >
            View all
            <span
              className="text-[13px] font-light transition-transform group-hover:translate-x-0.5"
              aria-hidden
            >
              →
            </span>
          </Link>
        </header>

        <div className="grid grid-cols-1 gap-14 sm:grid-cols-2 md:gap-6 lg:grid-cols-4 lg:gap-10">
          {editItems.map((product, index) => (
            <EditTile
              key={product.id}
              product={product}
              index={index}
              priority={index < 2}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
