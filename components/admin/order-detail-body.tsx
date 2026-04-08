import { countryName } from "lib/checkout/countries";
import type { LineItemDisplay, ShippingDisplay } from "lib/admin/order-display";
import { stripeCheckoutSessionDashboardUrl } from "lib/admin/order-display";
import type { ReactNode } from "react";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a8580]">
        {label}
      </p>
      <div className="mt-1 text-sm text-[#0c0c0c]">{children}</div>
    </div>
  );
}

export function ShippingAddressBlock({ s }: { s: ShippingDisplay | null }) {
  if (!s || Object.values(s).every((v) => v == null || v === "")) {
    return (
      <section>
        <h2 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8a8580]">
          Shipping address
        </h2>
        <p className="mt-3 text-sm text-[#8a8580]">No address on file.</p>
      </section>
    );
  }

  const name = [s.firstName, s.lastName].filter(Boolean).join(" ");
  const cityLine = [s.city, s.state, s.postalCode].filter(Boolean).join(", ");

  return (
    <section>
      <h2 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8a8580]">
        Shipping address
      </h2>
      <div className="mt-4 space-y-1 text-sm leading-relaxed text-[#2a2825]">
        {name ? <p className="font-medium text-[#0c0c0c]">{name}</p> : null}
        {s.company ? <p>{s.company}</p> : null}
        {s.address1 ? <p>{s.address1}</p> : null}
        {s.address2 ? <p>{s.address2}</p> : null}
        {cityLine ? <p>{cityLine}</p> : null}
        {s.country ? (
          <p className="text-[#3d3a36]">{countryName(s.country)}</p>
        ) : null}
        {s.email ? (
          <p className="mt-3 text-[#6b6560]">
            <span className="text-[#8a8580]">Email · </span>
            {s.email}
          </p>
        ) : null}
        {s.phone ? (
          <p className="text-[#6b6560]">
            <span className="text-[#8a8580]">Phone · </span>
            {s.phone}
          </p>
        ) : null}
      </div>
    </section>
  );
}

export function LineItemsTable({ items }: { items: LineItemDisplay[] }) {
  if (!items.length) {
    return (
      <section>
        <h2 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8a8580]">
          Line items
        </h2>
        <p className="mt-3 text-sm text-[#8a8580]">No line items stored.</p>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8a8580]">
        Line items
      </h2>
      <div className="mt-4 overflow-hidden rounded-none border border-[#ece8e3]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#ece8e3] bg-[#faf9f7] text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8a8580]">
              <th className="px-4 py-3 font-semibold">Description</th>
              <th className="px-4 py-3 font-semibold tabular-nums">Qty</th>
              <th className="px-4 py-3 font-semibold tabular-nums">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0ebe6]">
            {items.map((row, i) => (
              <tr key={`${row.description}-${i}`}>
                <td className="px-4 py-3 text-[#0c0c0c]">{row.description}</td>
                <td className="px-4 py-3 tabular-nums text-[#3d3a36]">
                  {row.quantity}
                </td>
                <td className="px-4 py-3 tabular-nums text-[#3d3a36]">
                  {row.amount != null && row.currency
                    ? `${row.amount.toFixed(2)} ${row.currency.toUpperCase()}`
                    : row.amount != null
                      ? String(row.amount)
                      : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/** Show remaining Stripe metadata keys in a readable list (skip bulky shipping blob). */
export function MetadataExtras({
  metadata,
}: {
  metadata: unknown;
}) {
  if (metadata == null || typeof metadata !== "object" || Array.isArray(metadata)) {
    return null;
  }
  const entries = Object.entries(metadata as Record<string, unknown>).filter(
    ([key, val]) => {
      if (key === "shipping") return false;
      if (typeof val !== "string") return true;
      if (val.length > 200 && val.startsWith("{")) return false;
      return true;
    },
  );
  if (!entries.length) return null;

  const label = (k: string) =>
    k === "order_ref"
      ? "Order ref (metadata)"
      : k === "notes"
        ? "Notes (metadata)"
        : k.replace(/_/g, " ");

  return (
    <section>
      <h2 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8a8580]">
        Checkout metadata
      </h2>
      <dl className="mt-4 space-y-3 rounded-none border border-[#ece8e3] bg-[#faf9f7] p-4">
        {entries.map(([key, val]) => (
          <div key={key}>
            <dt className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#8a8580]">
              {label(key)}
            </dt>
            <dd className="mt-0.5 break-words text-sm text-[#2a2825]">
              {typeof val === "string" ? val : JSON.stringify(val)}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function StripeSessionLink({
  sessionId,
}: {
  sessionId: string | null;
}) {
  if (!sessionId) {
    return <Field label="Stripe Checkout">—</Field>;
  }
  const href = stripeCheckoutSessionDashboardUrl(sessionId);
  return (
    <Field label="Stripe Checkout">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 font-mono text-[13px] text-[#2563eb] underline-offset-2 hover:underline"
      >
        Open in Stripe Dashboard
        <span aria-hidden className="text-[#8a8580]">
          ↗
        </span>
      </a>
      <p className="mt-2 break-all font-mono text-[11px] text-[#8a8580]">
        {sessionId}
      </p>
    </Field>
  );
}
