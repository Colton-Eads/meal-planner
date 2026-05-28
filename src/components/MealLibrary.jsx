import { useState } from 'react';
import { CATEGORIES } from '../data/meals';
import IngredientLibrary from './IngredientLibrary';

const PRESET_TAGS = ['Quick', 'Crock Pot', 'Kid-Friendly', 'Healthy', 'Comfort Food', 'Grilled', 'One Pan'];

function TagChip({ tag, onRemove }) {
  return (
    <span className="tag-chip">
      {tag}
      {onRemove && <button className="tag-remove" onClick={() => onRemove(tag)}>×</button>}
    </span>
  );
}

function MealRow({ meal, onEdit, onDelete, onEditRecipe }) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [name, setName] = useState(meal.name);
  const [category, setCategory] = useState(meal.category);
  const [tags, setTags] = useState(meal.tags || []);
  const [tagInput, setTagInput] = useState('');
  const cat = CATEGORIES[meal.category];

  const save = () => {
    if (name.trim()) { onEdit(meal.id, name, category, tags); setEditing(false); }
  };

  const addTag = (t) => {
    const tag = t.trim();
    if (tag && !tags.includes(tag)) setTags(prev => [...prev, tag]);
    setTagInput('');
  };

  const removeTag = (t) => setTags(prev => prev.filter(x => x !== t));

  if (editing) {
    return (
      <div className="meal-row editing">
        <div className="edit-row">
          <input className="edit-input" value={name} onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && save()} autoFocus />
          <select className="edit-select" value={category} onChange={e => setCategory(e.target.value)}>
            {Object.keys(CATEGORIES).map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="tag-editor">
          <div className="tag-list">
            {tags.map(t => <TagChip key={t} tag={t} onRemove={removeTag} />)}
          </div>
          <div className="tag-presets">
            {PRESET_TAGS.filter(t => !tags.includes(t)).map(t => (
              <button key={t} className="tag-preset-btn" onClick={() => addTag(t)}>{t}</button>
            ))}
          </div>
          <div className="tag-input-row">
            <input className="tag-input" placeholder="Custom tag..." value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') addTag(tagInput); }} />
            <button className="btn-sm" onClick={() => addTag(tagInput)}>Add</button>
          </div>
        </div>
        <div className="edit-actions">
          <button className="btn-sm primary" onClick={save}>Save</button>
          <button className="btn-sm" onClick={() => { setName(meal.name); setCategory(meal.category); setTags(meal.tags || []); setEditing(false); }}>Cancel</button>
        </div>
      </div>
    );
  }

  if (confirmDelete) {
    return (
      <div className="meal-row delete-confirm-row">
        <span className="delete-confirm-msg">Delete <strong>{meal.name}</strong>?</span>
        <div className="meal-row-actions">
          <button className="btn-sm" onClick={() => setConfirmDelete(false)}>Cancel</button>
          <button className="btn-sm danger" onClick={() => onDelete(meal.id)}>Delete</button>
        </div>
      </div>
    );
  }

  return (
    <div className="meal-row">
      <span className="meal-category-dot" style={{ background: cat.color }} />
      <div className="meal-info">
        <span className="meal-name">{meal.name}</span>
        {meal.tags?.length > 0 && (
          <div className="meal-tags-row">
            {meal.tags.map(t => <TagChip key={t} tag={t} />)}
          </div>
        )}
      </div>
      <span className="meal-cat-label" style={{ color: cat.color, background: cat.bg }}>{meal.category}</span>
      <div className="meal-row-actions">
        <button className="btn-sm recipe-btn" onClick={() => onEditRecipe(meal)}>
          {meal.recipe?.ingredients?.some(i => i.name?.trim()) || meal.recipe?.instructions?.some(s => s?.trim())
            ? '📋 Recipe' : '+ Recipe'}
        </button>
        <button className="btn-sm" onClick={() => setEditing(true)}>Edit</button>
        <span className="meal-row-divider" />
        <button className="btn-sm danger" onClick={() => setConfirmDelete(true)}>Delete</button>
      </div>
    </div>
  );
}

