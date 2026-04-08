import { getCollection, getCollectionProducts } from "lib/store";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import Grid from "components/grid";
import { Breadcrumbs } from "components/layout/breadcrumbs";
import ProductGridItems from "components/layout/product-grid-items";
import { ShopListingToolbarSection } from "components/layout/search/shop-listing-toolbar-section";
import { defaultSort, sorting } from "lib/constants";

export async function generateMetadata(props: {
  params: Promise<{ collection: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const collection = await getCollection(params.collection);

  if (!collection) return notFound();

  return {
    title: collection.seo?.title || collection.title,
    description:
      collection.seo?.description ||
      collection.description ||
      `${collection.title} — premium eyewear`,
  };
}

export default async function CategoryPage(props: {
  params: Promise<{ collection: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const collection = await getCollection(params.collection);
  const rawSort = searchParams?.sort;
  const sort =
    typeof rawSort === "string"
      ? rawSort
      : Array.isArray(rawSort)
        ? rawSort[0]
        : undefined;
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;
  const products = await getCollectionProducts({
    collection: params.collection,
    sortKey,
    reverse,
  });

  if (!collection) return notFound();

  return (
    <section>
      <Breadcrumbs
        className="mb-8"
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/search" },
          { label: collection.title },
        ]}
      />
      <header className="mb-6 pb-2 md:mb-8">
        <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#8a8580]">
          Collection
        </p>
        <h1 className="font-display mt-3 text-[clamp(1.85rem,3vw,2.5rem)] font-normal tracking-tight text-[#0c0c0c]">
          {collection.title}
        </h1>
        {collection.description ? (
          <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-[#737373]">
            {collection.description}
          </p>
        ) : null}
      </header>
      <ShopListingToolbarSection />
      {products.length === 0 ? (
        <p className="py-6 text-sm text-[#737373]">
          No frames in this collection yet.
        </p>
      ) : (
        <Grid className="grid-cols-2 lg:grid-cols-4">
          <ProductGridItems
            products={products}
            collectionHandle={params.collection}
          />
        </Grid>
      )}
    </section>
  );
}
