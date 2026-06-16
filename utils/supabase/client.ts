import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    console.warn("Supabase environment variables are missing on the client.");
    // Return a dummy client or handle it gracefully to avoid crashing during build
    return createBrowserClient(url || "", key || "");
  }

  return createBrowserClient(url, key)
}
