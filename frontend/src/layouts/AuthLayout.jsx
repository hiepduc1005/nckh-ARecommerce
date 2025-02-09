import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './header/Header'
import Footer from './footer/Footer'
import RegisterToRecive from '../components/RegisterToRecive'

const AuthLayout = () => {
  return (
    <div>
        <Header/>
        <Outlet/>
        <RegisterToRecive/>
        <Footer/>
    </div>
  )
}

export default AuthLayout