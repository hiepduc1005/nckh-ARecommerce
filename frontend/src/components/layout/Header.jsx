import React from 'react'
import './Header.css'
import facebookIcon from '../../assets/icon/fb_icon.png'
import íntagramIcon from '../../assets/icon/instagram-icon.png'
import tiktokIcon from '../../assets/icon/tiktok-icon.png'
import userIcon from '../../assets/icon/user-icon.png'
import hoTroIcon from '../../assets/icon/ho-tro-icon.png'
import bankIcon from '../../assets/icon/bank-icon.png'
import logoIcon from '../../assets/icon/Term-Logo-NCKH.png'
import searchIcon from '../../assets/icon/Search-icon.png'
import orderIcon from '../../assets/icon/donmua.png'
import thongbaoIcon from '../../assets/icon/thongbao.png'
import cartIcon from '../../assets/icon/giohang.png'


const Header = () => {
  return (
    <div className='header'>
        <div className='header-top'>
            <div className='header-top-left'>
                <div className='connect'>Kết nối</div>
                <div className='icon-left-container'>
                    <img src={facebookIcon}></img>
                </div>
                <div className='icon-left-container'>
                    <img src={íntagramIcon}></img>
                </div>
                <div className='icon-left-container'>
                    <img src={tiktokIcon}></img>
                </div>
            </div>
            <div className='header-top-right'>
                <div className='bank-manage'>
                    <div className='icon-right-container'>
                        <img src={bankIcon}></img>
                    </div>
                    <span>Quản lý thanh toán</span>
                </div>
                <div className='support'>
                    <div className='icon-right-container'>
                        <img src={hoTroIcon}></img>
                    </div>
                    <span>Hỗ trợ</span>
                </div>
                <div className='account'>
                    <div className='icon-right-container'>
                        <img src={userIcon}></img>
                    </div>
                    <span>Hiep Ducddddddddd</span>
                </div>
            </div>
        </div>
        <div className='header-bottom'>
            <div className='logo-container'>
                <img src={logoIcon}></img>
            </div>
            <div className='search-container'>
                <input 
                    type="text" 
                    className="search-input"
                    placeholder='Tìm kiếm sản phẩm'
                 />
                <button className="search-button">
                    <img src={searchIcon}></img>
                </button>
            </div>
            <div className='others'>
                <div className="carticon-container">
                    <img src={cartIcon}></img>
                </div>
                <div className="ordericon-container">
                    <img src={orderIcon}></img>
                </div>
                <div className="notificationicon-container">
                    <img src={thongbaoIcon}></img>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Header