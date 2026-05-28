import { useState } from 'react';
import CalendarView from './components/CalendarView';
import MealLibrary from './components/MealLibrary';
import GroceryList from './components/GroceryList';
import RecipeEditor from './components/RecipeEditor';
import RecipeView from './components/RecipeView';
import DayView from './components/DayView';
import Tutorial from './components/Tutorial';
import { isTutorialDone } from './lib/tutorialState';
import ProfileManager from './components/ProfileManager';
import AccountMenu from './components/AccountMenu';
import ImportModal from './components/ImportModal';
import { useMealPlan, EAT_OUT, LEFTOVER } from './hooks/useMealPlan';
import './index.css';

export default function App() {
  const [tab, setTab] = useState('planner');
  const [recipeEditorMealId, setRecipeEditorMealId] = useState(null);
  const [recipeViewMealId, setRecipeViewMealId] = useState(null);
  const [dayViewDate, setDayViewDate] = useState(null);
  const [importType, setImportType] = useState(null); // null | 'recipes' | 'meals'
  const [showTutorial, setShowTutorial] = useState(() => !isTutorialDone());

  const {
    loading,
    // Profile
    profiles, activeProfileId,
    addProfile, deleteProfile, renameProfile, switchProfile,
    // Meal data
    meals, activeMeals, viewYear, viewMonth, planKey,
    eatOutEnabled, eatOutCount, eatOutSameNight, eatOutDayOfWeek,
    householdSize, groceryChecked,
    enabledCategories, darkMode, canUndo,
    // View mode + visible range
    viewMode, setViewMode,
    visibleDays, visiblePlan, visibleLocked, viewLabel,
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
  } = useMealPlan();

  const recipeEditorMeal = recipeEditorMealId != null ? meals.find(m => m.id === recipeEditorMealId) ?? null : null;
  const recipeViewMeal = recipeViewMealId != null ? meals.find(m => m.id === recipeViewMealId) ?? null : null;

  const handleOpenEditor = (meal) => setRecipeEditorMealId(meal.id);
  const handleCloseEditor = () => setRecipeEditorMealId(null);
  const handleSaveRecipe = (id, recipe) => { updateMealRecipe(id, recipe); setRecipeEditorMealId(null); };

  const handleOpenView = (meal) => setRecipeViewMealId(meal.id);
  const handleCloseView = () => setRecipeViewMealId(null);
  const handleEditFromView = () => {
    const id = recipeViewMealId;
    setRecipeViewMealId(null);
    setRecipeEditorMealId(id);
    setTab('library');
  };

  const handleImportRecipes = (updates) => {
    updateMealRecipes(updates);
  };

  const handleImportMeals = (newMeals) => {
    addMeals(newMeals);
  };

  if (loading) {
    return (
      <div className={`app${darkMode ? ' dark' : ''}`}>
        <div className="auth-shell">
          <div className="auth-card auth-loading">Loading your meal plan…</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`app${darkMode ? ' dark' : ''}`}>
      {showTutorial && (
        <Tutorial
          mealCount={meals.length}
          onRegenerate={regenerate}
          onDone={() => setShowTutorial(false)}
        />
      )}
      {recipeEditorMeal && (
        <RecipeEditor
          meal={recipeEditorMeal}
          onSave={handleSaveRecipe}
          onClose={handleCloseEditor}
          ingredientLibrary={ingredientLibrary}
        />
      )}
      {recipeViewMeal && (
        <RecipeView meal={recipeViewMeal} onClose={handleCloseView} onEdit={handleEditFromView} />
      )}
      {dayViewDate && (() => {
        const k = `${dayViewDate.getFullYear()}-${String(dayViewDate.getMonth() + 1).padStart(2, '0')}-${String(dayViewDate.getDate()).padStart(2, '0')}`;
        const v = visiblePlan[k];
        const isSpecial = v === EAT_OUT || v === LEFTOVER;
        const dayMeal = !isSpecial && v ? meals.find(m => m.id === v) ?? null : null;
        return (
          <DayView
            date={dayViewDate}
            planValue={v}
            meal={dayMeal}
            locked={visibleLocked.has(k)}
            meals={activeMeals}
            onClose={() => setDayViewDate(null)}
            onReassign={reassignDay}
            onClear={(date) => { clearDay(date); setDayViewDate(null); }}
            onToggleEatOut={toggleEatOut}
            onToggleLeftover={toggleLeftover}
            onToggleLock={toggleLockDay}
            onEditRecipe={(meal) => { setDayViewDate(null); handleOpenEditor(meal); }}
          />
        );
      })()}
      {importType && (
        <ImportModal
          type={importType}
          meals={meals}
          onImportRecipes={handleImportRecipes}
          onImportMeals={handleImportMeals}
          onClose={() => setImportType(null)}
        />
      )}

      <header className="app-header">
        <div className="header-inner">
          <h1 className="app-title">HOME</h1>
          <nav className="tab-nav">
            <button className={`tab-nav-btn ${tab === 'planner' ? 'active' : ''}`} onClick={() => setTab('planner')}>Planner</button>
            <button className={`tab-nav-btn ${tab === 'library' ? 'active' : ''}`} onClick={() => setTab('library')}>Meals ({meals.length})</button>
            <button className={`tab-nav-btn ${tab === 'grocery' ? 'active' : ''}`} onClick={() => setTab('grocery')}>Grocery List</button>
          </nav>
          <div className="header-right">
            <ProfileManager
              profiles={profiles}
              activeProfileId={activeProfileId}
              onSwitch={switchProfile}
              onAdd={addProfile}
              onDelete={deleteProfile}
              onRename={renameProfile}
            />
            <button
              className="btn-dark-toggle"
              onClick={() => updateDarkMode(!darkMode)}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? '☀' : '🌙'}
            </button>
            <AccountMenu />
          </div>
        </div>
      </header>

      <main className="app-main">
        {tab === 'planner' ? (
          <CalendarView
            viewMode={viewMode}
            viewLabel={viewLabel}
            visibleDays={visibleDays}
            visiblePlan={visiblePlan}
            visibleLocked={visibleLocked}
            viewYear={viewYear}
            viewMonth={viewMonth}
            meals={meals}
            eatOutEnabled={eatOutEnabled}
            eatOutCount={eatOutCount}
            eatOutSameNight={eatOutSameNight}
            eatOutDayOfWeek={eatOutDayOfWeek}
            enabledCategories={enabledCategories}
            canUndo={canUndo}
            onSetViewMode={setViewMode}
            onRegenerate={regenerate}
            onUndo={undoRegenerate}
            onReassign={reassignDay}
            onSwapDays={swapDays}
            onToggleCategory={toggleCategory}
            onPrev={prevMonth}
            onNext={nextMonth}
            onEatOutEnabledChange={updateEatOutEnabled}
            onEatOutCountChange={updateEatOutCount}
            onEatOutSameNightChange={updateEatOutSameNight}
            onEatOutDayOfWeekChange={updateEatOutDayOfWeek}
            onDayClick={setDayViewDate}
          />
        ) : tab === 'library' ? (
          <MealLibrary
            meals={meals}
            onAdd={addMeal}
            onEdit={editMeal}
            onDelete={deleteMeal}
            onEditRecipe={handleOpenEditor}
            onViewRecipe={handleOpenView}
            onOpenImport={() => setImportType('meals')}
            onOpenRecipeImport={() => setImportType('recipes')}
            ingredientLibrary={ingredientLibrary}
            onAddIngredient={addLibIngredient}
            onEditIngredient={editLibIngredient}
            onDeleteIngredient={deleteLibIngredient}
          />
        ) : (
          <GroceryList
            meals={meals}
            viewMonth={viewMonth}
            viewYear={viewYear}
            planKey={planKey}
            visiblePlan={visiblePlan}
            viewLabel={viewLabel}
            viewMode={viewMode}
            householdSize={householdSize}
            onHouseholdSizeChange={updateHouseholdSize}
            groceryChecked={groceryChecked}
            onToggleItem={toggleGroceryItem}
            onClearChecked={clearGroceryChecked}
            ingredientLibrary={ingredientLibrary}
          />
        )}
      </main>
    </div>
  );
}
