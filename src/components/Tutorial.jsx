import { useState } from 'react';

const STORAGE_KEY = 'emp_tutorial_done';

export function isTutorialDone() {
  try { return localStorage.getItem(STORAGE_KEY) === 'true'; } catch { return false; }
}

function markDone() {
  try { localStorage.setItem(STORAGE_KEY, 'true'); } catch {}
}

function ProgressDots({ total, current }) {
  return (
    <div className="tutorial-dots">
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={`tutorial-dot${i === current ? ' active' : ''}`} />
      ))}
    </div>
  );
}

export default function Tutorial({ mealCount, onRegenerate, onDone }) {
  const [step, setStep] = useState(0);
  const [generated, setGenerated] = useState(false);

  const handleDone = () => { markDone(); onDone(); };
  const handleSkip = () => { markDone(); onDone(); };
  const next = () => setStep(s => s + 1);
  const back = () => setStep(s => s - 1);

  const handleGenerate = () => {
    onRegenerate();
    setGenerated(true);
    next();
  };

  const TOTAL_STEPS = 5;

  const steps = [

    // ── Step 0: Welcome ──────────────────────────────────────────────────────
    <div key="welcome" className="tutorial-step">
      <div className="tutorial-icon">🏠</div>
      <h2 className="tutorial-title">Welcome to HOME!</h2>
      <p className="tutorial-body">
        <strong>H</strong>andling <strong>O</strong>ur <strong>M</strong>eals <strong>E</strong>ffortlessly.
        Plan a full month of dinners in minutes — no more staring at each other wondering what to make.
        Your library comes loaded with <strong>{mealCount} meals</strong> and recipes ready to go.
        Let's take a quick tour.
      </p>
      <div className="tutorial-actions">
        <button className="tutorial-btn-skip" onClick={handleSkip}>Skip tour</button>
        <button className="tutorial-btn-primary" onClick={next}>Start tour →</button>
      </div>
    </div>,

    // ── Step 1: Generate ─────────────────────────────────────────────────────
    <div key="generate" className="tutorial-step">
      <div className="tutorial-icon">📅</div>
      <h2 className="tutorial-title">Generate your first plan</h2>
      <p className="tutorial-body">
        Hit the button below and the planner fills your whole month automatically —
        no repeats, balanced across categories, eat-out nights included if you want them.
        You can reshuffle any time.
      </p>
      <div className="tutorial-callout">
        <div className="tutorial-callout-row">
          <span className="tutorial-callout-icon">↺</span>
          <span><strong>Regenerate</strong> — refills any empty days without touching locked ones</span>
        </div>
        <div className="tutorial-callout-row">
          <span className="tutorial-callout-icon">↩</span>
          <span><strong>Undo</strong> — steps back if you don't like the result</span>
        </div>
      </div>
      <div className="tutorial-actions">
        <button className="tutorial-btn-back" onClick={back}>← Back</button>
        <button className="tutorial-btn-primary" onClick={handleGenerate}>
          ↺ Generate My Plan →
        </button>
      </div>
    </div>,

    // ── Step 2: Day view ─────────────────────────────────────────────────────
    <div key="dayview" className="tutorial-step">
      <div className="tutorial-icon">👆</div>
      <h2 className="tutorial-title">Click any day to customize it</h2>
      <p className="tutorial-body">
        Your plan is ready! Now click any day on the calendar to open the day view.
        From there you have full control:
      </p>
      <div className="tutorial-callout">
        <div className="tutorial-callout-row">
          <span className="tutorial-callout-icon">↺</span>
          <span><strong>Shuffle</strong> — swap to a different random meal</span>
        </div>
        <div className="tutorial-callout-row">
          <span className="tutorial-callout-icon">☰</span>
          <span><strong>Pick Meal</strong> — choose a specific meal from your library</span>
        </div>
        <div className="tutorial-callout-row">
          <span className="tutorial-callout-icon">🍽️</span>
          <span><strong>Eat Out</strong> — mark the night as a restaurant night</span>
        </div>
        <div className="tutorial-callout-row">
          <span className="tutorial-callout-icon">🔒</span>
          <span><strong>Lock</strong> — pin a meal so it survives regeneration</span>
        </div>
        <div className="tutorial-callout-row">
          <span className="tutorial-callout-icon">📋</span>
          <span><strong>Recipe</strong> — view ingredients, instructions, and print</span>
        </div>
      </div>
      <div className="tutorial-actions">
        <button className="tutorial-btn-back" onClick={back}>← Back</button>
        <button className="tutorial-btn-primary" onClick={next}>Got it →</button>
      </div>
    </div>,

    // ── Step 3: Grocery list ─────────────────────────────────────────────────
    <div key="grocery" className="tutorial-step">
      <div className="tutorial-icon">🛒</div>
      <h2 className="tutorial-title">Your grocery list builds itself</h2>
      <p className="tutorial-body">
        Head to the <strong>Grocery List</strong> tab anytime. It reads your meal plan,
        combines and scales ingredients across every meal, and organizes everything
        by store section.
      </p>
      <div className="tutorial-callout">
        <div className="tutorial-callout-row">
          <span className="tutorial-callout-icon">👥</span>
          <span>Set your <strong>household size</strong> and quantities scale automatically</span>
        </div>
        <div className="tutorial-callout-row">
          <span className="tutorial-callout-icon">✓</span>
          <span>Check items off as you shop — progress saves automatically</span>
        </div>
        <div className="tutorial-callout-row">
          <span className="tutorial-callout-icon">⎙</span>
          <span>Print, download, or copy the list to share it</span>
        </div>
      </div>
      <div className="tutorial-actions">
        <button className="tutorial-btn-back" onClick={back}>← Back</button>
        <button className="tutorial-btn-primary" onClick={next}>Almost done →</button>
      </div>
    </div>,

    // ── Step 4: Done ─────────────────────────────────────────────────────────
    <div key="done" className="tutorial-step">
      <div className="tutorial-icon tutorial-icon-done">✓</div>
      <h2 className="tutorial-title">You're all set!</h2>
      <p className="tutorial-body">
        Your plan is ready for the month. A few more things worth knowing:
      </p>
      <div className="tutorial-callout">
        <div className="tutorial-callout-row">
          <span className="tutorial-callout-icon">📚</span>
          <span>Use the <strong>Meals</strong> tab to add, edit, or tag your own meals and recipes</span>
        </div>
        <div className="tutorial-callout-row">
          <span className="tutorial-callout-icon">👤</span>
          <span><strong>Profiles</strong> (top right) let multiple households share one device</span>
        </div>
        <div className="tutorial-callout-row">
          <span className="tutorial-callout-icon">📱</span>
          <span>Add this page to your home screen to use it like an app</span>
        </div>
      </div>
      <div className="tutorial-actions">
        <button className="tutorial-btn-back" onClick={back}>← Back</button>
        <button className="tutorial-btn-primary" onClick={handleDone}>Start Planning</button>
      </div>
    </div>,

  ];

  return (
    <div className="tutorial-overlay">
      <div className="tutorial-panel">
        <ProgressDots total={TOTAL_STEPS} current={step} />
        {steps[step]}
        <div className="tutorial-step-label">Step {step + 1} of {TOTAL_STEPS}</div>
      </div>
    </div>
  );
}
