"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Form from "next/form";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Search({ className }: { className?: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointer = (e: PointerEvent) => {
      const el = wrapRef.current;
      if (el && !el.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer, true);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer, true);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const q = searchParams?.get("q") || "";
  const sort = searchParams?.get("sort") || "";

  return (
    <div
      ref={wrapRef}
      className={clsx("flex items-center justify-end", className)}
    >
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open search"
          aria-expanded={open}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-none transition-colors hover:bg-black/[0.04]"
          style={{ color: "var(--nav-muted)" }}
        >
          <MagnifyingGlassIcon className="h-[18px] w-[18px]" strokeWidth={1.25} />
        </button>
      ) : (
        <Form
          action="/search"
          className="relative w-[min(280px,calc(100vw-8rem))] min-w-[180px]"
        >
          <label htmlFor="site-search" className="sr-only">
            Search products
          </label>
          {sort ? <input type="hidden" name="sort" value={sort} /> : null}
          <MagnifyingGlassIcon
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a3a3a3]"
            strokeWidth={2}
          />
          <input
            ref={inputRef}
            id="site-search"
            key={q}
            type="search"
            name="q"
            placeholder="Search"
            autoComplete="off"
            enterKeyHint="search"
            defaultValue={q}
            className="h-9 w-full rounded-none bg-[#f5f5f5] pl-9 pr-10 text-[13px] text-[#0a0a0a] outline-none transition-colors placeholder:text-[#a3a3a3] focus:bg-[#ebebeb]"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close search"
            className="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-none text-[#a3a3a3] transition-colors hover:bg-black/[0.06] hover:text-[#0a0a0a]"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </Form>
      )}
    </div>
  );
}

export function SearchSkeleton() {
  return (
    <div
      className="h-10 w-10 shrink-0 animate-pulse rounded-none bg-black/[0.06]"
      aria-hidden
    />
  );
}
