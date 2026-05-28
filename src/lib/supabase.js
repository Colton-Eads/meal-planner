import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

if (!isSupabaseConfigured && import.meta.env.DEV) {
  console.warn(
    '[supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY missing. ' +
    'The client is a no-op stub; any call will throw. ' +
    'Fill in .env.local to enable.'
  );
}

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey)
  : new Proxy({}, {
      get() {
        throw new Error(
          'Supabase is not configured. Set VITE_SUPABASE_URL and ' +
          'VITE_SUPABASE_ANON_KEY in .env.local (or in Vercel env vars).'
        );
      },
    });
