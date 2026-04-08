import {
  LineItemsTable,
  MetadataExtras,
  ShippingAddressBlock,
  StripeSessionLink,
} from "components/admin/order-detail-body";
import { parseLineItems, parseShipping } from "lib/admin/order-display";
import { createClient } from "lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Order detail",
};

type OrderRow = {
  id: string;
  order_ref: string;
  stripe_checkout_session_id: string | null;
  email: string | null;
  shipping: unknown;
  line_items: unknown;
  subtotal: string | number | null;
  total: string | number | null;
  currency: string;
  status: string;
  notes: string | null;
  metadata: unknown;
  created_at: string;
};

export default async function AdminOrderDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const uuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      id,
    );
  if (!uuid) notFound();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) notFound();

  const o = data as OrderRow;
  const shipping = parseShipping(o.shipping);
  const lineItems = parseLineItems(o.line_items);

  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#8a8580]">
        <Link href="/admin/orders" className="transition-colors hover:text-[#0c0c0c]">
          Orders
        </Link>
        <span className="mx-2 text-[#d4cfc8]">/</span>
        <span className="text-[#0c0c0c]">{o.order_ref}</span>
      </p>

      <header className="mt-6 flex flex-col gap-6 border-b border-[#ece8e3] pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-display text-[clamp(1.65rem,3vw,2.15rem)] font-normal tracking-tight text-[#0c0c0c]">
            {o.order_ref}
          </h1>
          <p className="mt-2 text-[13px] text-[#8a8580]">
            Placed{" "}
            {new Date(o.created_at).toLocaleString(undefined, {
              dateStyle: "long",
              timeStyle: "short",
            })}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 lg:justify-end">
          <span className="rounded-none border border-[#e8e4df] bg-[#faf9f7] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.15em] text-[#5c5850]">
            {o.status}
          </span>
          <p className="font-display text-xl tabular-nums text-[#0c0c0c]">
            {o.total != null ? `${o.total}` : "—"}{" "}
            <span className="text-sm font-normal text-[#8a8580]">{o.currency}</span>
          </p>
        </div>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div className="space-y-8">
          <section>
            <h2 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8a8580]">
              Customer
            </h2>
            <dl className="mt-4 space-y-4">
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a8580]">
                  Email
                </dt>
                <dd className="mt-1 text-sm text-[#0c0c0c]">{o.email ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a8580]">
                  Order notes
                </dt>
                <dd className="mt-1 text-sm text-[#3d3a36]">{o.notes ?? "—"}</dd>
              </div>
            </dl>
          </section>

          <StripeSessionLink sessionId={o.stripe_checkout_session_id} />

          <div className="grid grid-cols-2 gap-6 border-t border-[#f0ebe6] pt-8">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a8580]">
                Subtotal
              </p>
              <p className="mt-1 text-sm tabular-nums text-[#0c0c0c]">
                {o.subtotal != null ? `${o.subtotal} ${o.currency}` : "—"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a8580]">
                Total
              </p>
              <p className="mt-1 text-sm font-medium tabular-nums text-[#0c0c0c]">
                {o.total != null ? `${o.total} ${o.currency}` : "—"}
              </p>
            </div>
          </div>
        </div>

        <ShippingAddressBlock s={shipping} />
      </div>

      <div className="mt-12 space-y-12 border-t border-[#ece8e3] pt-12">
        <LineItemsTable items={lineItems} />
        <MetadataExtras metadata={o.metadata} />
      </div>

      <p className="mt-12 border-t border-[#f0ebe6] pt-8 font-mono text-[11px] text-[#b5aea5]">
        Internal id · {o.id}
      </p>
    </div>
  );
}
