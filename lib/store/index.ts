import { TAGS } from "lib/constants";
import { CMS_PAGES } from "lib/catalog/data";
import {
  getCatalogProducts,
  getProductByHandle,
  listProductsForCollection,
  lookupVariant,
} from "lib/catalog/resolve";
import type { Cart, CartItem, Collection, Menu, Page, Product } from "lib/types";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/** Cart cookie name — used by checkout completion route to clear the bag after Stripe. */
export const CART_COOKIE = "cart";

type SerializedLine = {
  id: string;
  merchandiseId: string;
  quantity: number;
};

function emptyCart(): Cart {
  return {
    id: undefined,
    checkoutUrl: "/checkout",
    totalQuantity: 0,
    lines: [],
    cost: {
      subtotalAmount: { amount: "0", currencyCode: "USD" },
      totalAmount: { amount: "0", currencyCode: "USD" },
      totalTaxAmount: { amount: "0", currencyCode: "USD" },
    },
  };
}

async function buildLineItem(line: SerializedLine): Promise<CartItem | null> {
  const found = await lookupVariant(line.merchandiseId);
  if (!found) return null;
  const { product, variant } = found;
  const unit = Number(variant.price.amount);
  const total = unit * line.quantity;

  return {
    id: line.id,
    quantity: line.quantity,
    cost: {
      totalAmount: {
        amount: total.toFixed(2),
        currencyCode: variant.price.currencyCode,
      },
    },
    merchandise: {
      id: variant.id,
      title: variant.title,
      selectedOptions: variant.selectedOptions,
      product: {
        id: product.id,
        handle: product.handle,
        title: product.title,
        featuredImage: product.featuredImage,
      },
    },
  };
}

async function buildCart(lines: SerializedLine[]): Promise<Cart> {
  const built = (await Promise.all(lines.map((l) => buildLineItem(l)))).filter(
    Boolean,
  ) as CartItem[];
  const totalQuantity = built.reduce((s, l) => s + l.quantity, 0);
  const totalAmount = built.reduce(
    (s, l) => s + Number(l.cost.totalAmount.amount),
    0,
  );
  const currency =
    built[0]?.cost.totalAmount.currencyCode ?? "USD";

  return {
    id: undefined,
    checkoutUrl: "/checkout",
    totalQuantity,
    lines: built,
    cost: {
      subtotalAmount: { amount: totalAmount.toFixed(2), currencyCode: currency },
      totalAmount: { amount: totalAmount.toFixed(2), currencyCode: currency },
      totalTaxAmount: { amount: "0.00", currencyCode: currency },
    },
  };
}

async function getSerializedLinesFromCookie(): Promise<SerializedLine[]> {
  const raw = (await cookies()).get(CART_COOKIE)?.value;
  if (!raw) return [];
  try {
    const data = JSON.parse(raw) as { lines?: SerializedLine[] };
    return Array.isArray(data.lines) ? data.lines : [];
  } catch {
    return [];
  }
}

async function setSerializedLines(lines: SerializedLine[]) {
  (await cookies()).set(CART_COOKIE, JSON.stringify({ lines }), {
    path: "/",
    sameSite: "lax",
    httpOnly: true,
  });
}

export async function createCart(): Promise<Cart> {
  await setSerializedLines([]);
  return emptyCart();
}

export async function createCartAndSetCookie() {
  const existing = (await cookies()).get(CART_COOKIE)?.value;
  if (existing) return;
  await setSerializedLines([]);
}

