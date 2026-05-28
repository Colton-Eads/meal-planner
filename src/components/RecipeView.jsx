import { CATEGORIES } from '../data/meals';

function hasContent(recipe) {
  if (!recipe) return false;
  return (
    recipe.ingredients?.some(i => i.name?.trim()) ||
    recipe.instructions?.some(s => s?.trim())
  );
}

export default function RecipeView({ meal, onClose, onEdit }) {
  const cat = CATEGORIES[meal.category];
  const r = meal.recipe;
  const populated = hasContent(r);

  return (
    <div className="recipe-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="recipe-panel">
        <div className="recipe-panel-header">
          <div className="recipe-panel-title">
            <span className="meal-cat-label" style={{ color: cat.color, background: cat.bg }}>{meal.category}</span>
            <h2>{meal.name}</h2>
          </div>
          <button className="recipe-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="recipe-panel-body">
          {!populated ? (
            <div className="recipe-empty-state">
              <p>No recipe added yet.</p>
              <button className="btn-primary" onClick={onEdit}>Add Recipe</button>
            </div>
          ) : (
            <>
              {(r.servings || r.prepTime || r.cookTime) && (
                <div className="recipe-meta-chips">
                  {r.servings && <span className="meta-chip">🍽 {r.servings} servings</span>}
                  {r.prepTime && <span className="meta-chip">⏱ Prep: {r.prepTime}</span>}
                  {r.cookTime && <span className="meta-chip">🔥 Cook: {r.cookTime}</span>}
                </div>
              )}

              {r.ingredients?.some(i => i.name?.trim()) && (
                <div className="recipe-section">
                  <h3 className="recipe-section-title">Ingredients</h3>
                  <ul className="view-ingredients">
                    {r.ingredients.filter(i => i.name?.trim()).map((ing, i) => (
                      <li key={i}>
                        {[ing.quantity, ing.unit, ing.name].filter(Boolean).join(' ')}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {r.instructions?.some(s => s?.trim()) && (
                <div className="recipe-section">
                  <h3 className="recipe-section-title">Instructions</h3>
                  <ol className="view-instructions">
                    {r.instructions.filter(s => s?.trim()).map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}
            </>
          )}
        </div>

        <div className="recipe-panel-footer">
          <button className="btn-sm" onClick={onClose}>Close</button>
          <button className="btn-sm primary" onClick={onEdit}>Edit Recipe</button>
        </div>
      </div>
    </div>
  );
}
