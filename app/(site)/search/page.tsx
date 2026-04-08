import Grid from "components/grid";
import { Breadcrumbs } from "components/layout/breadcrumbs";
import ProductGridItems from "components/layout/product-grid-items";
import { ShopListingToolbarSection } from "components/layout/search/shop-listing-toolbar-section";
import { defaultSort, sorting } from "lib/constants";
import { getProducts } from "lib/store";

export const metadata = {
  title: "Collection",
  description: "Browse our full collection of premium sunglasses.",
};

export default async function SearchPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const sort =
    typeof searchParams?.sort === "string"
      ? searchParams.sort
      : Array.isArray(searchParams?.sort)
        ? searchParams.sort[0]
        : undefined;
  const rawQ = searchParams?.q;
  const searchValue =
    typeof rawQ === "string"
      ? rawQ
      : Array.isArray(rawQ)
        ? rawQ[0]
        : undefined;
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  const products = await getProducts({ sortKey, reverse, query: searchValue });
  const resultsText = products.length > 1 ? "results" : "result";

  return (
    <section>
      <Breadcrumbs
        className="mb-8"
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/search" },
          { label: searchValue ? "Search results" : "All frames" },
        ]}
      />
      <header className="mb-6 pb-2 md:mb-8">
        <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#8a8580]">
          Collection
        </p>
        <h1 className="font-display mt-3 text-[clamp(1.85rem,3vw,2.5rem)] font-normal tracking-tight text-[#0c0c0c]">
          All frames
        </h1>
      </header>
      {searchValue ? (
        <p className="mb-6 text-sm text-[#737373] md:mb-8">
          {products.length === 0
            ? "No results for "
            : `${products.length} ${resultsText} for `}
          <span className="font-medium text-[#0a0a0a]">
            &quot;{searchValue}&quot;
          </span>
        </p>
      ) : null}
      <ShopListingToolbarSection />
      {products.length > 0 ? (
        <Grid className="grid-cols-2 lg:grid-cols-4">
          <ProductGridItems products={products} />
        </Grid>
      ) : !searchValue ? (
        <p className="py-6 text-sm text-[#737373]">
          No products in the catalog yet.
        </p>
      ) : null}
    </section>
  );
}
