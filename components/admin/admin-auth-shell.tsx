import { BRAND_NAME } from "lib/brand";
import Link from "next/link";
import type { ReactNode } from "react";

export function AdminAuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      <aside className="relative hidden overflow-hidden bg-[#0c0c0c] lg:block">
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_20%_-10%,#2a2624_0%,#0c0c0c_55%,#121110_100%)]"
          aria-hidden
        />
        <div className="hero-grain absolute inset-0 opacity-[0.06]" aria-hidden />
        <div className="relative flex h-full min-h-screen flex-col justify-between px-10 py-12 lg:px-14 lg:py-16">
          <Link
            href="/"
            className="font-display text-2xl font-normal tracking-tight text-white transition-opacity hover:opacity-80"
          >
            {BRAND_NAME}
          </Link>
          <div className="space-y-6">
            <p className="text-[10px] font-medium uppercase tracking-[0.38em] text-white/45">
              Administration
            </p>
            <h2 className="max-w-[20ch] font-display text-[clamp(1.75rem,3vw,2.5rem)] font-normal leading-[1.15] tracking-tight text-white">
              Curate the collection. Review every order.
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-white/55">
              Sign in to update products, visibility, and sort order. Customer checkout stays on the
              storefront — no shopper accounts required.
            </p>
          </div>
          <p className="text-[11px] tracking-wide text-white/30">Supabase · encrypted session</p>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col justify-center bg-[#f4f2ef] px-5 py-16 sm:px-10">
        <div className="mb-10 lg:hidden">
          <Link
            href="/"
            className="font-display text-xl font-normal tracking-tight text-[#0c0c0c]"
          >
            {BRAND_NAME}
          </Link>
          <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.28em] text-[#8a8580]">
            Admin sign-in
          </p>
        </div>
        <div className="mx-auto w-full max-w-[420px]">{children}</div>
      </div>
    </div>
  );
}
