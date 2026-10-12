import { createClient } from 'npm:@supabase/supabase-js@2.43.0'

// SUPABASE_URL is injected automatically into Edge Functions.
// SERVICE_KEY is a custom secret holding the project's secret key; the
// automatically injected SUPABASE_SERVICE_ROLE_KEY is used as a fallback.
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SERVICE_KEY') ?? Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  { auth: { persistSession: false, autoRefreshToken: false } }
)

export default supabase
