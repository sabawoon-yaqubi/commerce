"use client";

import { subscribeToNewsletter } from "lib/newsletter/client";
import { FormEvent, useState } from "react";

type Props = {
  brandName: string;
};

export function FooterNewsletter({ brandName }: Props) {
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const email = fd.get("email");
    if (typeof email !== "string") return;

    setPending(true);
    const result = await subscribeToNewsletter(email, "footer");
    setPending(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }
    setSent(true);
    form.reset();
  }

  return (
    <aside
      className="w-full max-w-[22.5rem] rounded-none border border-[#e5e0d8] bg-gradient-to-br from-white/90 to-[#faf8f5]/95 p-[1.35rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_8px_24px_-12px_rgba(20,18,15,0.12)] sm:p-6"
      aria-labelledby="footer-newsletter-heading"
    >
      <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#a39d97]">
        Newsletter
      </p>
      <h2
        id="footer-newsletter-heading"
        className="font-display mt-2.5 text-[1.22rem] font-normal leading-snug tracking-tight text-[#0c0c0c] sm:text-[1.32rem]"
      >
        The private list
      </h2>
      <p className="mt-2.5 text-[13px] leading-relaxed text-[#656059]">
        Early news from {brandName}. Unsubscribe anytime.
      </p>

      {sent ? (
        <p
          className="mt-6 rounded-none border border-[#0c0c0c]/8 bg-[#f3f1ed] px-3.5 py-3.5 text-center text-[13px] text-[#3d3a36]"
          role="status"
        >
          You&apos;re on the list.
        </p>
      ) : (
        <form className="mt-6" onSubmit={onSubmit}>
          <label
            className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#9a948d]"
            htmlFor="footer-newsletter-email"
          >
            Email
          </label>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-2">
            <input
              id="footer-newsletter-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="name@email.com"
              className="min-h-[44px] flex-1 rounded-none border border-[#ddd8d1] bg-white px-3.5 text-[14px] text-[#0c0c0c] outline-none transition placeholder:text-[#ada59c] focus:border-[#0c0c0c]/30 focus:ring-2 focus:ring-[#0c0c0c]/6"
            />
            <button
              type="submit"
              disabled={pending}
              className="min-h-[44px] shrink-0 rounded-none bg-[#0c0c0c] px-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#252321] active:scale-[0.99] disabled:opacity-60"
            >
              {pending ? "…" : "Join"}
            </button>
          </div>
          {error ? (
            <p
              className="mt-3 text-[12px] text-red-800/90"
              role="alert"
            >
              {error}
            </p>
          ) : null}
          <p className="mt-3.5 text-left text-[10px] leading-relaxed text-[#9c968e]">
            Marketing from {brandName}.{" "}
            <a
              href="/privacy-policy"
              className="text-[#7a746c] underline-offset-[3px] transition hover:text-[#0c0c0c] hover:underline"
            >
              Privacy
            </a>
            .
          </p>
        </form>
      )}
    </aside>
  );
}
