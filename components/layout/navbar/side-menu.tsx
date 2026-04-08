"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Bars3BottomLeftIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { BRAND_NAME } from "lib/brand";
import { Menu } from "lib/types";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";

export default function SideMenu({ menu }: { menu: Menu[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
        aria-expanded={isOpen}
        className="group flex items-center gap-2.5 py-2 transition-colors"
        style={{ color: "var(--nav-muted)" }}
      >
        <Bars3BottomLeftIcon className="h-[18px] w-[18px]" strokeWidth={1.25} />
        <span className="hidden text-[10px] font-medium uppercase tracking-[0.28em] sm:inline">
          Menu
        </span>
      </button>

      <Transition show={isOpen}>
        <Dialog onClose={() => setIsOpen(false)} className="relative z-[70]">
          <Transition.Child
            as={Fragment}
            enter="transition-opacity duration-300 ease-out"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-200 ease-in"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-[2px]"
              aria-hidden="true"
            />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition duration-300 ease-in"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="fixed bottom-0 left-0 top-0 flex w-full max-w-[420px] flex-col rounded-none border-r border-black/[0.06] bg-[#faf9f7] shadow-[12px_0_48px_-12px_rgba(0,0,0,0.18)]">
              <div className="flex items-center justify-between gap-4 border-b border-black/[0.06] px-7 py-7 sm:px-8 sm:py-8">
                <p className="font-display text-xl font-medium tracking-[0.02em] text-[#0c0c0c]">
                  {BRAND_NAME}
                </p>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-none text-[#0c0c0c]/40 transition-colors hover:bg-black/[0.04] hover:text-[#0c0c0c]"
                >
                  <XMarkIcon className="h-5 w-5" strokeWidth={1.25} />
                </button>
              </div>

              {menu.length ? (
                <nav className="flex-1 overflow-y-auto overscroll-contain px-7 py-8 sm:px-8 sm:py-10">
                  <p className="mb-6 text-[10px] font-medium uppercase tracking-[0.35em] text-[#8a8580]">
                    Explore
                  </p>
                  <ul className="space-y-0">
                    {menu.map((item: Menu) => (
                      <li
                        key={item.title}
                        className="border-b border-black/[0.06]"
                      >
                        <Link
                          href={item.path}
                          prefetch={true}
                          onClick={() => setIsOpen(false)}
                          className="block py-5 font-display text-[1.35rem] font-normal tracking-tight text-[#0c0c0c] transition-colors hover:text-[#6b635a]"
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              ) : null}

              <div className="border-t border-black/[0.06] px-7 py-7 sm:px-8 sm:py-8">
                <Link
                  href="/search"
                  onClick={() => setIsOpen(false)}
                  className="block w-full rounded-none border border-[#0c0c0c] bg-[#0c0c0c] py-4 text-center text-[11px] font-medium uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#2a2a2a]"
                >
                  Shop collection
                </Link>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
