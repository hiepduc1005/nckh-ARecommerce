import React from 'react'
import webicon from "../../assets/icons/webicon.png"
import searchIcon from "../../assets/icons/search-icon.png"
import cartIcon from "../../assets/icons/giohang.png"
import loveListIcon from "../../assets/icons/heart-icon.png"

import './Header.scss'
import { Link } from 'react-router-dom'
const Header = () => {
  
  return (
    <div className='header-container'>
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
            <Link className="lovelist-icon">
              <img alt="Danh sách yêu thích"  title='Danh sách yêu thích' src={loveListIcon}></img>
            </Link>
            <Link className="cart-icon">
              <img alt='Giỏ hàng' title='Giỏ hàng' src={cartIcon}></img>
            </Link>
        </div>
    </div>
  )
}

export default Header