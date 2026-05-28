import { useState, useRef, useEffect } from 'react';

export default function ProfileManager({ profiles, activeProfileId, onSwitch, onAdd, onDelete, onRename }) {
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [renamingId, setRenamingId] = useState(null);
  const [renamingName, setRenamingName] = useState('');
  const containerRef = useRef(null);

  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setAdding(false);
        setRenamingId(null);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const handleAdd = () => {
    const name = newName.trim();
    if (!name) return;
    const id = onAdd(name);
    setNewName('');
    setAdding(false);
    onSwitch(id);
    setOpen(false);
  };

  const handleRename = (id) => {
    const name = renamingName.trim();
    if (name) onRename(id, name);
    setRenamingId(null);
    setRenamingName('');
  };

  return (
    <div className="profile-manager" ref={containerRef}>
      <button
        className="profile-toggle"
        onClick={() => setOpen(o => !o)}
        title="Switch household profile"
      >
        <span className="profile-icon">👤</span>
        <span className="profile-name">{activeProfile?.name ?? 'Profile'}</span>
        <span className="profile-caret">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="profile-dropdown">
          <div className="profile-dropdown-title">Household Profiles</div>

          <div className="profile-list">
            {profiles.map(p => (
              <div key={p.id} className={`profile-item${p.id === activeProfileId ? ' active' : ''}`}>
                {renamingId === p.id ? (
                  <div className="profile-rename-row">
                    <input
                      className="profile-rename-input"
                      value={renamingName}
                      autoFocus
                      onChange={e => setRenamingName(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleRename(p.id);
                        if (e.key === 'Escape') { setRenamingId(null); setRenamingName(''); }
                      }}
                    />
                    <button className="btn-sm primary" onClick={() => handleRename(p.id)}>✓</button>
                    <button className="btn-sm" onClick={() => { setRenamingId(null); setRenamingName(''); }}>✕</button>
                  </div>
                ) : (
                  <>
                    <button
                      className="profile-select-btn"
                      onClick={() => { onSwitch(p.id); setOpen(false); setAdding(false); }}
                    >
                      {p.id === activeProfileId && <span className="profile-check">✓</span>}
                      {p.name}
                    </button>
                    <div className="profile-item-actions">
                      <button
                        className="btn-icon"
                        title="Rename"
                        onClick={() => { setRenamingId(p.id); setRenamingName(p.name); }}
                      >✏</button>
                      {profiles.length > 1 && p.id !== activeProfileId && (
                        <button
                          className="btn-icon danger"
                          title="Delete profile"
                          onClick={() => {
                            if (window.confirm(`Delete profile "${p.name}"? This cannot be undone.`)) {
                              onDelete(p.id);
                            }
                          }}
                        >✕</button>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="profile-add-section">
            {adding ? (
              <div className="profile-add-row">
                <input
                  className="profile-add-input"
                  placeholder="Profile name..."
                  value={newName}
                  autoFocus
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleAdd();
                    if (e.key === 'Escape') { setAdding(false); setNewName(''); }
                  }}
                />
                <button className="btn-sm primary" onClick={handleAdd} disabled={!newName.trim()}>Add</button>
                <button className="btn-sm" onClick={() => { setAdding(false); setNewName(''); }}>Cancel</button>
              </div>
            ) : (
              <button className="profile-add-btn" onClick={() => setAdding(true)}>
                + New Profile
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
