import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Profile from '../pages/Profile'
import AuthLayout from '../layouts/AuthLayout'
import ProductLayout from '../layouts/ProductLayout'
import ProductDetails from '../pages/ProductDetails'
import DefaultLayout from '../layouts/DefaultLayout'
import NotFound from '../pages/NotFound'
import ForgotPassword from '../pages/ForgotPassword'
import ResetPassword from '../pages/ResetPassword'
import SearchPage from '../pages/SearchPage'
import AdminLayout from '../layouts/AdminLayout'
import Dashboard from '../pages/Dashboard'
import AdminProduct from '../pages/AdminProduct'
import AdminProductVariants from '../pages/AdminProductVariants'
import AdminVariants from '../pages/AdminVariants'
import CartLayout from '../layouts/CartLayout'
import UserAccountLayout from '../layouts/UserAccountLayout'
import UserAddress from '../pages/UserAddress'
import AdminProductDetails from '../pages/AdminProductDetails'
import AdminCategory from '../pages/AdminCategory'

const AppRoutes = () => {
  return (
    <Routes>
        <Route path='/' element={<DefaultLayout/>} >
            <Route index element={<Home/>}/>
        </Route>

        <Route path='/cart' element={<CartLayout />}></Route>

        <Route path='/user' element={<UserAccountLayout />}>
          <Route index element={<Navigate to="profile" replace />} />
          <Route path='profile' element={<Profile/>}/>
          <Route path='address' element={<UserAddress/>}/>

        </Route>

        <Route path='/products' element={<ProductLayout/>} >
            <Route index element={<SearchPage/>}/>
            <Route path=':productId' element={<ProductDetails/>}/>
        </Route>

        <Route element={<AuthLayout/>} >
            <Route path='login' element={<Login/>}/>
            <Route path='register' element={<Register/>}/>
            <Route path='forgot-password' element={<ForgotPassword/>}/>
            <Route path='reset-password' element={<ResetPassword/>}/>
        </Route>

        <Route path='/admin' element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path='products' element={<AdminProduct/>} />
          <Route path='categories' element={<AdminCategory/>} />
          <Route path="products/:productId" element={<AdminProductDetails />}/>
          <Route path='variants' element={<AdminVariants />} />
        </Route>

        <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes