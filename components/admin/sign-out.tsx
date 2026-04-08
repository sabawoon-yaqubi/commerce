"use client";

import { createClient } from "lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignOut() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function signOut() {
    setPending(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={() => void signOut()}
      disabled={pending}
      className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0c0c0c] underline decoration-[#0c0c0c]/20 underline-offset-4 transition-colors hover:decoration-[#0c0c0c] disabled:opacity-45"
    >
      {pending ? "…" : "Sign out"}
    </button>
  );
}
