import { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { toast } from '../lib/toast';

export default function AuthGate({ children }) {
  const { user, isMember, loading, inRecovery, exitRecovery } = useAuth();

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

  // Recovery flow takes precedence over both signed-out and signed-in states:
  // the user IS signed in via a recovery session, but the only valid next
  // action is to set a new password.
  if (inRecovery) return <ResetPasswordForm onDone={exitRecovery} />;

  if (!user) return <AuthForm />;

  // Signed-in but not a paying member → paywall screen. isMember is stubbed
  // to !!user right now so this branch is dead until Stripe is wired.
  if (!isMember) return <MembershipRequired />;

  return children;
}

// ── Sign in / sign up form ───────────────────────────────────────────────────

function AuthForm() {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  const clearMessages = () => { setError(null); setInfo(null); };

  const submit = async (e) => {
    e.preventDefault();
    clearMessages();
    setBusy(true);
    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (!data.session) {
          setInfo('Check your email for a confirmation link to finish signing up.');
        }
      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });
        if (error) throw error;
        setInfo('If that email is registered, a password reset link is on its way.');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  const switchTo = (next) => { setMode(next); clearMessages(); };

  const title = {
    signin: 'Sign In',
    signup: 'Create Account',
    forgot: 'Send Reset Link',
  }[mode];

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

          {mode !== 'forgot' && (
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
          )}

          {error && <div className="auth-error">{error}</div>}
          {info && <div className="auth-info">{info}</div>}

          <button type="submit" className="btn-primary auth-submit" disabled={busy}>
            {busy ? '…' : title}
          </button>
        </form>

        <div className="auth-toggle">
          {mode === 'signin' && (
            <>
              <div>
                Need an account?{' '}
                <button className="auth-link" onClick={() => switchTo('signup')}>Sign up</button>
              </div>
              <div style={{ marginTop: 8 }}>
                <button className="auth-link" onClick={() => switchTo('forgot')}>Forgot password?</button>
              </div>
            </>
          )}
          {mode === 'signup' && (
            <>
              Already have one?{' '}
              <button className="auth-link" onClick={() => switchTo('signin')}>Sign in</button>
            </>
          )}
          {mode === 'forgot' && (
            <>
              Remembered it?{' '}
              <button className="auth-link" onClick={() => switchTo('signin')}>Back to sign in</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── New-password form (after clicking reset link) ────────────────────────────

function ResetPasswordForm({ onDone }) {
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success('Password updated.');
      onDone();
    } catch (err) {
      setError(err.message || 'Could not update password.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1 className="auth-title">HOME</h1>
        <p className="auth-subtitle">Set a new password</p>

        <form onSubmit={submit} className="auth-form">
          <label className="auth-label">
            New password
            <input
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={busy}
              autoFocus
            />
          </label>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="btn-primary auth-submit" disabled={busy}>
            {busy ? '…' : 'Update Password'}
          </button>
        </form>
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
