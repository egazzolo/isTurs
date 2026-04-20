import { createBrowserClient } from "@supabase/ssr";

// Using an untyped client here; types are applied via explicit casts at call sites
// (using @supabase/supabase-js generated types causes `never` inference in v2 with hand-crafted schemas)
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
