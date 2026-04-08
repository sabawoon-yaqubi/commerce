import type { ReactNode } from "react";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-[#f4f2ef] text-[#0c0c0c] antialiased">{children}</div>;
}
