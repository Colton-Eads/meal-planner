import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Single shared state, kept simple — one app, one auth session.
// Components subscribe via useAuth() and re-render on change.

export function useAuth() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const user = session?.user ?? null;

  // PLACEHOLDER paywall check. When Stripe is wired, replace this body with
  // a query against public.subscriptions (or a cached value from a separate
  // useSubscription hook). Everything else in the app gates on isMember and
  // does not need to change.
  const isMember = !!user;

  return { session, user, isMember, loading };
}
