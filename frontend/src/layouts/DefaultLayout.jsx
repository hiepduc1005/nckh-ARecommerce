import React from 'react'
import Footer from './Footer'
import Header from './header/Header'
import { Outlet } from 'react-router-dom'

const DefaultLayout = () => {
  return (
    <div>
        <Header></Header>
        <Outlet></Outlet>
        <Footer></Footer>
    </div>
  )
}

export default DefaultLayout