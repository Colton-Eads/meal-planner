import { useState } from 'react';
import CalendarView from './components/CalendarView';
import MealLibrary from './components/MealLibrary';
import GroceryList from './components/GroceryList';
import RecipeEditor from './components/RecipeEditor';
import RecipeView from './components/RecipeView';
import DayView from './components/DayView';
import Tutorial, { isTutorialDone } from './components/Tutorial';
import ProfileManager from './components/ProfileManager';
import ImportModal from './components/ImportModal';
import { useMealPlan, EAT_OUT, LEFTOVER } from './hooks/useMealPlan';
import './index.css';

export default function App() {
  const [tab, setTab] = useState('planner');
  const [recipeEditorMealId, setRecipeEditorMealId] = useState(null);
  const [recipeViewMealId, setRecipeViewMealId] = useState(null);
  const [dayViewDay, setDayViewDay] = useState(null);
  const [importType, setImportType] = useState(null); // null | 'recipes' | 'meals'
  const [showTutorial, setShowTutorial] = useState(() => !isTutorialDone());

  const {
    // Profile
    profiles, activeProfileId,
    addProfile, deleteProfile, renameProfile, switchProfile,
    // Meal data
    meals, activeMeals, currentPlan, viewYear, viewMonth, planKey,
    eatOutEnabled, eatOutCount, eatOutSameNight, eatOutDayOfWeek,
    householdSize, groceryChecked,
    currentLocked, enabledCategories, darkMode, canUndo,
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
      {dayViewDay != null && (() => {
        const v = currentPlan[dayViewDay];
        const isSpecial = v === EAT_OUT || v === LEFTOVER;
        const dayMeal = !isSpecial && v ? meals.find(m => m.id === v) ?? null : null;
        return (
          <DayView
            day={dayViewDay}
            viewYear={viewYear}
            viewMonth={viewMonth}
            planValue={v}
            meal={dayMeal}
            locked={currentLocked.has(dayViewDay)}
            meals={activeMeals}
            onClose={() => setDayViewDay(null)}
            onReassign={reassignDay}
            onClear={(day) => { clearDay(day); setDayViewDay(null); }}
            onToggleEatOut={toggleEatOut}
            onToggleLeftover={toggleLeftover}
            onToggleLock={toggleLockDay}
            onEditRecipe={(meal) => { setDayViewDay(null); handleOpenEditor(meal); }}
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
          </div>
        </div>
      </header>

      <main className="app-main">
        {tab === 'planner' ? (
          <CalendarView
            viewYear={viewYear}
            viewMonth={viewMonth}
            currentPlan={currentPlan}
            meals={meals}
            activeMeals={activeMeals}
            eatOutEnabled={eatOutEnabled}
            eatOutCount={eatOutCount}
            eatOutSameNight={eatOutSameNight}
            eatOutDayOfWeek={eatOutDayOfWeek}
            currentLocked={currentLocked}
            enabledCategories={enabledCategories}
            canUndo={canUndo}
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
            onDayClick={setDayViewDay}
          />
        ) : tab === 'library' ? (
          <MealLibrary
            meals={meals}
            onAdd={addMeal}
            onEdit={editMeal}
            onDelete={deleteMeal}
            onEditRecipe={handleOpenEditor}
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
            currentPlan={currentPlan}
            viewMonth={viewMonth}
            viewYear={viewYear}
            planKey={planKey}
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
