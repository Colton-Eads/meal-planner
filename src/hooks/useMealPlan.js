import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { reportError } from '../lib/toast';

export const EAT_OUT = 'EAT_OUT';
export const LEFTOVER = 'LEFTOVER';

const DEFAULT_CATEGORIES = ['Beef','Chicken','Pork','Seafood','Vegetarian','Other'];

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

// ── localStorage (only for things we explicitly chose to keep local) ────────
const LOCAL = {
  darkMode:       'home_dark_mode',
  activeProfile:  'home_active_profile',
  viewMode:       'home_view_mode',
  groceryChecked: (profileId) => `home_grocery_${profileId}`,
};

// ── Date helpers ─────────────────────────────────────────────────────────────

function startOfDay(d) { const x = new Date(d); x.setHours(0,0,0,0); return x; }
function startOfMonth(d) { return new Date(d.getFullYear(), d.getMonth(), 1); }
function startOfWeek(d) {
  // Sunday-anchored to match the existing month grid (US convention).
  const x = startOfDay(d);
  x.setDate(x.getDate() - x.getDay());
  return x;
}
function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
function dateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function loadLocal(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveLocal(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* quota / private mode */ }
}

// ── Plan generation (pure, unchanged) ───────────────────────────────────────

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Generates a plan over an explicit list of dates. Returns { dateKey: value }
// — keys are 'YYYY-MM-DD' strings so cross-month ranges work cleanly.
//
//   dates           — Date[] to generate for
//   eatOutCount     — number of eat-out nights to insert
//   sameNight       — if true, eat out happens on every visible day matching dayOfWeek
//   dayOfWeek       — 0=Sun..6=Sat
//   lockedKeySet    — Set of dateKey() strings that must keep existing values
//   existingByKey   — { dateKey: value } values to preserve for locked days
function generatePlanForDates(meals, dates, eatOutCount, sameNight, dayOfWeek, lockedKeySet, existingByKey) {
  const plan = {};
  // Carry over locked-day values verbatim
  for (const d of dates) {
    const k = dateKey(d);
    if (lockedKeySet.has(k) && existingByKey[k] !== undefined) plan[k] = existingByKey[k];
  }

  const unlocked = dates.filter(d => !lockedKeySet.has(dateKey(d)));

  let eatOutSet;
  if (sameNight) {
    eatOutSet = new Set(unlocked.filter(d => d.getDay() === dayOfWeek).map(dateKey));
  } else {
    eatOutSet = new Set(shuffle(unlocked).slice(0, eatOutCount).map(dateKey));
  }

  const mealDays = unlocked.filter(d => !eatOutSet.has(dateKey(d)));
  for (const d of unlocked) {
    if (eatOutSet.has(dateKey(d))) plan[dateKey(d)] = EAT_OUT;
  }

  if (meals.length === 0) {
    for (const d of mealDays) plan[dateKey(d)] = null;
    return plan;
  }

  const needed = mealDays.length;
  let pool;
  if (meals.length >= needed) {
    pool = shuffle(meals).slice(0, needed);
  } else {
    const passes = Math.min(3, Math.ceil(needed / meals.length));
    const expanded = [];
    for (let i = 0; i < passes; i++) expanded.push(...shuffle(meals));
    pool = shuffle(expanded).slice(0, needed);
  }

  mealDays.forEach((d, i) => { plan[dateKey(d)] = pool[i]?.id ?? null; });
  return plan;
}

// ── DB row → app shape conversions ───────────────────────────────────────────

function mealFromRow(row) {
  const hasAnyRecipeBit =
    !!(row.servings || row.prep_time || row.cook_time) ||
    (row.instructions && row.instructions.length > 0) ||
    (row.recipe_ingredients && row.recipe_ingredients.length > 0);

  return {
    id: row.id,
    name: row.name,
    category: row.category,
    tags: row.tags || [],
    recipe: hasAnyRecipeBit ? {
      servings: row.servings ?? '',
      prepTime: row.prep_time ?? '',
      cookTime: row.cook_time ?? '',
      ingredients: (row.recipe_ingredients || [])
        .slice()
        .sort((a, b) => a.position - b.position)
        .map(ri => ({
          quantity: ri.quantity ?? '',
          unit:     ri.unit ?? '',
          name:     ri.name,
        })),
      instructions: row.instructions || [],
    } : null,
  };
}

