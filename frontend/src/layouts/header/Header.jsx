import React from 'react'
import webicon from "../../assets/icons/webicon.png"
import searchIcon from "../../assets/icons/search-icon.png"


import './Header.scss'
import { Link } from 'react-router-dom'
import Topbar from '../../components/Topbar'
import useAuth from '../../hooks/UseAuth'
const Header = () => {
  const {user,isAuthenticated} = useAuth();
  return (
    <>
      <Topbar user = {user} isAuthenticated = {isAuthenticated} />
      <header className='header-container'>
          <div className="header-left">
            <div className='webicon-container'>
              <img src={webicon}></img>
            </div>
            <Link className='navbar-link'>Kính Mắt</Link>
            <Link className='navbar-link'>Giày</Link>
            <Link className='navbar-link'>Thương Hiệu</Link>
          </div>
          <div className="header-right">
              <div className="header-search">
                <input 
                  placeholder='Tìm kiếm sản phẩm...'

                />
                <Link className="search-button">
                  <img  src={searchIcon}></img>
                </Link>
              </div>
             
          </div>
      </header>
    </>
  )
}

export default Header