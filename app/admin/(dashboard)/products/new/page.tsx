import { ProductForm } from "components/admin/product-form";

export const metadata = {
  title: "New product",
};

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1200&h=1200&fit=crop&auto=format&q=80";

export default function AdminNewProductPage() {
  return (
    <div>
      <header className="max-w-2xl">
        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#8a8580]">Catalog</p>
        <h1 className="mt-2 font-display text-[clamp(1.75rem,3vw,2.25rem)] font-normal tracking-tight text-[#0c0c0c]">
          New product
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#6b6560]">
          Add a product without opening the Supabase dashboard. Use tags to match collections (e.g.{" "}
          <span className="font-mono text-[13px]">new-arrivals</span>,{" "}
          <span className="font-mono text-[13px]">essentials</span>).
        </p>
      </header>

      <div className="mt-10">
        <ProductForm
          initial={{
            title: "",
            handle: "",
            description: "",
            price: "99",
            imageUrl: DEFAULT_IMAGE,
            tags: "essentials",
            sortIndex: 10,
            active: true,
            availableForSale: true,
            productId: "",
            variantId: "",
          }}
        />
      </div>
    </div>
  );
}
