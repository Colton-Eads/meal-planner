import { useMemo, useState } from 'react';
import { EAT_OUT, LEFTOVER } from '../hooks/useMealPlan';

const CATEGORY_ORDER = [
  'Meat & Seafood',
  'Produce',
  'Dairy & Eggs',
  'Bread & Pasta',
  'Canned & Jarred',
  'Frozen',
  'Pantry',
  'Other',
];

const CATEGORY_KEYWORDS = {
  'Meat & Seafood': [
    'beef','chicken','pork','shrimp','fish','salmon','tuna','crab','lobster',
    'sausage','bacon','ham','turkey','steak','rib','tenderloin','kielbasa',
    'sirloin','ribeye','roast','clam','seafood','meatball','meatloaf','pepperoni',
    'chorizo','corned beef','brisket','chuck','flank','skirt','cube steak',
  ],
  'Produce': [
    'onion','garlic','tomato','pepper','lettuce','cabbage','carrot','celery',
    'potato','broccoli','mushroom','lemon','lime','apple','avocado','spinach',
    'zucchini','eggplant','corn','cucumber','ginger','cilantro','basil','parsley',
    'scallion','green onion','asparagus','cauliflower','snap pea','bean sprout',
    'kale','arugula','radish','beet','squash','pumpkin','jalapeño','serrano',
    'chipotle','orange','pineapple','mango','pear','banana','berry',
  ],
  'Dairy & Eggs': [
    'cheese','milk','cream','butter','egg','sour cream','ricotta','mozzarella',
    'parmesan','cheddar','swiss','provolone','yogurt','cotija','monterey jack',
    'velveeta','cream cheese','half-and-half','whipping','brie','feta',
  ],
  'Bread & Pasta': [
    'pasta','noodle','spaghetti','fettuccine','rotini','ziti','penne','rigatoni',
    'macaroni','bread','bun','roll','tortilla','pita','shell','lasagna','ravioli',
    'ditalini','orzo','linguine','waffle','pancake','biscuit','crouton','panko',
    'hoagie','bagel','english muffin','croissant','taco shell','wonton',
  ],
  'Canned & Jarred': [
    'canned','jarred','enchilada sauce','marinara','pesto','salsa','taco sauce',
    'tomato sauce','tomato paste','crushed tomato','diced tomato','rotel',
    'cream of mushroom','cream of chicken','beef broth','chicken broth','stock',
    'coconut milk','evaporated milk','condensed','beans','kidney bean','black bean',
    'pinto bean','navy bean','cannellini','great northern','chickpea',
  ],
  'Frozen': ['frozen'],
  'Pantry': [
    'oil','vinegar','soy sauce','flour','sugar','breadcrumb','seasoning','powder',
    'spice','salt','pepper','cumin','paprika','oregano','thyme','rosemary','sage',
    'ketchup','mustard','mayo','mayonnaise','worcestershire','honey','rice',
    'cornstarch','baking','vanilla','cinnamon','nutmeg','clove','bay leaf',
    'red pepper flake','chili powder','garlic powder','onion powder','turmeric',
    'curry','garam masala','achiote','ranch dressing','au jus','onion soup mix',
    'taco seasoning','brown sugar','molasses','maple syrup','hot sauce','sriracha',
    'hoisin','oyster sauce','sesame oil','fish sauce','malt vinegar','beer',
    'wine','marsala','balsamic','olive oil','vegetable oil','cooking spray',
  ],
};

function makeCategorizerWithLibrary(ingredientLibrary) {
  const libMap = new Map(
    (ingredientLibrary || []).map(e => [e.name.toLowerCase().trim(), e.category])
  );
  return function categorize(name) {
    const lower = name.toLowerCase().trim();
    if (libMap.has(lower)) return libMap.get(lower);
    for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      if (keywords.some(kw => lower.includes(kw))) return cat;
    }
    return 'Other';
  };
}

const COUNT_TO_OZ = {
  'chicken breast':   8,
  'chicken thigh':    5,
  'chicken leg':      7,
  'pork chop':        6,
  'pork tenderloin':  24,
  'hot dog':          2,
  'sausage link':     3,
};

const FRACS = { '½': 0.5, '¼': 0.25, '¾': 0.75, '⅓': 1/3, '⅔': 2/3, '⅛': 0.125 };
function parseQty(qty) {
  if (!qty && qty !== 0) return null;
  const s = String(qty).trim();
  if (FRACS[s]) return FRACS[s];
  for (const [frac, val] of Object.entries(FRACS)) {
    if (s.includes(frac)) {
      const whole = parseFloat(s.replace(frac, '').trim()) || 0;
      return whole + val;
    }
  }
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}

