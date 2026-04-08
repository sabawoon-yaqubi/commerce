import {
  CheckoutSuccessEmpty,
  CheckoutSuccessWithOrder,
} from "components/checkout/checkout-success-view";
import { ORDER_CONFIRMATION_COOKIE } from "lib/checkout/constants";
import type { OrderConfirmation } from "lib/checkout/types";
import { cookies } from "next/headers";

export const metadata = {
  title: "Thank you",
  description: "Your order is confirmed.",
};

function parseOrder(raw: string | undefined): OrderConfirmation | null {
  if (!raw) return null;
  try {
    const o = JSON.parse(raw) as Partial<OrderConfirmation>;
    if (
      typeof o.orderId === "string" &&
      typeof o.email === "string" &&
      typeof o.firstName === "string" &&
      typeof o.lastName === "string" &&
      typeof o.address1 === "string" &&
      typeof o.city === "string" &&
      typeof o.state === "string" &&
      typeof o.postalCode === "string" &&
      typeof o.country === "string" &&
      typeof o.totalAmount === "string" &&
      typeof o.currencyCode === "string" &&
      (typeof o.itemCount === "number" || o.itemCount === undefined)
    ) {
      const itemCount = typeof o.itemCount === "number" ? o.itemCount : 0;
      return { ...o, itemCount } as OrderConfirmation;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export default async function CheckoutSuccessPage() {
  const jar = await cookies();
  const order = parseOrder(jar.get(ORDER_CONFIRMATION_COOKIE)?.value);

  return order ? (
    <CheckoutSuccessWithOrder order={order} />
  ) : (
    <CheckoutSuccessEmpty />
  );
}
