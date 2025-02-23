
import { Bounce, ToastContainer } from 'react-toastify'
import './App.scss'
import AppRoutes from './routes/AppRoutes'

function App() {

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
  )
}

export default App
