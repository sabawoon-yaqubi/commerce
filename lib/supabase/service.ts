import { createClient } from "@supabase/supabase-js";

function serviceUrl(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    process.env.SUPABASE_URL?.trim()
  );
}

function serviceRoleKey(): string | undefined {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.SERVICE_ROLE_KEY?.trim()
  );
}

/** True when server can write orders (checkout complete, webhooks). */
export function isSupabaseServiceConfigured(): boolean {
  return Boolean(serviceUrl() && serviceRoleKey());
}

/** Server-only client with the service role — bypasses RLS (webhooks, scripts). */
export function createServiceClient() {
  const url = serviceUrl();
  const key = serviceRoleKey();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
