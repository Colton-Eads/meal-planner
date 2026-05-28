import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export const EAT_OUT = 'EAT_OUT';
export const LEFTOVER = 'LEFTOVER';

const DEFAULT_CATEGORIES = ['Beef','Chicken','Pork','Seafood','Vegetarian','Other'];

// ── localStorage (only for things we explicitly chose to keep local) ────────
const LOCAL = {
  darkMode:       'home_dark_mode',
  activeProfile:  'home_active_profile',
  groceryChecked: (profileId) => `home_grocery_${profileId}`,
};

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

function weekdayOccurrences(year, month, dow) {
  const days = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    if (new Date(year, month, d).getDay() === dow) days.push(d);
  }
  return days;
}

function generatePlan(meals, year, month, eatOutCount = 0, sameNight = false, dayOfWeek = 5, lockedValues = {}) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const lockedDayNums = new Set(Object.keys(lockedValues).map(Number));

  let eatOutDays;
  if (sameNight) {
    eatOutDays = new Set(weekdayOccurrences(year, month, dayOfWeek).filter(d => !lockedDayNums.has(d)));
  } else {
    const available = shuffle(
      Array.from({ length: daysInMonth }, (_, i) => i + 1).filter(d => !lockedDayNums.has(d))
    );
    eatOutDays = new Set(available.slice(0, eatOutCount));
  }

  const mealDays = [];
  const plan = { ...lockedValues };
  for (let d = 1; d <= daysInMonth; d++) {
    if (lockedDayNums.has(d)) continue;
    if (eatOutDays.has(d)) plan[d] = EAT_OUT;
    else mealDays.push(d);
  }

  if (meals.length === 0) {
    for (const d of mealDays) plan[d] = null;
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

  mealDays.forEach((d, i) => { plan[d] = pool[i]?.id ?? null; });
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

  // Calendar view
  const today = new Date();
  const [viewYear, setViewYear]   = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

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

    if (mealsRes.error)    console.error('load meals',    mealsRes.error);
    if (plansRes.error)    console.error('load plans',    plansRes.error);
    if (lockedRes.error)   console.error('load locked',   lockedRes.error);
    if (settingsRes.error) console.error('load settings', settingsRes.error);
    if (ingRes.error)      console.error('load ings',     ingRes.error);

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
      if (error) { console.error('load profiles', error); setLoading(false); return; }
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
    if (error) { console.error('addProfile', error); return null; }
    await supabase.from('profile_settings').insert({ profile_id: prof.id });
    setProfiles(prev => [...prev, prof]);
    return prof.id;
  }, [user]);

  const deleteProfile = async (id) => {
    if (profiles.length <= 1) return;
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) { console.error('deleteProfile', error); return; }
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
    if (error) console.error('renameProfile', error);
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
    if (error) console.error('updateSettings', error);
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
    if (error) { console.error('addMeal', error); return; }
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
    if (error) { console.error('addMeals', error); return; }
    setMeals(prev => [...prev, ...data.map(mealFromRow)]);
  }, [activeProfileId]);

  const deleteMeal = useCallback(async (id) => {
    setMeals(prev => prev.filter(m => m.id !== id));
    // ON DELETE CASCADE on plans.meal_id wipes plan rows; refetch this month's plan
    const { error } = await supabase.from('meals').delete().eq('id', id);
    if (error) {
      console.error('deleteMeal', error);
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
    if (error) console.error('editMeal', error);
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
    if (e1) { console.error('updateMealRecipe meta', e1); return; }

    // Replace recipe_ingredients: delete then insert
    const { error: e2 } = await supabase.from('recipe_ingredients').delete().eq('meal_id', id);
    if (e2) { console.error('updateMealRecipe wipe', e2); return; }

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
      if (e3) console.error('updateMealRecipe insert', e3);
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
    if (error) { console.error('addLibIngredient', error); return; }
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
    if (error) console.error('editLibIngredient', error);
  }, []);

  const deleteLibIngredient = useCallback(async (id) => {
    setIngredientLibrary(prev => prev.filter(i => i.id !== id));
    const { error } = await supabase.from('ingredients').delete().eq('id', id);
    if (error) console.error('deleteLibIngredient', error);
  }, []);

  // ── Plan actions ────────────────────────────────────────────────────────

  // Write a single day's value (meal_id, special, or null=clear)
  const writeDay = useCallback(async (year, month, day, value) => {
    if (!activeProfileId) return;
    if (value === null || value === undefined) {
      const { error } = await supabase.from('plans').delete()
        .eq('profile_id', activeProfileId).eq('year', year).eq('month', month).eq('day', day);
      if (error) console.error('writeDay delete', error);
      return;
    }
    const row = {
      profile_id: activeProfileId,
      year, month, day,
      meal_id: (value === EAT_OUT || value === LEFTOVER) ? null : value,
      special: (value === EAT_OUT || value === LEFTOVER) ? value : null,
    };
    const { error } = await supabase.from('plans').upsert(row);
    if (error) console.error('writeDay upsert', error);
  }, [activeProfileId]);

  const setPlanCacheDay = useCallback((day, value) => {
    setPlansByMonth(prev => {
      const monthMap = { ...(prev[planKey] || {}) };
      if (value === null || value === undefined) delete monthMap[day];
      else monthMap[day] = value;
      return { ...prev, [planKey]: monthMap };
    });
  }, [planKey]);

  const reassignDay = useCallback((day, mealId) => {
    const id = mealId !== undefined ? mealId : (activeMeals.length > 0 ? pickRandom(activeMeals).id : null);
    setPlanCacheDay(day, id);
    writeDay(viewYear, viewMonth, day, id);
  }, [activeMeals, viewYear, viewMonth, setPlanCacheDay, writeDay]);

  const swapDays = useCallback((dayA, dayB) => {
    const a = currentPlan[dayA] ?? null;
    const b = currentPlan[dayB] ?? null;
    setPlanCacheDay(dayA, b);
    setPlanCacheDay(dayB, a);
    writeDay(viewYear, viewMonth, dayA, b);
    writeDay(viewYear, viewMonth, dayB, a);
  }, [currentPlan, viewYear, viewMonth, setPlanCacheDay, writeDay]);

  const toggleEatOut = useCallback((day) => {
    const current = currentPlan[day];
    const next = current === EAT_OUT
      ? (activeMeals.length > 0 ? pickRandom(activeMeals).id : null)
      : EAT_OUT;
    setPlanCacheDay(day, next);
    writeDay(viewYear, viewMonth, day, next);
  }, [currentPlan, activeMeals, viewYear, viewMonth, setPlanCacheDay, writeDay]);

  const toggleLeftover = useCallback((day) => {
    const current = currentPlan[day];
    const next = current === LEFTOVER
      ? (activeMeals.length > 0 ? pickRandom(activeMeals).id : null)
      : LEFTOVER;
    setPlanCacheDay(day, next);
    writeDay(viewYear, viewMonth, day, next);
  }, [currentPlan, activeMeals, viewYear, viewMonth, setPlanCacheDay, writeDay]);

  const clearDay = useCallback((day) => {
    setPlanCacheDay(day, null);
    writeDay(viewYear, viewMonth, day, null);
  }, [viewYear, viewMonth, setPlanCacheDay, writeDay]);

  const regenerate = useCallback(async () => {
    if (!activeProfileId || activeMeals.length === 0) return;
    const count = eatOutEnabled ? eatOutCount : 0;
    const lockedArr = lockedDaysByMonth[planKey] || [];
    const lockedValues = {};
    lockedArr.forEach(d => { lockedValues[d] = currentPlan[d] ?? null; });

    const newMonthPlan = generatePlan(
      activeMeals, viewYear, viewMonth, count,
      eatOutEnabled && eatOutSameNight, eatOutDayOfWeek, lockedValues
    );

    setLastPlan(prev => ({ ...prev, [planKey]: currentPlan }));
    setPlansByMonth(prev => ({ ...prev, [planKey]: newMonthPlan }));

    // DB: delete all unlocked days for this month, then upsert the new ones
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const lockedSet = new Set(lockedArr);
    const daysToDelete = Array.from({ length: daysInMonth }, (_, i) => i + 1).filter(d => !lockedSet.has(d));

    const { error: delErr } = await supabase.from('plans').delete()
      .eq('profile_id', activeProfileId).eq('year', viewYear).eq('month', viewMonth)
      .in('day', daysToDelete);
    if (delErr) { console.error('regenerate delete', delErr); return; }

    const insertRows = Object.entries(newMonthPlan)
      .filter(([d, v]) => v !== null && v !== undefined && !lockedSet.has(+d))
      .map(([d, v]) => ({
        profile_id: activeProfileId,
        year: viewYear, month: viewMonth, day: +d,
        meal_id: (v === EAT_OUT || v === LEFTOVER) ? null : v,
        special: (v === EAT_OUT || v === LEFTOVER) ? v : null,
      }));

    if (insertRows.length) {
      const { error: insErr } = await supabase.from('plans').insert(insertRows);
      if (insErr) console.error('regenerate insert', insErr);
    }
  }, [activeProfileId, activeMeals, eatOutEnabled, eatOutCount, eatOutSameNight, eatOutDayOfWeek,
      viewYear, viewMonth, planKey, lockedDaysByMonth, currentPlan]);

  const undoRegenerate = useCallback(async () => {
    if (!activeProfileId || !lastPlan[planKey]) return;
    const restored = lastPlan[planKey];
    setPlansByMonth(prev => ({ ...prev, [planKey]: restored }));
    setLastPlan(prev => { const n = { ...prev }; delete n[planKey]; return n; });

    // Wipe and refill this month's plans to match restored state
    const { error: delErr } = await supabase.from('plans').delete()
      .eq('profile_id', activeProfileId).eq('year', viewYear).eq('month', viewMonth);
    if (delErr) { console.error('undo delete', delErr); return; }

    const insertRows = Object.entries(restored)
      .filter(([, v]) => v !== null && v !== undefined)
      .map(([d, v]) => ({
        profile_id: activeProfileId,
        year: viewYear, month: viewMonth, day: +d,
        meal_id: (v === EAT_OUT || v === LEFTOVER) ? null : v,
        special: (v === EAT_OUT || v === LEFTOVER) ? v : null,
      }));
    if (insertRows.length) {
      const { error: insErr } = await supabase.from('plans').insert(insertRows);
      if (insErr) console.error('undo insert', insErr);
    }
  }, [activeProfileId, lastPlan, planKey, viewYear, viewMonth]);

  const canUndo = !!lastPlan[planKey];

  // ── Locked days ─────────────────────────────────────────────────────────

  const toggleLockDay = useCallback(async (day) => {
    if (!activeProfileId) return;
    const arr = lockedDaysByMonth[planKey] || [];
    const isLocked = arr.includes(day);
    const nextArr = isLocked ? arr.filter(d => d !== day) : [...arr, day];
    setLockedDaysByMonth(prev => ({ ...prev, [planKey]: nextArr }));

    if (isLocked) {
      const { error } = await supabase.from('locked_days').delete()
        .eq('profile_id', activeProfileId).eq('year', viewYear).eq('month', viewMonth).eq('day', day);
      if (error) console.error('unlock day', error);
    } else {
      const { error } = await supabase.from('locked_days')
        .insert({ profile_id: activeProfileId, year: viewYear, month: viewMonth, day });
      if (error) console.error('lock day', error);
    }
  }, [activeProfileId, lockedDaysByMonth, planKey, viewYear, viewMonth]);

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

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
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
    // Plan actions
    regenerate, undoRegenerate,
    reassignDay, swapDays,
    toggleEatOut, toggleLeftover, clearDay,
    toggleLockDay, toggleCategory, updateDarkMode,
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
