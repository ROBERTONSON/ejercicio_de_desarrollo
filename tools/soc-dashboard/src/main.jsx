import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './App'
import './index.css'

// Context Providers
import { AuthProvider } from './contexts/AuthContext'
import { IncidentProvider } from './contexts/IncidentContext'
import { AuditProvider } from './contexts/AuditContext'

// Important Order: Audit -> Incident -> Auth -> Routes
// Incident needs Audit context to record logs.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuditProvider>
        <IncidentProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </IncidentProvider>
      </AuditProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
