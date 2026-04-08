import { createAnonClient } from "lib/supabase/anon";
import type { Product, ProductVariant } from "lib/types";
import { cache } from "react";
import { PRODUCTS } from "./data";

/** Tag-driven homepage slots (set in admin → product tags). Order follows catalog sort (sort_index desc). */
const TAG_HOMEPAGE_FEATURED = "homepage-featured";
const TAG_HOMEPAGE_CAROUSEL = "homepage-carousel";

function collectionHandlesFor(products: Product[], handle: string): string[] {
  if (handle === "new-arrivals") {
    return products
      .filter((p) => p.tags.includes("new-arrivals"))
      .map((p) => p.handle);
  }
  if (handle === "essentials") {
    return products
      .filter((p) => p.tags.includes("essentials"))
      .map((p) => p.handle);
  }
  if (handle === "hidden-homepage-featured-items") {
    return products
      .filter((p) => p.tags.includes(TAG_HOMEPAGE_FEATURED))
      .map((p) => p.handle);
  }
  if (handle === "hidden-homepage-carousel") {
    return products
      .filter((p) => p.tags.includes(TAG_HOMEPAGE_CAROUSEL))
      .map((p) => p.handle);
  }
  return [];
}

/** PostgREST returns at most ~1000 rows per request; page until exhausted. */
const CATALOG_PAGE_SIZE = 1000;

/** All products for the storefront: Supabase when configured, else static demo data. */
export const getCatalogProducts = cache(async (): Promise<Product[]> => {
  const supabase = createAnonClient();
  if (!supabase) return PRODUCTS;

  const list: Product[] = [];
  let from = 0;

  for (;;) {
    const { data, error } = await supabase
      .from("products")
      .select("data")
      .eq("active", true)
      .order("sort_index", { ascending: false })
      .range(from, from + CATALOG_PAGE_SIZE - 1);

    if (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("[catalog] Supabase products query failed:", error.message);
      }
      return list.length ? list : [];
    }

    if (!data?.length) break;

    for (const row of data) {
      const p = row.data as Product;
      if (p) list.push(p);
    }

    if (data.length < CATALOG_PAGE_SIZE) break;
    from += CATALOG_PAGE_SIZE;
  }

  return list;
});

export async function getProductByHandle(handle: string): Promise<Product | undefined> {
  const products = await getCatalogProducts();
  return products.find((p) => p.handle === handle);
}

export async function lookupVariant(
  merchandiseId: string,
): Promise<{ product: Product; variant: ProductVariant } | undefined> {
  const products = await getCatalogProducts();
  for (const product of products) {
    for (const variant of product.variants) {
      if (variant.id === merchandiseId) {
        return { product, variant };
      }
    }
  }
  return undefined;
}

export async function listProductsForCollection(handle: string): Promise<Product[]> {
  const products = await getCatalogProducts();
  const handles =
    handle === ""
      ? products.map((p) => p.handle)
      : collectionHandlesFor(products, handle);
  if (!handles.length && handle !== "") return [];
  const set = new Set(handles);
  return products.filter((p) => set.has(p.handle));
}
