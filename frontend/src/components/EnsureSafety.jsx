import React from 'react'
import "../assets/styles/components/EnsureSafety.scss"
import protectIcon from "../assets/icons/protect-icon.png"
import deleveryIcon from "../assets/icons/delivery-van.png"
import returnIcon from "../assets/icons/return-product-icon.png"
import moneyBackIcon from "../assets/icons/money-back.png"
import guaranteeIcon from "../assets/icons/guarantee-icon.png"

const EnsureSafety = () => {
  return (
    <div className='ensure-safety'>
        <img src={protectIcon} alt="" className="protect-icon" />
        <div className="title">ĐẢM BẢO AN TOÀN</div>
        <div className="content">Chúng tôi cam kết, đảm bảo trải nghiệm mua sắm tốt nhất đến với khách hàng.</div>
        <div className="list-protect">
            <div className="item">
                <div className="title">NHANH, MIỄN PHÍ</div>
                <img src={deleveryIcon} alt="" />
            </div>
            <div className="item">
                <div className="title">TRẢ HÀNG, ĐỔI HÀNG TRONG VÒNG 14 NGÀY</div>
                <img src={returnIcon} alt="" />
            </div>
            <div className="item">
                <div className="title">ĐẢM BẢO HOÀN TIỀN 100% KHI TRẢ HÀNG</div>
                <img src={moneyBackIcon} alt="" />
            </div>
            <div className="item">
                <div className="title">BẢO HÀNH 6 THÁNG</div>
                <img src={guaranteeIcon} alt="" />
            </div>
        </div>
    </div>
  )
}

export default EnsureSafety