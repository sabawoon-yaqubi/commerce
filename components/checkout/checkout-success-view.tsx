import Price from "components/price";
import { Breadcrumbs } from "components/layout/breadcrumbs";
import { countryName } from "lib/checkout/countries";
import type { OrderConfirmation } from "lib/checkout/types";
import Link from "next/link";

const exploreLink =
  "text-[11px] font-medium uppercase tracking-[0.26em] text-[#6b6560] transition-colors hover:text-[#0c0c0c]";

export function CheckoutSuccessWithOrder({ order }: { order: OrderConfirmation }) {
  return (
    <div className="relative min-h-[calc(100vh-5rem)] bg-[#f4f1ec] px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-lg">
        <Breadcrumbs
          className="mb-8"
          items={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/search" },
            { label: "Thank you" },
          ]}
        />
        <article className="border border-[#e5e0d8] bg-white px-8 py-12 shadow-[0_2px_24px_rgba(0,0,0,0.04)] sm:px-12 sm:py-14">
          <header className="text-center">
            <p className="font-display text-[13px] font-normal tracking-[0.4em] text-[#8a8580]">
              Order confirmed
            </p>
            <h1 className="font-display mt-6 text-3xl font-normal tracking-tight text-[#0c0c0c] sm:text-[2rem]">
              Thank you
            </h1>
            <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-[#737373]">
              We&apos;ll email you when your order ships.
            </p>
          </header>

          <div className="mt-10 space-y-4 border-y border-[#ece8e3] py-8 text-center">
            <p className="font-mono text-[13px] tracking-wide text-[#0c0c0c]">
              {order.orderId}
            </p>
            <p className="text-sm text-[#8a8580]">{order.email}</p>
            <p className="pt-2 font-display text-2xl font-normal text-[#0c0c0c]">
              <Price
                className="inline"
                amount={order.totalAmount}
                currencyCode={order.currencyCode}
              />
              <span className="ml-2 align-middle font-sans text-sm font-normal text-[#a39e96]">
                {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
              </span>
            </p>
          </div>

          <section className="mt-10 text-left">
            <h2 className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#8a8580]">
              Delivery
            </h2>
            <p className="mt-4 text-sm leading-[1.7] text-[#2a2825]">
              {order.firstName} {order.lastName}
              <br />
              {order.address1}
              {order.address2 ? (
                <>
                  <br />
                  {order.address2}
                </>
              ) : null}
              <br />
              {order.city}, {order.state} {order.postalCode}
              <br />
              <span className="text-[#5c5850]">{countryName(order.country)}</span>
            </p>
            {order.phone ? (
              <p className="mt-4 text-sm text-[#8a8580]">{order.phone}</p>
            ) : null}
            {order.notes ? (
              <p className="mt-4 border-t border-[#f0ebe6] pt-4 text-sm italic text-[#8a8580]">
                {order.notes}
              </p>
            ) : null}
          </section>

          <div className="mt-12">
            <Link
              href="/search"
              className="flex min-h-[3.25rem] w-full items-center justify-center bg-[#0c0c0c] text-[11px] font-medium uppercase tracking-[0.28em] text-white transition-colors hover:bg-[#2a2a2a]"
            >
              Continue shopping
            </Link>
          </div>
        </article>

        <nav
          className="mt-12 text-center"
          aria-label="Explore the store"
        >
          <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#9a948c]">
            You may also like
          </p>
          <ul className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-8">
            <li>
              <Link href="/search?sort=latest-desc" className={exploreLink}>
                New arrivals
              </Link>
            </li>
            <li className="hidden text-[#d4cfc8] sm:block" aria-hidden>
              ·
            </li>
            <li>
              <Link href="/" className={exploreLink}>
                Home
              </Link>
            </li>
            <li className="hidden text-[#d4cfc8] sm:block" aria-hidden>
              ·
            </li>
            <li>
              <Link href="/search" className={exploreLink}>
                Collection
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export function CheckoutSuccessEmpty() {
  return (
    <div className="relative min-h-[calc(100vh-5rem)] bg-[#f4f1ec] px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-lg">
        <Breadcrumbs
          className="mb-8"
          items={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/search" },
            { label: "Thank you" },
          ]}
        />
        <article className="border border-[#e5e0d8] bg-white px-8 py-12 text-center shadow-[0_2px_24px_rgba(0,0,0,0.04)] sm:px-12 sm:py-14">
          <p className="font-display text-[13px] font-normal tracking-[0.4em] text-[#8a8580]">
            Order confirmed
          </p>
          <h1 className="font-display mt-6 text-3xl font-normal tracking-tight text-[#0c0c0c]">
            Thank you
          </h1>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-[#737373]">
            Confirmation details are in your email.
          </p>
          <div className="mt-10">
            <Link
              href="/search"
              className="inline-flex min-h-[3.25rem] w-full max-w-xs items-center justify-center bg-[#0c0c0c] text-[11px] font-medium uppercase tracking-[0.28em] text-white transition-colors hover:bg-[#2a2a2a]"
            >
              Continue shopping
            </Link>
          </div>
        </article>
        <nav className="mt-12 text-center" aria-label="Explore">
          <ul className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-8">
            <li>
              <Link href="/search?sort=latest-desc" className={exploreLink}>
                New arrivals
              </Link>
            </li>
            <li>
              <Link href="/" className={exploreLink}>
                Home
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
