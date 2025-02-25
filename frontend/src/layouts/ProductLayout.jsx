import React from 'react'
import Sidebar from '../components/AdminSidebar'
import { Outlet } from 'react-router-dom'
import Header from './header/Header'
import EnsureSafety from '../components/EnsureSafety'
import RegisterToRecive from '../components/RegisterToRecive'
import Footer from './footer/Footer'
import AdressFooter from '../components/AdressFooter'

const ProductLayout = () => {
  return (
    <div>
        <Header/>
        <Outlet/>
        <EnsureSafety/>
        <RegisterToRecive/>
        <Footer/>
        <AdressFooter/>
    </div>
  )
}

export default ProductLayout