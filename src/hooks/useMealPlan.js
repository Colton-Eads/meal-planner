import { useState, useCallback, useEffect, useRef } from 'react';
import { DEFAULT_MEALS } from '../data/meals';
import { RECIPE_DATA } from '../data/recipes';
import { INGREDIENT_SEED } from '../data/ingredientSeed';

function seedRecipes(meals) {
  let changed = false;
  const result = meals.map(m => {
    if (!m.recipe && RECIPE_DATA[m.id]) {
      changed = true;
      return { ...m, recipe: RECIPE_DATA[m.id] };
    }
    return m;
  });
  return changed ? result : meals;
}

export const EAT_OUT = 'EAT_OUT';
export const LEFTOVER = 'LEFTOVER';

// ── Storage helpers ──────────────────────────────────────────────────────────

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ── Global keys (not per-profile) ───────────────────────────────────────────

const GLOBAL = {
  profiles:      'emp_profiles',
  activeProfile: 'emp_active_profile',
  darkMode:      'emp_dark_mode',
};

// ── Profile-scoped key factory ───────────────────────────────────────────────

function pk(profileId, suffix) {
  return `emp_${profileId}_${suffix}`;
}

// ── One-time migration from old flat keys → profile-scoped ──────────────────
// Returns the active profile ID to use on first load.

function migrateAndGetActiveId() {
  if (localStorage.getItem(GLOBAL.profiles) !== null) {
    return load(GLOBAL.activeProfile, 'default');
  }

  // First run: create "default" profile and copy old flat-key data.
  const profiles = [{ id: 'default', name: 'Family' }];
  save(GLOBAL.profiles, profiles);
  save(GLOBAL.activeProfile, 'default');

  const migrations = [
    ['emp_meals',               'meals'],
    ['emp_plan',                'plan'],
    ['emp_eatout_enabled',      'eatout_enabled'],
    ['emp_eatout_count',        'eatout_count'],
    ['emp_eatout_same_night',   'eatout_same_night'],
    ['emp_eatout_dow',          'eatout_dow'],
    ['emp_household_size',      'household_size'],
    ['emp_grocery_checked',     'grocery_checked'],
    ['emp_locked_days',         'locked_days'],
    ['emp_enabled_categories',  'enabled_categories'],
  ];
  for (const [oldKey, suffix] of migrations) {
    const val = localStorage.getItem(oldKey);
    if (val !== null) localStorage.setItem(pk('default', suffix), val);
  }

  return 'default';
}

// ── Plan generation helpers ──────────────────────────────────────────────────

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

// ── The hook ─────────────────────────────────────────────────────────────────

