import Link from "next/link";

export const metadata = {
  title: "Overview",
};

export default function AdminHomePage() {
  return (
    <div>
      <header className="max-w-2xl">
        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#8a8580]">Overview</p>
        <h1 className="mt-2 font-display text-[clamp(1.75rem,3vw,2.25rem)] font-normal tracking-tight text-[#0c0c0c]">
          Welcome back
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-[#6b6560]">
          Manage what shoppers see on the site. Orders fill in automatically once checkout is wired
          to your database.
        </p>
      </header>

      <ul className="mt-12 grid gap-5 sm:grid-cols-2">
        <li>
          <Link
            href="/admin/products"
            className="group block rounded-none border border-[#e8e4df] bg-white p-7 shadow-[0_1px_0_rgba(0,0,0,0.03)] transition-[border,box-shadow] hover:border-[#cfc9c2] hover:shadow-[0_12px_40px_-16px_rgba(0,0,0,0.12)]"
          >
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#8a8580]">
              Catalog
            </p>
            <p className="mt-3 font-display text-xl font-normal text-[#0c0c0c]">Products</p>
            <p className="mt-2 text-sm leading-relaxed text-[#6b6560]">
              Show or hide items, adjust sort index for “Trending”.
            </p>
            <span className="mt-5 inline-flex items-center text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0c0c0c] group-hover:underline group-hover:underline-offset-4">
              Open →
            </span>
          </Link>
        </li>
        <li>
          <Link
            href="/admin/orders"
            className="group block rounded-none border border-[#e8e4df] bg-white p-7 shadow-[0_1px_0_rgba(0,0,0,0.03)] transition-[border,box-shadow] hover:border-[#cfc9c2] hover:shadow-[0_12px_40px_-16px_rgba(0,0,0,0.12)]"
          >
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#8a8580]">
              Fulfillment
            </p>
            <p className="mt-3 font-display text-xl font-normal text-[#0c0c0c]">Orders</p>
            <p className="mt-2 text-sm leading-relaxed text-[#6b6560]">
              Review references, totals, and status when payments write here.
            </p>
            <span className="mt-5 inline-flex items-center text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0c0c0c] group-hover:underline group-hover:underline-offset-4">
              Open →
            </span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
