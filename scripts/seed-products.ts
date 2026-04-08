/**
 * Upserts demo catalog from `lib/catalog/data.ts` into Supabase `products`.
 *
 * Usage (from repo root):
 *   npm run seed:products
 *
 * Requires project URL + service role key (bypasses RLS). Add to `.env.local`:
 *   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY=<Project Settings → API → service_role secret>
 */
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { resolve } from "node:path";
import { PRODUCTS } from "../lib/catalog/data";

const root = process.cwd();

// Load .env then .env.local so local overrides; trim stray whitespace from values
config({ path: resolve(root, ".env") });
config({ path: resolve(root, ".env.local"), override: true });

function pickUrl(): string | undefined {
  const a = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const b = process.env.SUPABASE_URL?.trim();
  return a || b;
}

/** Service role JWT — never expose to the browser or NEXT_PUBLIC_. */
function pickServiceRole(): string | undefined {
  const a = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const b = process.env.SERVICE_ROLE_KEY?.trim();
  return a || b;
}

const url = pickUrl();
const serviceKey = pickServiceRole();

if (!url || !serviceKey) {
  console.error("\n  Seed needs your Supabase URL and the service_role secret.\n");
  if (!url) {
    console.error("  Missing: NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL)");
  }
  if (!serviceKey) {
    console.error("  Missing: SUPABASE_SERVICE_ROLE_KEY (or SERVICE_ROLE_KEY)");
    console.error(
      "  → Dashboard: Project Settings → API → copy the service_role key (not the anon key).\n",
    );
  }
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function main() {
  for (const p of PRODUCTS) {
    const { error } = await supabase.from("products").upsert(
      {
        handle: p.handle,
        data: p,
        active: true,
        sort_index: p.sortIndex,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "handle" },
    );

    if (error) {
      console.error(`Upsert failed for ${p.handle}:`, error.message);
      process.exit(1);
    }
    console.log("Upserted", p.handle);
  }

  console.log("Done.");
}

void main();
