import { useState } from 'react';
import { CATEGORIES } from '../data/meals';
import { EAT_OUT, LEFTOVER } from '../hooks/useMealPlan';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const WEEKDAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTH_NAMES_FULL = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function DayCell({ day, planValue, meal, locked, dragDay, onDayClick, onReassign, onDragStart, onDragOver, onDrop }) {
  const isEatOut = planValue === EAT_OUT;
  const isLeftover = planValue === LEFTOVER;
  const cat = meal ? CATEGORIES[meal.category] : null;
  const isDragTarget = dragDay !== null && dragDay !== day;
  const showShuffle = !locked && !isEatOut && !isLeftover;

  return (
    <div
      className={[
        'day-cell',
        isEatOut ? 'eat-out' : '',
        isLeftover ? 'leftover' : '',
        locked ? 'locked' : '',
        isDragTarget ? 'drag-target' : '',
      ].filter(Boolean).join(' ')}
      style={!isEatOut && !isLeftover && cat ? { borderColor: cat.color } : {}}
      draggable={!locked}
      onClick={() => onDayClick(day)}
      onDragStart={e => { e.stopPropagation(); onDragStart(day); }}
      onDragOver={e => { e.preventDefault(); onDragOver(day); }}
      onDrop={e => { e.stopPropagation(); onDrop(day); }}
    >
      <div className="day-number">
        {day}
        {locked && <span className="lock-indicator" title="Locked">🔒</span>}
      </div>

      {isEatOut ? (
        <div className="meal-chip eat-out-chip">Eating Out</div>
      ) : isLeftover ? (
        <div className="meal-chip leftover-chip">Leftovers</div>
      ) : meal ? (
        <div className="meal-chip" style={{ background: cat.bg, color: cat.color }}>
          {meal.name}
          {meal.tags?.length > 0 && <span className="meal-tag-dot" title={meal.tags.join(', ')}>·</span>}
        </div>
      ) : (
        <div className="meal-empty">No meal</div>
      )}

      {showShuffle && (
        <button
          className="day-shuffle-btn"
          title="Shuffle meal"
          onClick={e => { e.stopPropagation(); onReassign(day); }}
        >↺</button>
      )}
    </div>
  );
}

