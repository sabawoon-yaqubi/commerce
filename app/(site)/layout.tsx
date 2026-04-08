import { CartProvider } from "components/cart/cart-context";
import { FirstVisitPrompts } from "components/first-visit-prompts";
import { Navbar } from "components/layout/navbar";
import { WelcomeToast } from "components/welcome-toast";
import { getCart } from "lib/store";
import type { ReactNode } from "react";
import { Toaster } from "sonner";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const cart = getCart();

  return (
    <CartProvider cartPromise={cart}>
      <Navbar />
      <main>{children}</main>
      <Toaster
        closeButton
        position="top-center"
        toastOptions={{
          classNames: {
            toast:
              "!border-black/[0.08] !bg-white !text-[#0c0c0c] !shadow-xl !rounded-none",
            title: "!font-medium",
            description: "!text-[#737373]",
          },
        }}
      />
      <WelcomeToast />
      <FirstVisitPrompts />
    </CartProvider>
  );
}
