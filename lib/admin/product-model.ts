import type { Product } from "lib/types";
import { slugifyHandle } from "lib/utils";

const USD = (amount: number) => ({
  amount: amount.toFixed(2),
  currencyCode: "USD" as const,
});

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function productFromSimpleFields(input: {
  existingId?: string;
  existingVariantId?: string;
  handleInput: string;
  title: string;
  description: string;
  priceUsd: number;
  imageUrl: string;
  tags: string[];
  sortIndex: number;
  availableForSale: boolean;
}): Product {
  const handle = slugifyHandle(input.handleInput);
  const id =
    input.existingId?.trim() ||
    `prod_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
  const variantId =
    input.existingVariantId?.trim() || `var_${handle.replace(/[^a-z0-9]/gi, "_")}`;
  const price = USD(input.priceUsd);
  const img = {
    url: input.imageUrl.trim(),
    altText: input.title,
    width: 1200,
    height: 1200,
  };

  return {
    id,
    handle,
    availableForSale: input.availableForSale,
    title: input.title,
    description: input.description,
    descriptionHtml: `<p>${escapeHtml(input.description)}</p>`,
    options: [],
    priceRange: { minVariantPrice: price, maxVariantPrice: price },
    variants: [
      {
        id: variantId,
        title: "Default Title",
        availableForSale: input.availableForSale,
        selectedOptions: [],
        price,
      },
    ],
    featuredImage: img,
    images: [img],
    seo: {
      title: input.title,
      description: input.description.slice(0, 160),
    },
    tags: input.tags,
    updatedAt: new Date().toISOString(),
    sortIndex: input.sortIndex,
  };
}
