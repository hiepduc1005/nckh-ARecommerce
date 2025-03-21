import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiBox, FiTag, FiLayers, FiBriefcase, FiMenu, FiX, FiList } from 'react-icons/fi';
import '../assets/styles/components/AdminSidebar.scss';

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: <FiHome />, path: '/admin' },
    { name: 'Products', icon: <FiBox />, path: '/admin/products' },
    { name: 'Brands', icon: <FiBriefcase />, path: '/admin/brands' },
    { name: 'Tags', icon: <FiTag />, path: '/admin/tags' },
    { name: 'Categories', icon: <FiLayers />, path: '/admin/categories' },
    { name: 'Attributes', icon: <FiList />, path: '/admin/attributes' },
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo">
            <span>A</span>
          </div>
          {!collapsed && <h2>Admin</h2>}
        </div>
        <button className="toggle-btn" onClick={toggleSidebar}>
          {collapsed ? <FiMenu size={12}/> : <FiX />}
        </button>
      </div>
      
      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <Link 
            to={item.path} 
            key={item.name}
            className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <div className="icon">{item.icon}</div>
            {!collapsed && <span>{item.name}</span>}
            {collapsed && <div className="tooltip">{item.name}</div>}
          </Link>
        ))}
      </div>
      
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar">AD</div>
          {!collapsed && (
            <div className="user-info">
              <h4>Admin User</h4>
              <p>admin@example.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;