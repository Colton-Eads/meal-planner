import { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { reportError, toast } from '../lib/toast';

export default function AccountMenu() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setConfirmingDelete(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const handleSignOut = async () => {
    setOpen(false);
    await supabase.auth.signOut();
  };

  const handleDelete = async () => {
    setDeleting(true);
    const { error } = await supabase.rpc('delete_my_account');
    if (error) {
      reportError('delete account', error);
      setDeleting(false);
      return;
    }
    // Server-side cascade has fired; clear the local session too.
    await supabase.auth.signOut();
    toast.success('Account deleted.');
  };

  return (
    <div className="account-menu" ref={containerRef}>
      <button
        className="btn-dark-toggle"
        onClick={() => setOpen(o => !o)}
        title="Account"
      >
        ⏻
      </button>

      {open && (
        <div className="account-dropdown">
          <div className="account-dropdown-email" title={user?.email}>{user?.email}</div>

          <button className="account-item" onClick={handleSignOut}>
            Sign out
          </button>

          {!confirmingDelete ? (
            <button
              className="account-item account-item-danger"
              onClick={() => setConfirmingDelete(true)}
            >
              Delete account
            </button>
          ) : (
            <div className="account-delete-confirm">
              <div className="account-delete-msg">
                This permanently deletes your account and all data. Cannot be undone.
              </div>
              <div className="account-delete-actions">
                <button
                  className="btn-sm"
                  onClick={() => setConfirmingDelete(false)}
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  className="btn-sm danger"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? '…' : 'Delete forever'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
