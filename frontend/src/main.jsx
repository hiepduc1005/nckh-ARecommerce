import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { LoadingProvider } from "./contexts/LoadingProvider.jsx";
import { AuthProvider } from "./contexts/AuthProvider.jsx";
import CartProvider from "./contexts/CartProvider.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { initGA } from "./utils/analytics.js";
import { WishlistProvider } from "./hooks/UseWishList.jsx";

initGA();

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <GoogleOAuthProvider clientId="1098862947033-9mk5he5fek1e1b8ogtgovv1a1li3cu9i.apps.googleusercontent.com">
      <LoadingProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <App />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </LoadingProvider>
    </GoogleOAuthProvider>
  </BrowserRouter>
);
