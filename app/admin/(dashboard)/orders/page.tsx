import { createClient } from "lib/supabase/server";
import Link from "next/link";

export const metadata = {
  title: "Orders",
};

export default async function AdminOrdersPage() {
  let orders: {
    id: string;
    order_ref: string;
    email: string | null;
    total: string | null;
    currency: string;
    status: string;
    created_at: string;
  }[] = [];
  let loadError: string | null = null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("orders")
      .select("id, order_ref, email, total, currency, status, created_at")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      loadError = error.message;
    } else {
      orders = (data ?? []) as typeof orders;
    }
  } catch {
    loadError = "Could not load orders.";
  }

  return (
    <div>
      <header className="max-w-2xl">
        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#8a8580]">
          Fulfillment
        </p>
        <h1 className="mt-2 font-display text-[clamp(1.75rem,3vw,2.25rem)] font-normal tracking-tight text-[#0c0c0c]">
          Orders
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#6b6560]">
          Open a row for full shipping, line items, and Stripe metadata.
        </p>
      </header>

      {loadError ? (
        <div className="mt-8 max-w-xl rounded-none border border-red-200/90 bg-red-50/90 px-4 py-3 text-sm text-red-950">
          {loadError}
        </div>
      ) : null}

      {!loadError && orders.length === 0 ? (
        <div className="mt-12 rounded-none border border-dashed border-[#d4cfc8] bg-[#faf9f7] px-8 py-14 text-center">
          <p className="font-display text-lg text-[#3d3a36]">No orders yet</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#8a8580]">
            Completed checkouts will appear here.
          </p>
        </div>
      ) : null}

      {!loadError && orders.length > 0 ? (
        <div className="mt-10 overflow-hidden rounded-none border border-[#e8e4df] bg-white shadow-[0_1px_0_rgba(0,0,0,0.03)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#ece8e3] bg-[#faf9f7] text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a8580]">
                  <th className="px-5 py-3.5">Reference</th>
                  <th className="py-3.5 pr-4">Email</th>
                  <th className="py-3.5 pr-4">Total</th>
                  <th className="py-3.5 pr-4">Status</th>
                  <th className="py-3.5 pr-4">Date</th>
                  <th className="py-3.5 pr-5 text-right"> </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0ebe6]">
                {orders.map((o) => (
                  <tr key={o.id} className="group hover:bg-[#faf9f7]/80">
                    <td className="px-5 py-3.5 font-mono text-[13px] text-[#0c0c0c]">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="underline-offset-4 hover:underline"
                      >
                        {o.order_ref}
                      </Link>
                    </td>
                    <td className="py-3.5 pr-4 text-[#3d3a36]">{o.email ?? "—"}</td>
                    <td className="py-3.5 pr-4 tabular-nums text-[#3d3a36]">
                      {o.total != null ? `${o.total} ${o.currency}` : "—"}
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className="rounded-none border border-[#e8e4df] bg-[#faf9f7] px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider text-[#5c5850]">
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 text-[#8a8580]">
                      {new Date(o.created_at).toLocaleString()}
                    </td>
                    <td className="py-3.5 pr-5 text-right">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#6b6560] opacity-0 transition-opacity group-hover:opacity-100 hover:text-[#0c0c0c] sm:opacity-100"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
