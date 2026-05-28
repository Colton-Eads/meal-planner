import { useState, useRef, useEffect } from 'react';
import { CATEGORIES } from '../data/meals';

const COMMON_UNITS = [
  'cup','tbsp','tsp','oz','lb','g','kg','ml','L',
  'clove','slice','can','pkg','stick','pinch','bunch','whole','head','sprig',
];

function emptyRecipe() {
  return {
    servings: '',
    prepTime: '',
    cookTime: '',
    ingredients: [{ quantity: '', unit: '', name: '' }],
    instructions: [''],
  };
}

function recipesEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export default function RecipeEditor({ meal, onSave, onClose, ingredientLibrary = [] }) {
  const [recipe, setRecipe] = useState(() => {
    const r = meal.recipe;
    if (!r) return emptyRecipe();
    return {
      servings: r.servings ?? '',
      prepTime: r.prepTime ?? '',
      cookTime: r.cookTime ?? '',
      ingredients: r.ingredients?.length ? r.ingredients : [{ quantity: '', unit: '', name: '' }],
      instructions: r.instructions?.length ? r.instructions : [''],
    };
  });

  const initialRecipe = useRef(null);
  useEffect(() => {
    if (initialRecipe.current === null) {
      initialRecipe.current = recipe;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [saveLabel, setSaveLabel] = useState('Save Recipe');

  const qtyRefs = useRef({});
  const isDirty = initialRecipe.current ? !recipesEqual(recipe, initialRecipe.current) : false;

  const setMeta = (key, val) => setRecipe(r => ({ ...r, [key]: val }));

  // ── Ingredients ──────────────────────────────────────────────────────────

  const setIngredient = (i, key, val) =>
    setRecipe(r => {
      const updated = r.ingredients.map((ing, idx) => {
        if (idx !== i) return ing;
        const next = { ...ing, [key]: val };
        if (key === 'name') {
          const match = ingredientLibrary.find(
            e => e.name.toLowerCase() === val.toLowerCase()
          );
          if (match) {
            if (!next.quantity && match.defaultQty) next.quantity = match.defaultQty;
            if (!next.unit && match.defaultUnit) next.unit = match.defaultUnit;
          }
        }
        return next;
      });
      return { ...r, ingredients: updated };
    });

  const addIngredient = (focusIdx) =>
    setRecipe(r => {
      const next = [...r.ingredients, { quantity: '', unit: '', name: '' }];
      const idx = focusIdx ?? next.length - 1;
      setTimeout(() => qtyRefs.current[idx]?.focus(), 0);
      return { ...r, ingredients: next };
    });

  const removeIngredient = (i) =>
    setRecipe(r => ({ ...r, ingredients: r.ingredients.filter((_, idx) => idx !== i) }));

  const moveIngredient = (i, dir) => {
    const j = i + dir;
    setRecipe(r => {
      if (j < 0 || j >= r.ingredients.length) return r;
      const ings = [...r.ingredients];
      [ings[i], ings[j]] = [ings[j], ings[i]];
      return { ...r, ingredients: ings };
    });
  };

  const handleIngredientKeyDown = (e, i, field) => {
    if (e.key === 'Enter' && field === 'name') {
      e.preventDefault();
      if (i === recipe.ingredients.length - 1) {
        addIngredient();
      } else {
        qtyRefs.current[i + 1]?.focus();
      }
    }
  };

  // ── Instructions ─────────────────────────────────────────────────────────

  const stepRefs = useRef({});

  const setInstruction = (i, val) =>
    setRecipe(r => ({
      ...r,
      instructions: r.instructions.map((step, idx) => idx === i ? val : step),
    }));

  const addInstruction = () =>
    setRecipe(r => {
      const next = [...r.instructions, ''];
      setTimeout(() => stepRefs.current[next.length - 1]?.focus(), 0);
      return { ...r, instructions: next };
    });

  const removeInstruction = (i) =>
    setRecipe(r => ({ ...r, instructions: r.instructions.filter((_, idx) => idx !== i) }));

  const moveInstruction = (i, dir) => {
    const j = i + dir;
    setRecipe(r => {
      if (j < 0 || j >= r.instructions.length) return r;
      const steps = [...r.instructions];
      [steps[i], steps[j]] = [steps[j], steps[i]];
      return { ...r, instructions: steps };
    });
  };

  const handleStepKeyDown = (e, i) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (i === recipe.instructions.length - 1) {
        addInstruction();
      } else {
        stepRefs.current[i + 1]?.focus();
      }
    }
  };

  // ── Save / discard ───────────────────────────────────────────────────────

  const handleSave = () => {
    const ingredients = recipe.ingredients.filter(ing => ing.name.trim() || ing.quantity.trim());
    const instructions = recipe.instructions.filter(s => s.trim());
    onSave(meal.id, { ...recipe, ingredients, instructions });
    setSaveLabel('✓ Saved!');
    setTimeout(() => onClose(), 700);
  };

  const handleCancel = () => {
    if (isDirty) { setConfirmDiscard(true); } else { onClose(); }
  };

  const handleOverlayClick = (e) => {
    if (e.target !== e.currentTarget) return;
    if (isDirty) { setConfirmDiscard(true); } else { onClose(); }
  };

  // ────────────────────────────────────────────────────────────────────────

  const cat = CATEGORIES[meal.category];

  return (
    <div className="recipe-overlay" onClick={handleOverlayClick}>
      <div className="recipe-panel">
        <div className="recipe-panel-header">
          <div className="recipe-panel-title">
            <span className="meal-cat-label" style={{ color: cat.color, background: cat.bg }}>{meal.category}</span>
            <h2>{meal.name}</h2>
          </div>
          <button className="recipe-close-btn" onClick={handleCancel}>✕</button>
        </div>

        <div className="recipe-panel-body">
          <div className="recipe-meta-row">
            <div className="recipe-meta-field">
              <label>Servings</label>
              <input type="number" min={1} value={recipe.servings}
                onChange={e => setMeta('servings', e.target.value)} placeholder="4" />
            </div>
            <div className="recipe-meta-field">
              <label>Prep time</label>
              <input type="text" value={recipe.prepTime}
                onChange={e => setMeta('prepTime', e.target.value)} placeholder="20 min" />
            </div>
            <div className="recipe-meta-field">
              <label>Cook time</label>
              <input type="text" value={recipe.cookTime}
                onChange={e => setMeta('cookTime', e.target.value)} placeholder="45 min" />
            </div>
          </div>

          {/* Ingredients */}
          <div className="recipe-section">
            <h3 className="recipe-section-title">Ingredients</h3>
            <div className="ingredient-header-row">
              <span>Qty</span><span>Unit</span><span>Ingredient</span><span /><span />
            </div>
            <div className="ingredients-list">
              {recipe.ingredients.map((ing, i) => (
                <div key={i} className="ingredient-row">
                  <input
                    ref={el => { qtyRefs.current[i] = el; }}
                    type="text"
                    value={ing.quantity}
                    onChange={e => setIngredient(i, 'quantity', e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && setIngredient(i, 'quantity', e.target.value)}
                    placeholder="2"
                  />
                  <input
                    type="text"
                    list="unit-options"
                    value={ing.unit}
                    onChange={e => setIngredient(i, 'unit', e.target.value)}
                    placeholder="unit"
                  />
                  <input
                    type="text"
                    list="ingredient-options"
                    value={ing.name}
                    onChange={e => setIngredient(i, 'name', e.target.value)}
                    onKeyDown={e => handleIngredientKeyDown(e, i, 'name')}
                    placeholder="ground beef"
                  />
                  <div className="row-reorder-btns">
                    <button className="btn-reorder" onClick={() => moveIngredient(i, -1)} disabled={i === 0} title="Move up">↑</button>
                    <button className="btn-reorder" onClick={() => moveIngredient(i, 1)} disabled={i === recipe.ingredients.length - 1} title="Move down">↓</button>
                  </div>
                  <button
                    className="btn-remove-row"
                    onClick={() => removeIngredient(i)}
                    disabled={recipe.ingredients.length === 1}
                  >✕</button>
                </div>
              ))}
            </div>
            <button className="btn-add-row" onClick={() => addIngredient()}>+ Add ingredient</button>
          </div>

          {/* Instructions */}
          <div className="recipe-section">
            <h3 className="recipe-section-title">Instructions</h3>
            <div className="instructions-list">
              {recipe.instructions.map((step, i) => (
                <div key={i} className="instruction-row">
                  <span className="step-num">{i + 1}.</span>
                  <textarea
                    ref={el => { stepRefs.current[i] = el; }}
                    className="step-input"
                    value={step}
                    onChange={e => setInstruction(i, e.target.value)}
                    onKeyDown={e => handleStepKeyDown(e, i)}
                    placeholder={`Step ${i + 1}`}
                    rows={2}
                  />
                  <div className="row-reorder-btns">
                    <button className="btn-reorder" onClick={() => moveInstruction(i, -1)} disabled={i === 0} title="Move up">↑</button>
                    <button className="btn-reorder" onClick={() => moveInstruction(i, 1)} disabled={i === recipe.instructions.length - 1} title="Move down">↓</button>
                  </div>
                  <button
                    className="btn-remove-row"
                    onClick={() => removeInstruction(i)}
                    disabled={recipe.instructions.length === 1}
                  >✕</button>
                </div>
              ))}
            </div>
            <button className="btn-add-row" onClick={addInstruction}>+ Add step</button>
          </div>
        </div>

        <div className="recipe-panel-footer">
          {confirmDiscard ? (
            <div className="discard-confirm">
              <span>Discard unsaved changes?</span>
              <button className="btn-sm" onClick={() => setConfirmDiscard(false)}>Keep Editing</button>
              <button className="btn-sm danger" onClick={onClose}>Discard</button>
            </div>
          ) : (
            <>
              <button className="btn-sm" onClick={handleCancel}>Cancel</button>
              <button
                className={`btn-primary${saveLabel !== 'Save Recipe' ? ' btn-saved' : ''}`}
                onClick={handleSave}
                disabled={saveLabel !== 'Save Recipe'}
              >
                {saveLabel}
              </button>
            </>
          )}
        </div>
      </div>

      <datalist id="unit-options">
        {COMMON_UNITS.map(u => <option key={u} value={u} />)}
      </datalist>
      <datalist id="ingredient-options">
        {ingredientLibrary.map(e => <option key={e.id} value={e.name} />)}
      </datalist>
    </div>
  );
}
