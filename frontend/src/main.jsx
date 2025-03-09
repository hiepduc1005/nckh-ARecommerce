import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import { LoadingProvider } from './contexts/LoadingProvider.jsx';
import { AuthProvider } from './contexts/AuthProvider.jsx';
import CartProvider from './contexts/CartProvider.jsx';

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <LoadingProvider>
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </LoadingProvider>
    </BrowserRouter>
)