export async function addToCart(
  linesToAdd: { merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  let lines = await getSerializedLinesFromCookie();

  for (const incoming of linesToAdd) {
    const idx = lines.findIndex(
      (l) => l.merchandiseId === incoming.merchandiseId,
    );
    if (idx >= 0) {
      const row = lines[idx]!;
      lines = [
        ...lines.slice(0, idx),
        {
          ...row,
          quantity: row.quantity + incoming.quantity,
        },
        ...lines.slice(idx + 1),
      ];
    } else {
      lines = [
        ...lines,
        {
          id: crypto.randomUUID(),
          merchandiseId: incoming.merchandiseId,
          quantity: incoming.quantity,
        },
      ];
    }
  }

  await setSerializedLines(lines);
  return await buildCart(lines);
}

export async function removeFromCart(lineIds: string[]): Promise<Cart> {
  const drop = new Set(lineIds);
  const lines = (await getSerializedLinesFromCookie()).filter(
    (l) => !drop.has(l.id),
  );
  await setSerializedLines(lines);
  return await buildCart(lines);
}

export async function updateCart(
  updates: { id: string; merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  let lines = await getSerializedLinesFromCookie();

  for (const u of updates) {
    const idx = lines.findIndex((l) => l.id === u.id);
    if (idx < 0) continue;
    if (u.quantity <= 0) {
      lines = lines.filter((l) => l.id !== u.id);
    } else {
      const row = lines[idx]!;
      lines = [
        ...lines.slice(0, idx),
        { ...row, quantity: u.quantity },
        ...lines.slice(idx + 1),
      ];
    }
  }

  await setSerializedLines(lines);
  return await buildCart(lines);
}

/** Clears the shopping bag (e.g. after checkout confirmation). */
export async function clearCart(): Promise<void> {
  await setSerializedLines([]);
}

export async function getCart(): Promise<Cart | undefined> {
  "use cache: private";
  cacheTag(TAGS.cart);
  cacheLife("seconds");

  const raw = (await cookies()).get(CART_COOKIE)?.value;
  if (!raw) return undefined;
  try {
    const data = JSON.parse(raw) as { lines?: SerializedLine[] };
    const lines = Array.isArray(data.lines) ? data.lines : [];
    return await buildCart(lines);
  } catch {
    return undefined;
  }
}

function productMatchesQuery(product: Product, q: string): boolean {
  const lower = q.toLowerCase();
  if (product.title.toLowerCase().includes(lower)) return true;
  if (product.description.toLowerCase().includes(lower)) return true;
  if (product.handle.toLowerCase().includes(lower)) return true;
  if (product.tags.some((t) => t.toLowerCase().includes(lower))) return true;
  if (product.seo.title.toLowerCase().includes(lower)) return true;
  if (product.seo.description.toLowerCase().includes(lower)) return true;
  const plain = product.descriptionHtml.replace(/<[^>]*>/g, " ").toLowerCase();
  if (plain.includes(lower)) return true;
  return false;
}

function sortProducts(
  products: Product[],
  sortKey: string | undefined,
  reverse: boolean,
): Product[] {
  const copy = [...products];

  if (sortKey === "PRICE") {
    copy.sort(
      (a, b) =>
        Number(a.priceRange.minVariantPrice.amount) -
        Number(b.priceRange.minVariantPrice.amount),
    );
  } else if (sortKey === "CREATED_AT") {
    copy.sort(
      (a, b) =>
        new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
    );
  } else if (sortKey === "BEST_SELLING") {
    copy.sort((a, b) => b.sortIndex - a.sortIndex);
  }

  if (reverse) copy.reverse();
  return copy;
}

export async function getProducts({
  query,
  reverse,
  sortKey,
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  let list = [...(await getCatalogProducts())];
  const q = query?.trim().toLowerCase();

  if (q) {
    list = list.filter((p) => productMatchesQuery(p, q));
  }

  return sortProducts(list, sortKey, reverse ?? false);
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  return await getProductByHandle(handle);
}

export async function getProductRecommendations(
  productId: string,
): Promise<Product[]> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  const products = await getCatalogProducts();
  const current = products.find((p) => p.id === productId);
  if (!current) return [];

  const others = products.filter((p) => p.id !== productId);
  const sameTag = current.tags[0];
  const preferred = sameTag
    ? others.filter((p) => p.tags.includes(sameTag))
    : others;

  const pool = preferred.length ? preferred : others;
  return pool.slice(0, 4);
}

/**
 * Suggestions for checkout: related picks from items in the bag, excluding products
 * already in the cart. Falls back to other catalog items if needed.
 */
export async function getCheckoutRecommendations(cart: Cart): Promise<Product[]> {
  const inCart = new Set(cart.lines.map((l) => l.merchandise.product.id));
  const seen = new Set<string>();
  const out: Product[] = [];
  const uniqueIds = [...inCart];
  const recommendationGroups = await Promise.all(
    uniqueIds.map((id) => getProductRecommendations(id)),
  );

  for (const recs of recommendationGroups) {
    for (const p of recs) {
      if (inCart.has(p.id) || seen.has(p.id)) continue;
      seen.add(p.id);
      out.push(p);
      if (out.length >= 6) return out;
    }
  }

  if (out.length >= 4) return out.slice(0, 6);

  const all = await getCatalogProducts();
  for (const p of all) {
    if (inCart.has(p.id) || seen.has(p.id)) continue;
    seen.add(p.id);
    out.push(p);
    if (out.length >= 6) break;
  }

  return out.slice(0, 6);
}

const hiddenCollectionMeta: Record<string, { title: string; description: string }> =
  {
    "hidden-homepage-featured-items": {
      title: "Featured picks",
      description: "Homepage spotlight products.",
    },
    "hidden-homepage-carousel": {
      title: "Carousel",
      description: "Homepage carousel products.",
    },
  };

export async function getCollection(
  handle: string,
): Promise<Collection | undefined> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");

  const collections = await getCollections();
  const fromNav = collections.find((c) => c.handle === handle);
  if (fromNav) return fromNav;

  const hidden = hiddenCollectionMeta[handle];
  if (!hidden) return undefined;

  const now = new Date().toISOString();
  return {
    handle,
    title: hidden.title,
    description: hidden.description,
    seo: { title: hidden.title, description: hidden.description },
    path: `/search/${handle}`,
    updatedAt: now,
  };
}

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey,
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  "use cache";
  cacheTag(TAGS.collections, TAGS.products);
  cacheLife("days");

  const list = await listProductsForCollection(collection);
  return sortProducts(list, sortKey, reverse ?? false);
}

