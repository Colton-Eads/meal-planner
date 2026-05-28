import { useEffect, useState } from 'react';
import { subscribe } from '../lib/toast';

const DURATION = { error: 6000, success: 3000, info: 3500 };

export default function ToastHost() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    return subscribe(t => {
      setToasts(prev => [...prev, t]);
      setTimeout(() => {
        setToasts(prev => prev.filter(x => x.id !== t.id));
      }, DURATION[t.type] ?? 3000);
    });
  }, []);

  if (toasts.length === 0) return null;

  const dismiss = (id) => setToasts(prev => prev.filter(x => x.id !== id));

  return (
    <div className="toast-host" role="status" aria-live="polite">
      {toasts.map(t => (
        <button
          key={t.id}
          className={`toast toast-${t.type}`}
          onClick={() => dismiss(t.id)}
          title="Click to dismiss"
        >
          {t.message}
        </button>
      ))}
    </div>
  );
}
