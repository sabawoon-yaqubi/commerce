"use client";

import { toggleProductActive, updateSortIndex } from "lib/admin/product-actions";
import type { Product } from "lib/types";
import Link from "next/link";
import { useFormStatus } from "react-dom";

type Row = {
  id: string;
  handle: string;
  active: boolean;
  sort_index: number;
  data: Product;
};

function SubmitLabel({ idle }: { idle: string }) {
  const { pending } = useFormStatus();
  return <>{pending ? "…" : idle}</>;
}

const inputClass =
  "w-[4.5rem] border border-[#e0ddd8] bg-white px-2.5 py-1.5 text-sm tabular-nums outline-none transition-[border,box-shadow] focus:border-[#0c0c0c] focus:shadow-[inset_0_0_0_1px_#0c0c0c]";

export function ProductRow({ row }: { row: Row }) {
  return (
    <tr className="transition-colors hover:bg-[#fafaf8]/80">
      <td className="px-5 py-4 pr-4 align-middle">
        <Link
          href={`/product/${row.handle}`}
          className="text-sm font-medium text-[#0c0c0c] underline decoration-[#0c0c0c]/15 underline-offset-2 transition-colors hover:decoration-[#0c0c0c]"
        >
          {row.data.title}
        </Link>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-[#8a8580]">
          <span>{row.handle}</span>
          <Link
            href={`/admin/products/${row.id}/edit`}
            className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0c0c0c] no-underline hover:underline"
          >
            Edit
          </Link>
        </div>
      </td>
      <td className="align-middle">
        <div className="flex flex-wrap items-center gap-2">
          <form action={toggleProductActive} className="inline">
            <input type="hidden" name="id" value={row.id} />
            <input type="hidden" name="nextActive" value={row.active ? "false" : "true"} />
            <button
              type="submit"
              className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0c0c0c] underline decoration-[#0c0c0c]/25 underline-offset-4 transition-colors hover:decoration-[#0c0c0c]"
            >
              <SubmitLabel idle={row.active ? "Hide" : "Show"} />
            </button>
          </form>
          <span
            className={`inline-flex items-center rounded-none border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] ${
              row.active
                ? "border-emerald-200/80 bg-emerald-50/90 text-emerald-900"
                : "border-[#e8e4df] bg-[#f5f3f0] text-[#8a8580]"
            }`}
          >
            {row.active ? "Live" : "Hidden"}
          </span>
        </div>
      </td>
      <td className="py-4 pl-0 pr-5 align-middle">
        <form action={updateSortIndex} className="flex flex-wrap items-center gap-2">
          <input type="hidden" name="id" value={row.id} />
          <input name="sortIndex" type="number" defaultValue={row.sort_index} className={inputClass} />
          <button
            type="submit"
            className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b6560] transition-colors hover:text-[#0c0c0c]"
          >
            <SubmitLabel idle="Save" />
          </button>
        </form>
      </td>
    </tr>
  );
}
