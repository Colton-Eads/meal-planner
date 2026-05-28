import { useState } from 'react';
import { CATEGORIES } from '../data/meals';
import { EAT_OUT, LEFTOVER } from '../hooks/useMealPlan';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const WEEKDAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function dateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function DayCell({
  date, planValue, meal, locked, dragKey, onDayClick, onReassign,
  onDragStart, onDragOver, onDrop, showWeekday,
}) {
  const isEatOut = planValue === EAT_OUT;
  const isLeftover = planValue === LEFTOVER;
  const cat = meal ? CATEGORIES[meal.category] : null;
  const key = dateKey(date);
  const isDragTarget = dragKey !== null && dragKey !== key;
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
      onClick={() => onDayClick(date)}
      onDragStart={e => { e.stopPropagation(); onDragStart(key); }}
      onDragOver={e => { e.preventDefault(); onDragOver(key); }}
      onDrop={e => { e.stopPropagation(); onDrop(date); }}
    >
      <div className="day-number">
        {showWeekday && <span className="day-weekday">{WEEKDAYS[date.getDay()]}</span>}
        <span>{date.getDate()}</span>
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
          onClick={e => { e.stopPropagation(); onReassign(date); }}
        >↺</button>
      )}
    </div>
  );
}

// ── Exports ──────────────────────────────────────────────────────────────────

function exportPlanTxt(visibleDays, visiblePlan, mealMap, rangeLabel) {
  const lines = [`${rangeLabel} — Meal Plan`, ''];
  for (const d of visibleDays) {
    const v = visiblePlan[dateKey(d)];
    let label = 'No meal';
    if (v === EAT_OUT) label = 'Eating Out';
    else if (v === LEFTOVER) label = 'Leftovers';
    else if (mealMap[v]) label = mealMap[v].name;
    lines.push(`${WEEKDAY_NAMES[d.getDay()]}, ${MONTH_NAMES[d.getMonth()]} ${d.getDate()}: ${label}`);
  }
  download(lines.join('\n'), `meal-plan-${dateKey(visibleDays[0])}.txt`, 'text/plain');
}

function exportPlanCsv(visibleDays, visiblePlan, mealMap) {
  const rows = [['Date', 'Weekday', 'Meal', 'Category']];
  for (const d of visibleDays) {
    const v = visiblePlan[dateKey(d)];
    let meal = 'No meal', category = '';
    if (v === EAT_OUT) meal = 'Eating Out';
    else if (v === LEFTOVER) meal = 'Leftovers';
    else if (mealMap[v]) { meal = mealMap[v].name; category = mealMap[v].category; }
    rows.push([dateKey(d), WEEKDAY_NAMES[d.getDay()], meal, category]);
  }
  const csv = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
  download(csv, `meal-plan-${dateKey(visibleDays[0])}.csv`, 'text/csv');
}

