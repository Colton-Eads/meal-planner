const STORAGE_KEY = 'emp_tutorial_done';

export function isTutorialDone() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function markTutorialDone() {
  try {
    localStorage.setItem(STORAGE_KEY, 'true');
  } catch {
    // localStorage unavailable (e.g. private mode) — silently no-op
  }
}
