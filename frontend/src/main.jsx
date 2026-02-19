import React from 'react'
import ReactDOM from 'react-dom/client'
import * as Sentry from '@sentry/react'
import App from './App'
import './styles/index.css'

Sentry.init({
  dsn: 'https://37c84dfdb5be15233e5c2d2518684ce8@o4509684240941056.ingest.us.sentry.io/4510912829718528',
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={<p>Something went wrong.</p>}>
      <App />
    </Sentry.ErrorBoundary>
  </React.StrictMode>
) 