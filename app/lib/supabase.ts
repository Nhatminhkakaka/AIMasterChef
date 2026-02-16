import { createBrowserClient } from "@supabase/ssr";

console.log("SUPABASE FILE LOADED");

export function createSupabaseClient() {
  console.log("SUPABASE FUNCTION CALLED");

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
