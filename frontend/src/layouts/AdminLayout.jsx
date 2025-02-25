import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from '../components/AdminSidebar'

const AdminLayout = () => {
  
  return (
    <div style={{display: "flex",flexDirection: "row"}}>
        <AdminSidebar />
        <Outlet></Outlet>
    </div>
  )
}

export default AdminLayout