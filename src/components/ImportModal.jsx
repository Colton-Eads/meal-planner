import { useState, useRef } from 'react';
import { CATEGORIES } from '../data/meals';

// ── CSV parser ────────────────────────────────────────────────────────────────

function parseCSVRow(line) {
  const fields = [];
  let i = 0;
  while (i <= line.length) {
    if (i === line.length) { fields.push(''); break; }
    if (line[i] === '"') {
      i++;
      let field = '';
      while (i < line.length) {
        if (line[i] === '"' && line[i + 1] === '"') { field += '"'; i += 2; }
        else if (line[i] === '"') { i++; break; }
        else { field += line[i++]; }
      }
      fields.push(field.trim());
      if (line[i] === ',') i++;
    } else {
      let field = '';
      while (i < line.length && line[i] !== ',') field += line[i++];
      if (line[i] === ',') i++;
      fields.push(field.trim());
    }
  }
  return fields;
}

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return { headers: [], rows: [] };
  const headers = parseCSVRow(lines[0]).map(h => h.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''));
  const rows = lines.slice(1).map(line => {
    const vals = parseCSVRow(line);
    return Object.fromEntries(headers.map((h, i) => [h, vals[i] ?? '']));
  });
  return { headers, rows };
}

// ── Recipe CSV aggregator ────────────────────────────────────────────────────
// Expected columns: meal_name, ingredient, quantity, unit
// Optional: servings, prep_time_min, cook_time_min, instructions (semicolon-separated)

function aggregateRecipes(rows) {
  const meals = {};
  const order = [];
  for (const row of rows) {
    const name = (row.meal_name || '').trim();
    if (!name) continue;
    if (!meals[name]) {
      order.push(name);
      meals[name] = {
        name,
        servings:  (row.servings || '').trim(),
        prepTime:  (row.prep_time_min || '').trim(),
        cookTime:  (row.cook_time_min || '').trim(),
        ingredients: [],
        instructions: [],
      };
    }
    const ingName = (row.ingredient || '').trim();
    if (ingName) {
      meals[name].ingredients.push({
        quantity: (row.quantity || '').trim(),
        unit:     (row.unit || '').trim(),
        name:     ingName,
      });
    }
    const instr = (row.instructions || '').trim();
    if (instr && meals[name].instructions.length === 0) {
      meals[name].instructions = instr.split(';').map(s => s.trim()).filter(Boolean);
    }
  }
  return order.map(name => meals[name]);
}

// ── Meal CSV aggregator ───────────────────────────────────────────────────────
// Expected columns: name, category
// Optional: tags (semicolon-separated)