function formatQty(n) {
  if (n === null || n === undefined) return '';
  if (Math.abs(n - Math.round(n)) < 0.02) return String(Math.round(n));
  const whole = Math.floor(n);
  const frac = n - whole;
  if (Math.abs(frac - 0.5)  < 0.04) return whole > 0 ? `${whole}½`  : '½';
  if (Math.abs(frac - 0.25) < 0.04) return whole > 0 ? `${whole}¼`  : '¼';
  if (Math.abs(frac - 0.75) < 0.04) return whole > 0 ? `${whole}¾`  : '¾';
  if (Math.abs(frac - 0.33) < 0.04) return whole > 0 ? `${whole}⅓`  : '⅓';
  if (Math.abs(frac - 0.67) < 0.04) return whole > 0 ? `${whole}⅔`  : '⅔';
  return n.toFixed(1);
}

const TRAILING = [
  'sliced','thin','thick','thinly','thickly',
  'diced','small','large','medium','fine','finely','rough','roughly',
  'minced','chopped','coarsely',
  'cooked','shredded','grated','crumbled','softened','melted','beaten',
  'pounded','pressed','thawed','drained','rinsed',
  'boneless','bone-in','skinless','skin-on',
  'halved','quartered','cubed','trimmed','peeled','seeded',
  'preferred','optional','separated','warmed','toasted','day-old',
  'scrambled','browned','fried','baked','grilled','roasted',
];

const UNIT_NORM = {
  lbs: 'lb', pound: 'lb', pounds: 'lb',
  ounce: 'oz', ounces: 'oz',
  cups: 'cup',
  tbsp: 'tbsp', tablespoon: 'tbsp', tablespoons: 'tbsp',
  tsp: 'tsp', teaspoon: 'tsp', teaspoons: 'tsp',
  clove: 'clove', cloves: 'clove',
  slice: 'slice', slices: 'slice',
  cans: 'can',
  jars: 'jar',
  sticks: 'stick',
  bags: 'bag',
  packages: 'pkg', package: 'pkg', pkg: 'pkg',
};

const PLURAL_NORM = {
  'chicken breasts': 'chicken breast',
  'chicken thighs': 'chicken thigh',
  'eggs': 'egg',
  'potatoes': 'potato',
  'tomatoes': 'tomato',
  'onions': 'onion',
  'carrots': 'carrot',
  'peppers': 'pepper',
  'mushrooms': 'mushroom',
  'lemons': 'lemon',
  'limes': 'lime',
  'buns': 'bun',
  'rolls': 'roll',
  'tortillas': 'tortilla',
  'fillets': 'fillet',
  'stalks': 'stalk',
};

function normalizeIngredient(rawName, rawUnit) {
  let n = rawName.toLowerCase().trim();
  n = n.replace(/\s*\([^)]*\)/g, '').trim();
  n = n.replace(/,.*$/, '').trim();
  n = n.replace(/\s+or\s+.*$/, '').trim();
  n = n.replace(/\s+[—–-]\s+.*$/, '').trim();

  let changed = true;
  while (changed) {
    changed = false;
    for (const word of TRAILING) {
      if (n !== word && n.endsWith(' ' + word)) {
        n = n.slice(0, -(word.length + 1)).trim();
        changed = true;
        break;
      }
    }
  }

  if (PLURAL_NORM[n]) n = PLURAL_NORM[n];

  const rawU = (rawUnit || '').trim().toLowerCase();
  const normUnit = UNIT_NORM[rawU] ?? rawU;

  return { key: `${n}|||${normUnit}`, displayName: n, displayUnit: normUnit };
}

function toOzIfCount(displayName, displayUnit, scaledQty) {
  if (scaledQty === null) return null;
  const isCount = displayUnit === '' || displayUnit === 'count' || displayUnit === 'whole';
  if (!isCount) return null;
  const ozEach = COUNT_TO_OZ[displayName];
  if (!ozEach) return null;
  return scaledQty * ozEach;
}

function toOzIfWeight(displayUnit, scaledQty) {
  if (scaledQty === null) return null;
  if (displayUnit === 'lb') return scaledQty * 16;
  if (displayUnit === 'oz') return scaledQty;
  return null;
}

function formatOzAsWeight(oz) {
  if (oz >= 16) {
    const lb = oz / 16;
    return `~${formatQty(lb)} lb`;
  }
  return `~${formatQty(oz)} oz`;
}

