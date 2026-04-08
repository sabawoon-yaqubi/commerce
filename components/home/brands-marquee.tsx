"use client";

import { MARQUEE_STRIP_ITEMS } from "lib/brands";

/** Matches section fill — edge fades must use the same hex */
const BG = "#f5f4f1";

/** One long row — duplicated for seamless -50% loop */
function MarqueeSegment({ idPrefix }: { idPrefix: string }) {
  return (
    <ul
      className="flex items-center list-none m-0 p-0"
      role="list"
    >
      {MARQUEE_STRIP_ITEMS.map((name, i) => (
        <li
          key={`${idPrefix}-${i}`}
          className="flex shrink-0 items-center"
        >
          <span className="whitespace-nowrap font-sans text-[11px] font-medium uppercase leading-none tracking-[0.14em] text-[#3a3836] antialiased sm:text-[12px] sm:tracking-[0.16em]">
            {name}
          </span>
          <span
            className="select-none px-3 font-sans text-[10px] font-light leading-none text-[#a8a29e] sm:px-3.5 sm:text-[11px]"
            aria-hidden
          >
            ·
          </span>
        </li>
      ))}
    </ul>
  );
}

export function BrandsMarquee() {
  return (
    <section
      className="relative border-y border-black/[0.05] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.85)]"
      style={{ backgroundColor: BG }}
      aria-label="Brands we carry"
    >
      {/* Premium sites: calm band, content optically centered */}
      <div className="relative flex items-center overflow-hidden py-5 md:py-6">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-14 sm:w-20 md:w-28"
          aria-hidden
          style={{
            background: `linear-gradient(90deg, ${BG} 0%, ${BG} 20%, transparent 100%)`,
          }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-14 sm:w-20 md:w-28"
          aria-hidden
          style={{
            background: `linear-gradient(270deg, ${BG} 0%, ${BG} 20%, transparent 100%)`,
          }}
        />

        <div className="brands-marquee-track flex w-max flex-nowrap items-center will-change-transform">
          <div className="flex shrink-0 items-center">
            <MarqueeSegment idPrefix="a" />
          </div>
          <div
            className="brands-marquee-segment--clone flex shrink-0 items-center"
            aria-hidden="true"
          >
            <MarqueeSegment idPrefix="b" />
          </div>
        </div>
      </div>
    </section>
  );
}
