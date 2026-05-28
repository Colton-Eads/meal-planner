# Eads Meal Planner — Roadmap & Future Features

## Bug Fixes


## UI / UX Improvements


## Features to Add
- [x] Meal tags — "Quick", "Crock Pot", "Kid-Friendly", "Healthy", etc. — filter in library, shown in picker — 2026-04-21
- [x] Lock a day — 🔒 button pins a meal so regenerate skips it — 2026-04-21
- [x] Category filters — toggle any category on/off from random generation — 2026-04-21
- [x] Drag-and-drop to swap meals between days — 2026-04-21
- [x] Undo last regenerate — ↩ Undo button appears after regenerating — 2026-04-21
- [x] Leftover tracking — ♻ button marks a night as leftovers — 2026-04-21
- [x] Export plan — ⬇ TXT and ⬇ CSV export buttons download the full month — 2026-04-22


## Recipes & Grocery List
Each meal needs the following before grocery list generation is possible:
- **Ingredients** — name, quantity, unit (e.g. `2 lbs ground beef`) — required for grocery list
- **Instructions** — step-by-step directions — required for recipe view
- **Servings** — so grocery list can scale by household size
- **Prep / cook time** — optional, helpful for planning

### Recipe entry
- [x] Recipe editor in the Meals library — add/edit ingredients, steps, servings, and times per meal — 2026-04-21
- [x] In-app recipe view — tap a meal chip on the calendar to see the full recipe — 2026-04-21

### Grocery list
- [x] Grocery list generator — pull all meals for the month (skipping eat-out and leftover nights), aggregate ingredients by category (produce, meat, dairy, pantry, etc.) — 2026-04-21
- [x] Scale ingredients by serving size — 2026-04-21
- [x] Check-off items as you shop — 2026-04-21
- [x] Export grocery list (copy to clipboard as plain text) — 2026-04-21
- [x] Grocery list by selection — Full Month / Week 1–5 / Custom day range toggle — 2026-04-22

### Data import
- [x] CSV import for recipes — bulk load ingredients and instructions from a spreadsheet — 2026-04-22
  - Required columns: `meal_name, ingredient, quantity, unit`
  - Optional columns: `instructions, servings, prep_time_min, cook_time_min`


## Mobile / PWA
- [x] PWA manifest — "Add to Home Screen" ready on mobile — 2026-04-21
- [x] Service worker — network-first for navigation, cache-first for assets; full offline fallback — 2026-04-22


## Data & Export
- [x] Print view — clean printable calendar via browser print (Ctrl+P) — 2026-04-21
- [x] Export plan — download month as .txt — 2026-04-21
- [x] Export plan to CSV — download month as .csv with Day, Date, Weekday, Meal, Category columns — 2026-04-22
- [x] Import meals from CSV — bulk add meals via CSV in the Meals Library — 2026-04-22


## Nice to Have / Future Ideas
- [x] Dark mode — 🌙/☀ toggle in header, persists across sessions — 2026-04-21
- [x] Multiple household profiles — 👤 profile switcher in header; per-profile meal library, plan, and settings; automatic migration from single-profile storage — 2026-04-22


## Completed
- [x] No-repeat generation per month (max 3 repeats only if library < days in month) — 2026-04-20
- [x] Eat-out nights — toggle to include N eat-out nights in random generation; 🍽 button on each day to manually override — 2026-04-20
- [x] Recipe editor — add/edit ingredients, instructions, servings, prep/cook time per meal — 2026-04-21
- [x] In-app recipe view — tap a meal chip on the calendar to see the full recipe; "Edit Recipe" navigates to editor — 2026-04-21
- [x] Grocery list — categorized, scaled by household size, checkable, copy-to-clipboard export — 2026-04-21
- [x] Grocery list by range — Full Month / Week 1–5 / Custom day range — 2026-04-22
- [x] CSV import for recipes — match by meal name, preview before confirming, update recipes in bulk — 2026-04-22
- [x] CSV import for meals — bulk add meals with name/category/tags, duplicate detection — 2026-04-22
- [x] Export plan to CSV — 2026-04-22
- [x] Service worker — offline support — 2026-04-22
- [x] Multiple household profiles — per-profile data isolation, profile switcher in header — 2026-04-22


---
_Last updated: 2026-04-23_

## Notes
- Recipes: user to provide ingredients in structured format (quantity + unit + name) for grocery list aggregation to work cleanly. Can enter in-app or import via CSV.
- Profiles: each profile maintains its own meal library, monthly plans, settings, and grocery data. Dark mode is shared across all profiles.
