import Image from "next/image";
import Link from "next/link";

/**
 * Three distinct image types (luxury editorial pattern: mood, craft, still life).
 */
const SHOTS = [
  {
    alt: "Sunlight through glass — atmosphere",
    src: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=900&h=1200&fit=crop&auto=format&q=86",
  },
  {
    alt: "Sunglasses frame and lens — detail",
    src: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=900&h=675&fit=crop&auto=format&q=86",
  },
  {
    alt: "Eyewear still life on surface",
    src: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=900&h=675&fit=crop&auto=format&q=86",
  },
] as const;

export function EditorialFeature() {
  const [atmosphere, craft, silhouette] = SHOTS;

  return (
    <section className="border-y border-[#e5e1da] bg-[#eeebe5]">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 md:py-20 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-stretch md:gap-5">
          {/* Tall mood image */}
          <figure className="w-full shrink-0 md:w-[52%] lg:w-[50%]">
            <div className="relative aspect-[3/4] overflow-hidden rounded-none bg-[#ddd9d2] ring-1 ring-[#0c0c0c]/[0.06]">
              <Image
                src={atmosphere.src}
                alt={atmosphere.alt}
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
                className="object-cover object-center"
              />
            </div>
          </figure>

          {/* Two stacked images — height matches tall column via stretch + flex-1 */}
          <div className="flex min-h-0 flex-1 flex-col gap-4">
            <figure className="flex min-h-0 flex-1 flex-col">
              <div className="relative min-h-[220px] flex-1 overflow-hidden rounded-none bg-[#ddd9d2] ring-1 ring-[#0c0c0c]/[0.06] md:min-h-0">
                <Image
                  src={craft.src}
                  alt={craft.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 38vw"
                  className="object-cover object-center"
                />
              </div>
            </figure>
            <figure className="flex min-h-0 flex-1 flex-col">
              <div className="relative min-h-[220px] flex-1 overflow-hidden rounded-none bg-[#ddd9d2] ring-1 ring-[#0c0c0c]/[0.06] md:min-h-0">
                <Image
                  src={silhouette.src}
                  alt={silhouette.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 38vw"
                  className="object-cover object-center"
                />
              </div>
            </figure>
          </div>
        </div>

        <div className="mt-12 flex justify-center md:mt-14">
          <Link
            href="/search"
            className="inline-flex items-center gap-3 rounded-none border border-[#0c0c0c]/15 bg-white/70 px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0c0c0c] no-underline shadow-sm backdrop-blur-sm transition hover:border-[#0c0c0c]/25 hover:bg-white"
          >
            Shop
            <span
              className="text-[13px] font-light leading-none opacity-70"
              aria-hidden
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
