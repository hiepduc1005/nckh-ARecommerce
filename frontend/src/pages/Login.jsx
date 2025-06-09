import React, { useEffect, useState } from "react";
import "../assets/styles/pages/Login.scss";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useAuth from "../hooks/UseAuth";
import useLoading from "../hooks/UseLoading";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "@greatsumini/react-facebook-login";

import { toast } from "react-toastify";
import FacebookLoginButton from "../components/FacebookLoginButton";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { isAuthenticated, login, loginGoogle, loginFacebook } = useAuth();
  const { setLoading } = useLoading();

  useEffect(() => {
    document.title = "Đăng nhập";
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      navigate("/");
    }
  }, [isAuthenticated, navigate, setLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();

    login(email, password);
  };

  const handleGoogleLogin = async (credentialResponse) => {
    const credential = credentialResponse.credential;

    await loginGoogle(credential);
  };

  const handleFacebookLogin = async (data) => {
    const accessToken = data.accessToken;

    await loginFacebook(accessToken);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>ĐĂNG NHẬP TÀI KHOẢN</h2>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="input-group">
            <label htmlFor="username">
              Email / Số điện thoại / Tên đăng nhập
            </label>
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
                autoComplete
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>
          <button type="submit" className="login-btn">
            ĐĂNG NHẬP
          </button>
        </form>

        <div className="separator">
          <span>hoặc</span>
        </div>

        <div className="social-login">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              handleGoogleLogin(credentialResponse);
            }}
            onError={() => {
              console.log("lỗi");
              toast.error("Đăng nhập bằng Google thất bại");
            }}
            onClose={() => {
              console.log("Cửa sổ đăng nhập đã bị đóng");
              toast.info("Đăng nhập đã bị hủy");
            }}
            logo_alignment="center"
          />
          <FacebookLogin
            appId="667943549262562"
            onSuccess={(response) => {
              handleFacebookLogin(response);
            }}
            onFail={(error) => {
              console.log("Login Failed!", error);
              toast.error("Đăng nhập bằng Facebook thất bại");
            }}
            useRedirect={false}
            scope="public_profile,email"
            render={({ onClick }) => <FacebookLoginButton onClick={onClick} />}
          />
        </div>

        <div className="login-options">
          <a href="/forgot-password">Bạn đã quên mật khẩu?</a>
          <span>
            Bạn chưa có tài khoản? <a href="/register">Tạo tài khoản ngay</a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
