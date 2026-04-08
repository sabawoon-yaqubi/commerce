import Image from "next/image";
import Link from "next/link";

export function LuxuryHero() {
  return (
    <section className="relative flex min-h-[max(600px,100svh)] w-full flex-col justify-end overflow-hidden bg-[#1a1816]">
      <Image
        src="/main.jpeg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="hero-ken-burns object-cover"
      />

      {/* Cinematic grade + grain */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
      <div
        className="hero-grain pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay"
        aria-hidden
      />

      {/* Editorial copy — bottom left (Bulgari-style) */}
      <div
        className="relative z-10 w-full px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] pt-20 sm:px-12 sm:pb-20 sm:pt-24 lg:px-16 lg:pb-24"
      >
        <div className="max-w-xl hero-fade-up">
          <h1 className="font-display text-[clamp(1.85rem,7.5vw,3.75rem)] font-normal leading-[1.06] tracking-tight text-white sm:leading-[1.08]">
            Radiant clarity
          </h1>
          <div className="mt-7 flex flex-wrap items-center gap-6 sm:mt-8 sm:gap-8">
            <Link
              href="/search"
              className="group inline-flex min-h-[44px] items-center border-b border-white/50 pb-1 text-[10px] font-medium uppercase tracking-[0.26em] text-white transition-colors hover:border-white sm:min-h-0 sm:text-[11px] sm:tracking-[0.28em]"
            >
              Shop
              <span
                className="ml-2 inline-block transition-transform group-hover:translate-x-0.5"
                aria-hidden
              >
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
