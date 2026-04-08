import clsx from "clsx";
import Price from "components/price";
import { ProductCardQuickAdd } from "components/product/product-card-quick-add";
import { Product } from "lib/types";
import Image from "next/image";
import Link from "next/link";

const cardFocusClassName =
  "rounded-none outline-none focus-within:outline focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-[#0c0c0c]/35";

export function LuxuryProductCard({
  product,
  priority,
  imageAspectClassName = "aspect-[3/4]",
  captionAlign = "center",
  density = "default",
  editIndex,
  quickAddVariant = "default",
  collectionHandle,
  listing = "default",
}: {
  product: Product;
  priority?: boolean;
  imageAspectClassName?: string;
  captionAlign?: "center" | "left";
  density?: "default" | "edit";
  /** 0-based; when set with `density="edit"`, shows on-image index and edit-only hover. */
  editIndex?: number;
  /** "checkout" keeps quick-add visible on desktop without hover. */
  quickAddVariant?: "default" | "checkout";
  /** When set (e.g. on a collection page), product links include `?collection=` for breadcrumbs. */
  collectionHandle?: string;
  listing?: "default" | "plp";
}) {
  const url = product.featuredImage?.url;
  if (!url) return null;

  const isEdit = density === "edit";
  const isPlp = listing === "plp";
  const editLabel =
    editIndex !== undefined ? String(editIndex + 1).padStart(2, "0") : null;

  const productHref =
    collectionHandle && collectionHandle.length > 0
      ? `/product/${product.handle}?collection=${encodeURIComponent(collectionHandle)}`
      : `/product/${product.handle}`;

  const imageAreaClassName = clsx(
    "relative w-full overflow-hidden",
    isPlp
      ? "bg-[#f2efe9] shadow-[inset_0_0_0_1px_rgba(12,12,12,0.04)]"
      : "bg-[#e8e5e0]",
    isEdit
      ? "rounded-none shadow-[0_2px_0_0_rgba(12,12,12,0.04),0_24px_48px_-20px_rgba(12,12,12,0.22),0_0_0_1px_rgba(12,12,12,0.06)]"
      : !isPlp && "rounded-none ring-1 ring-black/[0.06]",
    isPlp && "rounded-none",
    imageAspectClassName,
  );

  const caption = isPlp ? (
    <div className="mt-3.5 text-left">
      <div className="flex flex-nowrap items-baseline justify-between gap-x-3">
        <h3 className="min-w-0 flex-1 truncate font-sans text-[12px] font-normal leading-snug tracking-[0.02em] text-[#1a1918] transition-colors group-hover:text-[#45423e]">
          {product.title}
        </h3>
        <Price
          className="shrink-0 font-sans text-[12px] font-normal tabular-nums tracking-[0.04em] text-[#5c5852]"
          amount={product.priceRange.maxVariantPrice.amount}
          currencyCode={product.priceRange.maxVariantPrice.currencyCode}
        />
      </div>
    </div>
  ) : (
    <div
      className={clsx(
        isEdit ? "mt-4 sm:mt-5" : "mt-2 sm:mt-2.5",
        captionAlign === "center" && "text-center",
        captionAlign === "left" && "text-left",
      )}
    >
      <div
        className={clsx(
          "flex flex-wrap items-baseline gap-x-2.5 gap-y-1",
          captionAlign === "center" && "justify-center",
          captionAlign === "left" && "justify-between",
        )}
      >
        <h3
          className={clsx(
            "min-w-0 font-display leading-snug tracking-tight text-[#0c0c0c] transition-colors group-hover:text-[#3d3934]",
            captionAlign === "left" && "flex-1",
            isEdit
              ? "text-[1.05rem] font-normal sm:text-[1.15rem]"
              : "text-[0.8125rem] font-normal sm:text-[0.875rem] md:text-[0.9rem]",
          )}
        >
          {product.title}
        </h3>
        <Price
          className={clsx(
            "shrink-0 tabular-nums tracking-[0.02em] text-[#7c766d]",
            isEdit ? "text-[11px] sm:text-[12px]" : "text-[11px] sm:text-[12px]",
          )}
          amount={product.priceRange.maxVariantPrice.amount}
          currencyCode={product.priceRange.maxVariantPrice.currencyCode}
        />
      </div>
    </div>
  );

  if (isEdit) {
    return (
      <Link
        href={productHref}
        prefetch={true}
        className={clsx("group block", cardFocusClassName)}
      >
        <div className={imageAreaClassName}>
          <Image
            src={url}
            alt={product.title}
            fill
            sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 88vw"
            priority={priority}
            className="object-cover transition-transform duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          />
          {editLabel ? (
            <span
              className="pointer-events-none absolute left-3 top-3 z-[1] inline-flex min-w-[2.25rem] items-center justify-center rounded-none border border-white/25 bg-black/30 px-2 py-1.5 font-sans text-[10px] font-semibold tabular-nums tracking-[0.12em] text-white shadow-sm backdrop-blur-md sm:left-4 sm:top-4"
              aria-hidden
            >
              {editLabel}
            </span>
          ) : null}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/[0.42] via-black/0 to-black/0 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-2 justify-center pb-5 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100"
            aria-hidden
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white drop-shadow-sm">
              View
            </span>
          </div>
        </div>
        {caption}
      </Link>
    );
  }

  return (
    <div
      className={clsx(
        "group block",
        cardFocusClassName,
        isPlp && "rounded-none",
      )}
    >
      <div className={imageAreaClassName}>
        <Link
          href={productHref}
          prefetch={true}
          className="absolute inset-0 z-0 block outline-none"
          aria-label={`View ${product.title}`}
        >
          <Image
            src={url}
            alt={product.title}
            fill
            sizes={
              isPlp
                ? "(min-width: 1024px) 24vw, (min-width: 640px) 45vw, 88vw"
                : "(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 88vw"
            }
            priority={priority}
            className={clsx(
              "transition-transform duration-[1.05s] ease-[cubic-bezier(0.22,1,0.36,1)]",
              isPlp
                ? "object-cover object-center group-hover:scale-[1.03]"
                : "object-cover group-hover:scale-[1.03]",
            )}
          />
        </Link>
        {!isPlp ? (
          <ProductCardQuickAdd
            product={product}
            productHref={productHref}
            variant={quickAddVariant === "checkout" ? "checkout" : "default"}
          />
        ) : null}
      </div>
      <Link href={productHref} prefetch={true} className="block outline-none">
        {caption}
      </Link>
    </div>
  );
}
