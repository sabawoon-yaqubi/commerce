"use client";

import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { subscribeToNewsletter } from "lib/newsletter/client";
import {
  NEWSLETTER_FORM_ACTION,
  SITE_PROMPT_KEYS,
  type CookieConsentValue,
} from "lib/site-prompts";
import { BRAND_NAME } from "lib/brand";
import {
  FormEvent,
  Fragment,
  useCallback,
  useEffect,
  useState,
} from "react";

function CookieIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle
        cx="12"
        cy="12"
        r="8.25"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="9" cy="11" r="1.1" fill="currentColor" />
      <circle cx="14.5" cy="12.5" r="1" fill="currentColor" />
      <circle cx="11" cy="15" r="0.9" fill="currentColor" />
      <circle cx="15" cy="9.5" r="0.85" fill="currentColor" />
    </svg>
  );
}

function migrateLegacyWelcomeKeys() {
  try {
    if (
      localStorage.getItem(SITE_PROMPT_KEYS.legacyDiscountSeen) === "1" &&
      !localStorage.getItem(SITE_PROMPT_KEYS.welcomeSeen)
    ) {
      localStorage.setItem(SITE_PROMPT_KEYS.welcomeSeen, "1");
    }
    localStorage.removeItem(SITE_PROMPT_KEYS.legacyDiscountSeen);
  } catch {
    /* ignore */
  }
}

function markWelcomeSeen() {
  try {
    localStorage.setItem(SITE_PROMPT_KEYS.welcomeSeen, "1");
  } catch {
    /* ignore */
  }
}

