import { AddToCart } from "components/cart/add-to-cart";
import Price from "components/price";
import Prose from "components/prose";
import { Product } from "lib/types";
import { VariantSelector } from "./variant-selector";

export function ProductDescription({ product }: { product: Product }) {
  return (
    <>
      <div className="mb-8 pb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[#0a0a0a] md:text-4xl">
          {product.title}
        </h1>
        <div className="mt-4">
          <Price
            className="text-2xl font-semibold text-[#0a0a0a]"
            amount={product.priceRange.maxVariantPrice.amount}
            currencyCode={product.priceRange.maxVariantPrice.currencyCode}
          />
        </div>
      </div>
      <VariantSelector options={product.options} variants={product.variants} />
      {product.descriptionHtml ? (
        <Prose
          className="mb-8 text-[15px] leading-relaxed text-[#737373]"
          html={product.descriptionHtml}
        />
      ) : null}
      <AddToCart product={product} />
    </>
  );
}
