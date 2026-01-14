import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux';
import { store } from './redux/store.jsx';
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById('root')).render(
  <StrictMode>

    <Provider store={store}>
      <GoogleOAuthProvider clientId="98398123056-bnut37h17qm5qkr9ce6k8db13j15eu81.apps.googleusercontent.com">
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </GoogleOAuthProvider>
    </Provider>
  </StrictMode>,
)
