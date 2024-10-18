import './App.css'
import { BrowserRouter as Router,Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Layout from './components/layout/Layout'
import Homepage from './pages/Homepage'
import Profile from './pages/Profile'

function App() {

  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/signin" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Homepage />} />
            <Route path="account" element={<Profile />} />
          </Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App
