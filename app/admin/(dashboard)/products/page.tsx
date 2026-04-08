import { ProductRow } from "components/admin/product-row";
import { createClient } from "lib/supabase/server";
import type { Product } from "lib/types";
import Link from "next/link";

export const metadata = {
  title: "Products",
};

type ProductRowDb = {
  id: string;
  handle: string;
  active: boolean;
  sort_index: number;
  data: Product;
};

export default async function AdminProductsPage() {
  let rows: ProductRowDb[] = [];
  let loadError: string | null = null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("id, handle, active, sort_index, data")
      .order("sort_index", { ascending: false });

    if (error) {
      loadError = error.message;
    } else {
      rows = (data ?? []) as ProductRowDb[];
    }
  } catch {
    loadError =
      "Could not load products. Check Supabase env vars and that migrations are applied to your linked project.";
  }

  if (loadError) {
    return (
      <div className="max-w-xl">
        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#8a8580]">Catalog</p>
        <h1 className="mt-2 font-display text-2xl font-normal tracking-tight text-[#0c0c0c]">
          Products
        </h1>
        <div className="mt-6 rounded-none border border-red-200/90 bg-red-50/90 px-4 py-3 text-sm text-red-950">
          {loadError}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-[#6b6560]">
          Run <code className="rounded-none bg-[#f0ede8] px-1.5 py-0.5 text-[13px]">npm run db:push</code>{" "}
          after <code className="text-[13px]">npx supabase link</code>, then{" "}
          <code className="text-[13px]">npm run seed:products</code>.
        </p>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="max-w-xl">
        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#8a8580]">Catalog</p>
        <h1 className="mt-2 font-display text-2xl font-normal tracking-tight text-[#0c0c0c]">
          Products
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-[#6b6560]">
          The <code className="rounded-none bg-[#f0ede8] px-1.5 py-0.5 text-[13px]">products</code> table
          is empty. Run <code className="text-[13px]">npm run seed:products</code> or{" "}
          <a href="/admin/products/new" className="font-medium text-[#0c0c0c] underline underline-offset-2">
            add a product here
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div>
      <header className="flex max-w-2xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#8a8580]">Catalog</p>
          <h1 className="mt-2 font-display text-[clamp(1.75rem,3vw,2.25rem)] font-normal tracking-tight text-[#0c0c0c]">
            Products
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#6b6560]">
            Control storefront visibility and <strong className="font-medium text-[#0c0c0c]">sort index</strong>{" "}
            (higher values surface first for “Trending”).
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="shrink-0 border border-[#0c0c0c] bg-[#0c0c0c] px-6 py-3 text-center text-[11px] font-medium uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#2a2a2a]"
        >
          Add product
        </Link>
      </header>

      <div className="mt-10 overflow-hidden rounded-none border border-[#e8e4df] bg-white shadow-[0_1px_0_rgba(0,0,0,0.03)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#ece8e3] bg-[#faf9f7] text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a8580]">
                <th className="px-5 py-3.5 pr-4">Product</th>
                <th className="px-0 py-3.5 pr-4">Visibility</th>
                <th className="py-3.5 pl-0 pr-5">Sort</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0ebe6]">
              {rows.map((row) => (
                <ProductRow key={row.id} row={row} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
