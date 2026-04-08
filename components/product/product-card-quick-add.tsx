"use client";

import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { addItem } from "components/cart/actions";
import { LuxuryAddSpinner } from "components/cart/luxury-add-spinner";
import { useCart } from "components/cart/cart-context";
import { Product } from "lib/types";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type QuickAddVariant = "default" | "checkout";

export function ProductCardQuickAdd({
  product,
  productHref,
  variant = "default",
}: {
  product: Product;
  productHref?: string;
  variant?: QuickAddVariant;
}) {
  const { addCartItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const singleVariant =
    product.variants.length === 1 ? product.variants[0] : undefined;

  const canQuickAdd = Boolean(
    product.availableForSale &&
      singleVariant?.availableForSale &&
      singleVariant.id,
  );

  useEffect(() => {
    return () => {
      if (successTimer.current) clearTimeout(successTimer.current);
    };
  }, []);

  const onQuickAdd = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!canQuickAdd || !singleVariant || isAdding) return;
      setError(null);
      setJustAdded(false);
      setIsAdding(true);
      try {
        const err = await addItem(null, singleVariant.id);
        if (err) {
          setError(err);
          return;
        }
        addCartItem(singleVariant, product);
        if (successTimer.current) clearTimeout(successTimer.current);
        setJustAdded(true);
        successTimer.current = setTimeout(() => setJustAdded(false), 2600);
      } finally {
        setIsAdding(false);
      }
    },
    [addCartItem, canQuickAdd, isAdding, product, singleVariant],
  );

  const containerClass =
    "pointer-events-none absolute inset-x-0 bottom-3 z-[2] flex justify-center px-3 sm:bottom-3.5";

  const isCheckout = variant === "checkout";

  const href = productHref ?? `/product/${product.handle}`;

  const base = clsx(
    "font-display relative inline-flex min-h-[2.5rem] min-w-0 max-w-[calc(100%-0.5rem)] translate-y-0 scale-100 items-center justify-center gap-2 overflow-hidden rounded-none px-4 py-2.5 text-[10px] font-normal leading-none tracking-[0.04em] text-white opacity-100 shadow-[0_8px_28px_-10px_rgba(0,0,0,0.45)] transition-[background-color,color,transform,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] sm:min-w-[10.75rem] sm:px-5 sm:text-[11px] sm:tracking-[0.05em]",
    !isCheckout &&
      "sm:translate-y-1.5 sm:scale-[0.98] sm:opacity-0 sm:pointer-events-none sm:group-hover:translate-y-0 sm:group-hover:scale-100 sm:group-hover:opacity-100 sm:group-hover:pointer-events-auto",
  );

  const busy = isAdding && !justAdded;

  if (canQuickAdd && singleVariant) {
    return (
      <>
        <div className={containerClass}>
          <button
            type="button"
            onClick={onQuickAdd}
            aria-busy={busy}
            aria-label={
              justAdded
                ? `${product.title} added to bag`
                : busy
                  ? `Adding ${product.title} to bag`
                  : `Add ${product.title} to bag`
            }
            disabled={busy}
            className={clsx(
              base,
              justAdded
                ? "add-to-cart-animate-success bg-[#1f1f1f] text-[#f0eeeb]"
                : "bg-black/[0.82] text-white backdrop-blur-md hover:bg-black/90",
              busy && "cursor-wait bg-black/75 text-[#f2f0ed]",
              !justAdded && !busy && "active:scale-[0.98] active:add-to-cart-animate-press",
              !isCheckout && "sm:pointer-events-none sm:group-hover:pointer-events-auto",
              "pointer-events-auto focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
            )}
          >
            {justAdded ? (
              <span className="flex items-center justify-center gap-2 whitespace-nowrap">
                <CheckIcon
                  className="add-to-cart-check-icon h-3.5 w-3.5 shrink-0 text-[#d6d3cf]"
                  aria-hidden
                />
                <span>Added to bag</span>
              </span>
            ) : busy ? (
              <span className="flex items-center justify-center gap-2.5 whitespace-nowrap text-[#f7f5f2]">
                <LuxuryAddSpinner className="h-3.5 w-3.5" />
                <span>Adding to bag</span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2 whitespace-nowrap">
                <ShoppingBagIcon
                  className="h-3.5 w-3.5 shrink-0 opacity-95"
                  strokeWidth={1.5}
                />
                <span>Add to bag</span>
              </span>
            )}
          </button>
        </div>
        {error ? (
          <p className="sr-only" role="alert">
            {error}
          </p>
        ) : null}
        <p aria-live="polite" className="sr-only" role="status">
          {justAdded
            ? `${product.title} added to bag.`
            : error
              ? error
              : ""}
        </p>
      </>
    );
  }

  if (product.variants.length > 1) {
    return (
      <div className={containerClass}>
        <Link
          href={href}
          prefetch
          onClick={(e) => e.stopPropagation()}
          className={clsx(
            base,
            "pointer-events-auto bg-white/[0.93] text-[#0c0c0c] backdrop-blur-md hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0c0c0c]/25",
            !isCheckout && "sm:pointer-events-none sm:group-hover:pointer-events-auto",
          )}
        >
          Options
        </Link>
      </div>
    );
  }

  if (singleVariant && !singleVariant.availableForSale) {
    return (
      <div className={containerClass}>
        <span
          className={clsx(
            base,
            "cursor-not-allowed bg-[#ebe8e4]/90 text-[#a39e97] shadow-none backdrop-blur-sm",
            !isCheckout && "sm:pointer-events-none sm:group-hover:pointer-events-auto",
          )}
        >
          Sold out
        </span>
      </div>
    );
  }

  return null;
}