function buildGroceryList(meals, planSubset, householdSize, categorize) {
  const mealMap = Object.fromEntries(meals.map(m => [m.id, m]));
  const aggregated = {};
  let mealCount = 0;
  const missingMealNames = [];

  for (const mealId of Object.values(planSubset)) {
    if (!mealId || mealId === EAT_OUT || mealId === LEFTOVER) continue;
    const meal = mealMap[mealId];
    if (!meal) continue;
    mealCount++;
    if (!meal.recipe?.ingredients?.length) {
      missingMealNames.push(meal.name);
      continue;
    }

    const recipeServings = parseFloat(meal.recipe.servings) || null;
    const scale = recipeServings && householdSize ? householdSize / recipeServings : 1;

    for (const ing of meal.recipe.ingredients) {
      if (!ing.name?.trim()) continue;
      const { key: rawKey, displayName, displayUnit } = normalizeIngredient(ing.name, ing.unit);
      const rawQty = parseQty(ing.quantity);
      const scaledQty = rawQty !== null ? rawQty * scale : null;

      const ozFromCount  = toOzIfCount(displayName, displayUnit, scaledQty);
      const ozFromWeight = toOzIfWeight(displayUnit, scaledQty);
      const ozValue      = ozFromCount ?? ozFromWeight;

      const canConvert = ozValue !== null && COUNT_TO_OZ[displayName] !== undefined;
      const key = canConvert ? `${displayName}|||__oz__` : rawKey;

      if (!aggregated[key]) {
        aggregated[key] = {
          name: displayName,
          unit: canConvert ? '__oz__' : displayUnit,
          qty: canConvert ? ozValue : scaledQty,
          canSum: (canConvert ? ozValue : scaledQty) !== null,
          isOzBucket: canConvert,
        };
      } else {
        const addQty = canConvert ? ozValue : scaledQty;
        if (addQty !== null && aggregated[key].canSum) {
          aggregated[key].qty += addQty;
        } else {
          aggregated[key].canSum = false;
        }
      }
    }
  }

  const byCategory = {};
  for (const [key, item] of Object.entries(aggregated)) {
    const cat = categorize(item.name);
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push({ ...item, key });
  }

  for (const cat of Object.keys(byCategory)) {
    byCategory[cat].sort((a, b) => a.name.localeCompare(b.name));
  }

  return { byCategory, mealCount, missingMealNames };
}

function buildExportText(byCategory, rangeLabel, householdSize) {
  const lines = [`Grocery List — ${rangeLabel} (${householdSize} people)`, ''];
  for (const cat of CATEGORY_ORDER) {
    const items = byCategory[cat];
    if (!items?.length) continue;
    lines.push(cat.toUpperCase());
    for (const item of items) {
      const qtyStr = item.isOzBucket && item.canSum
        ? formatOzAsWeight(item.qty)
        : item.canSum ? formatQty(item.qty) : '';
      const parts = item.isOzBucket
        ? [qtyStr, item.name].filter(Boolean)
        : [qtyStr, item.unit, item.name].filter(Boolean);
      lines.push(`□ ${parts.join(' ')}`);
    }
    lines.push('');
  }
  return lines.join('\n');
}

