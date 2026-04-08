import ShopListingToolbar from "components/layout/search/shop-listing-toolbar";
import { getCollections } from "lib/store";
import { Suspense } from "react";

function ToolbarSkeleton() {
  return (
    <div className="mb-8 flex h-11 items-center justify-between border-b border-[#e8e6e3] pb-4 md:mb-10 md:pb-5">
      <div className="h-8 w-[min(100%,14rem)] animate-pulse rounded-none bg-[#f0eeeb]" />
      <div className="h-8 w-24 animate-pulse rounded-none bg-[#f0eeeb]" />
    </div>
  );
}

async function ShopListingToolbarLoader() {
  const collections = await getCollections();
  const collectionLinks = collections.map((c) => ({
    title: c.title,
    path: c.path,
  }));
  return <ShopListingToolbar collectionLinks={collectionLinks} />;
}

/** Sort + filters row; fetch collections on the server, render client toolbar. */
export function ShopListingToolbarSection() {
  return (
    <Suspense fallback={<ToolbarSkeleton />}>
      <ShopListingToolbarLoader />
    </Suspense>
  );
}