export default function MealLibrary({
  meals, onAdd, onEdit, onDelete, onEditRecipe, onOpenImport, onOpenRecipeImport,
  ingredientLibrary, onAddIngredient, onEditIngredient, onDeleteIngredient,
}) {
  const [subTab, setSubTab] = useState('meals');
  const [filterCat, setFilterCat] = useState('All');
  const [filterTag, setFilterTag] = useState('');
  const [search, setSearch] = useState('');
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState('Beef');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showImportMenu, setShowImportMenu] = useState(false);

  const allTags = [...new Set(meals.flatMap(m => m.tags || []))].sort();

  const filtered = meals.filter(m => {
    const catMatch = filterCat === 'All' || m.category === filterCat;
    const tagMatch = !filterTag || m.tags?.includes(filterTag);
    const q = search.trim().toLowerCase();
    const searchMatch = !q
      || m.name.toLowerCase().includes(q)
      || m.recipe?.ingredients?.some(i => i.name?.toLowerCase().includes(q));
    return catMatch && tagMatch && searchMatch;
  });

  const counts = Object.fromEntries(
    Object.keys(CATEGORIES).map(c => [c, meals.filter(m => m.category === c).length])
  );

  const isFiltered = filterCat !== 'All' || filterTag || search;

  const handleAdd = () => {
    if (newName.trim()) { onAdd(newName, newCat); setNewName(''); }
  };

  if (subTab === 'ingredients') {
    return (
      <div className="library-view">
        <div className="lib-subtab-bar">
          <button className="lib-subtab-btn" onClick={() => setSubTab('meals')}>← Meals</button>
          <h2 className="section-title">Ingredient Library</h2>
        </div>
        <IngredientLibrary
          ingredients={ingredientLibrary}
          onAdd={onAddIngredient}
          onEdit={onEditIngredient}
          onDelete={onDeleteIngredient}
        />
      </div>
    );
  }

  return (
    <div className="library-view">
      <div className="library-header">
        <h2 className="section-title">Meal Library</h2>
        <div className="library-header-actions">
          <div className="toolbar-dropdown-wrap">
            <button
              className={`btn-sm${showImportMenu ? ' active-import' : ''}`}
              onClick={() => { setShowImportMenu(m => !m); }}
            >
              ⬆ Import ▾
            </button>
            {showImportMenu && (
              <div className="toolbar-dropdown import-menu">
                <button className="dropdown-item" onClick={() => { onOpenImport(); setShowImportMenu(false); }}>
                  Import Meals <span className="dropdown-hint">CSV</span>
                </button>
                <button className="dropdown-item" onClick={() => { onOpenRecipeImport(); setShowImportMenu(false); }}>
                  Import Recipes <span className="dropdown-hint">CSV</span>
                </button>
              </div>
            )}
          </div>
          <button
            className="btn-sm"
            onClick={() => setSubTab('ingredients')}
          >
            Ingredients ({ingredientLibrary.length})
          </button>
          <button
            className={`btn-primary btn-sm${showAddForm ? ' btn-add-active' : ''}`}
            onClick={() => setShowAddForm(f => !f)}
          >
            {showAddForm ? '✕ Cancel' : '+ Add Meal'}
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="add-meal-form">
          <div className="add-meal-row">
            <input className="add-input" placeholder="Meal name" value={newName}
              onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdd()}
              autoFocus />
            <select className="edit-select" value={newCat} onChange={e => setNewCat(e.target.value)}>
              {Object.keys(CATEGORIES).map(c => <option key={c}>{c}</option>)}
            </select>
            <button className="btn-primary" onClick={handleAdd} disabled={!newName.trim()}>Add</button>
          </div>
        </div>
      )}

      <div className="category-tabs">
        {['All', ...Object.keys(CATEGORIES)].map(c => (
          <button key={c}
            className={`tab-btn${filterCat === c ? ' active' : ''}`}
            style={c !== 'All' && filterCat === c ? { background: CATEGORIES[c].bg, color: CATEGORIES[c].color, borderColor: CATEGORIES[c].color } : {}}
            onClick={() => setFilterCat(c)}
          >
            {c} ({c !== 'All' ? counts[c] : meals.length})
          </button>
        ))}
      </div>

      {allTags.length > 0 && (
        <div className="tag-filters">
          <button className={`tag-filter-btn${!filterTag ? ' active' : ''}`} onClick={() => setFilterTag('')}>All tags</button>
          {allTags.map(t => (
            <button key={t} className={`tag-filter-btn${filterTag === t ? ' active' : ''}`}
              onClick={() => setFilterTag(t === filterTag ? '' : t)}>{t}</button>
          ))}
        </div>
      )}

      <div className="library-search-row">
        <input className="search-input" placeholder="Search meals or ingredients..." value={search} onChange={e => setSearch(e.target.value)} />
        <span className="meal-count-label">
          {isFiltered ? `${filtered.length} of ${meals.length}` : `${meals.length}`} meals
        </span>
      </div>

      <div className="meal-list">
        {filtered.length === 0
          ? <p className="empty-state">No meals found.</p>
          : filtered.map(m => <MealRow key={m.id} meal={m} onEdit={onEdit} onDelete={onDelete} onEditRecipe={onEditRecipe} />)
        }
      </div>
    </div>
  );
}
