import { useState } from 'react';

const GROCERY_CATEGORIES = [
  'Meat & Seafood',
  'Produce',
  'Dairy & Eggs',
  'Bread & Pasta',
  'Canned & Jarred',
  'Frozen',
  'Pantry',
  'Other',
];

function emptyEntry() {
  return { name: '', defaultQty: '', defaultUnit: '', altMeasure: '', category: 'Pantry' };
}

function IngredientRow({ item, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [form, setForm] = useState({ ...item });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const save = () => {
    if (!form.name.trim()) return;
    onEdit(item.id, form);
    setEditing(false);
  };

  if (confirmDelete) {
    return (
      <div className="meal-row delete-confirm-row">
        <span className="delete-confirm-msg">Delete <strong>{item.name}</strong>?</span>
        <div className="meal-row-actions">
          <button className="btn-sm" onClick={() => setConfirmDelete(false)}>Cancel</button>
          <button className="btn-sm danger" onClick={() => onDelete(item.id)}>Delete</button>
        </div>
      </div>
    );
  }

  if (editing) {
    return (
      <div className="meal-row editing ing-lib-edit-row">
        <div className="ing-lib-edit-grid">
          <input className="edit-input" placeholder="Ingredient name" value={form.name}
            onChange={e => set('name', e.target.value)} autoFocus />
          <div className="ing-lib-measure-row">
            <input className="edit-input ing-qty-input" placeholder="Qty" value={form.defaultQty}
              onChange={e => set('defaultQty', e.target.value)} />
            <input className="edit-input ing-unit-input" placeholder="Unit" value={form.defaultUnit}
              onChange={e => set('defaultUnit', e.target.value)} />
            <input className="edit-input" placeholder="Alt (e.g. 10.5 oz)" value={form.altMeasure}
              onChange={e => set('altMeasure', e.target.value)} />
          </div>
          <select className="edit-select" value={form.category} onChange={e => set('category', e.target.value)}>
            {GROCERY_CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="edit-actions">
          <button className="btn-sm primary" onClick={save}>Save</button>
          <button className="btn-sm" onClick={() => { setForm({ ...item }); setEditing(false); }}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="meal-row ing-lib-row">
      <div className="meal-info">
        <span className="meal-name">{item.name}</span>
        <span className="ing-lib-measure">
          {[item.defaultQty, item.defaultUnit].filter(Boolean).join(' ')}
          {item.altMeasure ? ` · ${item.altMeasure}` : ''}
        </span>
      </div>
      <span className="meal-cat-label ing-lib-cat">{item.category}</span>
      <div className="meal-row-actions">
        <button className="btn-sm" onClick={() => setEditing(true)}>Edit</button>
        <span className="meal-row-divider" />
        <button className="btn-sm danger" onClick={() => setConfirmDelete(true)}>Delete</button>
      </div>
    </div>
  );
}

export default function IngredientLibrary({ ingredients, onAdd, onEdit, onDelete }) {
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState(emptyEntry());

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleAdd = () => {
    if (!form.name.trim()) return;
    onAdd(form);
    setForm(emptyEntry());
    setShowAddForm(false);
  };

  const filtered = ingredients.filter(i => {
    const catMatch = filterCat === 'All' || i.category === filterCat;
    const searchMatch = i.name.toLowerCase().includes(search.toLowerCase());
    return catMatch && searchMatch;
  });

  const counts = Object.fromEntries(
    GROCERY_CATEGORIES.map(c => [c, ingredients.filter(i => i.category === c).length])
  );

  const isFiltered = filterCat !== 'All' || search;

  return (
    <div className="library-view">
      <div className="library-header">
        <h2 className="section-title">Ingredient Library</h2>
        <button
          className={`btn-primary btn-sm${showAddForm ? ' btn-add-active' : ''}`}
          onClick={() => setShowAddForm(f => !f)}
        >
          {showAddForm ? '✕ Cancel' : '+ Add Ingredient'}
        </button>
      </div>

      {showAddForm && (
        <div className="add-meal-form">
          <div className="ing-lib-edit-grid">
            <input className="add-input" placeholder="Ingredient name (e.g. cream of chicken soup)"
              value={form.name} onChange={e => set('name', e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()} autoFocus />
            <div className="ing-lib-measure-row">
              <input className="add-input ing-qty-input" placeholder="Qty" value={form.defaultQty}
                onChange={e => set('defaultQty', e.target.value)} />
              <input className="add-input ing-unit-input" placeholder="Unit" value={form.defaultUnit}
                onChange={e => set('defaultUnit', e.target.value)} />
              <input className="add-input" placeholder="Alt measure (e.g. 10.5 oz)"
                value={form.altMeasure} onChange={e => set('altMeasure', e.target.value)} />
            </div>
            <select className="edit-select" value={form.category} onChange={e => set('category', e.target.value)}>
              {GROCERY_CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <button className="btn-primary" onClick={handleAdd} disabled={!form.name.trim()}>
              Add Ingredient
            </button>
          </div>
        </div>
      )}

      <div className="category-tabs">
        {['All', ...GROCERY_CATEGORIES].map(c => (
          <button key={c}
            className={`tab-btn${filterCat === c ? ' active' : ''}`}
            onClick={() => setFilterCat(c)}
          >
            {c} ({c === 'All' ? ingredients.length : (counts[c] ?? 0)})
          </button>
        ))}
      </div>

      <div className="library-search-row">
        <input className="search-input" placeholder="Search ingredients..."
          value={search} onChange={e => setSearch(e.target.value)} />
        <span className="meal-count-label">
          {isFiltered ? `${filtered.length} of ${ingredients.length}` : ingredients.length} ingredients
        </span>
      </div>

      {ingredients.length === 0 ? (
        <div className="ing-lib-empty">
          <p>Your ingredient library is empty.</p>
          <p>Add ingredients here to get autocomplete in the recipe editor and accurate grocery categories.</p>
        </div>
      ) : filtered.length === 0 ? (
        <p className="empty-state">No ingredients match.</p>
      ) : (
        <div className="meal-list">
          {filtered.map(item => (
            <IngredientRow key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
