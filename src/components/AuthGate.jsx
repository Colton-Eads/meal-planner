import { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

export default function AuthGate({ children }) {
  const { user, isMember, loading } = useAuth();

  if (!isSupabaseConfigured) {
    return (
      <div className="auth-shell">
        <div className="auth-card">
          <h1 className="auth-title">HOME</h1>
          <p className="auth-error">
            Supabase isn't configured. Set <code>VITE_SUPABASE_URL</code> and{' '}
            <code>VITE_SUPABASE_ANON_KEY</code> in your environment, then reload.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="auth-shell">
        <div className="auth-card auth-loading">Loading…</div>
      </div>
    );
  }

  if (!user) return <AuthForm />;

  // Signed-in but not a paying member → paywall screen. Right now isMember
  // is a stub that returns true for every signed-in user, so this branch is
  // dead code until Stripe is wired. It's here so the shape is right when
  // that day comes — flip one line in useAuth and this becomes the paywall.
  if (!isMember) return <MembershipRequired />;

  return children;
}

// ── Auth form ────────────────────────────────────────────────────────────────

function AuthForm() {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // onAuthStateChange will rerender AuthGate — no router needed.
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        // If email confirmation is ON (Supabase default), the session is null
        // here and the user must click the link in their email to confirm.
        if (!data.session) {
          setInfo('Check your email for a confirmation link to finish signing up.');
        }
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1 className="auth-title">HOME</h1>
        <p className="auth-subtitle">Handling Our Meals Effortlessly</p>

        <form onSubmit={submit} className="auth-form">
          <label className="auth-label">
            Email
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={busy}
            />
          </label>

          <label className="auth-label">
            Password
            <input
              type="password"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              required
              minLength={6}
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={busy}
            />
          </label>

          {error && <div className="auth-error">{error}</div>}
          {info && <div className="auth-info">{info}</div>}

          <button type="submit" className="btn-primary auth-submit" disabled={busy}>
            {busy ? '…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="auth-toggle">
          {mode === 'signin' ? (
            <>
              Need an account?{' '}
              <button className="auth-link" onClick={() => { setMode('signup'); setError(null); setInfo(null); }}>
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have one?{' '}
              <button className="auth-link" onClick={() => { setMode('signin'); setError(null); setInfo(null); }}>
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Paywall placeholder (currently unreachable; see AuthGate above) ──────────

function MembershipRequired() {
  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1 className="auth-title">HOME</h1>
        <p className="auth-subtitle">Membership required</p>
        <p>
          Your account is signed in but doesn't have an active subscription.
          When billing is wired up, the subscribe button lands here.
        </p>
        <button
          className="btn-primary auth-submit"
          onClick={() => supabase.auth.signOut()}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
