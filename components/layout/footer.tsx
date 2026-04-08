import Link from "next/link";

import { FooterNewsletter } from "components/layout/footer-newsletter";
import FooterMenu from "components/layout/footer-menu";
import { BRAND_NAME } from "lib/brand";
import { getMenu } from "lib/store";

const { COMPANY_NAME } = process.env;

const infoLinks = [
  { label: "Privacy policy", href: "/privacy-policy" },
  { label: "Terms of service", href: "/terms-of-service" },
  { label: "FAQs", href: "/faqs" },
  { label: "Payments", href: "/payments" },
  { label: "Shipping & returns", href: "/shipping-returns" },
] as const;

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : "");
  const menu = await getMenu("footer");
  const copyrightName = COMPANY_NAME || BRAND_NAME || "";

  return (
    <footer className="border-t border-[#dfdad3] bg-[#ece9e4]">
      <div className="mx-auto max-w-screen-2xl px-5 pb-10 pt-11 sm:px-8 lg:px-10 lg:pb-14 lg:pt-14">
        <div className="overflow-hidden rounded-none border border-[#d4cdc4] bg-[#f7f5f2] shadow-[0_1px_0_rgba(255,255,255,0.82)_inset,0_24px_56px_-30px_rgba(18,16,14,0.2)]">
          <div className="relative px-6 py-11 sm:px-9 sm:py-12 lg:px-10 lg:py-12 xl:px-12">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.5]"
              style={{
                backgroundImage:
                  "radial-gradient(ellipse 58% 48% at 88% 6%, rgba(195,175,150,0.16), transparent 54%), radial-gradient(ellipse 50% 42% at 6% 94%, rgba(255,255,255,0.92), transparent 60%)",
              }}
              aria-hidden
            />

            <div className="relative flex flex-col gap-10 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(1.5rem,2.75rem)_minmax(16.5rem,22.5rem)] lg:items-stretch lg:gap-0">
              {/* Left: brand, tagline, links */}
              <div className="min-w-0">
                <Link href="/" className="group inline-block no-underline">
                  <span className="font-display text-[0.95rem] font-medium tracking-[0.14em] uppercase text-[#0c0c0c] transition group-hover:text-[#3a3835]">
                    {BRAND_NAME}
                  </span>
                </Link>
                <p className="mt-3.5 max-w-[28rem] text-[13px] leading-[1.7] tracking-[0.01em] text-[#5f5a54]">
                  Premium eyewear crafted with precision. Clean lines, quality
                  materials, timeless design.
                </p>

                <div className="mt-10 flex flex-col gap-10 sm:mt-11 sm:flex-row sm:gap-16 md:gap-20">
                  <FooterMenu menu={menu} />

                  <nav className="shrink-0 sm:min-w-[11rem]" aria-label="Policies and help">
                    <h3 className="mb-3.5 text-[10px] font-medium uppercase tracking-[0.22em] text-[#a39d97]">
                      Information
                    </h3>
                    <ul className="flex flex-col gap-2.5">
                      {infoLinks.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className="no-underline text-[12.5px] text-[#5c5751] transition-colors hover:text-[#0c0c0c]"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </div>

              {/* Centered vertical rule between copy and newsletter (desktop) */}
              <div
                className="relative hidden h-auto min-h-[11rem] shrink-0 lg:flex lg:items-stretch lg:justify-center"
                aria-hidden
              >
                <span className="block w-px self-stretch bg-gradient-to-b from-transparent via-[#c9c2b8] to-transparent opacity-90" />
              </div>

              {/* Newsletter — mobile: rule above sits between main copy and this block */}
              <div className="flex justify-start border-t border-[#dcd6ce] pt-10 lg:border-t-0 lg:justify-end lg:pt-0">
                <FooterNewsletter brandName={BRAND_NAME} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#d8d2ca] bg-[#e3dfd8]/85">
        <div className="mx-auto max-w-screen-2xl px-5 py-5 sm:px-8 lg:px-10">
          <p className="text-center text-[10px] leading-relaxed tracking-[0.04em] text-[#8f8983] sm:text-left">
            &copy; {copyrightDate} {copyrightName}
            {copyrightName.length && !copyrightName.endsWith(".") ? "." : ""}{" "}
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
