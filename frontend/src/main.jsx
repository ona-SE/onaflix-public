import React from 'react'
import ReactDOM from 'react-dom/client'
import * as Sentry from '@sentry/react'
import App from './App'
import './styles/index.css'

Sentry.init({
  dsn: 'https://e6a93e743baaae0a4d92f30257029027@o4510737672437760.ingest.de.sentry.io/4510902002319440',
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