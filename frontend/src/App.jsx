import { Bounce, ToastContainer } from "react-toastify";
import "./App.scss";
import AppRoutes from "./routes/AppRoutes";
import "bootstrap/dist/css/bootstrap.min.css";
import { usePageTracking } from "./hooks/UsePageTracking";

function App() {
  usePageTracking();

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
