import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../assets/styles/pages/ResetPassword.scss";

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const identifier = location.state?.identifier || "";
    
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
  
    useEffect(() => {
      if (!identifier) {
        navigate("/login");
      }
    }, [identifier, navigate]);
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (password !== confirmPassword) {
        setMessage("Mật khẩu xác nhận không khớp. Vui lòng thử lại.");
        return;
      }
  
      // Giả lập gọi API đặt lại mật khẩu
      setTimeout(() => {
        setMessage("Mật khẩu của bạn đã được đặt lại thành công!");
        setTimeout(() => navigate("/login"), 1500);
      }, 1500);
    };
  
    return (
      <div className="reset-password-container">
        <div className="reset-password-box">
          <h2>ĐẶT LẠI MẬT KHẨU</h2>
          <p>Nhập mật khẩu mới cho tài khoản: {identifier}</p>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="Nhập mật khẩu mới"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Xác nhận mật khẩu mới"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <div className="button-group">
              <button type="submit">Xác nhận</button>
            </div>
          </form>
          {message && <p className="message">{message}</p>}
        </div>
      </div>
    );
};
  
export default ResetPassword;
