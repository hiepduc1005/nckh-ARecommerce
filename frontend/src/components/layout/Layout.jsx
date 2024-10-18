import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

const Layout = () => {
  return (
    <>
        <div className='header-container'>
            <Header></Header>
        </div>
        <div className='container'>
            <Outlet></Outlet>
        </div>
        <div className='footer-container'>
            <Footer></Footer>
        </div>
    </>
  )
}

export default Layout