export function useMealPlan() {
  // ── Profiles ────────────────────────────────────────────────────────────────
  const [profiles, setProfiles] = useState(() => {
    migrateAndGetActiveId(); // runs migration side-effect on first call
    return load(GLOBAL.profiles, [{ id: 'default', name: 'Family' }]);
  });
  const [activeProfileId, setActiveProfileId] = useState(() => migrateAndGetActiveId());

  // ── Per-profile state (initialised for the default profile on mount) ────────
  const [meals, setMeals] = useState(() => {
    const id = load(GLOBAL.activeProfile, 'default');
    const loaded = load(pk(id, 'meals'), DEFAULT_MEALS);
    const seeded = seedRecipes(loaded);
    if (seeded !== loaded) save(pk(id, 'meals'), seeded);
    return seeded;
  });
  const [plan, setPlan] = useState(() => {
    const id = load(GLOBAL.activeProfile, 'default');
    return load(pk(id, 'plan'), {});
  });
  const [lastPlan, setLastPlan] = useState({});
  const [eatOutEnabled, setEatOutEnabled] = useState(() => {
    const id = load(GLOBAL.activeProfile, 'default');
    return load(pk(id, 'eatout_enabled'), false);
  });
  const [eatOutCount, setEatOutCount] = useState(() => {
    const id = load(GLOBAL.activeProfile, 'default');
    return load(pk(id, 'eatout_count'), 4);
  });
  const [eatOutSameNight, setEatOutSameNight] = useState(() => {
    const id = load(GLOBAL.activeProfile, 'default');
    return load(pk(id, 'eatout_same_night'), false);
  });
  const [eatOutDayOfWeek, setEatOutDayOfWeek] = useState(() => {
    const id = load(GLOBAL.activeProfile, 'default');
    return load(pk(id, 'eatout_dow'), 5);
  });
  const [householdSize, setHouseholdSize] = useState(() => {
    const id = load(GLOBAL.activeProfile, 'default');
    return load(pk(id, 'household_size'), 4);
  });
  const [groceryChecked, setGroceryChecked] = useState(() => {
    const id = load(GLOBAL.activeProfile, 'default');
    return load(pk(id, 'grocery_checked'), {});
  });
  const [lockedDays, setLockedDays] = useState(() => {
    const id = load(GLOBAL.activeProfile, 'default');
    return load(pk(id, 'locked_days'), {});
  });
  const [enabledCategories, setEnabledCategories] = useState(() => {
    const id = load(GLOBAL.activeProfile, 'default');
    return load(pk(id, 'enabled_categories'), ['Beef', 'Chicken', 'Pork', 'Seafood', 'Vegetarian', 'Other']);
  });
  const [ingredientLibrary, setIngredientLibrary] = useState(() => {
    const id = load(GLOBAL.activeProfile, 'default');
    return load(pk(id, 'ing_library'), INGREDIENT_SEED);
  });

  // Dark mode is global (not per-profile)
  const [darkMode, setDarkMode] = useState(() => load(GLOBAL.darkMode, false));

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  // ── Reload all per-profile state when switching profiles ─────────────────
  const hasMountedRef = useRef(false);
  useEffect(() => {
    if (!hasMountedRef.current) { hasMountedRef.current = true; return; }
    const id = activeProfileId;
    const loadedMeals = load(pk(id, 'meals'), DEFAULT_MEALS);
    const seeded = seedRecipes(loadedMeals);
    if (seeded !== loadedMeals) save(pk(id, 'meals'), seeded);
    setMeals(seeded);
    setPlan(load(pk(id, 'plan'), {}));
    setLastPlan({});
    setEatOutEnabled(load(pk(id, 'eatout_enabled'), false));
    setEatOutCount(load(pk(id, 'eatout_count'), 4));
    setEatOutSameNight(load(pk(id, 'eatout_same_night'), false));
    setEatOutDayOfWeek(load(pk(id, 'eatout_dow'), 5));
    setHouseholdSize(load(pk(id, 'household_size'), 4));
    setGroceryChecked(load(pk(id, 'grocery_checked'), {}));
    setLockedDays(load(pk(id, 'locked_days'), {}));
    setEnabledCategories(load(pk(id, 'enabled_categories'), ['Beef', 'Chicken', 'Pork', 'Seafood', 'Vegetarian', 'Other']));
    setIngredientLibrary(load(pk(id, 'ing_library'), INGREDIENT_SEED));
  }, [activeProfileId]);

  // ── Derived state ────────────────────────────────────────────────────────
  const planKey = `${viewYear}-${viewMonth}`;
  const currentPlan = plan[planKey] || {};
  const currentLocked = new Set(lockedDays[planKey] || []);
  const activeMeals = meals.filter(m => enabledCategories.includes(m.category));

  // ── Profile management ───────────────────────────────────────────────────

  const addProfile = useCallback((name) => {
    const id = `p_${Date.now()}`;
    const newProfile = { id, name: name.trim() || 'New Profile' };
    setProfiles(prev => {
      const next = [...prev, newProfile];
      save(GLOBAL.profiles, next);
      return next;
    });
    return id;
  }, []);

  const deleteProfile = useCallback((id) => {
    setProfiles(prev => {
      if (prev.length <= 1) return prev; // can't delete last profile
      const next = prev.filter(p => p.id !== id);
      save(GLOBAL.profiles, next);
      return next;
    });
  }, []);

  const renameProfile = useCallback((id, name) => {
    setProfiles(prev => {
      const next = prev.map(p => p.id === id ? { ...p, name: name.trim() || p.name } : p);
      save(GLOBAL.profiles, next);
      return next;
    });
  }, []);

  const switchProfile = useCallback((id) => {
    setActiveProfileId(id);
    save(GLOBAL.activeProfile, id);
  }, []);

  // ── Plan generation ───────────────────────────────────────────────────────

  const regenerate = useCallback(() => {
    if (activeMeals.length === 0) return;
    const count = eatOutEnabled ? eatOutCount : 0;
    const locked = lockedDays[planKey] || [];
    const lockedValues = {};
    locked.forEach(d => { lockedValues[d] = currentPlan[d] ?? null; });
    const newMonthPlan = generatePlan(activeMeals, viewYear, viewMonth, count, eatOutEnabled && eatOutSameNight, eatOutDayOfWeek, lockedValues);
    setLastPlan(prev => ({ ...prev, [planKey]: currentPlan }));
    setPlan(prev => {
      const next = { ...prev, [planKey]: newMonthPlan };
      save(pk(activeProfileId, 'plan'), next);
      return next;
    });
  }, [activeMeals, viewYear, viewMonth, planKey, eatOutEnabled, eatOutCount, eatOutSameNight, eatOutDayOfWeek, lockedDays, currentPlan, activeProfileId]);

  const undoRegenerate = useCallback(() => {
    if (!lastPlan[planKey]) return;
    setPlan(prev => {
      const next = { ...prev, [planKey]: lastPlan[planKey] };
      save(pk(activeProfileId, 'plan'), next);
      return next;
    });
    setLastPlan(prev => { const n = { ...prev }; delete n[planKey]; return n; });
  }, [lastPlan, planKey, activeProfileId]);

  const canUndo = !!lastPlan[planKey];

  const reassignDay = useCallback((day, mealId) => {
    const id = mealId !== undefined ? mealId : (activeMeals.length > 0 ? pickRandom(activeMeals).id : null);
    setPlan(prev => {
      const next = { ...prev, [planKey]: { ...prev[planKey], [day]: id } };
      save(pk(activeProfileId, 'plan'), next);
      return next;
    });
  }, [activeMeals, planKey, activeProfileId]);

  const swapDays = useCallback((dayA, dayB) => {
    setPlan(prev => {
      const monthPlan = { ...prev[planKey] };
      const tmp = monthPlan[dayA];
      monthPlan[dayA] = monthPlan[dayB] ?? null;
      monthPlan[dayB] = tmp ?? null;
      const next = { ...prev, [planKey]: monthPlan };
      save(pk(activeProfileId, 'plan'), next);
      return next;
    });
  }, [planKey, activeProfileId]);

  const toggleEatOut = useCallback((day) => {
    setPlan(prev => {
      const current = prev[planKey]?.[day];
      const newVal = current === EAT_OUT
        ? (activeMeals.length > 0 ? pickRandom(activeMeals).id : null)
        : EAT_OUT;
      const next = { ...prev, [planKey]: { ...prev[planKey], [day]: newVal } };
      save(pk(activeProfileId, 'plan'), next);
      return next;
    });
  }, [planKey, activeMeals, activeProfileId]);

  const toggleLeftover = useCallback((day) => {
    setPlan(prev => {
      const current = prev[planKey]?.[day];
      const newVal = current === LEFTOVER
        ? (activeMeals.length > 0 ? pickRandom(activeMeals).id : null)
        : LEFTOVER;
      const next = { ...prev, [planKey]: { ...prev[planKey], [day]: newVal } };
      save(pk(activeProfileId, 'plan'), next);
      return next;
    });
  }, [planKey, activeMeals, activeProfileId]);

  const clearDay = useCallback((day) => {
    setPlan(prev => {
      const next = { ...prev, [planKey]: { ...prev[planKey], [day]: null } };
      save(pk(activeProfileId, 'plan'), next);
      return next;
    });
  }, [planKey, activeProfileId]);

  const toggleLockDay = useCallback((day) => {
    setLockedDays(prev => {
      const days = new Set(prev[planKey] || []);
      if (days.has(day)) days.delete(day); else days.add(day);
      const next = { ...prev, [planKey]: [...days] };
      save(pk(activeProfileId, 'locked_days'), next);
      return next;
    });
  }, [planKey, activeProfileId]);

  const toggleCategory = useCallback((category) => {
    setEnabledCategories(prev => {
      const next = prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category];
      save(pk(activeProfileId, 'enabled_categories'), next);
      return next;
    });
  }, [activeProfileId]);

  const updateDarkMode = useCallback((val) => {
    setDarkMode(val);
    save(GLOBAL.darkMode, val);
  }, []);

  const updateEatOutEnabled = useCallback((val) => {
    setEatOutEnabled(val);
    save(pk(activeProfileId, 'eatout_enabled'), val);
  }, [activeProfileId]);

  const updateEatOutCount = useCallback((val) => {
    setEatOutCount(val);
    save(pk(activeProfileId, 'eatout_count'), val);
  }, [activeProfileId]);

  const updateEatOutSameNight = useCallback((val) => {
    setEatOutSameNight(val);
    save(pk(activeProfileId, 'eatout_same_night'), val);
  }, [activeProfileId]);

  const updateEatOutDayOfWeek = useCallback((val) => {
    setEatOutDayOfWeek(val);
    save(pk(activeProfileId, 'eatout_dow'), val);
  }, [activeProfileId]);

  // ── Meal library ──────────────────────────────────────────────────────────

  const addMeal = useCallback((name, category, tags = []) => {
    const id = Date.now();
    setMeals(prev => {
      const next = [...prev, { id, name: name.trim(), category, tags }];
      save(pk(activeProfileId, 'meals'), next);
      return next;
    });
  }, [activeProfileId]);

  const addMeals = useCallback((newMeals) => {
    setMeals(prev => {
      const next = [...prev, ...newMeals];
      save(pk(activeProfileId, 'meals'), next);
      return next;
    });
  }, [activeProfileId]);

  const deleteMeal = useCallback((id) => {
    setMeals(prev => {
      const next = prev.filter(m => m.id !== id);
      save(pk(activeProfileId, 'meals'), next);
      return next;
    });
  }, [activeProfileId]);

  const editMeal = useCallback((id, name, category, tags) => {
    setMeals(prev => {
      const next = prev.map(m => m.id === id ? { ...m, name: name.trim(), category, tags: tags ?? m.tags ?? [] } : m);
      save(pk(activeProfileId, 'meals'), next);
      return next;
    });
  }, [activeProfileId]);

  const updateMealRecipe = useCallback((id, recipe) => {
    setMeals(prev => {
      const next = prev.map(m => m.id === id ? { ...m, recipe } : m);
      save(pk(activeProfileId, 'meals'), next);
      return next;
    });
  }, [activeProfileId]);

  const updateMealRecipes = useCallback((updates) => {
    // updates: Array<{ id, recipe }>
    setMeals(prev => {
      const map = Object.fromEntries(updates.map(u => [u.id, u.recipe]));
      const next = prev.map(m => map[m.id] !== undefined ? { ...m, recipe: map[m.id] } : m);
      save(pk(activeProfileId, 'meals'), next);
      return next;
    });
  }, [activeProfileId]);

  // ── Ingredient library ────────────────────────────────────────────────────

  const addLibIngredient = useCallback((entry) => {
    const item = { id: Date.now().toString(), ...entry };
    setIngredientLibrary(prev => {
      const next = [...prev, item];
      save(pk(activeProfileId, 'ing_library'), next);
      return next;
    });
  }, [activeProfileId]);

  const editLibIngredient = useCallback((id, updates) => {
    setIngredientLibrary(prev => {
      const next = prev.map(i => i.id === id ? { ...i, ...updates } : i);
      save(pk(activeProfileId, 'ing_library'), next);
      return next;
    });
  }, [activeProfileId]);

  const deleteLibIngredient = useCallback((id) => {
    setIngredientLibrary(prev => {
      const next = prev.filter(i => i.id !== id);
      save(pk(activeProfileId, 'ing_library'), next);
      return next;
    });
  }, [activeProfileId]);

  // ── Grocery ───────────────────────────────────────────────────────────────

  const updateHouseholdSize = useCallback((val) => {
    setHouseholdSize(val);
    save(pk(activeProfileId, 'household_size'), val);
  }, [activeProfileId]);

  const toggleGroceryItem = useCallback((monthKey, itemKey) => {
    setGroceryChecked(prev => {
      const keys = new Set(prev[monthKey] || []);
      if (keys.has(itemKey)) keys.delete(itemKey); else keys.add(itemKey);
      const next = { ...prev, [monthKey]: [...keys] };
      save(pk(activeProfileId, 'grocery_checked'), next);
      return next;
    });
  }, [activeProfileId]);

  const clearGroceryChecked = useCallback((monthKey) => {
    setGroceryChecked(prev => {
      const next = { ...prev, [monthKey]: [] };
      save(pk(activeProfileId, 'grocery_checked'), next);
      return next;
    });
  }, [activeProfileId]);

  // ── Navigation ────────────────────────────────────────────────────────────

  const prevMonth = useCallback(() => {
    setViewMonth(m => { if (m === 0) { setViewYear(y => y - 1); return 11; } return m - 1; });
  }, []);

  const nextMonth = useCallback(() => {
    setViewMonth(m => { if (m === 11) { setViewYear(y => y + 1); return 0; } return m + 1; });
  }, []);

  return {
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
