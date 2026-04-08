"use client";

import { submitOrder } from "lib/checkout/actions";
import { CHECKOUT_COUNTRIES } from "lib/checkout/countries";
import type { CheckoutActionState } from "lib/checkout/types";
import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";

const initial: CheckoutActionState = {};

const label =
  "block text-[11px] font-medium uppercase tracking-[0.2em] text-[#8a8580]";
const input =
  "mt-2 w-full border border-black/[0.12] bg-white px-4 py-3 text-sm text-[#0c0c0c] outline-none transition-shadow placeholder:text-[#b3b3b3] focus:border-[#0c0c0c] focus:ring-1 focus:ring-[#0c0c0c]";
const errText = "mt-1 text-xs text-red-600";

function SubmitButton({
  stripeEnabled,
  leaving,
}: {
  stripeEnabled: boolean;
  leaving: boolean;
}) {
  const { pending } = useFormStatus();
  const busy = pending || leaving;
  return (
    <button
      type="submit"
      disabled={busy}
      className="w-full border border-[#0c0c0c] bg-[#0c0c0c] py-4 text-[11px] font-medium uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#2a2a2a] disabled:opacity-60"
    >
      {busy
        ? stripeEnabled
          ? "Opening secure payment…"
          : "Placing order…"
        : stripeEnabled
          ? "Continue to payment"
          : "Place order"}
    </button>
  );
}

export default function CheckoutForm({
  stripeEnabled = false,
}: {
  stripeEnabled?: boolean;
}) {
  const [state, formAction] = useActionState(submitOrder, initial);
  const e = state.fieldErrors ?? {};
  const leaving = Boolean(state.redirectUrl);

  useEffect(() => {
    const url = state.redirectUrl;
    if (!url) return;
    window.location.assign(url);
  }, [state.redirectUrl]);

  return (
    <form action={formAction} className="space-y-10">
      {state.message ? (
        <div
          role="alert"
          className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {state.message}
        </div>
      ) : null}

      <fieldset className="space-y-5">
        <legend className="sr-only">Contact</legend>
        <div>
          <label htmlFor="email" className={label}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={input}
            aria-invalid={e.email ? true : undefined}
          />
          {e.email ? <p className={errText}>{e.email}</p> : null}
        </div>
        <div>
          <label htmlFor="phone" className={label}>
            Phone <span className="font-normal normal-case">(optional)</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="For delivery questions"
            className={input}
          />
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="sr-only">Shipping address</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className={label}>
              First name
            </label>
            <input
              id="firstName"
              name="firstName"
              autoComplete="given-name"
              required
              className={input}
              aria-invalid={e.firstName ? true : undefined}
            />
            {e.firstName ? <p className={errText}>{e.firstName}</p> : null}
          </div>
          <div>
            <label htmlFor="lastName" className={label}>
              Last name
            </label>
            <input
              id="lastName"
              name="lastName"
              autoComplete="family-name"
              required
              className={input}
              aria-invalid={e.lastName ? true : undefined}
            />
            {e.lastName ? <p className={errText}>{e.lastName}</p> : null}
          </div>
        </div>
        <div>
          <label htmlFor="company" className={label}>
            Company{" "}
            <span className="font-normal normal-case">(optional)</span>
          </label>
          <input
            id="company"
            name="company"
            autoComplete="organization"
            className={input}
          />
        </div>
        <div>
          <label htmlFor="address1" className={label}>
            Street address
          </label>
          <input
            id="address1"
            name="address1"
            autoComplete="address-line1"
            required
            placeholder="Street, building, suite"
            className={input}
            aria-invalid={e.address1 ? true : undefined}
          />
          {e.address1 ? <p className={errText}>{e.address1}</p> : null}
        </div>
        <div>
          <label htmlFor="address2" className={label}>
            Apt, floor, buzzer{" "}
            <span className="font-normal normal-case">(optional)</span>
          </label>
          <input
            id="address2"
            name="address2"
            autoComplete="address-line2"
            className={input}
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="city" className={label}>
              City
            </label>
            <input
              id="city"
              name="city"
              autoComplete="address-level2"
              required
              className={input}
              aria-invalid={e.city ? true : undefined}
            />
            {e.city ? <p className={errText}>{e.city}</p> : null}
          </div>
          <div>
            <label htmlFor="state" className={label}>
              State / region
            </label>
            <input
              id="state"
              name="state"
              autoComplete="address-level1"
              required
              className={input}
              aria-invalid={e.state ? true : undefined}
            />
            {e.state ? <p className={errText}>{e.state}</p> : null}
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="postalCode" className={label}>
              Postal code
            </label>
            <input
              id="postalCode"
              name="postalCode"
              autoComplete="postal-code"
              required
              className={input}
              aria-invalid={e.postalCode ? true : undefined}
            />
            {e.postalCode ? <p className={errText}>{e.postalCode}</p> : null}
          </div>
          <div>
            <label htmlFor="country" className={label}>
              Country
            </label>
            <select
              id="country"
              name="country"
              autoComplete="country"
              required
              className={`${input} appearance-none bg-[length:12px] bg-[right_1rem_center] bg-no-repeat`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23737373'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m19 9-7 7-7-7'/%3E%3C/svg%3E")`,
              }}
              defaultValue="US"
              aria-invalid={e.country ? true : undefined}
            >
              {CHECKOUT_COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
            {e.country ? <p className={errText}>{e.country}</p> : null}
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="sr-only">Notes</legend>
        <div>
          <label htmlFor="notes" className={label}>
            Delivery notes{" "}
            <span className="font-normal normal-case">(optional)</span>
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={2}
            placeholder="Gate code, safe place…"
            className={`${input} resize-y min-h-[4.5rem]`}
          />
        </div>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-[#737373]">
          <input
            type="checkbox"
            name="marketing"
            value="yes"
            className="mt-1 h-4 w-4 shrink-0 border-black/[0.2] text-[#0c0c0c] focus:ring-[#0c0c0c]"
          />
          <span>Email me about new arrivals. Unsubscribe anytime.</span>
        </label>
      </fieldset>

      <div className="border-t border-black/[0.08] pt-6">
        <SubmitButton stripeEnabled={stripeEnabled} leaving={leaving} />
      </div>
    </form>
  );
}
