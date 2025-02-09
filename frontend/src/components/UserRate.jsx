import React from 'react'
import '../assets/styles/components/UserRate.scss'
import defaultAvatar from "../assets/icons/defaultAvatar.png"
const UserRate = () => {
  return (
    <div className='userrate'>
        <div className="break-line"></div>
        <div className="title">ĐÁNH GIÁ TỪ NGƯỜI TIÊU DÙNG</div>
        <div className="userates">
            <div className="item">
                <div className="info">
                    <img src={defaultAvatar}></img>
                    <div className="username">Nguyen Van A</div>
                </div>
                <div className="content">Sản phẩm rất tốt</div>
            </div>
            <div className="item">
                <div className="info">
                    <img src={defaultAvatar}></img>
                    <div className="username">Nguyen Van A</div>
                </div>
                <div className="content">Sản phẩm rất tốt</div>
            </div>
            <div className="item">
                <div className="info">
                    <img src={defaultAvatar}></img>
                    <div className="username">Nguyen Van A</div>
                </div>
                <div className="content">Sản phẩm rất tốt</div>
            </div>
            <div className="item">
                <div className="info">
                    <img src={defaultAvatar}></img>
                    <div className="username">Nguyen Van A</div>
                </div>
                <div className="content">Sản phẩm rất tốt</div>
            </div>
            <div className="item">
                <div className="info">
                    <img src={defaultAvatar}></img>
                    <div className="username">Nguyen Van A</div>
                </div>
                <div className="content">Sản phẩm rất tốt</div>
            </div>
            <div className="item">
                <div className="info">
                    <img src={defaultAvatar}></img>
                    <div className="username">Nguyen Van A</div>
                </div>
                <div className="content">Sản phẩm rất tốt</div>
            </div>
        </div>
    </div>
  )
}

export default UserRate