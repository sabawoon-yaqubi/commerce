import { SignOut } from "components/admin/sign-out";
import { BRAND_NAME } from "lib/brand";
import Link from "next/link";
import type { ReactNode } from "react";

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-[#e8e4df] bg-[#fbfaf8]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4 lg:px-10">
          <div className="flex flex-col gap-0.5">
            <Link
              href="/admin"
              className="font-display text-lg font-normal tracking-tight text-[#0c0c0c] transition-opacity hover:opacity-75"
            >
              {BRAND_NAME}
            </Link>
            <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#8a8580]">
              Store admin
            </span>
          </div>
          <nav className="flex flex-wrap items-center gap-x-8 gap-y-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[#6b6560]">
            <Link href="/admin/products" className="transition-colors hover:text-[#0c0c0c]">
              Products
            </Link>
            <Link href="/admin/orders" className="transition-colors hover:text-[#0c0c0c]">
              Orders
            </Link>
            <Link href="/" className="transition-colors hover:text-[#0c0c0c]">
              Storefront
            </Link>
            <span className="hidden h-3 w-px bg-[#d9d4d0] sm:block" aria-hidden />
            <SignOut />
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-12 lg:px-10 lg:py-14">{children}</main>
    </div>
  );
}
