import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import AdminSidebar from '../components/AdminSidebar'
import './AdminLayout.scss';
import useAuth from '../hooks/UseAuth';

const AdminLayout = () => {
  const {isAuthenticated,user} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if(isAuthenticated !== undefined && isAuthenticated === false){
      navigate("/login")
    }else if(isAuthenticated){
     
      if(!user?.roles?.some((role => role.roleName === "ADMIN"))){
        navigate("/")
      }
    }
  },[isAuthenticated,navigate])

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout