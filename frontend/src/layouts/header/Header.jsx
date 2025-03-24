import React, { useState } from 'react'
import webicon from "../../assets/icons/webicon.png"
import searchIcon from "../../assets/icons/search-icon.png"


import './Header.scss'
import { Link } from 'react-router-dom'
import Topbar from '../../components/Topbar'
import useAuth from '../../hooks/UseAuth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping, faHeart } from '@fortawesome/free-solid-svg-icons'
import CartPopper from '../../components/CartPopper'
import WishListPopper from '../../components/WishListPopper'
import useCart from '../../hooks/UseCart'
const Header = () => {
  const {user,isAuthenticated,logout} = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishListOpen,setIsWishListOpen] = useState(false)
  
  const {cart} = useCart();

  const cartItemCount = 2; 

  // const cart = [
  //   {
  //     id: 1,
  //     name: "Khăn giấy gấu trúc Top Gia Sắc Hạ",
  //     price: 179000,
  //     image: "http://localhost:8080/uploads/8d2bbbec-d731-4855-a270-e94c4f554eef_giaoducqp.jpg"
  //   },
  //   {
  //     id: 2,
  //     name: "Bánh quy Oreo Chocolate 288g",
  //     price: 45000,
  //     image: "http://localhost:8080/uploads/8d2bbbec-d731-4855-a270-e94c4f554eef_giaoducqp.jpg", // Thay bằng ảnh thực tế
  //   },
  // ];

  const wishList = [
    {
      id: 1,
      name: "Khăn giấy gấu trúc Top Gia Sắc Hạ",
      price: 179000,
      image: "http://localhost:8080/uploads/8d2bbbec-d731-4855-a270-e94c4f554eef_giaoducqp.jpg"
    },
    {
      id: 2,
      name: "Bánh quy Oreo Chocolate 288g",
      price: 45000,
      image: "http://localhost:8080/uploads/8d2bbbec-d731-4855-a270-e94c4f554eef_giaoducqp.jpg", // Thay bằng ảnh thực tế
    },
  ];
  return (
    <>
      <Topbar 
        user = {user} 
        logout={logout} 
        isAuthenticated = {isAuthenticated} 
      />
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
              <Link 
                className="wishlist-icon" 
                to="/"
                onMouseEnter={() => setIsWishListOpen(true)}
                onMouseLeave={() => setIsWishListOpen(false)}
              >
                <FontAwesomeIcon style={{color: "white"}} icon={faHeart} size="lg" color="#ff3b30" />
                <WishListPopper wishList={wishList} isWishListOpen= {isWishListOpen}/>
              </Link>

              <Link 
                className="cart-icon" 
                to="/cart"
                onMouseEnter={() => setIsCartOpen(true)}
                onMouseLeave={() => setIsCartOpen(false)}
              >
                <FontAwesomeIcon style={{color: "white"}} icon={faCartShopping} size="lg" color="#207355" />
                {cart?.cartItemResponses.length > 0 && (
                    <span className="cart-badge">{cart?.cartItemResponses.length}</span>
                )}
                <CartPopper isCartOpen={isCartOpen} cart = {cart}/>
              </Link>
          </div>
      </header>
    </>
  )
}

export default Header