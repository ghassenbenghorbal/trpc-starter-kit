import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { NuqsAdapter } from 'nuqs/adapters/react'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NuqsAdapter>
    <App />
    </NuqsAdapter>
  </React.StrictMode>,
)