function download(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ── CalendarView ─────────────────────────────────────────────────────────────

export default function CalendarView({
  viewMode, viewLabel, visibleDays, visiblePlan, visibleLocked,
  viewYear, viewMonth, meals,
  eatOutEnabled, eatOutCount, eatOutSameNight, eatOutDayOfWeek,
  enabledCategories, canUndo,
  onSetViewMode, onRegenerate, onUndo, onReassign, onToggleCategory,
  onPrev, onNext,
  onEatOutEnabledChange, onEatOutCountChange,
  onEatOutSameNightChange, onEatOutDayOfWeekChange,
  onDayClick, onSwapDays,
}) {
  const [dragKey, setDragKey] = useState(null);
  const [showExport, setShowExport] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const mealMap = Object.fromEntries(meals.map(m => [m.id, m]));
  const eatOutNights = Object.values(visiblePlan).filter(v => v === EAT_OUT).length;
  const visibleByKey = Object.fromEntries(visibleDays.map(d => [dateKey(d), d]));

  const handleDrop = (targetDate) => {
    if (dragKey !== null && dragKey !== dateKey(targetDate) && visibleByKey[dragKey]) {
      onSwapDays(visibleByKey[dragKey], targetDate);
    }
    setDragKey(null);
  };

  // Eat-out count cap depends on visible range length, not just month days.
  const countMax = visibleDays.length || 31;
  const countLabel = viewMode === 'month'
    ? 'Nights per month:'
    : viewMode === 'week'
      ? 'Nights this week:'
      : 'Nights this period:';

  return (
    <div className="calendar-view" onDragEnd={() => setDragKey(null)}>

      <div className="calendar-header">
        <button className="btn-nav" onClick={onPrev}>‹</button>
        <div className="month-title">{viewLabel}</div>
        <button className="btn-nav" onClick={onNext}>›</button>
      </div>

      <div className="view-mode-row">
        <div className="view-mode-toggle" role="tablist">
          {[
            { id: 'month',  label: 'Month' },
            { id: 'biweek', label: 'Biweek' },
            { id: 'week',   label: 'Week' },
          ].map(opt => (
            <button
              key={opt.id}
              role="tab"
              aria-selected={viewMode === opt.id}
              className={`view-mode-btn${viewMode === opt.id ? ' active' : ''}`}
              onClick={() => onSetViewMode(opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>
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
                          <span>{countLabel}</span>
                          <input
                            type="number"
                            className="count-input"
                            min={1}
                            max={countMax}
                            value={eatOutCount}
                            onChange={e => onEatOutCountChange(Math.min(countMax, Math.max(1, Number(e.target.value))))}
                          />
                        </label>
                      )}
                    </div>
                    {eatOutNights > 0 && (
                      <div className="settings-row">
                        <span className="eat-out-badge">{eatOutNights} eat-out night{eatOutNights !== 1 ? 's' : ''} visible</span>
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
                <button className="dropdown-item" onClick={() => { exportPlanTxt(visibleDays, visiblePlan, mealMap, viewLabel); setShowExport(false); }}>
                  Export as .txt
                </button>
                <button className="dropdown-item" onClick={() => { exportPlanCsv(visibleDays, visiblePlan, mealMap); setShowExport(false); }}>
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

      {viewMode === 'month' ? (
        <MonthGrid
          viewYear={viewYear}
          viewMonth={viewMonth}
          visiblePlan={visiblePlan}
          visibleLocked={visibleLocked}
          mealMap={mealMap}
          dragKey={dragKey}
          onDayClick={onDayClick}
          onReassign={onReassign}
          onDragStart={setDragKey}
          onDrop={handleDrop}
        />
      ) : (
        <StripGrid
          visibleDays={visibleDays}
          visiblePlan={visiblePlan}
          visibleLocked={visibleLocked}
          mealMap={mealMap}
          dragKey={dragKey}
          rowsOf={viewMode === 'biweek' ? 7 : 7}
          onDayClick={onDayClick}
          onReassign={onReassign}
          onDragStart={setDragKey}
          onDrop={handleDrop}
        />
      )}

    </div>
  );
}

// ── Month grid (existing layout) ─────────────────────────────────────────────

function MonthGrid({ viewYear, viewMonth, visiblePlan, visibleLocked, mealMap, dragKey, onDayClick, onReassign, onDragStart, onDrop }) {
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(viewYear, viewMonth, d));

  return (
    <>
      <div className="weekday-row">
        {WEEKDAYS.map(d => <div key={d} className="weekday-label">{d}</div>)}
      </div>
      <div className="calendar-grid">
        {cells.map((date, i) =>
          date === null
            ? <div key={`empty-${i}`} className="day-cell empty" />
            : (
              <DayCell
                key={dateKey(date)}
                date={date}
                planValue={visiblePlan[dateKey(date)]}
                meal={mealMap[visiblePlan[dateKey(date)]] || null}
                locked={visibleLocked.has(dateKey(date))}
                dragKey={dragKey}
                onDayClick={onDayClick}
                onReassign={onReassign}
                onDragStart={onDragStart}
                onDragOver={() => {}}
                onDrop={onDrop}
              />
            )
        )}
      </div>
    </>
  );
}

// ── Strip grid (week / biweek) ───────────────────────────────────────────────

function StripGrid({ visibleDays, visiblePlan, visibleLocked, mealMap, dragKey, rowsOf, onDayClick, onReassign, onDragStart, onDrop }) {
  // Render rows of `rowsOf` days each. Biweek = 2 rows of 7.
  const rows = [];
  for (let i = 0; i < visibleDays.length; i += rowsOf) {
    rows.push(visibleDays.slice(i, i + rowsOf));
  }

  return (
    <div className="calendar-strip">
      {rows.map((row, ri) => (
        <div key={ri} className="calendar-strip-row">
          {row.map(date => (
            <DayCell
              key={dateKey(date)}
              date={date}
              planValue={visiblePlan[dateKey(date)]}
              meal={mealMap[visiblePlan[dateKey(date)]] || null}
              locked={visibleLocked.has(dateKey(date))}
              dragKey={dragKey}
              onDayClick={onDayClick}
              onReassign={onReassign}
              onDragStart={onDragStart}
              onDragOver={() => {}}
              onDrop={onDrop}
              showWeekday
            />
          ))}
        </div>
      ))}
    </div>
  );
}
