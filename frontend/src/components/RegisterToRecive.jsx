import React from 'react'
import '../assets/styles/components/RegisterToRecive.scss'
const RegisterToRecive = () => {
  return (
    <div className="register-to-recive">
      <div className="container">
        <div className="title">ĐĂNG KÝ ĐỂ NHẬN THÔNG TIN, ƯU ĐÃI</div>
        <div className="input-container">
          <input type="email" placeholder="Nhập email của bạn tại đây" />
          <button>Gửi Ngay</button>
        </div>
      </div>
    </div>
  )
}

export default RegisterToRecive