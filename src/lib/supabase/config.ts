export const supabasePublicConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dlqzwwqynmgqyflupwyt.supabase.co",
  publishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_JSrZhX9TBePISgqVCJQStA_IHHKoFAZ",
} as const;