import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AuthGate from './components/AuthGate.jsx'
import ToastHost from './components/ToastHost.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthGate>
      <App />
    </AuthGate>
    <ToastHost />
  </StrictMode>,
)

// We used to register /sw.js here for offline support. The SW is now a
// self-unregistering stub (see public/sw.js). Don't re-register it.
