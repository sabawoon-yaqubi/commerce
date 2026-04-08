import { GeistSans } from "geist/font/sans";
import type { ReactNode } from "react";
import "./globals.css";
import { BRAND_NAME } from "lib/brand";
import { baseUrl } from "lib/utils";

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: BRAND_NAME,
    template: `%s | ${BRAND_NAME}`,
  },
  robots: {
    follow: true,
    index: true,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body className={`${GeistSans.className} text-[15px]`}>{children}</body>
    </html>
  );
}
