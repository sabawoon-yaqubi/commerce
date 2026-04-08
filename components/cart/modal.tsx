"use client";

import clsx from "clsx";
import { Dialog, Transition } from "@headlessui/react";
import { ShoppingBagIcon, XMarkIcon } from "@heroicons/react/24/outline";
import LoadingDots from "components/loading-dots";
import Price from "components/price";
import { DEFAULT_OPTION } from "lib/constants";
import { createUrl } from "lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { createCartAndSetCookie, redirectToCheckout } from "./actions";
import { useCart } from "./cart-context";
import { DeleteItemButton } from "./delete-item-button";
import { EditItemQuantityButton } from "./edit-item-quantity-button";
import OpenCart from "./open-cart";

type MerchandiseSearchParams = {
  [key: string]: string;
};

export default function CartModal() {
  const { cart, updateCartItem } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const quantityRef = useRef(cart?.totalQuantity);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  useEffect(() => {
    if (!cart) {
      createCartAndSetCookie();
    }
  }, [cart]);

  useEffect(() => {
    if (
      cart?.totalQuantity &&
      cart?.totalQuantity !== quantityRef.current &&
      cart?.totalQuantity > 0
    ) {
      if (!isOpen) {
        setIsOpen(true);
      }
      quantityRef.current = cart?.totalQuantity;
    }
  }, [isOpen, cart?.totalQuantity, quantityRef]);

  return (
    <>
      <button aria-label="Open shopping bag" onClick={openCart}>
        <OpenCart quantity={cart?.totalQuantity} />
      </button>
      <Transition show={isOpen}>
        <Dialog onClose={closeCart} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/20" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="fixed bottom-0 right-0 top-0 flex h-full w-full flex-col bg-white p-6 shadow-2xl md:w-[420px]">
              <div className="flex items-center justify-between pb-5">
                <h2 className="text-lg font-semibold text-[#0a0a0a]">
                  Your bag
                </h2>
                <button
                  aria-label="Close cart"
                  onClick={closeCart}
                  className="flex h-8 w-8 items-center justify-center rounded-none text-[#a3a3a3] transition-colors hover:text-[#0a0a0a]"
                >
                  <XMarkIcon className="h-5 w-5" strokeWidth={1.5} />
                </button>
              </div>

              {!cart || cart.lines.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center">
                  <ShoppingBagIcon
                    className="h-12 w-12 text-[#e5e5e5]"
                    strokeWidth={1}
                  />
                  <p className="mt-5 text-[16px] font-semibold text-[#0a0a0a]">
                    Your bag is empty
                  </p>
                  <p className="mt-1.5 text-[13px] text-[#737373]">
                    Browse the collection to find your frame.
                  </p>
                </div>
              ) : (
                <div className="flex h-full flex-col justify-between overflow-hidden border-t border-[#f0f0f0] pt-4">
                  <ul className="grow overflow-auto">
                    {cart.lines
                      .sort((a, b) =>
                        a.merchandise.product.title.localeCompare(
                          b.merchandise.product.title,
                        ),
                      )
                      .map((item, i) => {
                        const merchandiseSearchParams =
                          {} as MerchandiseSearchParams;

                        item.merchandise.selectedOptions.forEach(
                          ({ name, value }) => {
                            if (value !== DEFAULT_OPTION) {
                              merchandiseSearchParams[name.toLowerCase()] =
                                value;
                            }
                          },
                        );

                        const merchandiseUrl = createUrl(
                          `/product/${item.merchandise.product.handle}`,
                          new URLSearchParams(merchandiseSearchParams),
                        );

                        return (
                          <li
                            key={i}
                            className="border-b border-[#f0f0f0] py-4"
                          >
                            <div className="flex gap-4">
                              <div className="h-[72px] w-[72px] shrink-0 overflow-hidden rounded-none bg-[#fafafa]">
                                <Image
                                  className="h-full w-full object-cover"
                                  width={72}
                                  height={72}
                                  alt={
                                    item.merchandise.product.featuredImage
                                      .altText ||
                                    item.merchandise.product.title
                                  }
                                  src={
                                    item.merchandise.product.featuredImage.url
                                  }
                                />
                              </div>
                              <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                                <div className="flex gap-2">
                                  <div className="min-w-0 flex-1 pr-1">
                                    <Link
                                      href={merchandiseUrl}
                                      onClick={closeCart}
                                      className="text-sm font-medium text-[#0a0a0a]"
                                    >
                                      {item.merchandise.product.title}
                                    </Link>
                                    {item.merchandise.title !== DEFAULT_OPTION ? (
                                      <p className="mt-0.5 text-xs text-[#a3a3a3]">
                                        {item.merchandise.title}
                                      </p>
                                    ) : null}
                                  </div>
                                  <div className="shrink-0 self-start pt-0.5">
                                    <DeleteItemButton
                                      item={item}
                                      optimisticUpdate={updateCartItem}
                                    />
                                  </div>
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                  <div className="flex h-8 shrink-0 items-center rounded-none bg-[#f5f5f5]">
                                    <EditItemQuantityButton
                                      item={item}
                                      type="minus"
                                      optimisticUpdate={updateCartItem}
                                    />
                                    <p className="w-8 text-center text-xs font-medium tabular-nums text-[#0a0a0a]">
                                      {item.quantity}
                                    </p>
                                    <EditItemQuantityButton
                                      item={item}
                                      type="plus"
                                      optimisticUpdate={updateCartItem}
                                    />
                                  </div>
                                  <Price
                                    className="shrink-0 text-sm font-medium text-[#0a0a0a]"
                                    amount={item.cost.totalAmount.amount}
                                    currencyCode={
                                      item.cost.totalAmount.currencyCode
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                  </ul>
                  <div className="space-y-3 border-t border-[#f0f0f0] pt-5">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#737373]">Tax</span>
                      <Price
                        className="text-[#0a0a0a]"
                        amount={cart.cost.totalTaxAmount.amount}
                        currencyCode={cart.cost.totalTaxAmount.currencyCode}
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#737373]">Shipping</span>
                      <span className="font-medium text-[#0a0a0a]">
                        Free
                      </span>
                    </div>
                    <div className="h-px bg-[#f0f0f0]" />
                    <div className="flex justify-between pt-1">
                      <span className="text-sm font-semibold text-[#0a0a0a]">
                        Total
                      </span>
                      <Price
                        className="text-lg font-semibold text-[#0a0a0a]"
                        amount={cart.cost.totalAmount.amount}
                        currencyCode={cart.cost.totalAmount.currencyCode}
                      />
                    </div>
                    <form action={redirectToCheckout} className="pt-3">
                      <CheckoutButton />
                    </form>
                  </div>
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}

function CheckoutButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="w-full rounded-none bg-[#0a0a0a] py-4 text-[14px] font-medium text-white transition-colors hover:bg-[#0a0a0a]/80 disabled:opacity-50"
      type="submit"
      disabled={pending}
    >
      {pending ? <LoadingDots className="bg-white" /> : "Checkout"}
    </button>
  );
}
