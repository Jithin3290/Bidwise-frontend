import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'   // ✅ import provider
import { GoogleOAuthProvider } from '@react-oauth/google';


  
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId='98398123056-bnut37h17qm5qkr9ce6k8db13j15eu81.apps.googleusercontent.com'>
    <BrowserRouter>
      <AuthProvider>     {/* ✅ wrap your app here */}
        <App />
      </AuthProvider>
    </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>
)
