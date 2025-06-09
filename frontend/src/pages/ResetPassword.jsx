import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../assets/styles/pages/ResetPassword.scss";
import { toast } from "react-toastify";
import { verifyResetPassword } from "../api/userApi";
import useQuery from "../hooks/useQuery";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const identifier = location.state?.identifier || "";
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = useQuery().get("t");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!identifier || !token) {
      navigate("/login");
    }
  }, [identifier, navigate, token]);

  useEffect(() => {
    document.title = "Đổi mật khẩu";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!password) {
      toast.error("Mật khẩu không được để trống!");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp. Vui lòng thử lại.");
      return;
    }

    const dataVerify = {
      token,
      newPassword: password,
    };

    const data = await verifyResetPassword(dataVerify);
    if (data) {
      toast.success(data?.message);
      setTimeout(() => navigate("/login"), 1000);
    } else {
      toast.error("Đổi mật khẩu thất bại");
    }
    setIsSubmitting(false);
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
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang xử lý..." : "Xác nhận"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
