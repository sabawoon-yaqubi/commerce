"use client";

import { createClient } from "lib/supabase/client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const inputClass =
  "mt-2 w-full border border-[#e0ddd8] bg-white px-4 py-3 text-[15px] text-[#0c0c0c] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] outline-none transition-[border,box-shadow] placeholder:text-[#b0aba5] focus:border-[#0c0c0c] focus:shadow-[inset_0_0_0_1px_#0c0c0c]";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin";
  const configError = searchParams.get("error") === "config";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const supabase = createClient();
      const { error: signError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signError) {
        setError(signError.message);
        setPending(false);
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      setError("Could not sign in.");
      setPending(false);
    }
  }

  if (configError || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return (
      <div className="rounded-none border border-[#ece8e3] bg-white p-8 shadow-[0_1px_0_rgba(0,0,0,0.04),0_24px_48px_-12px_rgba(0,0,0,0.08)]">
        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#8a8580]">
          Configuration
        </p>
        <h1 className="mt-3 font-display text-2xl font-normal tracking-tight text-[#0c0c0c]">
          Connect Supabase
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-[#5c5850]">
          Add <code className="rounded-none bg-[#f0ede8] px-1.5 py-0.5 text-[13px]">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
          and a publishable key{" "}
          <code className="rounded-none bg-[#f0ede8] px-1.5 py-0.5 text-[13px]">
            NEXT_PUBLIC_SUPABASE_ANON_KEY
          </code>{" "}
          (or <code className="text-[13px]">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY</code>) to{" "}
          <code className="rounded-none bg-[#f0ede8] px-1.5 py-0.5 text-[13px]">.env.local</code>.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-[#5c5850]">
          Apply migrations to your project:{" "}
          <code className="rounded-none bg-[#f0ede8] px-1.5 py-0.5 text-[13px]">npm run db:push</code>{" "}
          (after <code className="text-[13px]">npx supabase link</code>), then{" "}
          <code className="text-[13px]">npm run seed:products</code> and restart the dev server.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[#0c0c0c] underline decoration-[#0c0c0c]/25 underline-offset-4 transition-colors hover:decoration-[#0c0c0c]"
        >
          ← Back to storefront
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-none border border-[#ece8e3] bg-white p-8 shadow-[0_1px_0_rgba(0,0,0,0.04),0_24px_48px_-12px_rgba(0,0,0,0.08)] sm:p-10">
      <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#8a8580]">Admin access</p>
      <h1 className="mt-3 font-display text-[clamp(1.5rem,2.5vw,1.875rem)] font-normal tracking-tight text-[#0c0c0c]">
        Sign in
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-[#6b6560]">
        Use the email and password from your Supabase project (Authentication → Users).
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <div>
          <label
            htmlFor="email"
            className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#737373]"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#737373]"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={inputClass}
          />
        </div>
        {error ? (
          <p className="rounded-none border border-red-200/80 bg-red-50/90 px-3 py-2 text-sm text-red-900">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className="w-full bg-[#0c0c0c] py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-opacity hover:bg-[#1a1a1a] disabled:cursor-not-allowed disabled:opacity-45"
        >
          {pending ? "Signing in…" : "Continue"}
        </button>
      </form>

      <Link
        href="/"
        className="mt-10 inline-flex items-center gap-2 text-sm text-[#6b6560] transition-colors hover:text-[#0c0c0c]"
      >
        ← Back to storefront
      </Link>
    </div>
  );
}
