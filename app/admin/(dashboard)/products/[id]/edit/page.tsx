import { ProductForm } from "components/admin/product-form";
import { createClient } from "lib/supabase/server";
import type { Product } from "lib/types";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Edit product",
};

type Row = {
  id: string;
  data: Product;
  active: boolean;
  sort_index: number;
};

export default async function AdminEditProductPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, data, active, sort_index")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const row = data as Row;
  const p = row.data;
  const v = p.variants[0];
  const price = v ? Number(v.price.amount).toFixed(2) : "0";

  return (
    <div>
      <header className="max-w-2xl">
        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#8a8580]">Catalog</p>
        <h1 className="mt-2 font-display text-[clamp(1.75rem,3vw,2.25rem)] font-normal tracking-tight text-[#0c0c0c]">
          Edit product
        </h1>
        <p className="mt-3 text-sm text-[#6b6560]">
          <Link
            href={`/product/${p.handle}`}
            className="font-medium text-[#0c0c0c] underline decoration-[#0c0c0c]/20 underline-offset-4 hover:decoration-[#0c0c0c]"
          >
            View on storefront
          </Link>
        </p>
      </header>

      <div className="mt-10">
        <ProductForm
          rowId={row.id}
          initial={{
            title: p.title,
            handle: p.handle,
            description: p.description,
            price,
            imageUrl: p.featuredImage.url,
            tags: p.tags.join(", "),
            sortIndex: row.sort_index ?? p.sortIndex,
            active: row.active,
            availableForSale: p.availableForSale,
            productId: p.id,
            variantId: v?.id ?? "",
          }}
        />
      </div>
    </div>
  );
}
