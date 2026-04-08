"use client";

import { Bars3BottomLeftIcon } from "@heroicons/react/24/outline";
import { sorting } from "lib/constants";
import { createUrl } from "lib/utils";
import clsx from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const chevronSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%230c0c0c' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`;

export default function SortSelect({
  variant = "sidebar",
}: {
  variant?: "sidebar" | "toolbar";
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const sortParam = searchParams.get("sort");
  const value = sortParam ?? "";

  const onChange = useCallback(
    (next: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next) {
        params.set("sort", next);
      } else {
        params.delete("sort");
      }
      router.push(createUrl(pathname, params));
    },
    [pathname, router, searchParams],
  );

  if (variant === "toolbar") {
    return (
      <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
        <Bars3BottomLeftIcon
          className="hidden h-[18px] w-[18px] shrink-0 text-[#0c0c0c] sm:block"
          strokeWidth={1.25}
          aria-hidden
        />
        <label htmlFor="shop-sort-toolbar" className="sr-only">
          Sort products
        </label>
        <span className="shrink-0 text-[13px] text-[#0c0c0c]">Sort by:</span>
        <select
          id="shop-sort-toolbar"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={clsx(
            "min-w-0 max-w-[min(100%,16rem)] cursor-pointer appearance-none border-0 border-b border-[#0c0c0c] bg-transparent py-0.5 pl-0 pr-7 text-[13px] font-normal text-[#0c0c0c] outline-none focus:border-[#0c0c0c] focus:ring-0 sm:max-w-[20rem]",
          )}
          style={{
            backgroundImage: chevronSvg,
            backgroundPosition: "right 0 center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "1rem",
          }}
        >
          {sorting.map((item) => (
            <option key={item.slug ?? "relevance"} value={item.slug ?? ""}>
              {item.title}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <nav aria-label="Sort products" className="w-full">
      <h3 className="mb-3 text-[13px] font-semibold text-[#0a0a0a]">Sort</h3>
      <label htmlFor="shop-sort" className="sr-only">
        Sort products
      </label>
      <select
        id="shop-sort"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-none border border-[#e8e6e3] bg-white bg-[length:1rem] bg-[right_0.65rem_center] bg-no-repeat py-2.5 pl-3 pr-9 text-[13px] text-[#0c0c0c] shadow-[0_1px_0_rgba(12,12,12,0.04)] outline-none transition-[border-color,box-shadow] hover:border-[#d4d0ca] focus:border-[#0c0c0c]/25 focus:ring-2 focus:ring-[#0c0c0c]/10"
        style={{ backgroundImage: chevronSvg }}
      >
        {sorting.map((item) => (
          <option key={item.slug ?? "relevance"} value={item.slug ?? ""}>
            {item.title}
          </option>
        ))}
      </select>
    </nav>
  );
}
