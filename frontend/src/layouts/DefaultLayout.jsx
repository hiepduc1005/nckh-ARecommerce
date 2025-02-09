import React from 'react'
import Header from './header/Header'
import { Outlet } from 'react-router-dom'
import Footer from './footer/Footer'
import RegisterToRecive from '../components/RegisterToRecive'
import AdressFooter from '../components/AdressFooter'
import EnsureSafety from '../components/EnsureSafety'
import UserRate from '../components/UserRate'

const DefaultLayout = () => {
  return (
    <div>
        <Header></Header>
        <Outlet></Outlet>
        <UserRate/>
        <EnsureSafety/>
        <RegisterToRecive/>
        <Footer></Footer>
        <AdressFooter></AdressFooter>
    </div>
  )
}

export default DefaultLayout