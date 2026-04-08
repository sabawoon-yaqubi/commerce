"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { addItem } from "components/cart/actions";
import { LuxuryAddSpinner } from "components/cart/luxury-add-spinner";
import { Product, ProductVariant } from "lib/types";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { useCart } from "./cart-context";

function SubmitButton({
  availableForSale,
  selectedVariantId,
  justAdded,
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
  justAdded: boolean;
}) {
  const { pending } = useFormStatus();
  const base = clsx(
    "font-display relative flex w-full min-h-[54px] items-center justify-center gap-3 overflow-hidden rounded-none py-4 text-[12px] font-normal tracking-[0.14em] transition-[background-color,color,border-color,box-shadow] duration-[480ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
    "border border-white/[0.07]",
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_2px_14px_-4px_rgba(0,0,0,0.22)]",
  );

  if (!availableForSale) {
    return (
      <button
        disabled
        className={clsx(
          base,
          "cursor-not-allowed border-transparent bg-[#f3f1ee] text-[#a39e96] shadow-none",
        )}
      >
        Out of stock
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <button
        aria-label="Please select an option"
        disabled
        className={clsx(
          base,
          "cursor-not-allowed border-transparent bg-[#f3f1ee] text-[#a39e96] shadow-none",
        )}
      >
        <PlusIcon className="h-3.5 w-3.5" strokeWidth={1.35} />
        Select options
      </button>
    );
  }

  const isBusy = pending && !justAdded;

  return (
    <button
      type="submit"
      aria-busy={isBusy}
      aria-label={
        justAdded
          ? "Added to bag"
          : isBusy
            ? "Adding to bag"
            : "Add to bag"
      }
      disabled={isBusy}
      className={clsx(
        base,
        justAdded
          ? "add-to-cart-animate-success border-[#2a2a2a] bg-[#1a1a1a] text-[#f0efed]"
          : "bg-[#0c0c0c] text-[#fafaf9] hover:border-white/[0.1] hover:bg-[#121212]",
        isBusy &&
          "cursor-wait border-white/[0.08] bg-[#0e0e0e] text-[#e8e6e3]",
        !justAdded && !isBusy && "active:add-to-cart-animate-press",
      )}
    >
      {justAdded ? (
        <span className="flex items-center justify-center gap-2.5 uppercase">
          <CheckIcon
            className="add-to-cart-check-icon h-4 w-4 shrink-0 text-[#c9c6c1]"
            aria-hidden
          />
          Added
        </span>
      ) : isBusy ? (
        <span className="flex items-center justify-center gap-3.5 text-[#ebe8e4]">
          <LuxuryAddSpinner />
          <span className="uppercase">Adding</span>
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2.5 uppercase">
          <PlusIcon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.35} />
          Add to bag
        </span>
      )}
    </button>
  );
}

export function AddToCart({ product }: { product: Product }) {
  const { variants, availableForSale } = product;
  const { addCartItem } = useCart();
  const searchParams = useSearchParams();
  const [justAdded, setJustAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === searchParams.get(option.name.toLowerCase()),
    ),
  );
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId;
  const finalVariant = variants.find(
    (variant) => variant.id === selectedVariantId,
  )!;

  useEffect(() => {
    return () => {
      if (successTimer.current) clearTimeout(successTimer.current);
    };
  }, []);

  return (
    <div className="space-y-2">
      <form
        action={async () => {
          if (!selectedVariantId) return;
          setError(null);
          setJustAdded(false);
          const err = await addItem(null, selectedVariantId);
          if (err) {
            setError(err);
            return;
          }
          addCartItem(finalVariant, product);
          if (successTimer.current) clearTimeout(successTimer.current);
          setJustAdded(true);
          successTimer.current = setTimeout(() => setJustAdded(false), 2800);
        }}
      >
        <SubmitButton
          availableForSale={availableForSale}
          selectedVariantId={selectedVariantId}
          justAdded={justAdded}
        />
      </form>
      {error ? (
        <p
          className="text-center font-display text-[12px] tracking-[0.06em] text-[#8b6914]"
          role="alert"
        >
          {error}
        </p>
      ) : null}
      <p aria-live="polite" className="sr-only" role="status">
        {justAdded
          ? "Added to bag."
          : error
            ? error
            : ""}
      </p>
    </div>
  );
}
