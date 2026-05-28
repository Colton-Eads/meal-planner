import { useState } from 'react';
import { CATEGORIES } from '../data/meals';
import { EAT_OUT, LEFTOVER } from '../hooks/useMealPlan';

const WEEKDAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const LEGEND_ITEMS = [
  { icon: '↺', label: 'Shuffle — assign a random meal' },
  { icon: '☰', label: 'Pick — choose a specific meal from your library' },
  { icon: '🍽', label: 'Eat Out — mark this night as a restaurant night' },
  { icon: '♻', label: 'Leftovers — mark this night as a leftover night' },
  { icon: '🔒', label: 'Lock — pin this meal so it stays on regenerate' },
  { icon: '✕', label: 'Clear — remove the assigned meal' },
];

function hasContent(recipe) {
  if (!recipe) return false;
  return recipe.ingredients?.some(i => i.name?.trim()) || recipe.instructions?.some(s => s?.trim());
}

export default function DayView({
  date,
  planValue, meal, locked, meals,
  onClose, onReassign, onClear,
  onToggleEatOut, onToggleLeftover, onToggleLock,
  onEditRecipe,
}) {
  const day = date.getDate();
  const viewYear = date.getFullYear();
  const viewMonth = date.getMonth();
  const [showPicker, setShowPicker] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [checked, setChecked] = useState({});

  const isEatOut = planValue === EAT_OUT;
  const isLeftover = planValue === LEFTOVER;
  const cat = meal ? CATEGORIES[meal.category] : null;
  const r = meal?.recipe;
  const hasRecipe = hasContent(r);

  const filteredMeals = meals.filter(m =>
    m.name.toLowerCase().includes(pickerSearch.toLowerCase())
  );

  const toggleChecked = (key) => setChecked(c => ({ ...c, [key]: !c[key] }));

  const handlePrint = () => window.print();

  const handlePick = (mealId) => {
    onReassign(date, mealId);
    setShowPicker(false);
    setChecked({});
  };

  const handleShuffle = () => {
    onReassign(date);
    setChecked({});
  };

  return (
    <div className="recipe-overlay day-view-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="recipe-panel day-view-panel">

        <div className="recipe-panel-header day-view-header">
          <div className="day-view-date">
            <span className="day-view-weekday">{WEEKDAY_NAMES[date.getDay()]}</span>
            <span className="day-view-full-date">{MONTH_NAMES[viewMonth]} {day}, {viewYear}</span>
          </div>
          <div className="day-view-header-btns">
            <button className="btn-icon-help" onClick={() => setShowHelp(h => !h)} title="Help">?</button>
            <button className="recipe-close-btn" onClick={onClose}>✕</button>
          </div>
        </div>

        {showHelp && (
          <div className="day-view-help">
            <div className="day-view-help-title">Day Controls</div>
            <div className="day-view-help-items">
              {LEGEND_ITEMS.map(item => (
                <div key={item.icon} className="day-view-help-item">
                  <span className="legend-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="recipe-panel-body day-view-body">

          <div className="day-view-meal-row">
            {isEatOut ? (
              <div className="meal-chip eat-out-chip day-view-chip">Eating Out</div>
            ) : isLeftover ? (
              <div className="meal-chip leftover-chip day-view-chip">Leftovers</div>
            ) : meal ? (
              <div className="meal-chip day-view-chip" style={{ background: cat.bg, color: cat.color }}>
                {meal.name}
              </div>
            ) : (
              <div className="day-view-no-meal">No meal assigned</div>
            )}
          </div>

          <div className="day-view-actions">
            {!isEatOut && !isLeftover && (
              <>
                <button className="day-view-btn" onClick={handleShuffle}>
                  <span className="dv-btn-icon">↺</span> Shuffle
                </button>
                <button
                  className={`day-view-btn${showPicker ? ' active-pick' : ''}`}
                  onClick={() => { setShowPicker(p => !p); setPickerSearch(''); }}
                >
                  <span className="dv-btn-icon">☰</span> Pick Meal
                </button>
              </>
            )}
            <button
              className={`day-view-btn${isEatOut ? ' active-eat-out' : ''}`}
              onClick={() => onToggleEatOut(date)}
            >
              <span className="dv-btn-icon">🍽</span> {isEatOut ? 'Cancel Eat Out' : 'Eat Out'}
            </button>
            <button
              className={`day-view-btn${isLeftover ? ' active-leftover' : ''}`}
              onClick={() => onToggleLeftover(date)}
            >
              <span className="dv-btn-icon">♻</span> {isLeftover ? 'Cancel Leftovers' : 'Leftovers'}
            </button>
            <button
              className={`day-view-btn${locked ? ' active-lock' : ''}`}
              onClick={() => onToggleLock(date)}
            >
              <span className="dv-btn-icon">🔒</span> {locked ? 'Unlock' : 'Lock'}
            </button>
            {!isEatOut && !isLeftover && meal && (
              <button className="day-view-btn danger" onClick={() => { onClear(date); onClose(); }}>
                <span className="dv-btn-icon">✕</span> Clear
              </button>
            )}
          </div>

          {showPicker && (
            <div className="day-view-picker">
              <input
                className="search-input"
                placeholder="Search meals..."
                value={pickerSearch}
                onChange={e => setPickerSearch(e.target.value)}
                autoFocus
              />
              <div className="day-view-picker-list">
                {filteredMeals.map(m => {
                  const c = CATEGORIES[m.category];
                  return (
                    <button key={m.id} className="picker-item" style={{ color: c.color }} onClick={() => handlePick(m.id)}>
                      {m.name}
                      {m.tags?.length > 0 && (
                        <span className="picker-tags">
                          {m.tags.map(t => <span key={t} className="tag-chip">{t}</span>)}
                        </span>
                      )}
                    </button>
                  );
                })}
                {filteredMeals.length === 0 && <div className="empty-state">No meals match</div>}
              </div>
            </div>
          )}

          {meal && !isEatOut && !isLeftover && (
            <div className="day-view-recipe">
              <div className="day-view-section-header">
                <h3 className="recipe-section-title">Recipe</h3>
                <div className="day-view-recipe-btns">
                  {hasRecipe && (
                    <button className="btn-sm" onClick={handlePrint}>⎙ Print</button>
                  )}
                  {onEditRecipe && (
                    <button className="btn-sm primary recipe-btn" onClick={() => onEditRecipe(meal)}>
                      Edit Recipe
                    </button>
                  )}
                </div>
              </div>

              {!hasRecipe ? (
                <div className="recipe-empty-state">
                  <p>No recipe added yet.</p>
                  {onEditRecipe && (
                    <button className="btn-primary" onClick={() => onEditRecipe(meal)}>Add Recipe</button>
                  )}
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
                      <ul className="view-ingredients dv-checklist">
                        {r.ingredients.filter(i => i.name?.trim()).map((ing, idx) => {
                          const key = `ing-${idx}`;
                          return (
                            <li
                              key={idx}
                              className={`dv-check-item${checked[key] ? ' dv-checked' : ''}`}
                              onClick={() => toggleChecked(key)}
                            >
                              <input
                                type="checkbox"
                                checked={!!checked[key]}
                                onChange={() => toggleChecked(key)}
                                onClick={e => e.stopPropagation()}
                              />
                              <span>{[ing.quantity, ing.unit, ing.name].filter(Boolean).join(' ')}</span>
                            </li>
                          );
                        })}
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
          )}

        </div>
      </div>
    </div>
  );
}
