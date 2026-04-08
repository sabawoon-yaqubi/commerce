"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function NavbarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const solid = !isHome || scrolled;

  return (
    <header
      className="fixed top-0 z-50 w-full transition-all duration-500 ease-out"
      data-scrolled={solid ? "" : undefined}
      data-inner={!isHome ? "" : undefined}
      style={{
        backgroundColor: solid ? "rgba(255,255,255,0.94)" : "transparent",
        backdropFilter: solid ? "blur(24px)" : "none",
        WebkitBackdropFilter: solid ? "blur(24px)" : "none",
        borderBottom: solid ? "1px solid rgba(0,0,0,0.06)" : "none",
      }}
    >
      <style>{`
        header[data-scrolled] nav {
          --nav-color: #0c0c0c;
          --nav-muted: rgba(12,12,12,0.55);
          --nav-badge-fg: #fff;
          --nav-badge-bg: #0c0c0c;
        }
        header:not([data-scrolled]) nav {
          --nav-color: #ffffff;
          --nav-muted: rgba(255,255,255,0.72);
          --nav-badge-fg: #0c0c0c;
          --nav-badge-bg: #ffffff;
        }
      `}</style>
      {children}
    </header>
  );
}
