"use client";

import { saveProduct, type SaveProductState } from "lib/admin/product-actions";
import Link from "next/link";
import { useActionState } from "react";

const actionInitial: SaveProductState = {};

const label =
  "block text-[11px] font-medium uppercase tracking-[0.2em] text-[#8a8580]";
const input =
  "mt-2 w-full border border-black/[0.12] bg-white px-4 py-3 text-sm text-[#0c0c0c] outline-none transition-shadow placeholder:text-[#b3b3b3] focus:border-[#0c0c0c] focus:ring-1 focus:ring-[#0c0c0c]";

export type ProductFormInitial = {
  title: string;
  handle: string;
  description: string;
  price: string;
  imageUrl: string;
  tags: string;
  sortIndex: number;
  active: boolean;
  availableForSale: boolean;
  productId: string;
  variantId: string;
};

export function ProductForm({
  rowId,
  initial,
}: {
  rowId?: string;
  initial: ProductFormInitial;
}) {
  const [state, formAction] = useActionState(saveProduct, actionInitial);

  return (
    <form action={formAction} className="max-w-xl space-y-10">
      {rowId ? <input type="hidden" name="rowId" value={rowId} /> : null}
      <input type="hidden" name="productId" value={initial.productId} />
      <input type="hidden" name="variantId" value={initial.variantId} />

      {state.message ? (
        <div
          role="alert"
          className="rounded-none border border-red-200/90 bg-red-50/90 px-4 py-3 text-sm text-red-950"
        >
          {state.message}
        </div>
      ) : null}

      <div>
        <label htmlFor="title" className={label}>
          Title
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={initial.title}
          className={input}
          placeholder="e.g. Noir Aviator"
        />
      </div>

      <div>
        <label htmlFor="handle" className={label}>
          Handle (URL)
        </label>
        <input
          id="handle"
          name="handle"
          required
          defaultValue={initial.handle}
          className={`${input} font-mono text-[13px]`}
          placeholder="noir-aviator"
        />
        <p className="mt-2 text-xs text-[#8a8580]">
          Shown as <span className="font-mono">/product/your-handle</span>
        </p>
      </div>

      <div>
        <label htmlFor="description" className={label}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          defaultValue={initial.description}
          className={`${input} min-h-[140px] resize-y`}
        />
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <label htmlFor="price" className={label}>
            Price (USD)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            inputMode="decimal"
            min="0.01"
            step="0.01"
            required
            defaultValue={initial.price}
            className={input}
          />
        </div>
        <div>
          <label htmlFor="sortIndex" className={label}>
            Sort index
          </label>
          <input
            id="sortIndex"
            name="sortIndex"
            type="number"
            required
            defaultValue={initial.sortIndex}
            className={input}
          />
          <p className="mt-2 text-xs text-[#8a8580]">Higher appears first for “Trending”.</p>
        </div>
      </div>

      <div>
        <label htmlFor="imageUrl" className={label}>
          Image URL
        </label>
        <input
          id="imageUrl"
          name="imageUrl"
          type="url"
          required
          defaultValue={initial.imageUrl}
          className={input}
          placeholder="https://images.unsplash.com/…"
        />
        <p className="mt-2 text-xs text-[#8a8580]">
          Use a direct image link (Unsplash works out of the box). For other hosts, add the domain in{" "}
          <span className="font-mono">next.config.ts</span> under{" "}
          <span className="font-mono">images.remotePatterns</span>.
        </p>
      </div>

      <div>
        <label htmlFor="tags" className={label}>
          Tags
        </label>
        <input
          id="tags"
          name="tags"
          defaultValue={initial.tags}
          className={input}
          placeholder="essentials, new-arrivals, homepage-featured, homepage-carousel"
        />
        <p className="mt-2 text-xs text-[#8a8580]">
          Comma-separated. Collections: <span className="font-mono">new-arrivals</span>,{" "}
          <span className="font-mono">essentials</span>. Homepage:{" "}
          <span className="font-mono">homepage-featured</span> (The edit),{" "}
          <span className="font-mono">homepage-carousel</span> (In rotation).
        </p>
      </div>

      <div className="flex flex-col gap-4 border-t border-[#ece8e3] pt-8">
        <label className="flex cursor-pointer items-start gap-3 text-sm text-[#3d3a36]">
          <input
            type="checkbox"
            name="active"
            value="on"
            defaultChecked={initial.active}
            className="mt-1 h-4 w-4 border-black/[0.2] text-[#0c0c0c] focus:ring-[#0c0c0c]"
          />
          <span>
            <span className="font-medium text-[#0c0c0c]">Visible in admin / live</span>
            <br />
            <span className="text-[#8a8580]">Uncheck to hide from the storefront without deleting.</span>
          </span>
        </label>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-[#3d3a36]">
          <input
            type="checkbox"
            name="availableForSale"
            value="on"
            defaultChecked={initial.availableForSale}
            className="mt-1 h-4 w-4 border-black/[0.2] text-[#0c0c0c] focus:ring-[#0c0c0c]"
          />
          <span>
            <span className="font-medium text-[#0c0c0c]">Available for purchase</span>
            <br />
            <span className="text-[#8a8580]">Controls add-to-cart availability.</span>
          </span>
        </label>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-[#ece8e3] pt-8">
        <button
          type="submit"
          className="border border-[#0c0c0c] bg-[#0c0c0c] px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#2a2a2a]"
        >
          Save product
        </button>
        <Link
          href="/admin/products"
          className="border border-black/[0.12] bg-white px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.22em] text-[#0c0c0c] transition-colors hover:bg-[#faf9f7]"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