export function FirstVisitPrompts() {
  const [hydrated, setHydrated] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showCookie, setShowCookie] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [newsletterError, setNewsletterError] = useState<string | null>(null);
  const [newsletterPending, setNewsletterPending] = useState(false);

  useEffect(() => {
    setHydrated(true);
    try {
      migrateLegacyWelcomeKeys();
      const welcomeSeen = localStorage.getItem(SITE_PROMPT_KEYS.welcomeSeen);
      const cookieConsent = localStorage.getItem(SITE_PROMPT_KEYS.cookieConsent);
      if (!welcomeSeen) {
        setShowWelcome(true);
      } else if (!cookieConsent) {
        setShowCookie(true);
      }
    } catch {
      setShowCookie(true);
    }
  }, []);

  const openCookieIfNeeded = useCallback(() => {
    try {
      if (!localStorage.getItem(SITE_PROMPT_KEYS.cookieConsent)) {
        setShowCookie(true);
      }
    } catch {
      setShowCookie(true);
    }
  }, []);

  const dismissWelcome = useCallback(() => {
    markWelcomeSeen();
    setShowWelcome(false);
    openCookieIfNeeded();
  }, [openCookieIfNeeded]);

  const setCookieConsent = useCallback((value: CookieConsentValue) => {
    try {
      localStorage.setItem(SITE_PROMPT_KEYS.cookieConsent, value);
    } catch {
      /* ignore */
    }
    setShowCookie(false);
  }, []);

  const handleNewsletterSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setNewsletterError(null);
      const trimmed = email.trim();
      if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        return;
      }
      setNewsletterPending(true);
      const primary = await subscribeToNewsletter(trimmed, "welcome");
      setNewsletterPending(false);

      if (!primary.ok) {
        setNewsletterError(primary.message);
        return;
      }

      if (NEWSLETTER_FORM_ACTION) {
        try {
          const body = new FormData();
          body.append("email", trimmed);
          await fetch(NEWSLETTER_FORM_ACTION, {
            method: "POST",
            body,
          });
        } catch {
          /* external ESP optional */
        }
      }
      markWelcomeSeen();
      setSubmitted(true);
      window.setTimeout(() => {
        setShowWelcome(false);
        openCookieIfNeeded();
      }, 1600);
    },
    [email, openCookieIfNeeded],
  );

  if (!hydrated) {
    return null;
  }

  return (
    <>
      <Transition show={showWelcome}>
        <Dialog onClose={dismissWelcome} className="relative z-[100]">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-[0.98]"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-[0.98]"
          >
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="relative w-full max-w-[400px] border border-black bg-white p-8 shadow-none">
                <button
                  type="button"
                  aria-label="Close"
                  onClick={dismissWelcome}
                  className="absolute right-4 top-4 text-black/40 transition-colors hover:text-black"
                >
                  <XMarkIcon className="h-5 w-5" strokeWidth={1.5} />
                </button>

                {submitted ? (
                  <p className="pr-8 text-[15px] leading-relaxed text-black">
                    You&apos;re on the list. Thank you.
                  </p>
                ) : (
                  <>
                    <h2 className="font-display pr-8 text-2xl font-normal text-black">
                      Welcome to {BRAND_NAME}
                    </h2>
                    <p className="mt-4 text-[14px] leading-relaxed text-black/70">
                      Join the newsletter. We&apos;ll send you{" "}
                      <span className="text-black">10% off your first order</span>{" "}
                      — valid once when you subscribe.
                    </p>
                    <form onSubmit={handleNewsletterSubmit} className="mt-8 space-y-4">
                      <label className="sr-only" htmlFor="welcome-newsletter-email">
                        Email
                      </label>
                      <input
                        id="welcome-newsletter-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={newsletterPending}
                        className="w-full border-b border-black bg-transparent py-2 text-[14px] text-black outline-none placeholder:text-black/35 focus:border-black disabled:opacity-60"
                      />
                      {newsletterError ? (
                        <p className="text-[13px] text-red-800" role="alert">
                          {newsletterError}
                        </p>
                      ) : null}
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <button
                          type="submit"
                          disabled={newsletterPending}
                          className="w-full border border-black bg-black py-2.5 text-[11px] font-medium uppercase tracking-[0.2em] text-white transition-colors hover:bg-white hover:text-black sm:w-auto sm:px-8 disabled:opacity-60"
                        >
                          {newsletterPending ? "…" : "Subscribe"}
                        </button>
                        <button
                          type="button"
                          onClick={dismissWelcome}
                          className="text-[13px] text-black/50 underline decoration-black/20 underline-offset-4 transition-colors hover:text-black"
                        >
                          No thanks
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>

      <Transition show={showCookie}>
        <Transition.Child
          as="div"
          enter="ease-out duration-200"
          enterFrom="translate-y-full opacity-0"
          enterTo="translate-y-0 opacity-100"
          leave="ease-in duration-150"
          leaveFrom="translate-y-0 opacity-100"
          leaveTo="translate-y-full opacity-0"
          className="fixed inset-x-0 bottom-0 z-[90] border-t border-black bg-white"
          role="dialog"
          aria-label="Cookie preferences"
        >
          <div className="mx-auto flex max-w-5xl flex-col gap-2 px-3 py-2 sm:px-5 sm:py-2 md:flex-row md:items-center md:gap-4">
            <div className="flex min-w-0 items-start gap-3 md:items-center">
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center text-black md:h-9 md:w-9"
                aria-hidden
              >
                <CookieIcon className="h-7 w-7 md:h-8 md:w-8" />
              </div>
              <p className="min-w-0 flex-1 text-[12px] leading-snug text-black/65 md:text-[13px] md:leading-relaxed">
                We use cookies to run the site and understand usage. By
                continuing, you agree to our use of cookies.
              </p>
            </div>
            <div className="flex shrink-0 flex-row items-center justify-end gap-2 pl-11 md:justify-start md:pl-0">
              <button
                type="button"
                onClick={() => setCookieConsent("essential")}
                className="border border-black px-3 py-1.5 text-[11px] font-medium text-black transition-colors hover:bg-black hover:text-white md:px-4 md:text-sm"
              >
                Essential
              </button>
              <button
                type="button"
                onClick={() => setCookieConsent("accepted")}
                className="border border-black bg-black px-3 py-1.5 text-[11px] font-medium text-white transition-colors hover:bg-white hover:text-black md:px-4 md:text-sm"
              >
                Accept all
              </button>
            </div>
          </div>
        </Transition.Child>
      </Transition>
    </>
  );
}
