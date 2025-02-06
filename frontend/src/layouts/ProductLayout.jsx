import React from 'react'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'

const ProductLayout = () => {
  return (
    <div>
        <Sidebar />

        <div>
            <Outlet/>
        </div>
    </div>
  )
}

export default ProductLayout