function aggregateMeals(rows, existingMeals) {
  const existingNames = new Set(existingMeals.map(m => m.name.toLowerCase()));
  const catKeys = Object.keys(CATEGORIES);
  const results = [];
  const seen = new Set();
  for (const row of rows) {
    const name = (row.name || '').trim();
    if (!name) continue;
    const lower = name.toLowerCase();
    if (seen.has(lower)) continue;
    seen.add(lower);
    const rawCat = (row.category || '').trim();
    const category = catKeys.find(c => c.toLowerCase() === rawCat.toLowerCase()) || 'Other';
    const rawTags = (row.tags || '').trim();
    const tags = rawTags ? rawTags.split(';').map(t => t.trim()).filter(Boolean) : [];
    results.push({
      id: Date.now() + results.length,
      name,
      category,
      tags,
      duplicate: existingNames.has(lower),
    });
  }
  return results;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ImportModal({ type, meals, onImportRecipes, onImportMeals, onClose }) {
  const [stage, setStage] = useState('pick'); // 'pick' | 'preview' | 'done'
  const [error, setError] = useState('');
  const [recipeData, setRecipeData] = useState([]); // aggregated recipes
  const [mealData, setMealData] = useState([]);     // aggregated meals
  const [matchStats, setMatchStats] = useState(null);
  const fileRef = useRef(null);

  const isRecipes = type === 'recipes';
  const title = isRecipes ? 'Import Recipes from CSV' : 'Import Meals from CSV';

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const { headers, rows } = parseCSV(ev.target.result);
        if (rows.length === 0) { setError('No data rows found in file.'); return; }

        if (isRecipes) {
          if (!headers.includes('meal_name') || !headers.includes('ingredient')) {
            setError('Required columns missing: meal_name, ingredient');
            return;
          }
          const aggregated = aggregateRecipes(rows);
          // Match against existing meals
          const mealByName = Object.fromEntries(meals.map(m => [m.name.toLowerCase(), m]));
          const matched = [];
          const unmatched = [];
          for (const r of aggregated) {
            const m = mealByName[r.name.toLowerCase()];
            if (m) matched.push({ ...r, mealId: m.id });
            else unmatched.push(r);
          }
          setRecipeData([...matched, ...unmatched]);
          setMatchStats({ matched: matched.length, unmatched: unmatched.length, total: aggregated.length });
          setStage('preview');
        } else {
          if (!headers.includes('name')) {
            setError('Required column missing: name');
            return;
          }
          const aggregated = aggregateMeals(rows, meals);
          setMealData(aggregated);
          setStage('preview');
        }
      } catch {
        setError('Failed to parse CSV. Make sure it is a valid CSV file.');
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmRecipes = () => {
    const matched = recipeData.filter(r => r.mealId);
    if (matched.length === 0) { onClose(); return; }
    onImportRecipes(matched.map(r => ({
      id: r.mealId,
      recipe: {
        servings:     r.servings,
        prepTime:     r.prepTime,
        cookTime:     r.cookTime,
        ingredients:  r.ingredients,
        instructions: r.instructions,
      },
    })));
    setStage('done');
  };

  const handleConfirmMeals = () => {
    const toAdd = mealData.filter(m => !m.duplicate || m._forceAdd);
    if (toAdd.length === 0) { onClose(); return; }
    onImportMeals(toAdd.map(m => ({ id: Date.now() + Math.random(), name: m.name, category: m.category, tags: m.tags })));
    setStage('done');
  };

  const toggleForce = (idx) => {
    setMealData(prev => prev.map((m, i) => i === idx ? { ...m, _forceAdd: !m._forceAdd } : m));
  };

  return (
    <div className="recipe-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="recipe-panel import-panel">
        <div className="recipe-panel-header">
          <div className="recipe-panel-title">
            <h2>{title}</h2>
          </div>
          <button className="recipe-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="recipe-panel-body">
          {stage === 'pick' && (
            <div className="import-pick">
              {isRecipes ? (
                <>
                  <p className="import-desc">
                    Upload a CSV with recipe data. Required columns: <code>meal_name</code>, <code>ingredient</code>, <code>quantity</code>, <code>unit</code>.
                    Optional: <code>servings</code>, <code>prep_time_min</code>, <code>cook_time_min</code>, <code>instructions</code> (steps separated by semicolons).
                    One row per ingredient; repeat <code>meal_name</code> for each ingredient row.
                  </p>
                  <p className="import-desc">
                    Only meals that already exist in your library will be updated. Unmatched meal names are shown but skipped.
                  </p>
                </>
              ) : (
                <>
                  <p className="import-desc">
                    Upload a CSV to bulk-add meals. Required column: <code>name</code>.
                    Optional: <code>category</code> (Beef, Chicken, Pork, Seafood, Vegetarian, Other), <code>tags</code> (semicolon-separated).
                  </p>
                </>
              )}

              {error && <div className="import-error">{error}</div>}

              <div className="import-file-row">
                <input
                  ref={fileRef}
                  type="file"
                  accept=".csv,text/csv"
                  style={{ display: 'none' }}
                  onChange={handleFile}
                />
                <button className="btn-primary" onClick={() => fileRef.current?.click()}>
                  Choose CSV file…
                </button>
                <a
                  href={isRecipes ? '/recipe-import-template.csv' : '/meal-import-template.csv'}
                  download
                  className="btn-sm"
                  style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', padding: '8px 14px' }}
                >
                  ⬇ Template CSV
                </a>
              </div>
            </div>
          )}

          {stage === 'preview' && isRecipes && (
            <div className="import-preview">
              <div className="import-stats">
                <span className="grocery-stat">{matchStats.total} meals parsed</span>
                <span className="grocery-stat" style={{ color: 'var(--primary)' }}>{matchStats.matched} matched</span>
                {matchStats.unmatched > 0 && (
                  <span className="grocery-warn">{matchStats.unmatched} not found in library</span>
                )}
              </div>
              <p className="import-note">Only matched meals (✓) will be updated.</p>
              <div className="import-table-wrap">
                <table className="import-table">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Meal</th>
                      <th>Ingredients</th>
                      <th>Steps</th>
                      <th>Servings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recipeData.map((r, i) => (
                      <tr key={i} className={r.mealId ? '' : 'import-row-skip'}>
                        <td>{r.mealId ? '✓' : '—'}</td>
                        <td>{r.name}</td>
                        <td>{r.ingredients.length}</td>
                        <td>{r.instructions.length}</td>
                        <td>{r.servings || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {stage === 'preview' && !isRecipes && (
            <div className="import-preview">
              <div className="import-stats">
                <span className="grocery-stat">{mealData.length} meals parsed</span>
                <span className="grocery-stat" style={{ color: 'var(--primary)' }}>
                  {mealData.filter(m => !m.duplicate).length} new
                </span>
                {mealData.some(m => m.duplicate) && (
                  <span className="grocery-warn">
                    {mealData.filter(m => m.duplicate).length} duplicates (toggle to add anyway)
                  </span>
                )}
              </div>
              <div className="import-table-wrap">
                <table className="import-table">
                  <thead>
                    <tr>
                      <th>Add?</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Tags</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mealData.map((m, i) => (
                      <tr key={i} className={m.duplicate && !m._forceAdd ? 'import-row-skip' : ''}>
                        <td>
                          <input
                            type="checkbox"
                            checked={!m.duplicate || !!m._forceAdd}
                            onChange={() => m.duplicate && toggleForce(i)}
                            disabled={!m.duplicate}
                          />
                        </td>
                        <td>
                          {m.name}
                          {m.duplicate && <span className="import-dupe-label"> (duplicate)</span>}
                        </td>
                        <td>{m.category}</td>
                        <td>{m.tags.join(', ') || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {stage === 'done' && (
            <div className="import-done">
              <div className="import-done-icon">✓</div>
              <p>{isRecipes ? 'Recipes imported successfully!' : 'Meals imported successfully!'}</p>
            </div>
          )}
        </div>

        <div className="recipe-panel-footer">
          {stage === 'pick' && (
            <button className="btn-sm" onClick={onClose}>Cancel</button>
          )}
          {stage === 'preview' && (
            <>
              <button className="btn-sm" onClick={() => { setStage('pick'); setError(''); }}>← Back</button>
              <button
                className="btn-primary"
                onClick={isRecipes ? handleConfirmRecipes : handleConfirmMeals}
              >
                {isRecipes
                  ? `Import ${recipeData.filter(r => r.mealId).length} Recipe${recipeData.filter(r => r.mealId).length !== 1 ? 's' : ''}`
                  : `Add ${mealData.filter(m => !m.duplicate || m._forceAdd).length} Meal${mealData.filter(m => !m.duplicate || m._forceAdd).length !== 1 ? 's' : ''}`}
              </button>
            </>
          )}
          {stage === 'done' && (
            <button className="btn-primary" onClick={onClose}>Close</button>
          )}
        </div>
      </div>
    </div>
  );
}
