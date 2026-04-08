"use client";

import { Dialog, Transition } from "@headlessui/react";
import {
  AdjustmentsHorizontalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import SortSelect from "components/layout/search/filter/sort-select";
import { createUrl } from "lib/utils";
import clsx from "clsx";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Fragment, Suspense, useState } from "react";

function CollectionDrawerLinks({
  links,
  onPick,
}: {
  links: { title: string; path: string }[];
  onPick: () => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <ul className="mt-2 space-y-0">
      <li className="border-b border-[#f0eeeb]">
        <Link
          href={createUrl(
            "/search",
            (() => {
              const p = new URLSearchParams(searchParams.toString());
              p.delete("q");
              return p;
            })(),
          )}
          onClick={onPick}
          className={clsx(
            "block py-3.5 text-[14px] transition-colors",
            pathname === "/search"
              ? "font-medium text-[#0c0c0c]"
              : "text-[#52524f] hover:text-[#0c0c0c]",
          )}
        >
          All frames
        </Link>
      </li>
      {links.map((item) => {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.delete("q");
        const href = createUrl(item.path, newParams);
        const active = pathname === item.path;
        return (
          <li key={item.path} className="border-b border-[#f0eeeb]">
            <Link
              href={href}
              onClick={onPick}
              className={clsx(
                "block py-3.5 text-[14px] transition-colors",
                active
                  ? "font-medium text-[#0c0c0c]"
                  : "text-[#52524f] hover:text-[#0c0c0c]",
              )}
            >
              {item.title}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default function ShopListingToolbar({
  collectionLinks,
}: {
  collectionLinks: { title: string; path: string }[];
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <>
      <div className="mb-8 flex items-center justify-between gap-6 border-b border-[#e8e6e3] pb-4 md:mb-10 md:pb-5">
        <Suspense
          fallback={
            <div className="h-8 w-[min(100%,14rem)] animate-pulse rounded-none bg-[#f3f1ee]" />
          }
        >
          <SortSelect variant="toolbar" />
        </Suspense>
        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          className="flex shrink-0 items-center gap-2 text-[13px] text-[#0c0c0c] transition-opacity hover:opacity-70"
        >
          <AdjustmentsHorizontalIcon
            className="h-[18px] w-[18px]"
            strokeWidth={1.25}
            aria-hidden
          />
          <span>Filters</span>
        </button>
      </div>

      <Transition show={filtersOpen} as={Fragment}>
        <Dialog onClose={() => setFiltersOpen(false)} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-opacity duration-200 ease-out"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-150 ease-in"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" aria-hidden />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition transform duration-200 ease-in"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="fixed inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#ebe8e2] px-6 py-5">
                <Dialog.Title className="text-[15px] font-medium text-[#0c0c0c]">
                  Filters
                </Dialog.Title>
                <button
                  type="button"
                  aria-label="Close filters"
                  onClick={() => setFiltersOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-none text-[#737373] transition-colors hover:bg-[#f5f3f0] hover:text-[#0c0c0c]"
                >
                  <XMarkIcon className="h-5 w-5" strokeWidth={1.5} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 pb-10 pt-2">
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#8a8580]">
                  Collections
                </p>
                <Suspense fallback={null}>
                  <CollectionDrawerLinks
                    links={collectionLinks}
                    onPick={() => setFiltersOpen(false)}
                  />
                </Suspense>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
