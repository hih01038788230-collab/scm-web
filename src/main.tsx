import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Legacy scaffold CSS is preserved but not loaded; MUI CssBaseline owns global styles.
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
