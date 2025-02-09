import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Profile from '../pages/Profile'
import AuthLayout from '../layouts/AuthLayout'
import ProductLayout from '../layouts/ProductLayout'
import ProductList from '../pages/ProductList'
import ProductDetails from '../pages/ProductDetails'
import DefaultLayout from '../layouts/DefaultLayout'
import NotFound from '../pages/NotFound'

const AppRoutes = () => {
  return (
    <Routes>
        <Route path='/' element={<DefaultLayout/>} >
            <Route index element={<Home/>}/>
            <Route path='profile' element={<Profile/>}/>
        </Route>

        <Route path='/products' element={<ProductLayout/>} >
            <Route index element={<ProductList/>}/>
            <Route path=':productId' element={<ProductDetails/>}/>
        </Route>

        <Route element={<AuthLayout/>} >
            <Route path='login' element={<Login/>}/>
            <Route path='register' element={<Register/>}/>
        </Route>

        <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes