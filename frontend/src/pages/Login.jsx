import React, { useEffect, useState } from 'react'
import "../assets/styles/pages/Login.scss"
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import useAuth from '../hooks/UseAuth'
import useLoading from '../hooks/UseLoading'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google'
import { googleLoginUser } from '../api/oauthApi'
import { generateCodeChallenge, generateCodeVerifier } from '../utils/ultils'
import { toast } from 'react-toastify'
const Login = () => {
  const [showPassword,setShowPassword] = useState(false)
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("")

  const navigate = useNavigate();
  const {isAuthenticated,login,loginGoogle} = useAuth();
  const {setLoading} = useLoading();

  useEffect(() => {
    if(isAuthenticated){
      setLoading(true);
      navigate("/")
     
    }
  },[isAuthenticated, navigate, setLoading])

  const handleSubmit = (e) => {
    e.preventDefault();

    login(email,password);

  }

  const handleGoogleLogin = async (credentialResponse) => {
    const credential = credentialResponse.credential;

    await loginGoogle(credential);

  }


  return (
    <div className="login-container">
      <div className="login-box">
        <h2>ĐĂNG NHẬP TÀI KHOẢN</h2>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="input-group">
            <label htmlFor="username">Email / Số điện thoại / Tên đăng nhập</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              id="username"
              placeholder="Nhập Email/SĐT/tên đăng nhập" 
            />
          </div>
          <div className="input-group password-group">
            <label htmlFor="password">Mật khẩu</label>
            <div className="input-wraper">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
        
        <GoogleLogin 
          onSuccess={(credentialResponse) => {
            handleGoogleLogin(credentialResponse);
          }}
          onError={() => {
            console.log("lỗi")
            toast.error("Đăng nhập bằng Google thất bại")
          }}
        />
        <div className="login-options">
          <a href="/forgot-password">Bạn đã quên mật khẩu?</a>
          <span>Bạn chưa có tài khoản? <a href="/register">Tạo tài khoản ngay</a></span>
        </div>
      </div>
    </div>
  )
}

export default Login