export async function getCollections(): Promise<Collection[]> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");

  const now = new Date().toISOString();
  return [
    {
      handle: "",
      title: "All frames",
      description: "The full eyewear collection.",
      seo: { title: "All frames", description: "The full eyewear collection." },
      path: "/search",
      updatedAt: now,
    },
    {
      handle: "new-arrivals",
      title: "New arrivals",
      description: "Latest silhouettes and seasonal lenses.",
      seo: {
        title: "New arrivals",
        description: "Latest silhouettes and seasonal lenses.",
      },
      path: "/search/new-arrivals",
      updatedAt: now,
    },
    {
      handle: "essentials",
      title: "Essentials",
      description: "Timeless frames we build the wardrobe around.",
      seo: {
        title: "Essentials",
        description: "Timeless frames we build the wardrobe around.",
      },
      path: "/search/essentials",
      updatedAt: now,
    },
  ];
}

export async function getMenu(_handle: string): Promise<Menu[]> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");

  return [
    { title: "Collection", path: "/search" },
    { title: "New arrivals", path: "/search/new-arrivals" },
    { title: "Essentials", path: "/search/essentials" },
  ];
}

export async function getPage(handle: string): Promise<Page | undefined> {
  return CMS_PAGES.find((p) => p.handle === handle);
}

export async function getPages(): Promise<Page[]> {
  return CMS_PAGES;
}

export async function revalidate(_req: NextRequest): Promise<NextResponse> {
  return NextResponse.json({
    ok: true,
    message:
      "Demo store: tag revalidation is optional. Use Supabase-backed admin to update catalog.",
  });
}
