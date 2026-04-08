import { getSupabasePublishableKey } from "lib/supabase/env";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Public, read-only client for catalog queries (no cookies — safe inside `"use cache"` / `cache()`).
 */
export function createAnonClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = getSupabasePublishableKey();
  if (!url || !key) return null;
  return createClient(url, key);
}