function ingredientFromRow(row) {
  return {
    id: row.id,
    name: row.name,
    defaultQty:  row.default_qty ?? '',
    defaultUnit: row.default_unit ?? '',
    altMeasure:  row.alt_measure ?? '',
    category:    row.category,
  };
}

function planRowsToMonthMap(rows) {
  // rows: [{year, month, day, meal_id, special}]
  const out = {};
  for (const r of rows) {
    const key = `${r.year}-${r.month}`;
    if (!out[key]) out[key] = {};
    out[key][r.day] = r.special ?? r.meal_id;
  }
  return out;
}

function lockedRowsToMonthMap(rows) {
  const out = {};
  for (const r of rows) {
    const key = `${r.year}-${r.month}`;
    if (!out[key]) out[key] = [];
    out[key].push(r.day);
  }
  return out;
}

// ── The hook ────────────────────────────────────────────────────────────────

export function useMealPlan() {
  const { user } = useAuth();

  // Profiles
  const [profiles, setProfiles] = useState([]);
  const [activeProfileId, setActiveProfileId] = useState(() => loadLocal(LOCAL.activeProfile, null));

  // Per-profile state (cached locally, kept in sync with DB)
  const [meals, setMeals] = useState([]);
  const [plansByMonth, setPlansByMonth] = useState({});
  const [lockedDaysByMonth, setLockedDaysByMonth] = useState({});
  const [settings, setSettings] = useState(null);
  const [ingredientLibrary, setIngredientLibrary] = useState([]);

  // Local-only state
  const [lastPlan, setLastPlan] = useState({});                          // undo, in-memory
  const [groceryChecked, setGroceryChecked] = useState({});              // localStorage
  const [darkMode, setDarkMode] = useState(() => loadLocal(LOCAL.darkMode, false));

  // Loading
  const [loading, setLoading] = useState(true);

  // Calendar view: viewMode + viewAnchor (Date). Anchor is the first day of
  // the visible range — first of month for 'month', Sunday of week for week/
  // biweek. Stepping prev/next adjusts the anchor by view size.
  const today = new Date();
  const [viewMode, setViewMode] = useState(() => loadLocal(LOCAL.viewMode, 'month'));
  const [viewAnchor, setViewAnchor] = useState(() => {
    const mode = loadLocal(LOCAL.viewMode, 'month');
    return mode === 'month' ? startOfMonth(today) : startOfWeek(today);
  });

  const changeViewMode = (mode) => {
    setViewMode(mode);
    saveLocal(LOCAL.viewMode, mode);
    // Re-anchor: keep the user looking at roughly the same time period.
    setViewAnchor(prev => mode === 'month' ? startOfMonth(prev) : startOfWeek(prev));
  };

  // viewYear/viewMonth are derived from the anchor's month — used by
  // GroceryList (still month-scoped) and the month-grid renderer.
  const viewYear = viewAnchor.getFullYear();
  const viewMonth = viewAnchor.getMonth();

  // ── Reload profile data on profile switch ───────────────────────────────
  // Not wrapped in useCallback: React Compiler memoizes for us, and useCallback
  // here was tripping preserve-manual-memoization with inferred async deps.
  // Declared before the initial-load effect so the effect can reference it
  // without a temporal dead zone.
  const loadProfileData = async (profileId) => {
    if (!profileId) return;
    const [mealsRes, plansRes, lockedRes, settingsRes, ingRes] = await Promise.all([
      supabase.from('meals')
        .select('*, recipe_ingredients(*)')
        .eq('profile_id', profileId)
        .order('created_at'),
      supabase.from('plans')
        .select('year, month, day, meal_id, special')
        .eq('profile_id', profileId),
      supabase.from('locked_days')
        .select('year, month, day')
        .eq('profile_id', profileId),
      supabase.from('profile_settings')
        .select('*')
        .eq('profile_id', profileId)
        .single(),
      supabase.from('ingredients')
        .select('*')
        .eq('profile_id', profileId)
        .order('name'),
    ]);

    if (mealsRes.error)    reportError('load meals',    mealsRes.error);
    if (plansRes.error)    reportError('load plans',    plansRes.error);
    if (lockedRes.error)   reportError('load locked',   lockedRes.error);
    if (settingsRes.error) reportError('load settings', settingsRes.error);
    if (ingRes.error)      reportError('load ings',     ingRes.error);

    setMeals((mealsRes.data ?? []).map(mealFromRow));
    setPlansByMonth(planRowsToMonthMap(plansRes.data ?? []));
    setLockedDaysByMonth(lockedRowsToMonthMap(lockedRes.data ?? []));
    setSettings(settingsRes.data ?? null);
    setIngredientLibrary((ingRes.data ?? []).map(ingredientFromRow));
    setGroceryChecked(loadLocal(LOCAL.groceryChecked(profileId), {}));
    setLastPlan({});
  };

  // ── Initial load: fetch profiles, pick active, then fetch profile data ──
  const didInitRef = useRef(false);
  useEffect(() => {
    if (!user || didInitRef.current) return;
    didInitRef.current = true;
    (async () => {
      const { data: profs, error } = await supabase
        .from('profiles')
        .select('id, name')
        .order('created_at');
      if (error) { reportError('load profiles', error); setLoading(false); return; }
      setProfiles(profs);

      // Pick active profile: stored preference if still valid, else first one
      const storedId = loadLocal(LOCAL.activeProfile, null);
      const valid = profs.find(p => p.id === storedId);
      const activeId = valid ? valid.id : profs[0]?.id;
      if (activeId) {
        setActiveProfileId(activeId);
        saveLocal(LOCAL.activeProfile, activeId);
        await loadProfileData(activeId);
      }
      setLoading(false);
    })();
  }, [user]);

  // ── Derived ──────────────────────────────────────────────────────────────
  const planKey      = `${viewYear}-${viewMonth}`;
  const currentPlan  = useMemo(() => plansByMonth[planKey] || {}, [plansByMonth, planKey]);
  const currentLocked = useMemo(() => new Set(lockedDaysByMonth[planKey] || []), [lockedDaysByMonth, planKey]);

  // Visible-range derivations (used by CalendarView).
  const visibleDays = useMemo(() => {
    if (viewMode === 'month') {
      const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
      return Array.from({ length: daysInMonth }, (_, i) => new Date(viewYear, viewMonth, i + 1));
    }
    const len = viewMode === 'biweek' ? 14 : 7;
    return Array.from({ length: len }, (_, i) => addDays(viewAnchor, i));
  }, [viewMode, viewAnchor, viewYear, viewMonth]);

  const visiblePlan = useMemo(() => {
    const out = {};
    for (const d of visibleDays) {
      const monthMap = plansByMonth[`${d.getFullYear()}-${d.getMonth()}`] || {};
      const v = monthMap[d.getDate()];
      if (v !== undefined) out[dateKey(d)] = v;
    }
    return out;
  }, [visibleDays, plansByMonth]);

  const visibleLocked = useMemo(() => {
    const set = new Set();
    for (const d of visibleDays) {
      const arr = lockedDaysByMonth[`${d.getFullYear()}-${d.getMonth()}`] || [];
      if (arr.includes(d.getDate())) set.add(dateKey(d));
    }
    return set;
  }, [visibleDays, lockedDaysByMonth]);

  const viewLabel = useMemo(() => {
    if (viewMode === 'month') return `${MONTH_NAMES[viewMonth]} ${viewYear}`;
    const first = visibleDays[0];
    const last  = visibleDays[visibleDays.length - 1];
    if (first.getFullYear() === last.getFullYear() && first.getMonth() === last.getMonth()) {
      return `${MONTH_NAMES[first.getMonth()]} ${first.getDate()} – ${last.getDate()}, ${first.getFullYear()}`;
    }
    if (first.getFullYear() === last.getFullYear()) {
      return `${MONTH_NAMES[first.getMonth()]} ${first.getDate()} – ${MONTH_NAMES[last.getMonth()]} ${last.getDate()}, ${first.getFullYear()}`;
    }
    return `${MONTH_NAMES[first.getMonth()]} ${first.getDate()}, ${first.getFullYear()} – ${MONTH_NAMES[last.getMonth()]} ${last.getDate()}, ${last.getFullYear()}`;
  }, [viewMode, viewMonth, viewYear, visibleDays]);

  const enabledCategories = settings?.enabled_categories ?? DEFAULT_CATEGORIES;
  const eatOutEnabled     = settings?.eatout_enabled ?? false;
  const eatOutCount       = settings?.eatout_count ?? 4;
  const eatOutSameNight   = settings?.eatout_same_night ?? false;
  const eatOutDayOfWeek   = settings?.eatout_dow ?? 5;
  const householdSize     = settings?.household_size ?? 4;

  const activeMeals = useMemo(
    () => meals.filter(m => enabledCategories.includes(m.category)),
    [meals, enabledCategories]
  );

  // Compat aliases for existing UI code
  const lockedDays = lockedDaysByMonth;

  // ── Profile management ──────────────────────────────────────────────────

  const addProfile = useCallback(async (name) => {
    const trimmed = (name || '').trim() || 'New Profile';
    const { data: prof, error } = await supabase
      .from('profiles')
      .insert({ user_id: user.id, name: trimmed })
      .select().single();
    if (error) { reportError('addProfile', error); return null; }
    await supabase.from('profile_settings').insert({ profile_id: prof.id });
    setProfiles(prev => [...prev, prof]);
    return prof.id;
  }, [user]);

  const deleteProfile = async (id) => {
    if (profiles.length <= 1) return;
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) { reportError('deleteProfile', error); return; }
    setProfiles(prev => prev.filter(p => p.id !== id));
    if (activeProfileId === id) {
      const next = profiles.find(p => p.id !== id);
      if (next) {
        setActiveProfileId(next.id);
        saveLocal(LOCAL.activeProfile, next.id);
        loadProfileData(next.id);
      }
    }
  };

  const renameProfile = useCallback(async (id, name) => {
    const trimmed = (name || '').trim();
    if (!trimmed) return;
    setProfiles(prev => prev.map(p => p.id === id ? { ...p, name: trimmed } : p));
    const { error } = await supabase.from('profiles').update({ name: trimmed }).eq('id', id);
    if (error) reportError('renameProfile', error);
  }, []);

  const switchProfile = (id) => {
    setActiveProfileId(id);
    saveLocal(LOCAL.activeProfile, id);
    setLoading(true);
    loadProfileData(id).finally(() => setLoading(false));
  };

  // ── Settings updates (single-row upsert) ────────────────────────────────

  const updateSettings = useCallback(async (patch) => {
    if (!activeProfileId) return;
    setSettings(prev => ({ ...(prev ?? {}), ...patch }));
    const { error } = await supabase.from('profile_settings').update(patch).eq('profile_id', activeProfileId);
    if (error) reportError('updateSettings', error);
  }, [activeProfileId]);

  const updateEatOutEnabled    = useCallback((v) => updateSettings({ eatout_enabled: v }),     [updateSettings]);
  const updateEatOutCount      = useCallback((v) => updateSettings({ eatout_count: v }),       [updateSettings]);
  const updateEatOutSameNight  = useCallback((v) => updateSettings({ eatout_same_night: v }),  [updateSettings]);
  const updateEatOutDayOfWeek  = useCallback((v) => updateSettings({ eatout_dow: v }),         [updateSettings]);
  const updateHouseholdSize    = useCallback((v) => updateSettings({ household_size: v }),     [updateSettings]);

  const toggleCategory = useCallback((category) => {
    const current = settings?.enabled_categories ?? DEFAULT_CATEGORIES;
    const next = current.includes(category) ? current.filter(c => c !== category) : [...current, category];
    updateSettings({ enabled_categories: next });
  }, [settings, updateSettings]);

  // Dark mode is local
  const updateDarkMode = useCallback((val) => {
    setDarkMode(val);
    saveLocal(LOCAL.darkMode, val);
  }, []);

  // ── Meal library ────────────────────────────────────────────────────────

  const addMeal = useCallback(async (name, category, tags = []) => {
    if (!activeProfileId) return;
    const { data, error } = await supabase
      .from('meals')
      .insert({ profile_id: activeProfileId, name: name.trim(), category, tags })
      .select('*, recipe_ingredients(*)').single();
    if (error) { reportError('addMeal', error); return; }
    setMeals(prev => [...prev, mealFromRow(data)]);
  }, [activeProfileId]);

  const addMeals = useCallback(async (newMeals) => {
    if (!activeProfileId || !newMeals?.length) return;
    const rows = newMeals.map(m => ({
      profile_id: activeProfileId,
      name: m.name.trim(),
      category: m.category,
      tags: m.tags ?? [],
    }));
    const { data, error } = await supabase
      .from('meals')
      .insert(rows)
      .select('*, recipe_ingredients(*)');
    if (error) { reportError('addMeals', error); return; }
    setMeals(prev => [...prev, ...data.map(mealFromRow)]);
  }, [activeProfileId]);

  const deleteMeal = useCallback(async (id) => {
    setMeals(prev => prev.filter(m => m.id !== id));
    // ON DELETE CASCADE on plans.meal_id wipes plan rows; refetch this month's plan
    const { error } = await supabase.from('meals').delete().eq('id', id);
    if (error) {
      reportError('deleteMeal', error);
      return;
    }
    // Plan cache might have stale references in any month — drop entries that pointed to this meal
    setPlansByMonth(prev => {
      const next = {};
      for (const [k, days] of Object.entries(prev)) {
        const cleaned = {};
        for (const [d, v] of Object.entries(days)) {
          if (v !== id) cleaned[d] = v;
        }
        next[k] = cleaned;
      }
      return next;
    });
  }, []);

  const editMeal = useCallback(async (id, name, category, tags) => {
    const patch = { name: name.trim(), category, tags: tags ?? [] };
    setMeals(prev => prev.map(m => m.id === id ? { ...m, ...patch } : m));
    const { error } = await supabase.from('meals').update(patch).eq('id', id);
    if (error) reportError('editMeal', error);
  }, []);

  const updateMealRecipe = useCallback(async (id, recipe) => {
    // recipe shape: { servings, prepTime, cookTime, ingredients: [...], instructions: [...] }
    setMeals(prev => prev.map(m => m.id === id ? { ...m, recipe } : m));

    const metaPatch = {
      servings:     recipe.servings || null,
      prep_time:    recipe.prepTime || null,
      cook_time:    recipe.cookTime || null,
      instructions: recipe.instructions ?? [],
    };
    const { error: e1 } = await supabase.from('meals').update(metaPatch).eq('id', id);
    if (e1) { reportError('updateMealRecipe meta', e1); return; }

    // Replace recipe_ingredients: delete then insert
    const { error: e2 } = await supabase.from('recipe_ingredients').delete().eq('meal_id', id);
    if (e2) { reportError('updateMealRecipe wipe', e2); return; }

    const rows = (recipe.ingredients ?? [])
      .filter(ing => (ing.name ?? '').trim())
      .map((ing, idx) => ({
        meal_id:  id,
        position: idx,
        quantity: ing.quantity || null,
        unit:     ing.unit || null,
        name:     ing.name.trim(),
      }));
    if (rows.length) {
      const { error: e3 } = await supabase.from('recipe_ingredients').insert(rows);
      if (e3) reportError('updateMealRecipe insert', e3);
    }
  }, []);

  const updateMealRecipes = useCallback(async (updates) => {
    // updates: Array<{ id, recipe }> — used by bulk import
    for (const u of updates) {
      // sequential to avoid concurrent ingredient swaps stomping each other
      await updateMealRecipe(u.id, u.recipe);
    }
  }, [updateMealRecipe]);

  // ── Ingredient library ──────────────────────────────────────────────────

  const addLibIngredient = useCallback(async (entry) => {
    if (!activeProfileId) return;
    const row = {
      profile_id:    activeProfileId,
      name:          entry.name,
      default_qty:   entry.defaultQty || null,
      default_unit:  entry.defaultUnit || null,
      alt_measure:   entry.altMeasure || null,
      category:      entry.category || 'Pantry',
    };
    const { data, error } = await supabase.from('ingredients').insert(row).select().single();
    if (error) { reportError('addLibIngredient', error); return; }
    setIngredientLibrary(prev => [...prev, ingredientFromRow(data)]);
  }, [activeProfileId]);

  const editLibIngredient = useCallback(async (id, updates) => {
    const dbPatch = {};
    if ('name' in updates)         dbPatch.name = updates.name;
    if ('defaultQty' in updates)   dbPatch.default_qty = updates.defaultQty || null;
    if ('defaultUnit' in updates)  dbPatch.default_unit = updates.defaultUnit || null;
    if ('altMeasure' in updates)   dbPatch.alt_measure = updates.altMeasure || null;
    if ('category' in updates)     dbPatch.category = updates.category;

    setIngredientLibrary(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
    const { error } = await supabase.from('ingredients').update(dbPatch).eq('id', id);
    if (error) reportError('editLibIngredient', error);
  }, []);

  const deleteLibIngredient = useCallback(async (id) => {
    setIngredientLibrary(prev => prev.filter(i => i.id !== id));
    const { error } = await supabase.from('ingredients').delete().eq('id', id);
    if (error) reportError('deleteLibIngredient', error);
  }, []);

  // ── Plan actions ────────────────────────────────────────────────────────
  // All take a Date so they work across month boundaries (e.g. a week view
  // spanning Mar 30 → Apr 5).

  const writeDay = useCallback(async (year, month, day, value) => {
    if (!activeProfileId) return;
    if (value === null || value === undefined) {
      const { error } = await supabase.from('plans').delete()
        .eq('profile_id', activeProfileId).eq('year', year).eq('month', month).eq('day', day);
      if (error) reportError('writeDay delete', error);
      return;
    }
    const row = {
      profile_id: activeProfileId,
      year, month, day,
      meal_id: (value === EAT_OUT || value === LEFTOVER) ? null : value,
      special: (value === EAT_OUT || value === LEFTOVER) ? value : null,
    };
    const { error } = await supabase.from('plans').upsert(row);
    if (error) reportError('writeDay upsert', error);
  }, [activeProfileId]);

  const setPlanCacheDate = useCallback((date, value) => {
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const day = date.getDate();
    setPlansByMonth(prev => {
      const monthMap = { ...(prev[key] || {}) };
      if (value === null || value === undefined) delete monthMap[day];
      else monthMap[day] = value;
      return { ...prev, [key]: monthMap };
    });
  }, []);

  const getPlanValueForDate = (date) => {
    const monthMap = plansByMonth[`${date.getFullYear()}-${date.getMonth()}`] || {};
    return monthMap[date.getDate()];
  };

  const reassignDay = useCallback((date, mealId) => {
    const id = mealId !== undefined ? mealId : (activeMeals.length > 0 ? pickRandom(activeMeals).id : null);
    setPlanCacheDate(date, id);
    writeDay(date.getFullYear(), date.getMonth(), date.getDate(), id);
  }, [activeMeals, setPlanCacheDate, writeDay]);

  const swapDays = useCallback((dateA, dateB) => {
    const a = getPlanValueForDate(dateA) ?? null;
    const b = getPlanValueForDate(dateB) ?? null;
    setPlanCacheDate(dateA, b);
    setPlanCacheDate(dateB, a);
    writeDay(dateA.getFullYear(), dateA.getMonth(), dateA.getDate(), b);
    writeDay(dateB.getFullYear(), dateB.getMonth(), dateB.getDate(), a);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plansByMonth, setPlanCacheDate, writeDay]);

  const toggleEatOut = useCallback((date) => {
    const current = getPlanValueForDate(date);
    const next = current === EAT_OUT
      ? (activeMeals.length > 0 ? pickRandom(activeMeals).id : null)
      : EAT_OUT;
    setPlanCacheDate(date, next);
    writeDay(date.getFullYear(), date.getMonth(), date.getDate(), next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plansByMonth, activeMeals, setPlanCacheDate, writeDay]);

  const toggleLeftover = useCallback((date) => {
    const current = getPlanValueForDate(date);
    const next = current === LEFTOVER
      ? (activeMeals.length > 0 ? pickRandom(activeMeals).id : null)
      : LEFTOVER;
    setPlanCacheDate(date, next);
    writeDay(date.getFullYear(), date.getMonth(), date.getDate(), next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plansByMonth, activeMeals, setPlanCacheDate, writeDay]);

  const clearDay = useCallback((date) => {
    setPlanCacheDate(date, null);
    writeDay(date.getFullYear(), date.getMonth(), date.getDate(), null);
  }, [setPlanCacheDate, writeDay]);

  // Groups an array of dates by month key for batched DB operations.
  const groupByMonth = (dates) => {
    const out = {};
    for (const d of dates) {
      const k = `${d.getFullYear()}-${d.getMonth()}`;
      if (!out[k]) out[k] = { year: d.getFullYear(), month: d.getMonth(), days: [] };
      out[k].days.push(d.getDate());
    }
    return out;
  };

  const regenerate = useCallback(async () => {
    if (!activeProfileId || activeMeals.length === 0 || visibleDays.length === 0) return;
    const count = eatOutEnabled ? eatOutCount : 0;

    // Snapshot the visible range's current values for undo (per-date keys).
    const snapshot = {};
    for (const d of visibleDays) {
      const v = (plansByMonth[`${d.getFullYear()}-${d.getMonth()}`] || {})[d.getDate()];
      if (v !== undefined) snapshot[dateKey(d)] = v;
    }

    const lockedKeys = new Set();
    for (const d of visibleDays) if (visibleLocked.has(dateKey(d))) lockedKeys.add(dateKey(d));

    const newByKey = generatePlanForDates(
      activeMeals, visibleDays, count,
      eatOutEnabled && eatOutSameNight, eatOutDayOfWeek,
      lockedKeys, snapshot
    );

    // Optimistic local cache update — merge each new key into plansByMonth.
    setLastPlan(prev => ({ ...prev, [`__range_${dateKey(visibleDays[0])}_${dateKey(visibleDays[visibleDays.length - 1])}`]: snapshot }));
    setPlansByMonth(prev => {
      const next = { ...prev };
      for (const d of visibleDays) {
        const mk = `${d.getFullYear()}-${d.getMonth()}`;
        const monthMap = { ...(next[mk] || {}) };
        const v = newByKey[dateKey(d)];
        if (v === null || v === undefined) delete monthMap[d.getDate()];
        else monthMap[d.getDate()] = v;
        next[mk] = monthMap;
      }
      return next;
    });

    // DB: delete all unlocked visible days (per-month batched), then insert.
    const unlockedVisibleDates = visibleDays.filter(d => !visibleLocked.has(dateKey(d)));
    const byMonth = groupByMonth(unlockedVisibleDates);
    for (const { year, month, days } of Object.values(byMonth)) {
      const { error } = await supabase.from('plans').delete()
        .eq('profile_id', activeProfileId).eq('year', year).eq('month', month).in('day', days);
      if (error) { reportError('regenerate delete', error); return; }
    }

    const insertRows = visibleDays
      .filter(d => !visibleLocked.has(dateKey(d)))
      .map(d => ({ d, v: newByKey[dateKey(d)] }))
      .filter(x => x.v !== null && x.v !== undefined)
      .map(({ d, v }) => ({
        profile_id: activeProfileId,
        year: d.getFullYear(), month: d.getMonth(), day: d.getDate(),
        meal_id: (v === EAT_OUT || v === LEFTOVER) ? null : v,
        special: (v === EAT_OUT || v === LEFTOVER) ? v : null,
      }));
    if (insertRows.length) {
      const { error } = await supabase.from('plans').insert(insertRows);
      if (error) reportError('regenerate insert', error);
    }
  }, [activeProfileId, activeMeals, eatOutEnabled, eatOutCount, eatOutSameNight, eatOutDayOfWeek,
      visibleDays, visibleLocked, plansByMonth]);

  // Undo key matches what regenerate wrote — anchored on the visible range
  // at the time. If the user changes view mode/anchor between regenerate and
  // undo, the undo button won't show (canUndo below is false).
  const undoKey = visibleDays.length > 0
    ? `__range_${dateKey(visibleDays[0])}_${dateKey(visibleDays[visibleDays.length - 1])}`
    : null;
  const canUndo = !!(undoKey && lastPlan[undoKey]);

  const undoRegenerate = useCallback(async () => {
    if (!activeProfileId || !undoKey || !lastPlan[undoKey]) return;
    const restored = lastPlan[undoKey];

    setPlansByMonth(prev => {
      const next = { ...prev };
      for (const d of visibleDays) {
        const mk = `${d.getFullYear()}-${d.getMonth()}`;
        const monthMap = { ...(next[mk] || {}) };
        const v = restored[dateKey(d)];
        if (v === null || v === undefined) delete monthMap[d.getDate()];
        else monthMap[d.getDate()] = v;
        next[mk] = monthMap;
      }
      return next;
    });
    setLastPlan(prev => { const n = { ...prev }; delete n[undoKey]; return n; });

    // Wipe visible range, refill with restored.
    const byMonth = groupByMonth(visibleDays);
    for (const { year, month, days } of Object.values(byMonth)) {
      const { error } = await supabase.from('plans').delete()
        .eq('profile_id', activeProfileId).eq('year', year).eq('month', month).in('day', days);
      if (error) { reportError('undo delete', error); return; }
    }
    const insertRows = visibleDays
      .map(d => ({ d, v: restored[dateKey(d)] }))
      .filter(x => x.v !== null && x.v !== undefined)
      .map(({ d, v }) => ({
        profile_id: activeProfileId,
        year: d.getFullYear(), month: d.getMonth(), day: d.getDate(),
        meal_id: (v === EAT_OUT || v === LEFTOVER) ? null : v,
        special: (v === EAT_OUT || v === LEFTOVER) ? v : null,
      }));
    if (insertRows.length) {
      const { error } = await supabase.from('plans').insert(insertRows);
      if (error) reportError('undo insert', error);
    }
  }, [activeProfileId, undoKey, lastPlan, visibleDays]);

  // ── Locked days ─────────────────────────────────────────────────────────

  const toggleLockDay = useCallback(async (date) => {
    if (!activeProfileId) return;
    const y = date.getFullYear(), m = date.getMonth(), d = date.getDate();
    const monthKey = `${y}-${m}`;
    const arr = lockedDaysByMonth[monthKey] || [];
    const isLocked = arr.includes(d);
    const nextArr = isLocked ? arr.filter(x => x !== d) : [...arr, d];
    setLockedDaysByMonth(prev => ({ ...prev, [monthKey]: nextArr }));

    if (isLocked) {
      const { error } = await supabase.from('locked_days').delete()
        .eq('profile_id', activeProfileId).eq('year', y).eq('month', m).eq('day', d);
      if (error) reportError('unlock day', error);
    } else {
      const { error } = await supabase.from('locked_days')
        .insert({ profile_id: activeProfileId, year: y, month: m, day: d });
      if (error) reportError('lock day', error);
    }
  }, [activeProfileId, lockedDaysByMonth]);

  // ── Grocery checked (local-only) ────────────────────────────────────────

  const toggleGroceryItem = useCallback((monthKey, itemKey) => {
    setGroceryChecked(prev => {
      const keys = new Set(prev[monthKey] || []);
      if (keys.has(itemKey)) keys.delete(itemKey); else keys.add(itemKey);
      const next = { ...prev, [monthKey]: [...keys] };
      saveLocal(LOCAL.groceryChecked(activeProfileId), next);
      return next;
    });
  }, [activeProfileId]);

  const clearGroceryChecked = useCallback((monthKey) => {
    setGroceryChecked(prev => {
      const next = { ...prev, [monthKey]: [] };
      saveLocal(LOCAL.groceryChecked(activeProfileId), next);
      return next;
    });
  }, [activeProfileId]);

  // ── Navigation ──────────────────────────────────────────────────────────
  // Step direction depends on view mode: 1 month, 1 week, or 2 weeks.

  const step = (sign) => {
    setViewAnchor(prev => {
      if (viewMode === 'month') return new Date(prev.getFullYear(), prev.getMonth() + sign, 1);
      const days = viewMode === 'biweek' ? 14 : 7;
      return addDays(prev, sign * days);
    });
  };
  const prevMonth = () => step(-1);  // name kept for component-API compatibility
  const nextMonth = () => step(1);
  const goToToday = () => {
    setViewAnchor(viewMode === 'month' ? startOfMonth(today) : startOfWeek(today));
  };

  return {
    loading,
    // Profile
    profiles, activeProfileId,
    addProfile, deleteProfile, renameProfile, switchProfile,
    // Meal data
    meals, activeMeals, currentPlan, viewYear, viewMonth, planKey,
    eatOutEnabled, eatOutCount, eatOutSameNight, eatOutDayOfWeek,
    householdSize, groceryChecked,
    currentLocked, lockedDays,
    enabledCategories, darkMode,
    canUndo,
    // View mode + visible range (for CalendarView)
    viewMode, setViewMode: changeViewMode,
    visibleDays, visiblePlan, visibleLocked, viewLabel,
    // Plan actions (Date-based)
    regenerate, undoRegenerate,
    reassignDay, swapDays,
    toggleEatOut, toggleLeftover, clearDay,
    toggleLockDay, toggleCategory, updateDarkMode,
    goToToday,
    // Meal library actions
    addMeal, addMeals, deleteMeal, editMeal, updateMealRecipe, updateMealRecipes,
    // Ingredient library
    ingredientLibrary, addLibIngredient, editLibIngredient, deleteLibIngredient,
    // Grocery actions
    updateHouseholdSize, toggleGroceryItem, clearGroceryChecked,
    // Navigation
    prevMonth, nextMonth,
    // Eat-out settings
    updateEatOutEnabled, updateEatOutCount,
    updateEatOutSameNight, updateEatOutDayOfWeek,
  };
}
