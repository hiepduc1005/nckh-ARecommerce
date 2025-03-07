import React from 'react'
import AdressFooter from '../components/AdressFooter'
import Footer from './footer/Footer'
import Header from './header/Header'
import CartPage from '../pages/CartPage'

const CartLayout = () => {
  return (
    <div>
        <Header></Header>
        <CartPage/>
        <Footer></Footer>
        <AdressFooter></AdressFooter>
    </div>
  )
}

export default CartLayout