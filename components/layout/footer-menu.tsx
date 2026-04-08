"use client";

import clsx from "clsx";
import { Menu } from "lib/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function FooterMenuItem({ item }: { item: Menu }) {
  const pathname = usePathname();
  const [active, setActive] = useState(pathname === item.path);

  useEffect(() => {
    setActive(pathname === item.path);
  }, [pathname, item.path]);

  return (
    <li>
      <Link
        href={item.path}
        className={clsx(
          "no-underline text-[12px] transition-colors duration-200 hover:text-[#0a0a0a]",
          active ? "text-[#0a0a0a]" : "text-[#8c8c8c]",
        )}
      >
        {item.title}
      </Link>
    </li>
  );
}

export default function FooterMenu({ menu }: { menu: Menu[] }) {
  if (!menu.length) return null;

  return (
    <nav>
      <h3 className="mb-3 text-[10px] font-medium uppercase tracking-[0.2em] text-[#a8a29e]">
        Explore
      </h3>
      <ul className="flex flex-col gap-2">
        {menu.map((item: Menu) => {
          return <FooterMenuItem key={item.title} item={item} />;
        })}
      </ul>
    </nav>
  );
}
