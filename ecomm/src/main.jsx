import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './components/hooks/useAuthFile.jsx'
import { ServiceProvider } from './components/hooks/useServiceFile.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ServiceProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ServiceProvider>
  </StrictMode>,
)
