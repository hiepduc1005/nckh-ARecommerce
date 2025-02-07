import React from 'react'
import "../assets/styles/components/AdressFooter.scss"
import companyLogo from "../assets/icons/LogoNCKH.png"

const AdressFooter = () => {
  return (
    <div className='address-footer'>
      <div className="company">Công ty TNHH HHQTV VietNam</div>
      <img src={companyLogo}></img>
      <div className="address">Địa Chỉ: Số 42 Đ.Phú Diễn - Quận Bắc Từ Liêm - Thành phố Hà Nội, Việt Nam.</div>
      <div className="contact-info">Email: hhqtv.store@gmail.com - Hotline: 0987.456.321</div>
      <div className="copyright">© 2024 - Bản quyền thuộc về Công ty TNHH HHQTV Việt Nam</div>
    </div>
  )
}

export default AdressFooter