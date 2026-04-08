import CartModal from "components/cart/modal";
import { BRAND_NAME } from "lib/brand";
import { getMenu } from "lib/store";
import Link from "next/link";
import { Suspense } from "react";
import SideMenu from "./side-menu";
import NavbarWrapper from "./navbar-wrapper";
import Search, { SearchSkeleton } from "./search";

export async function Navbar() {
  const menu = await getMenu("next-js-frontend-header-menu");

  return (
    <NavbarWrapper>
      <nav className="mx-auto flex h-[56px] max-w-screen-2xl items-center justify-between px-5 lg:h-[60px] lg:px-10">
        <div className="flex min-w-0 flex-1 items-center justify-start">
          <Suspense fallback={null}>
            <SideMenu menu={menu} />
          </Suspense>
        </div>

        <div className="flex shrink-0 justify-center px-4">
          <Link href="/" prefetch={true} className="text-center">
            <span
              className="font-display text-[clamp(1.05rem,2.5vw,1.35rem)] font-medium tracking-[0.18em] uppercase transition-colors duration-300"
              style={{ color: "var(--nav-color)" }}
            >
              {BRAND_NAME}
            </span>
          </Link>
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-2 pl-2">
          <Suspense fallback={<SearchSkeleton />}>
            <Search />
          </Suspense>
          <CartModal />
        </div>
      </nav>
    </NavbarWrapper>
  );
}