export default function GroceryList({
  meals, viewMonth, viewYear, planKey,
  visiblePlan, viewLabel, viewMode,
  householdSize, onHouseholdSizeChange,
  groceryChecked, onToggleItem, onClearChecked,
  ingredientLibrary,
}) {
  const [showMissingList, setShowMissingList] = useState(false);
  const [showExport, setShowExport] = useState(false);

  // Grocery scope follows the calendar's view mode. visiblePlan keys are
  // YYYY-MM-DD strings; buildGroceryList only iterates values, so the key
  // shape doesn't matter.
  const planSubset = visiblePlan;

  // Checked items still persist per-month so "I bought milk" survives when
  // you flip from week view → month view (same checked-state visible).
  const checkedSet = new Set(groceryChecked[planKey] || []);

  const categorize = useMemo(
    () => makeCategorizerWithLibrary(ingredientLibrary),
    [ingredientLibrary],
  );

  const { byCategory, mealCount, missingMealNames } = useMemo(
    () => buildGroceryList(meals, planSubset, householdSize, categorize),
    [meals, planSubset, householdSize, categorize],
  );

  const totalItems = Object.values(byCategory).reduce((s, arr) => s + arr.length, 0);
  const checkedCount = [...checkedSet].filter(k => Object.values(byCategory).flat().some(i => i.key === k)).length;
  const rangeLabel = viewLabel;

  const exportText = buildExportText(byCategory, rangeLabel, householdSize);

  const handleCopy = () => {
    navigator.clipboard.writeText(exportText);
  };

  const handleDownload = () => {
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const month = String(viewMonth + 1).padStart(2, '0');
    a.download = `grocery-list-${viewYear}-${month}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => window.print();

  const noMealsInPlan = Object.values(visiblePlan).every(v => !v || v === EAT_OUT || v === LEFTOVER);
  const scopeLabel = viewMode === 'month' ? 'month' : viewMode === 'week' ? 'week' : 'period';

  if (noMealsInPlan) {
    return (
      <div className="grocery-view">
        <div className="grocery-header">
          <h2 className="section-title">Grocery List</h2>
          <div className="grocery-month">{viewLabel}</div>
        </div>
        <p className="empty-state">No meals planned for this {scopeLabel} yet. Generate a plan on the Planner tab first.</p>
      </div>
    );
  }

  return (
    <div className="grocery-view">
      <div className="grocery-header">
        <div>
          <h2 className="section-title">Grocery List</h2>
          <div className="grocery-month">{rangeLabel}</div>
        </div>
        <div className="grocery-meta">
          <label className="serving-label">
            <span>Household size:</span>
            <input
              type="number"
              className="count-input"
              min={1}
              max={20}
              value={householdSize}
              onChange={e => onHouseholdSizeChange(Math.max(1, Number(e.target.value)))}
            />
            <span>people</span>
          </label>
          <span className="grocery-stat">{mealCount} meals</span>
          {totalItems > 0 && (
            <span className="grocery-stat">{totalItems} items</span>
          )}
          {checkedCount > 0 && (
            <span className="grocery-stat">{checkedCount}/{totalItems} checked</span>
          )}
          {missingMealNames.length > 0 && (
            <div className="grocery-missing-wrap">
              <button
                className="grocery-warn grocery-warn-btn"
                onClick={() => setShowMissingList(s => !s)}
                title="Click to see which meals are missing recipes"
              >
                {missingMealNames.length} missing recipe{missingMealNames.length !== 1 ? 's' : ''} {showMissingList ? '▲' : '▼'}
              </button>
              {showMissingList && (
                <div className="grocery-missing-list">
                  <div className="grocery-missing-title">Meals without recipes:</div>
                  {missingMealNames.map(name => (
                    <div key={name} className="grocery-missing-item">· {name}</div>
                  ))}
                  <div className="grocery-missing-hint">Add recipes in the Meals tab.</div>
                </div>
              )}
            </div>
          )}
          <div className="toolbar-dropdown-wrap">
            <button
              className={`btn-export btn-toolbar${showExport ? ' active' : ''}`}
              onClick={() => setShowExport(e => !e)}
            >
              ⬇ Export <span className="toolbar-caret">{showExport ? '▲' : '▼'}</span>
            </button>
            {showExport && (
              <div className="toolbar-dropdown export-dropdown">
                <button className="dropdown-item" onClick={() => { handleCopy(); setShowExport(false); }}>
                  ⎘ Copy to clipboard
                </button>
                <button className="dropdown-item" onClick={() => { handleDownload(); setShowExport(false); }}>
                  ⬇ Download .txt
                </button>
                <button className="dropdown-item" onClick={() => { handlePrint(); setShowExport(false); }}>
                  ⎙ Print
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grocery-range">
        <span className="filter-label grocery-scope-hint">
          Showing groceries for {scopeLabel}. Change the calendar view on the Planner tab to adjust scope.
        </span>
      </div>

      {mealCount === 0 ? (
        <p className="empty-state">No meals with recipes in this range. Adjust the range or add recipes in the Meals tab.</p>
      ) : (
        <>
          <div className="grocery-categories">
            {CATEGORY_ORDER.map(cat => {
              const items = byCategory[cat];
              if (!items?.length) return null;
              return (
                <div key={cat} className="grocery-category">
                  <h3 className="grocery-cat-title">{cat}</h3>
                  <div className="grocery-items">
                    {items.map(item => {
                      const checked = checkedSet.has(item.key);
                      const qtyStr = item.isOzBucket && item.canSum
                        ? formatOzAsWeight(item.qty)
                        : item.canSum ? formatQty(item.qty) : '';
                      const parts = item.isOzBucket
                        ? [qtyStr, item.name].filter(Boolean)
                        : [qtyStr, item.unit, item.name].filter(Boolean);
                      return (
                        <label key={item.key} className={`grocery-item${checked ? ' checked' : ''}`}>
                          <input type="checkbox" checked={checked} onChange={() => onToggleItem(planKey, item.key)} />
                          <span className="grocery-item-text">{parts.join(' ')}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {checkedCount > 0 && (
            <div className="grocery-footer">
              <button className="btn-sm" onClick={() => onClearChecked(planKey)}>
                Clear checked ({checkedCount})
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
