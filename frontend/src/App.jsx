import { Bounce, ToastContainer } from "react-toastify";
import "./App.scss";
import AppRoutes from "./routes/AppRoutes";
import "bootstrap/dist/css/bootstrap.min.css";
import { usePageTracking } from "./hooks/UsePageTracking";
import { generateSessionId } from "../src/utils/ultils";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
function App() {
  usePageTracking();

  useEffect(() => {
    let storedId = localStorage.getItem("session_id");
    if (!storedId) {
      storedId = generateSessionId();
      localStorage.setItem("session_id", storedId);
    }
  }, []);

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <AppRoutes />
    </>
  );
}

export default App;
