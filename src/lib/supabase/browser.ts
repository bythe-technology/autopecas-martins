import { createBrowserClient } from "@supabase/ssr";
import { supabasePublicConfig } from "./config";

export function createSupabaseBrowserClient() {
  const { url, publishableKey: key } = supabasePublicConfig;
  return createBrowserClient(url, key);
}
