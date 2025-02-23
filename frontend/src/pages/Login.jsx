import React, { useState } from 'react'
import "../assets/styles/pages/Login.scss"
import { FaEye, FaEyeSlash } from 'react-icons/fa'
const Login = () => {
  const [showPassword,setShowPassword] = useState(false)


  return (
    <div className="login-container">
      <div className="login-box">
        <h2>ĐĂNG NHẬP TÀI KHOẢN</h2>
        <form>
          <div className="input-group">
            <label htmlFor="username">Email / Số điện thoại / Tên đăng nhập</label>
            <input type="text" id="username" placeholder="Nhập Email/SĐT/tên đăng nhập" />
          </div>
          <div className="input-group password-group">
            <label htmlFor="password">Mật khẩu</label>
            <div className="input-wraper">
              <input 
                type={showPassword ? "text" : "password"} 
                id="password" 
                placeholder="Nhập mật khẩu" 
              />
              <span 
                className="toggle-password" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>
          <button type="submit" className="login-btn">ĐĂNG NHẬP</button>
        </form>
        <div className="login-options">
          <a href="/forgot-password">Bạn đã quên mật khẩu?</a>
          <span>Bạn chưa có tài khoản? <a href="/register">Tạo tài khoản ngay</a></span>
        </div>
      </div>
    </div>
  )
}

export default Login