function exportPlanTxt(viewYear, viewMonth, currentPlan, mealMap) {
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const lines = [`${MONTH_NAMES_FULL[viewMonth]} ${viewYear} — Meal Plan`, ''];
  for (let d = 1; d <= daysInMonth; d++) {
    const v = currentPlan[d];
    let label = 'No meal';
    if (v === EAT_OUT) label = 'Eating Out';
    else if (v === LEFTOVER) label = 'Leftovers';
    else if (mealMap[v]) label = mealMap[v].name;
    const date = new Date(viewYear, viewMonth, d);
    lines.push(`${WEEKDAY_NAMES[date.getDay()]}, ${MONTH_NAMES_FULL[viewMonth]} ${d}: ${label}`);
  }
  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `meal-plan-${viewYear}-${String(viewMonth + 1).padStart(2, '0')}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportPlanCsv(viewYear, viewMonth, currentPlan, mealMap) {
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const rows = [['Day', 'Date', 'Weekday', 'Meal', 'Category']];
  for (let d = 1; d <= daysInMonth; d++) {
    const v = currentPlan[d];
    const date = new Date(viewYear, viewMonth, d);
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const weekday = WEEKDAY_NAMES[date.getDay()];
    let meal = 'No meal', category = '';
    if (v === EAT_OUT) { meal = 'Eating Out'; }
    else if (v === LEFTOVER) { meal = 'Leftovers'; }
    else if (mealMap[v]) { meal = mealMap[v].name; category = mealMap[v].category; }
    rows.push([String(d).padStart(2, '0'), dateStr, weekday, meal, category]);
  }
  const csv = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `meal-plan-${viewYear}-${String(viewMonth + 1).padStart(2, '0')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function CalendarView({
  viewYear, viewMonth, currentPlan, meals,
  eatOutEnabled, eatOutCount, eatOutSameNight, eatOutDayOfWeek,
  currentLocked, enabledCategories, canUndo,
  onRegenerate, onUndo, onReassign, onToggleCategory,
  onPrev, onNext,
  onEatOutEnabledChange, onEatOutCountChange,
  onEatOutSameNightChange, onEatOutDayOfWeekChange,
  onDayClick, onSwapDays,
}) {
  const [dragDay, setDragDay] = useState(null);
  const [showExport, setShowExport] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const mealMap = Object.fromEntries(meals.map(m => [m.id, m]));
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const eatOutNights = Object.values(currentPlan).filter(v => v === EAT_OUT).length;

  const handleDrop = (targetDay) => {
    if (dragDay !== null && dragDay !== targetDay) onSwapDays(dragDay, targetDay);
    setDragDay(null);
  };

  return (
    <div className="calendar-view" onDragEnd={() => setDragDay(null)}>

      <div className="calendar-header">
        <button className="btn-nav" onClick={onPrev}>‹</button>
        <div className="month-title">{MONTH_NAMES[viewMonth]} {viewYear}</div>
        <button className="btn-nav" onClick={onNext}>›</button>
      </div>

      <div className="calendar-toolbar">
        <div className="toolbar-left">
          <div className="toolbar-dropdown-wrap">
            <button
              className={`btn-toolbar${showSettings ? ' active' : ''}`}
              onClick={() => { setShowSettings(s => !s); setShowExport(false); }}
            >
              ⚙ Settings {eatOutEnabled && !showSettings ? <span className="toolbar-badge">{eatOutNights || 'on'}</span> : null}
              <span className="toolbar-caret">{showSettings ? '▲' : '▼'}</span>
            </button>
            {showSettings && (
              <div className="toolbar-dropdown settings-dropdown">
                <div className="settings-row">
                  <label className="toggle-label">
                    <input type="checkbox" checked={eatOutEnabled} onChange={e => onEatOutEnabledChange(e.target.checked)} />
                    <span>Include eat-out nights</span>
                  </label>
                </div>
                {eatOutEnabled && (
                  <>
                    <div className="settings-row">
                      <label className="toggle-label">
                        <input type="checkbox" checked={eatOutSameNight} onChange={e => onEatOutSameNightChange(e.target.checked)} />
                        <span>Same night each week</span>
                      </label>
                    </div>
                    <div className="settings-row">
                      {eatOutSameNight ? (
                        <label className="count-label">
                          <span>Day of week:</span>
                          <select className="dow-select" value={eatOutDayOfWeek} onChange={e => onEatOutDayOfWeekChange(Number(e.target.value))}>
                            {WEEKDAYS.map((name, i) => <option key={i} value={i}>{name}</option>)}
                          </select>
                        </label>
                      ) : (
                        <label className="count-label">
                          <span>Nights per month:</span>
                          <input
                            type="number"
                            className="count-input"
                            min={1}
                            max={daysInMonth}
                            value={eatOutCount}
                            onChange={e => onEatOutCountChange(Math.min(daysInMonth, Math.max(1, Number(e.target.value))))}
                          />
                        </label>
                      )}
                    </div>
                    {eatOutNights > 0 && (
                      <div className="settings-row">
                        <span className="eat-out-badge">{eatOutNights} eat-out night{eatOutNights !== 1 ? 's' : ''} this month</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="toolbar-actions">
          {canUndo && (
            <button className="btn-undo" onClick={onUndo} title="Undo last regenerate">↩ Undo</button>
          )}

          <div className="toolbar-dropdown-wrap">
            <button
              className={`btn-export${showExport ? ' active' : ''}`}
              onClick={() => { setShowExport(e => !e); setShowSettings(false); }}
            >
              ⬇ Export <span className="toolbar-caret">{showExport ? '▲' : '▼'}</span>
            </button>
            {showExport && (
              <div className="toolbar-dropdown export-dropdown">
                <button className="dropdown-item" onClick={() => { exportPlanTxt(viewYear, viewMonth, currentPlan, mealMap); setShowExport(false); }}>
                  Export as .txt
                </button>
                <button className="dropdown-item" onClick={() => { exportPlanCsv(viewYear, viewMonth, currentPlan, mealMap); setShowExport(false); }}>
                  Export as .csv
                </button>
              </div>
            )}
          </div>

          <button className="btn-regenerate" onClick={onRegenerate}>↺ Regenerate</button>
        </div>
      </div>

      <div className="category-filters">
        <span className="filter-label">Include:</span>
        {Object.keys(CATEGORIES).map(cat => {
          const enabled = enabledCategories.includes(cat);
          const c = CATEGORIES[cat];
          return (
            <button
              key={cat}
              className={`cat-filter-btn${enabled ? ' active' : ''}`}
              style={enabled ? { background: c.bg, color: c.color, borderColor: c.color } : {}}
              onClick={() => onToggleCategory(cat)}
              title={enabled ? `Exclude ${cat}` : `Include ${cat}`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div className="weekday-row">
        {WEEKDAYS.map(d => <div key={d} className="weekday-label">{d}</div>)}
      </div>

      <div className="calendar-grid">
        {cells.map((day, i) =>
          day === null
            ? <div key={`empty-${i}`} className="day-cell empty" />
            : (
              <DayCell
                key={day}
                day={day}
                planValue={currentPlan[day]}
                meal={mealMap[currentPlan[day]] || null}
                locked={currentLocked.has(day)}
                dragDay={dragDay}
                onDayClick={onDayClick}
                onReassign={onReassign}
                onDragStart={setDragDay}
                onDragOver={() => {}}
                onDrop={handleDrop}
              />
            )
        )}
      </div>

    </div>
  );
}
