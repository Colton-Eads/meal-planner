// Minimal toast pub/sub. No React context, no provider — just a module-level
// emitter so any code (hooks, async handlers) can call toast.error() without
// threading a setter through props.
//
// Usage:
//   import { toast } from './lib/toast';
//   toast.error('Could not save: ' + err.message);
//
// ToastHost subscribes and renders.

let listeners = new Set();
let nextId = 1;

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function emit(type, message) {
  const t = { id: nextId++, type, message: String(message) };
  for (const fn of listeners) fn(t);
}

export const toast = {
  error:   (msg) => emit('error', msg),
  success: (msg) => emit('success', msg),
  info:    (msg) => emit('info', msg),
};

// Helper for the common "log + show toast" pattern in hooks.
export function reportError(label, error) {
  const msg = error?.message ?? String(error ?? 'unknown error');
  console.error(label, error);
  toast.error(`${label}: ${msg}`);
}
